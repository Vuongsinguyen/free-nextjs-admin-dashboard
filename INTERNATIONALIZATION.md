# 🌐 Hệ thống Đa ngôn ngữ (Internationalization - i18n)

Hệ thống đa ngôn ngữ đã được thiết lập cho **TOÀN BỘ ứng dụng** với 5 ngôn ngữ:

## 🎯 Ngôn ngữ được hỗ trợ

| Ngôn ngữ | Code | Cờ | File |
|----------|------|----|----- |
| English (Mặc định) | `en` | 🇺🇸 | `src/locales/en.json` |
| Tiếng Việt | `vi` | 🇻🇳 | `src/locales/vi.json` |
| 日本語 (Tiếng Nhật) | `ja` | 🇯🇵 | `src/locales/ja.json` |
| 한국어 (Tiếng Hàn) | `ko` | 🇰🇷 | `src/locales/ko.json` |
| 中文 (Tiếng Trung) | `zh` | 🇨🇳 | `src/locales/zh.json` |

## 🏗️ Cấu trúc File Translation

```json
{
  "nav": {
    "menu": "Menu",
    "dashboard": "Dashboard",
    "userManagement": "User Management"
  },
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "loading": "Loading..."
  },
  "dashboard": {
    "title": "Dashboard",
    "totalUsers": "Total Users"
  },
  "userManagement": {
    "title": "User Management",
    "addNewUser": "Add New User"
  }
}
```

## 💻 Cách sử dụng trong Component

### 1. Import hook useLocale
```tsx
import { useLocale } from '@/context/LocaleContext';
```

### 2. Sử dụng function t() để dịch
```tsx
const MyComponent = () => {
  const { t, locale, setLocale } = useLocale();

  return (
    <div>
      <h1>{t('dashboard.title')}</h1>
      <p>{t('common.welcome')}</p>
      <button onClick={() => setLocale('vi')}>
        Chuyển sang Tiếng Việt
      </button>
    </div>
  );
};
```

### 3. Sử dụng nested keys
```tsx
// ✅ Đúng - sử dụng nested keys
{t('nav.dashboard')}
{t('common.save')}
{t('userManagement.addNewUser')}

// ❌ Sai - không sử dụng nested keys
{t('dashboard')}
{t('save')}
```

## 🔧 Thêm Translation Keys mới

### 1. Thêm vào file English (en.json)
```json
{
  "myNewSection": {
    "title": "My New Section",
    "description": "This is a new section"
  }
}
```

### 2. Thêm vào tất cả các file ngôn ngữ khác
- `vi.json` - Tiếng Việt
- `ja.json` - Tiếng Nhật  
- `ko.json` - Tiếng Hàn
- `zh.json` - Tiếng Trung

### 3. Sử dụng trong component
```tsx
{t('myNewSection.title')}
{t('myNewSection.description')}
```

## 📁 Ví dụ Component hoàn chỉnh

Xem file: \`src/components/dashboard/DashboardWelcome.tsx\`

```tsx
"use client";
import { useLocale } from '@/context/LocaleContext';

const MyPage = () => {
  const { t } = useLocale();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        {t('dashboard.title')}
      </h1>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3>{t('dashboard.totalUsers')}</h3>
          <p className="text-2xl font-bold">1,234</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3>{t('dashboard.totalRevenue')}</h3>
          <p className="text-2xl font-bold">$45,678</p>
        </div>
      </div>
      
      <div className="mt-6 flex gap-3">
        <button className="px-4 py-2 bg-blue-600 text-white rounded">
          {t('common.save')}
        </button>
        <button className="px-4 py-2 bg-gray-600 text-white rounded">
          {t('common.cancel')}
        </button>
      </div>
    </div>
  );
};
```

## 🎮 Language Switcher

Language Switcher đã được tích hợp trong header và có thể sử dụng ở bất kỳ đâu:

```tsx
import LanguageSwitcher from '@/components/common/LanguageSwitcher';

<LanguageSwitcher />
```

## 📝 Quy tắc đặt tên Translation Keys

1. **Sử dụng camelCase**: `userManagement`, `totalUsers`
2. **Nhóm theo chức năng**: `nav.*`, `dashboard.*`, `common.*`
3. **Tên có ý nghĩa**: `addNewUser` thay vì `add1`
4. **Tránh duplicate**: Mỗi key chỉ xuất hiện 1 lần

## 🔍 Tips & Tricks

### 1. Debug translation
```tsx
console.log('Current locale:', locale);
console.log('Translation:', t('dashboard.title'));
```

### 2. Fallback nếu key không tồn tại
```tsx
// Nếu key không tồn tại, sẽ return chính key đó
{t('nonexistent.key')} // Output: "nonexistent.key"
```

### 3. Lưu ngôn ngữ đã chọn
Ngôn ngữ được tự động lưu trong localStorage và sẽ được nhớ khi reload page.

---

## 🚀 Kết luận

Hệ thống đa ngôn ngữ đã được thiết lập **hoàn chỉnh cho toàn bộ ứng dụng**. Bạn có thể:

- ✅ Sử dụng trong bất kỳ component nào
- ✅ Thêm translation keys mới dễ dàng  
- ✅ Chuyển đổi ngôn ngữ real-time
- ✅ Lưu trữ lựa chọn người dùng
- ✅ Mở rộng thêm ngôn ngữ khác

Chỉ cần import `useLocale` và sử dụng `t()` function là có thể dịch bất kỳ text nào trong ứng dụng!