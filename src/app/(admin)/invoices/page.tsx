"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Invoice {
  id: string;
  invoice_number: string;
  apartment: string;
  resident_name: string;
  amount: number;
  status: "paid" | "unpaid" | "overdue";
  due_date: string;
  notes?: string;
  // Fee breakdowns
  water_fee: number;
  management_fee: number;
  urban_management_fee: number;
  parking_fee: number;
  late_payment_penalty: number;
  other_fees: number;
  area: number; // m2
  created_at?: string;
  updated_at?: string;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Invoice | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const itemsPerPage = 10;

  // Fetch invoices from database
  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('due_date', { ascending: false });
      
      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  // Seed sample data
  const handleSeed = async () => {
    try {
      setSeeding(true);
      const response = await fetch('/api/invoices/seed', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to seed data');
      }
      
      await fetchInvoices();
    } catch (error) {
      console.error('Error seeding data:', error);
      alert('Failed to seed data. Please try again.');
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleAdd = () => {
    setEditing({
      id: "",
      invoice_number: "",
      apartment: "",
      resident_name: "",
      area: 0,
      water_fee: 0,
      management_fee: 0,
      urban_management_fee: 0,
      parking_fee: 0,
      late_payment_penalty: 0,
      other_fees: 0,
      amount: 0,
      status: "unpaid",
      due_date: new Date().toISOString().slice(0, 10),
      notes: "",
    });
    setShowModal(true);
  };

  const handleEdit = (invoice: Invoice) => {
    setEditing(JSON.parse(JSON.stringify(invoice)) as Invoice);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      try {
        const { error } = await supabase
          .from('invoices')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        await fetchInvoices();
      } catch (error) {
        console.error('Error deleting invoice:', error);
        alert('Failed to delete invoice. Please try again.');
      }
    }
  };

  // Filter effect
  useEffect(() => {
    let result = [...invoices];

    // Search filter
    if (searchTerm) {
      result = result.filter(inv =>
        inv.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.resident_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus) {
      result = result.filter(inv => inv.status === filterStatus);
    }

    // Month filter
    if (filterMonth) {
      result = result.filter(inv => inv.due_date.startsWith(filterMonth));
    }

    setFilteredInvoices(result);
    setCurrentPage(1);
  }, [invoices, searchTerm, filterStatus, filterMonth]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInvoices = filteredInvoices.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSave = async () => {
    if (!editing) return;

    if (!editing.invoice_number.trim() || !editing.apartment.trim() || !editing.resident_name.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    // Calculate total amount from fee breakdown
    const totalAmount = editing.water_fee + editing.management_fee + editing.urban_management_fee + editing.parking_fee + editing.late_payment_penalty + editing.other_fees;

    if (totalAmount <= 0) {
      alert("Total amount must be greater than 0");
      return;
    }

    const invoiceData = {
      invoice_number: editing.invoice_number,
      apartment: editing.apartment,
      resident_name: editing.resident_name,
      amount: totalAmount,
      status: editing.status,
      due_date: editing.due_date,
      notes: editing.notes || "",
      water_fee: editing.water_fee,
      management_fee: editing.management_fee,
      urban_management_fee: editing.urban_management_fee,
      parking_fee: editing.parking_fee,
      late_payment_penalty: editing.late_payment_penalty,
      other_fees: editing.other_fees,
      area: editing.area,
    };

    try {
      if (!editing.id) {
        // @ts-expect-error - Supabase types not yet generated for invoices table
        const { error } = await supabase.from('invoices').insert([invoiceData]);
        
        if (error) throw error;
      } else {
        // @ts-expect-error - Supabase types not yet generated for invoices table
        const { error } = await supabase.from('invoices').update(invoiceData).eq('id', editing.id);
        
        if (error) throw error;
      }

      await fetchInvoices();
      setShowModal(false);
      setEditing(null);
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Failed to save invoice. Please try again.');
    }
  };

  // Calculate statistics
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidAmount = invoices.filter(inv => inv.status === "paid").reduce((sum, inv) => sum + inv.amount, 0);
  const unpaidAmount = invoices.filter(inv => inv.status === "unpaid").reduce((sum, inv) => sum + inv.amount, 0);
  const overdueAmount = invoices.filter(inv => inv.status === "overdue").reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Service Fee Invoices</h1>
        </div>
        <div className="flex items-center gap-3">
          {invoices.length === 0 && !loading && (
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {seeding ? "Seeding..." : "Seed Sample Data"}
            </button>
          )}
          <button
            onClick={handleAdd}
            className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            + Add Invoice
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Invoices</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{invoices.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{totalAmount.toLocaleString()} VND</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Paid</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{paidAmount.toLocaleString()} VND</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Unpaid</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{(unpaidAmount + overdueAmount).toLocaleString()} VND</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search invoice or resident..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
            />
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
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          {/* Month Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Month
            </label>
            <input
              type="month"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Invoice Number</th>
                <th className="px-6 py-4">Apartment</th>
                <th className="px-6 py-4">Resident</th>
                <th className="px-6 py-4">Area (m²)</th>
                <th className="px-6 py-4">Water Fee</th>
                <th className="px-6 py-4">Management Fee</th>
                <th className="px-6 py-4">Urban Mgmt</th>
                <th className="px-6 py-4">Parking Fee</th>
                <th className="px-6 py-4">Late Penalty</th>
                <th className="px-6 py-4">Other Fees</th>
                <th className="px-6 py-4">Total Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={15} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    Loading invoices...
                  </td>
                </tr>
              ) : currentInvoices.length === 0 ? (
                <tr>
                  <td colSpan={15} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No invoices found
                  </td>
                </tr>
              ) : (
                currentInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{inv.id.substring(0, 8)}</td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-900 dark:text-white">{inv.invoice_number}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{inv.apartment}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{inv.resident_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{inv.area}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{inv.water_fee.toLocaleString()} VND</td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{inv.management_fee.toLocaleString()} VND</td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{inv.urban_management_fee.toLocaleString()} VND</td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{inv.parking_fee.toLocaleString()} VND</td>
                    <td className="px-6 py-4 text-sm text-red-600 dark:text-red-400">{inv.late_payment_penalty > 0 ? inv.late_payment_penalty.toLocaleString() + ' VND' : '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{inv.other_fees > 0 ? inv.other_fees.toLocaleString() + ' VND' : '-'}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">{inv.amount.toLocaleString()} VND</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        inv.status === "paid"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                          : inv.status === "overdue"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{inv.due_date}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(inv)}
                          className="p-1.5 rounded text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20"
                          title="Edit"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(inv.id)}
                          className="p-1.5 rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          title="Delete"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
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
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1 text-sm font-medium rounded-lg ${
                            currentPage === page
                              ? "bg-brand-600 text-white"
                              : "text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <span key={page} className="px-2 text-gray-500">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
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

      {/* Modal */}
      {showModal && editing && (
        <div className="fixed inset-0 bg-blackO flex items-center justify-center p-4 z-999999">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {!editing.id ? "Add Invoice" : "Edit Invoice"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Invoice Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editing.invoice_number}
                    onChange={(e) => setEditing({ ...editing!, invoice_number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Apartment <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editing.apartment}
                    onChange={(e) => setEditing({ ...editing!, apartment: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Resident Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editing.resident_name}
                    onChange={(e) => setEditing({ ...editing!, resident_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Area (m²) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editing.area}
                    onChange={(e) => setEditing({ ...editing!, area: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Water Fee (VND)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editing.water_fee}
                    onChange={(e) => setEditing({ ...editing!, water_fee: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Management Fee (VND)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editing.management_fee}
                    onChange={(e) => setEditing({ ...editing!, management_fee: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Urban Management Fee (VND)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editing.urban_management_fee}
                    onChange={(e) => setEditing({ ...editing!, urban_management_fee: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Parking Fee (VND)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editing.parking_fee}
                    onChange={(e) => setEditing({ ...editing!, parking_fee: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Late Payment Penalty (VND)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editing.late_payment_penalty}
                    onChange={(e) => setEditing({ ...editing!, late_payment_penalty: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Other Fees (VND)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editing.other_fees}
                    onChange={(e) => setEditing({ ...editing!, other_fees: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={editing.status}
                    onChange={(e) => setEditing({ ...editing!, status: e.target.value as Invoice["status"] })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={editing.due_date}
                    onChange={(e) => setEditing({ ...editing!, due_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={editing.notes || ""}
                    onChange={(e) => setEditing({ ...editing!, notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                >
                  {!editing.id ? "Create" : "Update"}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
