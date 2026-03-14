import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, roles }) => {
  const userRole = localStorage.getItem("role");

  if (!userRole) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;