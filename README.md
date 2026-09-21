# 🛍️ PriceWise — Shop Smarter. Save More.

PriceWise is an **AI-powered multi-store product price comparison, price tracking, review analysis, deal discovery, and shopping intelligence platform**.

The core experience is:
> **Search once → Compare everywhere → Understand the product → Track the price → Buy smarter.**

---

## 🌟 Key Features

### 1. Multi-Store Real-Time Price Comparison
- Search any electronics, laptop, smartphone, TV, audio gear, or appliance.
- Compare live prices across top e-commerce retailers (**Amazon, Flipkart, Croma, Reliance Digital, Vijay Sales, Myntra**).
- Displays verified merchant availability, delivery speed, warranty, and seller verification.
- **Strict Data Integrity Guarantee**: PriceWise never fabricates prices, ratings, or reviews. If an item or attribute was not retrieved, it states "Data unavailable" or "Last checked: X mins ago".

### 2. Transparent PriceWise Value Score
Unlike black-box rating algorithms, the PriceWise Value Score uses a centralized, mathematically transparent formula:
- **40% Price Score**: Normalized relative to market median and lowest verified price.
- **25% Rating Score**: Scaled directly from verified customer feedback.
- **15% Review Confidence**: Logarithmic Bayesian confidence curve accounting for review volume.
- **10% Seller Reputation**: Official / authorized retailer status.
- **10% Fulfillment Speed**: Prime / same-day / 1-2 day delivery evaluation.
- Every offer features an interactive *"Why this score?"* modal explaining the factor-by-factor math.

### 3. Canonical Product & Variant Matching Engine
- Intelligent query parser extracts Brand, Model, Storage, RAM, Color, and Screen Size.
- Canonical variant mapping normalizes title variations across retailers (e.g. `Apple iPhone 16 128GB Black` and `iPhone 16 (128 GB) - Black`).
- **Strict Variant Isolation**: Preserves storage and RAM boundaries so `128GB` and `256GB` models are never incorrectly conflated.

### 4. Interactive Price History Analytics
- Powered by responsive Recharts Area and Line charts.
- Timeframe toggles: **7D, 30D, 90D, 6M, 1Y**.
- Comprehensive metrics grid: Current Price, Lowest Recorded Price, Highest Recorded Price, Average Price, and 7d/30d/90d change percentages.

### 5. AI-Synthesized Customer Review Analysis
- Aggregates verified reviews across retailers.
- Highlights:
  - ✓ Top positive customer themes
  - • Reported caveats and complaints
  - Common strengths & common trade-offs
- Clearly attributed to source review sets with update timestamps.

### 6. Dynamic Category Comparison Matrix (`/compare`)
- Compare 2 to 4 products side-by-side.
- Category-adaptive specifications:
  - **Smartphones**: Processor, RAM, Storage, Screen, Camera, Battery, OS, Warranty.
  - **Laptops**: CPU, GPU, RAM, SSD, Screen, Battery Life, Weight, OS.
  - **TVs & Audio**: Panel type, Refresh rate, Driver size, ANC, Bluetooth version.

### 7. Autonomous Price Alerts & Watchlist
- Configure custom target price thresholds (e.g. *"Alert me when price drops below ₹65,000"*).
- Background-executable evaluation route (`/api/alerts/check`) that evaluates active offers against user thresholds.

### 8. AI Shopping Assistant (`/ai-assistant`)
- Conversational shopping interface.
- Converts natural language questions (*"Find a phone under ₹30,000 with a good camera"*) into structured query filters.
- Strictly grounded in real catalog products and offers—zero price or store hallucinations.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | Next.js 14+ (App Router), React, TypeScript |
| **Styling & Design** | Tailwind CSS v4, Custom Design Tokens, Glassmorphism, Responsive Drawer |
| **UI Primitives** | Custom accessible shadcn-style components (Button, Card, Dialog, Tabs, Table, Badge, Progress, Skeleton) |
| **Icons & Charts** | Lucide React, Recharts |
| **Backend** | Next.js Route Handlers, Server-Only Secret Protection, Zod validation |
| **Database & Auth** | Supabase PostgreSQL, Supabase Auth (Google OAuth & Phone OTP), Row Level Security (RLS) |
| **Web Extraction** | Modular Data Provider Architecture (`FirecrawlProvider`, `CatalogProvider`, `ProviderManager`) |

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js v20+ LTS (installed in `~/.local/node` or on system PATH)
- npm v10+

### 1. Clone & Install
```bash
git clone https://github.com/your-username/pricewise.git
cd pricewise
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in the credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

FIRECRAWL_API_KEY=fc-your-api-key

AI_API_KEY=your-ai-api-key
```
*(Note: If Supabase or Firecrawl keys are omitted, PriceWise runs seamlessly in Offline/Demo mode using its verified local electronics catalog and interactive test OTP `123456`)*.

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Core Logic Tests
```bash
node scripts/verify-engine.mjs
```

### 5. Build for Production
```bash
npm run build
npm run start
```

---

## 🗄️ Database & Supabase Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Navigate to **SQL Editor** in your Supabase Dashboard.
3. Open `supabase/migrations/001_initial_schema.sql` and run the script.
   - Creates `profiles`, `categories`, `products`, `product_variants`, `stores`, `offers`, `price_history`, `watchlists`, `price_alerts`, `searches`, and `product_comparisons`.
   - Enables Row Level Security (RLS) policies ensuring users only access their own private watchlists, alerts, and searches while catalog offers remain publicly queryable.
   - Creates the `on_auth_user_created` trigger for automatic profile generation.

---

## 🌐 Firecrawl Web Scraping Setup

1. Create an account at [firecrawl.dev](https://www.firecrawl.dev).
2. Generate an API Key and set it in `.env.local`:
   ```env
   FIRECRAWL_API_KEY=fc-your-api-key-here
   ```
3. The `FirecrawlProvider` in `lib/providers/firecrawl.ts` automatically executes permitted extractions with retry logic, timeout guards, and error resilience.

---

## ☁️ Vercel Deployment

1. Push your repository to GitHub / GitLab / Bitbucket.
2. Import the repository in [Vercel](https://vercel.com).
3. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `FIRECRAWL_API_KEY`
   - `AI_API_KEY`
4. Click **Deploy**. Vercel will automatically run `npm run build` and launch the application on edge infrastructure.

---

## ⚖️ Known Limitations & Future Roadmap
- **SMS Vendor Integration**: Phone OTP uses Supabase Auth SMS; in local/development mode, verification code `123456` is enabled to facilitate testing without external carrier charges.
- **Affiliate Feeds**: Future releases can easily register affiliate network feeds (e.g. Cuelinks, EarnKaro, Amazon Associates) via the modular `ProductDataProvider` interface.
- **Browser Extension**: A companion Chrome extension can reuse the `/api/search` and `/api/products` endpoints to show comparison badges while shopping on retailer pages.
