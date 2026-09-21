# 🛍️ PriceWise — AI-Powered Shopping Intelligence Platform

> **Search smarter. Compare better. Track prices. Understand value. Buy with confidence.**

PriceWise is a **full-stack, AI-powered shopping intelligence platform** designed to help users make better purchasing decisions by bringing product discovery, price comparison, price tracking, review intelligence, deal analysis, recommendations, and AI-assisted shopping into a single platform.

Instead of simply showing products, PriceWise is designed around the complete shopping decision journey:

**Discover → Search → Identify → Compare → Understand → Track → Analyze → Get Alerted → Make an Informed Purchase**

---

## ✨ Overview

Modern e-commerce often forces shoppers to manually compare products across multiple stores, investigate reviews, monitor price changes, evaluate deals, and determine whether a discount is actually valuable.

PriceWise aims to solve this problem by creating an intelligent shopping layer that can:

* 🔎 Search and discover products
* 🛒 Aggregate product and seller information
* 💰 Compare prices across available sources
* 📈 Analyze historical price behavior
* 🔔 Track products and create price alerts
* ⭐ Analyze reviews and sentiment
* 🤖 Assist users through an AI shopping assistant
* 🧠 Generate product recommendations and alternatives
* 📊 Calculate product/value intelligence
* 📝 Create shopping lists and comparisons
* 🔐 Provide authenticated and personalized experiences
* 🏗️ Support scalable data ingestion and analytics architecture

The platform is designed with a **modular, production-oriented architecture** so additional stores, data providers, AI models, search engines, analytics systems, and background workers can be integrated without redesigning the entire application.

---

# 🎯 Core Objectives

PriceWise is built around five major objectives:

### 1. Product Intelligence

Transform raw product information into useful shopping intelligence.

### 2. Price Intelligence

Help users understand not only the current price, but also price movement and historical context.

### 3. Review Intelligence

Use AI-assisted analysis to help users understand large volumes of product reviews.

### 4. Personalized Shopping Assistance

Allow users to interact with an AI shopping assistant using natural language.

### 5. Scalable Shopping Infrastructure

Provide an architecture capable of evolving from a student/project-scale application into a larger shopping intelligence platform.

---

# 🚀 Key Features

## 🔍 Intelligent Product Search

PriceWise provides a centralized search experience for discovering products.

The search architecture is designed to support:

* Product keyword search
* Category filtering
* Brand filtering
* Price filtering
* Store/source filtering
* Product matching
* Product identification
* Natural-language search
* Multimodal search architecture

The search layer is separated from the UI so different search technologies can be introduced later.

---

## 🤖 AI Shopping Assistant

The AI Shopping Assistant is one of the core experiences of PriceWise.

Users can ask questions such as:

> "Which laptop is better for programming under my budget?"

> "Find alternatives to this product."

> "Is this price a good deal?"

> "What are the major complaints about this product?"

> "Compare these three products."

The assistant is designed around **tool-assisted AI workflows** rather than relying only on generated text.

### AI capabilities include:

* Product comparison
* Price analysis
* Review analysis
* Alternative discovery
* Budget planning
* Shopping recommendations
* Natural-language product queries
* Multimodal shopping workflows

---

# 🧠 AI Agent Architecture

PriceWise contains modular AI agents for different shopping tasks.

### Price Analyst

Responsible for analyzing price-related information and identifying price trends.

### Review Analyst

Designed to analyze customer reviews, sentiment, and recurring topics.

### Alternative Finder

Helps identify alternative products based on available product information.

### Budget Planner

Designed to assist users in planning purchases around budget constraints.

This modular architecture allows each intelligence capability to evolve independently.

---

# 📊 Price Intelligence

PriceWise is designed to treat price as **time-series data**, rather than simply storing one current price.

The data architecture supports:

* Current prices
* Historical prices
* Daily price snapshots
* Price events
* Price statistics
* Price changes
* Price alerts
* Deal analysis

### Example intelligence

Instead of simply displaying:

> ₹49,999

PriceWise can eventually provide contextual information such as:

* Current price
* Historical price range
* Recent price movement
* Price drop percentage
* Historical low
* Historical high
* Price trend
* Alert threshold

This allows users to understand **whether a price is actually attractive**, rather than relying only on a discount badge.

