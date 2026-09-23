import json
import httpx
from typing import List, Dict, Any
from app.models.analysis_models import (
    RecommendationItem, IssueItem, TechnicalSeoResult,
    OnPageSeoResult, ContentAnalysisResult, KeywordAnalysisResult, ProductSeoResult
)
from app.config import settings

def generate_ai_recommendations(
    issues: List[IssueItem],
    technical: TechnicalSeoResult,
    onpage: OnPageSeoResult,
    content: ContentAnalysisResult,
    keywords: KeywordAnalysisResult,
    product: ProductSeoResult
) -> List[RecommendationItem]:
    """
    Generates actionable, prioritized recommendations based on real detected audit issues.
    """
    recs: List[RecommendationItem] = []

    # 1. Critical Priority: Title & Meta Description Fixes
    if not technical.meta.title:
        recs.append(RecommendationItem(
            id="rec-title-missing",
            category="On-Page SEO",
            priority="High",
            title="Create a Targeted SEO Title Tag",
            problem="The webpage is completely missing a <title> tag in the HTML head.",
            action="Add a 50–60 character title tag structured as '[Primary Keyword] – [Secondary Benefit | Brand]'.",
            example="<title>Best Men's Running Shoes for Marathon | FleetFoot Gear</title>"
        ))
    elif not (30 <= technical.meta.title_length <= 65):
        recs.append(RecommendationItem(
            id="rec-title-optimize",
            category="On-Page SEO",
            priority="High",
            title="Optimize Title Tag Character Length",
            problem=f"Current title length is {technical.meta.title_length} characters (Optimal is 50-60 characters).",
            action="Shorten or lengthen your title so it fits cleanly within Google's 600px desktop snippet without ellipsis truncation.",
            example=f"Current: \"{technical.meta.title[:50]}...\"\nRefined: \"{technical.meta.title[:45]} | Official Store\""
        ))

    if not technical.meta.description:
        sample_kw = keywords.primary_keywords[0].keyword if keywords.primary_keywords else "your product"
        recs.append(RecommendationItem(
            id="rec-desc-missing",
            category="On-Page SEO",
            priority="High",
            title="Craft a Compelling Meta Description",
            problem="No meta description tag was detected on the page.",
            action="Write a 140–155 character meta description featuring your primary keyword, an active value proposition, and a clear call-to-action.",
            example=f'<meta name="description" content="Discover premium {sample_kw} designed for maximum performance and durability. Enjoy free shipping & easy 30-day returns. Shop now!">'
        ))

    # 2. Critical Priority: HTTPS & Noindex
    if not technical.is_https:
        recs.append(RecommendationItem(
            id="rec-https",
            category="Technical SEO",
            priority="High",
            title="Enforce HTTPS Encryption Across Domain",
            problem="The website is running on unencrypted HTTP.",
            action="Deploy an SSL certificate and configure your web server (Nginx/Apache/Cloudflare) to 301 redirect all HTTP traffic to HTTPS.",
            example="Redirect 301 / https://yourdomain.com/"
        ))

    if technical.checks.get("robots_noindex"):
        recs.append(RecommendationItem(
            id="rec-noindex",
            category="Technical SEO",
            priority="High",
            title="Remove Noindex Robots Tag Immediately",
            problem="The page is instructing search engines NOT to index its content.",
            action="Remove 'noindex' from your meta robots tag or X-Robots-Tag header.",
            example='Change <meta name="robots" content="noindex, follow"> to <meta name="robots" content="index, follow">'
        ))

    # 3. Heading Structure
    if technical.headings.h1_count == 0:
        sample_kw = keywords.primary_keywords[0].keyword.title() if keywords.primary_keywords else "Product Title"
        recs.append(RecommendationItem(
            id="rec-h1-missing",
            category="On-Page SEO",
            priority="High",
            title="Add a Single Descriptive H1 Tag",
            problem="Page has no primary <h1> header element.",
            action="Add one <h1> element near the top of the body that clearly states the core subject of the page.",
            example=f'<h1>High-Performance {sample_kw}</h1>'
        ))
    elif technical.headings.h1_count > 1:
        recs.append(RecommendationItem(
            id="rec-h1-multiple",
            category="On-Page SEO",
            priority="Medium",
            title="Consolidate Multiple H1 Tags into H2 Elements",
            problem=f"Found {technical.headings.h1_count} separate H1 tags on the page.",
            action="Keep only the most important heading as H1 and convert subsidiary section titles to H2 tags.",
            example="Replace secondary <h1>Feature Details</h1> with <h2>Feature Details</h2>"
        ))

    # 4. Images Alt Attributes
    if technical.images.images_missing_alt > 0:
        recs.append(RecommendationItem(
            id="rec-images-alt",
            category="Technical SEO",
            priority="Medium",
            title="Add Descriptive Alt Text to All Images",
            problem=f"{technical.images.images_missing_alt} images are missing alternative text attributes.",
            action="Provide concise, context-aware alt text explaining each image for accessibility and Google Image indexing.",
            example='<img src="/shoes.jpg" alt="Men\'s lightweight breathable running shoe in cobalt blue" />'
        ))

    # 5. Structured Data / Schema Markup
    if not technical.structured_data.has_json_ld:
        recs.append(RecommendationItem(
            id="rec-schema-jsonld",
            category="Technical SEO",
            priority="Medium",
            title="Implement Schema.org JSON-LD Structured Data",
            problem="No structured data found to trigger Google Rich Search snippets.",
            action="Embed a JSON-LD script defining the entity (Organization, WebSite, Article, or Product).",
            example="""<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Your Brand",
  "url": "https://example.com"
}
</script>"""
        ))

    # 6. Content Depth & Readability
    if content.word_count < 300:
        recs.append(RecommendationItem(
            id="rec-content-thin",
            category="Content",
            priority="High",
            title="Expand Page Content Depth to Prevent Thin Content Flags",
            problem=f"Page only contains {content.word_count} words of visible content.",
            action="Expand the copy to at least 400-800 words by adding detailed feature breakdowns, FAQs, benefits, and user guides.",
            example="Add an FAQ section with 3–5 common customer questions answered thoroughly."
        ))

    # 7. Keyword Placement
    if keywords.primary_keywords:
        top_kw = keywords.primary_keywords[0]
        if not top_kw.locations.in_first_paragraph:
            recs.append(RecommendationItem(
                id="rec-kw-first-p",
                category="Keywords",
                priority="Medium",
                title=f"Introduce Primary Keyword '{top_kw.keyword}' in Opening Paragraph",
                problem=f"The primary extracted keyword '{top_kw.keyword}' does not appear in the first 100 words.",
                action="Mention your primary keyword naturally within the first sentence or two of your introduction.",
                example=f"\"Looking for the best {top_kw.keyword}? Our newly engineered series delivers...\""
            ))

    # 8. Product SEO (if e-commerce)
    if product.is_product_page:
        if not product.has_product_schema:
            p_name = product.product_name or "Product Name"
            p_price = product.price or "49.99"
            p_curr = product.currency or "USD"
            recs.append(RecommendationItem(
                id="rec-product-schema",
                category="Product SEO",
                priority="High",
                title="Inject Product & Offer JSON-LD Schema",
                problem="Product page is missing Schema.org/Product markup for Google Shopping / Merchant results.",
                action="Add structured Product markup including price, availability, and brand to gain rich product badges in SERPs.",
                example=f"""<script type="application/ld+json">
{{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "{p_name}",
  "offers": {{
    "@type": "Offer",
    "price": "{p_price}",
    "priceCurrency": "{p_curr}",
    "availability": "https://schema.org/InStock"
  }}
}}
</script>"""
            ))

    # 9. Search Visibility & Ranking Strategy
    recs.append(RecommendationItem(
        id="rec-search-visibility",
        category="Search Visibility",
        priority="Medium",
        title="Connect Google Search Console & Monitor Keyword Rankings",
        problem="Organic search queries and live SERP rank positions require external search console integration.",
        action="Submit your XML sitemap to Google Search Console to monitor real click-through rates, impressions, and indexation coverage.",
        example="Upload https://yourdomain.com/sitemap.xml to Google Search Console -> Sitemaps."
    ))

    return recs
