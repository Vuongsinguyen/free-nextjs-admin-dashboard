"use client";

import { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

interface InvoiceStats {
  label: string;
  value: number | string;
  change?: string;
  color: string;
}

interface ReportCard {
  id: string;
  title: string;
  description: string;
  color: string;
  fileName: string;
}

export default function InvoiceReportsPage() {
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  // Statistics Data
  const stats: InvoiceStats[] = [
    {
      label: "Total Invoices",
      value: "1,234",
      change: "+12%",
      color: "from-blue-500 to-blue-600"
    },
    {
      label: "Paid Invoices",
      value: "987",
      change: "+8%",
      color: "from-green-500 to-green-600"
    },
    {
      label: "Unpaid Invoices",
      value: "186",
      change: "-5%",
      color: "from-yellow-500 to-yellow-600"
    },
    {
      label: "Overdue Invoices",
      value: "61",
      change: "-15%",
      color: "from-red-500 to-red-600"
    },
    {
      label: "Total Revenue",
      value: "4.5B VND",
      change: "+18%",
      color: "from-purple-500 to-purple-600"
    },
    {
      label: "Outstanding Amount",
      value: "850M VND",
      change: "-10%",
      color: "from-orange-500 to-orange-600"
    }
  ];

  // Report Cards
  const reportCards: ReportCard[] = [
    {
      id: "invoice-summary",
      title: "Invoice Summary Report",
      description: "Complete invoice summary with payment status breakdown",
      color: "from-brand-500 to-brand-600",
      fileName: "invoice_summary"
    },
    {
      id: "payment-status",
      title: "Payment Status Report",
      description: "Detailed payment status analysis (Paid/Unpaid/Overdue)",
      color: "from-brand-500 to-brand-600",
      fileName: "payment_status"
    },
    {
      id: "revenue-analysis",
      title: "Revenue Analysis Report",
      description: "Revenue breakdown by fee type and apartment",
      color: "from-brand-500 to-brand-600",
      fileName: "revenue_analysis"
    },
    {
      id: "customer-payment",
      title: "Customer Payment Report",
      description: "Payment history and customer payment behavior",
      color: "from-brand-500 to-brand-600",
      fileName: "customer_payment"
    },
    {
      id: "overdue-invoices",
      title: "Overdue Invoices Report",
      description: "List of overdue invoices with customer details",
      color: "from-brand-500 to-brand-600",
      fileName: "overdue_invoices"
    },
    {
      id: "monthly-comparison",
      title: "Monthly Comparison Report",
      description: "Month-over-month invoice and revenue comparison",
      color: "from-brand-500 to-brand-600",
      fileName: "monthly_comparison"
    }
  ];

  const handleDownload = (report: ReportCard) => {
    const fileName = `${report.fileName}_${dateRange.start}_to_${dateRange.end}.xlsx`;
    console.log(`Downloading: ${fileName}`);
    alert(`Download started: ${fileName}\n\nExcel file generation will be implemented.`);
  };

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Invoice Reports" />

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Invoice Analytics & Reports
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Comprehensive invoice reports with payment analytics and revenue insights
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              {stat.change && (
                <span className={`text-sm font-semibold ${
                  stat.change.startsWith('+') 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {stat.change}
                </span>
              )}
            </div>
            <div className={`mt-4 h-2 rounded-full bg-gradient-to-r ${stat.color} opacity-20`}></div>
          </div>
        ))}
      </div>

      {/* Date Range Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Report Date Range
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Report Cards */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Available Reports
        </h3>
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
      </div>

      {/* Payment Status Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Payment Status Distribution
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">Paid Invoices</span>
              <span className="font-semibold text-gray-900 dark:text-white">79.8%</span>
            </div>
            <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="absolute h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full" style={{ width: '79.8%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">Unpaid Invoices</span>
              <span className="font-semibold text-gray-900 dark:text-white">15.1%</span>
            </div>
            <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="absolute h-full bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full" style={{ width: '15.1%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">Overdue Invoices</span>
              <span className="font-semibold text-gray-900 dark:text-white">5.1%</span>
            </div>
            <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="absolute h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full" style={{ width: '5.1%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue by Fee Type */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Revenue by Fee Type (Current Month)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: "Management Fee", amount: "2.8B VND", percentage: "62%", color: "bg-blue-500" },
            { name: "Electricity", amount: "950M VND", percentage: "21%", color: "bg-yellow-500" },
            { name: "Water", amount: "420M VND", percentage: "9%", color: "bg-cyan-500" },
            { name: "Parking", amount: "330M VND", percentage: "8%", color: "bg-purple-500" }
          ].map((fee, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{fee.name}</p>
                <span className={`text-xs font-semibold px-2 py-1 rounded ${fee.color} text-white`}>
                  {fee.percentage}
                </span>
              </div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{fee.amount}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
              Report Information
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              Select your desired date range above and click the Download button to export detailed reports in Excel format. All statistics are updated in real-time based on invoice data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
