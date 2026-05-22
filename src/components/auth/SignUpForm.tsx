import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import StudentSignUpForm from "./StudentSignUpForm";
import TeacherSignUpForm from "./TeacherSignUpForm";
import { Link } from "react-router-dom";

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

import api from "../../api/axios";

export default function SignUpForm() {
  const methods = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      role: "Student",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      educational_level: "",
    } as SignUpFormData,
    mode: "onTouched",
  });

  const { handleSubmit, reset, watch, setError } = methods;
  const currentRole = watch("role");

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("role", data.role);

      if (data.role === "Teacher") {
        formData.append("subjects_taught", data.subjects_taught);
        if (data.file && data.file[0]) {
          formData.append("file", data.file[0]);
        }
      } else if (data.role === "Student") {
        formData.append("educational_level", data.educational_level);
      }

      const response = await api.post("/auth/signUp", formData);
      console.log("Registration successful", response.data);
      // Handle success (e.g., redirect or show toast)
    } catch (error: any) {
      console.error("Registration failed:", error);
      // Handle backend errors gracefully
      if (error.response?.data?.message) {
        setError("root", { message: error.response.data.message });
      }
    }
  };

  const handleRoleChange = (newRole: "Student" | "Teacher") => {
    if (newRole === currentRole) return;
    if (newRole === "Student") {
      reset({
        role: "Student",
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        educational_level: "",
      } as SignUpFormData);
    } else {
      reset({
        role: "Teacher",
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        subjects_taught: "",
        file: undefined,
      } as SignUpFormData);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-[#1b1b24] mb-1">
          {currentRole === "Student" ? "Join as a Student" : "Join as a Teacher"}
        </h1>
        <p className="text-sm text-[#464555]">
          {currentRole === "Student"
            ? "Start your journey towards academic excellence today."
            : "Empower your classroom with AI-driven academic excellence."}
        </p>
      </header>

      <div className="flex p-1 bg-[#f0ecf9] rounded-lg mb-6">
        <button
          onClick={() => handleRoleChange("Student")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all duration-200 ${currentRole === "Student"
            ? "bg-white text-[#3525cd] shadow-sm ring-1 ring-black/5"
            : "text-[#464555] hover:bg-[#eae6f4]"
            }`}
        >
          Student
        </button>
        <button
          onClick={() => handleRoleChange("Teacher")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all duration-200 ${currentRole === "Teacher"
            ? "bg-white text-[#3525cd] shadow-sm ring-1 ring-black/5"
            : "text-[#464555] hover:bg-[#eae6f4]"
            }`}
        >
          Teacher
        </button>
      </div>

      <div className="min-h-[360px]">
        <FormProvider {...methods}>
          <form onSubmit={(e) => { void handleSubmit(onSubmit)(e); }} className="flex flex-col gap-6 w-full animate-in fade-in duration-300">
            {methods.formState.errors.root && (
              <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg">
                {methods.formState.errors.root.message}
              </div>
            )}
            {currentRole === "Student" ? <StudentSignUpForm /> : <TeacherSignUpForm />}
          </form>
        </FormProvider>
      </div>

      {/* Footer Links */}
      <footer className="mt-8 pt-6 border-t border-[#c7c4d8] flex flex-col items-center gap-4">
        <p className="text-sm text-[#464555] text-center">
          Already have an account?{" "}
          <Link className="text-[#3525cd] font-semibold hover:underline" to="/login">Back to Login</Link>
        </p>
        <div className="flex items-center gap-4">
          <span className="h-[1px] w-12 bg-[#c7c4d8]"></span>
          <span className="text-xs text-[#464555] uppercase tracking-wider">Secure Access</span>
          <span className="h-[1px] w-12 bg-[#c7c4d8]"></span>
        </div>
      </footer>

    </div>
  );
}
