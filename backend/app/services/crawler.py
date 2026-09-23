import time
import httpx
from typing import Dict, Any, Tuple
from app.config import settings
from app.utils.security import normalize_and_validate_url

class CrawlResult:
    def __init__(
        self,
        url: str,
        final_url: str,
        status_code: int,
        html: str,
        headers: Dict[str, str],
        response_time_ms: float,
        page_size_kb: float,
        redirect_chain: list,
        is_https: bool,
        error: str = ""
    ):
        self.url = url
        self.final_url = final_url
        self.status_code = status_code
        self.html = html
        self.headers = headers
        self.response_time_ms = response_time_ms
        self.page_size_kb = page_size_kb
        self.redirect_chain = redirect_chain
        self.is_https = is_https
        self.error = error

    @property
    def is_success(self) -> bool:
        return bool(not self.error and 200 <= self.status_code < 400 and self.html)

async def fetch_webpage(url: str) -> CrawlResult:
    """
    Safely fetches the HTML content of the target URL with SSRF checks, timeout, and redirect tracking.
    """
    is_valid, normalized_url, err_msg = normalize_and_validate_url(url, allow_private=settings.ALLOW_PRIVATE_IPS)
    if not is_valid:
        return CrawlResult(
            url=url,
            final_url=url,
            status_code=400,
            html="",
            headers={},
            response_time_ms=0,
            page_size_kb=0,
            redirect_chain=[],
            is_https=url.startswith("https://"),
            error=err_msg
        )

    headers = {
        "User-Agent": settings.CRAWLER_USER_AGENT,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1"
    }

    redirect_chain = []
    start_time = time.time()

    try:
        async with httpx.AsyncClient(
            timeout=httpx.Timeout(settings.CRAWLER_TIMEOUT_SECONDS, connect=8.0),
            follow_redirects=True,
            max_redirects=settings.CRAWLER_MAX_REDIRECTS,
            verify=False # avoid failing on self-signed in dev environments while still recording https
        ) as client:
            response = await client.get(normalized_url, headers=headers)
            elapsed_ms = round((time.time() - start_time) * 1000, 2)
            
            # Record redirect history
            if response.history:
                for hist in response.history:
                    redirect_chain.append(str(hist.url))
            redirect_chain.append(str(response.url))

            html_content = response.text
            page_size_kb = round(len(response.content) / 1024, 2)
            is_https = str(response.url).startswith("https://")

            # Check for non-HTML content
            content_type = response.headers.get("content-type", "").lower()
            if "text/html" not in content_type and "application/xhtml" not in content_type and not html_content.strip().startswith("<"):
                return CrawlResult(
                    url=normalized_url,
                    final_url=str(response.url),
                    status_code=response.status_code,
                    html=html_content,
                    headers=dict(response.headers),
                    response_time_ms=elapsed_ms,
                    page_size_kb=page_size_kb,
                    redirect_chain=redirect_chain,
                    is_https=is_https,
                    error=f"Target URL returned non-HTML content type: '{content_type}'."
                )

            return CrawlResult(
                url=normalized_url,
                final_url=str(response.url),
                status_code=response.status_code,
                html=html_content,
                headers=dict(response.headers),
                response_time_ms=elapsed_ms,
                page_size_kb=page_size_kb,
                redirect_chain=redirect_chain,
                is_https=is_https,
                error=""
            )

    except httpx.ConnectTimeout:
        return CrawlResult(
            url=normalized_url,
            final_url=normalized_url,
            status_code=408,
            html="",
            headers={},
            response_time_ms=round((time.time() - start_time) * 1000, 2),
            page_size_kb=0,
            redirect_chain=redirect_chain,
            is_https=normalized_url.startswith("https://"),
            error="Connection timed out while trying to reach the website (8s connect limit)."
        )
    except httpx.ReadTimeout:
        return CrawlResult(
            url=normalized_url,
            final_url=normalized_url,
            status_code=408,
            html="",
            headers={},
            response_time_ms=round((time.time() - start_time) * 1000, 2),
            page_size_kb=0,
            redirect_chain=redirect_chain,
            is_https=normalized_url.startswith("https://"),
            error="Read timed out while waiting for server response."
        )
    except httpx.ConnectError as e:
        return CrawlResult(
            url=normalized_url,
            final_url=normalized_url,
            status_code=502,
            html="",
            headers={},
            response_time_ms=round((time.time() - start_time) * 1000, 2),
            page_size_kb=0,
            redirect_chain=redirect_chain,
            is_https=normalized_url.startswith("https://"),
            error=f"Could not establish connection to the host. {str(e)}"
        )
    except Exception as e:
        return CrawlResult(
            url=normalized_url,
            final_url=normalized_url,
            status_code=500,
            html="",
            headers={},
            response_time_ms=round((time.time() - start_time) * 1000, 2),
            page_size_kb=0,
            redirect_chain=redirect_chain,
            is_https=normalized_url.startswith("https://"),
            error=f"Crawling failed: {str(e)}"
        )
