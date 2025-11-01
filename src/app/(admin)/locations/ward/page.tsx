"use client";

import { useEffect, useMemo, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { supabase } from "@/lib/supabase";

interface WardRow {
  id: string;
  code: string;
  name: string;
  name_en: string;
  province_id: string;
  status: "active" | "inactive";
  type: "ward" | "commune" | "town";
  province?: {
    name: string;
    name_en: string;
    code: string;
  } | null;
}

export default function WardPage() {
  const [wards, setWards] = useState<WardRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProvince, setFilterProvince] = useState<string>("all");
  const [filterType, setFilterType] = useState<"all" | "ward" | "commune" | "town">("all");
  const [importing, setImporting] = useState(false);
  const [importMsg, setImportMsg] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("wards")
        .select("id, code, name, name_en, province_id, status, type, province:provinces(name, name_en, code)")
        .order("name", { ascending: true });
      if (error) {
        setError(error.message);
        setWards([]);
      } else {
        setWards((data || []) as WardRow[]);
      }
      setIsLoading(false);
    };
    load();
  }, []);

  const provinceOptions = useMemo(() => {
    return Array.from(new Set(wards.map(w => w.province?.name || ""))).filter(Boolean) as string[];
  }, [wards]);

  const filteredWards = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return wards.filter(ward => {
      const matchesSearch =
        ward.name.toLowerCase().includes(term) ||
        ward.name_en.toLowerCase().includes(term) ||
        ward.code.toLowerCase().includes(term);
      const matchesProvince = filterProvince === "all" || ward.province?.name === filterProvince;
      const matchesType = filterType === "all" || ward.type === filterType;
      return matchesSearch && matchesProvince && matchesType;
    });
  }, [wards, searchTerm, filterProvince, filterType]);

  const stats = {
    total: wards.length,
    ward: wards.filter(w => w.type === 'ward').length,
    commune: wards.filter(w => w.type === 'commune').length,
  };

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Ward Management" />

      {isLoading && <div className="text-sm text-gray-500">Loading wards...</div>}
      {error && <div className="text-sm text-red-600">Error: {error}</div>}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      </div>

      {/* Search & Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="search-ward" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
            <input
              id="search-ward"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search ward..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="filter-province" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Province</label>
            <select
              id="filter-province"
              value={filterProvince}
              onChange={(e) => setFilterProvince(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Provinces</option>
              {provinceOptions.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="filter-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
            <select
              id="filter-type"
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

        {/* Inline Import helper, visible when data seems sparse */}
        {(!isLoading && wards.length < 200) && (
          <div className="mt-4 flex items-center gap-3">
            <button
              disabled={importing}
              onClick={async () => {
                try {
                  setImporting(true);
                  setImportMsg(null);
                  const { data: sessionData } = await supabase.auth.getSession();
                  const token = sessionData.session?.access_token;
                  const res = await fetch('/api/locations/import', {
                    method: 'POST',
                    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                  });
                  const json = await res.json();
                  if (!res.ok) {
                    setImportMsg(`Import failed: ${json?.error || res.statusText}`);
                  } else {
                    setImportMsg(`Imported ${json.inserted || 0} wards (parsed ${json.totalParsed}).`);
                    // Refresh list
                    const { data } = await supabase
                      .from("wards")
                      .select("id, code, name, name_en, province_id, status, type, province:provinces(name, name_en, code)")
                      .order("name", { ascending: true });
                    setWards((data || []) as WardRow[]);
                  }
                } catch (e: unknown) {
                  const message = e instanceof Error ? e.message : String(e);
                  setImportMsg(`Import error: ${message}`);
                } finally {
                  setImporting(false);
                }
              }}
              className="px-4 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {importing ? 'Importing…' : 'Nhập dữ liệu từ CSV'}
            </button>
            {importMsg && <span className="text-sm text-gray-600 dark:text-gray-300">{importMsg}</span>}
          </div>
        )}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Province</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
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
                    {ward.name_en}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {ward.province?.name}
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