---

# 🔔 Price Tracking & Alerts

Users can track products and receive notifications based on price conditions.

The architecture supports:

* Watchlists
* Price alerts
* Notification management
* Price-drop detection
* Alert evaluation
* Automated alert checks

Example:

> **"Notify me when this laptop drops below ₹60,000."**

The alert system can evaluate available pricing information and trigger a notification when the configured condition is satisfied.

---

# ⭐ Review Intelligence

Online stores can contain thousands of reviews, making manual analysis difficult.

PriceWise provides an architecture for extracting useful information from reviews.

Potential analysis includes:

* Sentiment
* Positive aspects
* Negative aspects
* Recurring complaints
* Frequently mentioned features
* Review topics
* Review summaries
* Review embeddings

The objective is to transform large volumes of unstructured reviews into concise, useful shopping insights.

---

# 🏷️ Deal Intelligence

PriceWise is designed to distinguish between:

* Current price
* Discount
* Price drop
* Historical pricing
* Deals
* Coupons
* Promotional information

This prevents a simple percentage discount from being treated as the complete definition of a good deal.

---

# 🧮 Value Intelligence

PriceWise includes a scoring layer designed to evaluate products using multiple signals.

Potential signals include:

* Price
* Product attributes
* Reviews
* Ratings
* Historical pricing
* Availability
* User requirements
* Product category
* Comparable alternatives

The goal is to help users understand **overall value**, not simply find the lowest price.

---

# 🔄 Product Matching

Different stores may represent the same product differently.

PriceWise therefore includes a product matching architecture designed around:

* Product identifiers
* Brand
* Model
* SKU
* Product variants
* Attributes
* Source information
* Canonical product records

This allows multiple offers to be associated with the same underlying product.

---

# 🏪 Multi-Store Architecture

PriceWise is designed to work with multiple product sources.

The provider architecture includes abstractions for:

```text
Product Source
      ↓
Provider
      ↓
Normalization
      ↓
Product Matching
      ↓
Canonical Product
      ↓
Offers
      ↓
Price History
      ↓
Analytics
```

This makes it possible to add new providers without tightly coupling them to the frontend.

---

# 🌐 Data Provider Architecture

PriceWise contains a provider abstraction layer.

The architecture includes:

* Provider registry
* Provider manager
* Catalog interfaces
* Provider types
* Firecrawl integration layer
* Provider execution tracking

The system can therefore support multiple data acquisition strategies while maintaining a consistent internal data model.

---

# 📸 Multimodal Shopping Architecture

PriceWise is designed with a multimodal shopping workflow.

The architecture can support inputs such as:

* 📝 Text
* 🖼️ Product images
* 📷 Screenshots
* 🔗 Product URLs
* 🎤 Voice
* 📦 Barcodes

For example, a user could provide a screenshot of a product and ask:

> "Find this product and compare its available prices."

The multimodal workflow is separated from the core product intelligence layer so additional input modalities can be introduced independently.

---

# 🔐 Authentication & Security

PriceWise includes an authentication architecture designed for secure user access.

The application includes:

* Authentication context
* Protected routes
* Login
* Signup
* Auth callback
* User profiles
* User settings
* Security settings

### Security principles

PriceWise follows important security practices such as:

* Environment variables for secrets
* Server-side handling of sensitive credentials
* Supabase Row Level Security architecture
* No plaintext password storage
* No client-side service-role credentials
* Protected application routes
* Controlled AI tool execution

> ⚠️ **Never commit `.env.local` or other secret files to the repository.**

The repository intentionally includes `.env.example` for configuration documentation while keeping local secrets excluded.

---

# 🗄️ Database Architecture

PriceWise uses **PostgreSQL through Supabase** as its primary transactional database.

The architecture is designed around a normalized shopping intelligence data model.

### Major data domains

