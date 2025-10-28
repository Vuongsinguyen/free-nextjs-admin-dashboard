"use client";

import { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

interface Ward {
  id: number;
  code: string;
  name: string;
  nameEn: string;
  districtId: number;
  districtName: string;
  provinceName: string;
  hamletCount: number;
  status: "active" | "inactive";
  type: "ward" | "commune" | "town";
}

const mockWards: Ward[] = [
  // Ba Đình, Hà Nội
  { id: 1, code: "HN-BD-PH", name: "Phúc Xá", nameEn: "Phuc Xa", districtId: 1, districtName: "Ba Đình", provinceName: "Hà Nội", hamletCount: 8, status: "active", type: "ward" },
  { id: 2, code: "HN-BD-TT", name: "Trúc Bạch", nameEn: "Truc Bach", districtId: 1, districtName: "Ba Đình", provinceName: "Hà Nội", hamletCount: 6, status: "active", type: "ward" },
  { id: 3, code: "HN-BD-VT", name: "Vĩnh Phúc", nameEn: "Vinh Phuc", districtId: 1, districtName: "Ba Đình", provinceName: "Hà Nội", hamletCount: 7, status: "active", type: "ward" },
  { id: 4, code: "HN-BD-CV", name: "Cống Vị", nameEn: "Cong Vi", districtId: 1, districtName: "Ba Đình", provinceName: "Hà Nội", hamletCount: 9, status: "active", type: "ward" },
  { id: 5, code: "HN-BD-LC", name: "Liễu Giai", nameEn: "Lieu Giai", districtId: 1, districtName: "Ba Đình", provinceName: "Hà Nội", hamletCount: 5, status: "active", type: "ward" },
  
  // Hoàn Kiếm, Hà Nội
  { id: 6, code: "HN-HK-PC", name: "Phúc Tân", nameEn: "Phuc Tan", districtId: 2, districtName: "Hoàn Kiếm", provinceName: "Hà Nội", hamletCount: 10, status: "active", type: "ward" },
  { id: 7, code: "HN-HK-DH", name: "Đồng Xuân", nameEn: "Dong Xuan", districtId: 2, districtName: "Hoàn Kiếm", provinceName: "Hà Nội", hamletCount: 8, status: "active", type: "ward" },
  { id: 8, code: "HN-HK-HG", name: "Hàng Gai", nameEn: "Hang Gai", districtId: 2, districtName: "Hoàn Kiếm", provinceName: "Hà Nội", hamletCount: 6, status: "active", type: "ward" },
  { id: 9, code: "HN-HK-HB", name: "Hàng Bồ", nameEn: "Hang Bo", districtId: 2, districtName: "Hoàn Kiếm", provinceName: "Hà Nội", hamletCount: 7, status: "active", type: "ward" },
  { id: 10, code: "HN-HK-CQ", name: "Cửa Đông", nameEn: "Cua Dong", districtId: 2, districtName: "Hoàn Kiếm", provinceName: "Hà Nội", hamletCount: 9, status: "active", type: "ward" },
  
  // Quận 1, TP.HCM
  { id: 11, code: "HCM-Q1-TT", name: "Tân Định", nameEn: "Tan Dinh", districtId: 11, districtName: "Quận 1", provinceName: "Hồ Chí Minh", hamletCount: 12, status: "active", type: "ward" },
  { id: 12, code: "HCM-Q1-DK", name: "Đa Kao", nameEn: "Da Kao", districtId: 11, districtName: "Quận 1", provinceName: "Hồ Chí Minh", hamletCount: 10, status: "active", type: "ward" },
  { id: 13, code: "HCM-Q1-BN", name: "Bến Nghé", nameEn: "Ben Nghe", districtId: 11, districtName: "Quận 1", provinceName: "Hồ Chí Minh", hamletCount: 11, status: "active", type: "ward" },
  { id: 14, code: "HCM-Q1-BT", name: "Bến Thành", nameEn: "Ben Thanh", districtId: 11, districtName: "Quận 1", provinceName: "Hồ Chí Minh", hamletCount: 13, status: "active", type: "ward" },
  { id: 15, code: "HCM-Q1-NB", name: "Nguyễn Thái Bình", nameEn: "Nguyen Thai Binh", districtId: 11, districtName: "Quận 1", provinceName: "Hồ Chí Minh", hamletCount: 9, status: "active", type: "ward" },
  
  // Hải Châu, Đà Nẵng
  { id: 16, code: "DN-HC-TT", name: "Thanh Bình", nameEn: "Thanh Binh", districtId: 21, districtName: "Hải Châu", provinceName: "Đà Nẵng", hamletCount: 8, status: "active", type: "ward" },
  { id: 17, code: "DN-HC-TC", name: "Thuận Phước", nameEn: "Thuan Phuoc", districtId: 21, districtName: "Hải Châu", provinceName: "Đà Nẵng", hamletCount: 7, status: "active", type: "ward" },
  { id: 18, code: "DN-HC-TC2", name: "Thạch Thang", nameEn: "Thach Thang", districtId: 21, districtName: "Hải Châu", provinceName: "Đà Nẵng", hamletCount: 9, status: "active", type: "ward" },
  { id: 19, code: "DN-HC-HT", name: "Hải Châu 1", nameEn: "Hai Chau 1", districtId: 21, districtName: "Hải Châu", provinceName: "Đà Nẵng", hamletCount: 6, status: "active", type: "ward" },
  { id: 20, code: "DN-HC-HT2", name: "Hải Châu 2", nameEn: "Hai Chau 2", districtId: 21, districtName: "Hải Châu", provinceName: "Đà Nẵng", hamletCount: 8, status: "active", type: "ward" },
];

export default function WardPage() {
  const [wards] = useState<Ward[]>(mockWards);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDistrict, setFilterDistrict] = useState<string>("all");
  const [filterType, setFilterType] = useState<"all" | "ward" | "commune" | "town">("all");

  const districts = Array.from(new Set(wards.map(w => w.districtName)));

  const filteredWards = wards.filter(ward => {
    const matchesSearch = ward.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ward.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ward.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict = filterDistrict === "all" || ward.districtName === filterDistrict;
    const matchesType = filterType === "all" || ward.type === filterType;
    return matchesSearch && matchesDistrict && matchesType;
  });

  const stats = {
    total: wards.length,
    ward: wards.filter(w => w.type === 'ward').length,
    commune: wards.filter(w => w.type === 'commune').length,
    totalHamlets: wards.reduce((sum, w) => sum + w.hamletCount, 0)
  };

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Ward Management" />

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Wards</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Urban Wards</p>
          <p className="text-2xl font-bold text-brand-600 dark:text-brand-400 mt-1">{stats.ward}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Communes</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{stats.commune}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Hamlets</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{stats.totalHamlets}</p>
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
              placeholder="Search ward..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <select
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Districts</option>
              {districts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as "ward" | "commune" | "town" | "all")}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="ward">Ward</option>
              <option value="commune">Commune</option>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ward Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">English Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">District</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Province</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Hamlets</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredWards.map((ward) => (
                <tr key={ward.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {ward.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {ward.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {ward.nameEn}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {ward.districtName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {ward.provinceName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      ward.type === 'ward'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                        : ward.type === 'commune'
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                        : 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100'
                    }`}>
                      {ward.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {ward.hamletCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      ward.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                        : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                    }`}>
                      {ward.status}
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
        Showing {filteredWards.length} of {wards.length} wards
      </div>
    </div>
  );
}
