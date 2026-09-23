# ⚡ SEOlytics AI — AI-Powered SEO & Search Visibility Analyzer

An enterprise-grade, full-stack AI-Powered SEO Website & Product Analyzer that crawls live accessible webpages, executes comprehensive technical, on-page, and content audits, extracts keyword densities across DOM elements, detects e-commerce schema & pricing data, computes deterministic weighted 0–100 SEO scores, classifies issues (Critical, Warnings, Passed), and generates actionable AI recommendations.

---

## 🌟 Key Features

- **🛡️ Real URL Crawling with SSRF Protection**:
  - Safe asynchronous HTTP crawler powered by `httpx` and `BeautifulSoup4`.
  - Built-in SSRF defense preventing requests to `localhost`, `127.0.0.1`, RFC 1918 private subnets (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), and link-local networks.
  - Full redirect chain logging, HTTP status code validation, and server response time (TTFB) benchmarking.
- **🔍 100+ SEO & Technical Audits**:
  - **Meta Directives**: Title presence/length (30–65 chars), Meta Description presence/length (120–165 chars), Canonical URLs, Robots meta directives (`noindex`, `nofollow`), Viewport, and Charset tags.
  - **Heading Hierarchy**: H1 count (exact 1 validation), H2/H3 semantic section nesting.
  - **Image SEO**: Image count, missing `alt` attributes, empty `alt` attributes, and `loading="lazy"` verification.
  - **Link Profile**: Total links, Internal vs External distribution, `rel="nofollow"` links, and empty anchor text detection.
  - **Structured Data / Schema.org**: JSON-LD and Microdata entity extraction (`Product`, `Organization`, `Article`, `BreadcrumbList`, `FAQPage`, `WebSite`).
  - **Security Headers**: HSTS, X-Content-Type-Options, X-Frame-Options, CSP.
- **📝 Content Quality & Readability Intelligence**:
  - Word count, sentence count, paragraph count, and average sentence length.
  - **Flesch Reading Ease Heuristic**: Classifies reading difficulty from *Very Easy (5th grade)* to *Difficult (College level)*.
  - Thin content warning (<300 words) and Text-to-HTML ratio calculator.
- **🎯 Keyword Intelligence & Placement Matrix**:
  - Automatically extracts top **1-word**, **2-word**, and **3-word** keyword phrases with stopword stripping.
  - Calculates exact frequency and density percentage.
  - Tracks keyword presence across 7 key zones: **Title**, **Meta Description**, **H1**, **H2**, **URL Slug**, **First Paragraph**, and **Image Alt attributes**.
  - Interactive Keyword Cloud & searchable matrix.
- **🛍️ E-Commerce & Product Page Intelligence**:
  - Automatically identifies if a target URL is an e-commerce product page.
  - Extracts Product Name, Brand, Price, Currency, Availability (`InStock`/`OutOfStock`), SKU, and Customer Reviews / Star Ratings (`AggregateRating`).
  - Generates specialized **Product SEO Score** and flags missing elements required for Google Shopping / Merchant rich results.
- **📊 Deterministic Weighted SEO Scoring Engine**:
  - **Technical SEO**: 25%
  - **On-Page SEO**: 25%
  - **Content Quality**: 20%
  - **Keyword Optimization**: 15%
  - **Performance / Server Speed**: 10%
  - **Social / Structured Data**: 5%
  - All metrics are calculated deterministically from real crawled data — never randomly fabricated.
- **🤖 Actionable AI Recommendation Engine**:
  - Analyzes detected audit failures and synthesizes prioritized High/Medium/Low action plans.
  - Provides practical code snippets and copy improvements.
  - Pluggable support for optional **Gemini** or **OpenAI** API keys, with an intelligent built-in expert rule engine fallback.
- **🔒 Truthful Search Visibility & SERP Boundaries**:
  - Strictly distinguishes between **Webpage-Derived Signals** (local DOM extraction) and **External Search Intelligence** (Google ranking positions, keyword monthly search volume, backlinks, organic traffic).
  - Integrates with supported providers (Google Search Console, SerpAPI, DataForSEO) when configured, and displays a clean locked state with no fabricated rank positions when disconnected.
