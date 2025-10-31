"use client";

import { useState } from "react";
import EventModal from "@/components/events/EventModal";

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
  },
  {
    id: 7,
    title: "Yoga Class for Residents",
    description: "Weekly yoga session for all residents",
    targetAudience: "all",
    startDate: "2025-11-01",
    endDate: "2025-11-01",
    textContent: "Weekly yoga session for all residents. Location: Gym - Floor 5, Time: 06:30",
    status: "active",
    createdBy: "Fitness Center",
    createdAt: "2025-10-22"
  },
  {
    id: 8,
    title: "Garden Renovation Notice",
    description: "Garden area will be closed for renovation",
    targetAudience: "all",
    startDate: "2025-11-20",
    endDate: "2025-11-25",
    textContent: "Garden area will be closed for renovation. Duration: 5 days",
    status: "scheduled",
    createdBy: "Landscaping Team",
    createdAt: "2025-10-29"
  },
  {
    id: 9,
    title: "Children's Art Workshop",
    description: "Art and craft session for children aged 5-12",
    targetAudience: "all",
    startDate: "2025-11-08",
    endDate: "2025-11-08",
    textContent: "Art and craft session for children aged 5-12. Location: Activity Room, Time: 14:00",
    status: "scheduled",
    createdBy: "Community Center",
    createdAt: "2025-10-30"
  },
  {
    id: 10,
    title: "Water Tank Inspection",
    description: "Annual water tank cleaning and inspection",
    targetAudience: "all",
    startDate: "2025-10-20",
    endDate: "2025-10-20",
    textContent: "Annual water tank cleaning and inspection. Water supply may be interrupted. Time: 09:00-15:00",
    status: "expired",
    createdBy: "Maintenance Team",
    createdAt: "2025-10-15"
  }
];

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterAudience, setFilterAudience] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // Filter events
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "" || event.status === filterStatus;
    const matchesAudience = filterAudience === "" || event.targetAudience === filterAudience;
    return matchesSearch && matchesStatus && matchesAudience;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400";
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400";
      case "expired":
        return "bg-gray-100 text-gray-800 dark:bg-gray-500/10 dark:text-gray-400";
      case "draft":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-500/10 dark:text-gray-400";
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getAudienceText = (audience: string) => {
    switch (audience) {
      case "all":
        return "All Residents";
      case "specific_buildings":
        return "Specific Buildings";
      case "specific_apartments":
        return "Specific Apartments";
      default:
        return audience;
    }
  };

  const handleAddEvent = () => {
    setEditingEvent(null);
    setShowModal(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setShowModal(true);
  };

  const handleSaveEvent = (eventData: Partial<Event>) => {
    if (editingEvent) {
      // Update existing event
      setEvents(prev =>
        prev.map(event =>
          event.id === editingEvent.id
            ? { ...event, ...eventData, updatedAt: new Date().toISOString() }
            : event
        )
      );
    } else {
      // Add new event
      const newEvent: Event = {
        id: Math.max(...events.map(e => e.id)) + 1,
        title: eventData.title || "",
        description: eventData.description || "",
        targetAudience: eventData.targetAudience || "all",
        startDate: eventData.startDate || "",
        endDate: eventData.endDate || "",
        textContent: eventData.textContent || "",
        status: eventData.status || "draft",
        createdBy: "Current User", // In real app, get from auth context
        createdAt: new Date().toISOString(),
      };
      setEvents(prev => [...prev, newEvent]);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-black dark:text-white">
          Events Management
        </h1>
        <button
          onClick={handleAddEvent}
          className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Create Event
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
              placeholder="Search by title, description, or creator..."
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-black outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
            />
          </div>

          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-black outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="scheduled">Scheduled</option>
              <option value="expired">Expired</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div>
            <select
              value={filterAudience}
              onChange={(e) => setFilterAudience(e.target.value)}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-black outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
            >
              <option value="">All Audience</option>
              <option value="all">All Residents</option>
              <option value="specific_buildings">Specific Buildings</option>
              <option value="specific_apartments">Specific Apartments</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b border-stroke bg-gray-2 text-left dark:border-strokedark dark:bg-meta-4">
                <th className="px-4 py-4 text-xs font-semibold uppercase text-gray-700 dark:text-gray-300">
                  ID
                </th>
                <th className="px-4 py-4 text-xs font-semibold uppercase text-gray-700 dark:text-gray-300">
                  Title
                </th>
                <th className="px-4 py-4 text-xs font-semibold uppercase text-gray-700 dark:text-gray-300">
                  Description
                </th>
                <th className="px-4 py-4 text-xs font-semibold uppercase text-gray-700 dark:text-gray-300">
                  Start Date
                </th>
                <th className="px-4 py-4 text-xs font-semibold uppercase text-gray-700 dark:text-gray-300">
                  End Date
                </th>
                <th className="px-4 py-4 text-xs font-semibold uppercase text-gray-700 dark:text-gray-300">
                  Target Audience
                </th>
                <th className="px-4 py-4 text-xs font-semibold uppercase text-gray-700 dark:text-gray-300">
                  Created By
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
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <tr
                    key={event.id}
                    className="border-b border-stroke dark:border-strokedark hover:bg-gray-2 dark:hover:bg-meta-4"
                  >
                    <td className="px-4 py-4">
                      <p className="text-sm font-medium text-black dark:text-white">
                        #{event.id}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-medium text-black dark:text-white">
                        {event.title}
                      </p>
                    </td>
                    <td className="px-4 py-4 max-w-xs">
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {event.description}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-black dark:text-white">
                        {new Date(event.startDate).toLocaleDateString("en-US")}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-black dark:text-white">
                        {new Date(event.endDate).toLocaleDateString("en-US")}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800 dark:bg-purple-500/10 dark:text-purple-400">
                        {getAudienceText(event.targetAudience)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-black dark:text-white">
                        {event.createdBy}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                          event.status,
                        )}`}
                      >
                        {getStatusText(event.status)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
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
                          onClick={() => handleEditEvent(event)}
                          className="p-1 text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
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
                          className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
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
                  <td colSpan={9} className="px-4 py-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      No events found
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
            Showing {filteredEvents.length} events
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

      {/* Event Modal */}
      {showModal && (
        <EventModal
          event={editingEvent}
          onClose={() => setShowModal(false)}
          onSave={handleSaveEvent}
        />
      )}
    </div>
  );
}
