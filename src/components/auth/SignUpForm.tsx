import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import StudentSignUpForm from "./StudentSignUpForm";
import TeacherSignUpForm from "./TeacherSignUpForm";
import { useRegisterUser } from "../../hooks/useRegisterUser";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const baseSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string(),
});

const studentSchema = baseSchema.extend({
  role: z.literal("student"),
  educationLevel: z.string().min(1, "Please select your education level"),
});

const teacherSchema = baseSchema.extend({
  role: z.literal("teacher"),
  subjectTaught: z.string().min(2, "Subject taught must be at least 2 characters"),
  certificate: z.any()
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

export default function SignUpForm() {
  const methods = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      role: "student",
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      educationLevel: "",
    } as SignUpFormData,
    mode: "onTouched",
  });

  const { handleSubmit, reset, watch } = methods;
  const currentRole = watch("role");
  const { mutateAsync: registerUser } = useRegisterUser();
  const navigate = useNavigate();

  const onSubmit = async (data: SignUpFormData) => {
    try {
      await registerUser(data);
      toast.success("Registration successful!");
      navigate("/login");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
      console.error(error);
    }
  };

  const handleRoleChange = (newRole: "student" | "teacher") => {
    if (newRole === currentRole) return;
    if (newRole === "student") {
      reset({
        role: "student",
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        educationLevel: "",
      } as SignUpFormData);
    } else {
      reset({
        role: "teacher",
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        subjectTaught: "",
        certificate: undefined,
      } as SignUpFormData);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-[#1b1b24] mb-1">
          {currentRole === "student" ? "Join as a Student" : "Join as a Teacher"}
        </h1>
        <p className="text-sm text-[#464555]">
          {currentRole === "student"
            ? "Start your journey towards academic excellence today."
            : "Empower your classroom with AI-driven academic excellence."}
        </p>
      </header>

      <div className="flex p-1 bg-[#f0ecf9] rounded-lg mb-6">
        <button
          onClick={() => handleRoleChange("student")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all duration-200 ${currentRole === "student"
              ? "bg-white text-[#3525cd] shadow-sm ring-1 ring-black/5"
              : "text-[#464555] hover:bg-[#eae6f4]"
            }`}
        >
          Student
        </button>
        <button
          onClick={() => handleRoleChange("teacher")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all duration-200 ${currentRole === "teacher"
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
            {currentRole === "student" ? <StudentSignUpForm /> : <TeacherSignUpForm />}
          </form>
        </FormProvider>
      </div>

      {/* Footer Links */}
      <footer className="mt-8 pt-6 border-t border-[#c7c4d8] flex flex-col items-center gap-4">
        <p className="text-sm text-[#464555] text-center">
          Already have an account?{" "}
          <a className="text-[#3525cd] font-semibold hover:underline" href="/login">Back to Login</a>
        </p>
        <div className="flex items-center gap-4">
          <span className="h-[1px] w-12 bg-[#c7c4d8]"></span>
          <span className="text-xs text-[#464555] uppercase tracking-wider">Secure Access</span>
          <span className="h-[1px] w-12 bg-[#c7c4d8]"></span>
        </div>
      </footer>
      <p className="mt-6 text-center text-xs text-[#464555] px-4">
        By creating an account, you agree to our{" "}
        <a className="underline hover:text-[#3525cd]" href="#">Terms of Service</a>{" "}
        and{" "}
        <a className="underline hover:text-[#3525cd]" href="#">Privacy Policy</a>.
      </p>
    </div>
  );
}