- **📄 Instant Audit Report Export**:
  - Export self-contained, standalone **HTML Audit Reports**.
  - Export **Structured JSON** for automated pipelines.
  - Browser print-ready **PDF Audit Report** generation.
- **🌓 Modern SaaS Aesthetic & Dark/Light Mode**:
  - Built with Tailwind CSS, Recharts, and Lucide React.
  - Smooth circular score gauge animations and glassmorphism.
  - Persistent dark/light theme switch.
- **⚡ Demo Mode**:
  - Clearly marked **DEMO DATA** mode for testing without hitting live networks.

---

## 🏗️ Architecture & Technology Stack

```
SEOlytics AI
├── backend/
│   ├── app/
│   │   ├── config.py                 # Pydantic BaseSettings & Environment variables
│   │   ├── main.py                   # FastAPI app entrypoint, CORS & middleware
│   │   ├── models/
│   │   │   └── analysis_models.py    # Pydantic v2 schemas for all audit categories
│   │   ├── routes/
│   │   │   ├── analyze.py            # POST /api/analyze & specialized audit endpoints
│   │   │   ├── health.py             # GET /api/health
│   │   │   └── report.py             # POST /api/report/export-html & export-json
│   │   ├── services/
│   │   │   ├── crawler.py            # Async httpx client with SSRF & redirect tracking
│   │   │   ├── technical_seo.py      # Meta, robots, canonical, headings, links, images, schema
│   │   │   ├── onpage_seo.py         # On-page length checks, URL slugs, semantic HTML
│   │   │   ├── content_analyzer.py   # Word count, Flesch reading ease, thin content
│   │   │   ├── keyword_analyzer.py   # 1/2/3-gram extraction, density, location mapping
│   │   │   ├── product_analyzer.py   # E-commerce detection, product schema, price, SKU
│   │   │   ├── scoring_engine.py     # 0-100 weighted scoring & issue categorization
│   │   │   ├── ai_recommendations.py # Prioritized actionable fix synthesizer
│   │   │   ├── search_visibility.py  # External provider integration & boundaries
│   │   │   └── report_generator.py   # Standalone HTML report generator
│   │   └── utils/
│   │       ├── security.py           # SSRF protection & private IP filtering
│   │       └── text_processing.py    # NLP tokenization, stopwords, syllables
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/               # Navbar, Hero, ScoreGauge, Charts, Cards, Lists, Modals
│   │   ├── pages/                    # LandingPage, DashboardPage
│   │   ├── services/                 # api.js client, demoData.js
│   │   ├── hooks/                    # useTheme.js
│   │   ├── utils/                    # formatters.js
│   │   ├── App.jsx
│   │   └── index.css                 # Tailwind & custom glassmorphism design tokens
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

---

## 🚀 Quickstart & Local Installation

### Prerequisites
- **Python 3.10+** (Python 3.12 recommended)
- **Node.js 18+** & **npm**

---

### 1. Backend Setup

1. Open a terminal and navigate to `backend/`:
   ```bash
   cd backend
   ```

2. (Optional but recommended) Create a virtual environment:
   ```bash
   # Windows:
   python -m venv .venv
   .venv\Scripts\activate

   # macOS / Linux:
   python3 -m venv .venv
   source .venv/bin/activate
   ```

3. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables (optional):
   ```bash
   cp .env.example .env
   ```

5. Start the FastAPI backend server:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```
   - The backend will be available at: `http://localhost:8000`
   - Interactive Swagger API documentation: `http://localhost:8000/docs`

---

### 2. Frontend Setup

1. In a separate terminal, navigate to `frontend/`:
   ```bash
   cd frontend
   ```

2. Install npm dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   - The frontend will be available at: `http://localhost:5173`

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` in `backend/` to configure optional integrations:

```env
# General
APP_NAME="SEOlytics AI Backend"
APP_VERSION="1.0.0"
DEBUG=True
FRONTEND_URL="http://localhost:5173"

# AI Recommendation Provider (Optional)
# Options: 'builtin' (default expert engine), 'openai', 'gemini'
AI_PROVIDER="builtin"
AI_API_KEY=""
AI_MODEL="gemini-1.5-flash"

# External Search Intelligence Provider (Optional)
# Options: 'none' (default), 'serpapi', 'dataforseo', 'gsc'
SEO_API_PROVIDER="none"
SEO_API_KEY=""

