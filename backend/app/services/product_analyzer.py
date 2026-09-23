import re
import json
from bs4 import BeautifulSoup
from typing import Dict, Any, List, Optional
from app.models.analysis_models import ProductSeoResult

def analyze_product_seo(soup: BeautifulSoup, html: str, url: str) -> ProductSeoResult:
    """
    Detects if the page is an e-commerce / product page and audits product-specific SEO factors.
    """
    is_product = False
    product_name = None
    brand = None
    price = None
    currency = None
    availability = None
    sku = None
    rating_val = None
    review_count = None
    has_product_schema = False
    missing_elements = []
    checks = {}

    # 1. Check for JSON-LD Product Schema
    for script in soup.find_all("script", type="application/ld+json"):
        if not script.string:
            continue
        try:
            data = json.loads(script.string.strip())
            product_data = find_schema_by_type(data, "Product")
            if product_data:
                is_product = True
                has_product_schema = True
                product_name = product_data.get("name")
                
                # Brand
                b_info = product_data.get("brand")
                if isinstance(b_info, dict):
                    brand = b_info.get("name")
                elif isinstance(b_info, str):
                    brand = b_info

                sku = product_data.get("sku") or product_data.get("productID")

                # Offers / Price
                offers = product_data.get("offers")
                if isinstance(offers, dict):
                    price = str(offers.get("price", ""))
                    currency = offers.get("priceCurrency")
                    availability = offers.get("availability")
                elif isinstance(offers, list) and len(offers) > 0:
                    price = str(offers[0].get("price", ""))
                    currency = offers[0].get("priceCurrency")
                    availability = offers[0].get("availability")

                # Ratings
                agg_rating = product_data.get("aggregateRating")
                if isinstance(agg_rating, dict):
                    try:
                        rating_val = float(agg_rating.get("ratingValue", 0))
                        review_count = int(agg_rating.get("reviewCount", 0))
                    except Exception:
                        pass
                break
        except Exception:
            pass

    # 2. Heuristic detection if schema not present
    # Check for Price patterns like $99.99, £45, €120, ₹1,499
    price_regex = re.compile(r'([$€£¥₹])\s*([0-9]+(?:[,.][0-9]{2})?)')
    price_match = price_regex.search(html)

    # Check for Add to Cart / Buy Now buttons
    cart_buttons = soup.find_all(lambda tag: tag.name in ["button", "a", "input"] and any(
        kw in (tag.get_text() or tag.get("value", "") or tag.get("aria-label", "") or "").lower()
        for kw in ["add to cart", "buy now", "add to bag", "purchase", "order now"]
    ))
    has_add_to_cart = len(cart_buttons) > 0

    # Check for OpenGraph product tags
    og_price = soup.find("meta", property="product:price:amount") or soup.find("meta", property="og:price:amount")
    og_currency = soup.find("meta", property="product:price:currency") or soup.find("meta", property="og:price:currency")
    og_brand = soup.find("meta", property="product:brand")

    if og_price:
        is_product = True
        price = price or og_price.get("content")
    if og_currency:
        currency = currency or og_currency.get("content")
    if og_brand:
        brand = brand or og_brand.get("content")

    if has_add_to_cart or (price_match and "product" in url.lower()):
        is_product = True

    if not is_product:
        # Not a product page
        return ProductSeoResult(
            is_product_page=False,
            score=0,
            missing_elements=[],
            checks={}
        )

    # Fallbacks from DOM if is_product is True
    if not product_name:
        h1_tag = soup.find("h1")
        if h1_tag:
            product_name = h1_tag.get_text().strip()
        elif soup.title:
            product_name = soup.title.get_text().split("-")[0].split("|")[0].strip()

    if not price and price_match:
        currency = currency or price_match.group(1)
        price = price_match.group(2)

    # Missing elements check
    if not has_product_schema:
        missing_elements.append("Schema.org Product JSON-LD structured data")
    if not price:
        missing_elements.append("Clear product price indicator / schema")
    if not availability:
        missing_elements.append("Availability / stock status schema")
    if not brand:
        missing_elements.append("Product brand specification")
    if not sku:
        missing_elements.append("SKU or Product Identifier")
    if not rating_val:
        missing_elements.append("Customer review or AggregateRating schema")

    # Checks map
    checks = {
        "has_product_schema": has_product_schema,
        "has_product_name": bool(product_name),
        "has_price": bool(price),
        "has_brand": bool(brand),
        "has_availability": bool(availability),
        "has_reviews_rating": bool(rating_val),
        "has_add_to_cart": has_add_to_cart
    }

    # Product SEO Score
    p_score = 100
    if not has_product_schema:
        p_score -= 30
    if not price:
        p_score -= 15
    if not availability:
        p_score -= 10
    if not brand:
        p_score -= 10
    if not sku:
        p_score -= 10
    if not rating_val:
        p_score -= 10
    if not has_add_to_cart:
        p_score -= 10

    p_score = max(15, min(100, p_score))

    # Clean availability string if it's a schema URL
    if availability and "InStock" in availability:
        availability = "In Stock"
    elif availability and "OutOfStock" in availability:
        availability = "Out of Stock"

    return ProductSeoResult(
        is_product_page=True,
        score=p_score,
        product_name=product_name,
        brand=brand,
        price=price,
        currency=currency or "USD",
        availability=availability or "In Stock",
        sku=sku,
        rating_value=rating_val,
        review_count=review_count,
        product_images_count=len(soup.find_all("img")),
        has_product_schema=has_product_schema,
        has_price_tag=bool(price),
        has_add_to_cart=has_add_to_cart,
        missing_elements=missing_elements,
        checks=checks
    )

def find_schema_by_type(data: Any, target_type: str) -> Optional[Dict[str, Any]]:
    if isinstance(data, list):
        for item in data:
            res = find_schema_by_type(item, target_type)
            if res:
                return res
    elif isinstance(data, dict):
        stype = data.get("@type")
        if stype == target_type or (isinstance(stype, list) and target_type in stype):
            return data
        if "@graph" in data:
            return find_schema_by_type(data["@graph"], target_type)
    return None
