"use client";

import { useState, useEffect } from "react";

interface Invoice {
  id: number;
  invoiceNumber: string;
  apartment: string;
  residentName: string;
  amount: number;
  status: "paid" | "unpaid" | "overdue";
  dueDate: string;
  notes?: string;
  // Fee breakdowns
  waterFee: number;
  managementFee: number;
  urbanManagementFee: number;
  parkingFee: number;
  latePaymentPenalty: number;
  otherFees: number;
  area: number; // m2
}

const initialInvoices: Invoice[] = [
  { id: 1, invoiceNumber: "INV-2025-001", apartment: "A101", residentName: "Nguyễn Văn A", amount: 5000000, status: "paid", dueDate: "2025-01-15", notes: "Đã thanh toán đầy đủ", waterFee: 800000, managementFee: 3000000, urbanManagementFee: 500000, parkingFee: 400000, latePaymentPenalty: 0, otherFees: 300000, area: 85 },
  { id: 4, invoiceNumber: "INV-2025-004", apartment: "B201", residentName: "Phạm Thị D", amount: 5500000, status: "paid", dueDate: "2025-01-20", notes: "", waterFee: 850000, managementFee: 3200000, urbanManagementFee: 550000, parkingFee: 450000, latePaymentPenalty: 0, otherFees: 250000, area: 88 },
  { id: 6, invoiceNumber: "INV-2025-006", apartment: "B203", residentName: "Vũ Thị F", amount: 5200000, status: "paid", dueDate: "2025-01-25", notes: "Đã chuyển khoản", waterFee: 780000, managementFee: 2900000, urbanManagementFee: 520000, parkingFee: 420000, latePaymentPenalty: 0, otherFees: 0, area: 82 },
  { id: 8, invoiceNumber: "INV-2025-008", apartment: "C302", residentName: "Bùi Thị H", amount: 4700000, status: "paid", dueDate: "2025-01-10", notes: "", waterFee: 680000, managementFee: 2500000, urbanManagementFee: 470000, parkingFee: 370000, latePaymentPenalty: 0, otherFees: 200000, area: 72 },
  { id: 10, invoiceNumber: "INV-2025-010", apartment: "D401", residentName: "Ngô Thị K", amount: 6500000, status: "paid", dueDate: "2025-01-05", notes: "Thanh toán tiền mặt", waterFee: 1000000, managementFee: 3700000, urbanManagementFee: 650000, parkingFee: 550000, latePaymentPenalty: 0, otherFees: 0, area: 98 },
  { id: 13, invoiceNumber: "INV-2025-013", apartment: "E501", residentName: "Võ Văn N", amount: 5100000, status: "paid", dueDate: "2025-01-18", notes: "", waterFee: 760000, managementFee: 2850000, urbanManagementFee: 510000, parkingFee: 410000, latePaymentPenalty: 0, otherFees: 200000, area: 80 },
  { id: 15, invoiceNumber: "INV-2025-015", apartment: "E503", residentName: "Phan Văn P", amount: 5800000, status: "paid", dueDate: "2025-01-22", notes: "Đã thanh toán online", waterFee: 880000, managementFee: 3300000, urbanManagementFee: 580000, parkingFee: 480000, latePaymentPenalty: 0, otherFees: 200000, area: 90 },
  { id: 17, invoiceNumber: "INV-2025-017", apartment: "F602", residentName: "Hồ Văn R", amount: 4750000, status: "paid", dueDate: "2025-01-12", notes: "", waterFee: 690000, managementFee: 2580000, urbanManagementFee: 475000, parkingFee: 375000, latePaymentPenalty: 0, otherFees: 200000, area: 73 },
  { id: 19, invoiceNumber: "INV-2025-019", apartment: "G701", residentName: "La Văn T", amount: 5600000, status: "paid", dueDate: "2025-01-28", notes: "Đã xác nhận", waterFee: 840000, managementFee: 3150000, urbanManagementFee: 560000, parkingFee: 460000, latePaymentPenalty: 0, otherFees: 200000, area: 89 },
  { id: 22, invoiceNumber: "INV-2025-022", apartment: "H801", residentName: "Bà Thị W", amount: 6800000, status: "paid", dueDate: "2025-01-08", notes: "", waterFee: 1050000, managementFee: 3900000, urbanManagementFee: 680000, parkingFee: 580000, latePaymentPenalty: 0, otherFees: 200000, area: 102 },
  { id: 24, invoiceNumber: "INV-2025-024", apartment: "H803", residentName: "Chú Thị Y", amount: 5450000, status: "paid", dueDate: "2025-01-16", notes: "Đã thanh toán qua app", waterFee: 820000, managementFee: 3070000, urbanManagementFee: 545000, parkingFee: 445000, latePaymentPenalty: 0, otherFees: 200000, area: 85 },
  { id: 26, invoiceNumber: "INV-2025-026", apartment: "I902", residentName: "Chị Thị AA", amount: 4800000, status: "paid", dueDate: "2025-01-14", notes: "", waterFee: 700000, managementFee: 2630000, urbanManagementFee: 480000, parkingFee: 380000, latePaymentPenalty: 0, otherFees: 200000, area: 74 },
  { id: 28, invoiceNumber: "INV-2025-028", apartment: "J1001", residentName: "Anh Văn Z", amount: 6300000, status: "paid", dueDate: "2025-01-11", notes: "Đã nhận biên lai", waterFee: 960000, managementFee: 3600000, urbanManagementFee: 630000, parkingFee: 530000, latePaymentPenalty: 0, otherFees: 200000, area: 96 },
];

export default function PaymentsPage() {
  const [invoices] = useState<Invoice[]>(initialInvoices);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>(initialInvoices);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleImportExcel = () => {
    // TODO: Implement Excel import functionality
    console.log("Import Excel clicked");
  };

  const handleExportExcel = () => {
    // TODO: Implement Excel export functionality
    console.log("Export Excel clicked");
  };

  // Filter effect
  useEffect(() => {
    let result = [...invoices];

    // Search filter
    if (searchTerm) {
      result = result.filter(inv =>
        inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.residentName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Month filter
    if (filterMonth) {
      result = result.filter(inv => inv.dueDate.startsWith(filterMonth));
    }

    setFilteredInvoices(result);
    setCurrentPage(1);
  }, [invoices, searchTerm, filterMonth]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInvoices = filteredInvoices.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Calculate statistics
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalInvoices = invoices.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payments</h1>
          {/* Description removed as requested */}
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleImportExcel}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Import Excel
          </button>
          <button
            onClick={handleExportExcel}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            Export Excel
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Payments</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{totalInvoices}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{totalAmount.toLocaleString()} VND</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Average Payment</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{totalInvoices > 0 ? (totalAmount / totalInvoices).toLocaleString() : 0} VND</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {/* Month Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Payment Month
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
                <th className="px-6 py-4">Other Fees</th>
                <th className="px-6 py-4">Total Amount</th>
                <th className="px-6 py-4">Payment Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">#{inv.id}</td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-900 dark:text-white">{inv.invoiceNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{inv.apartment}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{inv.residentName}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{inv.area}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{inv.waterFee.toLocaleString()} VND</td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{inv.managementFee.toLocaleString()} VND</td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{inv.urbanManagementFee.toLocaleString()} VND</td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{inv.parkingFee.toLocaleString()} VND</td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{inv.otherFees > 0 ? inv.otherFees.toLocaleString() + ' VND' : '-'}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">{inv.amount.toLocaleString()} VND</td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{inv.dueDate}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400">
                      Paid
                    </span>
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
    </div>
  );
}