# Security & Crawling Settings
CRAWLER_TIMEOUT_SECONDS=15
CRAWLER_MAX_REDIRECTS=5
ALLOW_PRIVATE_IPS=False # Must remain False for SSRF protection
```

---

## 📡 API Documentation

### 1. `POST /api/analyze`
Executes full audit pipeline on the target URL.

**Request Body:**
```json
{
  "url": "https://example.com/product",
  "include_ai": true,
  "custom_target_keywords": ["running shoes", "marathon gear"]
}
```

**Response Format:**
```json
{
  "url": "https://example.com/product",
  "canonical_url": "https://example.com/product",
  "analyzed_at": "2026-09-23T15:30:00Z",
  "execution_time_seconds": 1.15,
  "scores": {
    "overall_score": 82,
    "technical_score": 88,
    "onpage_score": 80,
    "content_score": 75,
    "keyword_score": 78,
    "performance_score": 90,
    "social_schema_score": 80,
    "product_score": 92
  },
  "technical_seo": { ... },
  "onpage_seo": { ... },
  "content_analysis": { ... },
  "keyword_analysis": { ... },
  "product_seo": { ... },
  "issues": [ ... ],
  "recommendations": [ ... ],
  "search_visibility": { ... }
}
```

### 2. `POST /api/report/export-html`
Compiles analysis JSON into a standalone, styled HTML document for download.

### 3. `GET /api/health`
Returns backend health status, app version, and connected AI / Search providers.

---

## 📐 SEO Scoring Methodology

The overall score (0–100) is deterministically calculated using weighted category benchmarks:

| Category | Weight | Key Factors Checked |
| :--- | :--- | :--- |
| **Technical SEO** | **25%** | HTTPS/SSL, Title tag existence, Meta Description existence, Viewport, Canonical, Robots directives (`noindex`), Image Alt ratios, Schema.org structured data. |
| **On-Page SEO** | **25%** | Optimal Title length (30-65 chars), Optimal Description length (120-165 chars), Single H1 tag, Clean lowercase hyphenated URL slug, Semantic HTML tags. |
| **Content Quality** | **20%** | Word count depth (300+ adequate, 900+ in-depth), Sentence count, Flesch Reading Ease score, Paragraph density, Text-to-HTML ratio. |
| **Keyword Optimization** | **15%** | Presence of extracted primary keywords across Title, H1, Meta Description, URL, and First Paragraph without keyword stuffing (>4.5% density). |
| **Performance** | **10%** | Server response time (TTFB < 800ms optimal, > 2000ms penalized) and HTML document payload size. |
| **Social & Schema** | **5%** | OpenGraph tags (`og:title`, `og:image`, `og:description`), Twitter Cards, and JSON-LD schema entities. |

---

## 🔒 Security & SSRF Protection

SEOlytics AI implements strict **Server-Side Request Forgery (SSRF)** protection:
1. Input URLs are normalized and protocol-verified (`http://` and `https://` only).
2. Domain hostnames are resolved via DNS and checked against private/reserved IPv4 and IPv6 blocks:
   - `0.0.0.0/8`, `10.0.0.0/8`, `127.0.0.0/8` (Loopback)
   - `169.254.0.0/16` (Link-local / Cloud metadata endpoints like AWS `169.254.169.254`)
   - `172.16.0.0/12`, `192.168.0.0/16` (Private LANs)
   - `::1/128`, `fc00::/7`, `fe80::/10` (IPv6 Private/Link-local)
3. Direct requests to localhost or non-routable hostnames are rejected with clear user error feedback.

---

## 📌 Limitations & Boundaries

- **Webpage-Derived Analysis**: All technical, on-page, keyword, and schema audits are computed directly from the live HTML document.
- **External Search Engine Data**: Google search ranking positions, keyword monthly search volumes, backlink profiles, and organic search traffic trends require an active external search provider API (e.g. SerpAPI, Google Search Console, or DataForSEO). SEOlytics AI **never fabricates artificial rank positions**.

---

## 🛠️ Testing

Run backend engine tests:
```bash
cd backend
python test_engine.py
```

---

## 📄 License
MIT License. Built for production web application workflows and enterprise SEO auditing.
