"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import { useAuth } from "@/context/AuthContext";
import { useLocale } from "@/context/LocaleContext";
import { locales, localeNames, localeFlags } from "@/lib/i18n";
import AccountsInfo from "@/components/auth/AccountsInfo";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const { login, loading, logout } = useAuth();
  const { t, locale, setLocale } = useLocale();
  const router = useRouter();

  // Lấy role đã chọn từ localStorage và redirect nếu chưa chọn
  useEffect(() => {
    const savedRole = localStorage.getItem('selectedRole');
    if (savedRole) {
      setSelectedRole(savedRole);
    } else {
      // Nếu chưa chọn role, redirect về trang chủ
      window.location.href = '/';
    }
  }, []);

  // Function để lấy tên role hiển thị
  const getRoleDisplayName = (roleId: string): string => {
    // Normalize legacy ids first
    const normalized = roleId === 'admin' ? 'all_users' : roleId === 'user' ? 'digital' : roleId;
    const translated = t(`roles.${normalized}`);
    return translated || normalized;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('🔵 handleSubmit called');
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    console.log('🔵 Email:', email);

    if (!email || !password) {
      setError(t('auth.signin.errors.requiredFields'));
      return;
    }

    console.log('🔵 Calling login...');
    const result = await login(email, password);
    console.log('🔵 === LOGIN RESULT ===', result);
    
    if (result.success) {
      // Kiểm tra role của user có khớp với role đã chọn không
      if (result.user && selectedRole) {
        const userRole = result.user.role;
        console.log('� Checking role: user role =', userRole, ', selected role =', selectedRole);
        
        if (userRole !== selectedRole) {
          console.log('🔴 Role mismatch! User role:', userRole, '!== Selected role:', selectedRole);
          const errorMessage = t('auth.signin.errors.roleMismatch')
            .replace('{userRole}', getRoleDisplayName(userRole))
            .replace('{selectedRole}', getRoleDisplayName(selectedRole));
          setError(errorMessage);
          // Logout user vì role không khớp
          await logout();
          return;
        }
      }
      
      console.log('✅ Login thành công, đang sync session...');
      
      // Chờ session sync với retry logic (tối đa 5 lần)
      let synced = false;
      for (let i = 0; i < 5; i++) {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session) {
          synced = true;
          console.log('🟢 Session synced:', sessionData.session.user.email);
          break;
        }
        console.log(`⏳ Retry ${i + 1}/5: Session chưa sẵn sàng, chờ thêm 300ms...`);
        await new Promise((r) => setTimeout(r, 300));
      }

      if (synced) {
        console.log('🚀 Session confirmed! Redirecting to /residents...');
        // Use router.push for better HMR compatibility
        setTimeout(() => {
          console.log('🔄 NOW executing redirect with router.push...');
          router.push('/residents');
        }, 200);
      } else {
        console.warn('⚠️ Session chưa sync hoàn toàn nhưng vẫn redirect thử...');
        setTimeout(() => {
          console.log('🔄 NOW executing redirect with router.push (fallback)...');
          router.push('/residents');
        }, 200);
      }
      return;
    } else {
      console.log('🔴 Login thất bại:', result.error);
      setError(result.error || t('auth.signin.errors.invalidCredentials'));
    }
  };
  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full relative">
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

      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          {t('common.back')}
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            {selectedRole && (
              <div className="mb-3">
                <p className="text-lg font-medium text-brand-600 dark:text-brand-400">
                  {t('common.welcome')} {getRoleDisplayName(selectedRole)}
                </p>
              </div>
            )}
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              {t('auth.signin.title')}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('auth.signin.subtitle')}
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
                    {error}
                  </div>
                )}
                
                <div>
                  <Label htmlFor="email">
                    {t('auth.signin.email')} <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input 
                    id="email"
                    name="email"
                    placeholder={t('auth.signin.emailPlaceholder')} 
                    type="email" 
                  />
                </div>
                <div>
                  <Label htmlFor="password">
                    {t('auth.signin.password')} <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t('auth.signin.passwordPlaceholder')}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      {t('auth.signin.keepMeLoggedIn')}
                    </span>
                  </div>
                  <Link
                    href="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    {t('auth.signin.forgotPassword')}
                  </Link>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? t('auth.signin.loggingIn') : t('auth.signin.signIn')}
                  </button>
                </div>
              </div>
            </form>

            {/* Test Accounts Information */}
            <AccountsInfo />

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                {t('auth.signin.dontHaveAccount')} {""}
                <Link
                  href="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  {t('nav.signUp')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
