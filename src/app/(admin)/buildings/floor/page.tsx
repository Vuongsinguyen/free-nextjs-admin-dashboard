"use client";
import React, { useState } from "react";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";

interface Floor {
  id: number;
  floorNumber: number;
  buildingId: number;
  buildingName: string;
  zoneName: string;
  propertyName: string;
  totalUnits: number;
  occupiedUnits: number;
  floorArea: number; // m2
  status: "active" | "inactive" | "under-renovation";
}

const FloorPage = () => {
  const [floors, setFloors] = useState<Floor[]>([
    {
      id: 1,
      floorNumber: 1,
      buildingId: 1,
      buildingName: "Rainbow Tower 1",
      zoneName: "The Rainbow",
      propertyName: "Vinhomes Grand Park",
      totalUnits: 8,
      occupiedUnits: 6,
      floorArea: 800,
      status: "active",
    },
    {
      id: 2,
      floorNumber: 2,
      buildingId: 1,
      buildingName: "Rainbow Tower 1",
      zoneName: "The Rainbow",
      propertyName: "Vinhomes Grand Park",
      totalUnits: 8,
      occupiedUnits: 8,
      floorArea: 800,
      status: "active",
    },
    {
      id: 3,
      floorNumber: 3,
      buildingId: 1,
      buildingName: "Rainbow Tower 1",
      zoneName: "The Rainbow",
      propertyName: "Vinhomes Grand Park",
      totalUnits: 8,
      occupiedUnits: 7,
      floorArea: 800,
      status: "active",
    },
    {
      id: 4,
      floorNumber: 1,
      buildingId: 2,
      buildingName: "Rainbow Tower 2",
      zoneName: "The Rainbow",
      propertyName: "Vinhomes Grand Park",
      totalUnits: 8,
      occupiedUnits: 5,
      floorArea: 820,
      status: "active",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingFloor, setEditingFloor] = useState<Floor | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    floorNumber: 1,
    buildingId: 1,
    buildingName: "Rainbow Tower 1",
    zoneName: "The Rainbow",
    propertyName: "Vinhomes Grand Park",
    floorArea: 0,
    status: "active" as Floor["status"],
  });

  const buildings = [
    { id: 1, name: "Rainbow Tower 1", zoneName: "The Rainbow", propertyName: "Vinhomes Grand Park" },
    { id: 2, name: "Rainbow Tower 2", zoneName: "The Rainbow", propertyName: "Vinhomes Grand Park" },
    { id: 3, name: "Origami Block A", zoneName: "The Origami", propertyName: "Vinhomes Grand Park" },
    { id: 4, name: "Masteri Tower A", zoneName: "Tower Area A", propertyName: "Masteri Thảo Điền" },
  ];

  const handleAdd = () => {
    setEditingFloor(null);
    setFormData({
      floorNumber: 1,
      buildingId: 1,
      buildingName: "Rainbow Tower 1",
      zoneName: "The Rainbow",
      propertyName: "Vinhomes Grand Park",
      floorArea: 0,
      status: "active",
    });
    setShowModal(true);
  };

  const handleEdit = (floor: Floor) => {
    setEditingFloor(floor);
    setFormData({
      floorNumber: floor.floorNumber,
      buildingId: floor.buildingId,
      buildingName: floor.buildingName,
      zoneName: floor.zoneName,
      propertyName: floor.propertyName,
      floorArea: floor.floorArea,
      status: floor.status,
    });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this floor?")) {
      setFloors(floors.filter((f) => f.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFloor) {
      setFloors(
        floors.map((f) =>
          f.id === editingFloor.id
            ? { ...f, ...formData, totalUnits: f.totalUnits, occupiedUnits: f.occupiedUnits }
            : f
        )
      );
    } else {
      const newFloor: Floor = {
        id: Math.max(...floors.map((f) => f.id)) + 1,
        ...formData,
        totalUnits: 0,
        occupiedUnits: 0,
      };
      setFloors([...floors, newFloor]);
    }
    setShowModal(false);
  };

  const filteredFloors = floors.filter((floor) =>
    floor.buildingName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    floor.floorNumber.toString().includes(searchTerm)
  );

  const totalUnits = floors.reduce((sum, f) => sum + f.totalUnits, 0);
  const totalOccupied = floors.reduce((sum, f) => sum + f.occupiedUnits, 0);
  const occupancyRate = totalUnits > 0 ? ((totalOccupied / totalUnits) * 100).toFixed(1) : 0;

  return (
    <div className="p-4 md:p-6">
      <PageBreadCrumb pageTitle="Floor" />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-4">
        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Floors</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{floors.length}</p>
            </div>
            <div className="p-3 bg-brand-50 rounded-lg dark:bg-brand-900/20">
              <svg className="w-6 h-6 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="p-3 bg-purple-50 rounded-lg dark:bg-purple-900/20">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Occupied</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalOccupied}</p>
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Occupancy Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{occupancyRate}%</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg dark:bg-blue-900/20">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow dark:bg-gray-900 mb-6 p-4">
        <input
          type="text"
          placeholder="Search by building name or floor number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow dark:bg-gray-900">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Floors</h2>
          <button
            onClick={handleAdd}
            className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600"
          >
            + Add Floor
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Floor #</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Building</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Zone</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Property</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Area (m²)</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Total Units</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Occupied</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Occupancy</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Status</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-800">
              {filteredFloors.map((floor) => {
                const rate = floor.totalUnits > 0 ? ((floor.occupiedUnits / floor.totalUnits) * 100).toFixed(0) : 0;
                return (
                  <tr key={floor.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold text-brand-700 bg-brand-100 rounded dark:bg-brand-900/20 dark:text-brand-400">
                        Floor {floor.floorNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{floor.buildingName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{floor.zoneName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{floor.propertyName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{floor.floorArea.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900 dark:text-white">{floor.totalUnits}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900 dark:text-white">{floor.occupiedUnits}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 dark:bg-gray-700 mr-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${rate}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">{rate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          floor.status === "active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                            : floor.status === "under-renovation"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                        }`}
                      >
                        {floor.status.charAt(0).toUpperCase() + floor.status.slice(1).replace("-", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(floor)}
                        className="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300 mr-3 inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(floor.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-999999 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingFloor ? "Edit Floor" : "Add Floor"}
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Floor Number *</label>
                  <input
                    type="number"
                    value={formData.floorNumber}
                    onChange={(e) => setFormData({ ...formData, floorNumber: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    required
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Floor["status"] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    required
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="under-renovation">Under Renovation</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Building *</label>
                  <select
                    value={formData.buildingId}
                    onChange={(e) => {
                      const id = parseInt(e.target.value);
                      const building = buildings.find((b) => b.id === id);
                      setFormData({
                        ...formData,
                        buildingId: id,
                        buildingName: building?.name || "",
                        zoneName: building?.zoneName || "",
                        propertyName: building?.propertyName || "",
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    required
                  >
                    {buildings.map((building) => (
                      <option key={building.id} value={building.id}>
                        {building.name} ({building.zoneName})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Floor Area (m²) *</label>
                  <input
                    type="number"
                    value={formData.floorArea}
                    onChange={(e) => setFormData({ ...formData, floorArea: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    required
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
                  {editingFloor ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloorPage;
