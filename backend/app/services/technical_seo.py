import json
from bs4 import BeautifulSoup
from urllib.parse import urlparse, urljoin
from typing import Dict, Any, List, Tuple
from app.models.analysis_models import (
    TechnicalSeoResult, MetaTags, HeadingStructure,
    ImageAudit, ImageAuditItem, LinkAudit, LinkAuditItem,
    StructuredDataAudit, StructuredDataItem
)
from app.services.crawler import CrawlResult

def analyze_technical_seo(crawl_res: CrawlResult, soup: BeautifulSoup) -> TechnicalSeoResult:
    """
    Analyzes technical SEO aspects of the crawled webpage.
    """
    checks: Dict[str, bool] = {}
    base_domain = urlparse(crawl_res.final_url).netloc.lower()

    # 1. Meta Tags Extraction
    meta_title = None
    if soup.title and soup.title.string:
        meta_title = soup.title.string.strip()
    elif soup.find("meta", property="og:title"):
        meta_title = soup.find("meta", property="og:title").get("content", "").strip()

    title_len = len(meta_title) if meta_title else 0
    checks["title_exists"] = bool(meta_title)
    checks["title_length_optimal"] = (30 <= title_len <= 65)

    # Meta Description
    meta_desc = None
    desc_tag = soup.find("meta", attrs={"name": lambda x: x and x.lower() == "description"})
    if not desc_tag:
        desc_tag = soup.find("meta", property="og:description")
    if desc_tag:
        meta_desc = desc_tag.get("content", "").strip()

    desc_len = len(meta_desc) if meta_desc else 0
    checks["description_exists"] = bool(meta_desc)
    checks["description_length_optimal"] = (120 <= desc_len <= 165)

    # Robots Meta
    robots_tag = soup.find("meta", attrs={"name": lambda x: x and x.lower() == "robots"})
    robots_content = robots_tag.get("content", "").strip().lower() if robots_tag else None
    checks["robots_noindex"] = bool(robots_content and "noindex" in robots_content)
    checks["robots_nofollow"] = bool(robots_content and "nofollow" in robots_content)

    # Canonical Link
    canonical_tag = soup.find("link", rel=lambda x: x and "canonical" in [r.lower() for r in (x if isinstance(x, list) else [x])])
    canonical_href = canonical_tag.get("href", "").strip() if canonical_tag else None
    checks["canonical_exists"] = bool(canonical_href)
    
    # Viewport & Charset
    viewport_tag = soup.find("meta", attrs={"name": lambda x: x and x.lower() == "viewport"})
    viewport_content = viewport_tag.get("content", "").strip() if viewport_tag else None
    checks["viewport_exists"] = bool(viewport_tag)

    charset_tag = soup.find("meta", charset=True) or soup.find("meta", attrs={"http-equiv": lambda x: x and x.lower() == "content-type"})
    charset_val = charset_tag.get("charset") if charset_tag and charset_tag.get("charset") else ("UTF-8" if charset_tag else None)
    checks["charset_exists"] = bool(charset_tag)

    # HTML Language
    html_tag = soup.find("html")
    lang_val = html_tag.get("lang") if html_tag and html_tag.get("lang") else None
    checks["lang_specified"] = bool(lang_val)

    # Author
    author_tag = soup.find("meta", attrs={"name": lambda x: x and x.lower() == "author"})
    author_val = author_tag.get("content") if author_tag else None

    # Open Graph & Twitter Cards
    og_dict = {}
    for tag in soup.find_all("meta", property=lambda x: x and x.startswith("og:")):
        prop = tag.get("property", "")
        content = tag.get("content", "")
        if prop and content:
            og_dict[prop] = content

    twitter_dict = {}
    for tag in soup.find_all("meta", attrs={"name": lambda x: x and x.startswith("twitter:")}):
        name = tag.get("name", "")
        content = tag.get("content", "")
        if name and content:
            twitter_dict[name] = content

    checks["has_opengraph"] = bool(og_dict.get("og:title") and (og_dict.get("og:image") or og_dict.get("og:description")))
    checks["has_twitter_card"] = bool(twitter_dict.get("twitter:card") or twitter_dict.get("twitter:title"))

    meta_info = MetaTags(
        title=meta_title,
        title_length=title_len,
        description=meta_desc,
        description_length=desc_len,
        robots=robots_content,
        canonical=canonical_href,
        viewport=viewport_content,
        charset=charset_val,
        language=lang_val,
        author=author_val,
        open_graph=og_dict,
        twitter_card=twitter_dict
    )

    # 2. Heading Structure
    h1s = [clean_heading(h.get_text()) for h in soup.find_all("h1") if clean_heading(h.get_text())]
    h2s = [clean_heading(h.get_text()) for h in soup.find_all("h2") if clean_heading(h.get_text())]
    h3s = [clean_heading(h.get_text()) for h in soup.find_all("h3") if clean_heading(h.get_text())]
    h4s = [clean_heading(h.get_text()) for h in soup.find_all("h4") if clean_heading(h.get_text())]
    h5s = [clean_heading(h.get_text()) for h in soup.find_all("h5") if clean_heading(h.get_text())]
    h6s = [clean_heading(h.get_text()) for h in soup.find_all("h6") if clean_heading(h.get_text())]

    heading_issues = []
    if len(h1s) == 0:
        heading_issues.append("Missing H1 tag on the page.")
    elif len(h1s) > 1:
        heading_issues.append(f"Multiple H1 tags found ({len(h1s)}). Standard SEO recommends exactly one H1 per page.")

    if len(h2s) == 0 and len(h1s) > 0:
        heading_issues.append("No H2 tags found to structure secondary sections.")

    checks["has_single_h1"] = (len(h1s) == 1)
    checks["has_h2_structure"] = (len(h2s) > 0)
    checks["headings_exist"] = (len(h1s) + len(h2s) + len(h3s) > 0)

    headings_info = HeadingStructure(
        h1_tags=h1s,
        h2_tags=h2s[:30], # limit samples for clean JSON
        h3_tags=h3s[:30],
        h4_tags=h4s[:15],
        h5_tags=h5s[:10],
        h6_tags=h6s[:10],
        h1_count=len(h1s),
        h2_count=len(h2s),
        h3_count=len(h3s),
        total_headings=len(h1s) + len(h2s) + len(h3s) + len(h4s) + len(h5s) + len(h6s),
        hierarchy_valid=(len(heading_issues) == 0),
        issues=heading_issues
    )

    # 3. Image Audit
    img_tags = soup.find_all("img")
    sample_images: List[ImageAuditItem] = []
    missing_alt_count = 0
    empty_alt_count = 0
    lazy_count = 0

    for img in img_tags:
        src = img.get("src") or img.get("data-src") or ""
        if not src:
            continue
        
        alt = img.get("alt")
        has_alt = (alt is not None)
        is_empty = (not alt or not alt.strip())
        is_lazy = (img.get("loading") == "lazy" or "lazy" in img.get("class", []))

        if not has_alt:
            missing_alt_count += 1
        elif is_empty:
            empty_alt_count += 1

        if is_lazy:
            lazy_count += 1

        if len(sample_images) < 25:
            sample_images.append(ImageAuditItem(
                src=src[:150],
                alt=alt[:100] if alt else None,
                has_alt=has_alt,
                is_empty_alt=is_empty,
                width=img.get("width"),
                height=img.get("height"),
                lazy_loaded=is_lazy
            ))

    total_images = len(img_tags)
    checks["all_images_have_alt"] = (total_images == 0 or (missing_alt_count + empty_alt_count == 0))
    checks["images_optimized"] = (total_images == 0 or missing_alt_count == 0)

    images_info = ImageAudit(
        total_images=total_images,
        images_with_alt=total_images - missing_alt_count - empty_alt_count,
        images_missing_alt=missing_alt_count + empty_alt_count,
        images_lazy_loaded=lazy_count,
        sample_images=sample_images
    )

    # 4. Link Audit
    a_tags = soup.find_all("a", href=True)
    sample_links: List[LinkAuditItem] = []
    internal_count = 0
    external_count = 0
    nofollow_count = 0
    empty_anchor_count = 0

    for a in a_tags:
        raw_href = a.get("href", "").strip()
        if not raw_href or raw_href.startswith(("#", "javascript:", "mailto:", "tel:")):
            continue

        full_href = urljoin(crawl_res.final_url, raw_href)
        link_domain = urlparse(full_href).netloc.lower()
        is_internal = (link_domain == base_domain or link_domain.endswith("." + base_domain))
        is_external = not is_internal

        rel_attr = a.get("rel", [])
        if isinstance(rel_attr, str):
            rel_attr = rel_attr.split()
        is_nofollow = any(r.lower() == "nofollow" for r in rel_attr)

        anchor_text = a.get_text().strip()
        is_empty_anchor = (len(anchor_text) == 0 and not a.find("img"))

        if is_internal:
            internal_count += 1
        else:
            external_count += 1

        if is_nofollow:
            nofollow_count += 1
        if is_empty_anchor:
            empty_anchor_count += 1

        if len(sample_links) < 30:
            sample_links.append(LinkAuditItem(
                href=full_href[:150],
                text=anchor_text[:80] if anchor_text else ("[Image Link]" if a.find("img") else "[Empty]"),
                is_internal=is_internal,
                is_external=is_external,
                is_nofollow=is_nofollow,
                is_empty_anchor=is_empty_anchor
            ))

    checks["has_internal_links"] = (internal_count > 0)
    checks["no_empty_anchors"] = (empty_anchor_count == 0)

    links_info = LinkAudit(
        total_links=len(a_tags),
        internal_links_count=internal_count,
        external_links_count=external_count,
        nofollow_links_count=nofollow_count,
        empty_anchor_count=empty_anchor_count,
        sample_links=sample_links
    )

    # 5. Structured Data / Schema.org Audit
    schema_types = []
    structured_items: List[StructuredDataItem] = []
    json_ld_scripts = soup.find_all("script", type="application/ld+json")
    has_json_ld = bool(json_ld_scripts)

    for script in json_ld_scripts:
        if script.string:
            try:
                data = json.loads(script.string.strip())
                extract_schemas_from_jsonld(data, schema_types, structured_items)
            except Exception:
                pass

    microdata_elements = soup.find_all(attrs={"itemtype": True})
    has_microdata = bool(microdata_elements)
    for elem in microdata_elements:
        itype = elem.get("itemtype", "")
        type_name = itype.split("/")[-1].strip()
        if type_name and type_name not in schema_types:
            schema_types.append(type_name)
            structured_items.append(StructuredDataItem(schema_type=type_name, data={"itemtype": itype}))

    checks["has_structured_data"] = (len(schema_types) > 0)

    structured_data_info = StructuredDataAudit(
        has_json_ld=has_json_ld,
        has_microdata=has_microdata,
        schema_types=list(set(schema_types)),
        items=structured_items[:10]
    )

    # 6. Security Headers
    headers_lower = {k.lower(): v for k, v in crawl_res.headers.items()}
    security_headers = {
        "hsts": "strict-transport-security" in headers_lower,
        "x_content_type_options": "x-content-type-options" in headers_lower,
        "x_frame_options": "x-frame-options" in headers_lower,
        "content_security_policy": "content-security-policy" in headers_lower
    }
    checks["https_enabled"] = crawl_res.is_https
    checks["fast_response"] = (crawl_res.response_time_ms < 1500)

    # 7. Calculate Technical SEO Score (0-100)
    tech_score = calculate_technical_score(checks, crawl_res, headings_info, images_info, links_info)

    return TechnicalSeoResult(
        score=tech_score,
        is_https=crawl_res.is_https,
        status_code=crawl_res.status_code,
        response_time_ms=crawl_res.response_time_ms,
        page_size_kb=crawl_res.page_size_kb,
        redirect_count=max(0, len(crawl_res.redirect_chain) - 1),
        redirect_chain=crawl_res.redirect_chain,
        meta=meta_info,
        headings=headings_info,
        images=images_info,
        links=links_info,
        structured_data=structured_data_info,
        security_headers=security_headers,
        checks=checks
    )

