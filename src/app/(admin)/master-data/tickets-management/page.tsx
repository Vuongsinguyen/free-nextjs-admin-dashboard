"use client";

import { useState } from "react";

interface BusTicketType {
  id: number;
  ticketName: string;
  ticketCode: string;
  description: string;
  price: number;
  validity: number; // days
  routes: string[];
  busType: "Express" | "Standard" | "VIP";
  maxUsagePerDay: number;
  availableTimeSlots: string[];
  status: "active" | "inactive";
  discount: number; // percentage
  createdAt: string;
  updatedAt: string;
}

const mockTicketTypes: BusTicketType[] = [
  {
    id: 1,
    ticketName: "Monthly Pass - Express",
    ticketCode: "MP-EXP-001",
    description: "Unlimited express bus rides for 30 days",
    price: 500000,
    validity: 30,
    routes: ["District 1 - District 7", "District 2 - District 9", "Thu Duc - District 1"],
    busType: "Express",
    maxUsagePerDay: 10,
    availableTimeSlots: ["06:00-09:00", "16:00-19:00"],
    status: "active",
    discount: 0,
    createdAt: "2025-10-01",
    updatedAt: "2025-10-15"
  },
  {
    id: 2,
    ticketName: "Weekly Pass - Standard",
    ticketCode: "WP-STD-002",
    description: "Unlimited standard bus rides for 7 days",
    price: 150000,
    validity: 7,
    routes: ["District 3 - Binh Thanh", "District 5 - Tan Binh", "District 10 - Go Vap"],
    busType: "Standard",
    maxUsagePerDay: 8,
    availableTimeSlots: ["05:00-22:00"],
    status: "active",
    discount: 10,
    createdAt: "2025-09-15",
    updatedAt: "2025-10-20"
  },
  {
    id: 3,
    ticketName: "VIP Monthly Pass",
    ticketCode: "MP-VIP-003",
    description: "Premium VIP bus service with luxury amenities for 30 days",
    price: 1200000,
    validity: 30,
    routes: ["All Routes"],
    busType: "VIP",
    maxUsagePerDay: 15,
    availableTimeSlots: ["24/7"],
    status: "active",
    discount: 15,
    createdAt: "2025-09-01",
    updatedAt: "2025-10-25"
  },
  {
    id: 4,
    ticketName: "Single Trip - Express",
    ticketCode: "ST-EXP-004",
    description: "One-way express bus ticket",
    price: 25000,
    validity: 1,
    routes: ["District 1 - District 7", "District 2 - District 9"],
    busType: "Express",
    maxUsagePerDay: 1,
    availableTimeSlots: ["06:00-20:00"],
    status: "active",
    discount: 0,
    createdAt: "2025-08-10",
    updatedAt: "2025-10-10"
  },
  {
    id: 5,
    ticketName: "Student Pass - Standard",
    ticketCode: "SP-STD-005",
    description: "Discounted monthly pass for students",
    price: 200000,
    validity: 30,
    routes: ["All Standard Routes"],
    busType: "Standard",
    maxUsagePerDay: 12,
    availableTimeSlots: ["05:00-23:00"],
    status: "active",
    discount: 40,
    createdAt: "2025-09-05",
    updatedAt: "2025-10-18"
  },
  {
    id: 6,
    ticketName: "Weekend Pass - VIP",
    ticketCode: "WKP-VIP-006",
    description: "VIP access for weekends only",
    price: 400000,
    validity: 8,
    routes: ["Premium Routes"],
    busType: "VIP",
    maxUsagePerDay: 6,
    availableTimeSlots: ["Saturday-Sunday 24/7"],
    status: "inactive",
    discount: 5,
    createdAt: "2025-08-20",
    updatedAt: "2025-10-05"
  },
  {
    id: 7,
    ticketName: "Peak Hour Pass - Express",
    ticketCode: "PHP-EXP-007",
    description: "Express service during rush hours only",
    price: 180000,
    validity: 15,
    routes: ["District 1 - District 7", "Thu Duc - District 1"],
    busType: "Express",
    maxUsagePerDay: 4,
    availableTimeSlots: ["06:00-09:00", "16:30-19:30"],
    status: "active",
    discount: 0,
    createdAt: "2025-09-10",
    updatedAt: "2025-10-22"
  },
  {
    id: 8,
    ticketName: "Off-Peak Pass - Standard",
    ticketCode: "OPP-STD-008",
    description: "Discounted pass for off-peak hours",
    price: 120000,
    validity: 30,
    routes: ["All Standard Routes"],
    busType: "Standard",
    maxUsagePerDay: 6,
    availableTimeSlots: ["10:00-16:00", "20:00-05:00"],
    status: "active",
    discount: 30,
    createdAt: "2025-08-25",
    updatedAt: "2025-10-12"
  }
];

