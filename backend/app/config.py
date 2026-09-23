from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    APP_NAME: str = "SEOlytics AI Backend"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    FRONTEND_URL: str = "http://localhost:5173"
    
    # Optional AI Keys
    AI_PROVIDER: str = "builtin" # 'builtin', 'openai', 'gemini'
    AI_API_KEY: Optional[str] = None
    AI_MODEL: str = "gemini-1.5-flash"
    
    # Optional External SEO Provider Keys
    SEO_API_PROVIDER: str = "none" # 'none', 'serpapi', 'dataforseo', 'gsc'
    SEO_API_KEY: Optional[str] = None
    
    # Crawler Settings
    CRAWLER_TIMEOUT_SECONDS: int = 15
    CRAWLER_MAX_REDIRECTS: int = 5
    CRAWLER_USER_AGENT: str = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 SEOlyticsBot/1.0"
    ALLOW_PRIVATE_IPS: bool = False # Must be False in production for SSRF protection

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