```text
Users
 ├── Profiles
 ├── Preferences
 ├── Watchlists
 ├── Alerts
 ├── Notifications
 ├── Shopping Lists
 └── Purchases

Catalog
 ├── Categories
 ├── Brands
 ├── Products
 ├── Variants
 ├── Identifiers
 ├── Attributes
 └── Images

Commerce
 ├── Stores
 ├── Sellers
 ├── Offers
 ├── Prices
 ├── Deals
 └── Coupons

Intelligence
 ├── Price History
 ├── Price Statistics
 ├── Reviews
 ├── Sentiment
 ├── Review Topics
 ├── Embeddings
 └── Recommendations

AI
 ├── Conversations
 ├── Messages
 ├── Tool Calls
 ├── Evaluations
 └── Provider Runs

Analytics
 ├── Search Events
 ├── Product Events
 ├── Daily Metrics
 └── Data Quality Events
```

---

# 📚 Database Schema

The repository includes multiple Supabase migrations.

```text
supabase/
└── migrations/
    ├── 001_initial_schema.sql
    ├── 002_full_intelligence_schema.sql
    └── 003_enterprise_scale_schema.sql
```

These migrations progressively define the application's data architecture.

The schema is designed to support:

* Product catalog management
* Product variants
* Product identifiers
* Stores
* Sellers
* Offers
* Price history
* Reviews
* Review intelligence
* Embeddings
* Search events
* Watchlists
* Price alerts
* Notifications
* Deals
* Coupons
* Comparisons
* Shopping lists
* Purchases
* Recommendations
* AI conversations
* AI tool calls
* Provider execution
* Analytics
* Data quality monitoring

---

# 🧬 Vector Intelligence

PriceWise is designed to use **vector embeddings** for semantic intelligence.

Potential vector-enabled use cases include:

* Semantic product search
* Product similarity
* Similar product discovery
* Review similarity
* Recommendation systems
* Retrieval-Augmented Generation
* AI shopping context retrieval

The architecture is compatible with **PostgreSQL + pgvector**.

---

# 🔎 Search Architecture

The application intentionally separates search logic from the UI.

This allows future integration with systems such as:

* PostgreSQL search
* OpenSearch
* Elasticsearch
* Meilisearch
* Typesense

The objective is to provide a search abstraction that can scale independently from the main transactional database.

---

# 📈 Analytics Architecture

For large-scale deployments, analytics workloads should not compete with transactional workloads.

PriceWise therefore provides an analytics abstraction that can evolve toward systems such as:

* ClickHouse
* BigQuery
* Snowflake
* Databricks

The architecture supports high-volume events and aggregated analytical tables.

---

# ⚡ Scalable Data Architecture

PriceWise is designed with scalability in mind.

A high-level architecture looks like:

```text
                 ┌───────────────────────┐
                 │       Frontend        │
                 │ Next.js + React + TS  │
                 └───────────┬───────────┘
                             │
                             ▼
                 ┌───────────────────────┐
                 │     Application API   │
                 │       Next.js         │
                 └───────────┬───────────┘
                             │
             ┌───────────────┼────────────────┐
             ▼               ▼                ▼
      ┌────────────┐  ┌─────────────┐  ┌──────────────┐
      │ AI Engine  │  │ Product     │  │ Alert/Job    │
      │ & Agents   │  │ Intelligence│  │ Processing   │
      └─────┬──────┘  └──────┬──────┘  └──────┬───────┘
            │                  │                │
            └──────────────────┼────────────────┘
                               ▼
                     ┌──────────────────┐
                     │ Supabase /       │
                     │ PostgreSQL       │
                     └────────┬─────────┘
                              │
               ┌──────────────┼──────────────┐
               ▼              ▼              ▼
          ┌──────────┐  ┌───────────┐  ┌────────────┐
          │ pgvector │  │ Search    │  │ Analytics  │
          │          │  │ Engine    │  │ Platform   │
          └──────────┘  └───────────┘  └────────────┘
```

---

# 🧱 Technology Stack

## Frontend

| Technology    | Purpose                    |
| ------------- | -------------------------- |
| Next.js       | Full-stack React framework |
| React         | UI development             |
| TypeScript    | Type safety                |
| Tailwind CSS  | Styling                    |
| shadcn/ui     | UI components              |
| Radix UI      | Accessible primitives      |
| Lucide        | Icons                      |
| Framer Motion | Animations                 |
| Recharts      | Data visualization         |

---

## Backend

