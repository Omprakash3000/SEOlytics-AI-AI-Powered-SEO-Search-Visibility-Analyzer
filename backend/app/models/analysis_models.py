from pydantic import BaseModel, Field, HttpUrl
from typing import List, Optional, Dict, Any

class AnalyzeRequest(BaseModel):
    url: str = Field(..., example="https://example.com", description="Target URL to analyze")
    include_ai: bool = Field(True, description="Whether to generate AI recommendations")
    custom_target_keywords: Optional[List[str]] = Field(default=None, description="Optional target keywords to test presence for")

class MetaTags(BaseModel):
    title: Optional[str] = None
    title_length: int = 0
    description: Optional[str] = None
    description_length: int = 0
    robots: Optional[str] = None
    canonical: Optional[str] = None
    viewport: Optional[str] = None
    charset: Optional[str] = None
    language: Optional[str] = None
    author: Optional[str] = None
    open_graph: Dict[str, str] = Field(default_factory=dict)
    twitter_card: Dict[str, str] = Field(default_factory=dict)

class HeadingStructure(BaseModel):
    h1_tags: List[str] = Field(default_factory=list)
    h2_tags: List[str] = Field(default_factory=list)
    h3_tags: List[str] = Field(default_factory=list)
    h4_tags: List[str] = Field(default_factory=list)
    h5_tags: List[str] = Field(default_factory=list)
    h6_tags: List[str] = Field(default_factory=list)
    h1_count: int = 0
    h2_count: int = 0
    h3_count: int = 0
    total_headings: int = 0
    hierarchy_valid: bool = True
    issues: List[str] = Field(default_factory=list)

class ImageAuditItem(BaseModel):
    src: str
    alt: Optional[str] = None
    has_alt: bool = False
    is_empty_alt: bool = True
    width: Optional[str] = None
    height: Optional[str] = None
    lazy_loaded: bool = False

class ImageAudit(BaseModel):
    total_images: int = 0
    images_with_alt: int = 0
    images_missing_alt: int = 0
    images_lazy_loaded: int = 0
    sample_images: List[ImageAuditItem] = Field(default_factory=list)

class LinkAuditItem(BaseModel):
    href: str
    text: str
    is_internal: bool
    is_external: bool
    is_nofollow: bool
    is_empty_anchor: bool

class LinkAudit(BaseModel):
    total_links: int = 0
    internal_links_count: int = 0
    external_links_count: int = 0
    nofollow_links_count: int = 0
    empty_anchor_count: int = 0
    sample_links: List[LinkAuditItem] = Field(default_factory=list)

class StructuredDataItem(BaseModel):
    schema_type: str
    data: Dict[str, Any] = Field(default_factory=dict)

class StructuredDataAudit(BaseModel):
    has_json_ld: bool = False
    has_microdata: bool = False
    schema_types: List[str] = Field(default_factory=list)
    items: List[StructuredDataItem] = Field(default_factory=list)

class TechnicalSeoResult(BaseModel):
    score: int = 0
    is_https: bool = False
    status_code: int = 200
    response_time_ms: float = 0.0
    page_size_kb: float = 0.0
    redirect_count: int = 0
    redirect_chain: List[str] = Field(default_factory=list)
    meta: MetaTags = Field(default_factory=MetaTags)
    headings: HeadingStructure = Field(default_factory=HeadingStructure)
    images: ImageAudit = Field(default_factory=ImageAudit)
    links: LinkAudit = Field(default_factory=LinkAudit)
    structured_data: StructuredDataAudit = Field(default_factory=StructuredDataAudit)
    security_headers: Dict[str, bool] = Field(default_factory=dict)
    checks: Dict[str, bool] = Field(default_factory=dict)

class OnPageSeoResult(BaseModel):
    score: int = 0
    title_status: str = "Good"
    description_status: str = "Good"
    url_slug_analysis: Dict[str, Any] = Field(default_factory=dict)
    h1_optimization: str = "Good"
    keyword_presence_summary: Dict[str, bool] = Field(default_factory=dict)
    semantic_tags_found: List[str] = Field(default_factory=list)
    has_favicon: bool = False
    checks: Dict[str, bool] = Field(default_factory=dict)

