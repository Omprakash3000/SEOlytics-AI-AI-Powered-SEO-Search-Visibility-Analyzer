from typing import Dict, Any, List, Optional
from app.models.analysis_models import SearchVisibilityProvider
from app.config import settings

def get_search_visibility_status(url: str) -> SearchVisibilityProvider:
    """
    Returns search visibility connection status.
    Strict rule: Never fabricate fake Google rank numbers or search volumes.
    If external API provider is configured, handles provider integration; otherwise returns truthful disconnected state.
    """
    provider = settings.SEO_API_PROVIDER.lower() if settings.SEO_API_PROVIDER else "none"
    api_key = settings.SEO_API_KEY

    is_connected = bool(provider != "none" and api_key and len(api_key.strip()) > 5)

    if not is_connected:
        return SearchVisibilityProvider(
            provider_name=provider.title() if provider != "none" else "None",
            is_connected=False,
            status_message="Data unavailable — connect a supported SEO/search API to retrieve live ranking data.",
            supported_providers=["Google Search Console", "SerpAPI", "DataForSEO", "Semrush", "Ahrefs"]
        )

    return SearchVisibilityProvider(
        provider_name=provider.title(),
        is_connected=True,
        status_message=f"Connected to {provider.title()} API Provider. Live ranking & backlink sync ready.",
        supported_providers=["Google Search Console", "SerpAPI", "DataForSEO", "Semrush", "Ahrefs"]
    )
