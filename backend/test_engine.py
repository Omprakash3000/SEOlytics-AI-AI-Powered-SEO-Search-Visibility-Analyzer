import asyncio
from app.services.crawler import fetch_webpage
from app.services.technical_seo import analyze_technical_seo
from app.services.content_analyzer import analyze_content_quality
from app.services.keyword_analyzer import analyze_keywords
from app.services.product_analyzer import analyze_product_seo
from app.services.scoring_engine import calculate_overall_scores
from app.services.ai_recommendations import generate_ai_recommendations
from bs4 import BeautifulSoup

SAMPLE_HTML = """
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ultra Marathon Running Shoes - Men & Women | FleetFoot</title>
  <meta name="description" content="Shop ultra lightweight marathon running shoes engineered for peak speed, comfort, and shock absorption. Fast free worldwide shipping.">
  <link rel="canonical" href="https://example.com/shoes">
  <meta property="og:title" content="Ultra Marathon Running Shoes">
  <meta property="og:description" content="Shop marathon running shoes.">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": "FleetFoot Ultra Marathon Running Shoes",
    "brand": "FleetFoot",
    "sku": "FF-RUN-001",
    "offers": {
      "@type": "Offer",
      "price": "149.99",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "124"
    }
  }
  </script>
</head>
<body>
  <header><nav><a href="/home">Home</a> <a href="/shop">Shop</a></nav></header>
  <main>
    <h1>FleetFoot Ultra Marathon Running Shoes</h1>
    <p>Discover the next generation of marathon running shoes engineered for extreme endurance. Our ultra running shoes feature cutting edge foam responsive soles and ultra lightweight breathable mesh.</p>
    <h2>Advanced Sole Cushioning Technology</h2>
    <p>Every marathon runner needs maximum shock absorption. Our running shoes protect your joints through 26.2 miles of intense road running. Experience smooth transitions and unmatched energy return on every stride.</p>
    <h2>Durable Breathable Upper Mesh</h2>
    <p>Constructed with dual-layer breathable mesh to keep your feet cool during long training sessions and hot weather racing. Perfect for daily jogging, half marathons, and full marathon races.</p>
    <img src="/img/shoe-side.jpg" alt="FleetFoot marathon running shoe side view" width="600" height="400">
    <button>Add to Cart</button>
  </main>
  <footer><p>© 2026 FleetFoot Gear. All rights reserved.</p></footer>
</body>
</html>
"""

def test_engine():
    soup = BeautifulSoup(SAMPLE_HTML, "html.parser")
    
    # Mock crawl result
    class MockCrawl:
        url = "https://example.com/shoes"
        final_url = "https://example.com/shoes"
        status_code = 200
        html = SAMPLE_HTML
        headers = {"content-type": "text/html", "strict-transport-security": "max-age=31536000"}
        response_time_ms = 180.5
        page_size_kb = 4.2
        redirect_chain = ["https://example.com/shoes"]
        is_https = True
        error = ""
        is_success = True

    mock_crawl = MockCrawl()

    tech = analyze_technical_seo(mock_crawl, soup)
    content = analyze_content_quality(SAMPLE_HTML, soup)
    keywords = analyze_keywords(soup, mock_crawl.final_url)
    product = analyze_product_seo(soup, SAMPLE_HTML, mock_crawl.final_url)
    scores, issues = calculate_overall_scores(tech, None or type('MockOnpage', (), {'score': 92})(), content, keywords, product)
    recs = generate_ai_recommendations(issues, tech, None or type('MockOnpage', (), {'score': 92})(), content, keywords, product)

    print(f"Overall Score: {scores.overall_score}/100")
    print(f"Technical: {tech.score}, Content: {content.score}, Keywords: {keywords.score}, Product: {product.score}")
    print(f"Is Product Page: {product.is_product_page} (Name: {product.product_name}, Price: ${product.price} {product.currency})")
    print(f"Top Keywords: {[k.keyword for k in keywords.primary_keywords[:5]]}")
    print(f"Issues count: {len(issues)}, AI Recommendations count: {len(recs)}")
    print("Backend engine unit check SUCCESSFUL!")

if __name__ == "__main__":
    test_engine()
