from fastapi import APIRouter
from app.config import settings
import datetime

router = APIRouter(tags=["Health"])

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "ai_provider": settings.AI_PROVIDER,
        "seo_provider": settings.SEO_API_PROVIDER
    }
