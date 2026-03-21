import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';

const AttendanceCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [view, setView] = useState('month'); // month, week

  // Sample attendance data
  const attendanceData = {
    '2026-03-01': { status: 'present', checkIn: '09:00', checkOut: '18:00' },
    '2026-03-02': { status: 'present', checkIn: '08:55', checkOut: '18:05' },
    '2026-03-03': { status: 'late', checkIn: '09:30', checkOut: '18:30' },
    '2026-03-04': { status: 'absent' },
    '2026-03-05': { status: 'present', checkIn: '09:00', checkOut: '18:00' },
    '2026-03-06': { status: 'leave' },
    '2026-03-07': { status: 'weekend' },
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay(); // 0 = Sunday
    
    return { daysInMonth, startingDay };
  };

  const { daysInMonth, startingDay } = getDaysInMonth(currentDate);
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const departments = [
    { id: 'all', name: 'All Departments' },
    { id: 'engineering', name: 'Engineering' },
    { id: 'sales', name: 'Sales' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'hr', name: 'Human Resources' },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'present': return 'bg-gray-900 text-white';
      case 'late': return 'bg-gray-700 text-white';
      case 'absent': return 'bg-gray-200 text-gray-900';
      case 'leave': return 'bg-white border-2 border-gray-900 text-gray-900';
      case 'weekend': return 'bg-gray-50 text-gray-400';
      default: return 'bg-white';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'present': return '✓';
      case 'late': return '⚠';
      case 'absent': return '✗';
      case 'leave': return 'L';
      case 'weekend': return '○';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-medium text-gray-900">Attendance Calendar</h1>
          <div className="flex items-center gap-3">
            <select 
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-gray-400"
            >
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
            <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
              <Filter size={14} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-5 gap-4 mt-4">
          <div className="border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-500">Present</div>
            <div className="text-xl font-medium text-gray-900">156</div>
          </div>
          <div className="border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-500">Late</div>
            <div className="text-xl font-medium text-gray-900">12</div>
          </div>
          <div className="border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-500">Absent</div>
            <div className="text-xl font-medium text-gray-900">8</div>
          </div>
          <div className="border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-500">On Leave</div>
            <div className="text-xl font-medium text-gray-900">5</div>
          </div>
          <div className="border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-500">Total</div>
            <div className="text-xl font-medium text-gray-900">181</div>
          </div>
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <ChevronLeft size={16} />
          </button>
          <h2 className="text-lg font-medium text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button 
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setView('month')}
            className={`px-3 py-1.5 text-sm rounded-lg ${
              view === 'month' 
                ? 'bg-gray-900 text-white' 
                : 'border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Month
          </button>
          <button 
            onClick={() => setView('week')}
            className={`px-3 py-1.5 text-sm rounded-lg ${
              view === 'week' 
                ? 'bg-gray-900 text-white' 
                : 'border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Week
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-xs text-gray-500 font-medium text-center py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: startingDay }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square border border-gray-100 bg-gray-50 rounded-lg" />
          ))}
          
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayData = attendanceData[dateStr] || { status: 'present' };
            
            return (
              <div 
                key={day}
                className={`aspect-square border border-gray-200 rounded-lg p-2 cursor-pointer hover:border-gray-900 transition-colors ${getStatusColor(dayData.status)}`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-sm font-medium">{day}</span>
                  <span className="text-xs">{getStatusIcon(dayData.status)}</span>
                </div>
                {dayData.checkIn && (
                  <div className="mt-2 text-xs opacity-80">
                    <div>{dayData.checkIn}</div>
                    <div>{dayData.checkOut}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex gap-6 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-900 rounded"></div>
            <span>Present</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-700 rounded"></div>
            <span>Late</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-200 rounded"></div>
            <span>Absent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-gray-900 rounded"></div>
            <span>Leave</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCalendar;