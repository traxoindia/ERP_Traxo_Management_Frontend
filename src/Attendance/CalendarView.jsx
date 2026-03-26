import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import attendanceService from '../services/attendanceService';



const CalendarView = ({ employeeId }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCalendarData();
  }, [currentDate]);

  const fetchCalendarData = async () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    
    setLoading(true);
    const result = await attendanceService.getCalendar(year, month);
    if (result.success) {
      setCalendarData(result.data);
    }
    setLoading(false);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'PRESENT':
        return 'bg-green-100 text-green-700 hover:bg-green-200';
      case 'LATE':
        return 'bg-orange-100 text-orange-700 hover:bg-orange-200';
      case 'HALF_DAY':
        return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200';
      case 'ABSENT':
        return 'bg-red-100 text-red-700 hover:bg-red-200';
      default:
        return 'bg-gray-50 text-gray-600 hover:bg-gray-100';
    }
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
    const days = [];
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-32 bg-gray-50 rounded-lg"></div>);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayData = calendarData[dateStr] || { status: 'ABSENT', checkIn: null, checkOut: null };
      
      days.push(
        <div key={day} className={`h-32 p-2 rounded-lg ${getStatusColor(dayData.status)} transition cursor-pointer`}>
          <div className="font-semibold text-lg mb-1">{day}</div>
          <div className="text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span>Status:</span>
              <span className="font-medium">{dayData.status}</span>
            </div>
            {dayData.checkIn && (
              <div className="flex items-center justify-between">
                <span>In:</span>
                <span>{new Date(dayData.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            )}
            {dayData.checkOut && (
              <div className="flex items-center justify-between">
                <span>Out:</span>
                <span>{new Date(dayData.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    
    return (
      <div>
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekdays.map(day => (
            <div key={day} className="text-center font-semibold text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days}
        </div>
      </div>
    );
  };

  const changeMonth = (increment) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + increment);
    setCurrentDate(newDate);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <CalendarIcon className="w-6 h-6" />
          Attendance Calendar
        </h2>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => changeMonth(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-lg font-semibold">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button
            onClick={() => changeMonth(1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {!loading && renderCalendar()}

      <div className="mt-6 flex justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 rounded"></div>
          <span>Present</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-100 rounded"></div>
          <span>Late</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-100 rounded"></div>
          <span>Half Day</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 rounded"></div>
          <span>Absent</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;