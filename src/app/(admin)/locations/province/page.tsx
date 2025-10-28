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
  // Thành phố trực thuộc trung ương
  { id: 1, code: "HN", name: "Hà Nội", nameEn: "Hanoi", countryId: 1, countryName: "Việt Nam", districtCount: 30, status: "active", type: "city" },
  { id: 2, code: "HCM", name: "Hồ Chí Minh", nameEn: "Ho Chi Minh City", countryId: 1, countryName: "Việt Nam", districtCount: 24, status: "active", type: "city" },
  { id: 3, code: "DN", name: "Đà Nẵng", nameEn: "Da Nang", countryId: 1, countryName: "Việt Nam", districtCount: 8, status: "active", type: "city" },
  { id: 4, code: "HP", name: "Hải Phòng", nameEn: "Hai Phong", countryId: 1, countryName: "Việt Nam", districtCount: 15, status: "active", type: "city" },
  { id: 5, code: "CT", name: "Cần Thơ", nameEn: "Can Tho", countryId: 1, countryName: "Việt Nam", districtCount: 9, status: "active", type: "city" },
  
  // Miền Bắc
  { id: 6, code: "HG", name: "Hà Giang", nameEn: "Ha Giang", countryId: 1, countryName: "Việt Nam", districtCount: 11, status: "active", type: "province" },
  { id: 7, code: "CB", name: "Cao Bằng", nameEn: "Cao Bang", countryId: 1, countryName: "Việt Nam", districtCount: 12, status: "active", type: "province" },
  { id: 8, code: "BK", name: "Bắc Kạn", nameEn: "Bac Kan", countryId: 1, countryName: "Việt Nam", districtCount: 8, status: "active", type: "province" },
  { id: 9, code: "TQ", name: "Tuyên Quang", nameEn: "Tuyen Quang", countryId: 1, countryName: "Việt Nam", districtCount: 7, status: "active", type: "province" },
  { id: 10, code: "LS", name: "Lào Cai", nameEn: "Lao Cai", countryId: 1, countryName: "Việt Nam", districtCount: 9, status: "active", type: "province" },
  { id: 11, code: "YB", name: "Yên Bái", nameEn: "Yen Bai", countryId: 1, countryName: "Việt Nam", districtCount: 9, status: "active", type: "province" },
  { id: 12, code: "TB", name: "Thái Nguyên", nameEn: "Thai Nguyen", countryId: 1, countryName: "Việt Nam", districtCount: 9, status: "active", type: "province" },
  { id: 13, code: "LnS", name: "Lạng Sơn", nameEn: "Lang Son", countryId: 1, countryName: "Việt Nam", districtCount: 11, status: "active", type: "province" },
  { id: 14, code: "QN", name: "Quảng Ninh", nameEn: "Quang Ninh", countryId: 1, countryName: "Việt Nam", districtCount: 14, status: "active", type: "province" },
  { id: 15, code: "BG", name: "Bắc Giang", nameEn: "Bac Giang", countryId: 1, countryName: "Việt Nam", districtCount: 10, status: "active", type: "province" },
  { id: 16, code: "PTo", name: "Phú Thọ", nameEn: "Phu Tho", countryId: 1, countryName: "Việt Nam", districtCount: 13, status: "active", type: "province" },
  { id: 17, code: "VnP", name: "Vĩnh Phúc", nameEn: "Vinh Phuc", countryId: 1, countryName: "Việt Nam", districtCount: 9, status: "active", type: "province" },
  { id: 18, code: "BnH", name: "Bắc Ninh", nameEn: "Bac Ninh", countryId: 1, countryName: "Việt Nam", districtCount: 8, status: "active", type: "province" },
  { id: 19, code: "HD", name: "Hải Dương", nameEn: "Hai Duong", countryId: 1, countryName: "Việt Nam", districtCount: 12, status: "active", type: "province" },
  { id: 20, code: "HY", name: "Hưng Yên", nameEn: "Hung Yen", countryId: 1, countryName: "Việt Nam", districtCount: 10, status: "active", type: "province" },
  
  // Miền Trung
  { id: 21, code: "TH", name: "Thanh Hóa", nameEn: "Thanh Hoa", countryId: 1, countryName: "Việt Nam", districtCount: 27, status: "active", type: "province" },
  { id: 22, code: "NA", name: "Nghệ An", nameEn: "Nghe An", countryId: 1, countryName: "Việt Nam", districtCount: 21, status: "active", type: "province" },
  { id: 23, code: "HT", name: "Hà Tĩnh", nameEn: "Ha Tinh", countryId: 1, countryName: "Việt Nam", districtCount: 13, status: "active", type: "province" },
  { id: 24, code: "QB", name: "Quảng Bình", nameEn: "Quang Binh", countryId: 1, countryName: "Việt Nam", districtCount: 8, status: "active", type: "province" },
  { id: 25, code: "QT", name: "Quảng Trị", nameEn: "Quang Tri", countryId: 1, countryName: "Việt Nam", districtCount: 10, status: "active", type: "province" },
  { id: 26, code: "TT", name: "Thừa Thiên Huế", nameEn: "Thua Thien Hue", countryId: 1, countryName: "Việt Nam", districtCount: 9, status: "active", type: "province" },
  { id: 27, code: "QNa", name: "Quảng Nam", nameEn: "Quang Nam", countryId: 1, countryName: "Việt Nam", districtCount: 18, status: "active", type: "province" },
  { id: 28, code: "QNg", name: "Quảng Ngãi", nameEn: "Quang Ngai", countryId: 1, countryName: "Việt Nam", districtCount: 14, status: "active", type: "province" },
  { id: 29, code: "BD", name: "Bình Định", nameEn: "Binh Dinh", countryId: 1, countryName: "Việt Nam", districtCount: 11, status: "active", type: "province" },
  { id: 30, code: "PY", name: "Phú Yên", nameEn: "Phu Yen", countryId: 1, countryName: "Việt Nam", districtCount: 9, status: "active", type: "province" },
  { id: 31, code: "KH", name: "Khánh Hòa", nameEn: "Khanh Hoa", countryId: 1, countryName: "Việt Nam", districtCount: 9, status: "active", type: "province" },
  { id: 32, code: "NT", name: "Ninh Thuận", nameEn: "Ninh Thuan", countryId: 1, countryName: "Việt Nam", districtCount: 7, status: "active", type: "province" },
  { id: 33, code: "BT", name: "Bình Thuận", nameEn: "Binh Thuan", countryId: 1, countryName: "Việt Nam", districtCount: 10, status: "active", type: "province" },
  
  // Tây Nguyên
  { id: 34, code: "KT", name: "Kon Tum", nameEn: "Kon Tum", countryId: 1, countryName: "Việt Nam", districtCount: 10, status: "active", type: "province" },
  { id: 35, code: "GL", name: "Gia Lai", nameEn: "Gia Lai", countryId: 1, countryName: "Việt Nam", districtCount: 17, status: "active", type: "province" },
  { id: 36, code: "DL", name: "Đắk Lắk", nameEn: "Dak Lak", countryId: 1, countryName: "Việt Nam", districtCount: 15, status: "active", type: "province" },
  { id: 37, code: "DNg", name: "Đắk Nông", nameEn: "Dak Nong", countryId: 1, countryName: "Việt Nam", districtCount: 8, status: "active", type: "province" },
  { id: 38, code: "LnD", name: "Lâm Đồng", nameEn: "Lam Dong", countryId: 1, countryName: "Việt Nam", districtCount: 12, status: "active", type: "province" },
  
  // Miền Nam
  { id: 39, code: "BP", name: "Bình Phước", nameEn: "Binh Phuoc", countryId: 1, countryName: "Việt Nam", districtCount: 11, status: "active", type: "province" },
  { id: 40, code: "TN", name: "Tây Ninh", nameEn: "Tay Ninh", countryId: 1, countryName: "Việt Nam", districtCount: 9, status: "active", type: "province" },
  { id: 41, code: "BnD", name: "Bình Dương", nameEn: "Binh Duong", countryId: 1, countryName: "Việt Nam", districtCount: 9, status: "active", type: "province" },
  { id: 42, code: "DnN", name: "Đồng Nai", nameEn: "Dong Nai", countryId: 1, countryName: "Việt Nam", districtCount: 11, status: "active", type: "province" },
  { id: 43, code: "BR", name: "Bà Rịa - Vũng Tàu", nameEn: "Ba Ria - Vung Tau", countryId: 1, countryName: "Việt Nam", districtCount: 8, status: "active", type: "province" },
  { id: 44, code: "LA", name: "Long An", nameEn: "Long An", countryId: 1, countryName: "Việt Nam", districtCount: 15, status: "active", type: "province" },
  { id: 45, code: "TG", name: "Tiền Giang", nameEn: "Tien Giang", countryId: 1, countryName: "Việt Nam", districtCount: 11, status: "active", type: "province" },
  { id: 46, code: "BnL", name: "Bến Tre", nameEn: "Ben Tre", countryId: 1, countryName: "Việt Nam", districtCount: 9, status: "active", type: "province" },
  { id: 47, code: "TV", name: "Trà Vinh", nameEn: "Tra Vinh", countryId: 1, countryName: "Việt Nam", districtCount: 9, status: "active", type: "province" },
  { id: 48, code: "VL", name: "Vĩnh Long", nameEn: "Vinh Long", countryId: 1, countryName: "Việt Nam", districtCount: 8, status: "active", type: "province" },
  { id: 49, code: "DT", name: "Đồng Tháp", nameEn: "Dong Thap", countryId: 1, countryName: "Việt Nam", districtCount: 12, status: "active", type: "province" },
  { id: 50, code: "AG", name: "An Giang", nameEn: "An Giang", countryId: 1, countryName: "Việt Nam", districtCount: 11, status: "active", type: "province" },
  { id: 51, code: "KG", name: "Kiên Giang", nameEn: "Kien Giang", countryId: 1, countryName: "Việt Nam", districtCount: 15, status: "active", type: "province" },
  { id: 52, code: "HnG", name: "Hậu Giang", nameEn: "Hau Giang", countryId: 1, countryName: "Việt Nam", districtCount: 8, status: "active", type: "province" },
  { id: 53, code: "ST", name: "Sóc Trăng", nameEn: "Soc Trang", countryId: 1, countryName: "Việt Nam", districtCount: 11, status: "active", type: "province" },
  { id: 54, code: "BL", name: "Bạc Liêu", nameEn: "Bac Lieu", countryId: 1, countryName: "Việt Nam", districtCount: 7, status: "active", type: "province" },
  { id: 55, code: "CM", name: "Cà Mau", nameEn: "Ca Mau", countryId: 1, countryName: "Việt Nam", districtCount: 9, status: "active", type: "province" },
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
              onChange={(e) => setFilterType(e.target.value as any)}
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
