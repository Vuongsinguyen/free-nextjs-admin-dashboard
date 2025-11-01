# Facilities Setup Guide

## 📋 Tổng quan
Trang Facilities đã được tích hợp với Supabase database để quản lý các tiện ích/cơ sở vật chất của tòa nhà.

## 🗄️ Database Schema
File: `facilities-schema.sql`

### Cấu trúc bảng `facilities`:
- `id` - UUID (Primary Key)
- `name` - Tên tiện ích
- `category` - Danh mục (Sports & Recreation, Meeting & Events, Wellness, etc.)
- `location` - Vị trí
- `capacity` - Sức chứa tối đa
- `current_occupancy` - Số người hiện tại
- `status` - Trạng thái (available, occupied, maintenance, closed)
- `amenities` - Danh sách tiện nghi (TEXT ARRAY)
- `price_per_hour` - Giá thuê theo giờ
- `manager` - Người quản lý
- `last_maintenance` - Ngày bảo trì gần nhất
- `next_maintenance` - Ngày bảo trì tiếp theo
- `rating` - Đánh giá (0-5)
- `total_bookings` - Tổng số lượt đặt
- `description` - Mô tả chi tiết
- `image_url` - Link ảnh
- `created_at`, `updated_at`, `created_by` - Metadata

## 🚀 Cài đặt

### Bước 1: Tạo bảng trong Supabase
1. Mở **Supabase Dashboard** → **SQL Editor**
2. Click **"New Query"**
3. Copy toàn bộ nội dung file `facilities-schema.sql`
4. Paste vào SQL Editor
5. Click **"Run"** hoặc nhấn `Ctrl+Enter`

### Bước 2: Verify
Chạy query sau để kiểm tra:
```sql
SELECT COUNT(*) as total_facilities FROM facilities;
```
Kết quả: Nên thấy 10 facilities mẫu

### Bước 3: Test trên Frontend
1. Truy cập: `http://localhost:3000/facilities`
2. Kiểm tra:
   - ✅ Hiển thị 10 facilities từ database
   - ✅ Search hoạt động
   - ✅ Filter theo category hoạt động
   - ✅ Pagination hoạt động

## 🔐 Row Level Security (RLS)
Schema đã bao gồm RLS policies:
- **SELECT**: Public có thể đọc tất cả facilities
- **INSERT**: Chỉ authenticated users
- **UPDATE**: Chỉ authenticated users
- **DELETE**: Chỉ authenticated users

## 📊 Sample Data
Schema tự động insert 10 facilities mẫu:
1. Swimming Pool A
2. Gym & Fitness Center
3. Meeting Room 101
4. Tennis Court 1
5. Conference Hall
6. Kids Playground
7. Yoga Studio
8. BBQ Area
9. Library & Study Room
10. Basketball Court

## 🔄 Auto-update Timestamp
Có trigger tự động cập nhật `updated_at` mỗi khi record được update.

## 📝 Next Steps (Optional)
- [ ] Thêm CRUD operations (Create/Update/Delete modal)
- [ ] Thêm booking system
- [ ] Thêm image upload cho facilities
- [ ] Thêm maintenance schedule management
- [ ] Thêm reports & analytics

## ⚠️ Lưu ý
- Đảm bảo Supabase URL và Key đã được config trong `.env.local`
- Database field names dùng `snake_case` (vd: `price_per_hour`)
- Frontend interface field names giữ nguyên `camelCase` được convert tự động bởi Supabase

## 🐛 Troubleshooting
Nếu không thấy data:
1. Kiểm tra console: `F12` → Console tab
2. Xem log: "Error fetching facilities"
3. Verify Supabase connection trong Network tab
4. Kiểm tra RLS policies đã enable chưa

## 📞 Support
Nếu có vấn đề, kiểm tra:
- Supabase Dashboard → Table Editor → facilities
- Supabase Dashboard → Database → Policies → facilities
