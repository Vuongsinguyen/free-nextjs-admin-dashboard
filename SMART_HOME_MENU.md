# 🏠 SMART HOME Menu - Role-Based Access Control

## 📋 Tổng quan

Hệ thống menu đã được cập nhật với **Group Menu SMART HOME** mới và logic phân quyền theo role.

## 🎯 Chức năng chính

### 1. **Group Menu SMART HOME** (Hiển thị trên cùng)
Menu này hiển thị cho **TẤT CẢ** user (Admin và Non-Admin):

- 🏠 **Main Menu** → `/dashboard`
- 📄 **Service Invoice** → `/invoices`
- 🎫 **My Vouchers** → `/vouchers`
- 📢 **Announcements** → `/announcements`
- 📅 **Events** → `/events`
- 🏢 **My Properties** → `/buildings/property`

### 2. **Phân quyền theo Role**

#### 👑 **Admin** (role: "admin")
✅ Thấy **TẤT CẢ** menu:
- ✅ SMART HOME
- ✅ QUICK ACCESS
- ✅ MASTER DATA
- ✅ SYSTEM CONFIGURATION

#### 👥 **Non-Admin Users** (building-owner, home-owner, tenant, guest, others)
✅ Chỉ thấy:
- ✅ **SMART HOME** (6 menu items)
- ❌ KHÔNG thấy QUICK ACCESS
- ❌ KHÔNG thấy MASTER DATA
- ❌ KHÔNG thấy SYSTEM CONFIGURATION

## 🔧 Cách hoạt động

### Authentication & Role Detection
```tsx
const { user } = useAuth(); // Lấy thông tin user từ AuthContext
const isAdmin = user?.role === 'admin'; // Check admin role
```

### Menu Rendering Logic
```tsx
// SMART HOME - Visible to ALL users
<div>
  <h2>SMART HOME</h2>
  {renderMenuItems(getSmartHomeItems(), "smartHome")}
</div>

// Admin-only sections
{isAdmin && (
  <>
    <div>
      <h2>QUICK ACCESS</h2>
      {renderMenuItems(getNavItems(), "main")}
    </div>
    
    <div>
      <h2>MASTER DATA</h2>
      {renderMenuItems(getMasterDataItems(), "masterData")}
    </div>
    
    <div>
      <h2>SYSTEM CONFIGURATION</h2>
      {renderMenuItems(getSystemConfigItems(), "systemConfig")}
    </div>
  </>
)}
```

## 📝 Files Modified

### 1. `/src/layout/AppSidebar.tsx`
- ✅ Added `useAuth` import
- ✅ Added `isAdmin` role check
- ✅ Created `getSmartHomeItems()` function
- ✅ Updated menu rendering with conditional logic
- ✅ Added "smartHome" to TypeScript types

### 2. Locale Files (i18n)

#### `/src/locales/en.json`
```json
{
  "nav": {
    "mainMenu": "Main Menu",
    "serviceInvoice": "Service Invoice",
    "myVouchers": "My Vouchers",
    "events": "Events",
    "myProperties": "My Properties"
  }
}
```

#### `/src/locales/vi.json`
```json
{
  "nav": {
    "mainMenu": "Menu Chính",
    "serviceInvoice": "Hóa Đơn Dịch Vụ",
    "myVouchers": "Voucher Của Tôi",
    "events": "Sự Kiện",
    "myProperties": "Căn Hộ Của Tôi"
  }
}
```

#### `/src/locales/ja.json`
```json
{
  "nav": {
    "mainMenu": "メインメニュー",
    "serviceInvoice": "サービス請求書",
    "myVouchers": "マイバウチャー",
    "events": "イベント",
    "myProperties": "マイプロパティ"
  }
}
```

## 🧪 Testing

### Test Cases

#### 1. **Login as Admin**
```
Email: admin@gardencity.com
Password: Admin@123!!!
```
**Expected Result:**
- ✅ Thấy menu SMART HOME
- ✅ Thấy menu QUICK ACCESS
- ✅ Thấy menu MASTER DATA
- ✅ Thấy menu SYSTEM CONFIGURATION

#### 2. **Login as Building Owner**
```
Email: buildingowner@gardencity.com
Password: Owner@123
```
**Expected Result:**
- ✅ Thấy SMART HOME (6 items)
- ❌ KHÔNG thấy QUICK ACCESS
- ❌ KHÔNG thấy MASTER DATA
- ❌ KHÔNG thấy SYSTEM CONFIGURATION

#### 3. **Login as Home Owner**
```
Email: homeowner@gardencity.com
Password: HomeOwner@123
```
**Expected Result:**
- ✅ Thấy SMART HOME (6 items)
- ❌ KHÔNG thấy các menu khác

#### 4. **Login as Tenant**
```
Email: tenant@gardencity.com
Password: Tenant@123
```
**Expected Result:**
- ✅ Thấy SMART HOME (6 items)
- ❌ KHÔNG thấy các menu khác

## 🎨 Menu Structure

```
SIDEBAR
│
├── 🏠 SMART HOME (ALL USERS)
│   ├── Main Menu
│   ├── Service Invoice
│   ├── My Vouchers
│   ├── Announcements
│   ├── Events
│   └── My Properties
│
└── [ADMIN ONLY SECTIONS]
    ├── ⚡ QUICK ACCESS
    │   ├── Dashboard
    │   ├── Service Fee Invoice
    │   ├── Events & Announcements
    │   ├── Vouchers & Promotions
    │   └── Facilities
    │
    ├── 📊 MASTER DATA
    │   ├── Locations
    │   ├── Building
    │   ├── Asset/Maintenance
    │   └── User Management
    │
    └── ⚙️ SYSTEM CONFIGURATION
        └── Settings
```

## 🔒 Security Notes

1. **Frontend Protection**: Menu items ẩn dựa trên role
2. **Backend Protection**: Cần implement API route protection
3. **Role-based**: Dựa vào `user.role` từ AuthContext
4. **Dynamic**: Menu tự động update khi user login/logout

## 📌 Important Notes

- Menu SMART HOME luôn hiển thị đầu tiên (top position)
- Admin thấy tất cả menu (SMART HOME + Admin sections)
- Non-admin chỉ thấy SMART HOME
- Translation support: English, Vietnamese, Japanese
- Responsive design được giữ nguyên
- Dark mode support được giữ nguyên

## 🚀 Next Steps (Optional)

1. ✅ Add route guards cho protected pages
2. ✅ Implement API middleware cho role checking
3. ✅ Add permission-based access (chi tiết hơn role)
4. ✅ Log user access attempts
5. ✅ Add analytics tracking per role

---

**Created:** October 28, 2025  
**Version:** 1.0.0  
**Status:** ✅ Active
