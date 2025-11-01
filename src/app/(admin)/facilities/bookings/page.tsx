"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput, EventClickArg } from "@fullcalendar/core";

interface Facility {
  id: string;
  name: string;
  category: string;
  status: string;
}

interface Booking {
  id: string;
  booking_code: string;
  facility_id: string;
  user_id: string | null;
  user_name: string;
  user_email: string;
  user_phone: string | null;
  booking_date: string;
  start_time: string;
  end_time: string;
  duration: number;
  total_price: number;
  payment_status: "paid" | "unpaid" | "refunded";
  attendees: number | null;
  purpose: string | null;
  special_requests: string | null;
  created_at: string;
  updated_at: string;
}

interface BookingWithFacility extends Booking {
  facility?: Facility;
}

interface BookingFormData {
  facility_id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  duration: number;
  attendees?: number;
  purpose: string;
  special_requests: string;
}

export default function FacilityBookingsPage() {
  const [bookings, setBookings] = useState<BookingWithFacility[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<BookingWithFacility | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterFacility, setFilterFacility] = useState<string>("all");
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    facility_id: "",
    user_name: "",
    user_email: "",
    user_phone: "",
    booking_date: "",
    start_time: "",
    end_time: "",
    duration: 0,
    attendees: 1,
    purpose: "",
    special_requests: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch facilities
      const { data: facilitiesData, error: facilitiesError } = await supabase
        .from("facilities")
        .select("id, name, category, status")
        .order("name");

      if (facilitiesError) {
        console.error("Error fetching facilities:", facilitiesError);
        throw facilitiesError;
      }
      setFacilities(facilitiesData || []);

      // Fetch bookings with facility information
      const { data: bookingsData, error: bookingsError } = await supabase
        .from("facility_bookings")
        .select(`
          *,
          facility:facilities(id, name, category, status)
        `)
        .order("booking_date", { ascending: false });

      if (bookingsError) {
        console.error("Error fetching bookings:", bookingsError);
        // Check if table doesn't exist
        if (bookingsError.code === '42P01' || bookingsError.message?.includes('does not exist')) {
          alert("Database table 'facility_bookings' not found. Please run the SQL schema first (facility-bookings-schema.sql).");
        } else {
          alert(`Error loading bookings: ${bookingsError.message}`);
        }
        setBookings([]);
        setLoading(false);
        return;
      }
      
      // Transform the data to flatten facility
      const transformedData = (bookingsData || []).map((booking: BookingWithFacility) => ({
        ...booking,
        facility: booking.facility || undefined
      }));
      
      setBookings(transformedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      alert(`Error loading data: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "unpaid":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "refunded":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const facilityMatch = filterFacility === "all" || booking.facility_id === filterFacility;
    return facilityMatch;
  });

  const getEventColorByPayment = (paymentStatus: string) => {
    switch (paymentStatus) {
      case "paid":
        return "#10b981"; // green
      case "unpaid":
        return "#ef4444"; // red
      case "refunded":
        return "#6b7280"; // gray
      default:
        return "#6b7280"; // gray
    }
  };

  const calendarEvents: EventInput[] = filteredBookings.map((booking) => ({
    id: booking.id,
    title: `${booking.facility?.name || "Unknown"} - ${booking.user_name}`,
    start: `${booking.booking_date}T${booking.start_time}`,
    end: `${booking.booking_date}T${booking.end_time}`,
    backgroundColor: getEventColorByPayment(booking.payment_status),
    borderColor: getEventColorByPayment(booking.payment_status),
    extendedProps: {
      booking,
    },
  }));

  const handleEventClick = (info: EventClickArg) => {
    const booking = info.event.extendedProps.booking as BookingWithFacility;
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (time: string) => {
    return time.substring(0, 5); // HH:MM
  };

  const generateBookingCode = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `BK${year}${month}${random}`;
  };

  const calculateDuration = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return 0;
    const start = new Date(`2000-01-01 ${startTime}`);
    const end = new Date(`2000-01-01 ${endTime}`);
    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return diff > 0 ? diff : 0;
  };

  // Get booked time slots for a specific facility and date
  const getBookedTimeSlots = useMemo(() => {
    if (!formData.facility_id || !formData.booking_date) return [];
    
    return bookings
      .filter(booking => 
        booking.facility_id === formData.facility_id && 
        booking.booking_date === formData.booking_date
      )
      .map(booking => ({
        start: booking.start_time,
        end: booking.end_time
      }));
  }, [bookings, formData.facility_id, formData.booking_date]);

  // Check if a time slot overlaps with existing bookings
  const isTimeSlotBooked = (time: string) => {
    if (!time || getBookedTimeSlots.length === 0) return false;
    
    return getBookedTimeSlots.some((slot: { start: string; end: string }) => {
      const slotStart = slot.start.substring(0, 5);
      const slotEnd = slot.end.substring(0, 5);
      return time >= slotStart && time < slotEnd;
    });
  };

  const handleCreateBooking = async () => {
    // Validation
    if (!formData.facility_id || !formData.user_name || !formData.user_email || 
        !formData.booking_date || !formData.start_time || !formData.end_time) {
      alert("Please fill in all required fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.user_email)) {
      alert("Please enter a valid email address");
      return;
    }

    // Calculate duration
    const duration = calculateDuration(formData.start_time, formData.end_time);
    if (duration <= 0) {
      alert("End time must be after start time");
      return;
    }

    // Check for time slot conflicts
    const hasConflict = getBookedTimeSlots.some((slot: { start: string; end: string }) => {
      const slotStart = slot.start.substring(0, 5);
      const slotEnd = slot.end.substring(0, 5);
      const newStart = formData.start_time;
      const newEnd = formData.end_time;
      
      return (newStart < slotEnd && newEnd > slotStart);
    });

    if (hasConflict) {
      alert("This time slot overlaps with an existing booking. Please choose a different time.");
      return;
    }

    setSaving(true);
    try {
      const bookingCode = generateBookingCode();
      
      const { error } = await supabase
        .from("facility_bookings")
        .insert([{
          booking_code: bookingCode,
          facility_id: formData.facility_id,
          user_name: formData.user_name,
          user_email: formData.user_email,
          user_phone: formData.user_phone || null,
          booking_date: formData.booking_date,
          start_time: formData.start_time,
          end_time: formData.end_time,
          duration: duration,
          total_price: 0,
          payment_status: "unpaid",
          attendees: formData.attendees || null,
          purpose: formData.purpose || null,
          special_requests: formData.special_requests || null,
        }] as never)
        .select();

      if (error) throw error;

      alert("Booking created successfully!");
      setShowCreateModal(false);
      
      // Reset form
      setFormData({
        facility_id: "",
        user_name: "",
        user_email: "",
        user_phone: "",
        booking_date: "",
        start_time: "",
        end_time: "",
        duration: 0,
        attendees: 1,
        purpose: "",
        special_requests: "",
      });
      
      // Refresh data
      fetchData();
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Failed to create booking. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Facility Bookings
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage and view facility bookings
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Booking
          </button>
          <button
            onClick={fetchData}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filter by Facility
            </label>
            <select
              value={filterFacility}
              onChange={(e) => setFilterFacility(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Facilities</option>
              {facilities.map((facility) => (
                <option key={facility.id} value={facility.id}>
                  {facility.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Calendar View */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={calendarEvents}
          eventClick={handleEventClick}
          height="auto"
          slotMinTime="06:00:00"
          slotMaxTime="22:00:00"
        />
      </div>

      {/* Bookings List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Bookings ({filteredBookings.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Booking Code
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Facility
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => {
                    setSelectedBooking(booking);
                    setShowModal(true);
                  }}
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                    {booking.booking_code}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    {booking.facility?.name || "Unknown"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    <div>{booking.user_name}</div>
                    <div className="text-xs text-gray-500">{booking.user_email}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    <div>{formatDate(booking.booking_date)}</div>
                    <div className="text-xs text-gray-500">
                      {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(
                        booking.payment_status
                      )}`}
                    >
                      {booking.payment_status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(booking.total_price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No bookings found</p>
            </div>
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-blackO flex items-center justify-center p-4 z-999999">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Booking Details
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Booking Code
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white font-mono">
                      {selectedBooking.booking_code}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Facility
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {selectedBooking.facility?.name || "Unknown"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Customer Name
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {selectedBooking.user_name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {selectedBooking.user_email}
                    </p>
                  </div>
                </div>

                {selectedBooking.user_phone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {selectedBooking.user_phone}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {formatDate(selectedBooking.booking_date)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Time
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {formatTime(selectedBooking.start_time)} -{" "}
                      {formatTime(selectedBooking.end_time)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Duration
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {selectedBooking.duration} hours
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Payment Status
                    </label>
                    <span
                      className={`inline-flex mt-1 px-3 py-1 text-sm font-semibold rounded-full ${getPaymentStatusColor(
                        selectedBooking.payment_status
                      )}`}
                    >
                      {selectedBooking.payment_status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Total Price
                    </label>
                    <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(selectedBooking.total_price)}
                    </p>
                  </div>
                  {selectedBooking.attendees && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Attendees
                      </label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {selectedBooking.attendees} people
                      </p>
                    </div>
                  )}
                </div>

                {selectedBooking.purpose && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Purpose
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {selectedBooking.purpose}
                    </p>
                  </div>
                )}

                {selectedBooking.special_requests && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Special Requests
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {selectedBooking.special_requests}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Created At
                    </label>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                      {new Date(selectedBooking.created_at).toLocaleString("vi-VN")}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Updated At
                    </label>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                      {new Date(selectedBooking.updated_at).toLocaleString("vi-VN")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Booking Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-blackO z-999999 flex items-center justify-center p-4">
          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Create Booking
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleCreateBooking()
              }}
              className="p-6 space-y-6"
            >
              {/* Facility Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Facility <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.facility_id}
                  onChange={(e) =>
                    setFormData({ ...formData, facility_id: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                  required
                >
                  <option value="">Select a facility</option>
                  {facilities.map((facility) => (
                    <option key={facility.id} value={facility.id}>
                      {facility.name} ({facility.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Customer Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.user_name}
                    onChange={(e) =>
                      setFormData({ ...formData, user_name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.user_email}
                    onChange={(e) =>
                      setFormData({ ...formData, user_email: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.user_phone}
                  onChange={(e) =>
                    setFormData({ ...formData, user_phone: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Date and Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Booking Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.booking_date}
                  onChange={(e) => {
                    setFormData({ ...formData, booking_date: e.target.value, start_time: "", end_time: "" });
                  }}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              {/* Show booked time slots if facility and date are selected */}
              {formData.facility_id && formData.booking_date && getBookedTimeSlots.length > 0 && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                    ⚠️ Already Booked Time Slots
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {getBookedTimeSlots.map((slot, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm rounded-md"
                      >
                        {slot.start.substring(0, 5)} - {slot.end.substring(0, 5)}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-2">
                    Please avoid selecting time ranges that overlap with these slots.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={formData.start_time}
                    onChange={(e) =>
                      setFormData({ ...formData, start_time: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                    required
                    disabled={!formData.facility_id || !formData.booking_date}
                  />
                  {formData.start_time && isTimeSlotBooked(formData.start_time) && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      ⚠️ This time is within a booked slot
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    End Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={formData.end_time}
                    onChange={(e) =>
                      setFormData({ ...formData, end_time: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                    required
                    disabled={!formData.facility_id || !formData.booking_date}
                  />
                  {formData.end_time && formData.start_time && formData.end_time <= formData.start_time && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      ⚠️ End time must be after start time
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Number of Attendees
                </label>
                <input
                  type="number"
                  value={formData.attendees || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      attendees: e.target.value ? parseInt(e.target.value) : undefined,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                  min="1"
                />
              </div>

              {/* Additional Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Purpose
                </label>
                <textarea
                  value={formData.purpose}
                  onChange={(e) =>
                    setFormData({ ...formData, purpose: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Special Requests
                </label>
                <textarea
                  value={formData.special_requests}
                  onChange={(e) =>
                    setFormData({ ...formData, special_requests: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 disabled:opacity-50"
                  disabled={saving}
                >
                  {saving ? "Creating..." : "Create Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
