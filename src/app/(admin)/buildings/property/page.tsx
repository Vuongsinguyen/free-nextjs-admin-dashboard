"use client";
import React, { useState } from "react";

interface Property {
  id: number;
  code: string;
  name: string;
  location: string;
  developer: string;
  totalArea: number; // m2
  categoryId: number;
  categoryName: string;
  totalZones: number;
  totalBuildings: number;
  totalUnits: number;
  status: "planning" | "under-construction" | "completed" | "operational";
  startDate: string;
  completionDate: string;
  description: string;
}

const PropertyPage = () => {
  const [properties, setProperties] = useState<Property[]>([
    {
      id: 1,
      code: "PRJ001",
      name: "Vinhomes Grand Park",
      location: "Quận 9, TP.HCM",
      developer: "Vingroup",
      totalArea: 271,
      categoryId: 1,
      categoryName: "Apartment",
      totalZones: 12,
      totalBuildings: 45,
      totalUnits: 8500,
      status: "operational",
      startDate: "2018-01-15",
      completionDate: "2023-12-30",
      description: "Khu đô thị sinh thái thông minh quy mô lớn",
    },
    {
      id: 2,
      code: "PRJ002",
      name: "Masteri Thảo Điền",
      location: "Quận 2, TP.HCM",
      developer: "Masterise Homes",
      totalArea: 6.3,
      categoryId: 1,
      categoryName: "Apartment",
      totalZones: 3,
      totalBuildings: 5,
      totalUnits: 2200,
      status: "operational",
      startDate: "2015-03-20",
      completionDate: "2019-06-15",
      description: "Tổ hợp căn hộ cao cấp bên bờ sông Sài Gòn",
    },
    {
      id: 3,
      code: "PRJ003",
      name: "Phú Mỹ Hưng Garden Homes",
      location: "Quận 7, TP.HCM",
      developer: "Phú Mỹ Hưng",
      totalArea: 15.5,
      categoryId: 2,
      categoryName: "Villa",
      totalZones: 5,
      totalBuildings: 0,
      totalUnits: 180,
      status: "completed",
      startDate: "2016-05-10",
      completionDate: "2020-08-20",
      description: "Khu biệt thự vườn cao cấp",
    },
    {
      id: 4,
      code: "PRJ004",
      name: "Sala Urban",
      location: "Quận 2, TP.HCM",
      developer: "Danh Khôi",
      totalArea: 9.2,
      categoryId: 3,
      categoryName: "Shop House",
      totalZones: 2,
      totalBuildings: 8,
      totalUnits: 156,
      status: "operational",
      startDate: "2017-08-01",
      completionDate: "2021-12-15",
      description: "Khu phố thương mại kết hợp nhà ở",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Removed Add Property action as requested

  // Removed edit/delete/modal logic; page is now read-only cards

  const getStatusBadge = (status: Property["status"]) => {
    const badges = {
      planning: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
      "under-construction": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      completed: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      operational: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    };
    const labels = {
      planning: "Planning",
      "under-construction": "Under Construction",
      completed: "Completed",
      operational: "Operational",
    };
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const filteredProperties = properties.filter((prop) => {
    const matchesSearch = prop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prop.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prop.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || prop.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalArea = properties.reduce((sum, prop) => sum + prop.totalArea, 0);
  const totalUnits = properties.reduce((sum, prop) => sum + prop.totalUnits, 0);
  const operationalCount = properties.filter((p) => p.status === "operational").length;

  return (
    <div className="p-4 md:p-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-4">
        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Projects</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{properties.length}</p>
            </div>
            <div className="p-3 bg-brand-50 rounded-lg dark:bg-brand-900/20">
              <svg className="w-6 h-6 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Area</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalArea.toFixed(1)} ha</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg dark:bg-purple-900/20">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Units</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalUnits.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg dark:bg-green-900/20">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Operational</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{operationalCount}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg dark:bg-blue-900/20">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow dark:bg-gray-900 mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Search by name, code, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="planning">Planning</option>
              <option value="under-construction">Under Construction</option>
              <option value="completed">Completed</option>
              <option value="operational">Operational</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid (Cards) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredProperties.map((property) => (
          <div
            key={property.id}
            className="bg-white rounded-lg shadow dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {property.name}
                </h3>
                {getStatusBadge(property.status)}
              </div>
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Code: <span className="font-mono font-semibold">{property.code}</span>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 12.414a4 4 0 10-1.414 1.414l4.243 4.243a1 1 0 001.414-1.414z" />
                </svg>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Location</div>
                  <div className="text-sm text-gray-900 dark:text-white">{property.location}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h3m10-12h1a2 2 0 012 2v3m-6 6h3a2 2 0 002-2v-3M9 21V9a2 2 0 012-2h2a2 2 0 012 2v12M9 7V3h6v4" />
                </svg>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Developer</div>
                  <div className="text-sm text-gray-900 dark:text-white">{property.developer}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
                </svg>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Category</div>
                  <div className="text-sm text-gray-900 dark:text-white">{property.categoryName}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21h8m-6-4h4M7 3h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
                </svg>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Area</div>
                  <div className="text-sm text-gray-900 dark:text-white">{property.totalArea} ha</div>
                </div>
              </div>
              {property.description && (
                <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{property.description}</div>
              )}
            </div>

            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">Zones: {property.totalZones}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">Buildings: {property.totalBuildings}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">Units: {property.totalUnits}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal removed (no editing in card view) */}
    </div>
  );
};

export default PropertyPage;
