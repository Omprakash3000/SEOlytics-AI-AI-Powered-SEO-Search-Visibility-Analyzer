import re
from collections import Counter
from bs4 import BeautifulSoup
from typing import List, Dict, Any, Optional
from urllib.parse import urlparse
from app.models.analysis_models import (
    KeywordAnalysisResult, KeywordItem, KeywordLocationCheck
)
from app.utils.text_processing import (
    clean_text, tokenize, extract_ngrams, STOPWORDS
)

def analyze_keywords(
    soup: BeautifulSoup,
    url: str,
    custom_target_keywords: Optional[List[str]] = None
) -> KeywordAnalysisResult:
    """
    Extracts top 1-gram, 2-gram, and 3-gram keywords, computes density and checks placements across HTML tags.
    """
    # Clone soup and extract text zones
    content_soup = BeautifulSoup(str(soup), "html.parser")
    for tag in content_soup(["script", "style", "noscript", "svg"]):
        tag.decompose()

    full_text = clean_text(content_soup.get_text(separator=" "))
    words = tokenize(full_text)
    total_words = max(1, len(words))

    # Zones to check
    title_text = (soup.title.string.strip().lower()) if (soup.title and soup.title.string) else ""
    
    desc_tag = soup.find("meta", attrs={"name": lambda x: x and x.lower() == "description"})
    desc_text = desc_tag.get("content", "").strip().lower() if desc_tag else ""

    h1_texts = " ".join([h.get_text().strip().lower() for h in soup.find_all("h1")])
    h2_texts = " ".join([h.get_text().strip().lower() for h in soup.find_all("h2")])

    parsed_url = urlparse(url)
    url_slug_text = (parsed_url.path + " " + parsed_url.query).lower()

    first_p = soup.find("p")
    first_p_text = first_p.get_text().strip().lower() if first_p else ""

    alt_texts = " ".join([img.get("alt", "").strip().lower() for img in soup.find_all("img") if img.get("alt")])

    def check_locations(kw: str) -> KeywordLocationCheck:
        kw_l = kw.lower()
        # Word boundary match regex
        pattern = r'\b' + re.escape(kw_l) + r'\b'
        return KeywordLocationCheck(
            in_title=bool(re.search(pattern, title_text)),
            in_meta_description=bool(re.search(pattern, desc_text)),
            in_h1=bool(re.search(pattern, h1_texts)),
            in_h2=bool(re.search(pattern, h2_texts)),
            in_url=bool(kw_l in url_slug_text),
            in_first_paragraph=bool(re.search(pattern, first_p_text)),
            in_image_alt=bool(re.search(pattern, alt_texts))
        )

    # 1-grams (filtered)
    one_grams = extract_ngrams(words, 1)
    one_counts = Counter(one_grams)

    primary_keywords: List[KeywordItem] = []
    for kw, count in one_counts.most_common(12):
        if count >= 2 or len(words) < 100:
            density = round((count / total_words) * 100, 2)
            locs = check_locations(kw)
            primary_keywords.append(KeywordItem(
                keyword=kw,
                frequency=count,
                density_percent=density,
                ngram_type=1,
                locations=locs
            ))

    # 2-grams
    two_grams = extract_ngrams(words, 2)
    two_counts = Counter(two_grams)

    two_word_phrases: List[KeywordItem] = []
    for kw, count in two_counts.most_common(10):
        if count >= 2 or len(words) < 150:
            density = round(((count * 2) / total_words) * 100, 2)
            locs = check_locations(kw)
            two_word_phrases.append(KeywordItem(
                keyword=kw,
                frequency=count,
                density_percent=density,
                ngram_type=2,
                locations=locs
            ))

    # 3-grams
    three_grams = extract_ngrams(words, 3)
    three_counts = Counter(three_grams)

    three_word_phrases: List[KeywordItem] = []
    for kw, count in three_counts.most_common(8):
        if count >= 2 or len(words) < 200:
            density = round(((count * 3) / total_words) * 100, 2)
            locs = check_locations(kw)
            three_word_phrases.append(KeywordItem(
                keyword=kw,
                frequency=count,
                density_percent=density,
                ngram_type=3,
                locations=locs
            ))

    # Target keywords audit if specified
    target_audit: List[Dict[str, Any]] = []
    if custom_target_keywords:
        for t_kw in custom_target_keywords:
            clean_t = t_kw.strip().lower()
            if clean_t:
                matches = len(re.findall(r'\b' + re.escape(clean_t) + r'\b', full_text.lower()))
                locs = check_locations(clean_t)
                target_audit.append({
                    "keyword": clean_t,
                    "frequency": matches,
                    "density_percent": round((matches * len(clean_t.split()) / total_words) * 100, 2),
                    "locations": locs.dict()
                })

    # Keyword Checks & Scoring
    checks: Dict[str, bool] = {
        "has_primary_keywords": len(primary_keywords) > 0,
        "primary_keyword_in_title": any(k.locations.in_title for k in primary_keywords[:3]),
        "primary_keyword_in_h1": any(k.locations.in_h1 for k in primary_keywords[:3]),
        "keyword_in_meta_desc": any(k.locations.in_meta_description for k in primary_keywords[:3]),
        "keyword_in_first_p": any(k.locations.in_first_paragraph for k in primary_keywords[:3]),
        "no_keyword_stuffing": not any(k.density_percent > 4.5 for k in primary_keywords)
    }

    score = 75 # Base baseline
    if checks["primary_keyword_in_title"]:
        score += 10
    else:
        score -= 10

    if checks["primary_keyword_in_h1"]:
        score += 10
    else:
        score -= 5

    if checks["keyword_in_meta_desc"]:
        score += 5
    
    if checks["keyword_in_first_p"]:
        score += 5

    if not checks["no_keyword_stuffing"]:
        score -= 20

    keyword_score = max(20, min(100, score))

    return KeywordAnalysisResult(
        score=keyword_score,
        total_keywords_extracted=len(primary_keywords) + len(two_word_phrases) + len(three_word_phrases),
        primary_keywords=primary_keywords,
        two_word_phrases=two_word_phrases,
        three_word_phrases=three_word_phrases,
        target_keyword_audit=target_audit,
        checks=checks
    )
