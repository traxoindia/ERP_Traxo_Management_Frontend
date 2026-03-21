import axios from 'axios';

export const getAttendanceByMonth = async (month, year) => {
  const res = await axios.get(`/api/attendance?month=${month}&year=${year}`);
  return res.data.daily_records || [];
};

export const getEmployeeAttendance = async (employeeId, month, year) => {
  const res = await axios.get(`/api/attendance?employee_id=${employeeId}&month=${month}&year=${year}`);
  return res.data.daily_records || [];
};

export const getAttendanceReport = async (filters) => {
  const query = new URLSearchParams(filters).toString();
  const res = await axios.get(`/api/attendance/report?${query}`);
  return res.data || [];
};