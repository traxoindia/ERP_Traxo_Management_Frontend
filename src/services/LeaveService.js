import axios from 'axios';

export const getPendingLeaves = async () => {
  const res = await axios.get('/api/leave?status=pending');
  return res.data || [];
};

export const approveLeave = async (leaveId) => {
  await axios.post('/api/leave/approve', { leave_id: leaveId });
};

export const rejectLeave = async (leaveId) => {
  await axios.post('/api/leave/reject', { leave_id: leaveId });
};