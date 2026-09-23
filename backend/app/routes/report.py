from fastapi import APIRouter, Response, HTTPException
from app.models.analysis_models import FullAnalysisResponse
from app.services.report_generator import generate_html_report

router = APIRouter(prefix="/report", tags=["Report Export"])

@router.post("/export-html")
def export_html_report(data: FullAnalysisResponse):
    """
    Generates a standalone, beautifully styled HTML SEO report.
    """
    try:
        html_content = generate_html_report(data)
        return Response(
            content=html_content,
            media_type="text/html",
            headers={
                "Content-Disposition": f"attachment; filename=SEOlytics_Report.html"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Report generation error: {str(e)}")

@router.post("/export-json")
def export_json_report(data: FullAnalysisResponse):
    """
    Exports structured audit JSON for data pipelines or backup.
    """
    return data
