"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface PropertyUnit {
  id: string;
  unit_number: string;
  unit_type: "residential" | "commercial" | "parking" | "storage";
  size_sqm: number;
  bedrooms: number | null;
  bathrooms: number | null;
  status: "available" | "occupied" | "maintenance" | "reserved";
  monthly_rent: number | null;
  floor_id: string;
  floor_name?: string;
  floor_number?: number;
  building_name?: string;
  building_code?: string;
  zone_name?: string;
  property_name?: string;
  resident_name?: string;
}

interface Floor {
  id: string;
  name: string;
  floor_number: number;
  building_name?: string;
  building_code?: string;
}

const PropertyUnitPage = () => {
  const [units, setUnits] = useState<PropertyUnit[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUnit, setEditingUnit] = useState<PropertyUnit | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 20;

  const [formData, setFormData] = useState({
    unit_number: "",
    unit_type: "residential" as PropertyUnit["unit_type"],
    size_sqm: 0,
    bedrooms: 0,
    bathrooms: 0,
    status: "available" as PropertyUnit["status"],
    monthly_rent: 0,
    floor_id: "",
  });

  useEffect(() => {
    fetchUnits();
    fetchFloors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm, statusFilter, typeFilter]);

  const fetchUnits = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('property_units')
        .select(
          `
          *,
          floor:floors(
            name,
            floor_number,
            building:buildings(
              name,
              code,
              zone:zones(
                name,
                property:properties(name)
              )
            )
          )
          `,
          { count: 'exact' }
        );

      // Apply filters
      if (searchTerm) {
        query = query.ilike('unit_number', `%${searchTerm}%`);
      }

      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }

      if (typeFilter) {
        query = query.eq('unit_type', typeFilter);
      }

      // Get total count
      const { count } = await query;
      setTotalCount(count || 0);

      // Get paginated data
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      const { data: unitsData, error: unitsError } = await query
        .order('unit_number')
        .range(from, to);

      if (unitsError) throw unitsError;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const unitsWithInfo = (unitsData || []).map((unit: any) => {
        const floor = unit.floor;
        const building = floor?.building;
        const zone = building?.zone;
        const property = zone?.property;

        return {
          ...unit,
          floor_name: floor?.name,
          floor_number: floor?.floor_number,
          building_name: building?.name,
          building_code: building?.code,
          zone_name: zone?.name,
          property_name: property?.name,
        };
      });

      setUnits(unitsWithInfo);
    } catch (error) {
      console.error('Error fetching property units:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFloors = async () => {
    try {
      const { data, error } = await supabase
        .from('floors')
        .select('id, name, floor_number, building:buildings(name, code)')
        .order('name');

      if (error) throw error;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const floorsWithInfo = (data || []).map((f: any) => ({
        id: f.id,
        name: f.name,
        floor_number: f.floor_number,
        building_name: f.building?.name,
        building_code: f.building?.code,
      }));

      setFloors(floorsWithInfo);

      if (floorsWithInfo.length > 0 && !formData.floor_id) {
        setFormData((prev) => ({ ...prev, floor_id: floorsWithInfo[0].id }));
      }
    } catch (error) {
      console.error('Error fetching floors:', error);
    }
  };

  const handleAdd = () => {
    setEditingUnit(null);
    setFormData({
      unit_number: "",
      unit_type: "residential",
      size_sqm: 0,
      bedrooms: 0,
      bathrooms: 0,
      status: "available",
      monthly_rent: 0,
      floor_id: floors.length > 0 ? floors[0].id : "",
    });
    setShowModal(true);
  };

  const handleEdit = (unit: PropertyUnit) => {
    setEditingUnit(unit);
    setFormData({
      unit_number: unit.unit_number,
      unit_type: unit.unit_type,
      size_sqm: unit.size_sqm,
      bedrooms: unit.bedrooms || 0,
      bathrooms: unit.bathrooms || 0,
      status: unit.status,
      monthly_rent: unit.monthly_rent || 0,
      floor_id: unit.floor_id,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const unitData = {
        ...formData,
        bedrooms: formData.bedrooms || null,
        bathrooms: formData.bathrooms || null,
        monthly_rent: formData.monthly_rent || null,
      };

      if (editingUnit) {
        const { error } = await supabase
          .from('property_units')
          .update(unitData as never)
          .eq('id', editingUnit.id);

        if (error) throw error;
        alert('Property unit updated successfully!');
      } else {
        const { error } = await supabase
          .from('property_units')
          .insert([unitData as never]);

        if (error) throw error;
        alert('Property unit created successfully!');
      }

      setShowModal(false);
      fetchUnits();
    } catch (error) {
      console.error('Error saving property unit:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property unit?')) return;

    try {
      const { error } = await supabase
        .from('property_units')
        .delete()
        .eq('id', id);

      if (error) throw error;

      alert('Property unit deleted successfully!');
      fetchUnits();
    } catch (error) {
      console.error('Error deleting property unit:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      available: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      occupied: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      maintenance: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      reserved: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getTypeColor = (type: string) => {
    const colors = {
      residential: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      commercial: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      parking: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
      storage: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const filteredUnits = units.filter((unit) => {
    const matchesSearch = unit.unit_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || unit.status === statusFilter;
    const matchesType = !typeFilter || unit.unit_type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  if (loading && units.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading property units...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Property Units</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Total: {totalCount} units
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Property Unit
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Unit Number
            </label>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Unit Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Types</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="parking">Parking</option>
              <option value="storage">Storage</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Status</option>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
              <option value="reserved">Reserved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Unit Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Floor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Building
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Size (sqm)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Beds/Baths
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Rent/Month
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUnits.map((unit) => (
                <tr key={unit.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900 dark:text-white">{unit.unit_number}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(unit.unit_type)}`}>
                      {unit.unit_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-300">
                      {unit.floor_name} (Floor {unit.floor_number})
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-300">{unit.building_name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{unit.building_code}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                    {unit.size_sqm} m²
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                    {unit.bedrooms || 0} / {unit.bathrooms || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                    {unit.monthly_rent ? `$${unit.monthly_rent.toLocaleString()}` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(unit.status)}`}>
                      {unit.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(unit)}
                        className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(unit.id)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === page
                    ? 'bg-brand-500 text-white'
                    : 'border border-gray-300 dark:border-gray-600'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {editingUnit ? 'Edit Property Unit' : 'Add Property Unit'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Unit Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.unit_number}
                      onChange={(e) => setFormData({ ...formData, unit_number: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
                      placeholder="e.g., A101"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Floor *
                    </label>
                    <select
                      required
                      value={formData.floor_id}
                      onChange={(e) => setFormData({ ...formData, floor_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
                    >
                      {floors.map((floor) => (
                        <option key={floor.id} value={floor.id}>
                          {floor.name} - {floor.building_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Unit Type *
                    </label>
                    <select
                      required
                      value={formData.unit_type}
                      onChange={(e) => setFormData({ ...formData, unit_type: e.target.value as PropertyUnit["unit_type"] })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="parking">Parking</option>
                      <option value="storage">Storage</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status *
                    </label>
                    <select
                      required
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as PropertyUnit["status"] })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="available">Available</option>
                      <option value="occupied">Occupied</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="reserved">Reserved</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Size (sqm) *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.size_sqm}
                      onChange={(e) => setFormData({ ...formData, size_sqm: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Monthly Rent
                    </label>
                    <input
                      type="number"
                      value={formData.monthly_rent}
                      onChange={(e) => setFormData({ ...formData, monthly_rent: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg"
                  >
                    {editingUnit ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyUnitPage;
