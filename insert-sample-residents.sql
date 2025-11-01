-- Insert 25 sample residents into users table
-- Note: users.id must reference auth.users.id (foreign key constraint)

-- First, check existing auth users that we can use
SELECT id, email FROM auth.users LIMIT 5;

-- Insert residents with generated UUIDs that match auth.users
-- We'll use your existing admin user's pattern

-- Get existing auth.users to reference (if any)
DO $$
DECLARE
  admin_id UUID;
BEGIN
  -- Try to get an admin user ID
  SELECT id INTO admin_id FROM auth.users LIMIT 1;
  
  IF admin_id IS NOT NULL THEN
    RAISE NOTICE 'Found auth user: %', admin_id;
  ELSE
    RAISE NOTICE 'No auth users found. Users must be created via Supabase Auth first.';
  END IF;
END $$;

-- Alternative: Insert with explicit UUID (but this will still fail due to FK constraint)
-- The correct way is to create users via Supabase Auth API or disable the FK temporarily

-- Temporary workaround: Insert into users table directly with UUID
-- This only works if the FK constraint allows it or is disabled
INSERT INTO public.users (
  id,
  email,
  name,
  role,
  status
) VALUES
  -- Building A residents (using random UUIDs)
  ('11111111-1111-1111-1111-000000000001'::uuid, 'nguyen.van.a@email.com', 'Nguyễn Văn A', 'resident', 'active'),
  ('11111111-1111-1111-1111-000000000002'::uuid, 'tran.thi.b@email.com', 'Trần Thị B', 'resident', 'active'),
  ('11111111-1111-1111-1111-000000000003'::uuid, 'le.van.c@email.com', 'Lê Văn C', 'resident', 'active'),
  ('11111111-1111-1111-1111-000000000004'::uuid, 'pham.thi.d@email.com', 'Phạm Thị D', 'resident', 'active'),
  ('11111111-1111-1111-1111-000000000005'::uuid, 'hoang.van.e@email.com', 'Hoàng Văn E', 'resident', 'active'),
  
  -- Building B residents
  ('11111111-1111-1111-1111-000000000006'::uuid, 'vu.thi.f@email.com', 'Vũ Thị F', 'resident', 'active'),
  ('11111111-1111-1111-1111-000000000007'::uuid, 'dao.van.g@email.com', 'Đào Văn G', 'resident', 'active'),
  ('11111111-1111-1111-1111-000000000008'::uuid, 'bui.thi.h@email.com', 'Bùi Thị H', 'resident', 'active'),
  ('11111111-1111-1111-1111-000000000009'::uuid, 'dang.van.i@email.com', 'Đặng Văn I', 'resident', 'active'),
  ('11111111-1111-1111-1111-000000000010'::uuid, 'do.thi.k@email.com', 'Đỗ Thị K', 'resident', 'active'),
  
  -- Building C residents
  ('11111111-1111-1111-1111-000000000011'::uuid, 'ngo.van.l@email.com', 'Ngô Văn L', 'resident', 'active'),
  ('11111111-1111-1111-1111-000000000012'::uuid, 'duong.thi.m@email.com', 'Dương Thị M', 'resident', 'active'),
  ('11111111-1111-1111-1111-000000000013'::uuid, 'ly.van.n@email.com', 'Lý Văn N', 'resident', 'inactive'),
  ('11111111-1111-1111-1111-000000000014'::uuid, 'truong.thi.o@email.com', 'Trương Thị O', 'resident', 'active'),
  ('11111111-1111-1111-1111-000000000015'::uuid, 'mai.van.p@email.com', 'Mai Văn P', 'resident', 'active'),
  
  -- International residents
  ('11111111-1111-1111-1111-000000000016'::uuid, 'john.smith@email.com', 'John Smith', 'resident', 'active'),
  ('11111111-1111-1111-1111-000000000017'::uuid, 'sarah.johnson@email.com', 'Sarah Johnson', 'resident', 'active'),
  ('11111111-1111-1111-1111-000000000018'::uuid, 'takeshi.yamamoto@email.com', 'Takeshi Yamamoto', 'resident', 'active'),
  ('11111111-1111-1111-1111-000000000019'::uuid, 'marie.dubois@email.com', 'Marie Dubois', 'resident', 'active'),
  ('11111111-1111-1111-1111-000000000020'::uuid, 'hans.mueller@email.com', 'Hans Mueller', 'resident', 'active'),
  
  -- More Vietnamese residents
  ('11111111-1111-1111-1111-000000000021'::uuid, 'vo.thi.q@email.com', 'Võ Thị Q', 'resident', 'active'),
  ('11111111-1111-1111-1111-000000000022'::uuid, 'tran.van.r@email.com', 'Trần Văn R', 'resident', 'active'),
  ('11111111-1111-1111-1111-000000000023'::uuid, 'nguyen.thi.s@email.com', 'Nguyễn Thị S', 'resident', 'inactive'),
  ('11111111-1111-1111-1111-000000000024'::uuid, 'le.van.t@email.com', 'Lê Văn T', 'resident', 'active'),
  ('11111111-1111-1111-1111-000000000025'::uuid, 'pham.thi.u@email.com', 'Phạm Thị U', 'resident', 'active')
ON CONFLICT (id) DO NOTHING;

-- Verify the insert
SELECT 
  COUNT(*) as total_residents,
  COUNT(CASE WHEN status = 'active' THEN 1 END) as active_residents,
  COUNT(CASE WHEN status = 'inactive' THEN 1 END) as inactive_residents
FROM users 
WHERE role = 'resident';

-- Show sample data
SELECT 
  name,
  email,
  status,
  created_at
FROM users 
WHERE role = 'resident'
ORDER BY created_at DESC
LIMIT 10;
