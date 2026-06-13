import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      const pathname = location.pathname;

      if (user.role?.toLowerCase() === "student" && pathname.startsWith("/teacher")) {
        return <Navigate to="/student/dashboard" replace />;
      }

      if (user.role?.toLowerCase() === "teacher" && pathname.startsWith("/student")) {
        return <Navigate to="/teacher/dashboard" replace />;
      }
    }
  } catch (e) {
    console.error("Error parsing user in ProtectedRoute:", e);
  }

  return <>{children}</>;
}
