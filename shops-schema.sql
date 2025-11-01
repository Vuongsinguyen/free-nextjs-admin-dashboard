-- ============================================
-- SHOPS SCHEMA
-- ============================================

-- Create shops table
CREATE TABLE IF NOT EXISTS public.shops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  province TEXT NOT NULL,
  district TEXT NOT NULL,
  address TEXT NOT NULL,
  google_map_link TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_shops_category ON public.shops(category);
CREATE INDEX IF NOT EXISTS idx_shops_province ON public.shops(province);
CREATE INDEX IF NOT EXISTS idx_shops_district ON public.shops(district);
CREATE INDEX IF NOT EXISTS idx_shops_status ON public.shops(status);
CREATE INDEX IF NOT EXISTS idx_shops_name ON public.shops(name);

-- Enable RLS
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;

-- Create policies (Allow all operations)
DROP POLICY IF EXISTS "Allow all operations on shops" ON public.shops;
CREATE POLICY "Allow all operations on shops" 
ON public.shops 
FOR ALL 
TO authenticated, anon
USING (true) 
WITH CHECK (true);

-- Create updated_at trigger
DROP TRIGGER IF EXISTS update_shops_updated_at ON public.shops;
CREATE TRIGGER update_shops_updated_at 
BEFORE UPDATE ON public.shops 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
