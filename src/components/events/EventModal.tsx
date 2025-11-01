"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

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

interface EventModalProps {
  event?: Event | null;
  onClose: () => void;
  onSave: () => void;
}

const audienceOptions = [
  { value: "all", label: "All Residents" },
  { value: "specific_buildings", label: "Specific Buildings" },
  { value: "specific_apartments", label: "Specific Apartments" },
];

const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "scheduled", label: "Scheduled" },
  { value: "active", label: "Active" },
];

export default function EventModal({ event, onClose, onSave }: EventModalProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    target_audience: "all" as "all" | "specific_buildings" | "specific_apartments",
    start_date: "",
    end_date: "",
    text_content: "",
    status: "draft" as "active" | "scheduled" | "expired" | "draft",
  });
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingPdfUrls, setExistingPdfUrls] = useState<string[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        target_audience: event.target_audience,
        start_date: event.start_date,
        end_date: event.end_date,
        text_content: event.text_content,
        status: event.status,
      });
      setExistingPdfUrls(event.pdf_files || []);
      setExistingImageUrls(event.image_files || []);
    } else {
      const today = new Date().toISOString().split("T")[0];
      setFormData({
        title: "",
        description: "",
        target_audience: "all",
        start_date: today,
        end_date: today,
        text_content: "",
        status: "draft",
      });
      setExistingPdfUrls([]);
      setExistingImageUrls([]);
    }
    setPdfFiles([]);
    setImageFiles([]);
    setErrors({});
  }, [event]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.start_date) {
      newErrors.start_date = "Start date is required";
    }

    if (!formData.end_date) {
      newErrors.end_date = "End date is required";
    }

    if (formData.start_date && formData.end_date && formData.start_date > formData.end_date) {
      newErrors.end_date = "End date must be after start date";
    }

    if (!formData.text_content.trim()) {
      newErrors.text_content = "Content is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadFiles = async (files: File[], folder: string): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { error } = await supabase.storage
        .from("events")
        .upload(filePath, file);

      if (error) {
        console.error(`Error uploading ${file.name}:`, error);
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("events")
        .getPublicUrl(filePath);

      uploadedUrls.push(publicUrl);
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!user?.email) {
      alert("You must be logged in to create/edit events");
      return;
    }

    setIsLoading(true);

    try {
      let uploadedPdfUrls: string[] = [];
      let uploadedImageUrls: string[] = [];

      if (pdfFiles.length > 0) {
        setUploadProgress("Uploading PDFs...");
        uploadedPdfUrls = await uploadFiles(pdfFiles, "pdfs");
      }

      if (imageFiles.length > 0) {
        setUploadProgress("Uploading images...");
        uploadedImageUrls = await uploadFiles(imageFiles, "images");
      }

      const allPdfUrls = [...existingPdfUrls, ...uploadedPdfUrls];
      const allImageUrls = [...existingImageUrls, ...uploadedImageUrls];

      setUploadProgress("Saving event...");

      const eventData = {
        ...formData,
        pdf_files: allPdfUrls.length > 0 ? allPdfUrls : null,
        image_files: allImageUrls.length > 0 ? allImageUrls : null,
        created_by: user.email,
      };

      if (event) {
        const { error } = await supabase
          .from("events")
          .update(eventData as never)
          .eq("id", event.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("events")
          .insert([eventData as never]);

        if (error) throw error;
      }

      setUploadProgress("");
      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving event:", error);
      alert(`Error saving event: ${error instanceof Error ? error.message : "Unknown error"}`);
      setUploadProgress("");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter(file => file.type === "application/pdf");
      setPdfFiles(prev => [...prev, ...files]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter(file => file.type.startsWith("image/"));
      setImageFiles(prev => [...prev, ...files]);
    }
  };

  const removePdfFile = (index: number) => {
    setPdfFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeImageFile = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingPdf = (index: number) => {
    setExistingPdfUrls(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl my-8">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {event ? "Edit Event" : "Create New Event"}
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
            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white ${
                    errors.title ? "border-red-300 dark:border-red-600" : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="Enter event title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white ${
                    errors.description ? "border-red-300 dark:border-red-600" : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="Enter event description"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Audience
                </label>
                <select
                  value={formData.target_audience}
                  onChange={(e) => setFormData({ ...formData, target_audience: e.target.value as "all" | "specific_buildings" | "specific_apartments" })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
                >
                  {audienceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white ${
                      errors.start_date ? "border-red-300 dark:border-red-600" : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                  {errors.start_date && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.start_date}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white ${
                      errors.end_date ? "border-red-300 dark:border-red-600" : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                  {errors.end_date && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.end_date}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Event Content <span className="text-red-500">*</span>
                </label>
                <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                  <textarea
                    value={formData.text_content}
                    onChange={(e) => setFormData({ ...formData, text_content: e.target.value })}
                    rows={8}
                    className={`w-full px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white border-0 ${
                      errors.text_content ? "ring-2 ring-red-300 dark:ring-red-600" : ""
                    }`}
                    placeholder={`Enter detailed event content here...

You can include:
• Location details
• Time information
• Registration requirements
• Contact information
• Any other relevant details`}
                  />
                </div>
                {errors.text_content && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.text_content}</p>
                )}
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Detailed information about the event
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  PDF Documents
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handlePdfChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
                />
                
                {existingPdfUrls.length > 0 && (
                  <div className="mt-2 space-y-2">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Existing PDFs:</p>
                    {existingPdfUrls.map((url, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                        <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1">
                          📄 {url.split("/").pop()}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeExistingPdf(index)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {pdfFiles.length > 0 && (
                  <div className="mt-2 space-y-2">
                    <p className="text-xs text-gray-600 dark:text-gray-400">New PDFs to upload:</p>
                    {pdfFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          📄 {file.name} ({(file.size / 1024).toFixed(2)} KB)
                        </span>
                        <button
                          type="button"
                          onClick={() => removePdfFile(index)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
                />
                
                {existingImageUrls.length > 0 && (
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {existingImageUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt={`Event ${index + 1}`} className="w-full h-24 object-cover rounded" />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {imageFiles.length > 0 && (
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {imageFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt={file.name} 
                          className="w-full h-24 object-cover rounded border-2 border-blue-300" 
                        />
                        <button
                          type="button"
                          onClick={() => removeImageFile(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ✕
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                          {file.name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as "active" | "scheduled" | "expired" | "draft" })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {uploadProgress && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-blue-700 dark:text-blue-400">{uploadProgress}</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                {event ? "Update Event" : "Create Event"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
