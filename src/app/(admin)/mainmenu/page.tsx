"use client";

import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";

export default function MainMenuPage() {
  const { t } = useLocale();

  const menuItems = [
    {
      id: "camera",
      title: "Camera",
      description: "View and manage security cameras",
      icon: "📹",
      color: "from-blue-500 to-blue-600",
      href: "/camera",
    },
    {
      id: "door",
      title: "Door",
      description: "Control smart door locks",
      icon: "🚪",
      color: "from-green-500 to-green-600",
      href: "/door",
    },
    {
      id: "lights",
      title: "Lights",
      description: "Manage lighting systems",
      icon: "💡",
      color: "from-yellow-500 to-yellow-600",
      href: "/lights",
    },
    {
      id: "invoice",
      title: "Invoice",
      description: "View service invoices",
      icon: "📄",
      color: "from-purple-500 to-purple-600",
      href: "/invoices",
    },
    {
      id: "properties",
      title: "Properties",
      description: "Manage your properties",
      icon: "🏢",
      color: "from-indigo-500 to-indigo-600",
      href: "/buildings/property",
    },
    {
      id: "voucher",
      title: "Voucher",
      description: "View available vouchers",
      icon: "🎟️",
      color: "from-pink-500 to-pink-600",
      href: "/vouchers",
    },
  ];

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Smart Home Main Menu
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Control and manage your smart home devices and services
        </p>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
            
            {/* Content */}
            <div className="relative p-8">
              {/* Icon */}
              <div className="mb-4 flex items-center justify-center">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-4xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                {item.description}
              </p>

              {/* Arrow Icon */}
              <div className="mt-4 flex justify-center">
                <svg
                  className="w-6 h-6 text-gray-400 group-hover:text-brand-500 dark:group-hover:text-brand-400 group-hover:translate-x-1 transition-all duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Info Banner */}
      <div className="mt-8 bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <svg
            className="w-6 h-6 text-brand-600 dark:text-brand-400 mt-0.5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-brand-900 dark:text-brand-300 mb-1">
              Smart Home Control Center
            </h4>
            <p className="text-sm text-brand-700 dark:text-brand-400">
              Access all your smart home features in one place. Monitor your cameras, control doors and lights, manage invoices, properties, and redeem vouchers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
