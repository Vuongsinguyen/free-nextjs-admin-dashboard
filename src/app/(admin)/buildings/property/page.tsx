"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";

interface Property {
  id: string;
  code: string;
  name: string;
  description: string | null;
  address: string | null;
  province: string | null;
  district: string | null;
  ward: string | null;
  total_area: number | null;
  status: "active" | "inactive" | "planned" | "under_construction";
  zone_count?: number;
  building_count?: number;
  unit_count?: number;
}

const PropertyPage = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 20;

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    address: "",
    province: "",
    district: "",
    ward: "",
    total_area: 0,
    status: "active" as Property["status"],
  });

  useEffect(() => {
    fetchProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      
      // Get total count
      const { count } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true });
      setTotalCount(count || 0);

      // Get paginated data with zone counts only (buildings are under zones)
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          zones(id)
        `)
        .order('code')
        .range(from, to);

      if (error) throw error;

      // For each property, get building and unit counts through zones
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const propertiesWithCounts = await Promise.all((data || []).map(async (p: any) => {
        // Count buildings through zones
        const { count: buildingCount } = await supabase
          .from('buildings')
          .select('*', { count: 'exact', head: true })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .in('zone_id', p.zones?.map((z: any) => z.id) || []);
        
        // Count units directly
        const { count: unitCount } = await supabase
          .from('property_units')
          .select('*', { count: 'exact', head: true })
          .eq('property_id', p.id);
        
        return {
          ...p,
          zone_count: p.zones?.length || 0,
          building_count: buildingCount || 0,
          unit_count: unitCount || 0,
        };
      }));
      
      setProperties(propertiesWithCounts);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedProperties = async () => {
    setSeeding(true);
    try {
      const response = await fetch('/api/properties/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      
      if (response.ok) {
        alert('Successfully seeded ' + data.count + ' properties');
        fetchProperties();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      alert('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setSeeding(false);
    }
  };

  const handleAdd = () => {
    setEditingProperty(null);
    setFormData({
      code: "",
      name: "",
      description: "",
      address: "",
      province: "",
      district: "",
      ward: "",
      total_area: 0,
      status: "active",
    });
    setShowModal(true);
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setFormData({
      code: property.code,
      name: property.name,
      description: property.description || "",
      address: property.address || "",
      province: property.province || "",
      district: property.district || "",
      ward: property.ward || "",
      total_area: property.total_area || 0,
      status: property.status,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;
    
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any).from('properties').delete().eq('id', id);
      if (error) throw error;
      alert('Property deleted successfully');
      fetchProperties();
    } catch (error) {
      alert('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingProperty) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
          .from('properties')
          .update({
            code: formData.code,
            name: formData.name,
            description: formData.description || null,
            address: formData.address || null,
            province: formData.province || null,
            district: formData.district || null,
            ward: formData.ward || null,
            total_area: formData.total_area || null,
            status: formData.status,
          })
          .eq('id', editingProperty.id);
        
        if (error) throw error;
        alert('Property updated successfully');
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
          .from('properties')
          .insert([{
            code: formData.code,
            name: formData.name,
            description: formData.description || null,
            address: formData.address || null,
            province: formData.province || null,
            district: formData.district || null,
            ward: formData.ward || null,
            total_area: formData.total_area || null,
            status: formData.status,
          }]);
        
        if (error) throw error;
        alert('Property created successfully');
      }
      
      setShowModal(false);
      setEditingProperty(null);
      setFormData({
        code: "",
        name: "",
        description: "",
        address: "",
        province: "",
        district: "",
        ward: "",
        total_area: 0,
        status: "active",
      });
      fetchProperties();
    } catch (error) {
      alert('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const filteredProperties = properties.filter((property) =>
    property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (property.province || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: Property["status"]) => {
    const badges = {
      active: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      inactive: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      planned: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      under_construction: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    };
    return badges[status];
  };

  return (
    <div className="p-4 md:p-6">
      <PageBreadCrumb pageTitle="Property / Project" />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-4">
        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-900">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Properties</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalCount}</p>
          </div>
        </div>
        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-900">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {properties.filter(p => p.status === 'active').length}
            </p>
          </div>
        </div>
        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-900">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Zones</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {properties.reduce((sum, p) => sum + (p.zone_count || 0), 0)}
            </p>
          </div>
        </div>
        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-900">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Buildings</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {properties.reduce((sum, p) => sum + (p.building_count || 0), 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow dark:bg-gray-900 mb-6 p-4">
        <input
          type="text"
          placeholder="Search by property name, code, or province..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-lg shadow dark:bg-gray-900">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Properties / Projects
          </h2>
          <div className="flex gap-2">
            {properties.length === 0 && !loading && (
              <button
                onClick={handleSeedProperties}
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
              + Add Property
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  Code
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  Name
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  Location
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  Area (ha)
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  Zones
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  Buildings
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : filteredProperties.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No properties found
                  </td>
                </tr>
              ) : (
                filteredProperties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {property.code}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {property.name}
                      </div>
                      {property.description && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {property.description}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {property.province || '-'}
                      </div>
                      {property.address && (
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          {property.address}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {property.total_area || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {property.zone_count || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {property.building_count || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(property.status)}`}
                      >
                        {property.status.replace('_', ' ').charAt(0).toUpperCase() + property.status.replace('_', ' ').slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(property)}
                        className="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(property.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-999999 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingProperty ? "Edit Property" : "Add Property"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Code *
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    required
                    placeholder="e.g., PRJ001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    required
                    placeholder="e.g., Vinhomes Grand Park"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="Street address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Province
                  </label>
                  <input
                    type="text"
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="e.g., TP.HCM"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    District
                  </label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="e.g., Quận 9"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ward
                  </label>
                  <input
                    type="text"
                    value={formData.ward}
                    onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="e.g., Phường Long Thạnh Mỹ"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Total Area (ha)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.total_area}
                    onChange={(e) => setFormData({ ...formData, total_area: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Property["status"] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    required
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="planned">Planned</option>
                    <option value="under_construction">Under Construction</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="Property description..."
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
                  {editingProperty ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyPage;
