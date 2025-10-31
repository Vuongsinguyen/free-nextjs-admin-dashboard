"use client";

import { useState, useEffect, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput, EventContentArg, EventClickArg } from "@fullcalendar/core";
import DatePicker from "@/components/form/date-picker";
import flatpickr from "flatpickr";

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
  const [viewMode, setViewMode] = useState<"table" | "calendar">("calendar");
  
  // Time slot selection
  const [selectedStartSlot, setSelectedStartSlot] = useState<string | null>(null);
  const [selectedEndSlot, setSelectedEndSlot] = useState<string | null>(null);
  const [isSelectingRange, setIsSelectingRange] = useState(false);
  
  // Form data for add/edit modal
  const [formData, setFormData] = useState({
    facility: '',
    userName: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    attendees: '',
    purpose: '',
    specialRequests: ''
  });

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

  // Debug: Log state changes
  useEffect(() => {
    console.log('State changed - startDate:', formData.startDate, 'endDate:', formData.endDate, 'facility:', formData.facility);
  }, [formData.startDate, formData.endDate, formData.facility]);

  // Pagination
  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBookings.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBookings, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  // Convert bookings to calendar events
  const calendarEvents = useMemo(() => {
    return bookings.map((booking): EventInput => ({
      id: booking.id.toString(),
      title: `${booking.facilityName} - ${booking.userName}`,
      start: `${booking.bookingDate}T${booking.startTime}`,
      end: `${booking.bookingDate}T${booking.endTime}`,
      backgroundColor: '#3B82F6', // Single blue color for all bookings
      borderColor: '#3B82F6',
      textColor: '#ffffff',
      extendedProps: {
        booking: booking,
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
  const handleAddBooking = (selectedDates?: string[]) => {
    if (selectedDates && selectedDates.length >= 1) {
      setFormData(prev => ({
        ...prev,
        startDate: selectedDates[0],
        endDate: selectedDates[1] || selectedDates[0]
      }));
    } else {
      setFormData({
        facility: '',
        userName: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        attendees: '',
        purpose: '',
        specialRequests: ''
      });
    }
    setSelectedStartSlot(null);
    setSelectedEndSlot(null);
    setIsSelectingRange(false);
    setIsAddModalOpen(true);
  };

  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking);
    setFormData({
      facility: booking.facilityName,
      userName: booking.userName,
      startDate: booking.bookingDate,
      endDate: booking.bookingDate, // For existing bookings, start and end are the same
      startTime: booking.startTime,
      endTime: booking.endTime,
      attendees: booking.attendees.toString(),
      purpose: booking.purpose,
      specialRequests: booking.specialRequests || ''
    });
    setSelectedStartSlot(booking.startTime);
    setSelectedEndSlot(booking.endTime);
    setIsSelectingRange(false);
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
    setSelectedStartSlot(null);
    setSelectedEndSlot(null);
    setIsSelectingRange(false);
    setFormData({
      facility: '',
      userName: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      attendees: '',
      purpose: '',
      specialRequests: ''
    });
  };

  // Calendar date click handler
  const handleDateClick = (arg: { dateStr: string }) => {
    const selectedDate = arg.dateStr; // Format: YYYY-MM-DD
    handleAddBooking([selectedDate]);
  };

  // Calendar event click handler
  const handleEventClick = (arg: EventClickArg) => {
    const booking = arg.event.extendedProps.booking as Booking;
    handleEditBooking(booking);
  };

  // Generate time slots from 6:00 to 22:00 (30-minute intervals)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  // Check if a time slot is booked for the selected date range and facility
  const isTimeSlotBooked = (timeSlot: string, startDate: string, endDate: string, selectedFacility: string, excludeBookingId?: number) => {
    // Generate all dates in the range
    const start = new Date(startDate);
    const end = new Date(endDate);
    const datesInRange: string[] = [];
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      datesInRange.push(d.toISOString().split('T')[0]);
    }

    return bookings.some(booking => {
      if (excludeBookingId && booking.id === excludeBookingId) return false;
      if (booking.facilityName !== selectedFacility) return false;
      if (!datesInRange.includes(booking.bookingDate)) return false;

      const slotTime = new Date(`2000-01-01T${timeSlot}`);
      const bookingStart = new Date(`2000-01-01T${booking.startTime}`);
      const bookingEnd = new Date(`2000-01-01T${booking.endTime}`);

      return slotTime >= bookingStart && slotTime < bookingEnd;
    });
  };

  // Get available time slots for selection across date range
  const getAvailableSlots = (startDate: string, endDate: string, selectedFacility: string, excludeBookingId?: number) => {
    const allSlots = generateTimeSlots();
    return allSlots.filter(slot => !isTimeSlotBooked(slot, startDate, endDate, selectedFacility, excludeBookingId));
  };

  // Helper function to calculate duration
  const calculateDuration = (startTime: string, endTime: string): number => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    return Math.round(diffHours * 2) / 2; // Round to nearest 0.5
  };

  // Handle time slot selection
  const handleTimeSlotClick = (slot: string) => {
    if (!formData.startDate || !formData.endDate || !formData.facility) return;

    const availableSlots = getAvailableSlots(
      formData.startDate,
      formData.endDate,
      formData.facility,
      editingBooking?.id
    );

    if (!availableSlots.includes(slot)) return; // Can't select booked slots

    if (!selectedStartSlot || (selectedStartSlot && selectedEndSlot)) {
      // Start new selection
      setSelectedStartSlot(slot);
      setSelectedEndSlot(null);
      setIsSelectingRange(true);
      setFormData(prev => ({ ...prev, startTime: slot, endTime: '' }));
    } else {
      // Complete the range
      const startIndex = availableSlots.indexOf(selectedStartSlot);
      const endIndex = availableSlots.indexOf(slot);

      if (endIndex > startIndex) {
        setSelectedEndSlot(slot);
        setIsSelectingRange(false);
        setFormData(prev => ({ ...prev, endTime: slot }));
      } else if (endIndex < startIndex) {
        // If clicked slot is before start, swap them
        setSelectedStartSlot(slot);
        setSelectedEndSlot(selectedStartSlot);
        setIsSelectingRange(false);
        setFormData(prev => ({ ...prev, startTime: slot, endTime: selectedStartSlot }));
      }
    }
  };

  // Check if a slot is selected or in selection range
  const isSlotSelected = (slot: string) => {
    if (!selectedStartSlot) return false;
    if (slot === selectedStartSlot) return true;
    if (selectedEndSlot && slot === selectedEndSlot) return true;

    // If we have both start and end slots, check if slot is between them
    if (selectedStartSlot && selectedEndSlot) {
      const allSlots = generateTimeSlots();
      const startIndex = allSlots.indexOf(selectedStartSlot);
      const endIndex = allSlots.indexOf(selectedEndSlot);
      const slotIndex = allSlots.indexOf(slot);

      // Check if slot is between start and end (inclusive)
      return slotIndex >= Math.min(startIndex, endIndex) && slotIndex <= Math.max(startIndex, endIndex);
    }

    if (isSelectingRange && selectedStartSlot && !selectedEndSlot) {
      const allSlots = generateTimeSlots();
      const startIndex = allSlots.indexOf(selectedStartSlot);
      const slotIndex = allSlots.indexOf(slot);
      return slotIndex > startIndex;
    }

    return false;
  };

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.facility || !formData.userName || !formData.startDate || !formData.endDate || !formData.startTime || !formData.endTime || !formData.attendees || !formData.purpose) {
      alert("Please fill in all required fields and select time slots");
      return;
    }

    if (isAddModalOpen) {
      // For multi-day bookings, create separate bookings for each day
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const newBookings: Booking[] = [];
      
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const bookingDate = d.toISOString().split('T')[0];
        const newBooking: Booking = {
          id: Math.max(...bookings.map(b => b.id), 0) + newBookings.length + 1,
          bookingCode: `BK${String(Math.max(...bookings.map(b => parseInt(b.bookingCode.slice(2))), 0) + newBookings.length + 1).padStart(4, '0')}`,
          facilityName: formData.facility,
          facilityCategory: "Facility", // You might want to map this properly
          userName: formData.userName,
          userEmail: "user@example.com", // Mock data
          userPhone: "+1234567890", // Mock data
          bookingDate: bookingDate,
          startTime: formData.startTime,
          endTime: formData.endTime,
          duration: calculateDuration(formData.startTime, formData.endTime),
          totalPrice: 0, // Mock data
          status: "confirmed",
          paymentStatus: "paid", // Mock data
          attendees: parseInt(formData.attendees),
          purpose: formData.purpose,
          specialRequests: formData.specialRequests,
          createdAt: new Date().toISOString()
        };
        newBookings.push(newBooking);
      }
      
      setBookings(prev => [...prev, ...newBookings]);
    } else if (editingBooking) {
      // Update existing booking
      setBookings(prev => prev.map(booking => 
        booking.id === editingBooking.id 
          ? {
              ...booking,
              facilityName: formData.facility,
              userName: formData.userName,
              bookingDate: formData.startDate, // For editing, use start date
              startTime: formData.startTime,
              endTime: formData.endTime,
              duration: calculateDuration(formData.startTime, formData.endTime),
              attendees: parseInt(formData.attendees),
              purpose: formData.purpose,
              specialRequests: formData.specialRequests
            }
          : booking
      ));
    }

    handleCloseModals();
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
            onClick={() => handleAddBooking()}
            className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Booking
          </button>
        </div>
      </div>

      {/* Filters - Only show for table view */}
      {viewMode === "table" && (
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
      )}

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
              dateClick={handleDateClick}
              eventClick={handleEventClick}
            />
          </div>
        </div>
      )}
      
      {/* Add/Edit Booking Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-blackO flex items-center justify-center p-4 z-999999">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
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

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Facility Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Facility *
                  </label>
                  <select 
                    value={formData.facility}
                    onChange={(e) => setFormData(prev => ({ ...prev, facility: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  >
                    <option value="">Select Facility</option>
                    <option value="Swimming Pool A">Swimming Pool A</option>
                    <option value="Conference Hall">Conference Hall</option>
                    <option value="Meeting Room 101">Meeting Room 101</option>
                    <option value="Tennis Court 1">Tennis Court 1</option>
                    <option value="Gym & Fitness Center">Gym & Fitness Center</option>
                    <option value="BBQ Area">BBQ Area</option>
                    <option value="Yoga Studio">Yoga Studio</option>
                    <option value="Basketball Court">Basketball Court</option>
                    <option value="Library & Study Room">Library & Study Room</option>
                    <option value="Kids Playground">Kids Playground</option>
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
                    value={formData.userName}
                    onChange={(e) => setFormData(prev => ({ ...prev, userName: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>

                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Booking Date Range *
                  </label>
                  <DatePicker
                    id="booking-date-range"
                    mode="range"
                    placeholder="Select date range"
                    defaultDate={(formData.startDate && formData.endDate ? [new Date(formData.startDate), new Date(formData.endDate)] : undefined) as unknown as flatpickr.Options.DateOption}
                    onChange={(selectedDates) => {
                      if (selectedDates && selectedDates.length >= 1) {
                        const startDate = selectedDates[0];
                        const endDate = selectedDates[1] || selectedDates[0];
                        const startFormatted = startDate.toISOString().split('T')[0];
                        const endFormatted = endDate.toISOString().split('T')[0];
                        setFormData(prev => ({ 
                          ...prev, 
                          startDate: startFormatted,
                          endDate: endFormatted
                        }));
                      }
                    }}
                  />
                </div>

                {/* Time Slot Selection */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Time Selection *
                  </label>
                  {(() => {
                    if (!formData.startDate || !formData.endDate) {
                      return (
                        <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-800 text-center text-gray-500 dark:text-gray-400">
                          Please select a date range first
                        </div>
                      );
                    }
                    if (!formData.facility) {
                      return (
                        <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-800 text-center text-gray-500 dark:text-gray-400">
                          Please select a facility to view available time slots
                        </div>
                      );
                    }
                    return (
                      <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                        <div className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                          Select start time and end time by clicking on available slots (start and end will be highlighted in green, range slots in light blue)
                        </div>
                        <div className="grid grid-cols-6 gap-2 max-h-64 overflow-y-auto">
                          {generateTimeSlots().map((slot) => {
                            const isBooked = isTimeSlotBooked(
                              slot,
                              formData.startDate,
                              formData.endDate,
                              formData.facility,
                              editingBooking?.id
                            );
                            const isSelected = isSlotSelected(slot);
                            const isStartSlot = slot === selectedStartSlot;
                            const isEndSlot = slot === selectedEndSlot;

                            return (
                              <button
                                key={slot}
                                type="button"
                                onClick={() => handleTimeSlotClick(slot)}
                                disabled={isBooked}
                                className={`px-2 py-1 text-xs rounded transition-colors ${
                                  isBooked
                                    ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 cursor-not-allowed'
                                    : isSelected
                                    ? isStartSlot || isEndSlot
                                      ? 'bg-green-500 text-white font-medium'
                                      : 'bg-blue-300 dark:bg-blue-800/60 text-blue-900 dark:text-blue-100'
                                    : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                                }`}
                                title={isBooked ? 'Booked' : `Available - ${slot}`}
                              >
                                {slot}
                              </button>
                            );
                          })}
                        </div>
                        <div className="mt-3 flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded"></div>
                            <span className="text-gray-600 dark:text-gray-400">Start & End Time</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-300 dark:bg-blue-800/60 rounded"></div>
                            <span className="text-gray-600 dark:text-gray-400">Selected Range</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-100 dark:bg-red-900/30 rounded"></div>
                            <span className="text-gray-600 dark:text-gray-400">Booked</span>
                          </div>
                        </div>
                        {selectedStartSlot && selectedEndSlot && (
                          <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm text-blue-800 dark:text-blue-200">
                            Selected: {selectedStartSlot} - {selectedEndSlot} ({calculateDuration(selectedStartSlot, selectedEndSlot)} hours) for {formData.startDate} to {formData.endDate}
                          </div>
                        )}
                      </div>
                    );
                  })()}
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
                    value={formData.attendees}
                    onChange={(e) => setFormData(prev => ({ ...prev, attendees: e.target.value }))}
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
                    value={formData.purpose}
                    onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
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
                  value={formData.specialRequests}
                  onChange={(e) => setFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  {isEditModalOpen && editingBooking && (
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this booking?")) {
                          handleDeleteBooking(editingBooking.id);
                          handleCloseModals();
                        }
                      }}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    >
                      Delete Booking
                    </button>
                  )}
                </div>
                <div className="flex gap-4">
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
              </div>
            </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
