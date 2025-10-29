"use client";

import { useState, useEffect, useMemo } from "react";

interface MaintenanceRequest {
  id: number;
  ticketNumber: string;
  title: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in-progress" | "pending" | "resolved" | "closed";
  location: string;
  reportedBy: string;
  reporterEmail: string;
  reporterPhone: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  estimatedCost?: number;
  actualCost?: number;
  attachments?: number;
}

export default function MaintenancePage() {
  // const { t } = useLocale();
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<MaintenanceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const loadRequests = () => {
      setIsLoading(true);
      setTimeout(() => {
        const mockRequests: MaintenanceRequest[] = [
          {
            id: 1,
            ticketNumber: "MNT-2025-001",
            title: "Air conditioning not working",
            description: "AC unit in room 304 is not cooling properly",
            category: "HVAC",
            priority: "high",
            status: "in-progress",
            location: "Building A - Room 304",
            reportedBy: "Nguyen Van A",
            reporterEmail: "nguyenvana@example.com",
            reporterPhone: "0901234567",
            assignedTo: "Technician - Le Van B",
            createdAt: "2025-10-28T09:30:00Z",
            updatedAt: "2025-10-28T14:20:00Z",
            estimatedCost: 2000000,
          },
          {
            id: 2,
            ticketNumber: "MNT-2025-002",
            title: "Broken elevator",
            description: "Elevator in Building B is stuck on floor 5",
            category: "Elevator",
            priority: "urgent",
            status: "in-progress",
            location: "Building B - Elevator 2",
            reportedBy: "Tran Thi C",
            reporterEmail: "tranthic@example.com",
            reporterPhone: "0912345678",
            assignedTo: "Elevator Team",
            createdAt: "2025-10-29T07:15:00Z",
            updatedAt: "2025-10-29T07:45:00Z",
            estimatedCost: 5000000,
          },
          {
            id: 3,
            ticketNumber: "MNT-2025-003",
            title: "Water leak in bathroom",
            description: "Pipe leaking under sink in apartment 205",
            category: "Plumbing",
            priority: "high",
            status: "resolved",
            location: "Building C - Apt 205",
            reportedBy: "Pham Van D",
            reporterEmail: "phamvand@example.com",
            reporterPhone: "0923456789",
            assignedTo: "Plumber - Hoang Van E",
            createdAt: "2025-10-27T16:20:00Z",
            updatedAt: "2025-10-28T10:30:00Z",
            resolvedAt: "2025-10-28T10:30:00Z",
            estimatedCost: 1500000,
            actualCost: 1200000,
            attachments: 3,
          },
          {
            id: 4,
            ticketNumber: "MNT-2025-004",
            title: "Broken light fixtures",
            description: "Several lights not working in parking lot",
            category: "Electrical",
            priority: "medium",
            status: "open",
            location: "Parking Lot - Level 2",
            reportedBy: "Le Thi F",
            reporterEmail: "lethif@example.com",
            reporterPhone: "0934567890",
            createdAt: "2025-10-29T08:00:00Z",
            updatedAt: "2025-10-29T08:00:00Z",
            estimatedCost: 3000000,
          },
          {
            id: 5,
            ticketNumber: "MNT-2025-005",
            title: "Damaged door lock",
            description: "Main entrance door lock is jammed",
            category: "Security",
            priority: "high",
            status: "pending",
            location: "Building A - Main Entrance",
            reportedBy: "Nguyen Thi G",
            reporterEmail: "nguyenthig@example.com",
            reporterPhone: "0945678901",
            assignedTo: "Security Team",
            createdAt: "2025-10-28T18:30:00Z",
            updatedAt: "2025-10-29T06:00:00Z",
            estimatedCost: 800000,
          },
          {
            id: 6,
            ticketNumber: "MNT-2025-006",
            title: "Clogged drain",
            description: "Kitchen sink drain is completely blocked",
            category: "Plumbing",
            priority: "medium",
            status: "in-progress",
            location: "Building D - Apt 108",
            reportedBy: "Tran Van H",
            reporterEmail: "tranvanh@example.com",
            reporterPhone: "0956789012",
            assignedTo: "Plumber - Pham Van I",
            createdAt: "2025-10-28T12:45:00Z",
            updatedAt: "2025-10-29T08:30:00Z",
            estimatedCost: 500000,
          },
          {
            id: 7,
            ticketNumber: "MNT-2025-007",
            title: "Window glass cracked",
            description: "Large crack in window glass, needs replacement",
            category: "General Repair",
            priority: "medium",
            status: "closed",
            location: "Building B - Room 512",
            reportedBy: "Hoang Thi K",
            reporterEmail: "hoangthik@example.com",
            reporterPhone: "0967890123",
            assignedTo: "Glass Technician",
            createdAt: "2025-10-25T14:00:00Z",
            updatedAt: "2025-10-27T16:00:00Z",
            resolvedAt: "2025-10-27T15:30:00Z",
            estimatedCost: 2500000,
            actualCost: 2300000,
            attachments: 2,
          },
          {
            id: 8,
            ticketNumber: "MNT-2025-008",
            title: "Fire alarm system fault",
            description: "Fire alarm panel showing error code",
            category: "Fire Safety",
            priority: "urgent",
            status: "open",
            location: "Building C - Fire Control Room",
            reportedBy: "Le Van L",
            reporterEmail: "levanl@example.com",
            reporterPhone: "0978901234",
            createdAt: "2025-10-29T09:00:00Z",
            updatedAt: "2025-10-29T09:00:00Z",
            estimatedCost: 4000000,
          },
        ];
        setRequests(mockRequests);
        setIsLoading(false);
      }, 800);
    };

    loadRequests();
  }, []);

  useEffect(() => {
    let result = [...requests];

    if (searchTerm) {
      result = result.filter(
        (req) =>
          req.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.reportedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter) {
      result = result.filter((req) => req.category === categoryFilter);
    }

    if (statusFilter) {
      result = result.filter((req) => req.status === statusFilter);
    }

    if (priorityFilter) {
      result = result.filter((req) => req.priority === priorityFilter);
    }

    setFilteredRequests(result);
    setCurrentPage(1);
  }, [requests, searchTerm, categoryFilter, statusFilter, priorityFilter]);

  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRequests.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRequests, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  const getPriorityBadge = (priority: MaintenanceRequest["priority"]) => {
    const badges = {
      low: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      high: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
      urgent: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    };
    return badges[priority];
  };

  const getStatusBadge = (status: MaintenanceRequest["status"]) => {
    const badges = {
      open: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      "in-progress": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      resolved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      closed: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    };
    return badges[status];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const uniqueCategories = Array.from(new Set(requests.map((r) => r.category)));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading maintenance requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Maintenance Requests
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Track and manage all maintenance and repair requests
          </p>
        </div>
        <button className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          + New Request
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by ticket, title, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Priority
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {requests.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Total Requests</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-purple-600">
            {requests.filter((r) => r.status === "open").length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Open</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-blue-600">
            {requests.filter((r) => r.status === "in-progress").length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">In Progress</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-red-600">
            {requests.filter((r) => r.priority === "urgent").length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Urgent</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-green-600">
            {requests.filter((r) => r.status === "resolved").length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Resolved</div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ticket
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Issue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Reporter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {request.ticketNumber}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDateTime(request.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white max-w-xs">
                      {request.title}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                      {request.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-300">
                      {request.category}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-gray-300">
                      {request.location}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {request.reportedBy}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {request.reporterPhone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-gray-300">
                      {request.assignedTo || "Unassigned"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityBadge(
                        request.priority
                      )}`}
                    >
                      {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                        request.status
                      )}`}
                    >
                      {request.status
                        .split("-")
                        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
                        .join(" ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {request.actualCost ? (
                      <div className="text-sm text-gray-900 dark:text-white">
                        {formatCurrency(request.actualCost)}
                      </div>
                    ) : request.estimatedCost ? (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        ~{formatCurrency(request.estimatedCost)}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400">TBD</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">
                        View
                      </button>
                      <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 px-6 py-3 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Showing {(currentPage - 1) * itemsPerPage + 1} -{" "}
            {Math.min(currentPage * itemsPerPage, filteredRequests.length)} of{" "}
            {filteredRequests.length} results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  currentPage === page
                    ? "bg-brand-500 text-white"
                    : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
