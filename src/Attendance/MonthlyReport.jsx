import React, { useState } from 'react';
import { Calendar, Download, TrendingUp, TrendingDown } from 'lucide-react';
import attendanceService from '../services/AttendanceService';


const MonthlyReport = ({ employeeId }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReport = async () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
    
    setLoading(true);
    const result = await attendanceService.getMonthlyReport(employeeId, year, month);
    if (result.success) {
      setReport(result.data);
      setError(null);
    } else {
      setError(result.error);
      setReport(null);
    }
    setLoading(false);
  };

  const handleMonthChange = (increment) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(selectedDate.getMonth() + increment);
    setSelectedDate(newDate);
  };

  const getMonthName = () => {
    return selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const getSummaryCards = () => {
    if (!report) return null;
    
    const stats = [
      { label: 'Total Working Days', value: report.totalDays || 0, icon: Calendar, color: 'blue' },
      { label: 'Present Days', value: report.presentDays || 0, icon: TrendingUp, color: 'green' },
      { label: 'Absent Days', value: report.absentDays || 0, icon: TrendingDown, color: 'red' },
      { label: 'Late Days', value: report.lateDays || 0, icon: TrendingDown, color: 'orange' },
      { label: 'Half Days', value: report.halfDays || 0, icon: Calendar, color: 'yellow' },
    ];
    
    return stats;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Monthly Report</h2>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleMonthChange(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            ←
          </button>
          <span className="text-lg font-semibold">{getMonthName()}</span>
          <button
            onClick={() => handleMonthChange(1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            →
          </button>
          <button
            onClick={fetchReport}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Load Report
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {report && !loading && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            {getSummaryCards().map((stat, index) => {
              const Icon = stat.icon;
              const colorClasses = {
                blue: 'bg-blue-50 text-blue-600',
                green: 'bg-green-50 text-green-600',
                red: 'bg-red-50 text-red-600',
                orange: 'bg-orange-50 text-orange-600',
                yellow: 'bg-yellow-50 text-yellow-600'
              };
              
              return (
                <div key={index} className={`p-4 rounded-lg ${colorClasses[stat.color]}`}>
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-5 h-5" />
                    <span className="text-2xl font-bold">{stat.value}</span>
                  </div>
                  <p className="text-sm">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* Detailed Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Day</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Check In</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Check Out</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {report.dailyRecords?.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{record.date}</td>
                    <td className="px-4 py-3 text-sm">{record.day}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        record.status === 'PRESENT' ? 'bg-green-100 text-green-700' :
                        record.status === 'LATE' ? 'bg-orange-100 text-orange-700' :
                        record.status === 'HALF_DAY' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{record.checkIn || '--:--'}</td>
                    <td className="px-4 py-3 text-sm">{record.checkOut || '--:--'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Download Button */}
          <div className="mt-6 flex justify-end">
            <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download Report
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MonthlyReport;