def clean_heading(text: str) -> str:
    if not text:
        return ""
    import re
    return re.sub(r'\s+', ' ', text).strip()

def extract_schemas_from_jsonld(data: Any, schema_types: List[str], structured_items: List[StructuredDataItem]):
    if isinstance(data, list):
        for item in data:
            extract_schemas_from_jsonld(item, schema_types, structured_items)
    elif isinstance(data, dict):
        stype = data.get("@type")
        if stype:
            types = [stype] if isinstance(stype, str) else stype
            for t in types:
                if t not in schema_types:
                    schema_types.append(str(t))
                if len(structured_items) < 10:
                    structured_items.append(StructuredDataItem(schema_type=str(t), data={k: v for k, v in data.items() if k not in ["@context"]}))
        
        # Check nested @graph
        if "@graph" in data:
            extract_schemas_from_jsonld(data["@graph"], schema_types, structured_items)

def calculate_technical_score(
    checks: Dict[str, bool],
    crawl_res: CrawlResult,
    headings: HeadingStructure,
    images: ImageAudit,
    links: LinkAudit
) -> int:
    score = 100

    # Penalties
    if not crawl_res.is_https:
        score -= 20
    if not checks.get("title_exists"):
        score -= 20
    elif not checks.get("title_length_optimal"):
        score -= 5

    if not checks.get("description_exists"):
        score -= 15
    elif not checks.get("description_length_optimal"):
        score -= 5

    if not checks.get("viewport_exists"):
        score -= 10

    if not checks.get("has_single_h1"):
        score -= 10

    if not checks.get("canonical_exists"):
        score -= 5

    if checks.get("robots_noindex"):
        score -= 25 # Crucial discoverability blocker

    if images.total_images > 0:
        missing_ratio = images.images_missing_alt / images.total_images
        if missing_ratio > 0.5:
            score -= 10
        elif missing_ratio > 0:
            score -= 5

    if not checks.get("has_structured_data"):
        score -= 5

    if crawl_res.response_time_ms > 2500:
        score -= 10
    elif crawl_res.response_time_ms > 1500:
        score -= 5

    return max(10, min(100, score))
