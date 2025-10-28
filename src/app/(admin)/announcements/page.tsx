"use client";

import { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

interface Announcement {
  id: number;
  title: string;
  content: string;
  category: "general" | "maintenance" | "emergency" | "policy" | "event";
  priority: "low" | "medium" | "high" | "urgent";
  publishDate: string;
  expiryDate?: string;
  author: string;
  department: string;
  isActive: boolean;
  views: number;
}

const mockAnnouncements: Announcement[] = [
  {
    id: 1,
    title: "Water Supply Interruption - November 10th",
    content: "Water supply will be temporarily interrupted on November 10th from 8:00 AM to 2:00 PM for maintenance of the main water tank. Please store sufficient water in advance. We apologize for any inconvenience.",
    category: "maintenance",
    priority: "high",
    publishDate: "2025-10-28",
    expiryDate: "2025-11-10",
    author: "John Smith",
    department: "Maintenance Department",
    isActive: true,
    views: 234
  },
  {
    id: 2,
    title: "New Security Measures Effective November 1st",
    content: "Starting November 1st, 2025, all residents must use their access cards to enter the building. Guest registration is now mandatory at the front desk. New security cameras have been installed in common areas.",
    category: "policy",
    priority: "urgent",
    publishDate: "2025-10-25",
    author: "Sarah Johnson",
    department: "Security Department",
    isActive: true,
    views: 567
  },
  {
    id: 3,
    title: "Lunar New Year Community Celebration",
    content: "Join us for a special Lunar New Year celebration on November 15th at the Rooftop Garden from 5:00 PM. Enjoy traditional food, entertainment, and activities for the whole family. RSVP by November 10th.",
    category: "event",
    priority: "medium",
    publishDate: "2025-10-27",
    expiryDate: "2025-11-15",
    author: "David Lee",
    department: "Residents Committee",
    isActive: true,
    views: 189
  },
  {
    id: 4,
    title: "Parking Fee Adjustment",
    content: "Effective December 1st, monthly parking fees will be adjusted from 50,000 VND to 60,000 VND per vehicle. This adjustment is necessary to cover increased maintenance and security costs.",
    category: "policy",
    priority: "high",
    publishDate: "2025-10-26",
    author: "Michael Chen",
    department: "Building Management",
    isActive: true,
    views: 423
  },
  {
    id: 5,
    title: "Elevator B Maintenance Schedule",
    content: "Elevator B will undergo scheduled maintenance on November 12th from 8:00 AM to 5:00 PM. Please use Elevator A or the stairs during this time. Thank you for your cooperation.",
    category: "maintenance",
    priority: "medium",
    publishDate: "2025-10-27",
    expiryDate: "2025-11-12",
    author: "James Wilson",
    department: "Maintenance Team",
    isActive: true,
    views: 145
  },
  {
    id: 6,
    title: "Fire Safety Inspection Reminder",
    content: "Annual fire safety inspection will be conducted from November 5-7. Fire department officials will inspect all apartments. Please ensure smoke detectors are functional and fire extinguishers are accessible.",
    category: "emergency",
    priority: "urgent",
    publishDate: "2025-10-28",
    expiryDate: "2025-11-07",
    author: "Emily Brown",
    department: "Safety Department",
    isActive: true,
    views: 312
  },
  {
    id: 7,
    title: "Gym Equipment Upgrade Completed",
    content: "The gym has been upgraded with new cardio machines and weight equipment. All residents can now enjoy state-of-the-art fitness facilities. Operating hours: 6:00 AM - 10:00 PM daily.",
    category: "general",
    priority: "low",
    publishDate: "2025-10-24",
    author: "Robert Taylor",
    department: "Facilities Management",
    isActive: true,
    views: 198
  },
  {
    id: 8,
    title: "Monthly Management Fee Payment Due",
    content: "Reminder: Monthly management fees for November are due by November 5th. Late payment penalties will apply after the due date. You can pay via bank transfer or at the management office.",
    category: "general",
    priority: "high",
    publishDate: "2025-10-28",
    expiryDate: "2025-11-05",
    author: "Linda Martinez",
    department: "Accounting Department",
    isActive: true,
    views: 445
  }
];

export default function AnnouncementsPage() {
  const [announcements] = useState<Announcement[]>(mockAnnouncements);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || announcement.category === filterCategory;
    const matchesPriority = filterPriority === "all" || announcement.priority === filterPriority;
    return matchesSearch && matchesCategory && matchesPriority && announcement.isActive;
  });

  const stats = {
    total: announcements.filter(a => a.isActive).length,
    urgent: announcements.filter(a => a.priority === 'urgent' && a.isActive).length,
    high: announcements.filter(a => a.priority === 'high' && a.isActive).length,
    totalViews: announcements.reduce((sum, a) => sum + a.views, 0)
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      general: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
      maintenance: "bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100",
      emergency: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
      policy: "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100",
      event: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
      medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100",
      high: "bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100",
      urgent: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
    };
    return colors[priority as keyof typeof colors] || colors.low;
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'urgent') {
      return (
        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Announcements" />

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Active</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Urgent</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{stats.urgent}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">High Priority</p>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-1">{stats.high}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
          <p className="text-2xl font-bold text-brand-600 dark:text-brand-400 mt-1">{stats.totalViews}</p>
        </div>
      </div>

      {/* Filters & Create Button */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="md:col-span-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search announcements..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Categories</option>
              <option value="general">General</option>
              <option value="maintenance">Maintenance</option>
              <option value="emergency">Emergency</option>
              <option value="policy">Policy</option>
              <option value="event">Event</option>
            </select>
          </div>
          <div>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end">
          <button className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Announcement
          </button>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((announcement) => (
          <div
            key={announcement.id}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getCategoryColor(announcement.category)}`}>
                  {announcement.category}
                </span>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1 ${getPriorityColor(announcement.priority)}`}>
                  {getPriorityIcon(announcement.priority)}
                  {announcement.priority}
                </span>
                {announcement.expiryDate && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Expires: {announcement.expiryDate}
                  </span>
                )}
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {announcement.views}
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              {announcement.title}
            </h3>

            {/* Content */}
            <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
              {announcement.content}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {announcement.author}
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {announcement.department}
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {announcement.publishDate}
                </div>
              </div>
              <button className="px-4 py-2 text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium text-sm transition-colors">
                Read More →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredAnnouncements.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
          <p className="text-gray-600 dark:text-gray-400">No announcements found</p>
        </div>
      )}

      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredAnnouncements.length} of {announcements.filter(a => a.isActive).length} announcements
      </div>
    </div>
  );
}