| Technology         | Purpose                  |
| ------------------ | ------------------------ |
| Next.js App Router | Application architecture |
| Next.js API Routes | Backend endpoints        |
| TypeScript         | Backend type safety      |
| Zod                | Validation               |
| Supabase           | Backend platform         |
| PostgreSQL         | Relational database      |

---

## AI / ML

| Technology   | Purpose                              |
| ------------ | ------------------------------------ |
| LLMs         | Shopping intelligence                |
| Ollama       | Local/model provider architecture    |
| Gemma        | Model integration architecture       |
| pgvector     | Vector similarity                    |
| Embeddings   | Semantic retrieval                   |
| RAG          | Context-aware AI                     |
| Tool Calling | Controlled AI workflows              |
| SARIMAX      | Time-series forecasting architecture |
| Scikit-learn | ML utilities/evaluation              |

---

## Data & Integrations

| Technology | Purpose                    |
| ---------- | -------------------------- |
| Firecrawl  | Web/data acquisition layer |
| Supabase   | Database & authentication  |
| PostgreSQL | Transactional data         |
| ReportLab  | PDF report generation      |

---

## Development

| Tool    | Purpose                        |
| ------- | ------------------------------ |
| Git     | Version control                |
| GitHub  | Source control & collaboration |
| VS Code | Development environment        |
| npm     | Package management             |
| ESLint  | Code quality                   |
| Vercel  | Deployment target              |

---

# 📁 Project Structure

```text
PriceWise/
│
├── app/
│   ├── admin/
│   │   ├── ai/
│   │   ├── analytics/
│   │   ├── jobs/
│   │   ├── offers/
│   │   ├── products/
│   │   ├── providers/
│   │   └── users/
│   │
│   ├── ai-assistant/
│   ├── alerts/
│   ├── api/
│   │   ├── ai/
│   │   ├── alerts/
│   │   └── search/
│   │
│   ├── auth/
│   ├── categories/
│   ├── compare/
│   ├── dashboard/
│   ├── deals/
│   ├── history/
│   ├── login/
│   ├── product/
│   ├── recommendations/
│   ├── search/
│   ├── settings/
│   ├── shopping-lists/
│   ├── signup/
│   ├── stores/
│   ├── trending/
│   └── watchlist/
│
├── components/
│   ├── ai/
│   ├── auth/
│   ├── dashboard/
│   ├── layout/
│   ├── notifications/
│   ├── search/
│   └── ui/
│
├── lib/
│   ├── ai/
│   │   ├── agents/
│   │   ├── embeddings/
│   │   ├── evaluation/
│   │   ├── tools/
│   │   └── workflows/
│   │
│   ├── alerts/
│   ├── auth/
│   ├── db/
│   ├── jobs/
│   ├── products/
│   ├── providers/
│   └── scoring/
│
├── scripts/
│   ├── verify-auth.mjs
│   └── verify-engine.mjs
│
├── supabase/
│   └── migrations/
│
├── types/
│   └── index.ts
│
├── public/
│
├── __tests__/
│
├── .env.example
├── .gitignore
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

---

# ⚙️ Getting Started

## Prerequisites

Make sure the following are installed:

* Node.js 20+
* npm
* Git
* A Supabase project
* Required AI/data-provider credentials

Check your versions:

```bash
node --version
npm --version
git --version
```

---

# 📥 Installation

Clone the repository:

```bash
git clone https://github.com/srija5637/PriceWise.git
```

Navigate into the project:

```bash
cd PriceWise
```

Install dependencies:

```bash
npm install
```

---

# 🔐 Environment Configuration

Create your local environment file:

```bash
cp .env.example .env.local
```

On Windows PowerShell, you can use:

```powershell
Copy-Item .env.example .env.local
```

Then configure the required environment variables.

Example:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=

OPENAI_API_KEY=

FIRECRAWL_API_KEY=
```

> **Important:** Never commit `.env.local` to GitHub.

---

# 🗄️ Supabase Setup

1. Create a Supabase project.
2. Copy the project URL.
3. Copy the required public key.
4. Configure your environment variables.
5. Run the migrations located inside:

```text
supabase/migrations/
```

The database migrations establish the PriceWise schema.

---

# ▶️ Run the Development Server

Start the application:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

The application should now be available locally.

---

# 🏗️ Production Build

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

---

# 🧪 Testing

Run the project's tests using the configured test tooling:

