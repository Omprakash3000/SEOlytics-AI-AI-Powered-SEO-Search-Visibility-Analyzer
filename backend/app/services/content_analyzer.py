import re
from bs4 import BeautifulSoup
from typing import Dict, Any, Tuple
from app.models.analysis_models import ContentAnalysisResult
from app.utils.text_processing import clean_text, tokenize, calculate_reading_ease

def analyze_content_quality(html: str, soup: BeautifulSoup) -> ContentAnalysisResult:
    """
    Analyzes visible page content for depth, readability, sentence length, and quality indicators.
    """
    # Clone soup and strip non-content elements
    content_soup = BeautifulSoup(str(soup), "html.parser")
    for tag in content_soup(["script", "style", "noscript", "svg", "header", "footer", "nav", "aside"]):
        tag.decompose()

    visible_text = content_soup.get_text(separator=" ")
    visible_text = clean_text(visible_text)

    # Word & Sentence extraction
    words = tokenize(visible_text)
    total_words = len(words)

    # Paragraph extraction
    paragraphs = [clean_text(p.get_text()) for p in soup.find_all("p") if len(clean_text(p.get_text())) > 25]
    paragraph_count = len(paragraphs)

    # Sentence count
    raw_sentences = re.split(r'[.!?]+(?:\s+|$)', visible_text)
    valid_sentences = [s.strip() for s in raw_sentences if len(s.strip().split()) >= 3]
    sentence_count = max(1, len(valid_sentences))

    avg_sentence_len = round(total_words / sentence_count, 1) if sentence_count > 0 else 0.0

    # Reading ease
    reading_score, reading_level = calculate_reading_ease(visible_text, total_words, sentence_count)

    # Text-to-HTML ratio
    total_html_len = len(html) if html else 1
    visible_text_len = len(visible_text)
    text_to_html_ratio = round((visible_text_len / total_html_len) * 100, 2)

    # Content status
    if total_words < 300:
        content_status = "Thin Content"
    elif total_words < 900:
        content_status = "Adequate Content"
    else:
        content_status = "In-Depth Content"

    # Checks dictionary
    checks: Dict[str, bool] = {
        "sufficient_word_count": (total_words >= 300),
        "in_depth_content": (total_words >= 900),
        "good_paragraph_structure": (paragraph_count >= 3 or total_words < 300),
        "readable_sentence_length": (10 <= avg_sentence_len <= 25),
        "flesch_reading_score_good": (reading_score >= 50),
        "healthy_text_html_ratio": (text_to_html_ratio >= 10.0)
    }

    # Score calculation
    score = 100
    if total_words < 150:
        score -= 40
    elif total_words < 300:
        score -= 25
    elif total_words < 600:
        score -= 10

    if avg_sentence_len > 30:
        score -= 15 # Run-on sentences
    elif avg_sentence_len < 6 and total_words > 200:
        score -= 10

    if reading_score < 40:
        score -= 15
    elif reading_score < 50:
        score -= 5

    if paragraph_count < 2 and total_words > 300:
        score -= 10

    if text_to_html_ratio < 5.0:
        score -= 10

    content_score = max(15, min(100, score))

    return ContentAnalysisResult(
        score=content_score,
        word_count=total_words,
        sentence_count=sentence_count,
        paragraph_count=paragraph_count,
        avg_sentence_length=avg_sentence_len,
        reading_ease_score=reading_score,
        reading_level=reading_level,
        content_status=content_status,
        top_repeated_phrases=[],
        text_to_html_ratio=text_to_html_ratio,
        checks=checks
    )
