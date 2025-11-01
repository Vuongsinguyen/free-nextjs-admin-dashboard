# Quick Setup: Display Code

## Bước 1: Chạy SQL trong Supabase Dashboard

1. Mở **Supabase Dashboard**: https://supabase.com/dashboard
2. Chọn project của bạn
3. Vào **SQL Editor** (menu bên trái)
4. Copy toàn bộ nội dung file `add-display-code-column.sql`
5. Paste vào SQL Editor
6. Click **Run** để chạy migration

## Bước 2: Verify Database

Chạy query sau để kiểm tra:

```sql
SELECT 
  role,
  display_code, 
  name, 
  email 
FROM users 
ORDER BY display_code 
LIMIT 20;
```

Bạn sẽ thấy display codes như:
- `AS000000`, `AS000001` (all_users)
- `DL000000`, `DL000001` (digital)
- `CL000000`, `CL000001` (commercial)
- `MG000000`, `MG000001` (Manager)

## Bước 3: Test UI

1. Refresh trang: http://localhost:3000/user-management/users
2. Cột **CODE** sẽ hiện thị thay cho cột ID
3. Display codes sẽ được hiển thị dạng monospace font

## Hoàn thành! ✅

File đã được update:
- ✅ Database schema (add-display-code-column.sql)
- ✅ TypeScript types (src/types/user-management.ts)
- ✅ Users page (src/app/(admin)/user-management/users/page.tsx)
- ✅ UserTable component (src/components/user-management/UserTable.tsx)

Giờ table users sẽ:
- Ẩn cột ID
- Hiển thị cột CODE với display_code tự động sinh
- Hỗ trợ sort theo CODE
