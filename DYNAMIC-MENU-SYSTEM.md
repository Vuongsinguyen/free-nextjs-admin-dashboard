# Hệ thống Quản lý Menu Động

Hệ thống này cho phép quản lý sidebar menu từ database, với menu khác nhau dựa trên role của người dùng.

## Cấu trúc

### 1. Database Tables

#### `menu_items` - Bảng lưu các menu items
```sql
- id: UUID
- name_key: Text (translation key, e.g., "nav.residents")
- icon: Text (icon name, e.g., "UserCircleIcon")
- path: Text (route path, e.g., "/residents")
- parent_id: UUID (null nếu là menu cha, có giá trị nếu là submenu)
- menu_group: Text ('main', 'masterData', 'systemConfig')
- display_order: Integer (thứ tự hiển thị)
- is_active: Boolean
- is_pro: Boolean
- is_new: Boolean
```

#### `role_menu_items` - Bảng liên kết role với menu
```sql
- id: UUID
- role_id: UUID (FK to roles table)
- menu_item_id: UUID (FK to menu_items table)
```

### 2. API Endpoint

**GET `/api/menu`**
- Trả về menu items dựa trên role của user đang đăng nhập
- Response format:
```json
{
  "success": true,
  "data": [
    {
      "group": "main",
      "titleKey": "QUICK ACCESS",
      "items": [...]
    },
    ...
  ]
}
```

### 3. React Hook

**`useMenu()`**
- Tự động fetch menu khi user đăng nhập
- Cache menu data
- Re-fetch khi role thay đổi
- Return: `{ menuGroups, loading, error }`

## Cài đặt

### Bước 1: Chạy Migration SQL

Mở Supabase SQL Editor và chạy file:
```bash
menu-system-migration.sql
```

File này sẽ:
- Tạo bảng `menu_items` và `role_menu_items`
- Tạo RLS policies
- Insert data mẫu cho tất cả menu hiện tại
- Gán menu cho các role (admin, user, resident)

### Bước 2: Verify Database

Kiểm tra trong Supabase Table Editor:
- Bảng `menu_items` có data
- Bảng `role_menu_items` có mapping
- Bảng `roles` có 3 roles: admin, user, resident

### Bước 3: Test

1. Login với user có role `admin` - sẽ thấy tất cả menu
2. Login với user có role `user` hoặc `resident` - chỉ thấy menu hạn chế

## Quản lý Menu

### Thêm Menu Item Mới

```sql
-- Thêm menu cha
INSERT INTO menu_items (name_key, icon, path, menu_group, display_order)
VALUES ('nav.newMenu', 'TableIcon', '/new-path', 'main', 10);

-- Thêm submenu
INSERT INTO menu_items (name_key, path, parent_id, menu_group, display_order)
VALUES (
  'nav.subMenu', 
  '/new-path/sub', 
  (SELECT id FROM menu_items WHERE name_key = 'nav.newMenu'),
  'main',
  1
);

-- Gán cho role admin
INSERT INTO role_menu_items (role_id, menu_item_id)
SELECT r.id, m.id
FROM roles r
CROSS JOIN menu_items m
WHERE r.name = 'admin' AND m.name_key = 'nav.newMenu';
```

### Thay đổi Menu cho Role

```sql
-- Gán menu cho role khác
INSERT INTO role_menu_items (role_id, menu_item_id)
SELECT r.id, m.id
FROM roles r
CROSS JOIN menu_items m
WHERE r.name = 'user' AND m.name_key = 'nav.residents';

-- Xóa menu khỏi role
DELETE FROM role_menu_items
WHERE role_id = (SELECT id FROM roles WHERE name = 'user')
  AND menu_item_id = (SELECT id FROM menu_items WHERE name_key = 'nav.userManagement');
```

### Ẩn/Hiện Menu

```sql
-- Ẩn menu
UPDATE menu_items SET is_active = false WHERE name_key = 'nav.oldFeature';

-- Hiện menu
UPDATE menu_items SET is_active = true WHERE name_key = 'nav.newFeature';
```

### Thay đổi thứ tự Menu

```sql
UPDATE menu_items SET display_order = 5 WHERE name_key = 'nav.residents';
```

## Icons có sẵn

- `UserCircleIcon`
- `TableIcon`
- `CalenderIcon`
- `ShootingStarIcon`
- `GridIcon`
- `PieChartIcon`
- `DollarLineIcon`
- `BoxCubeIcon`
- `ListIcon`
- `PlugInIcon`

Để thêm icon mới, cập nhật `getIconComponent()` trong `AppSidebar.tsx`

## Translation Keys

Tất cả menu sử dụng translation keys (e.g., `nav.residents`). Đảm bảo key tương ứng tồn tại trong:
- `/src/locales/en.json`
- `/src/locales/vi.json`
- `/src/locales/ja.json`

## Menu Groups

1. **main** - QUICK ACCESS
   - Các chức năng thường dùng (residents, invoices, events...)

2. **masterData** - MASTER DATA
   - Quản lý dữ liệu master (locations, buildings, users...)

3. **systemConfig** - SYSTEM CONFIGURATION
   - Cấu hình hệ thống (settings, configs...)

## Ví dụ: Tạo Menu theo Tenant

Nếu muốn menu khác nhau theo tenant/property:

```sql
-- Thêm tenant_id vào menu_items
ALTER TABLE menu_items ADD COLUMN tenant_id UUID;

-- Tạo menu riêng cho tenant
INSERT INTO menu_items (name_key, icon, path, menu_group, display_order, tenant_id)
VALUES ('nav.tenantSpecific', 'GridIcon', '/tenant-page', 'main', 99, '<tenant-uuid>');

-- Update API để filter theo tenant
-- Trong /api/menu/route.ts, thêm điều kiện:
-- .eq('tenant_id', user.tenant_id)
```

## Troubleshooting

### Menu không hiển thị
1. Check console log trong browser
2. Verify user có role trong database
3. Check `role_menu_items` có mapping đúng không
4. Verify RLS policies cho phép đọc data

### Menu bị duplicate
- Clear browser cache
- Check không có menu items bị duplicate trong DB

### Icon không hiển thị
- Verify tên icon trong DB match với `getIconComponent()`
- Thêm icon mới vào map nếu cần

## Best Practices

1. **Luôn test với nhiều roles** khác nhau
2. **Backup database** trước khi thay đổi menu structure
3. **Sử dụng transactions** khi thêm menu phức tạp
4. **Document translation keys** khi thêm menu mới
5. **Keep display_order** có khoảng cách (1, 10, 20...) để dễ insert sau này
