import json
from datetime import datetime
from app.models.analysis_models import FullAnalysisResponse

def generate_html_report(data: FullAnalysisResponse) -> str:
    """
    Generates a clean, standalone, print-optimized HTML SEO Audit Report.
    """
    date_str = datetime.now().strftime("%B %d, %Y - %H:%M:%S UTC")
    
    # Issues list
    critical_issues = [i for i in data.issues if i.severity == "critical"]
    warning_issues = [i for i in data.issues if i.severity == "warning"]
    passed_checks = [i for i in data.issues if i.severity == "passed"]

    # Build HTML
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>SEO Audit Report - {data.url}</title>
<style>
  body {{
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    color: #1e293b;
    background: #ffffff;
    line-height: 1.5;
    margin: 0;
    padding: 30px;
  }}
  .header {{
    border-bottom: 2px solid #6366f1;
    padding-bottom: 15px;
    margin-bottom: 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }}
  .logo {{
    font-size: 24px;
    font-weight: 800;
    color: #4338ca;
  }}
  .meta {{
    font-size: 13px;
    color: #64748b;
  }}
  .score-card {{
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 25px;
    display: flex;
    justify-content: space-around;
    text-align: center;
  }}
  .score-val {{
    font-size: 36px;
    font-weight: 800;
    color: #4f46e5;
  }}
  .score-label {{
    font-size: 13px;
    text-transform: uppercase;
    color: #64748b;
    font-weight: 600;
  }}
  .section-title {{
    font-size: 18px;
    font-weight: 700;
    margin-top: 25px;
    margin-bottom: 12px;
    color: #0f172a;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 6px;
  }}
  table {{
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
    font-size: 14px;
  }}
  th, td {{
    padding: 10px 12px;
    border-bottom: 1px solid #f1f5f9;
    text-align: left;
  }}
  th {{
    background: #f8fafc;
    font-weight: 600;
    color: #475569;
  }}
  .badge {{
    display: inline-block;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 700;
  }}
  .badge-crit {{ background: #fee2e2; color: #b91c1c; }}
  .badge-warn {{ background: #fef3c7; color: #b45309; }}
  .badge-pass {{ background: #dcfce7; color: #15803d; }}
  .rec-card {{
    background: #fdfdfe;
    border-left: 4px solid #6366f1;
    border: 1px solid #e2e8f0;
    border-left-width: 4px;
    padding: 12px 16px;
    margin-bottom: 12px;
    border-radius: 4px;
  }}
  .rec-title {{
    font-weight: 700;
    color: #1e1b4b;
    font-size: 15px;
  }}
  .rec-body {{
    font-size: 13px;
    color: #475569;
    margin-top: 4px;
  }}
  .rec-code {{
    background: #f1f5f9;
    padding: 6px 10px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 12px;
    margin-top: 6px;
    display: block;
    white-space: pre-wrap;
  }}
  @media print {{
    body {{ padding: 0; }}
    .no-print {{ display: none; }}
  }}
</style>
</head>
<body>

<div class="header">
  <div>
    <div class="logo">⚡ SEOlytics AI</div>
    <div class="meta">AI-Powered SEO & Search Visibility Audit</div>
  </div>
  <div style="text-align: right;">
    <div class="meta"><strong>URL:</strong> {data.url}</div>
    <div class="meta"><strong>Generated:</strong> {date_str}</div>
  </div>
</div>

<div class="score-card">
  <div>
    <div class="score-val">{data.scores.overall_score}/100</div>
    <div class="score-label">Overall SEO Score</div>
  </div>
  <div>
    <div class="score-val" style="color: #0284c7;">{data.scores.technical_score}</div>
    <div class="score-label">Technical SEO</div>
  </div>
  <div>
    <div class="score-val" style="color: #10b981;">{data.scores.onpage_score}</div>
    <div class="score-label">On-Page SEO</div>
  </div>
  <div>
    <div class="score-val" style="color: #8b5cf6;">{data.scores.content_score}</div>
    <div class="score-label">Content Quality</div>
  </div>
  <div>
    <div class="score-val" style="color: #f59e0b;">{data.scores.keyword_score}</div>
    <div class="score-label">Keywords</div>
  </div>
</div>

<div class="section-title">Audit Overview & Key Metrics</div>
<table>
  <tr>
    <td><strong>Status Code:</strong> {data.technical_seo.status_code}</td>
    <td><strong>Response Time:</strong> {int(data.technical_seo.response_time_ms)} ms</td>
    <td><strong>HTTPS Encrypted:</strong> {'Yes' if data.technical_seo.is_https else 'No'}</td>
  </tr>
  <tr>
    <td><strong>Word Count:</strong> {data.content_analysis.word_count} words</td>
    <td><strong>Reading Ease:</strong> {data.content_analysis.reading_ease_score}/100 ({data.content_analysis.reading_level})</td>
    <td><strong>Images:</strong> {data.technical_seo.images.total_images} ({data.technical_seo.images.images_missing_alt} missing alt)</td>
  </tr>
  <tr>
    <td><strong>Title ({data.technical_seo.meta.title_length} chars):</strong></td>
    <td colspan="2">{data.technical_seo.meta.title or 'None'}</td>
  </tr>
  <tr>
    <td><strong>Meta Description ({data.technical_seo.meta.description_length} chars):</strong></td>
    <td colspan="2">{data.technical_seo.meta.description or 'None'}</td>
  </tr>
</table>

<div class="section-title">Critical & Priority Issues ({len(critical_issues)} Critical, {len(warning_issues)} Warnings)</div>
<table>
  <thead>
    <tr>
      <th>Severity</th>
      <th>Category</th>
      <th>Issue</th>
      <th>Recommended Action</th>
    </tr>
  </thead>
  <tbody>
"""
    for item in critical_issues + warning_issues:
        badge_class = "badge-crit" if item.severity == "critical" else "badge-warn"
        html += f"""
    <tr>
      <td><span class="badge {badge_class}">{item.severity.upper()}</span></td>
      <td>{item.category}</td>
      <td><strong>{item.title}</strong><br><small>{item.problem}</small></td>
      <td>{item.recommendation}</td>
    </tr>
"""
    
    html += """
  </tbody>
</table>

<div class="section-title">Top Extracted Keywords & Densities</div>
<table>
  <thead>
    <tr>
      <th>Keyword Phrase</th>
      <th>Type</th>
      <th>Frequency</th>
      <th>Density %</th>
      <th>Found in Title</th>
      <th>Found in H1</th>
      <th>Found in Desc</th>
    </tr>
  </thead>
  <tbody>
"""
    for kw in (data.keyword_analysis.primary_keywords[:6] + data.keyword_analysis.two_word_phrases[:4]):
        html += f"""
    <tr>
      <td><strong>{kw.keyword}</strong></td>
      <td>{kw.ngram_type}-word</td>
      <td>{kw.frequency}</td>
      <td>{kw.density_percent}%</td>
      <td>{'✓' if kw.locations.in_title else '—'}</td>
      <td>{'✓' if kw.locations.in_h1 else '—'}</td>
      <td>{'✓' if kw.locations.in_meta_description else '—'}</td>
    </tr>
"""
    
    html += """
  </tbody>
</table>

<div class="section-title">Actionable AI Recommendations</div>
"""
    for rec in data.recommendations[:8]:
        html += f"""
<div class="rec-card">
  <div class="rec-title"><span class="badge badge-warn">{rec.priority} Priority</span> - {rec.title} ({rec.category})</div>
  <div class="rec-body"><strong>Problem:</strong> {rec.problem}</div>
  <div class="rec-body"><strong>Action:</strong> {rec.action}</div>
  {f'<div class="rec-code">{rec.example}</div>' if rec.example else ''}
</div>
"""

    html += f"""
<div style="margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 12px; color: #94a3b8; text-align: center;">
  Generated by SEOlytics AI — AI-Powered Search Visibility Analyzer. External rank positions & search volume require an active API connection.
</div>

</body>
</html>"""
    return html
