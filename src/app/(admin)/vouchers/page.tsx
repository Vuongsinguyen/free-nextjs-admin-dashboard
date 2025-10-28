"use client";

import { useState, useEffect } from "react";

interface Voucher {
  id: number;
  code: string;
  name: string;
  type: "percentage" | "fixed";
  value: number;
  category: string;
  companyName: string;
  status: "active" | "inactive" | "used";
  startDate: string; // ISO date
  endDate: string;   // ISO date
}

const initialVouchers: Voucher[] = [
  { id: 1, code: "WELCOME10", name: "Welcome 10%", type: "percentage", value: 10, category: "Coffee Shop", companyName: "Coffee House", status: "active", startDate: "2025-01-01", endDate: "2025-12-31" },
  { id: 2, code: "SAVE50", name: "Save 50k", type: "fixed", value: 50000, category: "Supermarket", companyName: "Market Box", status: "inactive", startDate: "2025-06-01", endDate: "2025-09-30" },
  { id: 3, code: "SPRING15", name: "Spring 15%", type: "percentage", value: 15, category: "Restaurant", companyName: "Maisa", status: "active", startDate: "2025-03-01", endDate: "2025-05-31" },
  { id: 4, code: "POOL20", name: "Pool Pass 20%", type: "percentage", value: 20, category: "Pool", companyName: "Vincom", status: "used", startDate: "2025-01-15", endDate: "2025-12-15" },
  { id: 5, code: "CGV100", name: "CGV 100k Off", type: "fixed", value: 100000, category: "Fest", companyName: "CGV", status: "active", startDate: "2025-02-01", endDate: "2025-11-30" },
  { id: 6, code: "COFFEE25", name: "Coffee 25% Off", type: "percentage", value: 25, category: "Coffee Shop", companyName: "CONG Coffee", status: "active", startDate: "2025-01-10", endDate: "2025-12-20" },
  { id: 7, code: "STORE30", name: "Store 30k", type: "fixed", value: 30000, category: "Convenience Store", companyName: "Becamex Store", status: "used", startDate: "2025-03-05", endDate: "2025-08-05" },
  { id: 8, code: "MEAL15", name: "Meal Discount 15%", type: "percentage", value: 15, category: "Restaurant", companyName: "Maisa", status: "active", startDate: "2025-01-01", endDate: "2025-12-31" },
  { id: 9, code: "FRESH40", name: "Fresh 40k", type: "fixed", value: 40000, category: "Supermarket", companyName: "Market Box", status: "inactive", startDate: "2025-04-01", endDate: "2025-07-31" },
  { id: 10, code: "SWIM10", name: "Swim 10%", type: "percentage", value: 10, category: "Pool", companyName: "Vincom", status: "active", startDate: "2025-02-10", endDate: "2025-12-10" },
  { id: 11, code: "MOVIE50", name: "Movie Night 50k", type: "fixed", value: 50000, category: "Fest", companyName: "CGV", status: "used", startDate: "2025-01-20", endDate: "2025-10-20" },
  { id: 12, code: "BREW20", name: "Brew Time 20%", type: "percentage", value: 20, category: "Coffee Shop", companyName: "Coffee House", status: "active", startDate: "2025-01-05", endDate: "2025-12-25" },
  { id: 13, code: "SNACK15", name: "Snack 15k", type: "fixed", value: 15000, category: "Convenience Store", companyName: "Becamex Store", status: "active", startDate: "2025-02-15", endDate: "2025-09-15" },
  { id: 14, code: "DINE25", name: "Dine Out 25%", type: "percentage", value: 25, category: "Restaurant", companyName: "Maisa", status: "used", startDate: "2025-03-10", endDate: "2025-08-10" },
  { id: 15, code: "MART60", name: "Mart Special 60k", type: "fixed", value: 60000, category: "Supermarket", companyName: "Market Box", status: "active", startDate: "2025-01-25", endDate: "2025-11-25" },
  { id: 16, code: "AQUA30", name: "Aqua Fun 30%", type: "percentage", value: 30, category: "Pool", companyName: "Vincom", status: "inactive", startDate: "2025-04-05", endDate: "2025-09-05" },
  { id: 17, code: "CINEMA70", name: "Cinema Pass 70k", type: "fixed", value: 70000, category: "Fest", companyName: "CGV", status: "active", startDate: "2025-02-20", endDate: "2025-12-20" },
  { id: 18, code: "LATTE18", name: "Latte Lover 18%", type: "percentage", value: 18, category: "Coffee Shop", companyName: "CONG Coffee", status: "used", startDate: "2025-01-15", endDate: "2025-10-15" },
  { id: 19, code: "QUICK20", name: "Quick Shop 20k", type: "fixed", value: 20000, category: "Convenience Store", companyName: "Becamex Store", status: "active", startDate: "2025-03-01", endDate: "2025-11-01" },
  { id: 20, code: "FEAST30", name: "Feast Time 30%", type: "percentage", value: 30, category: "Restaurant", companyName: "Maisa", status: "active", startDate: "2025-01-08", endDate: "2025-12-08" },
  { id: 21, code: "GROCERY80", name: "Grocery 80k", type: "fixed", value: 80000, category: "Supermarket", companyName: "Market Box", status: "used", startDate: "2025-02-12", endDate: "2025-09-12" },
  { id: 22, code: "SPLASH12", name: "Splash Day 12%", type: "percentage", value: 12, category: "Pool", companyName: "Vincom", status: "active", startDate: "2025-01-30", endDate: "2025-12-30" },
  { id: 23, code: "SHOW90", name: "Show Time 90k", type: "fixed", value: 90000, category: "Fest", companyName: "CGV", status: "inactive", startDate: "2025-03-15", endDate: "2025-08-15" },
  { id: 24, code: "ESPRESSO22", name: "Espresso Deal 22%", type: "percentage", value: 22, category: "Coffee Shop", companyName: "Coffee House", status: "active", startDate: "2025-01-12", endDate: "2025-11-12" },
  { id: 25, code: "GRAB25", name: "Grab & Go 25k", type: "fixed", value: 25000, category: "Convenience Store", companyName: "Becamex Store", status: "used", startDate: "2025-02-25", endDate: "2025-10-25" },
  { id: 26, code: "GOURMET35", name: "Gourmet 35%", type: "percentage", value: 35, category: "Restaurant", companyName: "Maisa", status: "active", startDate: "2025-01-18", endDate: "2025-12-18" },
  { id: 27, code: "FRESH100", name: "Fresh Pick 100k", type: "fixed", value: 100000, category: "Supermarket", companyName: "Market Box", status: "active", startDate: "2025-03-20", endDate: "2025-11-20" },
  { id: 28, code: "DIVE15", name: "Dive In 15%", type: "percentage", value: 15, category: "Pool", companyName: "Vincom", status: "used", startDate: "2025-02-05", endDate: "2025-09-05" },
  { id: 29, code: "EVENT60", name: "Event Special 60k", type: "fixed", value: 60000, category: "Fest", companyName: "CGV", status: "active", startDate: "2025-01-22", endDate: "2025-12-22" },
  { id: 30, code: "MOCHA28", name: "Mocha Magic 28%", type: "percentage", value: 28, category: "Coffee Shop", companyName: "CONG Coffee", status: "active", startDate: "2025-01-28", endDate: "2025-11-28" },
];

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>(initialVouchers);
  const [filteredVouchers, setFilteredVouchers] = useState<Voucher[]>(initialVouchers);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Voucher | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCompany, setFilterCompany] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleAdd = () => {
    setEditing({
      id: 0,
      code: "",
      name: "",
      type: "percentage",
      value: 0,
      category: "Restaurant",
      companyName: "Coffee House",
      status: "active",
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date().toISOString().slice(0, 10),
    });
    setShowModal(true);
  };

  const handleEdit = (v: Voucher) => {
    setEditing(JSON.parse(JSON.stringify(v)) as Voucher);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this voucher?")) {
      setVouchers(prev => prev.filter(v => v.id !== id));
    }
  };

  // Filter effect
  useEffect(() => {
    let result = [...vouchers];

    // Search filter
    if (searchTerm) {
      result = result.filter(v =>
        v.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filterCategory) {
      result = result.filter(v => v.category === filterCategory);
    }

    // Status filter
    if (filterStatus) {
      result = result.filter(v => v.status === filterStatus);
    }

    // Company filter
    if (filterCompany) {
      result = result.filter(v => v.companyName === filterCompany);
    }

    setFilteredVouchers(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [vouchers, searchTerm, filterCategory, filterStatus, filterCompany]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredVouchers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVouchers = filteredVouchers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSave = () => {
    if (!editing) return;

    if (!editing.code.trim() || !editing.name.trim()) {
      alert("Please enter code and name");
      return;
    }

    if (editing.value <= 0) {
      alert("Value must be greater than 0");
      return;
    }

    if (editing.id === 0) {
      const newVoucher: Voucher = {
        ...editing,
        id: Math.max(0, ...vouchers.map(v => v.id)) + 1,
      };
      setVouchers(prev => [...prev, newVoucher]);
    } else {
      setVouchers(prev => prev.map(v => (v.id === editing.id ? editing : v)));
    }

    setShowModal(false);
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Vouchers</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Manage vouchers: add, edit, delete</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          + Add Voucher
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search code or name..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Categories</option>
              <option value="Restaurant">Restaurant</option>
              <option value="Pool">Pool</option>
              <option value="Supermarket">Supermarket</option>
              <option value="Convenience Store">Convenience Store</option>
              <option value="Coffee Shop">Coffee Shop</option>
              <option value="Fest">Fest</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="used">Used</option>
            </select>
          </div>

          {/* Company Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Company
            </label>
            <select
              value={filterCompany}
              onChange={(e) => setFilterCompany(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Companies</option>
              <option value="Coffee House">Coffee House</option>
              <option value="CGV">CGV</option>
              <option value="Maisa">Maisa</option>
              <option value="CONG Coffee">CONG Coffee</option>
              <option value="Market Box">Market Box</option>
              <option value="Vincom">Vincom</option>
              <option value="Becamex Store">Becamex Store</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredVouchers.length)} of {filteredVouchers.length} vouchers
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">CODE</th>
                <th className="px-6 py-4">NAME</th>
                <th className="px-6 py-4">CATEGORY</th>
                <th className="px-6 py-4">COMPANY</th>
                <th className="px-6 py-4">TYPE</th>
                <th className="px-6 py-4">VALUE</th>
                <th className="px-6 py-4">STATUS</th>
                <th className="px-6 py-4">START</th>
                <th className="px-6 py-4">END</th>
                <th className="px-6 py-4">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentVouchers.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">#{v.id}</td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-900 dark:text-white">{v.code}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{v.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{v.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{v.companyName}</td>
                  <td className="px-6 py-4 text-sm capitalize text-gray-700 dark:text-gray-300">{v.type}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {v.type === "percentage" ? `${v.value}%` : v.value.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      v.status === "active"
                        ? "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400"
                        : v.status === "used"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-500/10 dark:text-gray-400"
                    }`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{v.startDate}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{v.endDate}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(v)}
                        className="p-1 text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                        title="Edit"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(v.id)}
                        className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1 text-sm font-medium rounded-lg ${
                            currentPage === page
                              ? "bg-brand-600 text-white"
                              : "text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <span key={page} className="px-2 text-gray-500">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && editing && (
        <div className="fixed inset-0 bg-blackO flex items-center justify-center p-4 z-999999">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {editing.id === 0 ? "Add Voucher" : "Edit Voucher"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editing.code}
                    onChange={(e) => setEditing({ ...editing!, code: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing!, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={editing.category}
                    onChange={(e) => setEditing({ ...editing!, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="Restaurant">Restaurant</option>
                    <option value="Pool">Pool</option>
                    <option value="Supermarket">Supermarket</option>
                    <option value="Convenience Store">Convenience Store</option>
                    <option value="Coffee Shop">Coffee Shop</option>
                    <option value="Fest">Fest</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Company Name
                  </label>
                  <select
                    value={editing.companyName}
                    onChange={(e) => setEditing({ ...editing!, companyName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="Coffee House">Coffee House</option>
                    <option value="CGV">CGV</option>
                    <option value="Maisa">Maisa</option>
                    <option value="CONG Coffee">CONG Coffee</option>
                    <option value="Market Box">Market Box</option>
                    <option value="Vincom">Vincom</option>
                    <option value="Becamex Store">Becamex Store</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type
                  </label>
                  <select
                    value={editing.type}
                    onChange={(e) => setEditing({ ...editing!, type: e.target.value as Voucher["type"] })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Value
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editing.value}
                    onChange={(e) => setEditing({ ...editing!, value: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={editing.status}
                    onChange={(e) => setEditing({ ...editing!, status: e.target.value as Voucher["status"] })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="used">Used</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={editing.startDate}
                    onChange={(e) => setEditing({ ...editing!, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={editing.endDate}
                    onChange={(e) => setEditing({ ...editing!, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                >
                  {editing.id === 0 ? "Create" : "Update"}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
