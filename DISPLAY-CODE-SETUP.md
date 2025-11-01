# DISPLAY CODE Setup Guide

## Overview
Đã thêm cột **DISPLAY CODE** vào bảng users với logic tự động sinh mã:
- **2 ký tự đầu**: Ký tự đầu + ký tự cuối của Role Name (viết hoa)
- **6 ký tự tiếp**: Số tăng dần, bắt đầu từ 000000

## Examples
| Role        | Display Code Examples           |
|-------------|--------------------------------|
| Manager     | MG000000, MG000001, MG000002   |
| all_users   | AS000000, AS000001, AS000002   |
| digital     | DL000000, DL000001, DL000002   |
| commercial  | CL000000, CL000001, CL000002   |
| Guest       | GT000000, GT000001, GT000002   |

## Database Migration

### Option 1: Automatic Migration (Recommended)
```bash
node run-display-code-migration.js
```

### Option 2: Manual Migration via Supabase Dashboard
1. Mở **Supabase Dashboard** → **SQL Editor**
2. Copy nội dung file `add-display-code-column.sql`
3. Paste và chạy trong SQL Editor
4. Verify kết quả:
```sql
SELECT id, role, display_code FROM users LIMIT 10;
```

## What Was Changed

### 1. Database Schema
- ✅ Thêm cột `display_code VARCHAR(8) UNIQUE`
- ✅ Tạo function `generate_display_code(role_name TEXT)`
- ✅ Tạo trigger tự động sinh display_code khi insert user mới
- ✅ Update display_code cho tất cả users hiện có

### 2. TypeScript Types
File: `src/types/user-management.ts`
```typescript
export interface User {
  id: string;
  displayCode?: string; // ✅ NEW
  name: string;
  // ... other fields
}
```

### 3. Users Page Component
File: `src/app/(admin)/user-management/users/page.tsx`
- ✅ Load `display_code` from database
- ✅ Map to `displayCode` field
- ✅ Default sort by `displayCode` instead of `id`

### 4. UserTable Component
File: `src/components/user-management/UserTable.tsx`
- ✅ Ẩn cột ID
- ✅ Hiển thị cột CODE (display_code) ở vị trí đầu tiên
- ✅ Style: monospace font với background highlight
- ✅ Hỗ trợ sort theo CODE

## UI Changes

### Before:
```
| ID                              | Name  | Email | ... |
|---------------------------------|-------|-------|-----|
| #550e8400-e29b-41d4-a716-...    | John  | ...   | ... |
```

### After:
```
| CODE     | Name  | Email | ... |
|----------|-------|-------|-----|
| MG000000 | John  | ...   | ... |
```

## Testing

### 1. Verify Database
```sql
-- Check if column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'display_code';

-- Check display codes
SELECT role, display_code, name, email 
FROM users 
ORDER BY display_code 
LIMIT 20;

-- Check uniqueness
SELECT display_code, COUNT(*) 
FROM users 
GROUP BY display_code 
HAVING COUNT(*) > 1;
```

### 2. Test New User Creation
```sql
-- Insert a new user (display_code should be auto-generated)
INSERT INTO users (email, role, name, status)
VALUES ('test@example.com', 'Manager', 'Test User', 'active');

-- Check the generated code
SELECT email, role, display_code FROM users WHERE email = 'test@example.com';
-- Expected: MG000XXX (where XXX is next available number)
```

### 3. Test UI
1. Go to: `http://localhost:3000/user-management/users`
2. Verify:
   - ✅ ID column is hidden
   - ✅ CODE column shows at the beginning
   - ✅ Display codes are shown (e.g., MG000000)
   - ✅ Can sort by CODE column
   - ✅ Display codes are unique per role prefix

## Code Generation Logic

### SQL Function
```sql
CREATE OR REPLACE FUNCTION generate_display_code(role_name TEXT)
RETURNS TEXT AS $$
DECLARE
  prefix TEXT;
  next_number INTEGER;
BEGIN
  -- Get first + last char of role (uppercase)
  prefix := SUBSTRING(UPPER(role_name), 1, 1) || 
            SUBSTRING(UPPER(role_name), LENGTH(role_name), 1);
  
  -- Get next sequential number for this prefix
  SELECT COALESCE(MAX(CAST(SUBSTRING(display_code, 3) AS INTEGER)), -1) + 1
  INTO next_number
  FROM users
  WHERE display_code LIKE prefix || '%';
  
  -- Format: XX000000
  RETURN prefix || LPAD(next_number::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;
```

### Trigger
```sql
CREATE TRIGGER trigger_set_display_code
  BEFORE INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION set_display_code();
```

## Troubleshooting

### Issue: Display codes not showing in UI
**Solution:**
```bash
# Rebuild the app
npm run build

# Restart dev server
npm run dev
```

### Issue: Migration fails
**Solution:** Run SQL manually in Supabase Dashboard

### Issue: Duplicate display codes
**Solution:**
```sql
-- Reset all display codes
UPDATE users SET display_code = NULL;

-- Regenerate all codes
DO $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN SELECT id, role FROM users ORDER BY created_at
  LOOP
    UPDATE users 
    SET display_code = generate_display_code(user_record.role)
    WHERE id = user_record.id;
  END LOOP;
END $$;
```

## Next Steps

1. ✅ Run migration: `node run-display-code-migration.js`
2. ✅ Verify database changes
3. ✅ Test UI at `/user-management/users`
4. ✅ Create a few test users to verify auto-generation
5. ✅ Check sorting and filtering

## Notes

- Display codes are **unique** across the entire users table
- Display codes are **automatically generated** on user creation
- Display codes **cannot be manually changed** (enforced by trigger)
- Each role prefix has its own sequential counter
- Display codes are **case-sensitive** (always uppercase)
