"use client";
import React, { useState } from "react";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";

interface PropertyUnit {
  id: number;
  unitNumber: string;
  floorNumber: number;
  buildingName: string;
  zoneName: string;
  propertyName: string;
  area: number; // m2
  bedrooms: number;
  bathrooms: number;
  unitType: "studio" | "1br" | "2br" | "3br" | "4br" | "penthouse";
  status: "available" | "occupied" | "reserved" | "under-renovation";
  ownerName: string;
  rentPrice: number; // VND
}

const PropertyUnitPage = () => {
  const [units, setUnits] = useState<PropertyUnit[]>([
    {
      id: 1,
      unitNumber: "01",
      floorNumber: 1,
      buildingName: "Rainbow Tower 1",
      zoneName: "The Rainbow",
      propertyName: "Vinhomes Grand Park",
      area: 72,
      bedrooms: 2,
      bathrooms: 2,
      unitType: "2br",
      status: "occupied",
      ownerName: "Nguyễn Văn A",
      rentPrice: 15000000,
    },
    {
      id: 2,
      unitNumber: "02",
      floorNumber: 1,
      buildingName: "Rainbow Tower 1",
      zoneName: "The Rainbow",
      propertyName: "Vinhomes Grand Park",
      area: 85,
      bedrooms: 3,
      bathrooms: 2,
      unitType: "3br",
      status: "occupied",
      ownerName: "Trần Thị B",
      rentPrice: 18000000,
    },
    {
      id: 3,
      unitNumber: "03",
      floorNumber: 1,
      buildingName: "Rainbow Tower 1",
      zoneName: "The Rainbow",
      propertyName: "Vinhomes Grand Park",
      area: 50,
      bedrooms: 1,
      bathrooms: 1,
      unitType: "1br",
      status: "available",
      ownerName: "",
      rentPrice: 12000000,
    },
    {
      id: 4,
      unitNumber: "04",
      floorNumber: 1,
      buildingName: "Rainbow Tower 1",
      zoneName: "The Rainbow",
      propertyName: "Vinhomes Grand Park",
      area: 105,
      bedrooms: 3,
      bathrooms: 3,
      unitType: "3br",
      status: "reserved",
      ownerName: "Lê Văn C",
      rentPrice: 22000000,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingUnit, setEditingUnit] = useState<PropertyUnit | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [formData, setFormData] = useState({
    unitNumber: "",
    floorNumber: 1,
    buildingName: "Rainbow Tower 1",
    zoneName: "The Rainbow",
    propertyName: "Vinhomes Grand Park",
    area: 0,
    bedrooms: 1,
    bathrooms: 1,
    unitType: "1br" as PropertyUnit["unitType"],
    status: "available" as PropertyUnit["status"],
    ownerName: "",
    rentPrice: 0,
  });

  const handleAdd = () => {
    setEditingUnit(null);
    setFormData({
      unitNumber: "",
      floorNumber: 1,
      buildingName: "Rainbow Tower 1",
      zoneName: "The Rainbow",
      propertyName: "Vinhomes Grand Park",
      area: 0,
      bedrooms: 1,
      bathrooms: 1,
      unitType: "1br",
      status: "available",
      ownerName: "",
      rentPrice: 0,
    });
    setShowModal(true);
  };

  const handleEdit = (unit: PropertyUnit) => {
    setEditingUnit(unit);
    setFormData({
      unitNumber: unit.unitNumber,
      floorNumber: unit.floorNumber,
      buildingName: unit.buildingName,
      zoneName: unit.zoneName,
      propertyName: unit.propertyName,
      area: unit.area,
      bedrooms: unit.bedrooms,
      bathrooms: unit.bathrooms,
      unitType: unit.unitType,
      status: unit.status,
      ownerName: unit.ownerName,
      rentPrice: unit.rentPrice,
    });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this property unit?")) {
      setUnits(units.filter((u) => u.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUnit) {
      setUnits(units.map((u) => (u.id === editingUnit.id ? { ...u, ...formData } : u)));
    } else {
      const newUnit: PropertyUnit = {
        id: Math.max(...units.map((u) => u.id)) + 1,
        ...formData,
      };
      setUnits([...units, newUnit]);
    }
    setShowModal(false);
  };

  const getStatusBadge = (status: PropertyUnit["status"]) => {
    const badges = {
      available: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      occupied: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      reserved: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      "under-renovation": "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
    };
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${badges[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
      </span>
    );
  };

  const filteredUnits = units.filter((unit) => {
    const matchesSearch =
      unit.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.buildingName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || unit.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const availableCount = units.filter((u) => u.status === "available").length;
  const occupiedCount = units.filter((u) => u.status === "occupied").length;
  const occupancyRate = units.length > 0 ? ((occupiedCount / units.length) * 100).toFixed(1) : 0;

  return (
    <div className="p-4 md:p-6">
      <PageBreadCrumb pageTitle="Property Unit" />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-4">
        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Units</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{units.length}</p>
            </div>
            <div className="p-3 bg-brand-50 rounded-lg dark:bg-brand-900/20">
              <svg className="w-6 h-6 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Available</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{availableCount}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg dark:bg-green-900/20">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Occupied</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{occupiedCount}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg dark:bg-blue-900/20">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Occupancy Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{occupancyRate}%</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg dark:bg-purple-900/20">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
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
              placeholder="Search by unit number, building, or owner..."
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
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="reserved">Reserved</option>
              <option value="under-renovation">Under Renovation</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow dark:bg-gray-900">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Property Units</h2>
          <button
            onClick={handleAdd}
            className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600"
          >
            + Add Unit
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Unit #</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Floor</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Building</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Type</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Area (m²)</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Bed/Bath</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Owner</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Rent Price</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Status</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-800">
              {filteredUnits.map((unit) => (
                <tr key={unit.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold text-brand-700 bg-brand-100 rounded dark:bg-brand-900/20 dark:text-brand-400">
                      {unit.unitNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">Floor {unit.floorNumber}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{unit.buildingName}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{unit.zoneName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                      {unit.unitType.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{unit.area}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {unit.bedrooms}BR / {unit.bathrooms}BA
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {unit.ownerName || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {unit.rentPrice.toLocaleString()} VND
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(unit.status)}</td>
                  <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(unit)}
                      className="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300 mr-3 inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(unit.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-999999 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl mx-4 my-8">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingUnit ? "Edit Property Unit" : "Add Property Unit"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Unit Number *</label>
                  <input
                    type="text"
                    value={formData.unitNumber}
                    onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Floor Number *</label>
                  <input
                    type="number"
                    value={formData.floorNumber}
                    onChange={(e) => setFormData({ ...formData, floorNumber: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Building *</label>
                  <input
                    type="text"
                    value={formData.buildingName}
                    onChange={(e) => setFormData({ ...formData, buildingName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Unit Type *</label>
                  <select
                    value={formData.unitType}
                    onChange={(e) => setFormData({ ...formData, unitType: e.target.value as PropertyUnit["unitType"] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    required
                  >
                    <option value="studio">Studio</option>
                    <option value="1br">1 Bedroom</option>
                    <option value="2br">2 Bedrooms</option>
                    <option value="3br">3 Bedrooms</option>
                    <option value="4br">4 Bedrooms</option>
                    <option value="penthouse">Penthouse</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Area (m²) *</label>
                  <input
                    type="number"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bedrooms *</label>
                  <input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bathrooms *</label>
                  <input
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as PropertyUnit["status"] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    required
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="reserved">Reserved</option>
                    <option value="under-renovation">Under Renovation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rent Price (VND) *</label>
                  <input
                    type="number"
                    value={formData.rentPrice}
                    onChange={(e) => setFormData({ ...formData, rentPrice: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Owner Name</label>
                  <input
                    type="text"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600"
                >
                  {editingUnit ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyUnitPage;
