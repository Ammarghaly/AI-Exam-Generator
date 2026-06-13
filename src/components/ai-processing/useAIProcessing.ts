import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { uploadPDF, generateExamAI, publishAIExam } from "../../api/exams";
import { useUserStore } from "../../stores/use-user-store";

const reassuringMessages = [
  "Uploading your course material securely...",
  "Initializing AI Agents to analyze document structure...",
  "Extracting core concepts and key learning objectives...",
  "Drafting high-quality questions mapped to your curriculum...",
  "Formatting options and validating answer keys...",
  "Calibrating question difficulty levels...",
  "Structuring assessment schema...",
  "Applying final polishes and review criteria...",
  "Publishing exam to your student group...",
  "Almost there! Wrapping up the final details...",
];

export function useAIProcessing() {
  const location = useLocation();
  const navigate = useNavigate();
  const processedRef = useRef(false);
  const { updateUser, currentUser } = useUserStore();

  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(reassuringMessages[0]);
  const [, setMessageIndex] = useState(0);
  const [phase, setPhase] = useState<1 | 2 | 3>(1);
  const [phaseText, setPhaseText] = useState("Document Parsing");

  // Get data from location state
  const formData = location.state;

  // Cycle through reassuring messages with fade animation
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % reassuringMessages.length;
        setCurrentMessage(reassuringMessages[nextIndex]);
        return nextIndex;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // API Call Flow
  useEffect(() => {
    if (!formData) {
      toast.error("No exam configuration data found!");
      const isStudent = currentUser?.role?.toLowerCase() === "student";
      navigate(isStudent ? "/student/generate-exam/ai-generate" : "/teacher/generate-exam");
      return;
    }

    if (processedRef.current) return;
    processedRef.current = true;

    const executeGeneration = async () => {
      try {
        // --- PHASE 1: UPLOAD & PARSING (0% - 30%) ---
        setPhase(1);
        setPhaseText("Document Parsing");
        setProgress(10);

        const uploadRes = await uploadPDF(formData.file);
        const generatedId = uploadRes.examId;
        setProgress(30);

        // --- PHASE 2: QUESTION GENERATION (30% - 75%) ---
        setPhase(2);
        setPhaseText("Question Generation");
        setProgress(40);

        // Calculate total questions
        const totalQuestion = (
          Object.values(formData.difficultyDistribution || {}) as any[]
        ).reduce((sum: number, val: any) => sum + Number(val || 0), 0);

        // Map difficulties dynamically
        const difficultyRules = [
          {
            key: "Easy_Memorization",
            difficulty: "Easy" as const,
            measures: "Memorization" as const,
          },
          {
            key: "Easy_Creativity",
            difficulty: "Easy" as const,
            measures: "Creativity" as const,
          },
          {
            key: "Easy_Thinking",
            difficulty: "Easy" as const,
            measures: "Thinking" as const,
          },
          {
            key: "Normal_Memorization",
            difficulty: "Normal" as const,
            measures: "Memorization" as const,
          },
          {
            key: "Normal_Creativity",
            difficulty: "Normal" as const,
            measures: "Creativity" as const,
          },
          {
            key: "Normal_Thinking",
            difficulty: "Normal" as const,
            measures: "Thinking" as const,
          },
          {
            key: "Hard_Memorization",
            difficulty: "Hard" as const,
            measures: "Memorization" as const,
          },
          {
            key: "Hard_Creativity",
            difficulty: "Hard" as const,
            measures: "Creativity" as const,
          },
          {
            key: "Hard_Thinking",
            difficulty: "Hard" as const,
            measures: "Thinking" as const,
          },
        ]
          .map((item) => {
            const count =
              Number(
                formData.difficultyDistribution[
                  item.key as keyof typeof formData.difficultyDistribution
                ],
              ) || 0;
            return {
              count,
              difficulty: item.difficulty,
              measures: item.measures,
            };
          })
          .filter((rule) => rule.count > 0);

        // Increment progress simulation during generation
        const progressTimer = setInterval(() => {
          setProgress((prev) => {
            if (prev < 70) return prev + 2;
            return prev;
          });
        }, 1500);

        await generateExamAI({
          examId: generatedId,
          totalQuestions: Number(totalQuestion),
          mcqCount: Number(formData.mcqCount),
          difficulty: difficultyRules,
        });

        clearInterval(progressTimer);
        setProgress(75);

        // --- PHASE 3: REVIEW, POLISH & PUBLISH (75% - 100%) ---
        setPhase(3);
        setPhaseText("Review & Polish");
        setProgress(85);

        const user = JSON.parse(
          localStorage.getItem("user") ||
            sessionStorage.getItem("user") ||
            "{}",
        );
        const isStudent = currentUser?.role?.toLowerCase() === "student";
        
        const teacherID = user._id || currentUser?._id || "";
        const keepForever = formData.keepForever;
        const isFreePlan = currentUser?.subscription_type === "free";

        let deletion_at = null;
        if (!keepForever || isFreePlan) {
          const days = isStudent ? 1 : 3;
          deletion_at = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
        }

        const openingAt = Math.floor(
          new Date(formData.availableFrom).getTime() / 1000,
        );
        const closingAt = Math.floor(
          new Date(formData.deadline).getTime() / 1000,
        );

        const payload = {
          examId: generatedId,
          examDetails: {
            title: formData.examTitle,
            openingAt,
            closingAt,
            durationMinutes: Number(formData.durationMinutes) || 60,
            accessCode: Math.random()
              .toString(36)
              .substring(2, 8)
               .toUpperCase(),
            status: "Active" as const,
            teacherID,
            deletion_at,
          },
        };

        const publishResponse = await publishAIExam(formData.targetGroup, payload);
        setProgress(100);

        // Update user credits in store automatically
        if (publishResponse.remainingCredits !== undefined && publishResponse.remainingCredits !== null) {
          updateUser({ available_credits: publishResponse.remainingCredits });
        }

        toast.success("Exam successfully generated!");

        // Brief delay for the user to see 100% completion
        setTimeout(() => {
          if (isStudent) {
            navigate(`/student/exam/${generatedId}`);
          } else {
            navigate(`/teacher/exam/${generatedId}/review`);
          }
        }, 800);
      } catch (error: any) {
        console.error(error);
        const isStudent = currentUser?.role?.toLowerCase() === "student";
        toast.error(
          error?.response?.data?.error ||
            error?.response?.data?.message ||
            error.message ||
            "Failed to generate exam",
        );
        navigate(isStudent ? "/student/generate-exam/ai-generate" : "/teacher/generate-exam/ai-generate", { state: formData });
      }
    };

    executeGeneration();
  }, [formData, navigate, updateUser, currentUser?.role, currentUser?._id, currentUser?.subscription_type]);

  return {
    progress,
    currentMessage,
    phase,
    phaseText,
  };
}
