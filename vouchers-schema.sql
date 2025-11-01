-- ============================================
-- VOUCHERS SCHEMA
-- ============================================

-- Create vouchers table
CREATE TABLE IF NOT EXISTS public.vouchers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value NUMERIC NOT NULL,
  category TEXT NOT NULL,
  company_name TEXT NOT NULL,
  province TEXT,
  district TEXT,
  google_map_link TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  quantity_used INTEGER DEFAULT 0,
  quantity_total INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_vouchers_code ON public.vouchers(code);
CREATE INDEX IF NOT EXISTS idx_vouchers_status ON public.vouchers(status);
CREATE INDEX IF NOT EXISTS idx_vouchers_category ON public.vouchers(category);
CREATE INDEX IF NOT EXISTS idx_vouchers_company ON public.vouchers(company_name);
CREATE INDEX IF NOT EXISTS idx_vouchers_dates ON public.vouchers(start_date, end_date);

-- Enable RLS
ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;

-- Create policies (Allow all operations for authenticated users)
DROP POLICY IF EXISTS "Authenticated users can view vouchers" ON public.vouchers;
DROP POLICY IF EXISTS "Authenticated users can manage vouchers" ON public.vouchers;

-- Single policy for all operations
CREATE POLICY "Authenticated users can manage all vouchers" 
ON public.vouchers 
FOR ALL 
TO authenticated, anon
USING (true) 
WITH CHECK (true);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS update_vouchers_updated_at ON public.vouchers;
CREATE TRIGGER update_vouchers_updated_at 
BEFORE UPDATE ON public.vouchers 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create resident_voucher_usage table for tracking
CREATE TABLE IF NOT EXISTS public.resident_voucher_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  voucher_id UUID NOT NULL REFERENCES public.vouchers(id) ON DELETE CASCADE,
  resident_name TEXT NOT NULL,
  resident_id TEXT NOT NULL,
  apartment TEXT NOT NULL,
  used_date DATE NOT NULL,
  used_time TIME NOT NULL,
  amount NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for usage table
CREATE INDEX IF NOT EXISTS idx_resident_voucher_usage_voucher ON public.resident_voucher_usage(voucher_id);
CREATE INDEX IF NOT EXISTS idx_resident_voucher_usage_resident ON public.resident_voucher_usage(resident_id);
CREATE INDEX IF NOT EXISTS idx_resident_voucher_usage_date ON public.resident_voucher_usage(used_date);

-- Enable RLS for usage table
ALTER TABLE public.resident_voucher_usage ENABLE ROW LEVEL SECURITY;

-- Create policies for usage table (Allow all operations)
DROP POLICY IF EXISTS "Authenticated users can view voucher usage" ON public.resident_voucher_usage;
DROP POLICY IF EXISTS "Authenticated users can manage voucher usage" ON public.resident_voucher_usage;

-- Single policy for all operations
CREATE POLICY "Authenticated users can manage all voucher usage" 
ON public.resident_voucher_usage 
FOR ALL 
TO authenticated, anon
USING (true) 
WITH CHECK (true);
