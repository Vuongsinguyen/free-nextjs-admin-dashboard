"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Zone {
  id: string;
  code: string;
  name: string;
  property_id: string;
  property_name?: string;
  description: string | null;
  status: "active" | "inactive";
  building_count?: number;
  unit_count?: number;
}

interface Property {
  id: string;
  name: string;
  code: string;
}

const ZoneAreaSectionPage = () => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 20;

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    property_id: "",
    description: "",
    status: "active" as Zone["status"],
  });

  useEffect(() => {
    fetchZones();
    fetchProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const fetchZones = async () => {
    try {
      setLoading(true);
      const { count } = await supabase.from('zones').select('*', { count: 'exact', head: true });
      setTotalCount(count || 0);
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      const { data, error } = await supabase.from('zones').select('*, property:properties(name, code), buildings(id)').order('code').range(from, to);
      if (error) throw error;
      
      // For each zone, get unit counts through buildings
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const zonesWithCounts = await Promise.all((data || []).map(async (z: any) => {
        // Count units through buildings in this zone
        const { count: unitCount } = await supabase
          .from('property_units')
          .select('*', { count: 'exact', head: true })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .in('building_id', z.buildings?.map((b: any) => b.id) || []);
        
        return {
          ...z,
          property_name: z.property?.name,
          building_count: z.buildings?.length || 0,
          unit_count: unitCount || 0,
        };
      }));
      
      setZones(zonesWithCounts);
    } catch (error) {
      console.error('Error fetching zones:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase.from('properties').select('id, name, code').eq('status', 'active').order('name');
      if (error) throw error;
      const properties = (data || []) as Property[];
      setProperties(properties);
      if (properties.length > 0 && !formData.property_id) {
        setFormData(prev => ({ ...prev, property_id: properties[0].id }));
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const handleSeedZones = async () => {
    setSeeding(true);
    try {
      const response = await fetch('/api/zones/seed', { method: 'POST', headers: { 'Content-Type': 'application/json' } });
      const data = await response.json();
      if (response.ok) {
        alert('Successfully seeded ' + data.count + ' zones');
        fetchZones();
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
    setEditingZone(null);
    setFormData({ code: "", name: "", property_id: properties.length > 0 ? properties[0].id : "", description: "", status: "active" });
    setShowModal(true);
  };

  const handleEdit = (zone: Zone) => {
    setEditingZone(zone);
    setFormData({ code: zone.code, name: zone.name, property_id: zone.property_id, description: zone.description || "", status: zone.status });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this zone?")) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any).from('zones').delete().eq('id', id);
      if (error) throw error;
      alert('Zone deleted successfully');
      fetchZones();
    } catch (error) {
      alert('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingZone) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any).from('zones').update({ code: formData.code, name: formData.name, property_id: formData.property_id, description: formData.description || null, status: formData.status }).eq('id', editingZone.id);
        if (error) throw error;
        alert('Zone updated successfully');
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any).from('zones').insert([{ code: formData.code, name: formData.name, property_id: formData.property_id, description: formData.description || null, status: formData.status }]);
        if (error) throw error;
        alert('Zone created successfully');
      }
      setShowModal(false);
      setEditingZone(null);
      setFormData({ code: "", name: "", property_id: properties.length > 0 ? properties[0].id : "", description: "", status: "active" });
      fetchZones();
    } catch (error) {
      alert('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const filteredZones = zones.filter((zone) => zone.name.toLowerCase().includes(searchTerm.toLowerCase()) || zone.code.toLowerCase().includes(searchTerm.toLowerCase()) || (zone.property_name || '').toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Zones / Areas / Sections</h1>
        </div>
        <div className="flex gap-2">
          {zones.length === 0 && !loading && (<button onClick={handleSeedZones} disabled={seeding} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400">{seeding ? 'Seeding...' : 'Seed Sample Data'}</button>)}
          <button onClick={handleAdd} className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">+ Add Zone</button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
        <input type="text" placeholder="Search by zone name, code, or property..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500" />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Code</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Name</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Property</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Buildings</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Units</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Status</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (<tr><td colSpan={7} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">Loading...</td></tr>) : filteredZones.length === 0 ? (<tr><td colSpan={7} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">No zones found</td></tr>) : (filteredZones.map((zone) => (<tr key={zone.id} className="hover:bg-gray-50 dark:hover:bg-gray-700"><td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900 dark:text-white">{zone.code}</div></td><td className="px-6 py-4"><div className="text-sm font-medium text-gray-900 dark:text-white">{zone.name}</div>{zone.description && (<div className="text-xs text-gray-500 dark:text-gray-400">{zone.description}</div>)}</td><td className="px-6 py-4"><div className="text-sm text-gray-500 dark:text-gray-400">{zone.property_name || '-'}</div></td><td className="px-6 py-4 whitespace-nowrap text-center"><div className="text-sm text-gray-900 dark:text-white">{zone.building_count || 0}</div></td><td className="px-6 py-4 whitespace-nowrap text-center"><div className="text-sm text-gray-900 dark:text-white">{zone.unit_count || 0}</div></td><td className="px-6 py-4 whitespace-nowrap"><span className={'px-2 inline-flex text-xs leading-5 font-semibold rounded-full ' + (zone.status === "active" ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400")}>{zone.status.charAt(0).toUpperCase() + zone.status.slice(1)}</span></td><td className="px-6 py-4 text-sm font-medium whitespace-nowrap"><button onClick={() => handleEdit(zone)} className="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300 mr-3">Edit</button><button onClick={() => handleDelete(zone.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">Delete</button></td></tr>)))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalCount > itemsPerPage && (
          <div className="flex items-center justify-between bg-white dark:bg-gray-800 px-6 py-3 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} results
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
              {Array.from({ length: Math.ceil(totalCount / itemsPerPage) }, (_, i) => i + 1).filter(page => { const totalPages = Math.ceil(totalCount / itemsPerPage); return page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1); }).map((page, index, array) => (<React.Fragment key={page}>{index > 0 && array[index - 1] !== page - 1 && (<span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">...</span>)}<button onClick={() => setCurrentPage(page)} className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === page ? 'bg-brand-500 text-white' : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>{page}</button></React.Fragment>))}
              <button onClick={() => setCurrentPage(prev => Math.min(Math.ceil(totalCount / itemsPerPage), prev + 1))} disabled={currentPage === Math.ceil(totalCount / itemsPerPage)} className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
            </div>
          </div>
        )}
      </div>
      {showModal && (<div className="fixed inset-0 z-999999 flex items-center justify-center bg-black bg-opacity-50"><div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-lg mx-4"><div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800"><h3 className="text-lg font-semibold text-gray-900 dark:text-white">{editingZone ? "Edit Zone" : "Add Zone"}</h3><button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-500"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button></div><form onSubmit={handleSubmit} className="p-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Code *</label><input type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white" required placeholder="e.g., Z01" /></div><div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name *</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white" required placeholder="e.g., The Rainbow" /></div><div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Property *</label><select value={formData.property_id} onChange={(e) => setFormData({ ...formData, property_id: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white" required>{properties.map((prop) => (<option key={prop.id} value={prop.id}>{prop.name} ({prop.code})</option>))}</select></div><div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status *</label><select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as Zone["status"] })} className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white" required><option value="active">Active</option><option value="inactive">Inactive</option></select></div><div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label><textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white" placeholder="Zone description..." /></div></div><div className="flex justify-end gap-3 mt-6"><button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300">Cancel</button><button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600">{editingZone ? "Update" : "Create"}</button></div></form></div></div>)}
    </div>
  );
};

export default ZoneAreaSectionPage;
