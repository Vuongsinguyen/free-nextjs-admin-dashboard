"use client";

import { useState, useEffect } from "react";

interface Asset {
  id: number;
  code: string;
  name: string;
  category: string;
  type: string;
  location: string;
  status: "active" | "inactive" | "maintenance" | "retired";
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  condition: "excellent" | "good" | "fair" | "poor";
  assignedTo: string;
  department: string;
  lastMaintenance: string;
  nextMaintenance: string;
  warranty: string;
}

const mockAssets: Asset[] = [
  { id: 1, code: "AC-001", name: "Air Conditioner Unit 1", category: "HVAC", type: "Cooling System", location: "Building A - Floor 1", status: "active", purchaseDate: "2023-01-15", purchasePrice: 15000000, currentValue: 12000000, condition: "excellent", assignedTo: "Facility Team", department: "Maintenance", lastMaintenance: "2025-09-15", nextMaintenance: "2025-12-15", warranty: "2026-01-15" },
  { id: 2, code: "EL-001", name: "Elevator Main", category: "Elevator", type: "Passenger Lift", location: "Building A - Lobby", status: "active", purchaseDate: "2022-06-01", purchasePrice: 450000000, currentValue: 380000000, condition: "good", assignedTo: "Engineering Team", department: "Engineering", lastMaintenance: "2025-10-01", nextMaintenance: "2025-11-01", warranty: "2027-06-01" },
  { id: 3, code: "GN-001", name: "Backup Generator", category: "Power", type: "Diesel Generator", location: "Building B - Basement", status: "active", purchaseDate: "2021-03-20", purchasePrice: 85000000, currentValue: 65000000, condition: "good", assignedTo: "Engineering Team", department: "Engineering", lastMaintenance: "2025-09-20", nextMaintenance: "2025-12-20", warranty: "2026-03-20" },
  { id: 4, code: "PU-001", name: "Water Pump 1", category: "Plumbing", type: "Centrifugal Pump", location: "Building A - Basement", status: "maintenance", purchaseDate: "2023-05-10", purchasePrice: 12000000, currentValue: 10500000, condition: "fair", assignedTo: "Facility Team", department: "Maintenance", lastMaintenance: "2025-10-20", nextMaintenance: "2025-11-20", warranty: "2028-05-10" },
  { id: 5, code: "FP-001", name: "Fire Pump System", category: "Safety", type: "Emergency Pump", location: "Building B - Basement", status: "active", purchaseDate: "2022-02-15", purchasePrice: 35000000, currentValue: 28000000, condition: "excellent", assignedTo: "Safety Team", department: "Safety", lastMaintenance: "2025-10-10", nextMaintenance: "2026-01-10", warranty: "2027-02-15" },
  { id: 6, code: "AC-002", name: "Air Conditioner Unit 2", category: "HVAC", type: "Cooling System", location: "Building A - Floor 2", status: "active", purchaseDate: "2023-01-15", purchasePrice: 15000000, currentValue: 12000000, condition: "excellent", assignedTo: "Facility Team", department: "Maintenance", lastMaintenance: "2025-09-15", nextMaintenance: "2025-12-15", warranty: "2026-01-15" },
  { id: 7, code: "LT-001", name: "LED Lighting Panel A", category: "Lighting", type: "LED Panel", location: "Building A - All Floors", status: "active", purchaseDate: "2023-07-01", purchasePrice: 8000000, currentValue: 7000000, condition: "good", assignedTo: "Facility Team", department: "Maintenance", lastMaintenance: "2025-08-01", nextMaintenance: "2026-02-01", warranty: "2028-07-01" },
  { id: 8, code: "CC-001", name: "CCTV System 1", category: "Security", type: "Surveillance", location: "Building A - Lobby", status: "active", purchaseDate: "2022-11-10", purchasePrice: 25000000, currentValue: 20000000, condition: "good", assignedTo: "Security Team", department: "Security", lastMaintenance: "2025-09-10", nextMaintenance: "2025-12-10", warranty: "2027-11-10" },
  { id: 9, code: "AC-003", name: "Chiller Unit", category: "HVAC", type: "Central Cooling", location: "Building B - Rooftop", status: "active", purchaseDate: "2021-08-20", purchasePrice: 120000000, currentValue: 90000000, condition: "good", assignedTo: "Engineering Team", department: "Engineering", lastMaintenance: "2025-10-15", nextMaintenance: "2026-01-15", warranty: "2026-08-20" },
  { id: 10, code: "PU-002", name: "Sewage Pump", category: "Plumbing", type: "Submersible Pump", location: "Building B - Basement", status: "active", purchaseDate: "2023-03-05", purchasePrice: 9000000, currentValue: 7500000, condition: "good", assignedTo: "Facility Team", department: "Maintenance", lastMaintenance: "2025-09-05", nextMaintenance: "2025-12-05", warranty: "2028-03-05" },
  { id: 11, code: "EL-002", name: "Escalator Main", category: "Elevator", type: "Escalator", location: "Building A - Ground Floor", status: "inactive", purchaseDate: "2022-04-15", purchasePrice: 180000000, currentValue: 150000000, condition: "poor", assignedTo: "Engineering Team", department: "Engineering", lastMaintenance: "2025-08-15", nextMaintenance: "2025-11-15", warranty: "2027-04-15" },
  { id: 12, code: "FA-001", name: "Fire Alarm System", category: "Safety", type: "Detection System", location: "Building A - All Floors", status: "active", purchaseDate: "2022-05-20", purchasePrice: 45000000, currentValue: 38000000, condition: "excellent", assignedTo: "Safety Team", department: "Safety", lastMaintenance: "2025-10-20", nextMaintenance: "2026-01-20", warranty: "2027-05-20" },
  { id: 13, code: "AC-004", name: "VRV System Building B", category: "HVAC", type: "Variable Refrigerant", location: "Building B - All Floors", status: "active", purchaseDate: "2023-02-10", purchasePrice: 95000000, currentValue: 80000000, condition: "excellent", assignedTo: "Engineering Team", department: "Engineering", lastMaintenance: "2025-09-10", nextMaintenance: "2025-12-10", warranty: "2028-02-10" },
  { id: 14, code: "LT-002", name: "Emergency Lighting", category: "Lighting", type: "Battery Backup", location: "Building B - Stairwells", status: "active", purchaseDate: "2023-06-15", purchasePrice: 5000000, currentValue: 4500000, condition: "excellent", assignedTo: "Safety Team", department: "Safety", lastMaintenance: "2025-09-15", nextMaintenance: "2026-03-15", warranty: "2028-06-15" },
  { id: 15, code: "AC-001", name: "Access Control System", category: "Security", type: "Card Reader", location: "Building A - Main Entrance", status: "active", purchaseDate: "2022-09-01", purchasePrice: 18000000, currentValue: 15000000, condition: "good", assignedTo: "Security Team", department: "Security", lastMaintenance: "2025-09-01", nextMaintenance: "2025-12-01", warranty: "2027-09-01" },
  { id: 16, code: "PU-003", name: "Booster Pump", category: "Plumbing", type: "Pressure Pump", location: "Building A - Basement", status: "active", purchaseDate: "2023-04-25", purchasePrice: 11000000, currentValue: 9500000, condition: "good", assignedTo: "Facility Team", department: "Maintenance", lastMaintenance: "2025-10-25", nextMaintenance: "2026-01-25", warranty: "2028-04-25" },
  { id: 17, code: "GN-002", name: "UPS System", category: "Power", type: "Uninterruptible Power", location: "Building A - Server Room", status: "active", purchaseDate: "2022-12-10", purchasePrice: 65000000, currentValue: 52000000, condition: "good", assignedTo: "IT Team", department: "IT", lastMaintenance: "2025-09-10", nextMaintenance: "2025-12-10", warranty: "2027-12-10" },
  { id: 18, code: "CC-002", name: "CCTV System 2", category: "Security", type: "Surveillance", location: "Building B - Parking", status: "active", purchaseDate: "2023-01-20", purchasePrice: 22000000, currentValue: 18000000, condition: "good", assignedTo: "Security Team", department: "Security", lastMaintenance: "2025-09-20", nextMaintenance: "2025-12-20", warranty: "2028-01-20" },
  { id: 19, code: "EL-003", name: "Service Elevator", category: "Elevator", type: "Freight Lift", location: "Building B - Service Area", status: "active", purchaseDate: "2022-07-15", purchasePrice: 320000000, currentValue: 270000000, condition: "good", assignedTo: "Engineering Team", department: "Engineering", lastMaintenance: "2025-10-15", nextMaintenance: "2025-11-15", warranty: "2027-07-15" },
  { id: 20, code: "SP-001", name: "Sprinkler System", category: "Safety", type: "Fire Suppression", location: "Building A - All Floors", status: "active", purchaseDate: "2022-03-30", purchasePrice: 55000000, currentValue: 47000000, condition: "excellent", assignedTo: "Safety Team", department: "Safety", lastMaintenance: "2025-09-30", nextMaintenance: "2026-03-30", warranty: "2027-03-30" },
  { id: 21, code: "AC-005", name: "Exhaust Fan System", category: "HVAC", type: "Ventilation", location: "Building B - Parking", status: "active", purchaseDate: "2023-03-15", purchasePrice: 12000000, currentValue: 10000000, condition: "good", assignedTo: "Facility Team", department: "Maintenance", lastMaintenance: "2025-09-15", nextMaintenance: "2025-12-15", warranty: "2028-03-15" },
  { id: 22, code: "LT-003", name: "Outdoor Lighting", category: "Lighting", type: "LED Floodlight", location: "Building Perimeter", status: "active", purchaseDate: "2023-05-20", purchasePrice: 7000000, currentValue: 6200000, condition: "excellent", assignedTo: "Facility Team", department: "Maintenance", lastMaintenance: "2025-08-20", nextMaintenance: "2026-02-20", warranty: "2028-05-20" },
  { id: 23, code: "WT-001", name: "Water Tank Main", category: "Plumbing", type: "Storage Tank", location: "Building A - Rooftop", status: "active", purchaseDate: "2021-12-01", purchasePrice: 28000000, currentValue: 24000000, condition: "good", assignedTo: "Engineering Team", department: "Engineering", lastMaintenance: "2025-09-01", nextMaintenance: "2026-03-01", warranty: "2026-12-01" },
  { id: 24, code: "PA-001", name: "Public Address System", category: "Communication", type: "Audio System", location: "Building A - All Areas", status: "active", purchaseDate: "2022-10-10", purchasePrice: 15000000, currentValue: 12500000, condition: "good", assignedTo: "Security Team", department: "Security", lastMaintenance: "2025-09-10", nextMaintenance: "2025-12-10", warranty: "2027-10-10" },
  { id: 25, code: "TR-001", name: "Transformer", category: "Power", type: "Step-down Transformer", location: "Building B - Electrical Room", status: "retired", purchaseDate: "2020-05-15", purchasePrice: 95000000, currentValue: 45000000, condition: "poor", assignedTo: "Engineering Team", department: "Engineering", lastMaintenance: "2025-05-15", nextMaintenance: "N/A", warranty: "Expired" },
];

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setAssets(mockAssets);
    setFilteredAssets(mockAssets);
  }, []);

  // Filter effect
  useEffect(() => {
    let result = [...assets];

    // Search filter
    if (searchTerm) {
      result = result.filter(asset =>
        asset.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filterCategory) {
      result = result.filter(asset => asset.category === filterCategory);
    }

    // Status filter
    if (filterStatus) {
      result = result.filter(asset => asset.status === filterStatus);
    }

    // Department filter
    if (filterDepartment) {
      result = result.filter(asset => asset.department === filterDepartment);
    }

    setFilteredAssets(result);
    setCurrentPage(1);
  }, [assets, searchTerm, filterCategory, filterStatus, filterDepartment]);

  // Pagination
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAssets = filteredAssets.slice(startIndex, endIndex);

  const getStatusColor = (status: Asset["status"]) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400";
      case "inactive": return "bg-gray-100 text-gray-800 dark:bg-gray-500/10 dark:text-gray-400";
      case "maintenance": return "bg-orange-100 text-orange-800 dark:bg-orange-500/10 dark:text-orange-400";
      case "retired": return "bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getConditionColor = (condition: Asset["condition"]) => {
    switch (condition) {
      case "excellent": return "text-green-600 dark:text-green-400";
      case "good": return "text-blue-600 dark:text-blue-400";
      case "fair": return "text-orange-600 dark:text-orange-400";
      case "poor": return "text-red-600 dark:text-red-400";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Asset Management</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Track and manage building assets, equipment, and maintenance</p>
        </div>
        <button className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium">
          + Add Asset
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Assets</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{assets.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
            {assets.filter(a => a.status === 'active').length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">In Maintenance</p>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-1">
            {assets.filter(a => a.status === 'maintenance').length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Value</p>
          <p className="text-2xl font-bold text-brand-600 dark:text-brand-400 mt-1">
            {(assets.reduce((sum, a) => sum + a.currentValue, 0) / 1000000).toFixed(0)}M
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search code, name, location..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Categories</option>
              <option value="HVAC">HVAC</option>
              <option value="Elevator">Elevator</option>
              <option value="Power">Power</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Safety">Safety</option>
              <option value="Lighting">Lighting</option>
              <option value="Security">Security</option>
              <option value="Communication">Communication</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="maintenance">Maintenance</option>
              <option value="retired">Retired</option>
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Department
            </label>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Departments</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Engineering">Engineering</option>
              <option value="Safety">Safety</option>
              <option value="Security">Security</option>
              <option value="IT">IT</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredAssets.length)} of {filteredAssets.length} assets
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-4">CODE</th>
                <th className="px-6 py-4">NAME</th>
                <th className="px-6 py-4">CATEGORY</th>
                <th className="px-6 py-4">LOCATION</th>
                <th className="px-6 py-4">STATUS</th>
                <th className="px-6 py-4">CONDITION</th>
                <th className="px-6 py-4">CURRENT VALUE</th>
                <th className="px-6 py-4">DEPARTMENT</th>
                <th className="px-6 py-4">NEXT MAINTENANCE</th>
                <th className="px-6 py-4">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 text-sm font-mono text-gray-900 dark:text-white">{asset.code}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    <div className="font-medium">{asset.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{asset.type}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{asset.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{asset.location}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(asset.status)}`}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-medium capitalize ${getConditionColor(asset.condition)}`}>
                      {asset.condition}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {(asset.currentValue / 1000000).toFixed(1)}M VND
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{asset.department}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{asset.nextMaintenance}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        className="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300 inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                        title="View Details"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 text-sm font-medium rounded-lg ${
                        currentPage === pageNum
                          ? "bg-brand-600 text-white"
                          : "text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
