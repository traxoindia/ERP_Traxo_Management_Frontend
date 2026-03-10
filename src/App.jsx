import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";

import ProtectedRoute from "./components/ProtectedRoute";
import HrDashboard from "./pages/HR/HrDashboard";
import RegistrationPage from "./pages/RegistrationPage";
import Recruitment from "./pages/HR/Recruitment";
import UserDashboard from "./pages/User/UserDashboard";
import AddEmployee from "./pages/HR/Employess/AddEmployee";
import Careers from "./pages/Career/Careers";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
         <Route path="/register" element={<RegistrationPage />} />
         <Route path="/recruitment" element={<Recruitment />} />
         <Route path="/employees" element={<AddEmployee />} />
          <Route path="/careers" element={<Careers />} />
         


        <Route
          path="/hr-dashboard"
          element={
            <ProtectedRoute role="HR">
              <HrDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute role="USER">
              <UserDashboard/>
            </ProtectedRoute>
          }
        />
      
      </Routes>
    </BrowserRouter>
  );
}

export default App;