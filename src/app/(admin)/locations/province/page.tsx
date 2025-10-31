"use client";

import { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

interface Province {
  id: number;
  code: string;
  name: string;
  nameEn: string;
  countryId: number;
  countryName: string;
  districtCount: number;
  status: "active" | "inactive";
  type: "city" | "province";
}

const mockProvinces: Province[] = [
  // Thành phố trực thuộc trung ương (5 cities)
  { id: 1, code: "11", name: "Hà Nội", nameEn: "Ha Noi", countryId: 1, countryName: "Việt Nam", districtCount: 120, status: "active", type: "city" },
  { id: 2, code: "12", name: "Hồ Chí Minh", nameEn: "Ho Chi Minh", countryId: 1, countryName: "Việt Nam", districtCount: 165, status: "active", type: "city" },
  { id: 3, code: "13", name: "Đà Nẵng", nameEn: "Da Nang", countryId: 1, countryName: "Việt Nam", districtCount: 86, status: "active", type: "city" },
  { id: 4, code: "14", name: "Hải Phòng", nameEn: "Hai Phong", countryId: 1, countryName: "Việt Nam", districtCount: 90, status: "active", type: "city" },
  { id: 5, code: "15", name: "Cần Thơ", nameEn: "Can Tho", countryId: 1, countryName: "Việt Nam", districtCount: 78, status: "active", type: "city" },
  { id: 6, code: "16", name: "Huế", nameEn: "Hue", countryId: 1, countryName: "Việt Nam", districtCount: 23, status: "active", type: "city" },
  
  // Các tỉnh (29 provinces)
  { id: 7, code: "17", name: "An Giang", nameEn: "An Giang", countryId: 1, countryName: "Việt Nam", districtCount: 88, status: "active", type: "province" },
  { id: 8, code: "18", name: "Bắc Ninh", nameEn: "Bac Ninh", countryId: 1, countryName: "Việt Nam", districtCount: 5, status: "active", type: "province" },
  { id: 9, code: "19", name: "Cà Mau", nameEn: "Ca Mau", countryId: 1, countryName: "Việt Nam", districtCount: 0, status: "active", type: "province" },
  { id: 10, code: "20", name: "Cao Bằng", nameEn: "Cao Bang", countryId: 1, countryName: "Việt Nam", districtCount: 0, status: "active", type: "province" },
  { id: 11, code: "21", name: "Đắk Lắk", nameEn: "Dak Lak", countryId: 1, countryName: "Việt Nam", districtCount: 0, status: "active", type: "province" },
  { id: 12, code: "22", name: "Điện Biên", nameEn: "Dien Bien", countryId: 1, countryName: "Việt Nam", districtCount: 0, status: "active", type: "province" },
  { id: 13, code: "23", name: "Đồng Nai", nameEn: "Dong Nai", countryId: 1, countryName: "Việt Nam", districtCount: 0, status: "active", type: "province" },
  { id: 14, code: "24", name: "Đồng Tháp", nameEn: "Dong Thap", countryId: 1, countryName: "Việt Nam", districtCount: 0, status: "active", type: "province" },
  { id: 15, code: "25", name: "Gia Lai", nameEn: "Gia Lai", countryId: 1, countryName: "Việt Nam", districtCount: 0, status: "active", type: "province" },
  { id: 16, code: "26", name: "Hà Tĩnh", nameEn: "Ha Tinh", countryId: 1, countryName: "Việt Nam", districtCount: 0, status: "active", type: "province" },
  { id: 17, code: "27", name: "Hưng Yên", nameEn: "Hung Yen", countryId: 1, countryName: "Việt Nam", districtCount: 0, status: "active", type: "province" },
  { id: 18, code: "28", name: "Khánh Hòa", nameEn: "Khanh Hoa", countryId: 1, countryName: "Việt Nam", districtCount: 0, status: "active", type: "province" },
  { id: 19, code: "29", name: "Lai Châu", nameEn: "Lai Chau", countryId: 1, countryName: "Việt Nam", districtCount: 0, status: "active", type: "province" },
  { id: 20, code: "30", name: "Lâm Đồng", nameEn: "Lam Dong", countryId: 1, countryName: "Việt Nam", districtCount: 0, status: "active", type: "province" },
  { id: 21, code: "31", name: "Lạng Sơn", nameEn: "Lang Son", countryId: 1, countryName: "Việt Nam", districtCount: 0, status: "active", type: "province" },
  { id: 22, code: "32", name: "Lào Cai", nameEn: "Lao Cai", countryId: 1, countryName: "Việt Nam", districtCount: 0, status: "active", type: "province" },
  { id: 23, code: "33", name: "Nghệ An", nameEn: "Nghe An", countryId: 1, countryName: "Việt Nam", districtCount: 0, status: "active", type: "province" },
  { id: 24, code: "34", name: "Ninh Bình", nameEn: "Ninh Binh", countryId: 1, countryName: "Việt Nam", districtCount: 0, status: "active", type: "province" },
  { id: 25, code: "35", name: "Phú Thọ", nameEn: "Phu Tho", countryId: 1, countryName: "Việt Nam", districtCount: 0, status: "active", type: "province" },
  { id: 26, code: "36", name: "Quảng Ngãi", nameEn: "Quang Ngai", countryId: 1, countryName: "Việt Nam", districtCount: 0, status: "active", type: "province" },
  { id: 27, code: "37", name: "Quảng Ninh", nameEn: "Quang Ninh", countryId: 1, countryName: "Việt Nam", districtCount: 0, status: "active", type: "province" },
  { id: 28, code: "38", name: "Quảng Trị", nameEn: "Quang Tri", countryId: 1, countryName: "Việt Nam", districtCount: 0, status: "active", type: "province" },
  { id: 29, code: "39", name: "Sơn La", nameEn: "Son La", countryId: 1, countryName: "Việt Nam", districtCount: 0, status: "active", type: "province" },
  { id: 30, code: "40", name: "Tây Ninh", nameEn: "Tay Ninh", countryId: 1, countryName: "Việt Nam", districtCount: 0, status: "active", type: "province" },
  { id: 31, code: "41", name: "Thái Nguyên", nameEn: "Thai Nguyen", countryId: 1, countryName: "Việt Nam", districtCount: 0, status: "active", type: "province" },
  { id: 32, code: "42", name: "Thanh Hóa", nameEn: "Thanh Hoa", countryId: 1, countryName: "Việt Nam", districtCount: 0, status: "active", type: "province" },
  { id: 33, code: "43", name: "Tuyên Quang", nameEn: "Tuyen Quang", countryId: 1, countryName: "Việt Nam", districtCount: 0, status: "active", type: "province" },
  { id: 34, code: "44", name: "Vĩnh Long", nameEn: "Vinh Long", countryId: 1, countryName: "Việt Nam", districtCount: 0, status: "active", type: "province" },
];

export default function ProvincePage() {
  const [provinces] = useState<Province[]>(mockProvinces);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "city" | "province">("all");

  const filteredProvinces = provinces.filter(province => {
    const matchesSearch = province.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      province.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      province.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || province.type === filterType;
    return matchesSearch && matchesType;
  });

  const stats = {
    total: provinces.length,
    cities: provinces.filter(p => p.type === 'city').length,
    provinceCount: provinces.filter(p => p.type === 'province').length,
    totalDistricts: provinces.reduce((sum, p) => sum + p.districtCount, 0)
  };

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Province Management" />

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Provinces/Cities</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Cities</p>
          <p className="text-2xl font-bold text-brand-600 dark:text-brand-400 mt-1">{stats.cities}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Provinces</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{stats.provinceCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Districts</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{stats.totalDistricts}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search province..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as "city" | "province" | "all")}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="city">Cities</option>
              <option value="province">Provinces</option>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Province Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">English Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Districts</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProvinces.map((province) => (
                <tr key={province.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {province.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {province.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {province.nameEn}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      province.type === 'city'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                        : 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100'
                    }`}>
                      {province.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {province.districtCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      province.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                        : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                    }`}>
                      {province.status}
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
        Showing {filteredProvinces.length} of {provinces.length} provinces/cities
      </div>
    </div>
  );
}
