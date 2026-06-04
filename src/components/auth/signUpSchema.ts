import { z } from "zod";

const baseSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(20, "Name must be at most 20 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
});

const studentSchema = baseSchema.extend({
  role: z.literal("Student"),
  educational_level: z.string().min(1, "Please select your education level"),
});

const teacherSchema = baseSchema.extend({
  role: z.literal("Teacher"),
  subjects_taught: z.string().min(2, "Subject taught must be at least 2 characters"),
  file: z.any()
    .refine((files) => files && files.length > 0, "Certificate is required")
    .refine(
      (files) => files && files[0]?.size <= 10 * 1024 * 1024,
      "Max file size is 10MB"
    )
    .refine(
      (files) =>
        files && ["application/pdf", "image/png", "image/jpeg"].includes(files[0]?.type),
      "Only PDF, PNG, and JPEG files are accepted"
    ),
});

export const signUpSchema = z
  .discriminatedUnion("role", [studentSchema, teacherSchema])
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;
