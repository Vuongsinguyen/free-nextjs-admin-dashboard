"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
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
    description: "System Administrator",
    icon: "/images/icons/Setting.png",
    color: "bg-gradient-to-br from-yellow-400 to-orange-500"
  },
  {
    id: "building-owner",
    nameKey: "roleBuildingOwner", 
    description: "Chủ sở hữu tòa nhà",
    icon: "/images/icons/Info.png",
    color: "bg-gradient-to-br from-blue-500 to-purple-600"
  },
  {
    id: "home-owner",
    nameKey: "roleHomeOwner",
    description: "Chủ sở hữu nhà",
    icon: "/images/icons/home-owner.png",
    color: "bg-gradient-to-br from-green-500 to-teal-600"
  },
  {
    id: "tenant",
    nameKey: "roleTenant",
    description: "Người thuê nhà",
    icon: "/images/icons/Calendar.png",
    color: "bg-gradient-to-br from-indigo-500 to-blue-600"
  },
  {
    id: "guest",
    nameKey: "roleGuest",
    description: "Khách",
    icon: "/images/icons/guest.png",
    color: "bg-gradient-to-br from-gray-500 to-gray-600"
  },
  {
    id: "others",
    nameKey: "roleOthers",
    description: "Khác",
    icon: "/images/icons/Clock.png",
    color: "bg-gradient-to-br from-pink-500 to-rose-600"
  }
];

export default function HomePage() {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const { t, locale, setLocale } = useLocale();
  const { theme, toggleTheme } = useTheme();

  // Background images array
  const backgroundImages = [
    "/images/background/bg1.avif",
    "/images/background/bg2.avif",
    "/images/background/bg3.avif"
  ];

  // Auto-change background with fade effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 10000); // Change every 10 seconds

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  // Comment out auto redirect - luôn hiển thị trang chọn role
  // useEffect(() => {
  //   if (!loading && isAuthenticated) {
  //     router.replace('/dashboard');
  //   }
  // }, [isAuthenticated, loading, router]);

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    
    // Auto continue when role is selected
    setIsLoading(true);
    
    // Lưu role vào localStorage
    localStorage.setItem("selectedRole", roleId);
    
    // Verify role được lưu thành công
    const savedRole = localStorage.getItem("selectedRole");
    console.log("Role saved:", savedRole); // Debug log
    
    // Nếu đã đăng nhập, chuyển đến trang tương ứng với role
    // Nếu chưa đăng nhập, chuyển đến trang login
    setTimeout(() => {
      if (isAuthenticated) {
        const nonAdminRoles = ['home-owner', 'tenant', 'guest', 'others'];
        if (nonAdminRoles.includes(roleId)) {
          router.push("/mainmenu");
        } else {
          router.push("/dashboard");
        }
      } else {
        router.push("/signin");
      }
      setIsLoading(false);
    }, 500);
  };

  const handleContinue = () => {
    if (!selectedRole) return;
    
    setIsLoading(true);
    
    // Lưu role vào localStorage
    localStorage.setItem("selectedRole", selectedRole);
    
    // Verify role được lưu thành công
    const savedRole = localStorage.getItem("selectedRole");
    console.log("Role saved:", savedRole); // Debug log
    
    // Nếu đã đăng nhập, chuyển đến trang tương ứng với role
    // Nếu chưa đăng nhập, chuyển đến trang login
    setTimeout(() => {
      if (isAuthenticated) {
        const nonAdminRoles = ['home-owner', 'tenant', 'guest', 'others'];
        if (nonAdminRoles.includes(selectedRole)) {
          router.push("/mainmenu");
        } else {
          router.push("/dashboard");
        }
      } else {
        router.push("/signin");
      }
    }, 300);
  };

  // Hiển thị loading khi đang kiểm tra authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Luôn hiển thị trang chọn role, không redirect tự động
  // if (isAuthenticated) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
  //       <div className="text-center">
  //         <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
  //         <p className="text-gray-600 dark:text-gray-300">Đang chuyển đến dashboard...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="relative min-h-screen pt-[100px] pb-8 px-4 overflow-hidden">
      {/* Background Image Slideshow with Fade Effect */}
      <div className="fixed inset-0 -z-10">
        {backgroundImages.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentBgIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={image}
              alt={`Background ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
              quality={90}
            />
            {/* Linear gradient overlay - light blue-white at top (70%) fading to transparent at bottom (30%) */}
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-50/85 from-70% to-transparent dark:from-cyan-900/50 dark:from-70% dark:to-transparent"></div>
          </div>
        ))}
      </div>

      {/* Language Switcher & Theme Toggle */}
      <div className="fixed top-6 right-6 z-10 flex items-center gap-3">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-12 h-12 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700 hover:scale-105"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? (
            <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>

        {/* Language Switcher */}
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

      {/* Main Content Container */}
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Image
              className="dark:hidden drop-shadow-lg"
              src="/images/logo/logo.svg"
              alt="Logo"
              width={280}
              height={70}
            />
            <Image
              className="hidden dark:block drop-shadow-lg"
              src="/images/logo/logo-dark.svg"
              alt="Logo"
              width={280}
              height={70}
            />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 drop-shadow-lg text-center">
            WELCOME TO SPM - SMART POCKET HOME APPLICATION MANAGEMENT SYSTEM
          </h1>
          <p className="text-gray-700 dark:text-white/90 drop-shadow-md">
            {t('pleaseSelectAppropriateRole')}
          </p>
        </div>

        {/* Role Selection Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          {roleOptions.map((role) => (
            <div
              key={role.id}
              onClick={() => handleRoleSelect(role.id)}
              className={`
                relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 backdrop-blur-sm
                ${selectedRole === role.id 
                  ? 'border-brand-500 bg-white/95 dark:bg-brand-500/20 shadow-lg shadow-brand-500/50' 
                  : 'border-white/30 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 hover:border-brand-300 hover:bg-white/95'
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
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
                {role.icon.startsWith('/images/') ? (
                  <Image
                    src={role.icon}
                    alt={t(role.nameKey)}
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                ) : (
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl ${role.color}`}>
                    <span className="text-2xl">{role.icon}</span>
                  </div>
                )}
              </div>

              {/* Role Info */}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t(role.nameKey)}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}