-- =================================================================
-- PRICEWISE — FULL AI SHOPPING INTELLIGENCE EXTENSION SCHEMA
-- Migration: 002_full_intelligence_schema.sql
-- =================================================================

-- 1. Enable pgvector for Semantic Search & Hybrid Product Embeddings
create extension if not exists vector;

-- 2. Shopping Lists & Budget Tracker
create table if not exists public.shopping_lists (
  id text primary key default ('list_' || gen_random_uuid()),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  description text,
  total_budget numeric(12, 2),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.shopping_list_items (
  id text primary key default ('item_' || gen_random_uuid()),
  shopping_list_id text references public.shopping_lists(id) on delete cascade not null,
  product_variant_id text references public.product_variants(id) on delete cascade not null,
  target_price numeric(12, 2),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Smart Notifications Center
create table if not exists public.notifications (
  id text primary key default ('notif_' || gen_random_uuid()),
  user_id uuid references auth.users(id) on delete cascade not null,
  category text not null check (category in ('price_drop', 'target_reached', 'back_in_stock', 'deal', 'historical_low', 'watchlist_update')),
  title text not null,
  message text not null,
  product_variant_id text references public.product_variants(id) on delete set null,
  store_id text references public.stores(id) on delete set null,
  old_price numeric(12, 2),
  new_price numeric(12, 2),
  read boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Deals & Coupons
create table if not exists public.coupons (
  id text primary key default ('coupon_' || gen_random_uuid()),
  store_id text references public.stores(id) on delete cascade not null,
  code text not null,
  description text not null,
  discount_amount numeric(12, 2),
  discount_percentage numeric(5, 2),
  min_spend numeric(12, 2),
  valid_until timestamp with time zone,
  verified boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. AI Shopping Conversations, Messages & Tool Executions
create table if not exists public.ai_conversations (
  id text primary key default ('conv_' || gen_random_uuid()),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text default 'New Shopping Inquiry' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.ai_messages (
  id text primary key default ('msg_' || gen_random_uuid()),
  conversation_id text references public.ai_conversations(id) on delete cascade not null,
  role text not null check (role in ('system', 'user', 'assistant', 'tool')),
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.ai_tool_calls (
  id text primary key default ('tool_' || gen_random_uuid()),
  message_id text references public.ai_messages(id) on delete cascade not null,
  tool_name text not null,
  tool_arguments jsonb not null,
  tool_output jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Product Vector Embeddings for Hybrid Semantic Search
create table if not exists public.product_embeddings (
  id text primary key default ('emb_' || gen_random_uuid()),
  product_id text references public.products(id) on delete cascade not null,
  embedding vector(1536),
  content_chunk text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Price Events & Anomaly Tracking
create table if not exists public.price_events (
  id text primary key default ('event_' || gen_random_uuid()),
  offer_id text references public.offers(id) on delete cascade not null,
  event_type text not null check (event_type in ('drop', 'anomaly_drop', 'historical_low', 'restock', 'spike')),
  previous_price numeric(12, 2) not null,
  new_price numeric(12, 2) not null,
  percentage_change numeric(6, 2) not null,
  detected_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. User Shopping Profile & Personalization Preferences
create table if not exists public.user_preferences (
  user_id uuid references auth.users(id) on delete cascade primary key,
  preferred_budget_max numeric(12, 2),
  favorite_categories text[] default '{}',
  favorite_brands text[] default '{}',
  preferred_stores text[] default '{}',
  notifications_price_drop boolean default true not null,
  notifications_daily_brief boolean default true not null,
  allow_personalization boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =================================================================

alter table public.shopping_lists enable row level security;
alter table public.shopping_list_items enable row level security;
alter table public.notifications enable row level security;
alter table public.coupons enable row level security;
alter table public.ai_conversations enable row level security;
alter table public.ai_messages enable row level security;
alter table public.ai_tool_calls enable row level security;
alter table public.product_embeddings enable row level security;
alter table public.price_events enable row level security;
alter table public.user_preferences enable row level security;

-- Shopping Lists
create policy "Users can manage their own shopping lists"
  on public.shopping_lists for all using (auth.uid() = user_id);

create policy "Users can manage their own shopping list items"
  on public.shopping_list_items for all using (
    exists (select 1 from public.shopping_lists where id = shopping_list_items.shopping_list_id and user_id = auth.uid())
  );

-- Notifications
create policy "Users can read and update their own notifications"
  on public.notifications for all using (auth.uid() = user_id);

-- Coupons (Public Read)
create policy "Coupons are publicly viewable"
  on public.coupons for select using (true);

-- AI Conversations & Messages
create policy "Users can manage their own AI conversations"
  on public.ai_conversations for all using (auth.uid() = user_id);

create policy "Users can manage their own AI messages"
  on public.ai_messages for all using (
    exists (select 1 from public.ai_conversations where id = ai_messages.conversation_id and user_id = auth.uid())
  );

create policy "Users can view their own AI tool calls"
  on public.ai_tool_calls for select using (
    exists (
      select 1 from public.ai_messages m
      join public.ai_conversations c on c.id = m.conversation_id
      where m.id = ai_tool_calls.message_id and c.user_id = auth.uid()
    )
  );

-- Embeddings & Price Events (Public Read)
create policy "Product embeddings are publicly readable"
  on public.product_embeddings for select using (true);

create policy "Price events are publicly readable"
  on public.price_events for select using (true);

-- User Preferences
create policy "Users can manage their own preferences"
  on public.user_preferences for all using (auth.uid() = user_id);