export default function TicketsManagementPage() {
  const [ticketTypes] = useState<BusTicketType[]>(mockTicketTypes);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBusType, setFilterBusType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Filter ticket types
  const filteredTickets = ticketTypes.filter((ticket) => {
    const matchesSearch =
      ticket.ticketName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.ticketCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBusType = filterBusType === "" || ticket.busType === filterBusType;
    const matchesStatus = filterStatus === "" || ticket.status === filterStatus;
    return matchesSearch && matchesBusType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400";
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-500/10 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-500/10 dark:text-gray-400";
    }
  };

  const getBusTypeColor = (busType: string) => {
    switch (busType) {
      case "VIP":
        return "bg-purple-100 text-purple-800 dark:bg-purple-500/10 dark:text-purple-400";
      case "Express":
        return "bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400";
      case "Standard":
        return "bg-gray-100 text-gray-800 dark:bg-gray-500/10 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-500/10 dark:text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-black dark:text-white">
            Bus Tickets Management
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage bus ticket types for mobile app
          </p>
        </div>
        <button className="rounded-lg bg-primary px-6 py-2.5 text-white hover:bg-primary/90">
          + Add New Ticket Type
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-lg border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, code, or description..."
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-black outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
            />
          </div>

          <div>
            <select
              value={filterBusType}
              onChange={(e) => setFilterBusType(e.target.value)}
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
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-black outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b border-stroke bg-gray-2 text-left dark:border-strokedark dark:bg-meta-4">
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Ticket Code
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Name
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Description
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Bus Type
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Price
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Validity
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Max Usage/Day
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Discount
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Status
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="border-b border-stroke dark:border-strokedark hover:bg-gray-2 dark:hover:bg-meta-4"
                  >
                    <td className="px-4 py-4">
                      <p className="text-sm font-mono font-medium text-black dark:text-white">
                        {ticket.ticketCode}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-medium text-black dark:text-white">
                        {ticket.ticketName}
                      </p>
                    </td>
                    <td className="px-4 py-4 max-w-xs">
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {ticket.description}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${getBusTypeColor(ticket.busType)}`}>
                        {ticket.busType}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-medium text-black dark:text-white">
                        {ticket.price.toLocaleString()} VNĐ
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-black dark:text-white">
                        {ticket.validity} {ticket.validity === 1 ? 'day' : 'days'}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-center text-black dark:text-white">
                        {ticket.maxUsagePerDay}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      {ticket.discount > 0 ? (
                        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800 dark:bg-orange-500/10 dark:text-orange-400">
                          {ticket.discount}%
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusColor(
                          ticket.status,
                        )}`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="text-primary hover:text-primary/80"
                          title="View details"
                        >
                          <svg
                            className="h-5 w-5"
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
                          className="text-meta-5 hover:text-meta-5/80"
                          title="Edit"
                        >
                          <svg
                            className="h-5 w-5"
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
                          className="text-meta-1 hover:text-meta-1/80"
                          title="Delete"
                        >
                          <svg
                            className="h-5 w-5"
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
                  <td colSpan={10} className="px-4 py-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      No ticket types found
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
            Showing {filteredTickets.length} ticket types
          </p>
          <div className="flex gap-2">
            <button className="rounded-lg border border-stroke px-4 py-2 text-sm hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4">
              Previous
            </button>
            <button className="rounded-lg bg-primary px-4 py-2 text-sm text-white">
              1
            </button>
            <button className="rounded-lg border border-stroke px-4 py-2 text-sm hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
