import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const userRole = localStorage.getItem("role");

  if (userRole !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;