import { Navigate } from "react-router-dom";

export default function GuestRoute({ children }: { children: React.ReactNode }) {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  if (token) {
    let role = "Teacher";
    try {
      const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.role === "Student") {
          role = "Student";
        }
      }
    } catch (e) {
      console.error("Error parsing user in GuestRoute:", e);
    }

    return <Navigate to={role === "Student" ? "/student/dashboard" : "/teacher/dashboard"} replace />;
  }

  return <>{children}</>;
}