```bash
npm test
```

Additional verification scripts are available:

```bash
node scripts/verify-auth.mjs
```

```bash
node scripts/verify-engine.mjs
```

---

# 🧹 Code Quality

Run linting with:

```bash
npm run lint
```

Fix issues before creating a production deployment.

---

# 🔄 Application Flow

A typical PriceWise shopping workflow looks like this:

```text
User
 │
 ▼
Search / Upload / Ask AI
 │
 ▼
Product Discovery
 │
 ▼
Provider Data Collection
 │
 ▼
Normalization
 │
 ▼
Product Matching
 │
 ▼
Offer & Price Comparison
 │
 ├───────────────┐
 ▼               ▼
Price Analysis   Review Analysis
 │               │
 └───────┬───────┘
         ▼
    AI Intelligence
         │
         ▼
Recommendations / Alternatives
         │
         ▼
Price Tracking
         │
         ▼
Alerts & Notifications
```

---

# 🧠 AI Safety & Data Integrity

PriceWise follows a critical principle:

> **AI should not invent shopping facts.**

The AI layer should never fabricate:

* Current prices
* Product availability
* Seller information
* Ratings
* Reviews
* Delivery dates
* Coupons
* Warranty information
* Product specifications

If reliable information is unavailable, the system should clearly indicate that the data is unavailable rather than generating an unsupported answer.

This is particularly important for a shopping intelligence platform because users may make financial decisions based on the information presented.

---

# 🔒 Data Security Principles

PriceWise follows these security principles:

### Secrets

Never expose API keys or service credentials to the client.

### Authentication

Protected routes and authenticated user contexts should be enforced server-side where appropriate.

### Database

Use Row Level Security for user-specific data.

### AI Tools

AI agents should operate through controlled tools rather than unrestricted database access.

### User Data

User preferences and shopping information should only be accessible according to the application's authorization rules.

---

# 📈 Enterprise-Scale Design

Although PriceWise can run as a modern full-stack web application, its architecture is intentionally designed with future scale in mind.

Potential high-scale architecture:

```text
                   ┌──────────────────┐
                   │   Web / Mobile   │
                   └────────┬─────────┘
                            │
                            ▼
                    ┌──────────────┐
                    │ API Gateway  │
                    └──────┬───────┘
                           │
        ┌──────────────────┼───────────────────┐
        ▼                  ▼                   ▼
 Product Services    AI Services       User Services
        │                  │                   │
        └──────────────────┼───────────────────┘
                           ▼
                     Event Pipeline
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
      PostgreSQL        Vector DB        Analytics
          │                │                │
          ▼                ▼                ▼
      Catalog Data     AI Retrieval     BI / Metrics
```

For high-volume deployments, components can be separated into independently scalable services.

---

# 🧩 Extensibility

PriceWise is designed so additional capabilities can be added without rewriting the entire application.

Potential future integrations include:

* Additional shopping providers
* More AI model providers
* Advanced vector databases
* Dedicated search engines
* Redis caching
* Message queues
* Background worker clusters
* Real-time notifications
* Mobile applications
* Browser extensions
* Barcode scanning
* Voice shopping
* Personalized recommendation systems
* Advanced forecasting
* Enterprise analytics

---

# 🛣️ Roadmap

## Phase 1 — Core Platform

* [x] Next.js application
* [x] Product discovery architecture
* [x] Authentication architecture
* [x] Dashboard
* [x] Product pages
* [x] Search
* [x] Comparison
* [x] Watchlist
* [x] Alerts
* [x] AI assistant architecture
* [x] Provider abstraction
* [x] Supabase migrations

## Phase 2 — Intelligence

* [ ] Advanced semantic search
* [ ] Product embeddings
* [ ] Review embeddings
* [ ] Advanced review summarization
* [ ] Price forecasting
* [ ] Personalized recommendations
* [ ] Advanced deal intelligence

## Phase 3 — Data Platform

* [ ] Larger provider ecosystem
* [ ] Automated ingestion pipelines
* [ ] Event streaming
* [ ] Distributed background workers
* [ ] Advanced caching
* [ ] Dedicated search infrastructure

## Phase 4 — Multimodal Shopping

