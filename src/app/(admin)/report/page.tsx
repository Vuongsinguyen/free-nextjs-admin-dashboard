"use client";

import { useState } from "react";

interface ReportCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  fileName: string;
}

interface DateRange {
  start: Date | null;
  end: Date | null;
}

const reportCards: ReportCard[] = [
  {
    id: "revenue",
    title: "Revenue Report",
    description: "Monthly revenue and payment analysis",
    icon: "💰",
    color: "from-brand-500 to-brand-600",
    fileName: "revenue_report"
  },
  {
    id: "occupancy",
    title: "Occupancy Report",
    description: "Apartment occupancy and vacancy rates",
    icon: "🏢",
    color: "from-brand-500 to-brand-600",
    fileName: "occupancy_report"
  },
  {
    id: "payment",
    title: "Payment Status Report",
    description: "Paid, unpaid and overdue invoices",
    icon: "📊",
    color: "from-brand-500 to-brand-600",
    fileName: "payment_status_report"
  },
  {
    id: "maintenance",
    title: "Maintenance Report",
    description: "Maintenance requests and costs",
    icon: "🔧",
    color: "from-brand-500 to-brand-600",
    fileName: "maintenance_report"
  },
  {
    id: "resident",
    title: "Resident Report",
    description: "Resident demographics and information",
    icon: "👥",
    color: "from-brand-500 to-brand-600",
    fileName: "resident_report"
  }
];

export default function ReportPage() {
  const [dateRanges, setDateRanges] = useState<Record<string, { start: string; end: string }>>({});
  const [showDatePicker, setShowDatePicker] = useState<string | null>(null);
  const [tempDateRange, setTempDateRange] = useState<DateRange>({ start: null, end: null });
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const isSameDay = (date1: Date | null, date2: Date | null) => {
    if (!date1 || !date2) return false;
    return formatDate(date1) === formatDate(date2);
  };

  const isInRange = (date: Date, start: Date | null, end: Date | null) => {
    if (!start || !end) return false;
    const dateTime = date.getTime();
    return dateTime >= start.getTime() && dateTime <= end.getTime();
  };

  const handleDateClick = (date: Date) => {
    if (!tempDateRange.start || (tempDateRange.start && tempDateRange.end)) {
      setTempDateRange({ start: date, end: null });
    } else {
      if (date < tempDateRange.start) {
        setTempDateRange({ start: date, end: tempDateRange.start });
      } else {
        setTempDateRange({ start: tempDateRange.start, end: date });
      }
    }
  };

  const handleOk = () => {
    if (showDatePicker && tempDateRange.start && tempDateRange.end) {
      setDateRanges(prev => ({
        ...prev,
        [showDatePicker]: {
          start: formatDate(tempDateRange.start),
          end: formatDate(tempDateRange.end)
        }
      }));
      setShowDatePicker(null);
      setTempDateRange({ start: null, end: null });
    }
  };

  const renderCalendar = (monthOffset: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + monthOffset, 1);
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysCount = daysInMonth(date);
    const firstDay = getFirstDayOfMonth(date);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const days = [];
    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysCount; day++) {
      const currentDate = new Date(year, month, day);
      const isStart = isSameDay(currentDate, tempDateRange.start);
      const isEnd = isSameDay(currentDate, tempDateRange.end);
      const inRange = isInRange(currentDate, tempDateRange.start, tempDateRange.end);
      
      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(currentDate)}
          className={`h-10 rounded-lg text-sm font-medium transition-all ${
            isStart || isEnd
              ? 'bg-brand-500 text-white'
              : inRange
              ? 'bg-brand-100 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          {day}
        </button>
      );
    }

    return (
      <div className="p-4">
        <div className="text-center font-semibold text-gray-900 dark:text-white mb-4">
          {monthNames[month]} {year}
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="h-10 flex items-center justify-center text-xs font-medium text-gray-500 dark:text-gray-400">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
      </div>
    );
  };

  const handleDownload = (report: ReportCard) => {
    const dateRange = dateRanges[report.id];
    
    if (!dateRange?.start || !dateRange?.end) {
      alert("Please select date range");
      return;
    }

    // Tạo file Excel (mock - sẽ implement sau)
    const fileName = `${report.fileName}_${dateRange.start}_to_${dateRange.end}.xlsx`;
    
    // Mock download - sẽ implement Excel generation sau
    console.log(`Downloading: ${fileName}`);
    alert(`Download started: ${fileName}\n\nFile Excel generation will be implemented later.`);
    
    // TODO: Implement actual Excel file generation and download
    // using libraries like ExcelJS or xlsx
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">Download Excel reports with custom date ranges</p>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportCards.map((report) => (
          <div
            key={report.id}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow"
          >
            {/* Title & Description */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {report.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              {report.description}
            </p>

            {/* Date Range Selector */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => {
                  setShowDatePicker(report.id);
                  setCurrentMonth(new Date());
                  const existing = dateRanges[report.id];
                  if (existing?.start && existing?.end) {
                    setTempDateRange({
                      start: new Date(existing.start),
                      end: new Date(existing.end)
                    });
                  } else {
                    setTempDateRange({ start: null, end: null });
                  }
                }}
                className="w-full px-4 py-3 text-left border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-brand-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Date Range</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {dateRanges[report.id]?.start && dateRanges[report.id]?.end
                        ? `${dateRanges[report.id].start} - ${dateRanges[report.id].end}`
                        : 'Select date range'}
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </button>
            </div>

            {/* Download Button */}
            <button
              onClick={() => handleDownload(report)}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r ${report.color} text-white font-medium rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Excel
            </button>
          </div>
        ))}
      </div>

      {/* Date Range Picker Modal */}
      {showDatePicker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Select Date Range</h3>
              <button
                onClick={() => {
                  setShowDatePicker(null);
                  setTempDateRange({ start: null, end: null });
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderCalendar(0)}
                {renderCalendar(1)}
              </div>

              <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {tempDateRange.start && tempDateRange.end
                    ? `Selected: ${formatDate(tempDateRange.start)} - ${formatDate(tempDateRange.end)}`
                    : 'Click on dates to select range'}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowDatePicker(null);
                      setTempDateRange({ start: null, end: null });
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleOk}
                    disabled={!tempDateRange.start || !tempDateRange.end}
                    className="px-6 py-2 text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
              Information
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              Select a date range and click the Download button to export the report. Excel file generation will be implemented in the next phase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
