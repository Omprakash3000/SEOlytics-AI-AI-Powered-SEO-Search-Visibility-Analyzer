const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * Analyzes target URL via backend crawler and SEO analyzer engine
 */
export async function analyzeUrl(url, customTargetKeywords = null, includeAi = true) {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        include_ai: includeAi,
        custom_target_keywords: customTargetKeywords
      }),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { detail: `Server error: HTTP ${response.status}` };
      }
      throw new Error(errorData.detail || 'Failed to analyze URL.');
    }

    return await response.json();
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Could not connect to SEOlytics AI backend at ' + API_BASE_URL + '. Please ensure the FastAPI server is running.');
    }
    throw error;
  }
}

/**
 * Checks backend health and connected providers
 */
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
    });
    if (!response.ok) return { status: 'offline' };
    return await response.json();
  } catch (e) {
    return { status: 'offline', error: e.message };
  }
}

/**
 * Exports HTML audit report
 */
export async function downloadHtmlReport(analysisData) {
  const response = await fetch(`${API_BASE_URL}/report/export-html`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(analysisData),
  });

  if (!response.ok) {
    throw new Error('Failed to generate HTML report');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `SEOlytics_Report_${new URL(analysisData.url).hostname}.html`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
