# Vouchers Setup Guide

## ✅ Đã hoàn thành (Completed)

### 1. Database Schema
- ✅ Created `vouchers-schema.sql` with complete table definitions
- ✅ Defines `vouchers` table with 16 columns (UUID, code, name, type, value, etc.)
- ✅ Defines `resident_voucher_usage` tracking table
- ✅ Includes indexes on: code, status, category, company_name, dates
- ✅ Row Level Security (RLS) policies for authenticated users
- ✅ Triggers for `updated_at` timestamps

### 2. Seed API Endpoint
- ✅ Created `/api/vouchers/seed/route.ts`
- ✅ POST endpoint to seed 30 initial vouchers
- ✅ Covers categories: Coffee Shop, Supermarket, Restaurant, Pool, Fest, Convenience Store
- ✅ Upsert logic with conflict handling on 'code' column
- ✅ Detailed logging for debugging

### 3. Vouchers Page Migration
- ✅ Migrated `/vouchers/page.tsx` from mock data to Supabase
- ✅ Added `useEffect` to fetch vouchers from database
- ✅ Field mapping: snake_case (DB) → camelCase (TypeScript)
- ✅ Loading state with indicator
- ✅ Updated ID type from `number` to `string` (UUID)
- ✅ Fixed all ESLint errors
- ✅ TypeScript compilation successful

## 🔄 Cần thực hiện tiếp (Next Steps)

### Bước 1: Tạo bảng trong Supabase
1. Đăng nhập vào [Supabase Dashboard](https://supabase.com)
2. Chọn project của bạn
3. Vào **SQL Editor**
4. Copy nội dung file `vouchers-schema.sql`
5. Paste vào SQL Editor và **Run**
6. Xác nhận bảng `vouchers` và `resident_voucher_usage` đã được tạo

### Bước 2: Seed dữ liệu ban đầu
Có 2 cách:

**Cách 1: Qua API (Recommended)**
```bash
curl -X POST http://localhost:3000/api/vouchers/seed
```

**Cách 2: Thêm button vào UI**
Thêm button trên trang `/vouchers`:
```tsx
<button
  onClick={async () => {
    const res = await fetch('/api/vouchers/seed', { method: 'POST' });
    const data = await res.json();
    console.log(data);
    // Reload vouchers
    window.location.reload();
  }}
  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
>
  🌱 Seed Vouchers
</button>
```

### Bước 3: Kiểm tra
1. Mở http://localhost:3000/vouchers
2. Nên thấy loading indicator trước
3. Sau đó hiển thị 30 vouchers từ database
4. Kiểm tra filters (Category, Status, Company, Province)
5. Kiểm tra search (Code, Name)
6. Kiểm tra pagination

## 📊 Vouchers Data Structure

### Database (snake_case)
```sql
- id: UUID PRIMARY KEY
- code: VARCHAR(50) UNIQUE
- name: VARCHAR(255)
- type: VARCHAR(20) (percentage | fixed)
- value: NUMERIC(10,2)
- category: VARCHAR(100)
- company_name: VARCHAR(255)
- province: VARCHAR(100)
- district: VARCHAR(100)
- google_map_link: TEXT
- status: VARCHAR(20) (active | inactive)
- quantity_used: INTEGER
- quantity_total: INTEGER
- start_date: DATE
- end_date: DATE
- image: TEXT (URL)
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

### TypeScript (camelCase)
```typescript
interface Voucher {
  id: string; // UUID
  code: string;
  name: string;
  type: "percentage" | "fixed";
  value: number;
  category: string;
  companyName: string;
  province: string;
  district: string;
  googleMapLink?: string;
  status: "active" | "inactive";
  quantity: {
    used: number;
    total: number;
  };
  startDate: string; // ISO date
  endDate: string;
  image?: string;
}
```

## 🔍 Sample Vouchers

The seed endpoint creates 30 vouchers including:
- **WELCOME10**: 10% off at Coffee House (Bình Dương)
- **SAVE50**: 50k off at Market Box (Hồ Chí Minh)
- **SPRING15**: 15% off at Maisa Restaurant (Bình Dương)
- **CGV100**: 100k off at CGV Cinema (Bình Dương)
- **POOL20**: 20% off at Vincom Pool (Hồ Chí Minh)
- And 25 more...

## 🐛 Troubleshooting

### Không thấy vouchers
1. Check Supabase tables: `SELECT * FROM vouchers;`
2. Check RLS policies: Ensure user is authenticated
3. Check browser console for errors
4. Check terminal logs for fetch errors

### Lỗi khi seed
1. Ensure schema đã chạy thành công
2. Check Supabase connection (env variables)
3. Check API logs: `POST /api/vouchers/seed`

### Build errors
1. Run `npm run build` to check
2. All TypeScript errors should be resolved
3. If errors persist, check ESLint config

## 📝 Notes

- **Pattern**: Follows same migration pattern as roles & users pages
- **UUID**: Uses `crypto.randomUUID()` for new vouchers
- **RLS**: Policies allow authenticated users to view/manage
- **Upsert**: Seed endpoint uses conflict handling on `code` column
- **Field Mapping**: Automatic conversion between snake_case and camelCase

## ✨ Features

- ✅ Fetch from Supabase database
- ✅ Loading state indicator
- ✅ Search by code/name
- ✅ Filter by category, status, company, province
- ✅ Pagination (10 items per page)
- ✅ View residents who used voucher
- ✅ Add/Edit/Delete vouchers
- ✅ Image upload support
- ✅ Date range selection
- ✅ Quantity tracking (used/total)
