import React from 'react';

const AttendanceFilter = ({ filters, setFilters }) => {
  return (
    <div className="mb-3">
      <input
        type="month"
        value={`${filters.year}-${filters.month.toString().padStart(2,'0')}`}
        onChange={e => {
          const [year, month] = e.target.value.split('-');
          setFilters(prev => ({ ...prev, year: parseInt(year), month: parseInt(month) }));
        }}
        className="form-control w-auto d-inline-block me-2"
      />
      <input
        type="text"
        placeholder="Employee ID"
        value={filters.employeeId || ''}
        onChange={e => setFilters(prev => ({ ...prev, employeeId: e.target.value }))}
        className="form-control w-auto d-inline-block"
      />
    </div>
  );
};

export default AttendanceFilter;