-- PriceWise Database Schema & RLS Policies
-- Supabase PostgreSQL Migration

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT DEFAULT 'User',
    avatar_url TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon TEXT,
    spec_keys JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    model TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Product Variants Table
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    variant_name TEXT NOT NULL,
    attributes JSONB DEFAULT '{}'::jsonb,
    sku TEXT,
    gtin TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Stores Table
CREATE TABLE IF NOT EXISTS public.stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    domain TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    rating NUMERIC(3,2) DEFAULT 4.5,
    verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Offers Table
CREATE TABLE IF NOT EXISTS public.offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    price NUMERIC(12,2) NOT NULL,
    original_price NUMERIC(12,2),
    currency TEXT DEFAULT 'INR',
    discount NUMERIC(5,2),
    rating NUMERIC(3,2),
    review_count INTEGER DEFAULT 0,
    seller_name TEXT,
    availability TEXT DEFAULT 'In Stock',
    delivery_info TEXT,
    warranty_info TEXT,
    image_url TEXT,
    last_checked_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Price History Table
CREATE TABLE IF NOT EXISTS public.price_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    offer_id UUID NOT NULL REFERENCES public.offers(id) ON DELETE CASCADE,
    price NUMERIC(12,2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Watchlists Table
CREATE TABLE IF NOT EXISTS public.watchlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
    target_price NUMERIC(12,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_variant UNIQUE(user_id, product_variant_id)
);

-- 9. Price Alerts Table
CREATE TABLE IF NOT EXISTS public.price_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
    target_price NUMERIC(12,2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    enabled BOOLEAN DEFAULT TRUE,
    triggered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Searches Table
CREATE TABLE IF NOT EXISTS public.searches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Product Comparisons Table
CREATE TABLE IF NOT EXISTS public.product_comparisons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Comparison Items Table
CREATE TABLE IF NOT EXISTS public.comparison_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    comparison_id UUID NOT NULL REFERENCES public.product_comparisons(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_comp_product UNIQUE(comparison_id, product_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_variants_product ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_offers_variant ON public.offers(product_variant_id);
CREATE INDEX IF NOT EXISTS idx_offers_store ON public.offers(store_id);
CREATE INDEX IF NOT EXISTS idx_price_history_offer ON public.price_history(offer_id, recorded_at);
CREATE INDEX IF NOT EXISTS idx_watchlists_user ON public.watchlists(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_user ON public.price_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_searches_user ON public.searches(user_id);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comparison_items ENABLE ROW LEVEL SECURITY;

-- Public read policies for catalog data
CREATE POLICY "Public categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public variants are viewable by everyone" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "Public stores are viewable by everyone" ON public.stores FOR SELECT USING (true);
CREATE POLICY "Public offers are viewable by everyone" ON public.offers FOR SELECT USING (true);
CREATE POLICY "Public price history is viewable by everyone" ON public.price_history FOR SELECT USING (true);

-- User-scoped policies for private data
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view their own watchlists" ON public.watchlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own watchlists" ON public.watchlists FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own alerts" ON public.price_alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own alerts" ON public.price_alerts FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own searches" ON public.searches FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own searches" ON public.searches FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own comparisons" ON public.product_comparisons FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own comparisons" ON public.product_comparisons FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their comparison items" ON public.comparison_items FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.product_comparisons WHERE id = comparison_items.comparison_id AND user_id = auth.uid()));
CREATE POLICY "Users can manage their comparison items" ON public.comparison_items FOR ALL 
USING (EXISTS (SELECT 1 FROM public.product_comparisons WHERE id = comparison_items.comparison_id AND user_id = auth.uid()));

-- Automatically create profile on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url, phone)
    VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', 'User'), new.raw_user_meta_data->>'avatar_url', new.phone);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
