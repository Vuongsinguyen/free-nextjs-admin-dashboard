"use client";

import { useState, useEffect, useMemo } from "react";
import { useLocale } from "@/context/LocaleContext";

interface MaintenanceSchedule {
  id: number;
  taskName: string;
  description: string;
  category: string;
  frequency: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
  location: string;
  assignedTeam: string;
  nextDueDate: string;
  lastCompleted?: string;
  estimatedDuration: number;
  priority: "low" | "medium" | "high";
  status: "active" | "paused" | "completed" | "overdue";
  cost: number;
  checklist?: string[];
}

export default function MaintenanceSchedulePage() {
  const { t } = useLocale();
  const [schedules, setSchedules] = useState<MaintenanceSchedule[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<MaintenanceSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [frequencyFilter, setFrequencyFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const loadSchedules = () => {
      setIsLoading(true);
      setTimeout(() => {
        const mockSchedules: MaintenanceSchedule[] = [
          {
            id: 1,
            taskName: "HVAC System Inspection",
            description: "Monthly inspection and filter replacement for all HVAC units",
            category: "HVAC",
            frequency: "monthly",
            location: "All Buildings",
            assignedTeam: "HVAC Maintenance Team",
            nextDueDate: "2025-11-01",
            lastCompleted: "2025-10-01",
            estimatedDuration: 480,
            priority: "high",
            status: "active",
            cost: 5000000,
            checklist: ["Check air filters", "Inspect ductwork", "Test thermostats", "Clean coils"],
          },
          {
            id: 2,
            taskName: "Elevator Safety Check",
            description: "Weekly elevator safety inspection and maintenance",
            category: "Elevator",
            frequency: "weekly",
            location: "Buildings A, B, C",
            assignedTeam: "Elevator Service Team",
            nextDueDate: "2025-10-30",
            lastCompleted: "2025-10-23",
            estimatedDuration: 120,
            priority: "high",
            status: "active",
            cost: 2000000,
            checklist: ["Check cables", "Test emergency brake", "Inspect doors", "Lubricate parts"],
          },
          {
            id: 3,
            taskName: "Fire Alarm System Test",
            description: "Quarterly fire alarm system testing and battery replacement",
            category: "Fire Safety",
            frequency: "quarterly",
            location: "All Buildings",
            assignedTeam: "Fire Safety Team",
            nextDueDate: "2025-11-15",
            lastCompleted: "2025-08-15",
            estimatedDuration: 360,
            priority: "high",
            status: "active",
            cost: 3000000,
            checklist: ["Test all alarms", "Check sprinkler system", "Replace batteries", "Verify panel"],
          },
          {
            id: 4,
            taskName: "Pool Cleaning & Maintenance",
            description: "Daily pool water testing and cleaning",
            category: "Recreation",
            frequency: "daily",
            location: "Swimming Pool Area",
            assignedTeam: "Pool Maintenance",
            nextDueDate: "2025-10-30",
            lastCompleted: "2025-10-29",
            estimatedDuration: 60,
            priority: "medium",
            status: "active",
            cost: 500000,
            checklist: ["Test pH levels", "Clean filters", "Skim surface", "Check chemicals"],
          },
          {
            id: 5,
            taskName: "Parking Lot Lighting",
            description: "Monthly inspection of all parking lot lights",
            category: "Electrical",
            frequency: "monthly",
            location: "Parking Lots",
            assignedTeam: "Electrical Team",
            nextDueDate: "2025-10-28",
            lastCompleted: "2025-09-28",
            estimatedDuration: 180,
            priority: "medium",
            status: "overdue",
            cost: 1500000,
          },
          {
            id: 6,
            taskName: "Plumbing System Check",
            description: "Quarterly inspection of all plumbing systems",
            category: "Plumbing",
            frequency: "quarterly",
            location: "All Buildings",
            assignedTeam: "Plumbing Team",
            nextDueDate: "2025-12-01",
            lastCompleted: "2025-09-01",
            estimatedDuration: 240,
            priority: "medium",
            status: "active",
            cost: 2500000,
            checklist: ["Check for leaks", "Test water pressure", "Inspect pipes", "Clean drains"],
          },
          {
            id: 7,
            taskName: "Landscape Maintenance",
            description: "Weekly lawn mowing and garden maintenance",
            category: "Landscaping",
            frequency: "weekly",
            location: "Garden Areas",
            assignedTeam: "Landscaping Team",
            nextDueDate: "2025-11-02",
            lastCompleted: "2025-10-26",
            estimatedDuration: 300,
            priority: "low",
            status: "active",
            cost: 1000000,
          },
          {
            id: 8,
            taskName: "Generator Testing",
            description: "Monthly backup generator testing and maintenance",
            category: "Power Systems",
            frequency: "monthly",
            location: "Generator Room",
            assignedTeam: "Technical Team",
            nextDueDate: "2025-11-05",
            lastCompleted: "2025-10-05",
            estimatedDuration: 120,
            priority: "high",
            status: "active",
            cost: 1800000,
            checklist: ["Run generator", "Check fuel", "Test auto-start", "Inspect connections"],
          },
          {
            id: 9,
            taskName: "Security Camera Maintenance",
            description: "Quarterly cleaning and testing of all security cameras",
            category: "Security",
            frequency: "quarterly",
            location: "All Buildings",
            assignedTeam: "Security Team",
            nextDueDate: "2025-11-20",
            lastCompleted: "2025-08-20",
            estimatedDuration: 240,
            priority: "medium",
            status: "active",
            cost: 2000000,
          },
          {
            id: 10,
            taskName: "Annual Building Inspection",
            description: "Comprehensive annual building safety inspection",
            category: "General",
            frequency: "yearly",
            location: "All Buildings",
            assignedTeam: "Building Inspector",
            nextDueDate: "2026-01-15",
            lastCompleted: "2025-01-15",
            estimatedDuration: 960,
            priority: "high",
            status: "active",
            cost: 15000000,
          },
        ];
        setSchedules(mockSchedules);
        setIsLoading(false);
      }, 800);
    };

    loadSchedules();
  }, []);

  useEffect(() => {
    let result = [...schedules];

    if (searchTerm) {
      result = result.filter(
        (schedule) =>
          schedule.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          schedule.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          schedule.assignedTeam.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter) {
      result = result.filter((schedule) => schedule.category === categoryFilter);
    }

    if (frequencyFilter) {
      result = result.filter((schedule) => schedule.frequency === frequencyFilter);
    }

    if (statusFilter) {
      result = result.filter((schedule) => schedule.status === statusFilter);
    }

    setFilteredSchedules(result);
    setCurrentPage(1);
  }, [schedules, searchTerm, categoryFilter, frequencyFilter, statusFilter]);

  const paginatedSchedules = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSchedules.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSchedules, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredSchedules.length / itemsPerPage);

  const getStatusBadge = (status: MaintenanceSchedule["status"]) => {
    const badges = {
      active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      paused: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      completed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      overdue: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    };
    return badges[status];
  };

  const getPriorityBadge = (priority: MaintenanceSchedule["priority"]) => {
    const badges = {
      low: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    };
    return badges[priority];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const uniqueCategories = Array.from(new Set(schedules.map((s) => s.category)));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading schedules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Maintenance Schedule
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage preventive maintenance schedules and recurring tasks
          </p>
        </div>
        <button className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          + Add Schedule
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by task, location, or team..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Frequency
            </label>
            <select
              value={frequencyFilter}
              onChange={(e) => setFrequencyFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            >
              <option value="">All Frequencies</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
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
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {schedules.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Total Schedules</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-green-600">
            {schedules.filter((s) => s.status === "active").length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Active</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-red-600">
            {schedules.filter((s) => s.status === "overdue").length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Overdue</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-blue-600">
            {schedules.filter((s) => s.priority === "high").length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">High Priority</div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Task Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Frequency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Assigned Team
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Next Due
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedSchedules.map((schedule) => (
                <tr key={schedule.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {schedule.taskName}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                      {schedule.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-300">
                      {schedule.category}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-300 capitalize">
                      {schedule.frequency}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-gray-300">
                      {schedule.location}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-gray-300">
                      {schedule.assignedTeam}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {formatDate(schedule.nextDueDate)}
                    </div>
                    {schedule.lastCompleted && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Last: {formatDate(schedule.lastCompleted)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-300">
                      {schedule.estimatedDuration >= 60
                        ? `${Math.floor(schedule.estimatedDuration / 60)}h ${
                            schedule.estimatedDuration % 60
                          }m`
                        : `${schedule.estimatedDuration}m`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityBadge(
                        schedule.priority
                      )}`}
                    >
                      {schedule.priority.charAt(0).toUpperCase() + schedule.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                        schedule.status
                      )}`}
                    >
                      {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(schedule.cost)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">
                        View
                      </button>
                      <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 px-6 py-3 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Showing {(currentPage - 1) * itemsPerPage + 1} -{" "}
            {Math.min(currentPage * itemsPerPage, filteredSchedules.length)} of{" "}
            {filteredSchedules.length} results
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
