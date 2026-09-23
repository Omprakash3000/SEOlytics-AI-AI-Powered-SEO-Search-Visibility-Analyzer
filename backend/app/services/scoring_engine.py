from typing import List, Tuple, Dict, Any
from app.models.analysis_models import (
    TechnicalSeoResult, OnPageSeoResult, ContentAnalysisResult,
    KeywordAnalysisResult, ProductSeoResult, ScoreBreakdown, IssueItem
)

def calculate_overall_scores(
    technical: TechnicalSeoResult,
    onpage: OnPageSeoResult,
    content: ContentAnalysisResult,
    keywords: KeywordAnalysisResult,
    product: ProductSeoResult
) -> Tuple[ScoreBreakdown, List[IssueItem]]:
    """
    Computes weighted 0-100 overall score and extracts all Critical, Warning, and Passed issues.
    Weights:
    - Technical: 25%
    - On-Page: 25%
    - Content Quality: 20%
    - Keyword Optimization: 15%
    - Performance / Response Time: 10%
    - Social / Structured Data: 5%
    """
    # Performance score derived from response time and page weight
    perf_score = 100
    if technical.response_time_ms > 3500:
        perf_score -= 50
    elif technical.response_time_ms > 2000:
        perf_score -= 30
    elif technical.response_time_ms > 1200:
        perf_score -= 15

    if technical.page_size_kb > 3000:
        perf_score -= 20
    elif technical.page_size_kb > 1500:
        perf_score -= 10
    perf_score = max(20, min(100, perf_score))

    # Social & Structured Data score
    social_score = 50
    if technical.meta.open_graph:
        social_score += 25
    if technical.structured_data.has_json_ld or technical.structured_data.has_microdata:
        social_score += 25
    social_score = max(20, min(100, social_score))

    # Overall calculation
    overall = (
        (technical.score * 0.25) +
        (onpage.score * 0.25) +
        (content.score * 0.20) +
        (keywords.score * 0.15) +
        (perf_score * 0.10) +
        (social_score * 0.05)
    )
    overall_score = int(round(max(10, min(100, overall))))

    breakdown = ScoreBreakdown(
        overall_score=overall_score,
        technical_score=technical.score,
        onpage_score=onpage.score,
        content_score=content.score,
        keyword_score=keywords.score,
        performance_score=perf_score,
        social_schema_score=social_score,
        product_score=product.score if product.is_product_page else None
    )

    # 2. Extract and Categorize Issues
    issues: List[IssueItem] = []

    # --- TECHNICAL / SECURITY ---
    if not technical.is_https:
        issues.append(IssueItem(
            id="crit-https",
            category="Technical SEO",
            severity="critical",
            title="Insecure Connection (HTTP)",
            problem="The webpage is served over plain HTTP rather than encrypted HTTPS.",
            why_it_matters="HTTPS is a confirmed Google ranking signal and essential for user security and browser trust.",
            recommendation="Install an SSL/TLS certificate (e.g., via Let's Encrypt or Cloudflare) and enforce HTTPS 301 redirects."
        ))
    else:
        issues.append(IssueItem(
            id="pass-https",
            category="Technical SEO",
            severity="passed",
            title="Secure HTTPS Protocol Active",
            problem="None",
            why_it_matters="Secures communication and satisfies Google HTTPS ranking criteria.",
            recommendation="Maintain valid SSL certificates and ensure HSTS headers are enabled."
        ))

    if technical.checks.get("robots_noindex"):
        issues.append(IssueItem(
            id="crit-noindex",
            category="Technical SEO",
            severity="critical",
            title="Search Engine Indexing Blocked (noindex)",
            problem="The page contains a 'noindex' robots meta directive.",
            why_it_matters="Search engines like Google will NOT index or display this page in search results.",
            recommendation="Remove the <meta name='robots' content='noindex'> tag if you intend for this page to receive organic traffic."
        ))

    if not technical.meta.title:
        issues.append(IssueItem(
            id="crit-title-missing",
            category="On-Page SEO",
            severity="critical",
            title="Missing Page Title Tag",
            problem="No <title> tag was detected in the document head.",
            why_it_matters="The page title is the primary anchor of search snippets and one of the highest weighted on-page SEO signals.",
            recommendation="Add a descriptive <title> tag (50-60 characters) containing the primary keyword."
        ))
    elif not (30 <= technical.meta.title_length <= 65):
        issues.append(IssueItem(
            id="warn-title-length",
            category="On-Page SEO",
            severity="warning",
            title=f"Suboptimal Title Tag Length ({technical.meta.title_length} characters)",
            problem=f"The current title is {technical.meta.title_length} characters. Optimal length is between 30 and 65 characters.",
            why_it_matters="Titles that are too long get cut off in Google SERPs with ellipsis ('...'), whereas very short titles underutilize keyword opportunities.",
            recommendation="Refine the title length to between 50 and 60 characters with your main target keyword positioned near the beginning."
        ))
    else:
        issues.append(IssueItem(
            id="pass-title",
            category="On-Page SEO",
            severity="passed",
            title=f"Optimal Title Tag Length ({technical.meta.title_length} chars)",
            problem="None",
            why_it_matters="Ensures complete display across mobile and desktop search result snippets.",
            recommendation="Keep monitoring click-through rates (CTR) and keyword relevancy."
        ))

    if not technical.meta.description:
        issues.append(IssueItem(
            id="warn-meta-desc-missing",
            category="On-Page SEO",
            severity="warning",
            title="Missing Meta Description",
            problem="No meta description tag was found on the page.",
            why_it_matters="Without a custom description, search engines generate automated snippets which often lower organic click-through rates.",
            recommendation="Add a compelling 120-160 character meta description highlighting the page's unique value proposition and primary keyword."
        ))
    elif not (100 <= technical.meta.description_length <= 165):
        issues.append(IssueItem(
            id="warn-meta-desc-length",
            category="On-Page SEO",
            severity="warning",
            title=f"Suboptimal Meta Description Length ({technical.meta.description_length} characters)",
            problem=f"Meta description is {technical.meta.description_length} characters long (Target: 120-160).",
            why_it_matters="Descriptions over 160 characters will truncate in Google, while very short descriptions miss out on persuading searchers to click.",
            recommendation="Write a concise meta description between 130 and 155 characters that includes a strong call to action."
        ))
    else:
        issues.append(IssueItem(
            id="pass-meta-desc",
            category="On-Page SEO",
            severity="passed",
            title=f"Optimized Meta Description ({technical.meta.description_length} chars)",
            problem="None",
            why_it_matters="Provides an enticing and accurately formatted preview in search results.",
            recommendation="Periodically test new hooks to optimize organic click-through rate."
        ))

    # --- HEADINGS ---
    if technical.headings.h1_count == 0:
        issues.append(IssueItem(
            id="crit-h1-missing",
            category="On-Page SEO",
            severity="critical",
            title="Missing H1 Heading Tag",
            problem="No <h1> tag was found on this webpage.",
            why_it_matters="H1 tags communicate the primary topic of the page to search engine crawlers and users.",
            recommendation="Add exactly one clear, keyword-rich <h1> heading at the top of the main content area."
        ))
    elif technical.headings.h1_count > 1:
        issues.append(IssueItem(
            id="warn-h1-multiple",
            category="On-Page SEO",
            severity="warning",
            title=f"Multiple H1 Tags Found ({technical.headings.h1_count} tags)",
            problem=f"Found {technical.headings.h1_count} separate <h1> elements.",
            why_it_matters="Having multiple H1 tags can dilute topic focus and confuse search bots regarding the main theme.",
            recommendation="Reserve <h1> for the main title and use <h2> or <h3> for section subtitles."
        ))
    else:
        issues.append(IssueItem(
            id="pass-h1",
            category="On-Page SEO",
            severity="passed",
            title="Single H1 Tag Present",
            problem="None",
            why_it_matters="Establishes a clear semantic document hierarchy.",
            recommendation="Ensure the H1 text incorporates the core topic or product name."
        ))

    # --- IMAGES ---
    if technical.images.images_missing_alt > 0:
        issues.append(IssueItem(
            id="warn-images-alt",
            category="Technical SEO",
            severity="warning",
            title=f"{technical.images.images_missing_alt} Images Missing Alt Text",
            problem=f"{technical.images.images_missing_alt} out of {technical.images.total_images} images lack descriptive 'alt' attributes.",
            why_it_matters="Missing alt attributes harm screen-reader accessibility and prevent images from ranking in Google Image Search.",
            recommendation="Add descriptive, keyword-relevant alt attributes to all content-bearing images."
        ))
    elif technical.images.total_images > 0:
        issues.append(IssueItem(
            id="pass-images-alt",
            category="Technical SEO",
            severity="passed",
            title="All Images Have Alt Attributes",
            problem="None",
            why_it_matters="Maximizes image search visibility and web accessibility standards.",
            recommendation="Maintain this practice for all future image uploads."
        ))

    # --- CANONICAL ---
    if not technical.meta.canonical:
        issues.append(IssueItem(
            id="warn-canonical-missing",
            category="Technical SEO",
            severity="warning",
            title="Missing Canonical Tag",
            problem="No <link rel='canonical'> tag was specified.",
            why_it_matters="Canonical tags prevent duplicate content issues when URLs have URL parameters or multiple pathways.",
            recommendation="Add a self-referencing <link rel='canonical' href='https://...'> tag."
        ))
    else:
        issues.append(IssueItem(
            id="pass-canonical",
            category="Technical SEO",
            severity="passed",
            title="Canonical URL Specified",
            problem="None",
            why_it_matters="Explicitly tells search engines the preferred master URL for indexing.",
            recommendation="Verify canonical URLs match protocol and trailing slash standards."
        ))

    # --- STRUCTURED DATA ---
    if not technical.structured_data.has_json_ld and not technical.structured_data.has_microdata:
        issues.append(IssueItem(
            id="warn-schema-missing",
            category="Technical SEO",
            severity="warning",
            title="No Schema.org Structured Data Detected",
            problem="No JSON-LD or Microdata structured data found on the page.",
            why_it_matters="Structured data enables Google Rich Results (star ratings, prices, FAQs, breadcrumbs) which boost visibility.",
            recommendation="Implement JSON-LD Schema (e.g. WebSite, Organization, Article, or Product schema)."
        ))
    else:
        issues.append(IssueItem(
            id="pass-schema",
            category="Technical SEO",
            severity="passed",
            title=f"Structured Data Found ({', '.join(technical.structured_data.schema_types) or 'Schema.org'})",
            problem="None",
            why_it_matters="Enables Google rich snippets and enhanced knowledge graph entities.",
            recommendation="Validate your schema with Google's Rich Results Test tool."
        ))

    # --- CONTENT DEPTH ---
    if content.word_count < 300:
        issues.append(IssueItem(
            id="crit-thin-content" if content.word_count < 150 else "warn-thin-content",
            category="Content",
            severity="critical" if content.word_count < 150 else "warning",
            title=f"Thin Content Detected ({content.word_count} words)",
            problem=f"The page has only {content.word_count} words of visible text.",
            why_it_matters="Search engines heavily favor comprehensive, authoritative content that thoroughly answers user search intent.",
            recommendation="Expand page content to at least 500-1000 words with in-depth answers, FAQs, and clear explanations."
        ))
    else:
        issues.append(IssueItem(
            id="pass-content-length",
            category="Content",
            severity="passed",
            title=f"Substantial Content Word Count ({content.word_count} words)",
            problem="None",
            why_it_matters="Provides search engines sufficient context to index the topic for relevant long-tail search queries.",
            recommendation="Keep updating content to preserve freshness and topical relevance."
        ))

    # --- PERFORMANCE ---
    if technical.response_time_ms > 2000:
        issues.append(IssueItem(
            id="warn-response-time",
            category="Technical SEO",
            severity="warning",
            title=f"Slow Server Response Time ({int(technical.response_time_ms)} ms)",
            problem=f"Server took {int(technical.response_time_ms)}ms to return the initial HTML document.",
            why_it_matters="Slow server response (TTFB) degrades Core Web Vitals and increases visitor bounce rates.",
            recommendation="Implement server-side caching, upgrade hosting infrastructure, or leverage a CDN like Cloudflare."
        ))
    else:
        issues.append(IssueItem(
            id="pass-response-time",
            category="Technical SEO",
            severity="passed",
            title=f"Fast Server Response Time ({int(technical.response_time_ms)} ms)",
            problem="None",
            why_it_matters="Ensures snappy initial page delivery and optimal crawl budget usage.",
            recommendation="Maintain caching and CDN configurations."
        ))

    # --- PRODUCT SEO (if detected) ---
    if product.is_product_page:
        if not product.has_product_schema:
            issues.append(IssueItem(
                id="warn-product-schema",
                category="Product SEO",
                severity="critical",
                title="Missing Product Schema.org Data",
                problem="This appears to be an e-commerce product page, but no Product JSON-LD schema was found.",
                why_it_matters="Without Product schema, Google cannot display product price badges, star ratings, or stock badges in Google Shopping or SERPs.",
                recommendation="Add Schema.org/Product JSON-LD including 'name', 'offers' (price, currency, availability), and 'brand'."
            ))
        if not product.price:
            issues.append(IssueItem(
                id="warn-product-price",
                category="Product SEO",
                severity="warning",
                title="Product Price Not Explicitly Detected",
                problem="Could not find a structured or clearly tagged product price.",
                why_it_matters="Clear pricing transparency is vital for buyer conversion and rich merchant snippets.",
                recommendation="Ensure product pricing is clearly labeled in the DOM and declared in schema markup."
            ))

    return breakdown, issues
