"use client";
import React, { useState } from "react";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";

interface Building {
  id: number;
  code: string;
  name: string;
  zoneId: number;
  zoneName: string;
  propertyName: string;
  type: "tower" | "block" | "building";
  totalFloors: number;
  totalUnits: number;
  elevator: boolean;
  parking: boolean;
  status: "active" | "inactive" | "under-maintenance";
}

const BuildingBlockPage = () => {
  const [buildings, setBuildings] = useState<Building[]>([
    {
      id: 1,
      code: "T01",
      name: "Rainbow Tower 1",
      zoneId: 1,
      zoneName: "The Rainbow",
      propertyName: "Vinhomes Grand Park",
      type: "tower",
      totalFloors: 25,
      totalUnits: 200,
      elevator: true,
      parking: true,
      status: "active",
    },
    {
      id: 2,
      code: "T02",
      name: "Rainbow Tower 2",
      zoneId: 1,
      zoneName: "The Rainbow",
      propertyName: "Vinhomes Grand Park",
      type: "tower",
      totalFloors: 28,
      totalUnits: 220,
      elevator: true,
      parking: true,
      status: "active",
    },
    {
      id: 3,
      code: "B01",
      name: "Origami Block A",
      zoneId: 2,
      zoneName: "The Origami",
      propertyName: "Vinhomes Grand Park",
      type: "block",
      totalFloors: 15,
      totalUnits: 150,
      elevator: true,
      parking: true,
      status: "active",
    },
    {
      id: 4,
      code: "T03",
      name: "Masteri Tower A",
      zoneId: 3,
      zoneName: "Tower Area A",
      propertyName: "Masteri Thảo Điền",
      type: "tower",
      totalFloors: 35,
      totalUnits: 300,
      elevator: true,
      parking: true,
      status: "active",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    zoneId: 1,
    zoneName: "The Rainbow",
    propertyName: "Vinhomes Grand Park",
    type: "tower" as Building["type"],
    totalFloors: 0,
    elevator: true,
    parking: true,
    status: "active" as Building["status"],
  });

  const zones = [
    { id: 1, name: "The Rainbow", propertyName: "Vinhomes Grand Park" },
    { id: 2, name: "The Origami", propertyName: "Vinhomes Grand Park" },
    { id: 3, name: "Tower Area A", propertyName: "Masteri Thảo Điền" },
    { id: 4, name: "Premium Section", propertyName: "Phú Mỹ Hưng Garden Homes" },
  ];

  const handleAdd = () => {
    setEditingBuilding(null);
    setFormData({
      code: "",
      name: "",
      zoneId: 1,
      zoneName: "The Rainbow",
      propertyName: "Vinhomes Grand Park",
      type: "tower",
      totalFloors: 0,
      elevator: true,
      parking: true,
      status: "active",
    });
    setShowModal(true);
  };

  const handleEdit = (building: Building) => {
    setEditingBuilding(building);
    setFormData({
      code: building.code,
      name: building.name,
      zoneId: building.zoneId,
      zoneName: building.zoneName,
      propertyName: building.propertyName,
      type: building.type,
      totalFloors: building.totalFloors,
      elevator: building.elevator,
      parking: building.parking,
      status: building.status,
    });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this building/block?")) {
      setBuildings(buildings.filter((b) => b.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBuilding) {
      setBuildings(
        buildings.map((b) =>
          b.id === editingBuilding.id
            ? { ...b, ...formData, totalUnits: b.totalUnits }
            : b
        )
      );
    } else {
      const newBuilding: Building = {
        id: Math.max(...buildings.map((b) => b.id)) + 1,
        ...formData,
        totalUnits: 0,
      };
      setBuildings([...buildings, newBuilding]);
    }
    setShowModal(false);
  };

  const filteredBuildings = buildings.filter((building) =>
    building.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    building.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalFloors = buildings.reduce((sum, b) => sum + b.totalFloors, 0);
  const totalUnits = buildings.reduce((sum, b) => sum + b.totalUnits, 0);
  const activeCount = buildings.filter((b) => b.status === "active").length;

  return (
    <div className="p-4 md:p-6">
      <PageBreadCrumb pageTitle="Building / Block" />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-4">
        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Buildings</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{buildings.length}</p>
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Floors</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalFloors}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg dark:bg-purple-900/20">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Units</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalUnits}</p>
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeCount}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg dark:bg-blue-900/20">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow dark:bg-gray-900 mb-6 p-4">
        <input
          type="text"
          placeholder="Search by name or code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow dark:bg-gray-900">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Buildings / Blocks</h2>
          <button
            onClick={handleAdd}
            className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600"
          >
            + Add Building/Block
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Code</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Name</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Zone</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Property</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Type</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Floors</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Units</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Facilities</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Status</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-800">
              {filteredBuildings.map((building) => (
                <tr key={building.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold text-brand-700 bg-brand-100 rounded dark:bg-brand-900/20 dark:text-brand-400">
                      {building.code}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{building.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{building.zoneName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{building.propertyName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                      {building.type.charAt(0).toUpperCase() + building.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-gray-900 dark:text-white">{building.totalFloors}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-gray-900 dark:text-white">{building.totalUnits}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-1">
                      {building.elevator && (
                        <span className="px-1.5 py-0.5 text-xs bg-green-100 text-green-800 rounded dark:bg-green-900/20 dark:text-green-400">🛗</span>
                      )}
                      {building.parking && (
                        <span className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 rounded dark:bg-blue-900/20 dark:text-blue-400">🅿️</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        building.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                          : building.status === "under-maintenance"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                      }`}
                    >
                      {building.status.charAt(0).toUpperCase() + building.status.slice(1).replace("-", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(building)}
                      className="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300 mr-3 inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(building.id)}
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
                {editingBuilding ? "Edit Building/Block" : "Add Building/Block"}
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
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as Building["type"] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    required
                  >
                    <option value="tower">Tower</option>
                    <option value="block">Block</option>
                    <option value="building">Building</option>
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Zone/Area/Section *</label>
                  <select
                    value={formData.zoneId}
                    onChange={(e) => {
                      const id = parseInt(e.target.value);
                      const zone = zones.find((z) => z.id === id);
                      setFormData({ ...formData, zoneId: id, zoneName: zone?.name || "", propertyName: zone?.propertyName || "" });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    required
                  >
                    {zones.map((zone) => (
                      <option key={zone.id} value={zone.id}>{zone.name} ({zone.propertyName})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Total Floors *</label>
                  <input
                    type="number"
                    value={formData.totalFloors}
                    onChange={(e) => setFormData({ ...formData, totalFloors: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Building["status"] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    required
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="under-maintenance">Under Maintenance</option>
                  </select>
                </div>

                <div className="md:col-span-2 flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.elevator}
                      onChange={(e) => setFormData({ ...formData, elevator: e.target.checked })}
                      className="w-4 h-4 text-brand-600 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Elevator</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.parking}
                      onChange={(e) => setFormData({ ...formData, parking: e.target.checked })}
                      className="w-4 h-4 text-brand-600 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Parking</span>
                  </label>
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
                  {editingBuilding ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuildingBlockPage;
