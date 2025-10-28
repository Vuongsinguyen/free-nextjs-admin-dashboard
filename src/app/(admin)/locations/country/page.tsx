"use client";

import { useState, useEffect, useMemo } from "react";
import CountryFilters from "@/components/locations/CountryFilters";
import CountryTable from "@/components/locations/CountryTable";
import CountryModal from "@/components/locations/CountryModal";

interface Country {
  id: number;
  code: string;
  name: string;
  nameEn: string;
  phoneCode: string;
  provinceCount: number;
  status: "active" | "inactive";
  createdAt: string;
}

interface SortConfig {
  key: keyof Country;
  direction: "asc" | "desc";
}

const mockCountries: Country[] = [
  {
    id: 1,
    code: "VN",
    name: "Việt Nam",
    nameEn: "Vietnam",
    phoneCode: "+84",
    provinceCount: 63,
    status: "active",
    createdAt: "2024-01-01"
  }
];

export default function CountryPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
  });
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "id",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Load countries data
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setCountries(mockCountries);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...countries];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (country) =>
          country.name.toLowerCase().includes(searchLower) ||
          country.nameEn.toLowerCase().includes(searchLower) ||
          country.code.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (filters.status) {
      result = result.filter((country) => country.status === filters.status);
    }

    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setFilteredCountries(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [countries, filters, sortConfig]);

  // Paginate countries
  const paginatedCountries = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCountries.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCountries, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredCountries.length / itemsPerPage);

  const handleSort = (key: keyof Country) => {
    setSortConfig((prevConfig: SortConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleAddCountry = () => {
    setEditingCountry(null);
    setShowModal(true);
  };

  const handleEditCountry = (country: Country) => {
    setEditingCountry(country);
    setShowModal(true);
  };

  const handleDeleteCountry = (countryId: number) => {
    if (confirm("Are you sure you want to delete this country?")) {
      setCountries(prev => prev.filter(country => country.id !== countryId));
    }
  };

  const handleSaveCountry = (countryData: Partial<Country>) => {
    if (editingCountry) {
      // Update existing country
      setCountries(prev =>
        prev.map(country =>
          country.id === editingCountry.id
            ? { ...country, ...countryData }
            : country
        )
      );
    } else {
      // Add new country
      const newCountry: Country = {
        id: Math.max(...countries.map(c => c.id), 0) + 1,
        code: countryData.code || "",
        name: countryData.name || "",
        nameEn: countryData.nameEn || "",
        phoneCode: countryData.phoneCode || "",
        provinceCount: countryData.provinceCount || 0,
        status: countryData.status || "active",
        createdAt: new Date().toISOString(),
      };
      setCountries(prev => [...prev, newCountry]);
    }
    setShowModal(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading countries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Country Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage countries and their administrative divisions
          </p>
        </div>
        <button
          onClick={handleAddCountry}
          className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Add Country
        </button>
      </div>

      {/* Filters */}
      <CountryFilters
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {countries.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Total Countries
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-green-600">
            {countries.filter(c => c.status === "active").length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Active Countries
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-red-600">
            {countries.filter(c => c.status === "inactive").length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Inactive Countries
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-blue-600">
            {filteredCountries.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Filtered Results
          </div>
        </div>
      </div>

      {/* Country Table */}
      <CountryTable
        countries={paginatedCountries}
        sortConfig={sortConfig}
        onSort={handleSort}
        onEdit={handleEditCountry}
        onDelete={handleDeleteCountry}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 px-6 py-3 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredCountries.length)} of {filteredCountries.length} results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  currentPage === page
                    ? "bg-brand-500 text-white"
                    : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Country Modal */}
      {showModal && (
        <CountryModal
          country={editingCountry}
          onClose={() => setShowModal(false)}
          onSave={handleSaveCountry}
        />
      )}
    </div>
  );
}
