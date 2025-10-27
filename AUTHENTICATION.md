# 🔐 Hệ thống Xác thực (Authentication System)

Hệ thống xác thực đã được thiết lập hoàn chỉnh với email và mật khẩu cố định.

## 🎯 Thông tin đăng nhập

| Thông tin | Giá trị |
|-----------|---------|
| **Email** | `admin@gardencity.com` |
| **Mật khẩu** | `Admin@123!!!` |

## 🏗️ Cấu trúc hệ thống

### **1. Authentication Context**
- File: `src/context/AuthContext.tsx`
- Quản lý trạng thái đăng nhập toàn cục
- Lưu trữ thông tin authentication trong localStorage

### **2. Protected Route Component**
- File: `src/components/auth/ProtectedRoute.tsx`
- Bảo vệ các trang admin
- Tự động redirect đến `/signin` nếu chưa đăng nhập

### **3. Sign In Form**
- File: `src/components/auth/SignInForm.tsx`
- Form đăng nhập với validation
- Hiển thị thông tin đăng nhập mẫu

## 🔒 Bảo mật các trang

### **Tự động bảo vệ:**
- Tất cả trang trong `(admin)` group được bảo vệ
- Dashboard, Calendar, User Management, v.v.
- Tự động redirect nếu chưa đăng nhập

### **Trang công khai:**
- `/signin` - Trang đăng nhập
- `/signup` - Trang đăng ký (chưa hoạt động)
- `/error-404` - Trang lỗi

## 🎮 Quy trình sử dụng

### **1. Truy cập ứng dụng**
```
http://localhost:3000
```

### **2. Tự động redirect**
- Nếu chưa đăng nhập → `/signin`
- Nếu đã đăng nhập → Dashboard

### **3. Đăng nhập**
- Nhập email: `admin@gardencity.com`
- Nhập mật khẩu: `Admin@123!!!`
- Click "Sign in"

### **4. Truy cập admin**
- Sau khi đăng nhập thành công
- Tự động redirect về Dashboard
- Có thể truy cập tất cả trang admin

### **5. Đăng xuất**
- Click vào avatar ở header
- Chọn "Sign out"
- Tự động redirect về `/signin`

## 🛠️ Tính năng

### ✅ **Đã hoàn thành:**
- **Xác thực cố định** với email/password
- **Protected Routes** cho tất cả trang admin
- **Tự động redirect** khi chưa/đã đăng nhập
- **Loading states** khi đang xử lý
- **Error handling** với thông báo lỗi
- **Persistent login** (lưu trong localStorage)
- **Logout functionality** từ user dropdown
- **Responsive design** cho mobile

### 🔧 **Thông tin kỹ thuật:**
- **Context API** để quản lý state
- **localStorage** để persist login
- **Form validation** cơ bản
- **TypeScript** với type safety
- **Next.js App Router** compatible

## 📱 Giao diện

### **Trang đăng nhập:**
- Hiển thị thông tin đăng nhập mẫu
- Form với email và password
- Toggle hiện/ẩn mật khẩu
- Loading state khi đang xử lý
- Error messages khi sai thông tin

### **User Dropdown:**
- Hiển thị "Garden City Admin"
- Email: admin@gardencity.com
- Menu options: Profile, Settings, Support
- Nút "Sign out" để đăng xuất

## 🚀 Test hệ thống

### **Test case 1: Đăng nhập thành công**
1. Truy cập `http://localhost:3000`
2. Tự động redirect đến `/signin`
3. Nhập đúng email/password
4. Click "Sign in"
5. ✅ Redirect về Dashboard

### **Test case 2: Đăng nhập sai**
1. Nhập sai email hoặc password
2. Click "Sign in"
3. ✅ Hiển thị error message
4. ✅ Không redirect

### **Test case 3: Protected Routes**
1. Chưa đăng nhập
2. Truy cập trực tiếp `/calendar` hoặc `/profile`
3. ✅ Tự động redirect về `/signin`

### **Test case 4: Persistent Login**
1. Đăng nhập thành công
2. Refresh trang hoặc đóng browser
3. Mở lại ứng dụng
4. ✅ Vẫn ở trạng thái đã đăng nhập

### **Test case 5: Logout**
1. Đã đăng nhập
2. Click avatar → "Sign out"
3. ✅ Redirect về `/signin`
4. ✅ Không thể truy cập trang admin

## 🔧 Mở rộng

### **Thêm user mới:**
Sửa file `src/context/AuthContext.tsx`:

```tsx
const VALID_CREDENTIALS = [
  { email: 'admin@gardencity.com', password: 'Admin@123!!!' },
  { email: 'user@gardencity.com', password: 'User@123!' },
];
```

### **Thêm role/permission:**
Mở rộng AuthContext với user roles:

```tsx
interface User {
  email: string;
  role: 'admin' | 'user';
  permissions: string[];
}
```

### **Kết nối API:**
Thay thế logic cố định bằng API calls:

```tsx
const login = async (email: string, password: string) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  // Handle response...
};
```

---

## 🎉 Kết luận

Hệ thống xác thực đã hoạt động hoàn chỉnh với:
- ✅ **Bảo mật trang admin** 
- ✅ **Login/Logout** functionality
- ✅ **Persistent sessions**
- ✅ **Error handling**
- ✅ **Responsive UI**

**Thông tin đăng nhập:**
- Email: `admin@gardencity.com`
- Password: `Admin@123!!!`

Truy cập `http://localhost:3000` để test!