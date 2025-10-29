"use client";

import { useState, useEffect, useMemo } from "react";

interface Booking {
  id: number;
  bookingCode: string;
  facilityName: string;
  facilityCategory: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  totalPrice: number;
  status: "confirmed" | "pending" | "cancelled" | "completed" | "in-progress";
  paymentStatus: "paid" | "unpaid" | "refunded";
  attendees: number;
  purpose: string;
  specialRequests?: string;
  createdAt: string;
}

export default function FacilityBookingsPage() {
  // const { t } = useLocale();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Load bookings
  useEffect(() => {
    const loadBookings = () => {
      setIsLoading(true);
      setTimeout(() => {
        const mockBookings: Booking[] = [
          {
            id: 1,
            bookingCode: "BK2025100001",
            facilityName: "Swimming Pool A",
            facilityCategory: "Sports & Recreation",
            userName: "Nguyen Van A",
            userEmail: "nguyenvana@example.com",
            userPhone: "0901234567",
            bookingDate: "2025-11-05",
            startTime: "08:00",
            endTime: "10:00",
            duration: 2,
            totalPrice: 300000,
            status: "confirmed",
            paymentStatus: "paid",
            attendees: 15,
            purpose: "Swimming lessons for kids",
            specialRequests: "Need 2 lifeguards",
            createdAt: "2025-10-25T10:30:00Z",
          },
          {
            id: 2,
            bookingCode: "BK2025100002",
            facilityName: "Conference Hall",
            facilityCategory: "Meeting & Events",
            userName: "Tran Thi B",
            userEmail: "tranthib@example.com",
            userPhone: "0912345678",
            bookingDate: "2025-11-10",
            startTime: "09:00",
            endTime: "17:00",
            duration: 8,
            totalPrice: 8000000,
            status: "confirmed",
            paymentStatus: "paid",
            attendees: 150,
            purpose: "Annual company meeting",
            specialRequests: "Need projector, sound system, and catering service",
            createdAt: "2025-10-26T14:20:00Z",
          },
          {
            id: 3,
            bookingCode: "BK2025100003",
            facilityName: "Meeting Room 101",
            facilityCategory: "Meeting & Events",
            userName: "Le Van C",
            userEmail: "levanc@example.com",
            userPhone: "0923456789",
            bookingDate: "2025-10-30",
            startTime: "14:00",
            endTime: "16:00",
            duration: 2,
            totalPrice: 600000,
            status: "pending",
            paymentStatus: "unpaid",
            attendees: 10,
            purpose: "Client presentation",
            createdAt: "2025-10-28T09:15:00Z",
          },
          {
            id: 4,
            bookingCode: "BK2025100004",
            facilityName: "Tennis Court 1",
            facilityCategory: "Sports & Recreation",
            userName: "Pham Thi D",
            userEmail: "phamthid@example.com",
            userPhone: "0934567890",
            bookingDate: "2025-10-28",
            startTime: "06:00",
            endTime: "08:00",
            duration: 2,
            totalPrice: 200000,
            status: "completed",
            paymentStatus: "paid",
            attendees: 4,
            purpose: "Tennis practice",
            createdAt: "2025-10-20T16:45:00Z",
          },
          {
            id: 5,
            bookingCode: "BK2025100005",
            facilityName: "Gym & Fitness Center",
            facilityCategory: "Sports & Recreation",
            userName: "Hoang Van E",
            userEmail: "hoangvane@example.com",
            userPhone: "0945678901",
            bookingDate: "2025-10-29",
            startTime: "07:00",
            endTime: "08:00",
            duration: 1,
            totalPrice: 200000,
            status: "in-progress",
            paymentStatus: "paid",
            attendees: 1,
            purpose: "Morning workout session",
            createdAt: "2025-10-29T06:30:00Z",
          },
          {
            id: 6,
            bookingCode: "BK2025100006",
            facilityName: "BBQ Area",
            facilityCategory: "Recreation",
            userName: "Nguyen Thi F",
            userEmail: "nguyenthif@example.com",
            userPhone: "0956789012",
            bookingDate: "2025-11-01",
            startTime: "17:00",
            endTime: "21:00",
            duration: 4,
            totalPrice: 1000000,
            status: "cancelled",
            paymentStatus: "refunded",
            attendees: 20,
            purpose: "Team building event",
            specialRequests: "Need BBQ equipment and tables",
            createdAt: "2025-10-15T11:20:00Z",
          },
          {
            id: 7,
            bookingCode: "BK2025100007",
            facilityName: "Yoga Studio",
            facilityCategory: "Wellness",
            userName: "Tran Van G",
            userEmail: "tranvang@example.com",
            userPhone: "0967890123",
            bookingDate: "2025-11-03",
            startTime: "06:00",
            endTime: "07:30",
            duration: 1.5,
            totalPrice: 270000,
            status: "confirmed",
            paymentStatus: "paid",
            attendees: 12,
            purpose: "Morning yoga class",
            createdAt: "2025-10-27T18:00:00Z",
          },
          {
            id: 8,
            bookingCode: "BK2025100008",
            facilityName: "Basketball Court",
            facilityCategory: "Sports & Recreation",
            userName: "Le Thi H",
            userEmail: "lethih@example.com",
            userPhone: "0978901234",
            bookingDate: "2025-11-02",
            startTime: "18:00",
            endTime: "20:00",
            duration: 2,
            totalPrice: 240000,
            status: "confirmed",
            paymentStatus: "paid",
            attendees: 10,
            purpose: "Basketball tournament practice",
            createdAt: "2025-10-26T12:30:00Z",
          },
          {
            id: 9,
            bookingCode: "BK2025100009",
            facilityName: "Library & Study Room",
            facilityCategory: "Education",
            userName: "Pham Van I",
            userEmail: "phamvani@example.com",
            userPhone: "0989012345",
            bookingDate: "2025-10-31",
            startTime: "13:00",
            endTime: "17:00",
            duration: 4,
            totalPrice: 0,
            status: "confirmed",
            paymentStatus: "paid",
            attendees: 5,
            purpose: "Group study session",
            createdAt: "2025-10-28T15:00:00Z",
          },
          {
            id: 10,
            bookingCode: "BK2025100010",
            facilityName: "Kids Playground",
            facilityCategory: "Recreation",
            userName: "Hoang Thi K",
            userEmail: "hoangthik@example.com",
            userPhone: "0990123456",
            bookingDate: "2025-11-06",
            startTime: "10:00",
            endTime: "12:00",
            duration: 2,
            totalPrice: 100000,
            status: "pending",
            paymentStatus: "unpaid",
            attendees: 8,
            purpose: "Kids birthday party",
            specialRequests: "Need decoration and balloons",
            createdAt: "2025-10-28T17:30:00Z",
          },
        ];
        setBookings(mockBookings);
        setIsLoading(false);
      }, 800);
    };

    loadBookings();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...bookings];

    if (searchTerm) {
      result = result.filter(
        (booking) =>
          booking.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.facilityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      result = result.filter((booking) => booking.status === statusFilter);
    }

    if (paymentFilter) {
      result = result.filter((booking) => booking.paymentStatus === paymentFilter);
    }

    if (dateFilter) {
      result = result.filter((booking) => booking.bookingDate === dateFilter);
    }

    setFilteredBookings(result);
    setCurrentPage(1);
  }, [bookings, searchTerm, statusFilter, paymentFilter, dateFilter]);

  // Pagination
  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBookings.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBookings, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  const getStatusBadge = (status: Booking["status"]) => {
    const badges = {
      confirmed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      completed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      "in-progress": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    };
    return badges[status];
  };

  const getPaymentBadge = (status: Booking["paymentStatus"]) => {
    const badges = {
      paid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      unpaid: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
      refunded: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    };
    return badges[status];
  };

  const formatCurrency = (amount: number) => {
    if (amount === 0) return "Free";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Facility Bookings
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Manage and track all facility booking reservations
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by code, facility, or user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
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
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Payment
            </label>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            >
              <option value="">All Payments</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {bookings.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Total Bookings</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-green-600">
            {bookings.filter((b) => b.status === "confirmed").length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Confirmed</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-yellow-600">
            {bookings.filter((b) => b.status === "pending").length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Pending</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-blue-600">
            {bookings.filter((b) => b.status === "completed").length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Completed</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-orange-600">
            {bookings.filter((b) => b.paymentStatus === "unpaid").length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Unpaid</div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Booking Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Facility
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Attendees
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {booking.bookingCode}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDateTime(booking.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {booking.facilityName}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {booking.facilityCategory}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {booking.userName}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {booking.userEmail}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {booking.userPhone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-300">
                      {formatDate(booking.bookingDate)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {booking.startTime} - {booking.endTime}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-300">
                      {booking.duration} {booking.duration > 1 ? "hours" : "hour"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-300">
                      {booking.attendees} people
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(booking.totalPrice)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                        booking.status
                      )}`}
                    >
                      {booking.status.charAt(0).toUpperCase() +
                        booking.status.slice(1).replace("-", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentBadge(
                        booking.paymentStatus
                      )}`}
                    >
                      {booking.paymentStatus.charAt(0).toUpperCase() +
                        booking.paymentStatus.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button className="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
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
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 px-6 py-3 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Showing {(currentPage - 1) * itemsPerPage + 1} -{" "}
            {Math.min(currentPage * itemsPerPage, filteredBookings.length)} of{" "}
            {filteredBookings.length} results
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
