import { Navigate } from "react-router-dom";


export default function GuestRoute({ children }: { children: React.ReactNode }) {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  if (token) {
    return <Navigate to="/teacher/dashboard" replace />;
  }

  return <>{children}</>;
}
