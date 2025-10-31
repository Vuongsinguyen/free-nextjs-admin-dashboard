"use client";

import { useState, useEffect } from "react";

interface Shop {
  id: number;
  name: string;
  category: string;
  province: string;
  district: string;
  address: string;
  googleMapLink: string;
  status: "active" | "inactive";
  createdAt: string;
}

// Mock data for shops
const generateMockShops = (): Shop[] => {
  return [
    { id: 1, name: "Coffee House - Thủ Dầu Một", category: "Coffee Shop", province: "Bình Dương", district: "Thủ Dầu Một", address: "123 Yersin, P. Phú Cường", googleMapLink: "https://maps.google.com/?q=Coffee+House+Thu+Dau+Mot", status: "active", createdAt: "2025-01-10" },
    { id: 2, name: "Market Box - Quận 1", category: "Supermarket", province: "Hồ Chí Minh", district: "Quận 1", address: "456 Nguyễn Huệ, P. Bến Nghé", googleMapLink: "https://maps.google.com/?q=Market+Box+Q1", status: "active", createdAt: "2025-01-15" },
    { id: 3, name: "Maisa Restaurant - Dĩ An", category: "Restaurant", province: "Bình Dương", district: "Dĩ An", address: "789 Đại lộ Bình Dương, P. Dĩ An", googleMapLink: "https://maps.google.com/?q=Maisa+Di+An", status: "active", createdAt: "2025-01-20" },
    { id: 4, name: "Vincom Pool - Quận 2", category: "Pool", province: "Hồ Chí Minh", district: "Quận 2", address: "Vincom Mega Mall Thảo Điền", googleMapLink: "https://maps.google.com/?q=Vincom+Q2", status: "active", createdAt: "2025-02-01" },
    { id: 5, name: "CGV Cinema - Thủ Dầu Một", category: "Fest", province: "Bình Dương", district: "Thủ Dầu Một", address: "AEON Mall Bình Dương Canary", googleMapLink: "https://maps.google.com/?q=CGV+TDM", status: "active", createdAt: "2025-02-05" },
    { id: 6, name: "CONG Coffee - Quận 3", category: "Coffee Shop", province: "Hồ Chí Minh", district: "Quận 3", address: "34 Võ Văn Tần, P.6", googleMapLink: "https://maps.google.com/?q=CONG+Coffee+Q3", status: "active", createdAt: "2025-02-10" },
    { id: 7, name: "Becamex Store - Thuận An", category: "Convenience Store", province: "Bình Dương", district: "Thuận An", address: "KCN VSIP I, P. Bình Hòa", googleMapLink: "https://maps.google.com/?q=Becamex+Thuan+An", status: "active", createdAt: "2025-02-15" },
    { id: 8, name: "Maisa Restaurant - Hoàn Kiếm", category: "Restaurant", province: "Hà Nội", district: "Hoàn Kiếm", address: "15 Hàng Bài, P. Tràng Tiền", googleMapLink: "https://maps.google.com/?q=Maisa+HN", status: "active", createdAt: "2025-02-20" },
    { id: 9, name: "Market Box - Quận 7", category: "Supermarket", province: "Hồ Chí Minh", district: "Quận 7", address: "Crescent Mall, Phú Mỹ Hưng", googleMapLink: "https://maps.google.com/?q=Market+Box+Q7", status: "inactive", createdAt: "2025-03-01" },
    { id: 10, name: "Vincom Pool - Dĩ An", category: "Pool", province: "Bình Dương", district: "Dĩ An", address: "Vincom Plaza Dĩ An", googleMapLink: "https://maps.google.com/?q=Vincom+Di+An", status: "active", createdAt: "2025-03-05" },
    { id: 11, name: "CGV Cinema - Cầu Giấy", category: "Fest", province: "Hà Nội", district: "Cầu Giấy", address: "Vincom Mega Mall Times City", googleMapLink: "https://maps.google.com/?q=CGV+Times+City", status: "active", createdAt: "2025-03-10" },
    { id: 12, name: "Coffee House - Quận 1", category: "Coffee Shop", province: "Hồ Chí Minh", district: "Quận 1", address: "234 Lê Lợi, P. Bến Thành", googleMapLink: "https://maps.google.com/?q=Coffee+House+Q1", status: "active", createdAt: "2025-03-15" },
    { id: 13, name: "Becamex Store - Thủ Dầu Một", category: "Convenience Store", province: "Bình Dương", district: "Thủ Dầu Một", address: "567 Đại lộ Bình Dương, P. Phú Hòa", googleMapLink: "https://maps.google.com/?q=Becamex+TDM", status: "active", createdAt: "2025-03-20" },
    { id: 14, name: "Maisa Restaurant - Đống Đa", category: "Restaurant", province: "Hà Nội", district: "Đống Đa", address: "88 Láng Hạ, P. Thành Công", googleMapLink: "https://maps.google.com/?q=Maisa+DD", status: "inactive", createdAt: "2025-03-25" },
    { id: 15, name: "Market Box - Quận 2", category: "Supermarket", province: "Hồ Chí Minh", district: "Quận 2", address: "The Vista Building, An Phú", googleMapLink: "https://maps.google.com/?q=Market+Box+Q2", status: "active", createdAt: "2025-04-01" },
    { id: 16, name: "Vincom Pool - Thuận An", category: "Pool", province: "Bình Dương", district: "Thuận An", address: "Vincom Plaza Thuận An", googleMapLink: "https://maps.google.com/?q=Vincom+Thuan+An", status: "inactive", createdAt: "2025-04-05" },
    { id: 17, name: "CGV Cinema - Quận 3", category: "Fest", province: "Hồ Chí Minh", district: "Quận 3", address: "Parkson Lê Thánh Tôn", googleMapLink: "https://maps.google.com/?q=CGV+Q3", status: "active", createdAt: "2025-04-10" },
    { id: 18, name: "CONG Coffee - Ba Đình", category: "Coffee Shop", province: "Hà Nội", district: "Ba Đình", address: "45 Nguyễn Thái Học", googleMapLink: "https://maps.google.com/?q=CONG+Ba+Dinh", status: "active", createdAt: "2025-04-15" },
    { id: 19, name: "Becamex Store - Dĩ An", category: "Convenience Store", province: "Bình Dương", district: "Dĩ An", address: "890 Quốc lộ 1K, P. Tân Đông Hiệp", googleMapLink: "https://maps.google.com/?q=Becamex+Di+An", status: "active", createdAt: "2025-04-20" },
    { id: 20, name: "Maisa Restaurant - Quận 7", category: "Restaurant", province: "Hồ Chí Minh", district: "Quận 7", address: "Lotte Mart Phú Mỹ Hưng", googleMapLink: "https://maps.google.com/?q=Maisa+Q7", status: "active", createdAt: "2025-04-25" },
  ];
};

