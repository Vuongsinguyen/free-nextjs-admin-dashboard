"use client";

import { useState, useEffect, useMemo } from "react";
import { useLocale } from "@/context/LocaleContext";

interface Promotion {
  id: number;
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minPurchase: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usageCount: number;
  status: "active" | "expired" | "scheduled" | "disabled";
  createdAt: string;
}

export default function PromotionsPage() {
  const { t } = useLocale();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [filteredPromotions, setFilteredPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Load promotions
  useEffect(() => {
    const loadPromotions = () => {
      setIsLoading(true);
      setTimeout(() => {
        const mockPromotions: Promotion[] = [
          {
            id: 1,
            code: "WELCOME2025",
            description: "Welcome discount for new users",
            discountType: "percentage",
            discountValue: 20,
            minPurchase: 100000,
            maxDiscount: 50000,
            startDate: "2025-01-01",
            endDate: "2025-12-31",
            usageLimit: 1000,
            usageCount: 245,
            status: "active",
            createdAt: "2025-01-01T00:00:00Z",
          },
          {
            id: 2,
            code: "NEWYEAR50",
            description: "New Year Special - 50% off",
            discountType: "percentage",
            discountValue: 50,
            minPurchase: 500000,
            maxDiscount: 200000,
            startDate: "2025-01-01",
            endDate: "2025-01-15",
            usageLimit: 100,
            usageCount: 100,
            status: "expired",
            createdAt: "2024-12-15T00:00:00Z",
          },
          {
            id: 3,
            code: "FLASH100K",
            description: "Flash sale - 100,000 VND off",
            discountType: "fixed",
            discountValue: 100000,
            minPurchase: 300000,
            startDate: "2025-11-01",
            endDate: "2025-11-30",
            usageLimit: 500,
            usageCount: 0,
            status: "scheduled",
            createdAt: "2025-10-15T00:00:00Z",
          },
          {
            id: 4,
            code: "MEMBER15",
            description: "Member exclusive - 15% discount",
            discountType: "percentage",
            discountValue: 15,
            minPurchase: 200000,
            maxDiscount: 100000,
            startDate: "2025-01-01",
            endDate: "2025-12-31",
            usageLimit: 2000,
            usageCount: 567,
            status: "active",
            createdAt: "2025-01-01T00:00:00Z",
          },
          {
            id: 5,
            code: "SUMMER2024",
            description: "Summer promotion ended",
            discountType: "percentage",
            discountValue: 30,
            minPurchase: 150000,
            maxDiscount: 80000,
            startDate: "2024-06-01",
            endDate: "2024-08-31",
            usageLimit: 800,
            usageCount: 756,
            status: "expired",
            createdAt: "2024-05-15T00:00:00Z",
          },
          {
            id: 6,
            code: "FREESHIP",
            description: "Free shipping for all orders",
            discountType: "fixed",
            discountValue: 30000,
            minPurchase: 0,
            startDate: "2025-10-01",
            endDate: "2025-10-31",
            usageLimit: 10000,
            usageCount: 3421,
            status: "active",
            createdAt: "2025-09-25T00:00:00Z",
          },
          {
            id: 7,
            code: "BLACKFRIDAY",
            description: "Black Friday mega sale",
            discountType: "percentage",
            discountValue: 40,
            minPurchase: 500000,
            maxDiscount: 300000,
            startDate: "2025-11-29",
            endDate: "2025-11-30",
            usageLimit: 5000,
            usageCount: 0,
            status: "scheduled",
            createdAt: "2025-10-01T00:00:00Z",
          },
          {
            id: 8,
            code: "LOYALTY25",
            description: "Loyalty rewards - disabled temporarily",
            discountType: "percentage",
            discountValue: 25,
            minPurchase: 300000,
            maxDiscount: 150000,
            startDate: "2025-01-01",
            endDate: "2025-12-31",
            usageLimit: 1500,
            usageCount: 234,
            status: "disabled",
            createdAt: "2025-01-01T00:00:00Z",
          },
        ];
        setPromotions(mockPromotions);
        setIsLoading(false);
      }, 800);
    };

    loadPromotions();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...promotions];

    if (searchTerm) {
      result = result.filter(promo =>
        promo.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promo.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      result = result.filter(promo => promo.status === statusFilter);
    }

    setFilteredPromotions(result);
    setCurrentPage(1);
  }, [promotions, searchTerm, statusFilter]);

  // Pagination
  const paginatedPromotions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPromotions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPromotions, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredPromotions.length / itemsPerPage);

  const getStatusBadge = (status: Promotion["status"]) => {
    const badges = {
      active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      expired: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      scheduled: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      disabled: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    };
    return badges[status];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading promotions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Promotions Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage discount codes and promotional campaigns
          </p>
        </div>
        <button className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          + Add Promotion
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by code or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="scheduled">Scheduled</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {promotions.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Total Promotions
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-green-600">
            {promotions.filter(p => p.status === "active").length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Active Promotions
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-blue-600">
            {promotions.filter(p => p.status === "scheduled").length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Scheduled
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-red-600">
            {promotions.filter(p => p.status === "expired").length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Expired
          </div>
        </div>
      </div>

      {/* Promotions Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Min Purchase
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Validity Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedPromotions.map((promo) => (
                <tr key={promo.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {promo.code}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-gray-300 max-w-xs">
                      {promo.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {promo.discountType === "percentage" 
                        ? `${promo.discountValue}%` 
                        : formatCurrency(promo.discountValue)}
                    </div>
                    {promo.maxDiscount && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Max: {formatCurrency(promo.maxDiscount)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-300">
                      {formatCurrency(promo.minPurchase)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-300">
                      {formatDate(promo.startDate)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(promo.endDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-300">
                      {promo.usageCount} / {promo.usageLimit}
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                      <div
                        className="bg-brand-500 h-1.5 rounded-full"
                        style={{ width: `${(promo.usageCount / promo.usageLimit) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(promo.status)}`}>
                      {promo.status.charAt(0).toUpperCase() + promo.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 px-6 py-3 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredPromotions.length)} of {filteredPromotions.length} results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  currentPage === page
                    ? "bg-brand-500 text-white"
                    : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
