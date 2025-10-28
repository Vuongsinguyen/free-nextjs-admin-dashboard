"use client";
import React, { useState } from "react";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";

interface Zone {
  id: number;
  code: string;
  name: string;
  propertyId: number;
  propertyName: string;
  type: "zone" | "area" | "section";
  totalArea: number; // m2
  totalBuildings: number;
  totalUnits: number;
  description: string;
  status: "active" | "inactive";
}

const ZoneAreaSectionPage = () => {
  const [zones, setZones] = useState<Zone[]>([
    {
      id: 1,
      code: "Z01",
      name: "The Rainbow",
      propertyId: 1,
      propertyName: "Vinhomes Grand Park",
      type: "zone",
      totalArea: 22500,
      totalBuildings: 5,
      totalUnits: 850,
      description: "Khu căn hộ đầu tiên của dự án",
      status: "active",
    },
    {
      id: 2,
      code: "Z02",
      name: "The Origami",
      propertyId: 1,
      propertyName: "Vinhomes Grand Park",
      type: "zone",
      totalArea: 25000,
      totalBuildings: 6,
      totalUnits: 1200,
      description: "Khu căn hộ cao cấp view công viên",
      status: "active",
    },
    {
      id: 3,
      code: "A01",
      name: "Tower Area A",
      propertyId: 2,
      propertyName: "Masteri Thảo Điền",
      type: "area",
      totalArea: 18000,
      totalBuildings: 2,
      totalUnits: 600,
      description: "Khu tháp đôi view sông",
      status: "active",
    },
    {
      id: 4,
      code: "S01",
      name: "Premium Section",
      propertyId: 3,
      propertyName: "Phú Mỹ Hưng Garden Homes",
      type: "section",
      totalArea: 45000,
      totalBuildings: 0,
      totalUnits: 65,
      description: "Phân khu biệt thự cao cấp nhất",
      status: "active",
    },
    {
      id: 5,
      code: "Z03",
      name: "The Manhattan",
      propertyId: 1,
      propertyName: "Vinhomes Grand Park",
      type: "zone",
      totalArea: 28000,
      totalBuildings: 4,
      totalUnits: 950,
      description: "Khu căn hộ phong cách Mỹ",
      status: "active",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    propertyId: 1,
    propertyName: "Vinhomes Grand Park",
    type: "zone" as Zone["type"],
    totalArea: 0,
    description: "",
    status: "active" as Zone["status"],
  });

  const properties = [
    { id: 1, name: "Vinhomes Grand Park" },
    { id: 2, name: "Masteri Thảo Điền" },
    { id: 3, name: "Phú Mỹ Hưng Garden Homes" },
    { id: 4, name: "Sala Urban" },
  ];

  const handleAdd = () => {
    setEditingZone(null);
    setFormData({
      code: "",
      name: "",
      propertyId: 1,
      propertyName: "Vinhomes Grand Park",
      type: "zone",
      totalArea: 0,
      description: "",
      status: "active",
    });
    setShowModal(true);
  };

  const handleEdit = (zone: Zone) => {
    setEditingZone(zone);
    setFormData({
      code: zone.code,
      name: zone.name,
      propertyId: zone.propertyId,
      propertyName: zone.propertyName,
      type: zone.type,
      totalArea: zone.totalArea,
      description: zone.description,
      status: zone.status,
    });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this zone/area/section?")) {
      setZones(zones.filter((z) => z.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingZone) {
      setZones(
        zones.map((z) =>
          z.id === editingZone.id
            ? { ...z, ...formData, totalBuildings: z.totalBuildings, totalUnits: z.totalUnits }
            : z
        )
      );
    } else {
      const newZone: Zone = {
        id: Math.max(...zones.map((z) => z.id)) + 1,
        ...formData,
        totalBuildings: 0,
        totalUnits: 0,
      };
      setZones([...zones, newZone]);
    }
    setShowModal(false);
  };

  const getTypeBadge = (type: Zone["type"]) => {
    const badges = {
      zone: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      area: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
      section: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    };
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${badges[type]}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  const filteredZones = zones.filter((zone) => {
    const matchesSearch = zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         zone.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         zone.propertyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || zone.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalArea = zones.reduce((sum, z) => sum + z.totalArea, 0);
  const totalBuildings = zones.reduce((sum, z) => sum + z.totalBuildings, 0);
  const totalUnits = zones.reduce((sum, z) => sum + z.totalUnits, 0);

  return (
    <div className="p-4 md:p-6">
      <PageBreadCrumb pageTitle="Zone / Area / Section" />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-4">
        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Zones/Areas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{zones.length}</p>
            </div>
            <div className="p-3 bg-brand-50 rounded-lg dark:bg-brand-900/20">
              <svg className="w-6 h-6 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Area</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{(totalArea / 10000).toFixed(1)} ha</p>
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Buildings</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalBuildings}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg dark:bg-green-900/20">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
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
            <div className="p-3 bg-blue-50 rounded-lg dark:bg-blue-900/20">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
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
              placeholder="Search by name, code, or property..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="zone">Zone</option>
              <option value="area">Area</option>
              <option value="section">Section</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow dark:bg-gray-900">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Zones / Areas / Sections</h2>
          <button
            onClick={handleAdd}
            className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600"
          >
            + Add Zone/Area/Section
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Code</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Name</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Property</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Type</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Area (m²)</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Buildings</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Units</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Status</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-800">
              {filteredZones.map((zone) => (
                <tr key={zone.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold text-brand-700 bg-brand-100 rounded dark:bg-brand-900/20 dark:text-brand-400">
                      {zone.code}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{zone.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{zone.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{zone.propertyName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getTypeBadge(zone.type)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{zone.totalArea.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-gray-900 dark:text-white">{zone.totalBuildings}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-gray-900 dark:text-white">{zone.totalUnits}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        zone.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                      }`}
                    >
                      {zone.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(zone)}
                      className="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300 mr-3 inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(zone.id)}
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
        <div className="fixed inset-0 z-999999 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-xl mx-4">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingZone ? "Edit Zone/Area/Section" : "Add Zone/Area/Section"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Code *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as Zone["type"] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    required
                  >
                    <option value="zone">Zone</option>
                    <option value="area">Area</option>
                    <option value="section">Section</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Property *</label>
                  <select
                    value={formData.propertyId}
                    onChange={(e) => {
                      const id = parseInt(e.target.value);
                      const property = properties.find((p) => p.id === id);
                      setFormData({ ...formData, propertyId: id, propertyName: property?.name || "" });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    required
                  >
                    {properties.map((prop) => (
                      <option key={prop.id} value={prop.id}>{prop.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Total Area (m²) *</label>
                  <input
                    type="number"
                    value={formData.totalArea}
                    onChange={(e) => setFormData({ ...formData, totalArea: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Zone["status"] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    required
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    rows={3}
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
                  {editingZone ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZoneAreaSectionPage;
