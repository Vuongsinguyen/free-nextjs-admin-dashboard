"use client";

import { useState, useEffect } from "react";

interface Announcement {
  id: number;
  title: string;
  content: string;
  category: string;
  priority: string;
  publishDate: string;
  expiryDate?: string;
  author: string;
  department: string;
  status: string;
  views: number;
  targetAudience: string;
}

const mockData: Announcement[] = [
  {
    id: 1,
    title: "Water Supply Interruption - November 10th",
    content: "Water supply will be temporarily interrupted on November 10th from 8:00 AM to 2:00 PM",
    category: "maintenance",
    priority: "high",
    publishDate: "2025-10-28",
    expiryDate: "2025-11-10",
    author: "John Smith",
    department: "Maintenance",
    status: "active",
    views: 234,
    targetAudience: "all"
  },
  {
    id: 2,
    title: "New Security Measures",
    content: "Starting November 1st, all residents must use access cards",
    category: "policy",
    priority: "urgent",
    publishDate: "2025-10-25",
    author: "Sarah Johnson",
    department: "Security",
    status: "active",
    views: 567,
    targetAudience: "all"
  },
  {
    id: 3,
    title: "Lunar New Year Celebration",
    content: "Join us for a special celebration on November 15th at 5:00 PM",
    category: "event",
    priority: "medium",
    publishDate: "2025-10-27",
    expiryDate: "2025-11-15",
    author: "David Lee",
    department: "Community",
    status: "active",
    views: 189,
    targetAudience: "residents"
  }
];

export default function AnnouncementsPage() {
  const [data] = useState<Announcement[]>(mockData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = data.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCategory, filterStatus]);

  const handleAddAnnouncement = () => {
    // TODO: Implement add announcement modal
    console.log("Add announcement clicked");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Announcements Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage and publish announcements for residents and staff
          </p>
        </div>
        <button
          onClick={handleAddAnnouncement}
          className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Create Announcement
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {data.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Total Announcements
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-green-600">
            {data.filter(a => a.status === "active").length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Active Announcements
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-orange-600">
            {data.filter(a => a.priority === "urgent").length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Urgent Priority
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-blue-600">
            {data.reduce((sum, a) => sum + a.views, 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Total Views
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
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
              <option value="event">Event</option>
              <option value="policy">Policy</option>
            </select>
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Author</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Publish Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Views</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {paginatedData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">#{item.id}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{item.content}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400 capitalize">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                      item.priority === 'urgent' ? 'bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400' :
                      item.priority === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-500/10 dark:text-orange-400' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400'
                    }`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400 capitalize">
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.author}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.publishDate}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-900 dark:text-white">{item.views}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button className="p-1 text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
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
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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
