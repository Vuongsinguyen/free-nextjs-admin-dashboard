"use client";

import { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: "meeting" | "maintenance" | "social" | "emergency" | "other";
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  attendees: number;
  maxAttendees?: number;
  organizer: string;
}

const mockEvents: Event[] = [
  {
    id: 1,
    title: "Monthly Residents Meeting",
    description: "Discussion about building maintenance and upcoming improvements",
    date: "2025-11-05",
    time: "18:00",
    location: "Community Hall - Floor 1",
    category: "meeting",
    status: "upcoming",
    attendees: 45,
    maxAttendees: 100,
    organizer: "Building Management"
  },
  {
    id: 2,
    title: "Fire Safety Drill",
    description: "Mandatory fire safety drill and evacuation practice",
    date: "2025-11-10",
    time: "10:00",
    location: "All Building Areas",
    category: "emergency",
    status: "upcoming",
    attendees: 0,
    organizer: "Safety Department"
  },
  {
    id: 3,
    title: "Elevator Maintenance",
    description: "Scheduled maintenance for elevators A & B",
    date: "2025-11-12",
    time: "08:00",
    location: "Elevators A & B",
    category: "maintenance",
    status: "upcoming",
    attendees: 0,
    organizer: "Maintenance Team"
  },
  {
    id: 4,
    title: "Lunar New Year Celebration",
    description: "Community celebration with food and entertainment",
    date: "2025-11-15",
    time: "17:00",
    location: "Rooftop Garden",
    category: "social",
    status: "upcoming",
    attendees: 78,
    maxAttendees: 150,
    organizer: "Residents Committee"
  },
  {
    id: 5,
    title: "Swimming Pool Cleaning",
    description: "Deep cleaning and chemical treatment of swimming pool",
    date: "2025-10-25",
    time: "06:00",
    location: "Swimming Pool Area",
    category: "maintenance",
    status: "completed",
    attendees: 0,
    organizer: "Maintenance Team"
  },
  {
    id: 6,
    title: "Building Security Update",
    description: "Information session about new security measures",
    date: "2025-10-28",
    time: "19:00",
    location: "Meeting Room B",
    category: "meeting",
    status: "ongoing",
    attendees: 32,
    maxAttendees: 50,
    organizer: "Security Department"
  }
];

export default function EventsPage() {
  const [events] = useState<Event[]>(mockEvents);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || event.status === filterStatus;
    const matchesCategory = filterCategory === "all" || event.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const stats = {
    total: events.length,
    upcoming: events.filter(e => e.status === 'upcoming').length,
    ongoing: events.filter(e => e.status === 'ongoing').length,
    completed: events.filter(e => e.status === 'completed').length
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      meeting: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
      maintenance: "bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100",
      social: "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100",
      emergency: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
      other: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      upcoming: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
      ongoing: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
      completed: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
    };
    return colors[status as keyof typeof colors] || colors.upcoming;
  };

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Events Management" />

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Events</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{stats.upcoming}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Ongoing</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{stats.ongoing}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
          <p className="text-2xl font-bold text-gray-600 dark:text-gray-400 mt-1">{stats.completed}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search events..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Categories</option>
              <option value="meeting">Meeting</option>
              <option value="maintenance">Maintenance</option>
              <option value="social">Social</option>
              <option value="emergency">Emergency</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getCategoryColor(event.category)}`}>
                {event.category}
              </span>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)}`}>
                {event.status}
              </span>
            </div>

            {/* Title & Description */}
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {event.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {event.description}
            </p>

            {/* Event Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {event.date} at {event.time}
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {event.location}
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {event.organizer}
              </div>
            </div>

            {/* Attendees */}
            {event.maxAttendees && (
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Attendees</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {event.attendees}/{event.maxAttendees}
                  </span>
                </div>
                <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="absolute h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full"
                    style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <button className="flex-1 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-lg transition-colors">
                View Details
              </button>
              {event.status === 'upcoming' && event.maxAttendees && (
                <button className="flex-1 px-4 py-2 border-2 border-brand-500 text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 text-sm font-medium rounded-lg transition-colors">
                  Register
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredEvents.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-600 dark:text-gray-400">No events found</p>
        </div>
      )}

      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredEvents.length} of {events.length} events
      </div>
    </div>
  );
}
