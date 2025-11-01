# Hướng dẫn thêm dữ liệu vào bảng Users

## Bước 1: Thêm các cột còn thiếu vào bảng Users

**Mở Supabase Dashboard → SQL Editor**

Chạy file: `add-users-columns.sql`

Các cột sẽ được thêm:
- ✅ `property_unit_id` - UUID (Foreign key đến property_units)
- ✅ `property_name` - TEXT
- ✅ `room_number` - TEXT (VD: A101, B205)
- ✅ `gender` - TEXT (Male, Female, Other)
- ✅ `contract_type` - TEXT (Owner, Renter, Lease, Short-term)
- ✅ `phone_number` - TEXT
- ✅ `nationality` - TEXT
- ✅ `passport_number` - TEXT
- ✅ `passport_issue_date` - DATE
- ✅ `passport_issue_place` - TEXT
- ✅ `cohabitants` - TEXT
- ✅ `other_info` - TEXT

## Bước 2: Seed dữ liệu mẫu

Sau khi chạy SQL ở Bước 1, chạy lệnh:

```bash
node seed-users-data.js
```

Script sẽ:
- Lấy 50 property units từ database
- Update 45 users hiện có với dữ liệu mẫu:
  - Room Number: A101, B205, C312, etc.
  - Gender: Male/Female/Other (random)
  - Contract Type: Owner/Renter/Lease/Short-term (random)
  - Phone: 090 XXX XXX (format Việt Nam)
  - Nationality: Vietnamese, American, Korean, Japanese, etc. (random)
  - Property Unit: Link ngẫu nhiên đến property_units

## Bước 3 (TÙY CHỌN): Migrate sang Short IDs

### Cách 1: GIỮ UUID, thêm short_code (KHUYẾN NGHỊ)

Chạy phần cuối của file `migrate-short-ids.sql`:

```sql
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS short_code TEXT UNIQUE;
UPDATE public.users SET short_code = generate_short_id(12) WHERE short_code IS NULL;
ALTER TABLE public.users ALTER COLUMN short_code SET DEFAULT generate_short_id(12);
```

Kết quả:
- `id` vẫn là UUID (tốt cho database, foreign keys)
- `short_code` là 12 ký tự (tốt cho hiển thị, chia sẻ)

Ví dụ:
- ID: `550e8400-e29b-41d4-a716-446655440000` (UUID)
- Short Code: `xyz5bsnl1699` (12 chars)

### Cách 2: ĐỔI sang Short ID hoàn toàn (KHÔNG KHUYẾN NGHỊ)

⚠️ **Cảnh báo**: Thay đổi này ảnh hưởng đến toàn bộ database!

Xem chi tiết trong `migrate-short-ids.sql` - Cần:
1. Backup database
2. Drop tất cả foreign key constraints
3. Migrate từng bảng liên quan
4. Recreate constraints

## Kết quả mong đợi

Sau khi hoàn thành, bảng users sẽ có đầy đủ thông tin:

| email | room_number | gender | contract_type | phone_number | nationality | property_unit_id |
|-------|-------------|--------|---------------|--------------|-------------|------------------|
| admin@gardencity.com | A305 | Male | Owner | 090 345 678 | Vietnamese | uuid-xxx |
| john.smith@email.com | B412 | Male | Renter | 093 123 456 | American | uuid-yyy |
| marie.dubois@email.com | C208 | Female | Lease | 084 789 012 | French | uuid-zzz |

## Test

1. Mở http://localhost:3000/user-management/users
2. Click Edit user bất kỳ
3. Kiểm tra các trường đã có dữ liệu:
   - Property Unit (dropdown)
   - Phone Number
   - Nationality

## Files đã tạo

1. ✅ `add-users-columns.sql` - Thêm các cột vào bảng users
2. ✅ `seed-users-data.js` - Script seed dữ liệu mẫu
3. ✅ `migrate-short-ids.sql` - (Tùy chọn) Migrate sang short IDs

## Lệnh chạy

```bash
# Bước 1: Chạy SQL trong Supabase (add-users-columns.sql)
# Bước 2: Seed dữ liệu
node seed-users-data.js

# Bước 3 (optional): Thêm short_code trong Supabase
# Chạy phần cuối của migrate-short-ids.sql
```
