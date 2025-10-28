"use client";

import { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

interface District {
  id: number;
  code: string;
  name: string;
  nameEn: string;
  provinceId: number;
  provinceName: string;
  wardCount: number;
  status: "active" | "inactive";
  type: "urban" | "rural" | "town";
}

const mockDistricts: District[] = [
  // Hà Nội
  { id: 1, code: "HN-BD", name: "Ba Đình", nameEn: "Ba Dinh", provinceId: 1, provinceName: "Hà Nội", wardCount: 14, status: "active", type: "urban" },
  { id: 2, code: "HN-HK", name: "Hoàn Kiếm", nameEn: "Hoan Kiem", provinceId: 1, provinceName: "Hà Nội", wardCount: 18, status: "active", type: "urban" },
  { id: 3, code: "HN-TT", name: "Tây Hồ", nameEn: "Tay Ho", provinceId: 1, provinceName: "Hà Nội", wardCount: 8, status: "active", type: "urban" },
  { id: 4, code: "HN-LB", name: "Long Biên", nameEn: "Long Bien", provinceId: 1, provinceName: "Hà Nội", wardCount: 14, status: "active", type: "urban" },
  { id: 5, code: "HN-CG", name: "Cầu Giấy", nameEn: "Cau Giay", provinceId: 1, provinceName: "Hà Nội", wardCount: 8, status: "active", type: "urban" },
  { id: 6, code: "HN-DD", name: "Đống Đa", nameEn: "Dong Da", provinceId: 1, provinceName: "Hà Nội", wardCount: 21, status: "active", type: "urban" },
  { id: 7, code: "HN-HBT", name: "Hai Bà Trưng", nameEn: "Hai Ba Trung", provinceId: 1, provinceName: "Hà Nội", wardCount: 18, status: "active", type: "urban" },
  { id: 8, code: "HN-HM", name: "Hoàng Mai", nameEn: "Hoang Mai", provinceId: 1, provinceName: "Hà Nội", wardCount: 14, status: "active", type: "urban" },
  { id: 9, code: "HN-TK", name: "Thanh Xuân", nameEn: "Thanh Xuan", provinceId: 1, provinceName: "Hà Nội", wardCount: 11, status: "active", type: "urban" },
  { id: 10, code: "HN-SC", name: "Sóc Sơn", nameEn: "Soc Son", provinceId: 1, provinceName: "Hà Nội", wardCount: 25, status: "active", type: "rural" },
  
  // TP. Hồ Chí Minh
  { id: 11, code: "HCM-Q1", name: "Quận 1", nameEn: "District 1", provinceId: 2, provinceName: "Hồ Chí Minh", wardCount: 10, status: "active", type: "urban" },
  { id: 12, code: "HCM-Q3", name: "Quận 3", nameEn: "District 3", provinceId: 2, provinceName: "Hồ Chí Minh", wardCount: 14, status: "active", type: "urban" },
  { id: 13, code: "HCM-Q4", name: "Quận 4", nameEn: "District 4", provinceId: 2, provinceName: "Hồ Chí Minh", wardCount: 15, status: "active", type: "urban" },
  { id: 14, code: "HCM-Q5", name: "Quận 5", nameEn: "District 5", provinceId: 2, provinceName: "Hồ Chí Minh", wardCount: 15, status: "active", type: "urban" },
  { id: 15, code: "HCM-Q6", name: "Quận 6", nameEn: "District 6", provinceId: 2, provinceName: "Hồ Chí Minh", wardCount: 14, status: "active", type: "urban" },
  { id: 16, code: "HCM-Q7", name: "Quận 7", nameEn: "District 7", provinceId: 2, provinceName: "Hồ Chí Minh", wardCount: 10, status: "active", type: "urban" },
  { id: 17, code: "HCM-Q10", name: "Quận 10", nameEn: "District 10", provinceId: 2, provinceName: "Hồ Chí Minh", wardCount: 15, status: "active", type: "urban" },
  { id: 18, code: "HCM-Q11", name: "Quận 11", nameEn: "District 11", provinceId: 2, provinceName: "Hồ Chí Minh", wardCount: 16, status: "active", type: "urban" },
  { id: 19, code: "HCM-TB", name: "Tân Bình", nameEn: "Tan Binh", provinceId: 2, provinceName: "Hồ Chí Minh", wardCount: 15, status: "active", type: "urban" },
  { id: 20, code: "HCM-TP", name: "Tân Phú", nameEn: "Tan Phu", provinceId: 2, provinceName: "Hồ Chí Minh", wardCount: 11, status: "active", type: "urban" },
  
  // Đà Nẵng
  { id: 21, code: "DN-HC", name: "Hải Châu", nameEn: "Hai Chau", provinceId: 3, provinceName: "Đà Nẵng", wardCount: 13, status: "active", type: "urban" },
  { id: 22, code: "DN-TK", name: "Thanh Khê", nameEn: "Thanh Khe", provinceId: 3, provinceName: "Đà Nẵng", wardCount: 10, status: "active", type: "urban" },
  { id: 23, code: "DN-SH", name: "Sơn Trà", nameEn: "Son Tra", provinceId: 3, provinceName: "Đà Nẵng", wardCount: 7, status: "active", type: "urban" },
  { id: 24, code: "DN-NHT", name: "Ngũ Hành Sơn", nameEn: "Ngu Hanh Son", provinceId: 3, provinceName: "Đà Nẵng", wardCount: 4, status: "active", type: "urban" },
  { id: 25, code: "DN-LC", name: "Liên Chiểu", nameEn: "Lien Chieu", provinceId: 3, provinceName: "Đà Nẵng", wardCount: 5, status: "active", type: "urban" },
];

export default function DistrictPage() {
  const [districts] = useState<District[]>(mockDistricts);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProvince, setFilterProvince] = useState<string>("all");
  const [filterType, setFilterType] = useState<"all" | "urban" | "rural" | "town">("all");

  const provinces = Array.from(new Set(districts.map(d => d.provinceName)));

  const filteredDistricts = districts.filter(district => {
    const matchesSearch = district.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      district.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      district.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProvince = filterProvince === "all" || district.provinceName === filterProvince;
    const matchesType = filterType === "all" || district.type === filterType;
    return matchesSearch && matchesProvince && matchesType;
  });

  const stats = {
    total: districts.length,
    urban: districts.filter(d => d.type === 'urban').length,
    rural: districts.filter(d => d.type === 'rural').length,
    totalWards: districts.reduce((sum, d) => sum + d.wardCount, 0)
  };

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="District Management" />

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Districts</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Urban Districts</p>
          <p className="text-2xl font-bold text-brand-600 dark:text-brand-400 mt-1">{stats.urban}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Rural Districts</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{stats.rural}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Wards</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{stats.totalWards}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search district..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <select
              value={filterProvince}
              onChange={(e) => setFilterProvince(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Provinces</option>
              {provinces.map(province => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as "urban" | "rural" | "town" | "all")}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="urban">Urban</option>
              <option value="rural">Rural</option>
              <option value="town">Town</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">District Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">English Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Province</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Wards</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredDistricts.map((district) => (
                <tr key={district.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {district.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {district.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {district.nameEn}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {district.provinceName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      district.type === 'urban'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                        : district.type === 'rural'
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                        : 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100'
                    }`}>
                      {district.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {district.wardCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      district.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                        : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                    }`}>
                      {district.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300 mr-3">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredDistricts.length} of {districts.length} districts
      </div>
    </div>
  );
}
