"use client";

import { useState } from "react";

interface Voucher {
  id: number;
  code: string;
  name: string;
  type: "percentage" | "fixed";
  value: number;
  category: string;
  companyName: string;
  status: "active" | "inactive";
  endDate: string;
  used: boolean;
}

const myVouchers: Voucher[] = [
  { id: 1, code: "WELCOME10", name: "Welcome 10%", type: "percentage", value: 10, category: "Coffee Shop", companyName: "Coffee House", status: "active", endDate: "2025-12-31", used: false },
  { id: 3, code: "SPRING15", name: "Spring 15%", type: "percentage", value: 15, category: "Restaurant", companyName: "Maisa", status: "active", endDate: "2025-05-31", used: false },
  { id: 5, code: "CGV100", name: "CGV 100k Off", type: "fixed", value: 100000, category: "Fest", companyName: "CGV", status: "active", endDate: "2025-11-30", used: false },
  { id: 6, code: "COFFEE25", name: "Coffee 25% Off", type: "percentage", value: 25, category: "Coffee Shop", companyName: "CONG Coffee", status: "active", endDate: "2025-12-20", used: false },
  { id: 8, code: "MEAL15", name: "Meal Discount 15%", type: "percentage", value: 15, category: "Restaurant", companyName: "Maisa", status: "active", endDate: "2025-12-31", used: false },
  { id: 10, code: "SWIM10", name: "Swim 10%", type: "percentage", value: 10, category: "Pool", companyName: "Vincom", status: "active", endDate: "2025-12-10", used: false },
  { id: 11, code: "MOVIE50", name: "Movie Night 50k", type: "fixed", value: 50000, category: "Fest", companyName: "CGV", status: "active", endDate: "2025-10-20", used: false },
  { id: 12, code: "BREW20", name: "Brew Time 20%", type: "percentage", value: 20, category: "Coffee Shop", companyName: "Coffee House", status: "active", endDate: "2025-12-25", used: false },
  { id: 13, code: "SNACK15", name: "Snack 15k", type: "fixed", value: 15000, category: "Convenience Store", companyName: "Becamex Store", status: "active", endDate: "2025-09-15", used: false },
  { id: 15, code: "MART60", name: "Mart Special 60k", type: "fixed", value: 60000, category: "Supermarket", companyName: "Market Box", status: "active", endDate: "2025-11-25", used: false },
  { id: 17, code: "CINEMA70", name: "Cinema Pass 70k", type: "fixed", value: 70000, category: "Fest", companyName: "CGV", status: "active", endDate: "2025-12-20", used: false },
  { id: 18, code: "LATTE18", name: "Latte Lover 18%", type: "percentage", value: 18, category: "Coffee Shop", companyName: "CONG Coffee", status: "active", endDate: "2025-10-15", used: true },
];

export default function MyVouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>(myVouchers);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const handleUseVoucher = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setShowConfirmModal(true);
  };

  const confirmUseVoucher = () => {
    if (selectedVoucher) {
      setVouchers(prev =>
        prev.map(v =>
          v.id === selectedVoucher.id ? { ...v, used: true } : v
        )
      );
      setShowConfirmModal(false);
      setSelectedVoucher(null);
    }
  };

  const filteredVouchers = vouchers.filter(v => {
    const matchesCategory = !filterCategory || v.category === filterCategory;
    const matchesStatus = 
      filterStatus === "all" ||
      (filterStatus === "used" && v.used) ||
      (filterStatus === "available" && !v.used);
    return matchesCategory && matchesStatus;
  });

  const categories = Array.from(new Set(vouchers.map(v => v.category)));

  const formatValue = (voucher: Voucher) => {
    if (voucher.type === "percentage") {
      return `${voucher.value}% OFF`;
    }
    return `${(voucher.value / 1000).toFixed(0)}k OFF`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      "Coffee Shop": "☕",
      "Restaurant": "🍽️",
      "Fest": "🎬",
      "Pool": "🏊",
      "Convenience Store": "🏪",
      "Supermarket": "🛒",
    };
    return icons[category] || "🎫";
  };

  const stats = {
    total: vouchers.length,
    available: vouchers.filter(v => !v.used).length,
    used: vouchers.filter(v => v.used).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Vouchers
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          View and manage your personal voucher collection
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Vouchers</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Available</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{stats.available}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Used</p>
          <p className="text-2xl font-bold text-gray-600 dark:text-gray-400 mt-1">{stats.used}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Vouchers</option>
              <option value="available">Available</option>
              <option value="used">Used</option>
            </select>
          </div>
        </div>
      </div>

      {/* Voucher Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVouchers.map((voucher) => (
          <div
            key={voucher.id}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden ${
              voucher.used ? "opacity-60" : ""
            }`}
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-brand-500 to-brand-600 p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">{getCategoryIcon(voucher.category)}</span>
                <span className="text-xs bg-white/20 px-2 py-1 rounded">
                  {voucher.category}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-1">{voucher.name}</h3>
              <p className="text-sm opacity-90">{voucher.companyName}</p>
            </div>

            {/* Card Body */}
            <div className="p-4">
              {/* Discount Value */}
              <div className="text-center py-4 mb-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-3xl font-bold text-brand-600 dark:text-brand-400">
                  {formatValue(voucher)}
                </div>
              </div>

              {/* Voucher Code */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Voucher Code</p>
                <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <code className="text-sm font-mono font-semibold text-gray-900 dark:text-white">
                    {voucher.code}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(voucher.code);
                      alert("Voucher code copied!");
                    }}
                    className="text-brand-600 hover:text-brand-700 dark:text-brand-400"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Expiry Date */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Valid Until</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatDate(voucher.endDate)}
                </p>
              </div>

              {/* Action Button */}
              {voucher.used ? (
                <button
                  disabled
                  className="w-full px-4 py-3 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-lg font-medium cursor-not-allowed"
                >
                  Voucher Used ✓
                </button>
              ) : (
                <button
                  onClick={() => handleUseVoucher(voucher)}
                  className="w-full px-4 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors"
                >
                  Use this Voucher
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredVouchers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No vouchers found</p>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && selectedVoucher && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Confirm Voucher Usage
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to use this voucher? This action cannot be undone.
            </p>
            
            {/* Voucher Preview */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{getCategoryIcon(selectedVoucher.category)}</span>
                <span className="text-xs bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 px-2 py-1 rounded">
                  {selectedVoucher.category}
                </span>
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                {selectedVoucher.name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {selectedVoucher.companyName}
              </p>
              <div className="text-2xl font-bold text-brand-600 dark:text-brand-400">
                {formatValue(selectedVoucher)}
              </div>
              <code className="text-sm font-mono bg-white dark:bg-gray-800 px-2 py-1 rounded mt-2 inline-block">
                {selectedVoucher.code}
              </code>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedVoucher(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmUseVoucher}
                className="flex-1 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium"
              >
                Confirm Use
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
