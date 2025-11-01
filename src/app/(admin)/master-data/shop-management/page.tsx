"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Shop {
  id: string; // Changed to string for UUID
  name: string;
  category: string;
  province: string;
  district: string;
  address: string;
  googleMapLink: string;
  status: "active" | "inactive";
  createdAt: string;
}

export default function ShopManagementPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [filteredShops, setFilteredShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterProvince, setFilterProvince] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Dynamic filter options from DB
  const [categories, setCategories] = useState<string[]>([]);
  const [provinces, setProvinces] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);

  // Fetch shops from Supabase
  const fetchShops = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching shops:", error);
        return;
      }

      // Map snake_case DB fields to camelCase TypeScript
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mappedShops: Shop[] = (data || []).map((s: any) => ({
        id: s.id,
        name: s.name,
        category: s.category,
        province: s.province,
        district: s.district,
        address: s.address,
        googleMapLink: s.google_map_link,
        status: s.status,
        createdAt: s.created_at,
      }));

      setShops(mappedShops);

      // Extract unique values for filters
      const uniqueCategories = [...new Set(mappedShops.map(s => s.category))].sort();
      const uniqueProvinces = [...new Set(mappedShops.map(s => s.province))].sort();
      
      setCategories(uniqueCategories);
      setProvinces(uniqueProvinces);
    } catch (err) {
      console.error("Error fetching shops:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  // Update districts when province filter changes
  useEffect(() => {
    if (filterProvince) {
      const uniqueDistricts = [...new Set(
        shops
          .filter(s => s.province === filterProvince)
          .map(s => s.district)
      )].sort();
      setDistricts(uniqueDistricts);
    } else {
      setDistricts([]);
    }
    setFilterDistrict(""); // Reset district when province changes
  }, [filterProvince, shops]);

  // Handle seed shops
  const handleSeedShops = async () => {
    if (!confirm("Seed 20 shops vào database?")) {
      return;
    }

    try {
      setSeeding(true);
      const response = await fetch('/api/shops/seed', {
        method: 'POST',
      });

      const result = await response.json();

      if (response.ok) {
        alert(`✅ Successfully seeded ${result.count} shops!`);
        await fetchShops();
      } else {
        alert(`❌ Error: ${result.error || 'Failed to seed shops'}`);
      }
    } catch (error) {
      console.error("Error seeding shops:", error);
      alert("❌ Error seeding shops. Check console for details.");
    } finally {
      setSeeding(false);
    }
  };

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
      "Coffee Shop": "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400",
      "Restaurant": "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
      "Supermarket": "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      "Pool": "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      "Fest": "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
      "Convenience Store": "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400",
    };
    return colors[category] || "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  };

  const getStatusColor = (status: string) => {
    return status === "active"
      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
  };

  return (
    <div className="p-4 md:p-6">
      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-600 dark:text-gray-400">Loading shops...</div>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="bg-white rounded-lg shadow dark:bg-gray-900 mb-6 p-4">
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">All Provinces</option>
                  {provinces.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">All Districts</option>
                  {districts.map((district) => (
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
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
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 dark:text-gray-300"
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

          {/* Shops Table */}
          <div className="bg-white rounded-lg shadow dark:bg-gray-900">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Shops
              </h2>
              <div className="flex gap-2">
                {shops.length === 0 && !loading && (
                  <button
                    onClick={handleSeedShops}
                    disabled={seeding}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                  >
                    {seeding ? "Seeding..." : "🌱 Seed 20 Shops"}
                  </button>
                )}
                <button className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600">
                  + Add Shop
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                      Shop Name
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                      Category
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                      Province
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                      District
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                      Address
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                      Google Map
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                      Status
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-800">
                  {filteredShops.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                        No shops found
                      </td>
                    </tr>
                  ) : (
                    filteredShops.map((shop) => (
                      <tr key={shop.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {shop.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryColor(shop.category)}`}>
                            {shop.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {shop.province}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {shop.district}
                          </div>
                        </td>
                        <td className="px-6 py-4 max-w-xs">
                          <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                            {shop.address}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <a
                            href={shop.googleMapLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300"
                          >
                            View Map
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getStatusColor(shop.status)}`}>
                            {shop.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                          <button className="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300 mr-3">
                            Edit
                          </button>
                          <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <span>
                  Showing {filteredShops.length} shops
                </span>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 dark:text-gray-300">
                  Previous
                </button>
                <button className="px-4 py-2 text-sm bg-brand-500 text-white rounded-lg hover:bg-brand-600">
                  1
                </button>
                <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 dark:text-gray-300">
                  Next
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
