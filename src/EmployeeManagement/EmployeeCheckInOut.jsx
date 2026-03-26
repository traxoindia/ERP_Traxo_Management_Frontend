import React, { useState, useEffect } from 'react';
import attendanceService from '../services/attendanceService';
import EmployeeSidebar from './EmployeeSidebar';
import EmployeeNavbar from './EmployeeNavbar';

const EmployeeCheckInOut = ({ employeeId, employeeName }) => {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [message, setMessage] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [locationVerified, setLocationVerified] = useState(false);

  // Office coordinates
  const OFFICE_LAT = 21.485862;
  const OFFICE_LNG = 86.907635;
  const OFFICE_RADIUS = 50; // meters

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchTodayAttendance();
    verifyLocation();
  }, [employeeId]);

  const verifyLocation = async () => {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;
      setLocation({ lat: userLat, lng: userLng });

      // Calculate distance using Haversine formula
      const distance = calculateDistance(userLat, userLng, OFFICE_LAT, OFFICE_LNG);
      
      if (distance <= OFFICE_RADIUS) {
        setLocationVerified(true);
        setLocationError(null);
      } else {
        setLocationVerified(false);
        setLocationError(`You are ${distance.toFixed(0)} meters away. Must be within ${OFFICE_RADIUS} meters of office.`);
      }
    } catch (error) {
      setLocationVerified(false);
      setLocationError('Unable to get location. Please enable location services.');
    }
  };

  // Haversine formula to calculate distance between two coordinates
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const fetchTodayAttendance = async () => {
    const result = await attendanceService.getAttendance(employeeId);
    if (result.success && result.data) {
      const todayStr = new Date().toISOString().split('T')[0];
      const todayAttendance = Array.isArray(result.data) 
        ? result.data.find(record => record.date === todayStr)
        : result.data;
      
      setAttendance(todayAttendance || null);
    }
  };

  const handleCheckIn = async () => {
    if (!locationVerified) {
      setMessage({ type: 'error', text: 'Please verify your location first' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setLoading(true);
    
    try {
      const checkInTime = new Date().toISOString();
      
      const checkInData = {
        employeeId,
        employeeName,
        lat: location.lat,
        lng: location.lng,
        checkInTime: checkInTime
      };

      const result = await attendanceService.checkIn(checkInData);
      
      if (result.success) {
        setAttendance({ ...result.data, checkIn: checkInTime });
        setMessage({ type: 'success', text: `✓ Checked in at ${formatTime(checkInTime)}` });
      } else {
        setMessage({ type: 'error', text: result.message || 'Check-in failed' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Check-in failed. Please try again.' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    
    try {
      const checkOutTime = new Date().toISOString();
      
      const checkOutData = {
        employeeId,
        checkOutTime: checkOutTime
      };

      const result = await attendanceService.checkOut(checkOutData);
      
      if (result.success) {
        setAttendance({ ...attendance, checkOut: checkOutTime });
        setMessage({ type: 'success', text: `✓ Checked out at ${formatTime(checkOutTime)}` });
      } else {
        setMessage({ type: 'error', text: 'Check-out failed' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Check-out failed. Please try again.' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const formatTime = (dt) => {
    if (!dt) return '--:--';
    return new Date(dt).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (dt) => {
    return new Date(dt).toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCurrentStatus = () => {
    const now = currentTime;
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    
    if (totalMinutes < 10 * 60) return 'before';
    if (totalMinutes >= 10 * 60 && totalMinutes <= 18 * 60) return 'during';
    return 'after';
  };

  const canCheckIn = !attendance?.checkIn && getCurrentStatus() !== 'after';
  const canCheckOut = attendance?.checkIn && !attendance?.checkOut;

  return (
    <div className="flex">
      <EmployeeSidebar />
      <div className="flex-1">
        <EmployeeNavbar />
        <div className="max-w-2xl mx-auto p-6">
          {/* Current Time Display */}
          <div className="mb-8 text-center">
            <div className="text-4xl font-light text-gray-900 mb-2">
              {currentTime.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit',
                hour12: true 
              })}
            </div>
            <div className="text-sm text-gray-500">
              {formatDate(currentTime)}
            </div>
          </div>

          {/* Welcome Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-light text-gray-900">Welcome, {employeeName}</h1>
            <p className="text-sm text-gray-500">ID: {employeeId}</p>
          </div>

          {/* Location Status */}
          {location && (
            <div className={`mb-3 p-3 rounded-lg text-xs border ${
              locationVerified 
                ? 'bg-green-50 border-green-200 text-green-700' 
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              {locationVerified ? '✓' : '⚠️'} Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              {!locationVerified && locationError && (
                <div className="mt-1 text-red-600">{locationError}</div>
              )}
            </div>
          )}

          {locationError && !location && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              ⚠️ {locationError}
            </div>
          )}

          {message && (
            <div className={`mb-3 p-3 rounded-lg text-xs ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-700' 
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          {/* Attendance Card */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6 mb-6 text-center">
                <div className="border-r border-gray-100">
                  <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">Check In</p>
                  <p className="text-2xl font-light text-gray-800">
                    {attendance?.checkIn ? formatTime(attendance.checkIn) : '--:--'}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">Check Out</p>
                  <p className="text-2xl font-light text-gray-800">
                    {attendance?.checkOut ? formatTime(attendance.checkOut) : '--:--'}
                  </p>
                </div>
              </div>
              
              {/* Status Badge */}
              {attendance?.checkIn && (
                <div className="mb-4 text-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    new Date(attendance.checkIn).getHours() * 60 + new Date(attendance.checkIn).getMinutes() > 630
                      ? 'bg-red-50 text-red-700'
                      : 'bg-green-50 text-green-700'
                  }`}>
                    {new Date(attendance.checkIn).getHours() * 60 + new Date(attendance.checkIn).getMinutes() > 630 ? 'Late Entry' : 'On Time'}
                  </span>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                {canCheckIn && (
                  <button
                    onClick={handleCheckIn}
                    disabled={loading || !locationVerified}
                    className="w-full bg-black text-white py-3 rounded-lg font-medium transition-all hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processing...' : 'Punch In'}
                  </button>
                )}
                
                {canCheckOut && (
                  <button
                    onClick={handleCheckOut}
                    disabled={loading}
                    className="w-full bg-gray-800 text-white py-3 rounded-lg font-medium transition-all hover:bg-gray-700 disabled:bg-gray-300"
                  >
                    {loading ? 'Processing...' : 'Punch Out'}
                  </button>
                )}

                {!canCheckIn && !canCheckOut && attendance?.checkOut && (
                  <div className="text-center py-3 bg-gray-50 text-gray-500 rounded-lg text-sm border border-gray-200">
                    ✓ Shift Completed
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Office Info */}
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-500">
            <div className="flex justify-between">
              <span>Office Hours: 10:00 - 18:00</span>
              <span>Late after 10:30</span>
              <span>Half day before 17:00</span>
            </div>
            <div className="mt-2 text-center text-gray-400">
              Office Location: {OFFICE_LAT}, {OFFICE_LNG} | Required Radius: {OFFICE_RADIUS}m
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCheckInOut;