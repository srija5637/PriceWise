-- =================================================================
-- PRICEWISE — ENTERPRISE LARGE-SCALE PRODUCT & PRICE DATA ARCHITECTURE
-- Migration: 003_enterprise_scale_schema.sql
-- Designed to scale from 10K to 10M+ products & 100M+ price observations
-- =================================================================

-- 1. Product Identifiers (GTIN, EAN, UPC, ISBN, MPN, SKU, ASIN, Model Number)
create table if not exists public.product_identifiers (
  id text primary key default ('id_' || gen_random_uuid()),
  product_id text references public.products(id) on delete cascade not null,
  product_variant_id text references public.product_variants(id) on delete cascade,
  identifier_type text not null check (identifier_type in ('GTIN', 'EAN', 'UPC', 'ISBN', 'MPN', 'SKU', 'ASIN', 'MODEL_NUMBER', 'BARCODE')),
  identifier_value text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (identifier_type, identifier_value)
);

create index if not exists idx_product_identifiers_value on public.product_identifiers(identifier_value);
create index if not exists idx_product_identifiers_product on public.product_identifiers(product_id);

-- 2. Extended Product Attributes (EAV model for dynamic category specs)
create table if not exists public.product_attributes (
  id text primary key default ('attr_' || gen_random_uuid()),
  product_id text references public.products(id) on delete cascade not null,
  product_variant_id text references public.product_variants(id) on delete cascade,
  attribute_name text not null,
  attribute_value text not null,
  is_filterable boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_product_attributes_lookup on public.product_attributes(product_id, attribute_name);

-- 3. Verified Sellers & Store Locations
create table if not exists public.sellers (
  id text primary key default ('seller_' || gen_random_uuid()),
  store_id text references public.stores(id) on delete cascade not null,
  name text not null,
  rating numeric(3, 2) default 4.5 check (rating >= 1.0 and rating <= 5.0),
  rating_count integer default 0,
  verified boolean default false not null,
  return_policy_summary text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.store_locations (
  id text primary key default ('loc_' || gen_random_uuid()),
  store_id text references public.stores(id) on delete cascade not null,
  city text not null,
  state text not null,
  pincode text not null,
  supports_same_day boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. High-Volume Partitioned Price History Table
-- Uses BIGINT for high-volume scale and native PostgreSQL monthly partitioning
create table if not exists public.price_history_partitioned (
  id bigserial,
  product_variant_id text not null,
  store_id text not null,
  price numeric(12, 2) not null,
  currency text default 'INR' not null,
  recorded_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id, recorded_at)
) partition by range (recorded_at);

-- Monthly partition tables
create table if not exists public.price_history_2026_01 partition of public.price_history_partitioned
  for values from ('2026-01-01') to ('2026-02-01');
create table if not exists public.price_history_2026_02 partition of public.price_history_partitioned
  for values from ('2026-02-01') to ('2026-03-01');
create table if not exists public.price_history_2026_03 partition of public.price_history_partitioned
  for values from ('2026-03-01') to ('2026-04-01');
create table if not exists public.price_history_2026_04 partition of public.price_history_partitioned
  for values from ('2026-04-01') to ('2026-05-01');
create table if not exists public.price_history_2026_05 partition of public.price_history_partitioned
  for values from ('2026-05-01') to ('2026-06-01');
create table if not exists public.price_history_2026_06 partition of public.price_history_partitioned
  for values from ('2026-06-01') to ('2026-07-01');
create table if not exists public.price_history_2026_07 partition of public.price_history_partitioned
  for values from ('2026-07-01') to ('2026-08-01');
create table if not exists public.price_history_2026_08 partition of public.price_history_partitioned
  for values from ('2026-08-01') to ('2026-09-01');
create table if not exists public.price_history_2026_09 partition of public.price_history_partitioned
  for values from ('2026-09-01') to ('2026-10-01');
create table if not exists public.price_history_2026_10 partition of public.price_history_partitioned
  for values from ('2026-10-01') to ('2026-11-01');
create table if not exists public.price_history_2026_11 partition of public.price_history_partitioned
  for values from ('2026-11-01') to ('2026-12-01');
create table if not exists public.price_history_2026_12 partition of public.price_history_partitioned
  for values from ('2026-12-01') to ('2027-01-01');

create index if not exists idx_price_hist_variant on public.price_history_partitioned(product_variant_id, recorded_at desc);

-- 5. Daily Aggregated Price Snapshots & Product Price Statistics
-- Prevents scanning millions of historical rows when loading price charts
create table if not exists public.price_daily_snapshots (
  id bigserial primary key,
  product_variant_id text not null,
  store_id text not null,
  snapshot_date date not null,
  opening_price numeric(12, 2) not null,
  closing_price numeric(12, 2) not null,
  min_price numeric(12, 2) not null,
  max_price numeric(12, 2) not null,
  currency text default 'INR' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (product_variant_id, store_id, snapshot_date)
);

create table if not exists public.product_price_statistics (
  product_variant_id text primary key,
  current_lowest_price numeric(12, 2) not null,
  current_highest_price numeric(12, 2) not null,
  historical_lowest_price numeric(12, 2) not null,
  historical_highest_price numeric(12, 2) not null,
  average_30d numeric(12, 2) not null,
  volatility_score numeric(5, 2) default 0,
  thirty_day_change_percent numeric(5, 2) default 0,
  last_calculated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Review Sentiment & Category-Aware Review Topics
create table if not exists public.review_sentiment (
  id text primary key default ('sent_' || gen_random_uuid()),
  product_id text references public.products(id) on delete cascade not null,
  positive_percentage numeric(5, 2) not null check (positive_percentage >= 0 and positive_percentage <= 100),
  neutral_percentage numeric(5, 2) not null check (neutral_percentage >= 0 and neutral_percentage <= 100),
  negative_percentage numeric(5, 2) not null check (negative_percentage >= 0 and negative_percentage <= 100),
  ai_summary text not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.review_topics (
  id text primary key default ('topic_' || gen_random_uuid()),
  product_id text references public.products(id) on delete cascade not null,
  topic_name text not null, -- e.g. "Battery", "Camera", "Display", "Heating"
  sentiment text not null check (sentiment in ('positive', 'neutral', 'negative')),
  mention_count integer default 0 not null,
  sentiment_score numeric(3, 2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Purchases & Warranty Tracking (Sections 94 & 95)
create table if not exists public.purchases (
  id text primary key default ('pur_' || gen_random_uuid()),
  user_id uuid references auth.users(id) on delete cascade not null,
  product_variant_id text references public.product_variants(id) on delete set null,
  store_name text not null,
  purchase_price numeric(12, 2) not null,
  purchase_date date not null,
  invoice_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.warranties (
  id text primary key default ('war_' || gen_random_uuid()),
  purchase_id text references public.purchases(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  provider text not null,
  warranty_start date not null,
  warranty_end date not null,
  document_url text,
  status text default 'active' check (status in ('active', 'expiring_soon', 'expired')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Personalized Recommendations & Reason Auditing (Section 44)
create table if not exists public.recommendations (
  id text primary key default ('rec_' || gen_random_uuid()),
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id text references public.products(id) on delete cascade not null,
  reason_summary text not null, -- e.g. "Matches your preference for 120Hz AMOLED under ₹30,000"
  affinity_score numeric(4, 3) default 0.85,
  is_dismissed boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. AI Evaluations & Tool Observability (Section 67)
create table if not exists public.ai_evaluations (
  id text primary key default ('eval_' || gen_random_uuid()),
  conversation_id text references public.ai_conversations(id) on delete cascade,
  query text not null,
  model_id text not null,
  grounding_score numeric(3, 2) check (grounding_score >= 0 and grounding_score <= 1.0),
  tool_correctness numeric(3, 2) check (tool_correctness >= 0 and tool_correctness <= 1.0),
  latency_ms integer not null,
  hallucination_flag boolean default false not null,
  user_feedback text check (user_feedback in ('thumbs_up', 'thumbs_down')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. Data Provider Runs & Quality Monitoring (Sections 59 & 60)
create table if not exists public.provider_runs (
  id text primary key default ('run_' || gen_random_uuid()),
  provider_name text not null,
  operation text not null, -- e.g. "search", "price_refresh", "catalog_crawl"
  status text not null check (status in ('running', 'success', 'failed', 'circuit_broken')),
  records_found integer default 0,
  records_processed integer default 0,
  records_failed integer default 0,
  latency_ms integer default 0,
  error_message text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.data_quality_events (
  id text primary key default ('dq_' || gen_random_uuid()),
  event_type text not null check (event_type in ('impossible_price', 'duplicate_product', 'stale_offer', 'invalid_url', 'missing_identifier')),
  entity_id text not null,
  severity text not null check (severity in ('info', 'warning', 'critical')),
  details jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 11. Daily Aggregated Analytics Tables (Section 66)
create table if not exists public.analytics_daily_products (
  snapshot_date date primary key,
  total_products integer not null,
  total_variants integer not null,
  total_offers integer not null,
  stale_offers integer not null
);

create table if not exists public.analytics_daily_searches (
  snapshot_date date primary key,
  total_searches integer not null,
  unique_users integer not null,
  top_queries jsonb default '[]'::jsonb
);

create table if not exists public.analytics_daily_price_events (
  snapshot_date date primary key,
  price_drops integer not null,
  price_increases integer not null,
  historical_lows integer not null
);

create table if not exists public.analytics_daily_deals (
  snapshot_date date primary key,
  active_deals integer not null,
  new_deals_detected integer not null,
  expired_deals integer not null
);

create table if not exists public.analytics_daily_users (
  snapshot_date date primary key,
  active_users integer not null,
  new_signups integer not null,
  google_auth_count integer not null,
  phone_auth_count integer not null
);

create table if not exists public.analytics_daily_alerts (
  snapshot_date date primary key,
  active_alerts integer not null,
  triggered_alerts integer not null
);

create table if not exists public.analytics_daily_ai_usage (
  snapshot_date date primary key,
  total_conversations integer not null,
  total_messages integer not null,
  total_tool_calls integer not null,
  average_latency_ms integer not null,
  estimated_tokens integer not null
);

-- =================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =================================================================

alter table public.purchases enable row level security;
alter table public.warranties enable row level security;
alter table public.recommendations enable row level security;
alter table public.ai_evaluations enable row level security;

-- Purchases RLS: user owns their purchases
create policy "Users can view own purchases" on public.purchases
  for select using (auth.uid() = user_id);
create policy "Users can insert own purchases" on public.purchases
  for insert with check (auth.uid() = user_id);
create policy "Users can delete own purchases" on public.purchases
  for delete using (auth.uid() = user_id);

-- Warranties RLS: user owns their warranties
create policy "Users can view own warranties" on public.warranties
  for select using (auth.uid() = user_id);
create policy "Users can insert own warranties" on public.warranties
  for insert with check (auth.uid() = user_id);
create policy "Users can update own warranties" on public.warranties
  for update using (auth.uid() = user_id);

-- Recommendations RLS: user owns their recommendations
create policy "Users can view own recommendations" on public.recommendations
  for select using (auth.uid() = user_id);
create policy "Users can update own recommendations" on public.recommendations
  for update using (auth.uid() = user_id);

-- Public read access for catalog aggregations & specifications
alter table public.product_identifiers enable row level security;
alter table public.product_attributes enable row level security;
alter table public.sellers enable row level security;
alter table public.store_locations enable row level security;
alter table public.review_sentiment enable row level security;
alter table public.review_topics enable row level security;

create policy "Public can view product identifiers" on public.product_identifiers for select using (true);
create policy "Public can view product attributes" on public.product_attributes for select using (true);
create policy "Public can view sellers" on public.sellers for select using (true);
create policy "Public can view store locations" on public.store_locations for select using (true);
create policy "Public can view review sentiment" on public.review_sentiment for select using (true);
create policy "Public can view review topics" on public.review_topics for select using (true);
