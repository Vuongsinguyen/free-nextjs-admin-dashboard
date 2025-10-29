"use client";

import { useState } from "react";
import { useLocale } from "@/context/LocaleContext";

export default function NotificationSettingsPage() {
  const { t } = useLocale();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    // Email Notifications
    emailNewUser: true,
    emailNewBooking: true,
    emailMaintenanceRequest: true,
    emailPaymentReceived: true,
    emailInvoiceGenerated: true,
    emailSystemAlerts: true,
    
    // SMS Notifications
    smsNewBooking: false,
    smsMaintenanceUrgent: true,
    smsPaymentReminder: true,
    smsSecurityAlert: true,
    
    // Push Notifications
    pushNewMessage: true,
    pushNewAnnouncement: true,
    pushEventReminder: true,
    pushMaintenanceUpdate: true,
    
    // In-App Notifications
    inAppAll: true,
    inAppMessages: true,
    inAppBookings: true,
    inAppPayments: true,
    
    // Notification Preferences
    notificationSound: true,
    desktopNotifications: true,
    dailyDigest: true,
    weeklyReport: false,
    digestTime: "09:00",
    
    // Email Settings
    emailFrom: "noreply@spm.com",
    emailReplyTo: "support@spm.com",
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUsername: "admin@spm.com",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Notification settings saved successfully!");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Notification Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Manage your notification preferences and delivery channels
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Notifications */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Email Notifications
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700 dark:text-gray-300">
                New User Registration
              </label>
              <input
                type="checkbox"
                name="emailNewUser"
                checked={formData.emailNewUser}
                onChange={handleChange}
                className="w-4 h-4 text-brand-600 bg-gray-100 border-gray-300 rounded focus:ring-brand-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700 dark:text-gray-300">
                New Booking Request
              </label>
              <input
                type="checkbox"
                name="emailNewBooking"
                checked={formData.emailNewBooking}
                onChange={handleChange}
                className="w-4 h-4 text-brand-600 bg-gray-100 border-gray-300 rounded focus:ring-brand-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700 dark:text-gray-300">
                Maintenance Request
              </label>
              <input
                type="checkbox"
                name="emailMaintenanceRequest"
                checked={formData.emailMaintenanceRequest}
                onChange={handleChange}
                className="w-4 h-4 text-brand-600 bg-gray-100 border-gray-300 rounded focus:ring-brand-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700 dark:text-gray-300">
                Payment Received
              </label>
              <input
                type="checkbox"
                name="emailPaymentReceived"
                checked={formData.emailPaymentReceived}
                onChange={handleChange}
                className="w-4 h-4 text-brand-600 bg-gray-100 border-gray-300 rounded focus:ring-brand-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700 dark:text-gray-300">
                Invoice Generated
              </label>
              <input
                type="checkbox"
                name="emailInvoiceGenerated"
                checked={formData.emailInvoiceGenerated}
                onChange={handleChange}
                className="w-4 h-4 text-brand-600 bg-gray-100 border-gray-300 rounded focus:ring-brand-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700 dark:text-gray-300">
                System Alerts
              </label>
              <input
                type="checkbox"
                name="emailSystemAlerts"
                checked={formData.emailSystemAlerts}
                onChange={handleChange}
                className="w-4 h-4 text-brand-600 bg-gray-100 border-gray-300 rounded focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* SMS Notifications */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            SMS Notifications
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700 dark:text-gray-300">
                New Booking Request
              </label>
              <input
                type="checkbox"
                name="smsNewBooking"
                checked={formData.smsNewBooking}
                onChange={handleChange}
                className="w-4 h-4 text-brand-600 bg-gray-100 border-gray-300 rounded focus:ring-brand-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700 dark:text-gray-300">
                Urgent Maintenance
              </label>
              <input
                type="checkbox"
                name="smsMaintenanceUrgent"
                checked={formData.smsMaintenanceUrgent}
                onChange={handleChange}
                className="w-4 h-4 text-brand-600 bg-gray-100 border-gray-300 rounded focus:ring-brand-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700 dark:text-gray-300">
                Payment Reminder
              </label>
              <input
                type="checkbox"
                name="smsPaymentReminder"
                checked={formData.smsPaymentReminder}
                onChange={handleChange}
                className="w-4 h-4 text-brand-600 bg-gray-100 border-gray-300 rounded focus:ring-brand-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700 dark:text-gray-300">
                Security Alerts
              </label>
              <input
                type="checkbox"
                name="smsSecurityAlert"
                checked={formData.smsSecurityAlert}
                onChange={handleChange}
                className="w-4 h-4 text-brand-600 bg-gray-100 border-gray-300 rounded focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Push Notifications */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Push Notifications
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700 dark:text-gray-300">
                New Messages
              </label>
              <input
                type="checkbox"
                name="pushNewMessage"
                checked={formData.pushNewMessage}
                onChange={handleChange}
                className="w-4 h-4 text-brand-600 bg-gray-100 border-gray-300 rounded focus:ring-brand-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700 dark:text-gray-300">
                New Announcements
              </label>
              <input
                type="checkbox"
                name="pushNewAnnouncement"
                checked={formData.pushNewAnnouncement}
                onChange={handleChange}
                className="w-4 h-4 text-brand-600 bg-gray-100 border-gray-300 rounded focus:ring-brand-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700 dark:text-gray-300">
                Event Reminders
              </label>
              <input
                type="checkbox"
                name="pushEventReminder"
                checked={formData.pushEventReminder}
                onChange={handleChange}
                className="w-4 h-4 text-brand-600 bg-gray-100 border-gray-300 rounded focus:ring-brand-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700 dark:text-gray-300">
                Maintenance Updates
              </label>
              <input
                type="checkbox"
                name="pushMaintenanceUpdate"
                checked={formData.pushMaintenanceUpdate}
                onChange={handleChange}
                className="w-4 h-4 text-brand-600 bg-gray-100 border-gray-300 rounded focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Notification Preferences
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="notificationSound"
                checked={formData.notificationSound}
                onChange={handleChange}
                className="w-4 h-4 text-brand-600 bg-gray-100 border-gray-300 rounded focus:ring-brand-500"
              />
              <label className="ms-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Enable Notification Sound
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="desktopNotifications"
                checked={formData.desktopNotifications}
                onChange={handleChange}
                className="w-4 h-4 text-brand-600 bg-gray-100 border-gray-300 rounded focus:ring-brand-500"
              />
              <label className="ms-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Desktop Notifications
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="dailyDigest"
                checked={formData.dailyDigest}
                onChange={handleChange}
                className="w-4 h-4 text-brand-600 bg-gray-100 border-gray-300 rounded focus:ring-brand-500"
              />
              <label className="ms-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Daily Digest Email
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="weeklyReport"
                checked={formData.weeklyReport}
                onChange={handleChange}
                className="w-4 h-4 text-brand-600 bg-gray-100 border-gray-300 rounded focus:ring-brand-500"
              />
              <label className="ms-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Weekly Report Email
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Digest Time
              </label>
              <input
                type="time"
                name="digestTime"
                value={formData.digestTime}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Email Configuration */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Email Configuration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                From Email
              </label>
              <input
                type="email"
                name="emailFrom"
                value={formData.emailFrom}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reply-To Email
              </label>
              <input
                type="email"
                name="emailReplyTo"
                value={formData.emailReplyTo}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                SMTP Host
              </label>
              <input
                type="text"
                name="smtpHost"
                value={formData.smtpHost}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                SMTP Port
              </label>
              <input
                type="text"
                name="smtpPort"
                value={formData.smtpPort}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                SMTP Username
              </label>
              <input
                type="text"
                name="smtpUsername"
                value={formData.smtpUsername}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
          >
            Test Email
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
