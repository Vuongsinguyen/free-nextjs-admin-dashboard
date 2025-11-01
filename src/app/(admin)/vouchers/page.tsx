"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { getProvincesFromCSV } from "@/lib/provinces";

interface Province {
  id: number;
  code: string;
  name: string;
  nameEn: string;
  type: string;
}

interface Voucher {
  id: string; // Changed to string for UUID
  code: string;
  name: string;
  type: "percentage" | "fixed";
  value: number;
  category: string;
  companyName: string;
  province: string;
  district: string;
  googleMapLink?: string;
  status: "active" | "inactive";
  quantity: {
    used: number;
    total: number;
  };
  startDate: string;
  endDate: string;
  image?: string;
}

interface ResidentUsage {
  id: string;
  residentName: string;
  residentId: string;
  apartment: string;
  usedDate: string;
  usedTime: string;
  amount: number;
}

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [filteredVouchers, setFilteredVouchers] = useState<Voucher[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showResidentsModal, setShowResidentsModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState<Voucher | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCompany, setFilterCompany] = useState("");
  const [filterProvince, setFilterProvince] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [seeding, setSeeding] = useState(false);

  // Fetch vouchers from Supabase
  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vouchers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching vouchers:", error);
        return;
      }

      // Map snake_case DB fields to camelCase TypeScript
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mappedVouchers: Voucher[] = (data || []).map((v: any) => ({
        id: v.id,
        code: v.code,
        name: v.name,
        type: v.type,
        value: v.value,
        category: v.category,
        companyName: v.company_name,
        province: v.province,
        district: v.district,
        googleMapLink: v.google_map_link,
        status: v.status,
        quantity: {
          used: v.quantity_used || 0,
          total: v.quantity_total || 0,
        },
        startDate: v.start_date,
        endDate: v.end_date,
        image: v.image,
      }));

      setVouchers(mappedVouchers);
    } catch (err) {
      console.error("Error fetching vouchers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  // Handle seed vouchers
  const handleSeedVouchers = async () => {
    if (!confirm("Seed 30 vouchers vào database? (Sẽ skip nếu code đã tồn tại)")) {
      return;
    }

    try {
      setSeeding(true);
      const response = await fetch('/api/vouchers/seed', {
        method: 'POST',
      });

      const result = await response.json();

      if (response.ok) {
        alert(`✅ Successfully seeded ${result.count} vouchers!`);
        // Reload vouchers
        await fetchVouchers();
      } else {
        alert(`❌ Error: ${result.error || 'Failed to seed vouchers'}`);
      }
    } catch (error) {
      console.error("Error seeding vouchers:", error);
      alert("❌ Error seeding vouchers. Check console for details.");
    } finally {
      setSeeding(false);
    }
  };

  // Load provinces data on component mount
  useEffect(() => {
    const loadedProvinces = getProvincesFromCSV();
    setProvinces(loadedProvinces);
  }, []);

  const handleAdd = () => {
    setEditing({
      id: "",
      code: "",
      name: "",
      type: "percentage",
      value: 0,
      category: "Restaurant",
      companyName: "Coffee House",
      province: "Bình Dương",
      district: "Thủ Dầu Một",
      googleMapLink: "",
      status: "active",
      quantity: { used: 0, total: 100 },
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date().toISOString().slice(0, 10),
      image: "",
    });
    setSelectedFile(null);
    setShowModal(true);
  };

  const handleViewResidents = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setShowResidentsModal(true);
  };

  // Generate mock resident usage data for the selected voucher
  const getResidentUsageData = (voucher: Voucher | null): ResidentUsage[] => {
    if (!voucher) return [];
    
    const mockResidents: ResidentUsage[] = [];
    const usedCount = voucher.quantity.used;
    
    for (let i = 1; i <= Math.min(usedCount, 20); i++) {
      mockResidents.push({
        id: `RU${i}`,
        residentName: `Cư dân ${i}`,
        residentId: `R${String(i).padStart(4, '0')}`,
        apartment: `A${Math.floor(Math.random() * 20) + 1}-${String(Math.floor(Math.random() * 10) + 1).padStart(2, '0')}`,
        usedDate: new Date(2025, Math.floor(Math.random() * 10), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
        usedTime: `${String(Math.floor(Math.random() * 12) + 8).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        amount: voucher.type === 'percentage' 
          ? Math.floor(Math.random() * 500000) 
          : voucher.value,
      });
    }
    
    return mockResidents.sort((a, b) => b.usedDate.localeCompare(a.usedDate));
  };

  const handleEdit = (v: Voucher) => {
    setEditing(JSON.parse(JSON.stringify(v)) as Voucher);
    setSelectedFile(null); // Reset file selection when editing
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
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

    // Province filter
    if (filterProvince) {
      result = result.filter(v => v.province === filterProvince);
    }

    setFilteredVouchers(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [vouchers, searchTerm, filterCategory, filterStatus, filterCompany, filterProvince]);

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

    // Handle file upload if a file is selected
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        const voucherWithImage = { ...editing, image: imageUrl };

        if (!editing.id) {
          const newVoucher: Voucher = {
            ...voucherWithImage,
            id: crypto.randomUUID(),
          };
          setVouchers(prev => [...prev, newVoucher]);
        } else {
          setVouchers(prev => prev.map(v => (v.id === editing.id ? voucherWithImage : v)));
        }

        setShowModal(false);
        setEditing(null);
        setSelectedFile(null);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      // No file selected, proceed with existing logic
      if (!editing.id) {
        const newVoucher: Voucher = {
          ...editing,
          id: crypto.randomUUID(),
        };
        setVouchers(prev => [...prev, newVoucher]);
      } else {
        setVouchers(prev => prev.map(v => (v.id === editing.id ? editing : v)));
      }

      setShowModal(false);
      setEditing(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Vouchers</h1>
          {/* Description removed as requested */}
        </div>
        <div className="flex gap-3">
          {vouchers.length === 0 && !loading && (
            <button
              onClick={handleSeedVouchers}
              disabled={seeding}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
            >
              {seeding ? "Seeding..." : "🌱 Seed 30 Vouchers"}
            </button>
          )}
          <button
            onClick={handleAdd}
            className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            + Add Voucher
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-600 dark:text-gray-400">Loading vouchers...</div>
        </div>
      ) : (
        <>
          {/* Search & Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
            </select>
          </div>

          {/* Shop Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Shop
            </label>
            <select
              value={filterCompany}
              onChange={(e) => setFilterCompany(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Shops</option>
              <option value="Coffee House">Coffee House</option>
              <option value="CGV">CGV</option>
              <option value="Maisa">Maisa</option>
              <option value="CONG Coffee">CONG Coffee</option>
              <option value="Market Box">Market Box</option>
              <option value="Vincom">Vincom</option>
              <option value="Becamex Store">Becamex Store</option>
            </select>
          </div>

          {/* Province Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Province
            </label>
            <select
              value={filterProvince}
              onChange={(e) => setFilterProvince(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Provinces</option>
              {provinces.map((province) => (
                <option key={province.id} value={province.name}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">IMAGE</th>
                <th className="px-6 py-4">CODE</th>
                <th className="px-6 py-4">NAME</th>
                <th className="px-6 py-4">CATEGORY</th>
                <th className="px-6 py-4">SHOP</th>
                <th className="px-6 py-4">GOOGLE MAP</th>
                <th className="px-6 py-4">TYPE</th>
                <th className="px-6 py-4">VALUE</th>
                <th className="px-6 py-4">QUANTITY</th>
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
                  <td className="px-6 py-4">
                    {v.image ? (
                      <Image
                        src={v.image}
                        alt={v.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-900 dark:text-white">{v.code}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{v.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{v.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{v.companyName}</td>
                  <td className="px-6 py-4 text-sm">
                    {v.googleMapLink ? (
                      <a
                        href={v.googleMapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        View Map
                      </a>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-600">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm capitalize text-gray-700 dark:text-gray-300">{v.type}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {v.type === "percentage" ? `${v.value}%` : v.value.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${
                        v.quantity.used >= v.quantity.total
                          ? "text-red-600 dark:text-red-400"
                          : v.quantity.used >= v.quantity.total * 0.8
                          ? "text-orange-600 dark:text-orange-400"
                          : "text-gray-900 dark:text-white"
                      }`}>
                        {v.quantity.used}/{v.quantity.total}
                      </span>
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            v.quantity.used >= v.quantity.total
                              ? "bg-red-600"
                              : v.quantity.used >= v.quantity.total * 0.8
                              ? "bg-orange-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${Math.min((v.quantity.used / v.quantity.total) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      v.status === "active"
                        ? "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400"
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
                        onClick={() => handleViewResidents(v)}
                        className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        title="View residents using this voucher"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
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
                  {!editing.id ? "Add Voucher" : "Edit Voucher"}
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
                    Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedFile(file);
                        // For now, we'll store the file name as a placeholder
                        // In a real app, you'd upload the file and get back a URL
                        setEditing({ ...editing!, image: file.name });
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
                  />
                  {selectedFile && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Selected: {selectedFile.name}
                    </p>
                  )}
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
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Google Map Link
                  </label>
                  <input
                    type="url"
                    value={editing.googleMapLink || ""}
                    onChange={(e) => setEditing({ ...editing!, googleMapLink: e.target.value })}
                    placeholder="https://maps.google.com/?q=..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
                  />
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
                    Quantity Used
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editing.quantity.used}
                    onChange={(e) => setEditing({ ...editing!, quantity: { ...editing!.quantity, used: Number(e.target.value) } })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Total Quantity
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editing.quantity.total}
                    onChange={(e) => setEditing({ ...editing!, quantity: { ...editing!.quantity, total: Number(e.target.value) } })}
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
                  {!editing.id ? "Create" : "Update"}
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

      {/* Residents Using Voucher Modal */}
      {showResidentsModal && selectedVoucher && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-999999">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Residents Using Voucher
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {selectedVoucher.name} ({selectedVoucher.code}) - {selectedVoucher.quantity.used} total uses
                  </p>
                </div>
                <button
                  onClick={() => setShowResidentsModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Residents Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Resident Name</th>
                      <th className="px-4 py-3">Apartment</th>
                      <th className="px-4 py-3">Used Date</th>
                      <th className="px-4 py-3">Used Time</th>
                      <th className="px-4 py-3">Amount Saved</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {getResidentUsageData(selectedVoucher).map((resident) => (
                      <tr key={resident.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                          {resident.residentId}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                          {resident.residentName}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                          {resident.apartment}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                          {new Date(resident.usedDate).toLocaleDateString("vi-VN")}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                          {resident.usedTime}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-green-600 dark:text-green-400">
                          {selectedVoucher.type === 'percentage' 
                            ? `${selectedVoucher.value}% (${resident.amount.toLocaleString()} VNĐ)`
                            : `${resident.amount.toLocaleString()} VNĐ`
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Uses</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                      {selectedVoucher.quantity.used}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Remaining</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                      {selectedVoucher.quantity.total - selectedVoucher.quantity.used}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Usage Rate</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                      {Math.round((selectedVoucher.quantity.used / selectedVoucher.quantity.total) * 100)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowResidentsModal(false)}
                  className="w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}
