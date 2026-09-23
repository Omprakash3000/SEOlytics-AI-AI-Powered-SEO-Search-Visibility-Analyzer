# Implementation Plan - SEOlytics AI — AI-Powered SEO & Search Visibility Analyzer

Build a complete, modern, production-grade SaaS web application that crawls live website and product URLs, performs real-time technical SEO, on-page SEO, content quality, keyword density, structured data / e-commerce detection, calculates true weighted SEO scores (0-100), detects critical issues/warnings/passed checks, generates actionable AI recommendations, and presents the insights via an interactive dashboard with PDF report export.

## Proposed Architecture

```
SEOlytics AI
├── backend/
│   ├── app/
│   │   ├── main.py                   # FastAPI entrypoint, CORS, exception handlers
│   │   ├── config.py                 # Settings & env variable management
│   │   ├── models/analysis_models.py # Pydantic v2 schemas for all audit categories
│   │   ├── routes/
│   │   │   ├── analyze.py            # POST /api/analyze (Full & Category endpoints)
│   │   │   ├── report.py             # POST /api/report/export-html & pdf
│   │   │   └── health.py             # GET /api/health
│   │   ├── services/
│   │   │   ├── crawler.py            # Async httpx crawler with SSRF & redirect handling
│   │   │   ├── technical_seo.py      # Meta, robots, canonical, headings, links, images, SSL, schema
│   │   │   ├── onpage_seo.py         # Keyword placement, title/desc optimization, URL structure
│   │   │   ├── content_analyzer.py   # Word counts, sentence metrics, Flesch reading heuristic, thin content
│   │   │   ├── keyword_analyzer.py   # 1/2/3-gram extraction, stopword filtering, density, locations
│   │   │   ├── product_analyzer.py   # E-commerce schema & product tag detection, price, availability, SKU
│   │   │   ├── scoring_engine.py     # Deterministic weighted 0-100 scoring & issues classification
│   │   │   ├── ai_recommendations.py # Rule-based expert system + optional Gemini/OpenAI API enhancement
│   │   │   ├── search_visibility.py  # Live API adapter / clear disconnected state (never fake rank data)
│   │   │   └── report_generator.py   # Structured report & export compiler
│   │   └── utils/
│   │       ├── security.py           # SSRF protection, private IP filtering, URL validation
│   │       └── text_processing.py    # Nlp utils, syllables, stopwords
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/               # Navbar, Hero, ScoreGauge, Charts, Cards, Issues, Recommendations
│   │   ├── pages/                    # LandingPage, DashboardPage
│   │   ├── services/                 # api.js client, demoData.js
│   │   ├── hooks/                    # useTheme.js (dark/light persistence)
│   │   ├── utils/                    # pdfExporter.js, formatters.js
│   │   ├── App.jsx
│   │   └── index.css                 # Modern sleek Tailwind + custom animations & glassmorphism
│   ├── package.json
│   └── vite.config.js
├── reports/
└── README.md
```

## Key Features & Capabilities

1. **Real-time Live Crawling & SSRF Protection**:
   - Safe HTTP client using `httpx` with timeout limits, follow redirects, response time recording, and strict SSRF blocking (blocking `127.0.0.1`, `localhost`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, link-local, loopback, and non-http/https schemes).
2. **Comprehensive SEO Engine**:
   - **Technical SEO**: Title, meta description, canonical, robots directives, OpenGraph/Twitter Cards, Viewport, Charset, HTTPS, H1-H6 hierarchy, image alt checks, internal/external links count & broken links check, structured data parser (JSON-LD Schema.org types: Product, Organization, Article, BreadcrumbList, FAQPage, etc.).
   - **On-Page SEO**: Title & description lengths, keyword presence in H1/H2/meta/title, semantic HTML usage.
   - **Content Quality**: Word count, sentence count, avg sentence length, paragraph count, Flesch Reading Ease score & level, thin content warning.
   - **Keyword Intelligence**: 1-gram, 2-gram, and 3-gram extraction, stopword stripping, density calculation, tracking keyword presence in Title, Description, H1, H2, URL, First Paragraph, Alt Tags.
   - **Product Page Intelligence**: Detects if page is e-commerce, extracts price, currency, availability, SKU, brand, product schema, review/rating data, product SEO score.
   - **Scoring & Issues**: Weighted score (Technical 25%, On-Page 25%, Content 20%, Keywords 15%, Performance 10%, Social/Schema 5%), categorized into Critical, Warning, and Passed items with clear "Why it matters" and "Recommended action".
   - **AI Recommendations**: High/Medium/Low priority fixes with real before/after guidance; supports pluggable OpenAI/Gemini or advanced built-in heuristic AI engine.
   - **Search Visibility & External API Section**: Strictly truthful — clearly communicates local crawl vs external search intelligence (SerpAPI, DataForSEO, GSC) with connection guides and clean locked status when not configured.
3. **Frontend UI/UX**:
   - Deep navy + electric blue / violet accents, glassmorphism, fluid dark/light theme switch.
   - Animated circular score gauge (SVG/canvas based with smooth counting animation).
   - Interactive Recharts breakdown bar chart, donut issues breakdown, keyword distribution bar charts, interactive keyword tag cloud.
   - Multi-step live analysis animation ("Connecting to website...", "Fetching webpage...", "Analyzing technical SEO...", etc.).
   - Demo mode with clearly marked banner for immediate presentation/testing.
   - One-click PDF / Printable SEO Audit Report generator.

## Verification Plan

### Automated / Backend Tests
- Create Python test script `test_analyzer.py` validating:
  - SSRF blocker against internal IPs and malformed URLs.
  - Parsing of test HTML fixtures (standard site, e-commerce site, broken meta site).
  - Scoring engine deterministic math (0-100 range and weights).
  - API endpoints `/api/health`, `/api/analyze`, `/api/report`.

### Manual & Interactive Verification
- Start FastAPI backend (`uvicorn app.main:app --port 8000`).
- Start Vite frontend (`npm run dev -- --port 5173`).
- Test real live URLs (e.g. `https://example.com`, `https://news.ycombinator.com`, `https://python.org`).
- Test Demo Mode toggle.
- Test PDF report generation and download.
- Verify dark/light mode toggle.
