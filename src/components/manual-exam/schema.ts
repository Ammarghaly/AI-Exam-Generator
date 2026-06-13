import { z } from "zod";

export const optionSchema = z.object({
  id: z.string(),
  text: z.string().min(1, "Option text is required"),
  isCorrect: z.boolean(),
});

export const questionSchema = z
  .object({
    id: z.string(),
    type: z.enum(["Multiple Choice", "True/False", "Short Answer", "Essay"]),
    points: z.number().min(1, "Points must be at least 1"),
    text: z.string().min(1, "Question text is required"),
    options: z.array(optionSchema).optional(),
    idealAnswer: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "Multiple Choice") {
      if (!data.options || data.options.length !== 4) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Multiple Choice requires exactly 4 options",
          path: ["options"],
        });
      } else {
        const hasCorrect = data.options.some((o) => o.isCorrect);
        if (!hasCorrect) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select a correct option",
            path: ["options"],
          });
        }
      }
    }
  });

export const examSchema = z.object({
  examTitle: z.string().min(1, "Exam title is required"),
  targetGroup: z.string().min(1, "Target group is required"),
  questions: z
    .array(questionSchema)
    .min(1, "At least one question is required"),
  availableFrom: z
    .date({ message: "Available from date is required" })
    .optional(),
  deadline: z.date({ message: "Deadline date is required" }).optional(),
  durationMinutes: z.coerce.number().min(1, "Duration must be at least 1 minute"),
  allowImmediateAI: z.boolean().optional(),
  allowReview: z.boolean().optional(),
  randomizeQuestions: z.boolean().optional(),
});

export type ExamFormValues = z.infer<typeof examSchema>;

export type QuestionType =
  | "Multiple Choice"
  | "True/False"
  | "Short Answer"
  | "Essay";
