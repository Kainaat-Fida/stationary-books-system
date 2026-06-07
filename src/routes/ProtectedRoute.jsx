import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const { user, role: userRole } = useSelector((state) => state.auth);

  if (!user) return <Navigate to="/signin" replace />;

  if (userRole && userRole !== role) {
    // Redirect to the correct dashboard if user is logged in
    if (userRole === "admin") return <Navigate to="/admin" replace />;
    if (userRole === "seller") return <Navigate to="/seller" replace />;
    if (userRole === "customer") return <Navigate to="/customer" replace />;
  }

  return children;
};


export default ProtectedRoute;
