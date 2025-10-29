"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function TicketBusPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Update real-time clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Mock user data
  const userData = {
    name: "Nguyen Van A",
    dateOfBirth: "15/05/1990",
    idNumber: "001234567890",
    photo: "/images/user/owner.jpg",
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mt-6 max-w-4xl mx-auto">
        {/* Bus Ticket Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border-2 border-brand-500">
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Bus Ticket</h2>
                <p className="text-brand-100 text-sm">Resident Bus Ticket</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <div className="text-white text-center">
                  <div className="text-xs mb-1">Real-time</div>
                  <div className="text-xl font-bold font-mono">{formatTime(currentTime)}</div>
                  <div className="text-xs mt-1">{formatDate(currentTime)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="grid md:grid-cols-1 gap-8">
              {/* User Information */}
              <div className="space-y-6">
                {/* User Photo */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-brand-500 shadow-lg">
                      <Image
                        src={userData.photo}
                        alt={userData.name}
                        width={160}
                        height={160}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {isConfirmed && (
                      <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-3 shadow-lg animate-bounce">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* User Details */}
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Full Name
                    </label>
                    <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                      {userData.name}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Date of Birth
                    </label>
                    <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                      {userData.dateOfBirth}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      ID Number
                    </label>
                    <p className="text-lg font-bold text-gray-900 dark:text-white mt-1 font-mono">
                      {userData.idNumber}
                    </p>
                  </div>
                </div>

                {/* Real-time Anti-fraud Notice */}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-1">
                        Anti-Fraud Protection
                      </h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-400">
                        Real-time clock display ensures tickets cannot be copied or reused.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Confirmation Button */}
                <button
                  onClick={() => setIsConfirmed(!isConfirmed)}
                  disabled={isConfirmed}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 ${
                    isConfirmed
                      ? "bg-green-500 text-white cursor-not-allowed"
                      : "bg-brand-500 hover:bg-brand-600 text-white hover:shadow-xl hover:scale-105"
                  }`}
                >
                  {isConfirmed ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Confirmed
                    </span>
                  ) : (
                    "Confirmation"
                  )}
                </button>
              </div>
            </div>

            {/* QR Code or Additional Info (Optional) */}
            {isConfirmed && (
              <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-300 dark:border-gray-600">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 text-center">
                  <svg
                    className="w-16 h-16 text-green-500 mx-auto mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-xl font-bold text-green-700 dark:text-green-400 mb-2">
                    Ticket Confirmed
                  </h3>
                  <p className="text-green-600 dark:text-green-500">
                    Valid at {formatTime(currentTime)} - {formatDate(currentTime)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Ticket ID: <span className="font-mono font-semibold">BUS-{Date.now().toString().slice(-8)}</span>
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                Valid Resident
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
