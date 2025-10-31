"use client";

import { useState } from "react";

interface Event {
  id: number;
  title: string;
  description: string;
  targetAudience: "all" | "specific_buildings" | "specific_apartments";
  targetBuildings?: string[];
  targetApartments?: string[];
  startDate: string;
  endDate: string;
  shopName?: string;
  shopType?: "in_building" | "external";
  textContent: string;
  pdfFiles?: string[];
  imageFiles?: string[];
  status: "active" | "scheduled" | "expired" | "draft";
  createdBy: string;
  createdAt: string;
}

const mockEvents: Event[] = [
  {
    id: 1,
    title: "Monthly Residents Meeting",
    description: "Discussion about building maintenance and upcoming improvements",
    targetAudience: "all",
    startDate: "2025-11-05",
    endDate: "2025-11-05",
    textContent: "Discussion about building maintenance and upcoming improvements. Location: Community Hall - Floor 1, Time: 18:00",
    status: "scheduled",
    createdBy: "Building Management",
    createdAt: "2025-10-25"
  },
  {
    id: 2,
    title: "Fire Safety Drill",
    description: "Mandatory fire safety drill and evacuation practice",
    targetAudience: "all",
    startDate: "2025-11-10",
    endDate: "2025-11-10",
    textContent: "Mandatory fire safety drill and evacuation practice. Location: All Building Areas, Time: 10:00",
    status: "scheduled",
    createdBy: "Safety Department",
    createdAt: "2025-10-26"
  },
  {
    id: 3,
    title: "Elevator Maintenance",
    description: "Scheduled maintenance for elevators A & B",
    targetAudience: "all",
    startDate: "2025-11-12",
    endDate: "2025-11-12",
    textContent: "Scheduled maintenance for elevators A & B. Time: 08:00",
    status: "scheduled",
    createdBy: "Maintenance Team",
    createdAt: "2025-10-27"
  },
  {
    id: 4,
    title: "Lunar New Year Celebration",
    description: "Community celebration with food and entertainment",
    targetAudience: "all",
    startDate: "2025-11-15",
    endDate: "2025-11-15",
    textContent: "Community celebration with food and entertainment. Location: Rooftop Garden, Time: 17:00",
    status: "scheduled",
    createdBy: "Residents Committee",
    createdAt: "2025-10-28"
  },
  {
    id: 5,
    title: "Swimming Pool Cleaning",
    description: "Deep cleaning and chemical treatment of swimming pool",
    targetAudience: "all",
    startDate: "2025-10-25",
    endDate: "2025-10-25",
    textContent: "Deep cleaning and chemical treatment of swimming pool. Time: 06:00",
    status: "expired",
    createdBy: "Maintenance Team",
    createdAt: "2025-10-20"
  },
  {
    id: 6,
    title: "Building Security Update",
    description: "Information session about new security measures",
    targetAudience: "all",
    startDate: "2025-10-28",
    endDate: "2025-10-28",
    textContent: "Information session about new security measures. Location: Meeting Room B, Time: 19:00",
    status: "active",
    createdBy: "Security Department",
    createdAt: "2025-10-24"
  }
];

export default function EventsPage() {
  const [events] = useState<Event[]>(mockEvents);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || event.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: events.length,
    scheduled: events.filter(e => e.status === 'scheduled').length,
    active: events.filter(e => e.status === 'active').length,
    expired: events.filter(e => e.status === 'expired').length
  };

  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
      active: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
      expired: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
      draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Events Management
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Manage and track all building events, meetings, and activities
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Events</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Scheduled</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{stats.scheduled}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{stats.active}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Expired</p>
          <p className="text-2xl font-bold text-gray-600 dark:text-gray-400 mt-1">{stats.expired}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <option value="scheduled">Scheduled</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="draft">Draft</option>
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
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                {event.targetAudience}
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
                {event.startDate} - {event.endDate}
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {event.createdBy}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button className="flex-1 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-lg transition-colors">
                View Details
              </button>
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
