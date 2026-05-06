# 🛡️ HTTP Security Header Scanner

**Evaluation of HTTP Security Header Implementation and Compliance in Public Websites**

A full-stack web application that scans public websites for HTTP security header compliance, computes a security score (0–100), assigns a letter grade (A–F), and provides actionable recommendations.

![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![Next.js](https://img.shields.io/badge/Next.js-15-black) ![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-blue)

---

## 📋 Features

- **Website Scanner** — Enter any public URL and analyze its HTTP security headers
- **6 Security Headers Analyzed** — CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- **Scoring Engine** — Weighted scoring algorithm (0–100) with A–F grading
- **Misconfiguration Detection** — Detects improperly configured headers (not just presence)
- **Recommendations Engine** — Detailed fix guidance with example configurations for each missing header
- **Analytics Dashboard** — Header adoption charts, score distribution, website rankings
- **PDF Export** — Download scan results as a formatted PDF report
- **SSRF Protection** — URL validation blocks internal/private IP scanning
- **Historical Scans** — All results stored in Supabase for trend analysis

---

## 🏗️ Architecture

```
┌──────────────────────┐      ┌──────────────────────┐      ┌─────────────────┐
│   Next.js Frontend   │◄────►│   Express Backend    │◄────►│    Supabase      │
│   (Port 3000)        │ API  │   (Port 5000)        │      │   PostgreSQL     │
│                      │      │                      │      │                  │
│  • Home Page         │      │  POST /api/scan      │      │  • websites      │
│  • Results Page      │      │  GET  /api/results   │      │  • scans         │
│  • Dashboard         │      │  GET  /api/analytics │      │  • headers       │
└──────────────────────┘      └──────────────────────┘      └─────────────────┘
```

---

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- **Supabase** account (free tier works)

### 1. Clone / Download the Project

```bash
cd "HTTP Security Compliance Web App Scanner"
```

### 2. Set Up the Database

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Open your project → **SQL Editor**
3. Paste the contents of `database/setup.sql` and click **Run**
4. This creates three tables: `websites`, `scans`, `headers`

### 3. Configure Environment Variables

**Backend** — edit `backend/.env`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### 4. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 5. Run the Application

Open **two terminals**:

```bash
# Terminal 1 — Backend API
cd backend
npm run dev
```

```bash
# Terminal 2 — Frontend
cd frontend
npm run dev
```

### 6. Open in Browser

Navigate to **http://localhost:3000**

---

## 📁 Project Structure

```
HTTP Security Compliance Web App Scanner/
├── backend/
│   ├── .env                        # Environment variables
│   ├── package.json
│   └── src/
│       ├── index.js                # Express server
│       ├── config/
│       │   └── supabase.js         # Supabase client
│       ├── middleware/
│       │   ├── security.js         # Helmet, CORS, rate limiting
│       │   └── validation.js       # URL validation + SSRF protection
│       ├── scanner/
│       │   ├── headerScanner.js    # HTTP scanner engine
│       │   ├── scoreEngine.js      # Scoring algorithm
│       │   └── recommendations.js  # Recommendation text
│       ├── routes/
│       │   ├── scan.js             # POST /api/scan
│       │   ├── results.js          # GET /api/results/:id + PDF
│       │   └── analytics.js        # GET /api/analytics
│       └── db/
│           └── queries.js          # Database operations
├── frontend/
│   ├── package.json
│   ├── next.config.js              # API proxy to backend
│   └── src/
│       ├── app/
│       │   ├── layout.js           # Root layout
│       │   ├── globals.css         # Design system
│       │   ├── page.js             # Home page
│       │   ├── results/[id]/page.js# Results page
│       │   └── dashboard/page.js   # Analytics dashboard
│       ├── components/
│       │   ├── Navbar.js
│       │   ├── ScoreCard.js
│       │   ├── GradeIndicator.js
│       │   ├── HeaderTable.js
│       │   ├── RecommendationsPanel.js
│       │   ├── RecentScans.js
│       │   └── charts/
│       │       ├── AdoptionChart.js
│       │       └── ScoreDistribution.js
│       └── lib/
│           ├── api.js              # Axios API client
│           └── utils.js            # Utilities
├── database/
│   └── setup.sql                   # Database schema
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/scan` | Scan a website URL |
| `GET` | `/api/results/:id` | Get scan results by ID |
| `GET` | `/api/results/:id/pdf` | Download PDF report |
| `GET` | `/api/analytics` | Get aggregated statistics |
| `GET` | `/api/health` | Health check |

### Example — Scan Request

```bash
curl -X POST http://localhost:5000/api/scan \
  -H "Content-Type: application/json" \
  -d '{"url": "https://google.com"}'
```

### Example — Response

```json
{
  "scanId": "uuid",
  "website": { "url": "https://google.com", "category": "Technology" },
  "score": 45,
  "grade": "F",
  "headers": [
    { "name": "Content-Security-Policy", "status": "missing", "value": null },
    { "name": "Strict-Transport-Security", "status": "present", "value": "max-age=31536000" },
    { "name": "X-Frame-Options", "status": "present", "value": "SAMEORIGIN" }
  ],
  "recommendations": [...]
}
```

---

## 📊 Scoring System

| Header | Weight |
|--------|--------|
| Content-Security-Policy | 25 points |
| Strict-Transport-Security | 20 points |
| X-Frame-Options | 15 points |
| X-Content-Type-Options | 15 points |
| Referrer-Policy | 15 points |
| Permissions-Policy | 10 points |
| **Total** | **100 points** |

**Status scoring:** Present = 100%, Misconfigured = 40%, Missing = 0%

**Grading:** A (90–100), B (80–89), C (70–79), D (60–69), F (<60)

---

## 🔒 Security Features

- **Helmet** — Sets secure HTTP response headers on the backend
- **CORS** — Restricts API access to the frontend origin
- **Rate Limiting** — 30 requests per minute per IP
- **SSRF Protection** — Blocks scanning of private/internal IPs and localhost
- **Input Validation** — URL format and scheme validation
- **Environment Variables** — Sensitive credentials stored in `.env`

---

## 📝 Technologies Used

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, Tailwind CSS v4 |
| Charts | Chart.js, react-chartjs-2 |
| API Client | Axios |
| Backend | Node.js, Express.js |
| Security | Helmet, express-rate-limit |
| Database | Supabase (PostgreSQL) |
| PDF Export | html-pdf-node |

---

## 📄 License

This project is developed as a Computer Science final year research project.
