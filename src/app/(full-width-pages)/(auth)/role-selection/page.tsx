"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RoleSelectionRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect đến trang home (root) vì role selection giờ đã là trang mặc định
    router.replace('/');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Redirecting to home...</p>
      </div>
    </div>
  );
}