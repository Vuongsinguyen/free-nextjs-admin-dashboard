"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";

interface Floor {
  id: string;
  name: string;
  floor_number: number;
  description: string | null;
  total_units: number;
  status: "active" | "inactive" | "maintenance";
  building_id: string;
  building_name?: string;
  building_code?: string;
  zone_name?: string;
  property_name?: string;
  occupied_units?: number;
}

interface Building {
  id: string;
  name: string;
  code: string;
  zone_name?: string;
  property_name?: string;
}

const FloorPage = () => {
  const [floors, setFloors] = useState<Floor[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingFloor, setEditingFloor] = useState<Floor | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalUnitsAll, setTotalUnitsAll] = useState(0);
  const [totalOccupiedAll, setTotalOccupiedAll] = useState(0);
  const itemsPerPage = 20;

  const [formData, setFormData] = useState({
    name: "",
    floor_number: 1,
    building_id: "",
    description: "",
    total_units: 0,
    status: "active" as Floor["status"],
  });

  useEffect(() => {
    fetchFloors();
    fetchBuildings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const fetchFloors = async () => {
    try {
      setLoading(true);
      
      // Get total count and statistics
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { count } = await (supabase as any)
        .from('floors')
        .select('*', { count: 'exact', head: true });
      
      setTotalCount(count || 0);

      // Get total units and occupied units for all floors (for statistics)
      const { data: allFloorsData } = await supabase
        .from('floors')
        .select('id, total_units');
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const totalUnits = (allFloorsData || []).reduce((sum: number, f: any) => sum + (f.total_units || 0), 0);
      setTotalUnitsAll(totalUnits);

      // Get total occupied units
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { count: occupiedCount } = await (supabase as any)
        .from('property_units')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'occupied');
      
      setTotalOccupiedAll(occupiedCount || 0);

      // Get paginated data
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      const { data: floorsData, error: floorsError } = await supabase
        .from('floors')
        .select('*, building:buildings(name, code, zone:zones(name, property:properties(name)))')
        .order('building_id')
        .order('floor_number')
        .range(from, to);

      if (floorsError) throw floorsError;

      const floorsWithOccupancy = await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (floorsData || []).map(async (floor: any) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { count } = await (supabase as any)
            .from('property_units')
            .select('*', { count: 'exact', head: true })
            .eq('floor_id', floor.id)
            .eq('status', 'occupied');

          const building = floor.building;
          
          return {
            ...floor,
            building_name: building?.name,
            building_code: building?.code,
            zone_name: building?.zone?.name,
            property_name: building?.zone?.property?.name,
            occupied_units: count || 0,
          };
        })
      );

      setFloors(floorsWithOccupancy);
    } catch (error) {
      console.error('Error fetching floors:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBuildings = async () => {
    try {
      const { data, error } = await supabase
        .from('buildings')
        .select('id, name, code, zone:zones(name, property:properties(name))')
        .order('name');

      if (error) throw error;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const buildingsWithInfo = (data || []).map((b: any) => ({
        id: b.id,
        name: b.name,
        code: b.code,
        zone_name: b.zone?.name,
        property_name: b.zone?.property?.name,
      }));

      setBuildings(buildingsWithInfo);
      
      if (buildingsWithInfo.length > 0 && !formData.building_id) {
        setFormData(prev => ({ ...prev, building_id: buildingsWithInfo[0].id }));
      }
    } catch (error) {
      console.error('Error fetching buildings:', error);
    }
  };

  const handleSeedFloors = async () => {
    setSeeding(true);
    try {
      const response = await fetch('/api/floors/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Successfully seeded ${data.count} floors`);
        fetchFloors();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSeeding(false);
    }
  };

  const handleAdd = () => {
    setEditingFloor(null);
    setFormData({
      name: "",
      floor_number: 1,
      building_id: buildings.length > 0 ? buildings[0].id : "",
      description: "",
      total_units: 0,
      status: "active",
    });
    setShowModal(true);
  };

  const handleEdit = (floor: Floor) => {
    setEditingFloor(floor);
    setFormData({
      name: floor.name,
      floor_number: floor.floor_number,
      building_id: floor.building_id,
      description: floor.description || "",
      total_units: floor.total_units,
      status: floor.status,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this floor?")) return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('floors')
        .delete()
        .eq('id', id);

      if (error) throw error;
      alert('Floor deleted successfully');
      fetchFloors();
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingFloor) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
          .from('floors')
          .update({
            name: formData.name,
            floor_number: formData.floor_number,
            building_id: formData.building_id,
            description: formData.description || null,
            total_units: formData.total_units,
            status: formData.status,
          })
          .eq('id', editingFloor.id);

        if (error) throw error;
        alert('Floor updated successfully');
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
          .from('floors')
          .insert([{
            name: formData.name,
            floor_number: formData.floor_number,
            building_id: formData.building_id,
            description: formData.description || null,
            total_units: formData.total_units,
            status: formData.status,
          }]);

        if (error) throw error;
        alert('Floor created successfully');
      }

      setShowModal(false);
      setEditingFloor(null);
      setFormData({
        name: "",
        floor_number: 1,
        building_id: buildings.length > 0 ? buildings[0].id : "",
        description: "",
        total_units: 0,
        status: "active",
      });
      fetchFloors();
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const filteredFloors = floors.filter((floor) =>
    (floor.building_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    floor.floor_number.toString().includes(searchTerm) ||
    (floor.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const occupancyRate = totalUnitsAll > 0 ? ((totalOccupiedAll / totalUnitsAll) * 100).toFixed(1) : "0";

  return (
    <div className="p-4 md:p-6">
      <PageBreadCrumb pageTitle="Floor" />
      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-4">
        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Floors</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalCount}</p>
            </div>
          </div>
        </div>
        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Units</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalUnitsAll}</p>
            </div>
          </div>
        </div>
        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Occupied</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalOccupiedAll}</p>
            </div>
          </div>
        </div>
        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Occupancy Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{occupancyRate}%</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow dark:bg-gray-900 mb-6 p-4">
        <input
          type="text"
          placeholder="Search by building name or floor number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
      </div>
      <div className="bg-white rounded-lg shadow dark:bg-gray-900">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Floors</h2>
          <div className="flex gap-2">
            {floors.length === 0 && !loading && (
              <button
                onClick={handleSeedFloors}
                disabled={seeding}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
              >
                {seeding ? 'Seeding...' : 'Seed Sample Data'}
              </button>
            )}
            <button
              onClick={handleAdd}
              className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600"
            >
              + Add Floor
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Floor</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Building</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Zone</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Property</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Total Units</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Occupied</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Occupancy</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Status</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">Loading...</td>
                </tr>
              ) : filteredFloors.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">No floors found</td>
                </tr>
              ) : (
                filteredFloors.map((floor) => {
                  const rate = floor.total_units > 0 ? ((floor.occupied_units || 0) / floor.total_units * 100).toFixed(0) : 0;
                  return (
                    <tr key={floor.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{floor.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Floor {floor.floor_number}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{floor.building_name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{floor.building_code}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">{floor.zone_name || '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400">{floor.property_name || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm text-gray-900 dark:text-white">{floor.total_units}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm text-gray-900 dark:text-white">{floor.occupied_units || 0}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 dark:bg-gray-700 mr-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${rate}%` }}></div>
                          </div>
                          <span className="text-xs text-gray-600 dark:text-gray-400">{rate}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          floor.status === "active" ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" :
                          floor.status === "maintenance" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400" :
                          "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                        }`}>
                          {floor.status.charAt(0).toUpperCase() + floor.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                        <button onClick={() => handleEdit(floor)} className="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300 mr-3">Edit</button>
                        <button onClick={() => handleDelete(floor.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">Delete</button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalCount > itemsPerPage && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <span>
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} results
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                Previous
              </button>
              {Array.from({ length: Math.ceil(totalCount / itemsPerPage) }, (_, i) => i + 1)
                .filter(page => {
                  const totalPages = Math.ceil(totalCount / itemsPerPage);
                  return page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1);
                })
                .map((page, index, array) => (
                  <React.Fragment key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">...</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 text-sm font-medium rounded-lg ${
                        currentPage === page
                          ? 'bg-brand-500 text-white'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(Math.ceil(totalCount / itemsPerPage), prev + 1))}
                disabled={currentPage === Math.ceil(totalCount / itemsPerPage)}
                className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      {showModal && (
        <div className="fixed inset-0 z-999999 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{editingFloor ? "Edit Floor" : "Add Floor"}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Building *</label>
                  <select
                    value={formData.building_id}
                    onChange={(e) => setFormData({ ...formData, building_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    required
                  >
                    {buildings.map((building) => (
                      <option key={building.id} value={building.id}>{building.name} ({building.zone_name})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Floor Number *</label>
                  <input
                    type="number"
                    value={formData.floor_number}
                    onChange={(e) => setFormData({ ...formData, floor_number: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    required
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    required
                    placeholder="e.g., Floor 1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Total Units</label>
                  <input
                    type="number"
                    value={formData.total_units}
                    onChange={(e) => setFormData({ ...formData, total_units: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    min="0"
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
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600">{editingFloor ? "Update" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloorPage;
