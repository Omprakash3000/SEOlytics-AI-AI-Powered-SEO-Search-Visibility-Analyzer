from bs4 import BeautifulSoup
from urllib.parse import urlparse
from typing import Dict, Any, List
from app.models.analysis_models import OnPageSeoResult, TechnicalSeoResult, ContentAnalysisResult

def analyze_onpage_seo(
    soup: BeautifulSoup,
    url: str,
    technical: TechnicalSeoResult,
    content: ContentAnalysisResult
) -> OnPageSeoResult:
    """
    Evaluates on-page optimization factors including title/desc length bounds, semantic HTML, and URL structure.
    """
    checks = {}

    # 1. Title Analysis
    title = technical.meta.title or ""
    t_len = len(title)
    if not title:
        title_status = "Missing"
        checks["title_optimal"] = False
    elif t_len < 30:
        title_status = f"Too Short ({t_len} chars - Recommended: 30-65)"
        checks["title_optimal"] = False
    elif t_len > 65:
        title_status = f"Too Long ({t_len} chars - May get truncated on Google)"
        checks["title_optimal"] = False
    else:
        title_status = f"Optimal ({t_len} chars)"
        checks["title_optimal"] = True

    # 2. Description Analysis
    desc = technical.meta.description or ""
    d_len = len(desc)
    if not desc:
        desc_status = "Missing"
        checks["description_optimal"] = False
    elif d_len < 100:
        desc_status = f"Too Short ({d_len} chars - Recommended: 120-165)"
        checks["description_optimal"] = False
    elif d_len > 165:
        desc_status = f"Too Long ({d_len} chars - Will be truncated in SERP)"
        checks["description_optimal"] = False
    else:
        desc_status = f"Optimal ({d_len} chars)"
        checks["description_optimal"] = True

    # 3. URL Structure Analysis
    parsed_url = urlparse(url)
    path = parsed_url.path.strip("/")
    url_issues = []
    if len(path) > 80:
        url_issues.append("URL path is unusually long.")
    if "_" in path:
        url_issues.append("URL uses underscores instead of search-engine preferred hyphens (-).")
    if any(c.isupper() for c in path):
        url_issues.append("URL contains uppercase letters; lowercase URLs are standard.")
    if "%20" in path or " " in path:
        url_issues.append("URL contains spaces or encoded %20 characters.")

    url_slug_info = {
        "path": path,
        "is_clean": len(url_issues) == 0,
        "length": len(url),
        "issues": url_issues
    }
    checks["url_structure_clean"] = (len(url_issues) == 0)

    # 4. H1 Optimization
    h1_count = technical.headings.h1_count
    if h1_count == 0:
        h1_status = "Missing H1"
        checks["h1_optimal"] = False
    elif h1_count > 1:
        h1_status = f"Multiple H1 tags ({h1_count})"
        checks["h1_optimal"] = False
    else:
        h1_text = technical.headings.h1_tags[0] if technical.headings.h1_tags else ""
        if len(h1_text) < 10:
            h1_status = "H1 is very short"
            checks["h1_optimal"] = False
        elif len(h1_text) > 70:
            h1_status = "H1 is very long"
            checks["h1_optimal"] = False
        else:
            h1_status = "Optimal"
            checks["h1_optimal"] = True

    # 5. Semantic HTML Tags
    semantic_tags = ["header", "main", "article", "section", "nav", "footer", "aside"]
    found_semantics = [tag for tag in semantic_tags if soup.find(tag)]
    checks["has_semantic_html"] = (len(found_semantics) >= 2)

    # 6. Favicon
    favicon_tag = soup.find("link", rel=lambda x: x and any(f in [r.lower() for r in (x if isinstance(x, list) else [x])] for f in ["icon", "shortcut icon"]))
    has_favicon = bool(favicon_tag)
    checks["has_favicon"] = has_favicon

    # 7. Calculate On-Page Score
    onpage_score = 100
    if not checks["title_optimal"]:
        onpage_score -= 20 if not title else 8
    if not checks["description_optimal"]:
        onpage_score -= 20 if not desc else 8
    if not checks["h1_optimal"]:
        onpage_score -= 15
    if not checks["url_structure_clean"]:
        onpage_score -= 10
    if not checks["has_semantic_html"]:
        onpage_score -= 10
    if not checks["has_favicon"]:
        onpage_score -= 5

    onpage_score = max(15, min(100, onpage_score))

    return OnPageSeoResult(
        score=onpage_score,
        title_status=title_status,
        description_status=desc_status,
        url_slug_analysis=url_slug_info,
        h1_optimization=h1_status,
        keyword_presence_summary={},
        semantic_tags_found=found_semantics,
        has_favicon=has_favicon,
        checks=checks
    )
