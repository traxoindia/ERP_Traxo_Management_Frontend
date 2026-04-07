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
import OnboardingDashboard from "./pages/Career/OnboardingDashboard";

import EmployeeDashboard from "./EmployeeManagement/EmployeeDashboard";
import EmployeeCheckInOut from "./EmployeeManagement/EmployeeCheckInOut";
import LandingPage from "./pages/LandingPage";
import Employeelogin from "./EmployeeManagement/Employeelogin";
import EmployeeHistory from "./EmployeeManagement/EmployeeHistory";
import EmployeeProfile from "./EmployeeManagement/EmployeeProfile";
import LeaveManagementHr from "./pages/HR/LeaveManagementHr";
import EmployeeLeaveHistory from "./EmployeeManagement/EmployeeLeaveHistory";
import AttendanceStatusTable from "./pages/HR/AttendanceStatusTable";

import MyPayslips from "./EmployeeManagement/MyPayslips";
import HRPayroll from "./pages/HR/Payroll/HRPayroll";
import CalendarView from "./Attendance/CalendarView";
import AdminLogin from "../Admin/Adminlogin";
import AdminDashboard from "../Admin/AdminDashboard";
import AdminRegister from "../Admin/AdminRegister";
import Reports from "./pages/HR/Reports";
import AdminForgotPassword from "../Admin/AdminForgotPassword";

// Payroll

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
      
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/attendance" element={<AttendanceStatusTable />} />
         <Route path="/calender" element={<CalendarView/>} />
        {/* General Routes */}
        <Route path="/recruitment" element={<Recruitment />} />
        <Route path="/employees" element={<AddEmployee />} />
        <Route path="/careers" element={<Careers />} />
        {/* Employee Routes */}
        <Route path="/employee-login" element={<Employeelogin />} />
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
        <Route path="/employee/leave-history" element={<EmployeeLeaveHistory />} />
        <Route path="/admin" element={<Navigate to="/admin/login" />} />
        
        {/* Admin Authentication Routes */}
        <Route path="/admin/login" element={<AdminLogin/>} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
         <Route path="/admin/forgot-password" element={<AdminForgotPassword/>} />
        <Route
          path="/employee-checkin"
          element={

            <EmployeeCheckInOut />

          }
        />
        <Route
          path="/employee-profile"
          element={

            <EmployeeProfile />

          }
        />
        <Route
          path="/employee-history"
          element={

            <EmployeeHistory />

          }
        />
        {/* Jobs */}
        EMPLOYEE
        <Route
          path="/hr-Leave-management"
          element={
            <ProtectedRoute roles={["HR", "ADMIN"]}>
              <LeaveManagementHr />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs/post"
          element={
            <ProtectedRoute roles={["HR", "ADMIN"]}>
              <PostJobPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs/onboarding"
          element={
            <ProtectedRoute roles={["HR", "ADMIN"]}>
              <OnboardingDashboard />
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
        <Route
          path="/reports"
          element={
            <ProtectedRoute roles={["HR", "ADMIN"]}>
              <Reports />
            </ProtectedRoute>
          }
        />
        
        {/* Attendance Routes */}
        {/* Payroll Routes */}
        <Route path="/payroll/page" element={<HRPayroll />} />
       

        <Route path="/employee/payslips" element={<MyPayslips />} />
        {/* User Dashboard */}
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute role="USER">
              <UserDashboard />
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
