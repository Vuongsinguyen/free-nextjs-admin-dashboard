"use client";

import { useState } from "react";

interface BusTicket {
  id: string;
  residentName: string;
  residentId: string;
  date: string;
  time: string;
  busType: string;
  route: string;
  driver: string;
  ticketNumber: string;
  status: "active" | "used" | "cancelled";
}

// Generate 100 mock records
const generateMockBusTickets = (): BusTicket[] => {
  const busTypes = ["Express", "Standard", "VIP"];
  const routes = [
    "District 1 - District 7",
    "District 2 - District 9",
    "District 3 - Binh Thanh",
    "District 5 - Tan Binh",
    "District 10 - Go Vap",
    "Thu Duc - District 1",
    "Phu Nhuan - District 3",
    "District 4 - District 8",
  ];
  const drivers = [
    "John Smith",
    "David Johnson",
    "Michael Brown",
    "James Wilson",
    "Robert Taylor",
    "William Anderson",
    "Richard Thomas",
    "Joseph Martinez",
  ];
  const statuses: Array<"active" | "used" | "cancelled"> = ["active", "used", "cancelled"];
  const firstNames = ["John", "Jane", "Michael", "Sarah", "David", "Emily", "Robert", "Lisa", "James", "Mary"];
  const lastNames = ["Smith", "Johnson", "Brown", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin"];

  const tickets: BusTicket[] = [];
  
  for (let i = 1; i <= 100; i++) {
    const date = new Date(2025, 10, Math.floor(Math.random() * 30) + 1);
    const hour = String(Math.floor(Math.random() * 12) + 7).padStart(2, '0');
    const minute = String(Math.floor(Math.random() * 60)).padStart(2, '0');
    
    tickets.push({
      id: String(i),
      residentName: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      residentId: `R${String(i).padStart(4, '0')}`,
      date: date.toISOString().split('T')[0],
      time: `${hour}:${minute}`,
      busType: busTypes[Math.floor(Math.random() * busTypes.length)],
      route: routes[Math.floor(Math.random() * routes.length)],
      driver: drivers[Math.floor(Math.random() * drivers.length)],
      ticketNumber: `BT${String(i).padStart(4, '0')}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
    });
  }
  
  return tickets.sort((a, b) => b.date.localeCompare(a.date));
};

const BusTicketsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBusType, setFilterBusType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data
  const [data] = useState<BusTicket[]>(generateMockBusTickets());

  // Filter data
  const filteredData = data.filter((ticket) => {
    const matchesSearch =
      ticket.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.route.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBusType = filterBusType === "" || ticket.busType === filterBusType;
    const matchesStatus = filterStatus === "" || ticket.status === filterStatus;
    return matchesSearch && matchesBusType && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400";
      case "used":
        return "bg-gray-100 text-gray-800 dark:bg-gray-500/10 dark:text-gray-400";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-500/10 dark:text-gray-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Active";
      case "used":
        return "Used";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-black dark:text-white">
          Bus Tickets Management
        </h1>
        <button className="rounded-lg bg-primary px-6 py-2.5 text-white hover:bg-primary/90">
          + Add New Ticket
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-lg border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleFilterChange();
              }}
              placeholder="Search by name, ticket number, or route..."
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-black outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
            />
          </div>

          <div>
            <select
              value={filterBusType}
              onChange={(e) => {
                setFilterBusType(e.target.value);
                handleFilterChange();
              }}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-black outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
            >
              <option value="">All Bus Types</option>
              <option value="Express">Express</option>
              <option value="Standard">Standard</option>
              <option value="VIP">VIP</option>
            </select>
          </div>

          <div>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                handleFilterChange();
              }}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-black outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="used">Used</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b border-stroke bg-gray-2 text-left dark:border-strokedark dark:bg-meta-4">
                <th className="px-4 py-4 text-xs font-semibold uppercase text-gray-700 dark:text-gray-300">
                  Ticket #
                </th>
                <th className="px-4 py-4 text-xs font-semibold uppercase text-gray-700 dark:text-gray-300">
                  Resident
                </th>
                <th className="px-4 py-4 text-xs font-semibold uppercase text-gray-700 dark:text-gray-300">
                  Date
                </th>
                <th className="px-4 py-4 text-xs font-semibold uppercase text-gray-700 dark:text-gray-300">
                  Time
                </th>
                <th className="px-4 py-4 text-xs font-semibold uppercase text-gray-700 dark:text-gray-300">
                  Bus Type
                </th>
                <th className="px-4 py-4 text-xs font-semibold uppercase text-gray-700 dark:text-gray-300">
                  Route
                </th>
                <th className="px-4 py-4 text-xs font-semibold uppercase text-gray-700 dark:text-gray-300">
                  Driver
                </th>
                <th className="px-4 py-4 text-xs font-semibold uppercase text-gray-700 dark:text-gray-300">
                  Status
                </th>
                <th className="px-4 py-4 text-xs font-semibold uppercase text-gray-700 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? (
                currentData.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="border-b border-stroke dark:border-strokedark"
                  >
                    <td className="px-4 py-4">
                      <p className="text-sm font-medium text-black dark:text-white">
                        {ticket.ticketNumber}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-sm font-medium text-black dark:text-white">
                          {ticket.residentName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {ticket.residentId}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-black dark:text-white">
                        {new Date(ticket.date).toLocaleDateString("en-US")}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-black dark:text-white">
                        {ticket.time}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-500/10 dark:text-blue-400">
                        {ticket.busType}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-black dark:text-white">
                        {ticket.route}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-black dark:text-white">
                        {ticket.driver}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                          ticket.status,
                        )}`}
                      >
                        {getStatusText(ticket.status)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          title="View details"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                        <button
                          className="p-1 text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                          title="Edit"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          title="Delete"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      No bus tickets found
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} tickets
          </p>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-stroke px-4 py-2 text-sm hover:bg-gray-2 disabled:opacity-50 disabled:cursor-not-allowed dark:border-strokedark dark:hover:bg-meta-4"
            >
              Previous
            </button>
            
            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Show first page, last page, current page, and pages around current
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`rounded-lg px-4 py-2 text-sm ${
                      currentPage === page
                        ? "bg-primary text-white"
                        : "border border-stroke hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                    }`}
                  >
                    {page}
                  </button>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return <span key={page} className="px-2 py-2 text-sm">...</span>;
              }
              return null;
            })}
            
            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-stroke px-4 py-2 text-sm hover:bg-gray-2 disabled:opacity-50 disabled:cursor-not-allowed dark:border-strokedark dark:hover:bg-meta-4"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusTicketsPage;