class ContentAnalysisResult(BaseModel):
    score: int = 0
    word_count: int = 0
    sentence_count: int = 0
    paragraph_count: int = 0
    avg_sentence_length: float = 0.0
    reading_ease_score: float = 0.0
    reading_level: str = "Standard"
    content_status: str = "Adequate" # 'Thin Content', 'Adequate', 'In-Depth'
    top_repeated_phrases: List[str] = Field(default_factory=list)
    text_to_html_ratio: float = 0.0
    checks: Dict[str, bool] = Field(default_factory=dict)

class KeywordLocationCheck(BaseModel):
    in_title: bool = False
    in_meta_description: bool = False
    in_h1: bool = False
    in_h2: bool = False
    in_url: bool = False
    in_first_paragraph: bool = False
    in_image_alt: bool = False

class KeywordItem(BaseModel):
    keyword: str
    frequency: int
    density_percent: float
    ngram_type: int # 1, 2, or 3
    locations: KeywordLocationCheck = Field(default_factory=KeywordLocationCheck)

class KeywordAnalysisResult(BaseModel):
    score: int = 0
    total_keywords_extracted: int = 0
    primary_keywords: List[KeywordItem] = Field(default_factory=list)
    two_word_phrases: List[KeywordItem] = Field(default_factory=list)
    three_word_phrases: List[KeywordItem] = Field(default_factory=list)
    target_keyword_audit: List[Dict[str, Any]] = Field(default_factory=list)
    checks: Dict[str, bool] = Field(default_factory=dict)

class ProductSeoResult(BaseModel):
    is_product_page: bool = False
    score: int = 0
    product_name: Optional[str] = None
    brand: Optional[str] = None
    price: Optional[str] = None
    currency: Optional[str] = None
    availability: Optional[str] = None
    sku: Optional[str] = None
    rating_value: Optional[float] = None
    review_count: Optional[int] = None
    product_images_count: int = 0
    has_product_schema: bool = False
    has_price_tag: bool = False
    has_add_to_cart: bool = False
    missing_elements: List[str] = Field(default_factory=list)
    checks: Dict[str, bool] = Field(default_factory=dict)

class IssueItem(BaseModel):
    id: str
    category: str # 'Technical SEO', 'On-Page SEO', 'Content', 'Keywords', 'Product SEO', 'Security'
    severity: str # 'critical', 'warning', 'passed'
    title: str
    problem: str
    why_it_matters: str
    recommendation: str

class RecommendationItem(BaseModel):
    id: str
    category: str
    priority: str # 'High', 'Medium', 'Low'
    title: str
    problem: str
    action: str
    example: Optional[str] = None

class ScoreBreakdown(BaseModel):
    overall_score: int
    technical_score: int
    onpage_score: int
    content_score: int
    keyword_score: int
    performance_score: int
    social_schema_score: int
    product_score: Optional[int] = None

class SearchVisibilityProvider(BaseModel):
    provider_name: str
    is_connected: bool = False
    status_message: str = "Data unavailable — connect a supported SEO/search API to retrieve live ranking data."
    supported_providers: List[str] = ["Google Search Console", "SerpAPI", "DataForSEO", "Semrush", "Ahrefs"]

class FullAnalysisResponse(BaseModel):
    url: str
    canonical_url: Optional[str] = None
    analyzed_at: str
    execution_time_seconds: float
    is_demo: bool = False
    scores: ScoreBreakdown
    technical_seo: TechnicalSeoResult
    onpage_seo: OnPageSeoResult
    content_analysis: ContentAnalysisResult
    keyword_analysis: KeywordAnalysisResult
    product_seo: ProductSeoResult
    issues: List[IssueItem] = Field(default_factory=list)
    recommendations: List[RecommendationItem] = Field(default_factory=list)
    search_visibility: SearchVisibilityProvider = Field(default_factory=SearchVisibilityProvider)
    quick_summary: Dict[str, Any] = Field(default_factory=dict)
