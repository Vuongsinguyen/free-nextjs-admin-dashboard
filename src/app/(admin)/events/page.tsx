"use client";

import { useState, useEffect } from "react";
import EventModal from "@/components/events/EventModal";
import { supabase } from "@/lib/supabase";

interface Event {
  id: string;
  title: string;
  description: string;
  target_audience: "all" | "specific_buildings" | "specific_apartments";
  target_buildings?: string[];
  target_apartments?: string[];
  start_date: string;
  end_date: string;
  shop_name?: string;
  shop_type?: "in_building" | "external";
  text_content: string;
  pdf_files?: string[];
  image_files?: string[];
  status: "active" | "scheduled" | "expired" | "draft";
  created_by: string;
  created_at: string;
  updated_at: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterAudience, setFilterAudience] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // Fetch events from database
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeed = async () => {
    try {
      setSeeding(true);
      const response = await fetch('/api/events/seed', {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to seed events');
      
      const result = await response.json();
      console.log('Seed result:', result);
      
      // Refresh the events list
      await fetchEvents();
    } catch (error) {
      console.error('Error seeding events:', error);
    } finally {
      setSeeding(false);
    }
  };

  // Filter events
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.created_by.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "" || event.status === filterStatus;
    const matchesAudience = filterAudience === "" || event.target_audience === filterAudience;
    return matchesSearch && matchesStatus && matchesAudience;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "expired":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      case "draft":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
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

  const handleSaveEvent = () => {
    // Refresh events list after save
    fetchEvents();
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-black dark:text-white">
          Events Management
        </h1>
        <div className="flex items-center gap-3">
          {events.length === 0 && !loading && (
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {seeding ? 'Seeding...' : 'Seed Sample Data'}
            </button>
          )}
          <button
            onClick={handleAddEvent}
            className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            + Create Event
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-lg border border-gray-200 bg-white px-6 py-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, description, or creator..."
              className="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2.5 text-black outline-none focus:border-brand-500 dark:border-gray-800 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2.5 text-black outline-none focus:border-brand-500 dark:border-gray-800 dark:bg-gray-800 dark:text-white"
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
              className="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2.5 text-black outline-none focus:border-brand-500 dark:border-gray-800 dark:bg-gray-800 dark:text-white"
            >
              <option value="">All Audience</option>
              <option value="all">All Residents</option>
              <option value="specific_buildings">Specific Buildings</option>
              <option value="specific_apartments">Specific Apartments</option>
            </select>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="py-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">Loading events...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-left dark:border-gray-800 dark:bg-gray-800">
                  <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Title
                  </th>
                  <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Description
                  </th>
                  <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    End Date
                  </th>
                  <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Target Audience
                  </th>
                  <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Created By
                  </th>
                  <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Status
                  </th>
                  <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-900">
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((event) => (
                    <tr
                      key={event.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-black dark:text-white">
                          {event.title}
                        </p>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {event.description}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-black dark:text-white">
                          {new Date(event.start_date).toLocaleDateString("en-US")}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-black dark:text-white">
                          {new Date(event.end_date).toLocaleDateString("en-US")}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                          {getAudienceText(event.target_audience)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-black dark:text-white">
                          {event.created_by}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                            event.status,
                          )}`}
                        >
                          {getStatusText(event.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
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
                            onClick={() => handleEditEvent(event)}
                            className="p-1.5 text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded"
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
                            className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
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
                    <td colSpan={8} className="px-6 py-8 text-center">
                      <p className="text-gray-500 dark:text-gray-400">
                        No events found
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredEvents.length > 0 && (
          <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
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
