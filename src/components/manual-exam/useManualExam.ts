import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { examSchema, type ExamFormValues } from "./schema";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { generateExamManually } from "../../api/exams";

export function useManualExam() {
  const [step, setStep] = useState<"build" | "publish">("build");
  const navigate = useNavigate();

  const methods = useForm<ExamFormValues>({
    resolver: zodResolver(examSchema) as any,
    defaultValues: {
      examTitle: "",
      targetGroup: "",
      availableFrom: new Date(),
      deadline: new Date(new Date().setDate(new Date().getDate() + 7)),
      durationMinutes: 60,
      allowImmediateAI: false,
      allowReview: false,
      randomizeQuestions: false,
      questions: [
        {
          id: Math.random().toString(36).substring(2, 9),
          type: "Multiple Choice",
          points: 5,
          text: "",
          options: [
            {
              id: Math.random().toString(36).substring(2, 9),
              text: "",
              isCorrect: true,
            },
            {
              id: Math.random().toString(36).substring(2, 9),
              text: "",
              isCorrect: false,
            },
            {
              id: Math.random().toString(36).substring(2, 9),
              text: "",
              isCorrect: false,
            },
            {
              id: Math.random().toString(36).substring(2, 9),
              text: "",
              isCorrect: false,
            },
          ],
        },
      ],
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const totalPoints = methods
    .watch("questions")
    .reduce((sum, q) => sum + (Number(q.points) || 0), 0);

  const addQuestion = () => {
    append({
      id: Math.random().toString(36).substring(2, 9),
      type: "Multiple Choice",
      points: 5,
      text: "",
      options: [
        {
          id: Math.random().toString(36).substring(2, 9),
          text: "",
          isCorrect: true,
        },
        {
          id: Math.random().toString(36).substring(2, 9),
          text: "",
          isCorrect: false,
        },
        {
          id: Math.random().toString(36).substring(2, 9),
          text: "",
          isCorrect: false,
        },
        {
          id: Math.random().toString(36).substring(2, 9),
          text: "",
          isCorrect: false,
        },
      ],
    });
  };

  const duplicateQuestion = (index: number) => {
    const qToCopy = methods.getValues(`questions.${index}`);
    append({
      ...qToCopy,
      id: Math.random().toString(36).substring(2, 9),
      options: qToCopy.options?.map((opt) => ({
        ...opt,
        id: Math.random().toString(36).substring(2, 9),
      })),
    });
  };

  const onSubmit = async (data: ExamFormValues) => {
    try {
      const user = JSON.parse(
        localStorage.getItem("user") || sessionStorage.getItem("user") || "{}",
      );
      const teacherID = user._id || "68401234abcd5678ef901111";

      const mappedQuestions = data.questions.map((q) => {
        const isMCQ = q.type === "Multiple Choice";
        const options =
          isMCQ && q.options ? q.options.map((opt) => opt.text) : [];
        let correctAnswer = "";
        if (isMCQ && q.options) {
          const correctOpt = q.options.find((opt) => opt.isCorrect);
          correctAnswer = correctOpt ? correctOpt.text : "";
        } else {
          correctAnswer = q.idealAnswer || "True";
        }

        return {
          title: q.text,
          options: options,
          correctAnswer: correctAnswer,
          difficulty: "Manual" as const,
          cognitiveLevel: "Manual" as const,
          typeQue: (isMCQ ? "MCQ" : "TF") as "MCQ" | "TF",
        };
      });

      const now = Date.now();
      const openingAt = Math.floor(
        new Date(data.availableFrom || now).getTime() / 1000,
      );
      const closingAt = Math.floor(
        new Date(data.deadline || now + 7 * 24 * 60 * 60 * 1000).getTime() /
          1000,
      );

      const payload = {
        examDetails: {
          title: data.examTitle,
          openingAt,
          closingAt,
          durationMinutes: data.durationMinutes || 60,
          accessCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
          status: "Active" as const,
          teacherID,
        },
        questions: mappedQuestions,
      };

      const response = await generateExamManually(data.targetGroup, payload);
      toast.success("Exam successfully published manually!");

      const examId = response?.data?._id || response?._id;
      if (examId) {
        navigate(`/teacher/exam/${examId}/review`);
      } else {
        navigate("/teacher/exam-management");
      }
    } catch (error: any) {
      console.error(error);
      let errorMessage = "Failed to publish exam";
      if (error?.response?.data) {
        const data = error.response.data;
        if (typeof data.error === "string") {
          errorMessage = data.error;
        } else if (data.error?.details && Array.isArray(data.error.details)) {
          errorMessage = data.error.details
            .map((d: any) => d.message)
            .join(", ");
        } else if (typeof data.message === "string") {
          errorMessage = data.message;
        } else if (
          data.message?.details &&
          Array.isArray(data.message.details)
        ) {
          errorMessage = data.message.details
            .map((d: any) => d.message)
            .join(", ");
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    }
  };

  const onInvalid = () => {
    toast.error("Please fix the errors before publishing.");
  };

  const handleProceed = async () => {
    const isValid = await methods.trigger(["examTitle", "questions"]);
    if (isValid) {
      setStep("publish");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      toast.error("Please fix the errors in your exam before proceeding.");
    }
  };

  return {
    step,
    setStep,
    methods,
    handleSubmit,
    onSubmit,
    onInvalid,
    errors,
    fields,
    remove,
    addQuestion,
    duplicateQuestion,
    totalPoints,
    handleProceed,
  };
}
