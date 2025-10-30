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

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const { login, loading } = useAuth();
  const { t, locale, setLocale } = useLocale();

  // Lấy role đã chọn từ localStorage
  useEffect(() => {
    const savedRole = localStorage.getItem('selectedRole');
    if (savedRole) {
      setSelectedRole(savedRole);
    }
  }, []);

  // Function để lấy tên role hiển thị
  const getRoleDisplayName = (roleId: string): string => {
    const roleMap: Record<string, string> = {
      'admin': t('roleAdmin'),
      'building-owner': t('roleBuildingOwner'),
      'home-owner': t('roleHomeOwner'),
      'tenant': t('roleTenant'),
      'guest': t('roleGuest'),
      'others': t('roleOthers')
    };
    return roleMap[roleId] || roleId;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    const success = await login(email, password);
    if (success) {
      // Đợi một chút để đảm bảo authentication state đã được update
      setTimeout(() => {
        // Redirect all roles to residents page
        window.location.href = '/residents';
      }, 200);
    } else {
      setError('Email hoặc mật khẩu không đúng. Vui lòng thử lại.');
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
          Back
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            {selectedRole && (
              <div className="mb-3">
                <p className="text-lg font-medium text-brand-600 dark:text-brand-400">
                  Welcome {getRoleDisplayName(selectedRole)}
                </p>
              </div>
            )}
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
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
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input 
                    id="email"
                    name="email"
                    placeholder="Enter your email" 
                    type="email" 
                  />
                </div>
                <div>
                  <Label htmlFor="password">
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
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
                      Keep me logged in
                    </span>
                  </div>
                  <Link
                    href="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? 'Logging in...' : 'Sign in'}
                  </button>
                </div>
              </div>
            </form>

            {/* Test Accounts Information */}
            <AccountsInfo />

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account? {""}
                <Link
                  href="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
