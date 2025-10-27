"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Nếu đã đăng nhập, chuyển đến dashboard
    if (isAuthenticated) {
      router.push('/admin');
      return;
    }

    // Kiểm tra xem đã chọn role chưa
    const selectedRole = localStorage.getItem('selectedRole');
    if (!selectedRole) {
      // Nếu chưa chọn role, chuyển đến trang chọn role
      router.push('/role-selection');
    } else {
      // Nếu đã chọn role nhưng chưa đăng nhập, chuyển đến trang login
      router.push('/signin');
    }
  }, [isAuthenticated, router]);

  // Hiển thị loading trong khi redirect
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Đang tải...</p>
      </div>
    </div>
  );
}