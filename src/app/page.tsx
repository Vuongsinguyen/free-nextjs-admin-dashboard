"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { useLocale } from "@/context/LocaleContext";
import { locales, localeNames, localeFlags } from "@/lib/i18n";

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

export default function HomePage() {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const { t, locale, setLocale } = useLocale();

  // Nếu đã đăng nhập, redirect đến dashboard
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
  };

  const handleContinue = () => {
    if (!selectedRole) return;
    
    setIsLoading(true);
    
    // Lưu role vào localStorage
    localStorage.setItem("selectedRole", selectedRole);
    
    // Verify role được lưu thành công
    const savedRole = localStorage.getItem("selectedRole");
    console.log("Role saved:", savedRole); // Debug log
    
    // Chuyển hướng đến trang login
    setTimeout(() => {
      router.push("/signin");
    }, 300);
  };

  // Hiển thị loading khi đang kiểm tra authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Kiểm tra xác thực...</p>
        </div>
      </div>
    );
  }

  // Nếu đã đăng nhập, hiển thị loading redirect
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Đang chuyển đến dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-brand-50 to-blue-light-50 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4 z-50">
      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-10">
        <div className="relative">
          <button
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
          >
            <span className="text-lg">{localeFlags[locale]}</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {localeNames[locale]}
            </span>
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showLanguageDropdown && (
            <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 min-w-[160px]">
              {locales.map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    setLocale(loc);
                    setShowLanguageDropdown(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    locale === loc ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400' : 'text-gray-700 dark:text-gray-300'
                  } ${loc === locales[0] ? 'rounded-t-lg' : ''} ${loc === locales[locales.length - 1] ? 'rounded-b-lg' : ''}`}
                >
                  <span className="text-lg">{localeFlags[loc]}</span>
                  <span className="text-sm font-medium">{localeNames[loc]}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Image
              src="/images/logo/logo.svg"
              alt="Logo"
              width={200}
              height={50}
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('selectYourRole')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {t('pleaseSelectAppropriateRole')}
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
                {t('processing')}
              </div>
            ) : (
              t('continue')
            )}
          </button>
        </div>
      </div>
    </div>
  );
}