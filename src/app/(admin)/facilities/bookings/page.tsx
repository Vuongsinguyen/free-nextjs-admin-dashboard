"use client";

import { useState, useEffect, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput, EventContentArg } from "@fullcalendar/core";

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
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  
  // View toggle
  const [viewMode, setViewMode] = useState<"table" | "calendar">("table");

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

    if (dateFilter) {
      result = result.filter((booking) => booking.bookingDate === dateFilter);
    }

    setFilteredBookings(result);
    setCurrentPage(1);
  }, [bookings, searchTerm, statusFilter, dateFilter]);

  // Pagination
  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBookings.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBookings, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '#10B981'; // green
      case 'pending':
        return '#F59E0B'; // yellow
      case 'in-progress':
        return '#3B82F6'; // blue
      case 'completed':
        return '#6B7280'; // gray
      case 'cancelled':
        return '#EF4444'; // red
      default:
        return '#6B7280';
    }
  };

  // Convert bookings to calendar events
  const calendarEvents = useMemo(() => {
    return bookings.map((booking): EventInput => ({
      id: booking.id.toString(),
      title: `${booking.facilityName} - ${booking.userName}`,
      start: `${booking.bookingDate}T${booking.startTime}`,
      end: `${booking.bookingDate}T${booking.endTime}`,
      backgroundColor: getStatusColor(booking.status),
      borderColor: getStatusColor(booking.status),
      textColor: '#ffffff',
      extendedProps: {
        booking: booking,
        status: booking.status,
        facility: booking.facilityName,
        user: booking.userName,
        attendees: booking.attendees,
        purpose: booking.purpose
      }
    }));
  }, [bookings]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  // Modal handlers
  const handleAddBooking = () => {
    setIsAddModalOpen(true);
  };

  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking);
    setIsEditModalOpen(true);
  };

  const handleDeleteBooking = (bookingId: number) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      setBookings(bookings.filter(b => b.id !== bookingId));
    }
  };

  const handleCloseModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setEditingBooking(null);
  };

  const renderCalendarEventContent = (eventInfo: EventContentArg) => {
    const booking = eventInfo.event.extendedProps.booking as Booking;
    return (
      <div className="text-xs p-1">
        <div className="font-medium truncate">{booking.facilityName}</div>
        <div className="text-white/80 truncate">{booking.userName}</div>
        <div className="text-white/60">
          {booking.startTime} - {booking.endTime}
        </div>
      </div>
    );
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Facility Bookings
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            {/* Description removed as requested */}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* View Toggle */}
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setViewMode("table")}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg transition-colors ${
                viewMode === "table"
                  ? "bg-brand-500 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              Table View
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg transition-colors ${
                viewMode === "calendar"
                  ? "bg-brand-500 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              Calendar View
            </button>
          </div>
          <button
            onClick={handleAddBooking}
            className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Booking
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      {/* Content based on view mode */}
      {viewMode === "table" ? (
        <>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleEditBooking(booking)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            title="Edit booking"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleDeleteBooking(booking.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            title="Delete booking"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        </>
      ) : (
        /* Calendar View */
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Booking Calendar Overview
            </h3>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-gray-600 dark:text-gray-300">Confirmed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-gray-600 dark:text-gray-300">Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-gray-600 dark:text-gray-300">In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-500 rounded"></div>
                <span className="text-gray-600 dark:text-gray-300">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-gray-600 dark:text-gray-300">Cancelled</span>
              </div>
            </div>
          </div>
          <div className="calendar-container">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              events={calendarEvents}
              eventContent={renderCalendarEventContent}
              height="auto"
              eventDisplay="block"
              dayMaxEvents={3}
              moreLinkClick="popover"
            />
          </div>
        </div>
      )}
      
      {/* Add/Edit Booking Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {isAddModalOpen ? "Add New Booking" : "Edit Booking"}
              </h2>
              <button
                onClick={handleCloseModals}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Facility Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Facility *
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent">
                    <option value="">Select Facility</option>
                    <option value="swimming-pool-a">Swimming Pool A</option>
                    <option value="conference-hall">Conference Hall</option>
                    <option value="meeting-room-101">Meeting Room 101</option>
                    <option value="tennis-court-1">Tennis Court 1</option>
                    <option value="gym-fitness">Gym & Fitness Center</option>
                    <option value="bbq-area">BBQ Area</option>
                    <option value="yoga-studio">Yoga Studio</option>
                    <option value="basketball-court">Basketball Court</option>
                    <option value="library-study">Library & Study Room</option>
                    <option value="kids-playground">Kids Playground</option>
                  </select>
                </div>

                {/* User Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    User Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter user name"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>

                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Booking Date *
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>

                {/* Time Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Time *
                    </label>
                    <input
                      type="time"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      End Time *
                    </label>
                    <input
                      type="time"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Attendees */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Number of Attendees *
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter number of attendees"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>

                {/* Purpose */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Purpose *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter booking purpose"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Special Requests
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter any special requests or requirements"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={handleCloseModals}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors"
                >
                  {isAddModalOpen ? "Add Booking" : "Update Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
