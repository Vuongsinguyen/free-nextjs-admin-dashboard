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
  { id: 2, invoiceNumber: "INV-2025-002", apartment: "A102", residentName: "Trần Thị B", amount: 4500000, status: "unpaid", dueDate: "2025-02-15", notes: "", waterFee: 750000, managementFee: 2800000, urbanManagementFee: 450000, parkingFee: 350000, latePaymentPenalty: 0, otherFees: 150000, area: 78 },
  { id: 3, invoiceNumber: "INV-2025-003", apartment: "A103", residentName: "Lê Văn C", amount: 6000000, status: "overdue", dueDate: "2024-12-15", notes: "Quá hạn thanh toán", waterFee: 950000, managementFee: 3500000, urbanManagementFee: 600000, parkingFee: 500000, latePaymentPenalty: 450000, otherFees: 0, area: 92 },
  { id: 4, invoiceNumber: "INV-2025-004", apartment: "B201", residentName: "Phạm Thị D", amount: 5500000, status: "paid", dueDate: "2025-01-20", notes: "", waterFee: 850000, managementFee: 3200000, urbanManagementFee: 550000, parkingFee: 450000, latePaymentPenalty: 0, otherFees: 250000, area: 88 },
  { id: 5, invoiceNumber: "INV-2025-005", apartment: "B202", residentName: "Hoàng Văn E", amount: 4800000, status: "unpaid", dueDate: "2025-02-20", notes: "", waterFee: 700000, managementFee: 2600000, urbanManagementFee: 480000, parkingFee: 380000, latePaymentPenalty: 0, otherFees: 200000, area: 75 },
  { id: 6, invoiceNumber: "INV-2025-006", apartment: "B203", residentName: "Vũ Thị F", amount: 5200000, status: "paid", dueDate: "2025-01-25", notes: "Đã chuyển khoản", waterFee: 780000, managementFee: 2900000, urbanManagementFee: 520000, parkingFee: 420000, latePaymentPenalty: 0, otherFees: 0, area: 82 },
  { id: 7, invoiceNumber: "INV-2025-007", apartment: "C301", residentName: "Đặng Văn G", amount: 7000000, status: "overdue", dueDate: "2024-11-30", notes: "Cần liên hệ khẩn", waterFee: 1100000, managementFee: 4000000, urbanManagementFee: 700000, parkingFee: 600000, latePaymentPenalty: 600000, otherFees: 0, area: 105 },
  { id: 8, invoiceNumber: "INV-2025-008", apartment: "C302", residentName: "Bùi Thị H", amount: 4700000, status: "paid", dueDate: "2025-01-10", notes: "", waterFee: 680000, managementFee: 2500000, urbanManagementFee: 470000, parkingFee: 370000, latePaymentPenalty: 0, otherFees: 200000, area: 72 },
  { id: 9, invoiceNumber: "INV-2025-009", apartment: "C303", residentName: "Đinh Văn I", amount: 5300000, status: "unpaid", dueDate: "2025-02-10", notes: "", waterFee: 790000, managementFee: 2950000, urbanManagementFee: 530000, parkingFee: 430000, latePaymentPenalty: 0, otherFees: 0, area: 84 },
  { id: 10, invoiceNumber: "INV-2025-010", apartment: "D401", residentName: "Ngô Thị K", amount: 6500000, status: "paid", dueDate: "2025-01-05", notes: "Thanh toán tiền mặt", waterFee: 1000000, managementFee: 3700000, urbanManagementFee: 650000, parkingFee: 550000, latePaymentPenalty: 0, otherFees: 0, area: 98 },
  { id: 11, invoiceNumber: "INV-2025-011", apartment: "D402", residentName: "Dương Văn L", amount: 4900000, status: "unpaid", dueDate: "2025-02-05", notes: "", waterFee: 720000, managementFee: 2700000, urbanManagementFee: 490000, parkingFee: 390000, latePaymentPenalty: 0, otherFees: 200000, area: 76 },
  { id: 12, invoiceNumber: "INV-2025-012", apartment: "D403", residentName: "Lý Thị M", amount: 5400000, status: "overdue", dueDate: "2024-12-20", notes: "Đã nhắc nhở", waterFee: 820000, managementFee: 3050000, urbanManagementFee: 540000, parkingFee: 440000, latePaymentPenalty: 400000, otherFees: 0, area: 86 },
  { id: 13, invoiceNumber: "INV-2025-013", apartment: "E501", residentName: "Võ Văn N", amount: 5100000, status: "paid", dueDate: "2025-01-18", notes: "", waterFee: 760000, managementFee: 2850000, urbanManagementFee: 510000, parkingFee: 410000, latePaymentPenalty: 0, otherFees: 200000, area: 80 },
  { id: 14, invoiceNumber: "INV-2025-014", apartment: "E502", residentName: "Trương Thị O", amount: 4600000, status: "unpaid", dueDate: "2025-02-18", notes: "", waterFee: 670000, managementFee: 2500000, urbanManagementFee: 460000, parkingFee: 360000, latePaymentPenalty: 0, otherFees: 200000, area: 71 },
  { id: 15, invoiceNumber: "INV-2025-015", apartment: "E503", residentName: "Phan Văn P", amount: 5800000, status: "paid", dueDate: "2025-01-22", notes: "Đã thanh toán online", waterFee: 880000, managementFee: 3300000, urbanManagementFee: 580000, parkingFee: 480000, latePaymentPenalty: 0, otherFees: 200000, area: 90 },
  { id: 16, invoiceNumber: "INV-2025-016", apartment: "F601", residentName: "Mai Thị Q", amount: 6200000, status: "overdue", dueDate: "2024-12-10", notes: "Chưa liên hệ được", waterFee: 950000, managementFee: 3550000, urbanManagementFee: 620000, parkingFee: 520000, latePaymentPenalty: 530000, otherFees: 0, area: 95 },
  { id: 17, invoiceNumber: "INV-2025-017", apartment: "F602", residentName: "Hồ Văn R", amount: 4750000, status: "paid", dueDate: "2025-01-12", notes: "", waterFee: 690000, managementFee: 2580000, urbanManagementFee: 475000, parkingFee: 375000, latePaymentPenalty: 0, otherFees: 200000, area: 73 },
  { id: 18, invoiceNumber: "INV-2025-018", apartment: "F603", residentName: "Tô Thị S", amount: 5250000, status: "unpaid", dueDate: "2025-02-12", notes: "", waterFee: 780000, managementFee: 2920000, urbanManagementFee: 525000, parkingFee: 425000, latePaymentPenalty: 0, otherFees: 200000, area: 83 },
  { id: 19, invoiceNumber: "INV-2025-019", apartment: "G701", residentName: "La Văn T", amount: 5600000, status: "paid", dueDate: "2025-01-28", notes: "Đã xác nhận", waterFee: 840000, managementFee: 3150000, urbanManagementFee: 560000, parkingFee: 460000, latePaymentPenalty: 0, otherFees: 200000, area: 89 },
  { id: 20, invoiceNumber: "INV-2025-020", apartment: "G702", residentName: "Từ Thị U", amount: 4850000, status: "unpaid", dueDate: "2025-02-28", notes: "", waterFee: 710000, managementFee: 2660000, urbanManagementFee: 485000, parkingFee: 385000, latePaymentPenalty: 0, otherFees: 200000, area: 74 },
  { id: 21, invoiceNumber: "INV-2025-021", apartment: "G703", residentName: "Ông Văn V", amount: 5350000, status: "overdue", dueDate: "2024-12-05", notes: "Đã gửi email nhắc nhở", waterFee: 800000, managementFee: 3000000, urbanManagementFee: 535000, parkingFee: 435000, latePaymentPenalty: 430000, otherFees: 0, area: 87 },
  { id: 22, invoiceNumber: "INV-2025-022", apartment: "H801", residentName: "Bà Thị W", amount: 6800000, status: "paid", dueDate: "2025-01-08", notes: "", waterFee: 1050000, managementFee: 3900000, urbanManagementFee: 680000, parkingFee: 580000, latePaymentPenalty: 0, otherFees: 200000, area: 102 },
  { id: 23, invoiceNumber: "INV-2025-023", apartment: "H802", residentName: "Cô Văn X", amount: 4950000, status: "unpaid", dueDate: "2025-02-08", notes: "", waterFee: 730000, managementFee: 2740000, urbanManagementFee: 495000, parkingFee: 395000, latePaymentPenalty: 0, otherFees: 200000, area: 77 },
  { id: 24, invoiceNumber: "INV-2025-024", apartment: "H803", residentName: "Chú Thị Y", amount: 5450000, status: "paid", dueDate: "2025-01-16", notes: "Đã thanh toán qua app", waterFee: 820000, managementFee: 3070000, urbanManagementFee: 545000, parkingFee: 445000, latePaymentPenalty: 0, otherFees: 200000, area: 85 },
  { id: 25, invoiceNumber: "INV-2025-025", apartment: "I901", residentName: "Anh Văn Z", amount: 5700000, status: "overdue", dueDate: "2024-11-25", notes: "Cần gọi điện thoại", waterFee: 860000, managementFee: 3220000, urbanManagementFee: 570000, parkingFee: 470000, latePaymentPenalty: 490000, otherFees: 0, area: 91 },
  { id: 26, invoiceNumber: "INV-2025-026", apartment: "I902", residentName: "Chị Thị AA", amount: 4800000, status: "paid", dueDate: "2025-01-14", notes: "", waterFee: 700000, managementFee: 2630000, urbanManagementFee: 480000, parkingFee: 380000, latePaymentPenalty: 0, otherFees: 200000, area: 74 },
  { id: 27, invoiceNumber: "INV-2025-027", apartment: "I903", residentName: "Em Văn BB", amount: 5150000, status: "unpaid", dueDate: "2025-02-14", notes: "", waterFee: 760000, managementFee: 2850000, urbanManagementFee: 515000, parkingFee: 415000, latePaymentPenalty: 0, otherFees: 200000, area: 81 },
  { id: 28, invoiceNumber: "INV-2025-028", apartment: "J1001", residentName: "Cậu Thị CC", amount: 6300000, status: "paid", dueDate: "2025-01-11", notes: "Đã nhận biên lai", waterFee: 960000, managementFee: 3600000, urbanManagementFee: 630000, parkingFee: 530000, latePaymentPenalty: 0, otherFees: 200000, area: 96 },
  { id: 29, invoiceNumber: "INV-2025-029", apartment: "J1002", residentName: "Dì Văn DD", amount: 4900000, status: "unpaid", dueDate: "2025-02-11", notes: "", waterFee: 720000, managementFee: 2700000, urbanManagementFee: 490000, parkingFee: 390000, latePaymentPenalty: 0, otherFees: 200000, area: 76 },
  { id: 30, invoiceNumber: "INV-2025-030", apartment: "J1003", residentName: "Bác Thị EE", amount: 5500000, status: "overdue", dueDate: "2024-12-01", notes: "Đã gửi thư nhắc nhở", waterFee: 830000, managementFee: 3110000, urbanManagementFee: 550000, parkingFee: 450000, latePaymentPenalty: 460000, otherFees: 0, area: 88 },
];

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>(initialInvoices);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Invoice | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleAdd = () => {
    setEditing({
      id: 0,
      invoiceNumber: "",
      apartment: "",
      residentName: "",
      area: 0,
      waterFee: 0,
      managementFee: 0,
      urbanManagementFee: 0,
      parkingFee: 0,
      latePaymentPenalty: 0,
      otherFees: 0,
      amount: 0,
      status: "unpaid",
      dueDate: new Date().toISOString().slice(0, 10),
      notes: "",
    });
    setShowModal(true);
  };

  const handleEdit = (invoice: Invoice) => {
    setEditing(JSON.parse(JSON.stringify(invoice)) as Invoice);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      setInvoices(prev => prev.filter(inv => inv.id !== id));
    }
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

    // Status filter
    if (filterStatus) {
      result = result.filter(inv => inv.status === filterStatus);
    }

    // Month filter
    if (filterMonth) {
      result = result.filter(inv => inv.dueDate.startsWith(filterMonth));
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

  const handleSave = () => {
    if (!editing) return;

    if (!editing.invoiceNumber.trim() || !editing.apartment.trim() || !editing.residentName.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    // Calculate total amount from fee breakdown
    const totalAmount = editing.waterFee + editing.managementFee + editing.urbanManagementFee + editing.parkingFee + editing.latePaymentPenalty + editing.otherFees;

    if (totalAmount <= 0) {
      alert("Total amount must be greater than 0");
      return;
    }

    const updatedInvoice: Invoice = {
      ...editing,
      amount: totalAmount,
    };

    if (editing.id === 0) {
      const newInvoice: Invoice = {
        ...updatedInvoice,
        id: Math.max(0, ...invoices.map(inv => inv.id)) + 1,
      };
      setInvoices(prev => [...prev, newInvoice]);
    } else {
      setInvoices(prev => prev.map(inv => (inv.id === editing.id ? updatedInvoice : inv)));
    }

    setShowModal(false);
    setEditing(null);
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
          {/* Description removed as requested */}
        </div>
        <button
          onClick={handleAdd}
          className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          + Add Invoice
        </button>
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

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredInvoices.length)} of {filteredInvoices.length} invoices
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
                  <td className="px-6 py-4 text-sm text-red-600 dark:text-red-400">{inv.latePaymentPenalty > 0 ? inv.latePaymentPenalty.toLocaleString() + ' VND' : '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{inv.otherFees > 0 ? inv.otherFees.toLocaleString() + ' VND' : '-'}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">{inv.amount.toLocaleString()} VND</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      inv.status === "paid"
                        ? "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400"
                        : inv.status === "overdue"
                        ? "bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400"
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{inv.dueDate}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(inv)}
                        className="p-1 text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                        title="Edit"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(inv.id)}
                        className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  {editing.id === 0 ? "Add Invoice" : "Edit Invoice"}
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
                    value={editing.invoiceNumber}
                    onChange={(e) => setEditing({ ...editing!, invoiceNumber: e.target.value })}
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
                    value={editing.residentName}
                    onChange={(e) => setEditing({ ...editing!, residentName: e.target.value })}
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
                    value={editing.waterFee}
                    onChange={(e) => setEditing({ ...editing!, waterFee: Number(e.target.value) })}
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
                    value={editing.managementFee}
                    onChange={(e) => setEditing({ ...editing!, managementFee: Number(e.target.value) })}
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
                    value={editing.urbanManagementFee}
                    onChange={(e) => setEditing({ ...editing!, urbanManagementFee: Number(e.target.value) })}
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
                    value={editing.parkingFee}
                    onChange={(e) => setEditing({ ...editing!, parkingFee: Number(e.target.value) })}
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
                    value={editing.latePaymentPenalty}
                    onChange={(e) => setEditing({ ...editing!, latePaymentPenalty: Number(e.target.value) })}
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
                    value={editing.otherFees}
                    onChange={(e) => setEditing({ ...editing!, otherFees: Number(e.target.value) })}
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
                    value={editing.dueDate}
                    onChange={(e) => setEditing({ ...editing!, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={editing.notes}
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
                  {editing.id === 0 ? "Create" : "Update"}
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
