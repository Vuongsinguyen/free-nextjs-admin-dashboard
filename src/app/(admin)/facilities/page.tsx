"use client";

import { useState, useEffect, useMemo } from "react";

interface Facility {
  id: number;
  name: string;
  category: string;
  location: string;
  capacity: number;
  currentOccupancy: number;
  status: "available" | "occupied" | "maintenance" | "closed";
  amenities: string[];
  pricePerHour: number;
  manager: string;
  lastMaintenance: string;
  nextMaintenance: string;
  rating: number;
  totalBookings: number;
}

export default function FacilitiesPage() {
  // const { t } = useLocale();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Load facilities
  useEffect(() => {
    const loadFacilities = () => {
      setIsLoading(true);
      setTimeout(() => {
        const mockFacilities: Facility[] = [
          {
            id: 1,
            name: "Swimming Pool A",
            category: "Sports & Recreation",
            location: "Building A - Floor 1",
            capacity: 50,
            currentOccupancy: 23,
            status: "available",
            amenities: ["Heated Pool", "Changing Rooms", "Showers", "Lockers"],
            pricePerHour: 150000,
            manager: "Nguyen Van A",
            lastMaintenance: "2025-10-15",
            nextMaintenance: "2025-11-15",
            rating: 4.5,
            totalBookings: 234,
          },
          {
            id: 2,
            name: "Gym & Fitness Center",
            category: "Sports & Recreation",
            location: "Building B - Floor 2",
            capacity: 80,
            currentOccupancy: 65,
            status: "occupied",
            amenities: ["Cardio Equipment", "Weight Training", "Personal Trainer", "Sauna"],
            pricePerHour: 200000,
            manager: "Tran Thi B",
            lastMaintenance: "2025-10-20",
            nextMaintenance: "2025-11-20",
            rating: 4.8,
            totalBookings: 567,
          },
          {
            id: 3,
            name: "Meeting Room 101",
            category: "Meeting & Events",
            location: "Building A - Floor 3",
            capacity: 20,
            currentOccupancy: 0,
            status: "available",
            amenities: ["Projector", "Whiteboard", "Video Conference", "WiFi"],
            pricePerHour: 300000,
            manager: "Le Van C",
            lastMaintenance: "2025-10-25",
            nextMaintenance: "2025-12-25",
            rating: 4.3,
            totalBookings: 189,
          },
          {
            id: 4,
            name: "Tennis Court 1",
            category: "Sports & Recreation",
            location: "Outdoor - East Wing",
            capacity: 4,
            currentOccupancy: 0,
            status: "maintenance",
            amenities: ["Night Lighting", "Equipment Rental", "Seating Area"],
            pricePerHour: 100000,
            manager: "Pham Thi D",
            lastMaintenance: "2025-10-28",
            nextMaintenance: "2025-10-30",
            rating: 4.2,
            totalBookings: 145,
          },
          {
            id: 5,
            name: "Conference Hall",
            category: "Meeting & Events",
            location: "Building C - Floor 5",
            capacity: 200,
            currentOccupancy: 150,
            status: "occupied",
            amenities: ["Stage", "Sound System", "Projector", "Catering Service", "WiFi"],
            pricePerHour: 1000000,
            manager: "Hoang Van E",
            lastMaintenance: "2025-10-10",
            nextMaintenance: "2025-11-10",
            rating: 4.9,
            totalBookings: 89,
          },
          {
            id: 6,
            name: "Kids Playground",
            category: "Recreation",
            location: "Outdoor - West Wing",
            capacity: 30,
            currentOccupancy: 12,
            status: "available",
            amenities: ["Slides", "Swings", "Climbing Frame", "Safety Padding", "Restrooms"],
            pricePerHour: 50000,
            manager: "Nguyen Thi F",
            lastMaintenance: "2025-10-22",
            nextMaintenance: "2025-11-22",
            rating: 4.6,
            totalBookings: 312,
          },
          {
            id: 7,
            name: "Yoga Studio",
            category: "Wellness",
            location: "Building B - Floor 4",
            capacity: 25,
            currentOccupancy: 0,
            status: "available",
            amenities: ["Yoga Mats", "Meditation Room", "Changing Rooms", "Air Conditioning"],
            pricePerHour: 180000,
            manager: "Tran Van G",
            lastMaintenance: "2025-10-18",
            nextMaintenance: "2025-11-18",
            rating: 4.7,
            totalBookings: 278,
          },
          {
            id: 8,
            name: "BBQ Area",
            category: "Recreation",
            location: "Outdoor - Rooftop",
            capacity: 40,
            currentOccupancy: 0,
            status: "closed",
            amenities: ["BBQ Grills", "Tables & Chairs", "Sink", "Covered Area"],
            pricePerHour: 250000,
            manager: "Le Thi H",
            lastMaintenance: "2025-10-05",
            nextMaintenance: "2025-11-05",
            rating: 4.4,
            totalBookings: 156,
          },
          {
            id: 9,
            name: "Library & Study Room",
            category: "Education",
            location: "Building A - Floor 2",
            capacity: 60,
            currentOccupancy: 34,
            status: "available",
            amenities: ["Books", "Private Study Rooms", "WiFi", "Printing Service", "Coffee Machine"],
            pricePerHour: 0,
            manager: "Pham Van I",
            lastMaintenance: "2025-10-12",
            nextMaintenance: "2025-11-12",
            rating: 4.8,
            totalBookings: 445,
          },
          {
            id: 10,
            name: "Basketball Court",
            category: "Sports & Recreation",
            location: "Outdoor - North Wing",
            capacity: 10,
            currentOccupancy: 8,
            status: "occupied",
            amenities: ["Night Lighting", "Scoreboard", "Seating", "Water Fountain"],
            pricePerHour: 120000,
            manager: "Hoang Thi K",
            lastMaintenance: "2025-10-08",
            nextMaintenance: "2025-11-08",
            rating: 4.5,
            totalBookings: 298,
          },
        ];
        setFacilities(mockFacilities);
        setIsLoading(false);
      }, 800);
    };

    loadFacilities();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...facilities];

    if (searchTerm) {
      result = result.filter(facility =>
        facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        facility.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        facility.manager.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter) {
      result = result.filter(facility => facility.category === categoryFilter);
    }

    setFilteredFacilities(result);
    setCurrentPage(1);
  }, [facilities, searchTerm, categoryFilter]);

  // Pagination
  const paginatedFacilities = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredFacilities.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredFacilities, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredFacilities.length / itemsPerPage);

  const uniqueCategories = Array.from(new Set(facilities.map(f => f.category)));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading facilities...</p>
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
            Facilities Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            {/* Description removed as requested */}
          </p>
        </div>
        <button className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          + Add Facility
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by name, location, or manager..."
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
              {uniqueCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Facilities Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Facility Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedFacilities.map((facility) => (
                <tr key={facility.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {facility.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {facility.amenities.slice(0, 2).join(", ")}
                      {facility.amenities.length > 2 && ` +${facility.amenities.length - 2}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-300">
                      {facility.category}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-gray-300">
                      {facility.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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
            {Math.min(currentPage * itemsPerPage, filteredFacilities.length)} of{" "}
            {filteredFacilities.length} results
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