* [ ] Image-based product identification
* [ ] Screenshot search
* [ ] Barcode recognition
* [ ] Voice shopping
* [ ] URL intelligence
* [ ] Multimodal AI agent

## Phase 5 — Scale

* [ ] Mobile application
* [ ] Browser extension
* [ ] Enterprise analytics
* [ ] Advanced personalization
* [ ] Large-scale recommendation infrastructure
* [ ] Distributed analytics platform

---

# 📊 Project Architecture Principles

PriceWise follows several important engineering principles.

### Separation of Concerns

UI, business logic, AI, data providers, database access, and analytics are separated into dedicated modules.

### Provider Abstraction

External data providers should not dictate the internal application architecture.

### Canonical Product Model

Different representations of the same product should be normalized into a canonical product model.

### Data-First AI

AI decisions should be grounded in actual application data.

### Scalable Storage

Historical and analytical datasets should be designed for high-volume workloads.

### Security by Design

Authentication, authorization, secrets, and AI tool access should be treated as first-class architectural concerns.

---

# 🧑‍💻 Development Philosophy

PriceWise is not intended to be just a product-comparison UI.

It is designed as an **intelligent shopping infrastructure layer**.

The long-term goal is to move from:

```text
"Where can I buy this?"
```

toward:

```text
"What should I buy,
why should I buy it,
when should I buy it,
and is this actually a good deal?"
```

---

# 📸 Product Areas

The application currently contains dedicated experiences for:

* 🏠 Home
* 📊 Dashboard
* 🔎 Search
* 🤖 AI Assistant
* ⚖️ Compare
* 💰 Deals
* 🔔 Alerts
* ❤️ Watchlist
* 📈 Price History
* 🛍️ Shopping Lists
* ⭐ Recommendations
* 🏪 Stores
* 🔥 Trending Products
* ⚙️ Settings
* 🔐 Security
* 👤 Profile
* 🛠️ Admin
* 📊 Analytics
* 🧠 AI Administration
* 🔌 Provider Management
* 👥 User Management

---

# 🤝 Contributing

Contributions are welcome.

### 1. Fork the repository

```bash
git fork
```

Or fork the repository directly through GitHub.

### 2. Clone your fork

```bash
git clone <your-fork-url>
```

### 3. Create a feature branch

```bash
git checkout -b feature/your-feature
```

### 4. Make your changes

Follow the existing project structure and coding conventions.

### 5. Run validation

```bash
npm run lint
npm run build
```

### 6. Commit

```bash
git add .
git commit -m "Add your feature"
```

### 7. Push

```bash
git push origin feature/your-feature
```

### 8. Open a Pull Request

Describe:

* What changed
* Why it changed
* How it was tested
* Any configuration changes required

---

# 🐛 Reporting Issues

When reporting a bug, include:

* Operating system
* Node.js version
* Browser
* Steps to reproduce
* Expected behavior
* Actual behavior
* Relevant console/server errors
* Screenshots where applicable

Never include API keys, passwords, tokens, or other secrets in an issue.

---

# 📄 License

This project currently does not specify a public open-source license.

If the repository is intended to be open source, add an appropriate `LICENSE` file before distributing or accepting external contributions.

---

# 👩‍💻 Author

## Srija Das

**B.Tech Information Technology | Software Engineer Aspirant**

Interested in:

* Artificial Intelligence
* Machine Learning
* Cloud Computing
* Full-Stack Development
* Data Engineering
* Distributed Systems
* Product Engineering

PriceWise is being developed as a full-stack AI engineering project combining **software engineering, AI agents, data engineering, product intelligence, and scalable system architecture**.

---

# ⭐ Why PriceWise?

Most shopping applications answer:

> **"What products are available?"**

PriceWise is designed to answer something more useful:

> **"What should I consider before I buy this product?"**

By combining product data, pricing intelligence, historical trends, reviews, AI reasoning, personalization, and alerts, PriceWise aims to become an intelligent decision-support layer between consumers and the modern e-commerce ecosystem.

---

## 🛍️ PriceWise

**Search smarter.
Compare better.
Track prices.
Understand value.
Buy with confidence.**

---

<p align="center">

**Built with ❤️ using Next.js, React, TypeScript, PostgreSQL, Supabase & AI**

</p>
