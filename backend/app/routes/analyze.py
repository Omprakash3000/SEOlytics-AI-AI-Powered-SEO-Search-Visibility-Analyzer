import time
from datetime import datetime
from bs4 import BeautifulSoup
from fastapi import APIRouter, HTTPException, status
from app.models.analysis_models import (
    AnalyzeRequest, FullAnalysisResponse, TechnicalSeoResult,
    OnPageSeoResult, ContentAnalysisResult, KeywordAnalysisResult,
    ProductSeoResult, RecommendationItem
)
from app.services.crawler import fetch_webpage
from app.services.technical_seo import analyze_technical_seo
from app.services.onpage_seo import analyze_onpage_seo
from app.services.content_analyzer import analyze_content_quality
from app.services.keyword_analyzer import analyze_keywords
from app.services.product_analyzer import analyze_product_seo
from app.services.scoring_engine import calculate_overall_scores
from app.services.ai_recommendations import generate_ai_recommendations
from app.services.search_visibility import get_search_visibility_status

router = APIRouter(prefix="/analyze", tags=["SEO Analysis"])

@router.post("", response_model=FullAnalysisResponse)
async def analyze_url(req: AnalyzeRequest):
    start_time = time.time()

    # 1. Fetch webpage
    crawl_res = await fetch_webpage(req.url)
    if not crawl_res.is_success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=crawl_res.error or "We couldn't access this webpage. Please verify that the URL is publicly accessible."
        )

    # 2. Parse HTML
    try:
        soup = BeautifulSoup(crawl_res.html, "html.parser")
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Failed to parse webpage HTML structure: {str(e)}"
        )

    # 3. Category Audits
    technical_res = analyze_technical_seo(crawl_res, soup)
    content_res = analyze_content_quality(crawl_res.html, soup)
    onpage_res = analyze_onpage_seo(soup, crawl_res.final_url, technical_res, content_res)
    keyword_res = analyze_keywords(soup, crawl_res.final_url, req.custom_target_keywords)
    product_res = analyze_product_seo(soup, crawl_res.html, crawl_res.final_url)

    # 4. Scoring & Issues Extraction
    scores, issues = calculate_overall_scores(
        technical_res, onpage_res, content_res, keyword_res, product_res
    )

    # 5. AI Recommendations
    recommendations = []
    if req.include_ai:
        recommendations = generate_ai_recommendations(
            issues, technical_res, onpage_res, content_res, keyword_res, product_res
        )

    # 6. Search Visibility
    search_vis = get_search_visibility_status(crawl_res.final_url)

    elapsed_total = round(time.time() - start_time, 3)

    return FullAnalysisResponse(
        url=req.url,
        canonical_url=technical_res.meta.canonical or crawl_res.final_url,
        analyzed_at=datetime.utcnow().isoformat() + "Z",
        execution_time_seconds=elapsed_total,
        is_demo=False,
        scores=scores,
        technical_seo=technical_res,
        onpage_seo=onpage_res,
        content_analysis=content_res,
        keyword_analysis=keyword_res,
        product_seo=product_res,
        issues=issues,
        recommendations=recommendations,
        search_visibility=search_vis,
        quick_summary={
            "status_code": technical_res.status_code,
            "response_time_ms": technical_res.response_time_ms,
            "is_https": technical_res.is_https,
            "word_count": content_res.word_count,
            "total_images": technical_res.images.total_images,
            "missing_alt": technical_res.images.images_missing_alt,
            "total_links": technical_res.links.total_links,
            "is_product": product_res.is_product_page
        }
    )

@router.post("/technical", response_model=TechnicalSeoResult)
async def analyze_technical_only(req: AnalyzeRequest):
    crawl_res = await fetch_webpage(req.url)
    if not crawl_res.is_success:
        raise HTTPException(status_code=400, detail=crawl_res.error or "Target URL unreachable.")
    soup = BeautifulSoup(crawl_res.html, "html.parser")
    return analyze_technical_seo(crawl_res, soup)

@router.post("/content", response_model=ContentAnalysisResult)
async def analyze_content_only(req: AnalyzeRequest):
    crawl_res = await fetch_webpage(req.url)
    if not crawl_res.is_success:
        raise HTTPException(status_code=400, detail=crawl_res.error or "Target URL unreachable.")
    soup = BeautifulSoup(crawl_res.html, "html.parser")
    return analyze_content_quality(crawl_res.html, soup)

@router.post("/keywords", response_model=KeywordAnalysisResult)
async def analyze_keywords_only(req: AnalyzeRequest):
    crawl_res = await fetch_webpage(req.url)
    if not crawl_res.is_success:
        raise HTTPException(status_code=400, detail=crawl_res.error or "Target URL unreachable.")
    soup = BeautifulSoup(crawl_res.html, "html.parser")
    return analyze_keywords(soup, crawl_res.final_url, req.custom_target_keywords)
