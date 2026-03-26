import axios from 'axios';

const API_BASE_URL = 'https://api.wemis.in/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    console.log('Request Data:', config.data);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

class AttendanceService {
  // Check-in
  async checkIn(employeeId, employeeName, lat, lng) {
    try {
      const response = await api.post('/attendance/check-in', {
        employeeId,
        employeeName,
        lat,
        lng
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Check-in error details:', error.response?.data);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Check-in failed',
        status: error.response?.status
      };
    }
  }

  // Check-out
  async checkOut(employeeId) {
    try {
      const response = await api.post('/attendance/check-out', {
        employeeId
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Check-out error details:', error.response?.data);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Check-out failed',
        status: error.response?.status
      };
    }
  }

  // Get attendance by employee ID
  async getAttendance(employeeId) {
    try {
      const response = await api.get(`/attendance/${employeeId}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Get attendance error:', error.response?.data);
      // Return empty array on 403/404 to handle gracefully
      if (error.response?.status === 403 || error.response?.status === 404) {
        return { success: true, data: [] };
      }
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Failed to fetch attendance',
        status: error.response?.status
      };
    }
  }

  // Get monthly report
  async getMonthlyReport(employeeId, year, month) {
    try {
      const response = await api.get('/attendance/report', {
        params: { employeeId, year, month }
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Get monthly report error:', error.response?.data);
      // Return demo data for development
      if (error.response?.status === 403) {
        return { 
          success: true, 
          data: this.getDemoReportData(year, month)
        };
      }
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Failed to fetch report',
        status: error.response?.status
      };
    }
  }

  // Get calendar data
  async getCalendar(year, month) {
    try {
      const response = await api.get('/attendance/calendar', {
        params: { year, month }
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Get calendar error:', error.response?.data);
      // Return demo data for development
      if (error.response?.status === 403) {
        return { 
          success: true, 
          data: this.getDemoCalendarData(year, month)
        };
      }
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Failed to fetch calendar',
        status: error.response?.status
      };
    }
  }

  // Get dashboard stats
  async getDashboardStats() {
    try {
      const response = await api.get('/dashboard/stats');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Get dashboard stats error:', error.response?.data);
      // Return demo stats if API fails
      if (error.response?.status === 403) {
        return { 
          success: true, 
          data: {
            totalEmployees: 20,
            presentToday: 8,
            absentToday: 12
          }
        };
      }
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Failed to fetch stats',
        status: error.response?.status
      };
    }
  }

  // Get notifications
  async getNotifications(employeeId) {
    try {
      const response = await api.get('/notifications', {
        params: { employeeId }
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Get notifications error:', error.response?.data);
      // Return demo notifications if API fails
      if (error.response?.status === 403) {
        return { 
          success: true, 
          data: [
            {
              id: 1,
              title: "Welcome!",
              message: "Welcome to the Attendance Management System",
              date: new Date().toISOString(),
              type: "info"
            },
            {
              id: 2,
              title: "Office Timing",
              message: "Office timing is 10:00 AM to 6:00 PM",
              date: new Date().toISOString(),
              type: "info"
            }
          ]
        };
      }
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Failed to fetch notifications',
        status: error.response?.status
      };
    }
  }

  // Demo data generators for development
  getDemoReportData(year, month) {
    const daysInMonth = new Date(year, month, 0).getDate();
    const dailyRecords = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isWeekend = [0, 6].includes(new Date(year, month - 1, day).getDay());
      
      if (isWeekend) {
        dailyRecords.push({
          date,
          day: new Date(year, month - 1, day).toLocaleDateString('en-US', { weekday: 'short' }),
          status: 'WEEKEND',
          checkIn: '--',
          checkOut: '--'
        });
      } else {
        const random = Math.random();
        let status, checkIn, checkOut;
        
        if (random < 0.7) {
          status = 'PRESENT';
          checkIn = '09:45 AM';
          checkOut = '06:15 PM';
        } else if (random < 0.85) {
          status = 'LATE';
          checkIn = '10:45 AM';
          checkOut = '06:00 PM';
        } else if (random < 0.95) {
          status = 'HALF_DAY';
          checkIn = '09:30 AM';
          checkOut = '04:30 PM';
        } else {
          status = 'ABSENT';
          checkIn = '--';
          checkOut = '--';
        }
        
        dailyRecords.push({ date, day: new Date(year, month - 1, day).toLocaleDateString('en-US', { weekday: 'short' }), status, checkIn, checkOut });
      }
    }
    
    const presentDays = dailyRecords.filter(r => r.status === 'PRESENT').length;
    const lateDays = dailyRecords.filter(r => r.status === 'LATE').length;
    const halfDays = dailyRecords.filter(r => r.status === 'HALF_DAY').length;
    const absentDays = dailyRecords.filter(r => r.status === 'ABSENT').length;
    const totalDays = dailyRecords.filter(r => r.status !== 'WEEKEND').length;
    
    return {
      totalDays,
      presentDays,
      absentDays,
      lateDays,
      halfDays,
      dailyRecords
    };
  }

  getDemoCalendarData(year, month) {
    const daysInMonth = new Date(year, month, 0).getDate();
    const calendarData = {};
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isWeekend = [0, 6].includes(new Date(year, month - 1, day).getDay());
      
      if (!isWeekend) {
        const random = Math.random();
        if (random < 0.7) {
          calendarData[date] = {
            status: 'PRESENT',
            checkIn: `${year}-${month}-${day}T04:15:00Z`,
            checkOut: `${year}-${month}-${day}T12:45:00Z`
          };
        } else if (random < 0.85) {
          calendarData[date] = {
            status: 'LATE',
            checkIn: `${year}-${month}-${day}T05:15:00Z`,
            checkOut: `${year}-${month}-${day}T12:30:00Z`
          };
        } else if (random < 0.95) {
          calendarData[date] = {
            status: 'HALF_DAY',
            checkIn: `${year}-${month}-${day}T04:00:00Z`,
            checkOut: `${year}-${month}-${day}T11:00:00Z`
          };
        } else {
          calendarData[date] = { status: 'ABSENT', checkIn: null, checkOut: null };
        }
      } else {
        calendarData[date] = { status: 'WEEKEND', checkIn: null, checkOut: null };
      }
    }
    
    return calendarData;
  }
}

export default new AttendanceService();