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

import AttendenceReport from "./pages/HR/AttendenceReport";
import EmployeeSummary from "./pages/HR/EmployeeSummary";
import HiringReport from "./pages/HR/HiringReport";
import LeaveReport from "./pages/HR/LeaveReport";
import PayrollReport from "./pages/HR/PayrollReport";
import BGVVerification from "./pages/Career/BGVVerification";
import OnboardingSuccess from "./pages/Career/OnboardingSuccess";
import Onboarding from "./pages/Career/Onboarding";
import BGVPortal from "./pages/Career/BGVPportal";

import CandidateDetails from "./pages/Career/CandidateDetails";
import ProcurementDashboard from "./Procurement/ProcurementDashboard";
import ProcurementLogin from "./Procurement/ProcurementLogin";
import Vendorpage from "./Procurement/Vendorpage";
import AdminVendorApprove from "../Admin/AdminVendorApprove";
import VendorLogin from "./Procurement/VendorLogin";
import VendorDashboard from "./Procurement/VendorDashboard";
import ProcurementRequirementShowVendor from "./Procurement/ProcurementRequirementShowVendor";
import BulkApproveBGV from "./pages/Career/TestPage/BulkApproveBGV";

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
        <Route path="/calender" element={<CalendarView />} />
        {/* General Routes */}
        <Route path="/recruitment" element={<Recruitment />} />
        <Route path="/employees" element={<AddEmployee />} />
        <Route path="/careers" element={<Careers />} />
        {/* Employee Routes */}
        <Route path="/employee-login" element={<Employeelogin />} />
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
        <Route path="/employee/leave-history" element={<EmployeeLeaveHistory />} />
        <Route path="/admin" element={<Navigate to="/admin/login" />} />
        <Route path="/reports/attendence" element={<AttendenceReport />} />
        <Route path="/reports/payroll" element={<PayrollReport />} />
        <Route path="/reports/leave" element={<LeaveReport />} />
        <Route path="/reports/hiring" element={<HiringReport />} />
        <Route path="/reports/employee-summary" element={<EmployeeSummary />} />

        <Route path="/jobs/bgv-verification" element={<BGVVerification />} />

        <Route path="/jobs/bgv" element={<CandidateDetails />} />
        {/* Add success page */}
        <Route path="/onboarding-success" element={<OnboardingSuccess />} />

        <Route path="/bgv-portal" element={<BGVPortal />} />
        {/* Admin Authentication Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
        <Route path="/admin/vendor-approve" element={<AdminVendorApprove />} />

        {/* Procurement Routes */}
        <Route path="/procurement" element={<ProcurementDashboard />} />
        <Route path="/departments/procurement/login" element={<ProcurementLogin />} />
        <Route path="/vendors" element={<Vendorpage />} />
        <Route path="/vendorlogin" element={<VendorLogin />} />
        <Route path="/vendor-dashboard" element={<VendorDashboard />} />
        <Route path="/Procurement-requirements" element={<ProcurementRequirementShowVendor />} />


        {/* Test */}

        <Route path="/test" element={<BulkApproveBGV />} />



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
              <Onboarding />
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
