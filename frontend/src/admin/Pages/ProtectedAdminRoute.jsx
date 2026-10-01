import { Navigate, Outlet } from "react-router-dom";

const ProtectedAdminRoute = () => {
  const accessToken = localStorage.getItem("accessToken");
  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  // Not logged in
  if (!accessToken) {
    return <Navigate to="/admin" replace />;
  }

  // Logged in but not admin
  if (
    user?.is_staff !== true &&
    user?.is_superuser !== true
  ) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;