import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { uploadPDF, generateExamAI, publishAIExam } from "../api/exams";
import { useUserStore } from "../stores/use-user-store";

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

export default function AIProcessingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const processedRef = useRef(false);
  const { updateUser } = useUserStore();

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
      navigate("/teacher/generate-exam");
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
        const teacherID = user._id;

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
            durationMinutes: 60,
            accessCode: Math.random()
              .toString(36)
              .substring(2, 8)
              .toUpperCase(),
            status: "Active" as const,
            teacherID,
          },
        };

        const publishResponse = await publishAIExam(formData.targetGroup, payload);
        setProgress(100);

        // Update user credits in store automatically
        if (publishResponse.remainingCredits !== undefined && publishResponse.remainingCredits !== null) {
          updateUser({ available_credits: publishResponse.remainingCredits });
        }

        toast.success("Exam successfully generated and published!");

        // Brief delay for the user to see 100% completion
        setTimeout(() => {
          navigate(`/teacher/exam/${generatedId}/review`);
        }, 800);
      } catch (error: any) {
        console.error(error);
        toast.error(
          error?.response?.data?.error ||
            error?.response?.data?.message ||
            error.message ||
            "Failed to generate exam",
        );
        navigate("/teacher/generate-exam/ai-generate", { state: formData });
      }
    };

    executeGeneration();
  }, [formData, navigate, updateUser]);

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 select-none"
      style={{
        backgroundColor: "var(--color-background)",
        color: "var(--color-foreground)",
        width: "100%",
        minHeight: "100vh",
      }}
    >
      <main
        className="bg-white dark:bg-[#1f2226] border border-gray-200 dark:border-white/10 rounded-3xl p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col items-center text-center relative overflow-hidden"
        style={{ width: "100%", maxWidth: "512px", boxSizing: "border-box" }}
      >
        {/* Decorative background glows */}
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-violet-500/10 dark:bg-violet-500/5 blur-3xl pointer-events-none"></div>

        {/* Glowing Orb Animation */}
        <div className="relative flex items-center justify-center w-36 h-36 mb-8">
          {/* Outer glow aura */}
          <div
            className="absolute inset-0 rounded-full blur-3xl opacity-35 animate-pulse"
            style={{
              background:
                "radial-gradient(circle, var(--color-primary) 0%, var(--color-secondary) 100%)",
            }}
          ></div>
          <div
            className="absolute inset-4 rounded-full blur-xl opacity-20"
            style={{
              background:
                "radial-gradient(circle, var(--color-secondary) 0%, var(--color-tertiary) 100%)",
            }}
          ></div>

          {/* Physical Animated Core */}
          <div
            className="relative z-10 flex items-center justify-center w-24 h-24 rounded-full shadow-[0_8px_32px_rgba(107,56,212,0.35)] border border-white/10 animate-bounce"
            style={{
              background:
                "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
              animationDuration: "3s",
            }}
          >
            <span
              className="material-symbols-outlined text-[44px] animate-pulse"
              style={{
                fontVariationSettings: "'FILL' 1",
                color: "var(--color-on-primary)",
              }}
            >
              psychology
            </span>
          </div>

          {/* Orbiting Particles */}
          <div
            className="absolute top-1 right-5 w-3 h-3 rounded-full animate-ping"
            style={{
              backgroundColor: "var(--color-secondary)",
              animationDuration: "2s",
            }}
          ></div>
          <div
            className="absolute bottom-3 left-4 w-2.5 h-2.5 rounded-full animate-bounce"
            style={{
              backgroundColor: "var(--color-primary)",
              animationDuration: "1.5s",
            }}
          ></div>
        </div>

        {/* Dynamic Reassuring Header */}
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4 transition-all duration-500 ease-in-out">
          Crafting the Perfect Exam
        </h1>

        {/* Subtitle - Reassuring anim text */}
        <div className="h-16 flex items-center justify-center mb-8 px-4">
          <p
            key={currentMessage}
            className="text-base md:text-lg font-medium opacity-80 animate-fade-in transition-all duration-500 text-[var(--color-on-surface-variant)] text-center leading-relaxed"
          >
            {currentMessage}
          </p>
        </div>

        {/* Progress System */}
        <div
          className="w-full flex flex-col gap-4 px-2"
          style={{ width: "100%" }}
        >
          <div
            className="flex justify-between items-center w-full"
            style={{ width: "100%" }}
          >
            <span className="text-sm font-semibold flex items-center gap-2 opacity-95">
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ color: "var(--color-secondary)" }}
              >
                auto_awesome
              </span>
              {phaseText}
            </span>
            <span
              className="text-base font-extrabold"
              style={{ color: "var(--color-primary)" }}
            >
              {progress}%
            </span>
          </div>

          {/* Progress Bar */}
          <div
            className="h-3 w-full rounded-full overflow-hidden shadow-inner"
            style={{
              width: "100%",
              backgroundColor: "var(--color-surface-container-high)",
            }}
          >
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progress}%`,
                background:
                  "linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
              }}
            ></div>
          </div>

          {/* Stepper Phase Indicators */}
          <div
            className="flex justify-between mt-6 border-t border-slate-100 dark:border-white/5 pt-6 w-full"
            style={{ width: "100%" }}
          >
            <div
              className={`flex flex-col items-center flex-1 gap-1 transition-all duration-300 ${phase >= 1 ? "opacity-100 scale-105" : "opacity-40"}`}
            >
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor:
                    phase >= 1 ? "rgba(0, 40, 142, 0.1)" : "transparent",
                  color: phase >= 1 ? "var(--color-primary)" : "inherit",
                }}
              >
                Phase 1
              </span>
              <span className="text-xs font-semibold text-[var(--color-on-surface-variant)]">
                Parsing
              </span>
            </div>
            <div
              className={`flex flex-col items-center flex-1 gap-1 transition-all duration-300 ${phase >= 2 ? "opacity-100 scale-105" : "opacity-40"}`}
            >
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor:
                    phase >= 2 ? "rgba(107, 56, 212, 0.1)" : "transparent",
                  color: phase >= 2 ? "var(--color-secondary)" : "inherit",
                }}
              >
                Phase 2
              </span>
              <span className="text-xs font-semibold text-[var(--color-on-surface-variant)]">
                Generation
              </span>
            </div>
            <div
              className={`flex flex-col items-center flex-1 gap-1 transition-all duration-300 ${phase >= 3 ? "opacity-100 scale-105" : "opacity-40"}`}
            >
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor:
                    phase >= 3 ? "rgba(68, 0, 152, 0.1)" : "transparent",
                  color: phase >= 3 ? "var(--color-tertiary)" : "inherit",
                }}
              >
                Phase 3
              </span>
              <span className="text-xs font-semibold text-[var(--color-on-surface-variant)]">
                Publishing
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
