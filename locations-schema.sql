-- Location Management System Schema
-- Structure: Country → Province → Ward

-- ============================================
-- 1. COUNTRIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  phone_code VARCHAR(10),
  currency VARCHAR(10),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. PROVINCES TABLE (Cities & Provinces)
-- ============================================
CREATE TABLE IF NOT EXISTS public.provinces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id UUID NOT NULL REFERENCES public.countries(id) ON DELETE CASCADE,
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  type VARCHAR(20) DEFAULT 'province' CHECK (type IN ('city', 'province')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. WARDS TABLE (Phường/Xã/Thị trấn)
-- ============================================
CREATE TABLE IF NOT EXISTS public.wards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  province_id UUID NOT NULL REFERENCES public.provinces(id) ON DELETE CASCADE,
  code VARCHAR(30) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  type VARCHAR(20) DEFAULT 'ward' CHECK (type IN ('ward', 'commune', 'town')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES for better performance
-- ============================================
CREATE INDEX idx_provinces_country_id ON public.provinces(country_id);
CREATE INDEX idx_provinces_status ON public.provinces(status);
CREATE INDEX idx_wards_province_id ON public.wards(province_id);
CREATE INDEX idx_wards_status ON public.wards(status);

-- ============================================
-- RLS POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provinces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wards ENABLE ROW LEVEL SECURITY;

-- Countries policies
DROP POLICY IF EXISTS "Authenticated users can view countries" ON public.countries;
CREATE POLICY "Authenticated users can view countries" 
ON public.countries FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage countries" ON public.countries;
CREATE POLICY "Authenticated users can manage countries" 
ON public.countries FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Provinces policies
DROP POLICY IF EXISTS "Authenticated users can view provinces" ON public.provinces;
CREATE POLICY "Authenticated users can view provinces" 
ON public.provinces FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage provinces" ON public.provinces;
CREATE POLICY "Authenticated users can manage provinces" 
ON public.provinces FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Wards policies
DROP POLICY IF EXISTS "Authenticated users can view wards" ON public.wards;
CREATE POLICY "Authenticated users can view wards" 
ON public.wards FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage wards" ON public.wards;
CREATE POLICY "Authenticated users can manage wards" 
ON public.wards FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================
-- TRIGGERS for updated_at
-- ============================================
CREATE TRIGGER update_countries_updated_at BEFORE UPDATE ON public.countries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_provinces_updated_at BEFORE UPDATE ON public.provinces
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wards_updated_at BEFORE UPDATE ON public.wards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA: Countries
-- ============================================
INSERT INTO public.countries (code, name, name_en, phone_code, currency, status) VALUES
('VN', 'Việt Nam', 'Vietnam', '+84', 'VND', 'active')
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- SEED DATA: Vietnam Provinces (34 mục theo UI hiện tại)
-- ============================================
-- Get Vietnam country ID for reference
DO $$
DECLARE
  vietnam_id UUID;
BEGIN
  SELECT id INTO vietnam_id FROM public.countries WHERE code = 'VN';
  
  -- 34 provinces/cities matching current UI mock
  INSERT INTO public.provinces (country_id, code, name, name_en, type, status) VALUES
  (vietnam_id, '11', 'Hà Nội', 'Ha Noi', 'city', 'active'),
  (vietnam_id, '12', 'Hồ Chí Minh', 'Ho Chi Minh', 'city', 'active'),
  (vietnam_id, '13', 'Đà Nẵng', 'Da Nang', 'city', 'active'),
  (vietnam_id, '14', 'Hải Phòng', 'Hai Phong', 'city', 'active'),
  (vietnam_id, '15', 'Cần Thơ', 'Can Tho', 'city', 'active'),
  (vietnam_id, '16', 'Huế', 'Hue', 'city', 'active'),
  (vietnam_id, '17', 'An Giang', 'An Giang', 'province', 'active'),
  (vietnam_id, '18', 'Bắc Ninh', 'Bac Ninh', 'province', 'active'),
  (vietnam_id, '19', 'Cà Mau', 'Ca Mau', 'province', 'active'),
  (vietnam_id, '20', 'Cao Bằng', 'Cao Bang', 'province', 'active'),
  (vietnam_id, '21', 'Đắk Lắk', 'Dak Lak', 'province', 'active'),
  (vietnam_id, '22', 'Điện Biên', 'Dien Bien', 'province', 'active'),
  (vietnam_id, '23', 'Đồng Nai', 'Dong Nai', 'province', 'active'),
  (vietnam_id, '24', 'Đồng Tháp', 'Dong Thap', 'province', 'active'),
  (vietnam_id, '25', 'Gia Lai', 'Gia Lai', 'province', 'active'),
  (vietnam_id, '26', 'Hà Tĩnh', 'Ha Tinh', 'province', 'active'),
  (vietnam_id, '27', 'Hưng Yên', 'Hung Yen', 'province', 'active'),
  (vietnam_id, '28', 'Khánh Hòa', 'Khanh Hoa', 'province', 'active'),
  (vietnam_id, '29', 'Lai Châu', 'Lai Chau', 'province', 'active'),
  (vietnam_id, '30', 'Lâm Đồng', 'Lam Dong', 'province', 'active'),
  (vietnam_id, '31', 'Lạng Sơn', 'Lang Son', 'province', 'active'),
  (vietnam_id, '32', 'Lào Cai', 'Lao Cai', 'province', 'active'),
  (vietnam_id, '33', 'Nghệ An', 'Nghe An', 'province', 'active'),
  (vietnam_id, '34', 'Ninh Bình', 'Ninh Binh', 'province', 'active'),
  (vietnam_id, '35', 'Phú Thọ', 'Phu Tho', 'province', 'active'),
  (vietnam_id, '36', 'Quảng Ngãi', 'Quang Ngai', 'province', 'active'),
  (vietnam_id, '37', 'Quảng Ninh', 'Quang Ninh', 'province', 'active'),
  (vietnam_id, '38', 'Quảng Trị', 'Quang Tri', 'province', 'active'),
  (vietnam_id, '39', 'Sơn La', 'Son La', 'province', 'active'),
  (vietnam_id, '40', 'Tây Ninh', 'Tay Ninh', 'province', 'active'),
  (vietnam_id, '41', 'Thái Nguyên', 'Thai Nguyen', 'province', 'active'),
  (vietnam_id, '42', 'Thanh Hóa', 'Thanh Hoa', 'province', 'active'),
  (vietnam_id, '43', 'Tuyên Quang', 'Tuyen Quang', 'province', 'active'),
  (vietnam_id, '44', 'Vĩnh Long', 'Vinh Long', 'province', 'active')
  ON CONFLICT (code) DO NOTHING;
END $$;

-- ============================================
-- SAMPLE WARDS for Hà Nội (for testing)
-- ============================================
DO $$
DECLARE
  hanoi_id UUID;
BEGIN
  SELECT id INTO hanoi_id FROM public.provinces WHERE code = '11';
  
  INSERT INTO public.wards (province_id, code, name, name_en, type, status) VALUES
  (hanoi_id, '11-001', 'Phúc Xá', 'Phuc Xa', 'ward', 'active'),
  (hanoi_id, '11-002', 'Trúc Bạch', 'Truc Bach', 'ward', 'active'),
  (hanoi_id, '11-003', 'Vĩnh Phúc', 'Vinh Phuc', 'ward', 'active'),
  (hanoi_id, '11-004', 'Cống Vị', 'Cong Vi', 'ward', 'active'),
  (hanoi_id, '11-005', 'Liễu Giai', 'Lieu Giai', 'ward', 'active'),
  (hanoi_id, '11-006', 'Nguyễn Trung Trực', 'Nguyen Trung Truc', 'ward', 'active'),
  (hanoi_id, '11-007', 'Quán Thánh', 'Quan Thanh', 'ward', 'active'),
  (hanoi_id, '11-008', 'Ngọc Hà', 'Ngoc Ha', 'ward', 'active'),
  (hanoi_id, '11-009', 'Điện Biên', 'Dien Bien', 'ward', 'active'),
  (hanoi_id, '11-010', 'Đội Cấn', 'Doi Can', 'ward', 'active')
  ON CONFLICT (code) DO NOTHING;
END $$;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Count countries
SELECT 'Countries:' as table_name, COUNT(*) as count FROM public.countries;

-- Count provinces by type
SELECT 'Provinces by type:' as info, type, COUNT(*) as count 
FROM public.provinces 
GROUP BY type;

-- Count wards
SELECT 'Wards:' as table_name, COUNT(*) as count FROM public.wards;

-- Check RLS policies
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('countries', 'provinces', 'wards')
ORDER BY tablename, policyname;
