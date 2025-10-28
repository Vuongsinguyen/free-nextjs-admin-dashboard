"use client";

import { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

interface Hamlet {
  id: number;
  code: string;
  name: string;
  nameEn: string;
  wardId: number;
  wardName: string;
  districtName: string;
  provinceName: string;
  population: number;
  status: "active" | "inactive";
}

const mockHamlets: Hamlet[] = [
  // Phúc Xá, Ba Đình, Hà Nội
  { id: 1, code: "HN-BD-PH-01", name: "Ngõ 1 Phúc Xá", nameEn: "Alley 1 Phuc Xa", wardId: 1, wardName: "Phúc Xá", districtName: "Ba Đình", provinceName: "Hà Nội", population: 450, status: "active" },
  { id: 2, code: "HN-BD-PH-02", name: "Ngõ 2 Phúc Xá", nameEn: "Alley 2 Phuc Xa", wardId: 1, wardName: "Phúc Xá", districtName: "Ba Đình", provinceName: "Hà Nội", population: 520, status: "active" },
  { id: 3, code: "HN-BD-PH-03", name: "Ngõ 3 Phúc Xá", nameEn: "Alley 3 Phuc Xa", wardId: 1, wardName: "Phúc Xá", districtName: "Ba Đình", provinceName: "Hà Nội", population: 380, status: "active" },
  
  // Trúc Bạch, Ba Đình, Hà Nội
  { id: 4, code: "HN-BD-TT-01", name: "Đường Trúc Bạch", nameEn: "Truc Bach Street", wardId: 2, wardName: "Trúc Bạch", districtName: "Ba Đình", provinceName: "Hà Nội", population: 600, status: "active" },
  { id: 5, code: "HN-BD-TT-02", name: "Ngõ Hồ Trúc Bạch", nameEn: "Truc Bach Lake Alley", wardId: 2, wardName: "Trúc Bạch", districtName: "Ba Đình", provinceName: "Hà Nội", population: 480, status: "active" },
  
  // Phúc Tân, Hoàn Kiếm, Hà Nội
  { id: 6, code: "HN-HK-PC-01", name: "Ngõ Phố Cổ 1", nameEn: "Old Quarter Alley 1", wardId: 6, wardName: "Phúc Tân", districtName: "Hoàn Kiếm", provinceName: "Hà Nội", population: 550, status: "active" },
  { id: 7, code: "HN-HK-PC-02", name: "Ngõ Phố Cổ 2", nameEn: "Old Quarter Alley 2", wardId: 6, wardName: "Phúc Tân", districtName: "Hoàn Kiếm", provinceName: "Hà Nội", population: 420, status: "active" },
  { id: 8, code: "HN-HK-PC-03", name: "Ngõ Phố Cổ 3", nameEn: "Old Quarter Alley 3", wardId: 6, wardName: "Phúc Tân", districtName: "Hoàn Kiếm", provinceName: "Hà Nội", population: 390, status: "active" },
  
  // Tân Định, Quận 1, HCM
  { id: 9, code: "HCM-Q1-TT-01", name: "Khu phố 1", nameEn: "Quarter 1", wardId: 11, wardName: "Tân Định", districtName: "Quận 1", provinceName: "Hồ Chí Minh", population: 800, status: "active" },
  { id: 10, code: "HCM-Q1-TT-02", name: "Khu phố 2", nameEn: "Quarter 2", wardId: 11, wardName: "Tân Định", districtName: "Quận 1", provinceName: "Hồ Chí Minh", population: 720, status: "active" },
  { id: 11, code: "HCM-Q1-TT-03", name: "Khu phố 3", nameEn: "Quarter 3", wardId: 11, wardName: "Tân Định", districtName: "Quận 1", provinceName: "Hồ Chí Minh", population: 650, status: "active" },
  
  // Đa Kao, Quận 1, HCM
  { id: 12, code: "HCM-Q1-DK-01", name: "Khu phố 1 Đa Kao", nameEn: "Da Kao Quarter 1", wardId: 12, wardName: "Đa Kao", districtName: "Quận 1", provinceName: "Hồ Chí Minh", population: 680, status: "active" },
  { id: 13, code: "HCM-Q1-DK-02", name: "Khu phố 2 Đa Kao", nameEn: "Da Kao Quarter 2", wardId: 12, wardName: "Đa Kao", districtName: "Quận 1", provinceName: "Hồ Chí Minh", population: 590, status: "active" },
  
  // Thanh Bình, Hải Châu, Đà Nẵng
  { id: 14, code: "DN-HC-TT-01", name: "Tổ dân phố 1", nameEn: "Neighborhood Group 1", wardId: 16, wardName: "Thanh Bình", districtName: "Hải Châu", provinceName: "Đà Nẵng", population: 420, status: "active" },
  { id: 15, code: "DN-HC-TT-02", name: "Tổ dân phố 2", nameEn: "Neighborhood Group 2", wardId: 16, wardName: "Thanh Bình", districtName: "Hải Châu", provinceName: "Đà Nẵng", population: 380, status: "active" },
  { id: 16, code: "DN-HC-TT-03", name: "Tổ dân phố 3", nameEn: "Neighborhood Group 3", wardId: 16, wardName: "Thanh Bình", districtName: "Hải Châu", provinceName: "Đà Nẵng", population: 450, status: "active" },
  
  // Thuận Phước, Hải Châu, Đà Nẵng
  { id: 17, code: "DN-HC-TC-01", name: "Tổ dân phố 1 Thuận Phước", nameEn: "Thuan Phuoc Group 1", wardId: 17, wardName: "Thuận Phước", districtName: "Hải Châu", provinceName: "Đà Nẵng", population: 390, status: "active" },
  { id: 18, code: "DN-HC-TC-02", name: "Tổ dân phố 2 Thuận Phước", nameEn: "Thuan Phuoc Group 2", wardId: 17, wardName: "Thuận Phước", districtName: "Hải Châu", provinceName: "Đà Nẵng", population: 410, status: "active" },
];

export default function HamletPage() {
  const [hamlets] = useState<Hamlet[]>(mockHamlets);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterWard, setFilterWard] = useState<string>("all");
  const [filterProvince, setFilterProvince] = useState<string>("all");

  const wards = Array.from(new Set(hamlets.map(h => h.wardName)));
  const provinces = Array.from(new Set(hamlets.map(h => h.provinceName)));

  const filteredHamlets = hamlets.filter(hamlet => {
    const matchesSearch = hamlet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hamlet.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hamlet.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWard = filterWard === "all" || hamlet.wardName === filterWard;
    const matchesProvince = filterProvince === "all" || hamlet.provinceName === filterProvince;
    return matchesSearch && matchesWard && matchesProvince;
  });

  const stats = {
    total: hamlets.length,
    active: hamlets.filter(h => h.status === 'active').length,
    inactive: hamlets.filter(h => h.status === 'inactive').length,
    totalPopulation: hamlets.reduce((sum, h) => sum + h.population, 0)
  };

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Hamlet Management" />

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Hamlets</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Active Hamlets</p>
          <p className="text-2xl font-bold text-brand-600 dark:text-brand-400 mt-1">{stats.active}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Inactive Hamlets</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{stats.inactive}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Population</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{stats.totalPopulation.toLocaleString()}</p>
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
              placeholder="Search hamlet..."
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
              value={filterWard}
              onChange={(e) => setFilterWard(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Wards</option>
              {wards.map(ward => (
                <option key={ward} value={ward}>{ward}</option>
              ))}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Hamlet Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">English Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ward</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">District</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Province</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Population</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredHamlets.map((hamlet) => (
                <tr key={hamlet.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {hamlet.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {hamlet.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {hamlet.nameEn}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {hamlet.wardName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {hamlet.districtName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {hamlet.provinceName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {hamlet.population.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      hamlet.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                        : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                    }`}>
                      {hamlet.status}
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
        Showing {filteredHamlets.length} of {hamlets.length} hamlets
      </div>
    </div>
  );
}
