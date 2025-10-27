"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useLocale } from "@/context/LocaleContext";

interface RoleOption {
  id: string;
  nameKey: string;
  description: string;
  icon: string;
  color: string;
}

const roleOptions: RoleOption[] = [
  {
    id: "admin",
    nameKey: "roleAdmin",
    description: "Quản trị viên hệ thống",
    icon: "👑",
    color: "bg-gradient-to-br from-yellow-400 to-orange-500"
  },
  {
    id: "building-owner",
    nameKey: "roleBuildingOwner", 
    description: "Chủ sở hữu tòa nhà",
    icon: "🏢",
    color: "bg-gradient-to-br from-blue-500 to-purple-600"
  },
  {
    id: "home-owner",
    nameKey: "roleHomeOwner",
    description: "Chủ sở hữu nhà",
    icon: "🏠",
    color: "bg-gradient-to-br from-green-500 to-teal-600"
  },
  {
    id: "tenant",
    nameKey: "roleTenant",
    description: "Người thuê nhà",
    icon: "👤",
    color: "bg-gradient-to-br from-indigo-500 to-blue-600"
  },
  {
    id: "guest",
    nameKey: "roleGuest",
    description: "Khách",
    icon: "👋",
    color: "bg-gradient-to-br from-gray-500 to-gray-600"
  },
  {
    id: "others",
    nameKey: "roleOthers",
    description: "Khác",
    icon: "❓",
    color: "bg-gradient-to-br from-pink-500 to-rose-600"
  }
];

export default function RoleSelectionPage() {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { t } = useLocale();

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
  };

  const handleContinue = () => {
    if (!selectedRole) return;
    
    setIsLoading(true);
    
    // Lưu role vào localStorage hoặc context
    localStorage.setItem("selectedRole", selectedRole);
    
    // Chuyển hướng đến trang login
    setTimeout(() => {
      router.push("/signin");
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-blue-light-50 dark:from-gray-950 dark:to-gray-900 p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Image
              src="/images/logo/logo-dark.svg"
              alt="Logo"
              width={200}
              height={50}
              className="dark:hidden"
            />
            <Image
              src="/images/logo/logo.svg"
              alt="Logo"
              width={200}
              height={50}
              className="hidden dark:block"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Chọn vai trò của bạn
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Vui lòng chọn vai trò phù hợp để tiếp tục
          </p>
        </div>

        {/* Role Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {roleOptions.map((role) => (
            <div
              key={role.id}
              onClick={() => handleRoleSelect(role.id)}
              className={`
                relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105
                ${selectedRole === role.id 
                  ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10 shadow-lg' 
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-brand-300'
                }
              `}
            >
              {/* Selection Indicator */}
              {selectedRole === role.id && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}

              {/* Role Icon */}
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4 ${role.color}`}>
                <span className="text-2xl">{role.icon}</span>
              </div>

              {/* Role Info */}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t(role.nameKey)}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {role.description}
              </p>
            </div>
          ))}
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={handleContinue}
            disabled={!selectedRole || isLoading}
            className={`
              px-8 py-3 rounded-lg font-medium text-white transition-all duration-200
              ${selectedRole && !isLoading
                ? 'bg-brand-500 hover:bg-brand-600 shadow-lg hover:shadow-xl'
                : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
              }
            `}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Đang xử lý...
              </div>
            ) : (
              'Tiếp tục'
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Bạn có thể thay đổi vai trò sau khi đăng nhập
          </p>
        </div>
      </div>
    </div>
  );
}