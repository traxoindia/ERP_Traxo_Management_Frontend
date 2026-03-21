import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";

import ProtectedRoute from "./components/ProtectedRoute";
import HrDashboard from "./pages/HR/HrDashboard";
import RegistrationPage from "./pages/RegistrationPage";
import Recruitment from "./pages/HR/Recruitment";
import UserDashboard from "./pages/User/UserDashboard";
import AddEmployee from "./pages/HR/Employess/AddEmployee";
import Careers from "./pages/Career/Careers";
import PostJobPage from "./pages/Career/PostJobPage";
import Interviews from "./pages/Career/Interviews";

// Attendance
import AttendanceReports from "./pages/HR/Attendance/AttendanceReports";
import LeaveManagement from "./pages/HR/Attendance/LeaveManagement";
import EmployeeAttendance from "./pages/HR/Attendance/EmployeeAttendance";
import AttendanceCalendar from "./pages/HR/Attendance/AttendanceCalendar";
import PayrollDashboard from "./pages/HR/Payroll/PayrollDashboard";
import SalaryStructure from "./pages/HR/Payroll/SalaryStructure";
import PayrollProcessing from "./pages/HR/Payroll/PayrollProcessing";
import EmployeeSalary from "./pages/HR/Payroll/EmployeeSalary";
import PayslipGenerator from "./pages/HR/Payroll/PayslipGenerator";
import TaxManagement from "./pages/HR/Payroll/TaxManagement";
import Reimbursements from "./pages/HR/Payroll/Reimbursements";

// Payroll


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<RegistrationPage />} />

        {/* General Routes */}
        <Route path="/recruitment" element={<Recruitment />} />
        <Route path="/employees" element={<AddEmployee />} />
        <Route path="/careers" element={<Careers />} />

        {/* Jobs */}
        <Route
          path="/jobs/post"
          element={
            <ProtectedRoute roles={["HR", "ADMIN"]}>
              <PostJobPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs/interviews"
          element={
            <ProtectedRoute roles={["HR", "ADMIN"]}>
              <Interviews />
            </ProtectedRoute>
          }
        />

        {/* HR Dashboard */}
        <Route
          path="/hr-dashboard"
          element={
            <ProtectedRoute roles={["HR", "ADMIN"]}>
              <HrDashboard />
            </ProtectedRoute>
          }
        />

        {/* Attendance Routes */}
        <Route
          path="/attendance"
          element={
            <ProtectedRoute roles={["HR", "ADMIN"]}>
              <Navigate to="/attendance/calendar" replace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendance/calendar"
          element={
            <ProtectedRoute roles={["HR", "ADMIN"]}>
              <AttendanceCalendar/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendance/employee"
          element={
            <ProtectedRoute roles={["HR", "ADMIN"]}>
              <EmployeeAttendance/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendance/leave"
          element={
            <ProtectedRoute roles={["HR", "ADMIN"]}>
              <LeaveManagement/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendance/reports"
          element={
            <ProtectedRoute roles={["HR", "ADMIN"]}>
              <AttendanceReports/>
            </ProtectedRoute>
          }
        />

        {/* Payroll Routes */}
        <Route
          path="/payroll"
          element={
            <ProtectedRoute roles={["HR", "ADMIN"]}>
              <Navigate to="/payroll/dashboard" replace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payroll/dashboard"
          element={
            <ProtectedRoute roles={["HR", "ADMIN"]}>
              <PayrollDashboard/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/payroll/salary-structure"
          element={
            <ProtectedRoute roles={["HR", "ADMIN"]}>
              <SalaryStructure/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/payroll/processing"
          element={
            <ProtectedRoute roles={["HR", "ADMIN"]}>
              <PayrollProcessing/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/payroll/employee-salaries"
          element={
            <ProtectedRoute roles={["HR", "ADMIN"]}>
              <EmployeeSalary/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/payroll/payslips"
          element={
            <ProtectedRoute roles={["HR", "ADMIN"]}>
              <PayslipGenerator/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/payroll/tax"
          element={
            <ProtectedRoute roles={["HR", "ADMIN"]}>
              <TaxManagement/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/payroll/reimbursements"
          element={
            <ProtectedRoute roles={["HR", "ADMIN"]}>
              <Reimbursements/>
            </ProtectedRoute>
          }
        />

        {/* User Dashboard */}
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute role="USER">
              <UserDashboard/>
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;