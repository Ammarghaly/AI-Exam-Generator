import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LandingLayout from "../components/Layout/landing";

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      try {
        const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
        const user = userStr ? JSON.parse(userStr) : null;
        if (user?.role === "Student") {
          navigate("/student/dashboard", { replace: true });
        } else {
           navigate("/teacher/dashboard", { replace: true });
        }
      } catch (e) {
        console.error("Error parsing user info in LandingPage:", e);
        navigate("/teacher/dashboard", { replace: true });
      }
    }
  }, [navigate]);

  return <LandingLayout />;
}
