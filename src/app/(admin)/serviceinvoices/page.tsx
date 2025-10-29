"use client";

import { useMemo, useState } from "react";

type InvoiceStatus = "Paid" | "Unpaid" | "Overdue";

interface InvoiceItem {
  id: string;
  service: string;
  period: string; // e.g., Sep 2025
  issueDate: string; // ISO date
  dueDate: string; // ISO date
  amount: number; // VND
  status: InvoiceStatus;
}

export default function ServiceInvoicesPage() {
  // Mock current user (for display only)
  const user = {
    name: "Nguyen Van A",
    apartment: "Tower A - 12A-08",
    phone: "+84 912 345 678",
  };

  // Mock invoices of this user
  const [invoices] = useState<InvoiceItem[]>([
    {
      id: "INV-2025-09-001",
      service: "Electricity",
      period: "Sep 2025",
      issueDate: "2025-10-01",
      dueDate: "2025-10-10",
      amount: 1250000,
      status: "Paid",
    },
    {
      id: "INV-2025-09-002",
      service: "Water",
      period: "Sep 2025",
      issueDate: "2025-10-01",
      dueDate: "2025-10-10",
      amount: 230000,
      status: "Paid",
    },
    {
      id: "INV-2025-09-003",
      service: "Management Fee",
      period: "Sep 2025",
      issueDate: "2025-10-01",
      dueDate: "2025-10-10",
      amount: 950000,
      status: "Unpaid",
    },
    {
      id: "INV-2025-08-004",
      service: "Parking",
      period: "Aug 2025",
      issueDate: "2025-09-01",
      dueDate: "2025-09-10",
      amount: 400000,
      status: "Overdue",
    },
  ]);

  const [statusFilter, setStatusFilter] = useState<"all" | InvoiceStatus>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
      const q = search.trim().toLowerCase();
      const matchesSearch = !q ||
        inv.id.toLowerCase().includes(q) ||
        inv.service.toLowerCase().includes(q) ||
        inv.period.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [invoices, search, statusFilter]);

  const totals = useMemo(() => {
    const paid = invoices.filter((i) => i.status === "Paid").reduce((s, i) => s + i.amount, 0);
    const unpaid = invoices.filter((i) => i.status !== "Paid").reduce((s, i) => s + i.amount, 0);
    const all = invoices.reduce((s, i) => s + i.amount, 0);
    return { paid, unpaid, all };
  }, [invoices]);

  const formatVND = (n: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

  const statusBadge = (status: InvoiceStatus) => {
    const map: Record<InvoiceStatus, string> = {
      Paid: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      Unpaid: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      Overdue: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    };
    return (
      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${map[status]}`}>{status}</span>
    );
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Service Invoices</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">User&apos;s monthly utility and service invoices</p>
      </div>

      {/* User Card */}
      <div className="mb-6 bg-white dark:bg-gray-900 rounded-xl shadow p-4 md:p-6 border border-gray-200 dark:border-gray-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Resident</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">{user.name}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{user.apartment} • {user.phone}</div>
          </div>
          <div className="flex gap-3">
            <div className="px-4 py-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800">
              <div className="text-xs text-gray-500 dark:text-gray-400">Paid</div>
              <div className="text-base font-bold text-gray-900 dark:text-white">{formatVND(totals.paid)}</div>
            </div>
            <div className="px-4 py-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800">
              <div className="text-xs text-gray-500 dark:text-gray-400">Unpaid/Overdue</div>
              <div className="text-base font-bold text-gray-900 dark:text-white">{formatVND(totals.unpaid)}</div>
            </div>
            <div className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
              <div className="text-base font-bold text-gray-900 dark:text-white">{formatVND(totals.all)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 bg-white dark:bg-gray-900 rounded-xl shadow p-4 border border-gray-200 dark:border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, service, period..."
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | InvoiceStatus)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Overdue">Overdue</option>
          </select>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            Showing {filtered.length} of {invoices.length} invoices
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-800 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800/60">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Invoice ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Service</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Period</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Issue</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Due</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {filtered.map((inv) => (
              <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                <td className="px-6 py-4 font-mono text-sm text-gray-900 dark:text-white">{inv.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{inv.service}</td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{inv.period}</td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{new Date(inv.issueDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{new Date(inv.dueDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">{formatVND(inv.amount)}</td>
                <td className="px-6 py-4">{statusBadge(inv.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