export default function ShopManagementPage() {
  const [shops] = useState<Shop[]>(generateMockShops());
  const [filteredShops, setFilteredShops] = useState<Shop[]>(generateMockShops());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterProvince, setFilterProvince] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Province and District mapping
  const provinceDistrictMap: Record<string, string[]> = {
    "Hồ Chí Minh": ["Quận 1", "Quận 2", "Quận 3", "Quận 7"],
    "Hà Nội": ["Hoàn Kiếm", "Ba Đình", "Đống Đa", "Cầu Giấy"],
    "Bình Dương": ["Thủ Dầu Một", "Dĩ An", "Thuận An"],
  };

  const availableDistricts = filterProvince ? provinceDistrictMap[filterProvince] || [] : [];

  // Filter effect
  useEffect(() => {
    let result = [...shops];

    if (searchTerm) {
      result = result.filter(
        (shop) =>
          shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shop.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory) {
      result = result.filter((shop) => shop.category === filterCategory);
    }

    if (filterProvince) {
      result = result.filter((shop) => shop.province === filterProvince);
    }

    if (filterDistrict) {
      result = result.filter((shop) => shop.district === filterDistrict);
    }

    if (filterStatus) {
      result = result.filter((shop) => shop.status === filterStatus);
    }

    setFilteredShops(result);
  }, [shops, searchTerm, filterCategory, filterProvince, filterDistrict, filterStatus]);

  // Reset district filter when province changes
  useEffect(() => {
    setFilterDistrict("");
  }, [filterProvince]);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Coffee Shop": "bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400",
      "Restaurant": "bg-orange-100 text-orange-800 dark:bg-orange-500/10 dark:text-orange-400",
      "Supermarket": "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400",
      "Pool": "bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400",
      "Fest": "bg-purple-100 text-purple-800 dark:bg-purple-500/10 dark:text-purple-400",
      "Convenience Store": "bg-pink-100 text-pink-800 dark:bg-pink-500/10 dark:text-pink-400",
    };
    return colors[category] || "bg-gray-100 text-gray-800 dark:bg-gray-500/10 dark:text-gray-400";
  };

  const getStatusColor = (status: string) => {
    return status === "active"
      ? "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400"
      : "bg-gray-100 text-gray-800 dark:bg-gray-500/10 dark:text-gray-400";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Shop Management
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-300">
            Manage shops for voucher system
          </p>
        </div>
        <button className="rounded-lg bg-primary px-6 py-2.5 text-white hover:bg-primary/90">
          + Create Shop
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-lg border border-stroke bg-white p-4 shadow-sm dark:border-strokedark dark:bg-boxdark">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {/* Search */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search shop name..."
              className="w-full rounded-lg border border-stroke bg-transparent px-3 py-2 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full rounded-lg border border-stroke bg-transparent px-3 py-2 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4"
            >
              <option value="">All Categories</option>
              <option value="Coffee Shop">Coffee Shop</option>
              <option value="Restaurant">Restaurant</option>
              <option value="Supermarket">Supermarket</option>
              <option value="Pool">Pool</option>
              <option value="Fest">Fest</option>
              <option value="Convenience Store">Convenience Store</option>
            </select>
          </div>

          {/* Province Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Province
            </label>
            <select
              value={filterProvince}
              onChange={(e) => setFilterProvince(e.target.value)}
              className="w-full rounded-lg border border-stroke bg-transparent px-3 py-2 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4"
            >
              <option value="">All Provinces</option>
              <option value="Hồ Chí Minh">Hồ Chí Minh</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="Bình Dương">Bình Dương</option>
            </select>
          </div>

          {/* District Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              District
            </label>
            <select
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
              disabled={!filterProvince}
              className="w-full rounded-lg border border-stroke bg-transparent px-3 py-2 outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 dark:border-strokedark dark:bg-meta-4"
            >
              <option value="">All Districts</option>
              {availableDistricts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full rounded-lg border border-stroke bg-transparent px-3 py-2 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterCategory("");
                setFilterProvince("");
                setFilterDistrict("");
                setFilterStatus("");
              }}
              className="w-full rounded-lg border border-stroke px-4 py-2 text-sm hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredShops.length} of {shops.length} shops
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b border-stroke bg-gray-2 text-left dark:border-strokedark dark:bg-meta-4">
                <th className="px-4 py-4 text-xs font-semibold uppercase text-gray-700 dark:text-gray-300">
                  ID
                </th>
                <th className="px-4 py-4 text-xs font-semibold uppercase text-gray-700 dark:text-gray-300">
                  Shop Name
                </th>
                <th className="px-4 py-4 text-xs font-semibold uppercase text-gray-700 dark:text-gray-300">
                  Category
                </th>
                <th className="px-4 py-4 text-xs font-semibold uppercase text-gray-700 dark:text-gray-300">
                  Province
                </th>
                <th className="px-4 py-4 text-xs font-semibold uppercase text-gray-700 dark:text-gray-300">
                  District
                </th>
                <th className="px-4 py-4 text-xs font-semibold uppercase text-gray-700 dark:text-gray-300">
                  Address
                </th>
                <th className="px-4 py-4 text-xs font-semibold uppercase text-gray-700 dark:text-gray-300">
                  Google Map
                </th>
                <th className="px-4 py-4 text-xs font-semibold uppercase text-gray-700 dark:text-gray-300">
                  Status
                </th>
                <th className="px-4 py-4 text-xs font-semibold uppercase text-gray-700 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredShops.length > 0 ? (
                filteredShops.map((shop) => (
                  <tr
                    key={shop.id}
                    className="border-b border-stroke hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                  >
                    <td className="px-4 py-4">
                      <p className="text-sm font-medium text-black dark:text-white">
                        #{shop.id}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-medium text-black dark:text-white">
                        {shop.name}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getCategoryColor(
                          shop.category
                        )}`}
                      >
                        {shop.category}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-black dark:text-white">
                        {shop.province}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-black dark:text-white">
                        {shop.district}
                      </p>
                    </td>
                    <td className="px-4 py-4 max-w-xs">
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {shop.address}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <a
                        href={shop.googleMapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        View Map
                      </a>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                          shop.status
                        )}`}
                      >
                        {shop.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          title="View details"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                        <button
                          className="p-1 text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                          title="Edit"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          title="Delete"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      No shops found
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-stroke px-4 py-4 dark:border-strokedark">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredShops.length} shops
          </p>
          <div className="flex gap-2">
            <button className="rounded-lg border border-stroke px-4 py-2 text-sm hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4">
              Previous
            </button>
            <button className="rounded-lg bg-primary px-4 py-2 text-sm text-white">
              1
            </button>
            <button className="rounded-lg border border-stroke px-4 py-2 text-sm hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
