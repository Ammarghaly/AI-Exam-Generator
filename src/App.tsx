import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import MyGroups from "./pages/MyGroups";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./stores/use-theme-store";
import SignUpPage from "./pages/SignUpPage";
import TeacherDashboardPage from "./pages/TeacherDashboardPage";
import GenerateExamPage from "./pages/GenerateExamPage";
import TeacherExamManagementPage from "./pages/TeacherExamManagementPage";
import ManualExamCreatorPage from "./pages/ManualExamCreatorPage";
import ExamCreationSelectionPage from "./pages/ExamCreationSelectionPage";

function App() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboardPage />} />
        <Route path="/teacher/exam-management" element={<TeacherExamManagementPage />} />
        <Route path="/teacher/manual-create" element={<ManualExamCreatorPage />} />
        <Route path="/teacher/generate-exam" element={<ExamCreationSelectionPage />} />
        <Route path="/teacher/generate-exam/ai-generate" element={<GenerateExamPage />} />
        <Route path="/teacher/groups" element={<MyGroups />} />
      </Routes>
      <Toaster position="bottom-right" />
    </BrowserRouter>
  );
}

export default App;
