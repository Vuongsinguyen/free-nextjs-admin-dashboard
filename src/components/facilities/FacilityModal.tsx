"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Facility {
  id: string;
  name: string;
  category: string;
  location: string;
  capacity: number;
  current_occupancy: number;
  status: "available" | "occupied" | "maintenance" | "closed";
  amenities: string[];
  price_per_hour: number;
  manager: string;
  last_maintenance: string;
  next_maintenance: string;
  rating: number;
  total_bookings: number;
  description?: string;
  image_url?: string;
}

interface FacilityModalProps {
  facility?: Facility | null;
  onClose: () => void;
  onSave: () => void;
  viewMode?: boolean;
}

const categoryOptions = [
  "Sports & Recreation",
  "Meeting & Events",
  "Wellness",
  "Recreation",
  "Education",
  "Other"
];

const statusOptions = [
  { value: "available", label: "Available" },
  { value: "occupied", label: "Occupied" },
  { value: "maintenance", label: "Under Maintenance" },
  { value: "closed", label: "Closed" },
];

export default function FacilityModal({ facility, onClose, onSave, viewMode = false }: FacilityModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "Sports & Recreation",
    location: "",
    capacity: 0,
    current_occupancy: 0,
    status: "available" as "available" | "occupied" | "maintenance" | "closed",
    price_per_hour: 0,
    manager: "",
    last_maintenance: "",
    next_maintenance: "",
    rating: 0,
    total_bookings: 0,
    description: "",
    image_url: "",
  });
  const [amenities, setAmenities] = useState<string[]>([]);
  const [newAmenity, setNewAmenity] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (facility) {
      setFormData({
        name: facility.name,
        category: facility.category,
        location: facility.location,
        capacity: facility.capacity,
        current_occupancy: facility.current_occupancy,
        status: facility.status,
        price_per_hour: facility.price_per_hour,
        manager: facility.manager,
        last_maintenance: facility.last_maintenance,
        next_maintenance: facility.next_maintenance,
        rating: facility.rating,
        total_bookings: facility.total_bookings,
        description: facility.description || "",
        image_url: facility.image_url || "",
      });
      setAmenities(facility.amenities || []);
    } else {
      const today = new Date().toISOString().split("T")[0];
      setFormData({
        name: "",
        category: "Sports & Recreation",
        location: "",
        capacity: 0,
        current_occupancy: 0,
        status: "available",
        price_per_hour: 0,
        manager: "",
        last_maintenance: today,
        next_maintenance: today,
        rating: 0,
        total_bookings: 0,
        description: "",
        image_url: "",
      });
      setAmenities([]);
    }
    setErrors({});
  }, [facility]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Facility name is required";
    }
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }
    if (formData.capacity <= 0) {
      newErrors.capacity = "Capacity must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      const facilityData = {
        ...formData,
        amenities,
      };

      if (facility) {
        // Update existing facility
        const { error } = await supabase
          .from("facilities")
          .update(facilityData as never)
          .eq("id", facility.id);

        if (error) throw error;
      } else {
        // Create new facility
        const { error } = await supabase
          .from("facilities")
          .insert([facilityData as never]);

        if (error) throw error;
      }

      onSave();
      onClose();
    } catch (err: unknown) {
      const error = err as { message?: string; details?: string };
      console.error("Error saving facility:", error);
      alert(`Error saving facility: ${error?.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
      setAmenities([...amenities, newAmenity.trim()]);
      setNewAmenity("");
    }
  };

  const removeAmenity = (index: number) => {
    setAmenities(amenities.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[999999]">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {viewMode ? "View Facility Details" : facility ? "Edit Facility" : "Add New Facility"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Facility Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  readOnly={viewMode}
                  disabled={viewMode}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white ${
                    errors.name ? "border-red-300 dark:border-red-600" : "border-gray-300 dark:border-gray-600"
                  } ${viewMode ? "bg-gray-50 dark:bg-gray-800 cursor-not-allowed" : ""}`}
                  placeholder="e.g., Swimming Pool A"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  disabled={viewMode}
                  className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white ${viewMode ? "bg-gray-50 dark:bg-gray-800 cursor-not-allowed" : ""}`}
                >
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  readOnly={viewMode}
                  disabled={viewMode}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white ${
                    errors.location ? "border-red-300 dark:border-red-600" : "border-gray-300 dark:border-gray-600"
                  } ${viewMode ? "bg-gray-50 dark:bg-gray-800 cursor-not-allowed" : ""}`}
                  placeholder="e.g., Building A - Floor 1"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.location}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Manager
                </label>
                <input
                  type="text"
                  value={formData.manager}
                  onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                  readOnly={viewMode}
                  disabled={viewMode}
                  className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white ${viewMode ? "bg-gray-50 dark:bg-gray-800 cursor-not-allowed" : ""}`}
                  placeholder="e.g., John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Capacity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                  readOnly={viewMode}
                  disabled={viewMode}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white ${
                    errors.capacity ? "border-red-300 dark:border-red-600" : "border-gray-300 dark:border-gray-600"
                  } ${viewMode ? "bg-gray-50 dark:bg-gray-800 cursor-not-allowed" : ""}`}
                  placeholder="0"
                />
                {errors.capacity && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.capacity}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Occupancy
                </label>
                <input
                  type="number"
                  value={formData.current_occupancy}
                  onChange={(e) => setFormData({ ...formData, current_occupancy: parseInt(e.target.value) || 0 })}
                  readOnly={viewMode}
                  disabled={viewMode}
                  className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white ${viewMode ? "bg-gray-50 dark:bg-gray-800 cursor-not-allowed" : ""}`}
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price per Hour (VND)
                </label>
                <input
                  type="number"
                  value={formData.price_per_hour}
                  onChange={(e) => setFormData({ ...formData, price_per_hour: parseFloat(e.target.value) || 0 })}
                  readOnly={viewMode}
                  disabled={viewMode}
                  className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white ${viewMode ? "bg-gray-50 dark:bg-gray-800 cursor-not-allowed" : ""}`}
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as never })}
                  disabled={viewMode}
                  className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white ${viewMode ? "bg-gray-50 dark:bg-gray-800 cursor-not-allowed" : ""}`}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Maintenance
                </label>
                <input
                  type="date"
                  value={formData.last_maintenance}
                  onChange={(e) => setFormData({ ...formData, last_maintenance: e.target.value })}
                  readOnly={viewMode}
                  disabled={viewMode}
                  className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white ${viewMode ? "bg-gray-50 dark:bg-gray-800 cursor-not-allowed" : ""}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Next Maintenance
                </label>
                <input
                  type="date"
                  value={formData.next_maintenance}
                  onChange={(e) => setFormData({ ...formData, next_maintenance: e.target.value })}
                  readOnly={viewMode}
                  disabled={viewMode}
                  className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white ${viewMode ? "bg-gray-50 dark:bg-gray-800 cursor-not-allowed" : ""}`}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  readOnly={viewMode}
                  disabled={viewMode}
                  rows={3}
                  className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white ${viewMode ? "bg-gray-50 dark:bg-gray-800 cursor-not-allowed" : ""}`}
                  placeholder="Enter facility description..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amenities
                </label>
                {!viewMode && (
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newAmenity}
                      onChange={(e) => setNewAmenity(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addAmenity();
                        }
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Add amenity..."
                    />
                    <button
                      type="button"
                      onClick={addAmenity}
                      className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700"
                    >
                      Add
                    </button>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 rounded-full text-sm"
                    >
                      {amenity}
                      {!viewMode && (
                        <button
                          type="button"
                          onClick={() => removeAmenity(index)}
                          className="text-brand-600 hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-200"
                        >
                          ✕
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
              >
                {viewMode ? "Close" : "Cancel"}
              </button>
              {!viewMode && (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {facility ? "Update Facility" : "Add Facility"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
