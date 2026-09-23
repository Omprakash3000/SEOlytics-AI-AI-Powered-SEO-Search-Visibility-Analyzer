from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.config import settings
from app.routes.health import router as health_router
from app.routes.analyze import router as analyze_router
from app.routes.report import router as report_router

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Enterprise-grade AI-Powered SEO Website & Product Analyzer API",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for dev/production flexibility
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handler for unhandled exceptions
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": f"An internal server error occurred: {str(exc)}"}
    )

# Include API routes
app.include_router(health_router, prefix="/api")
app.include_router(analyze_router, prefix="/api")
app.include_router(report_router, prefix="/api")

@app.get("/")
def root():
    return {
        "message": "Welcome to SEOlytics AI API",
        "version": settings.APP_VERSION,
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
