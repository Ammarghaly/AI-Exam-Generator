import { GraduationCap } from "lucide-react";
import SignUpForm from "../components/auth/SignUpForm";

const imgUrl = "https://lh3.googleusercontent.com/aida/ADBb0uhTWfQt--ZUQNbMtWsEaD2p9i03CH_Q5BWk5qlf27e35TPv1UgGEVyJYXNMeD8efant3ZF5Ugl-UPrVGrvAnXmGHum5-4eGr_SLeVFTdxTnr8rJjd2xKaUlkFztX-D7p39YapwhZ_Bn6C4nVjAh7ZEIC0VAprk4Sa1wBpltdvKHi4_V_R7C-s-kF2rsHMeSvAFwMihpX9dZjQwVrMFW1fI-V5f3YhbUKpINMWWoE9rP5o5PzCCISSj91aU";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-[#fcf8ff] font-sans">
      {/* Left Side */}
      <section className="hidden lg:flex w-1/2 flex-col justify-between p-8 xl:p-12 relative overflow-hidden bg-[#4f46e5]">
        {/* Background Gradients */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#4f46e5] to-[#3525cd] opacity-90"></div>
        <div className="absolute -top-[10%] -right-[10%] w-64 h-64 bg-white/10 rounded-full blur-3xl z-0"></div>
        <div className="absolute -bottom-[10%] -left-[10%] w-96 h-96 bg-black/10 rounded-full blur-3xl z-0"></div>

        {/* Top Branding */}
        <div className="relative z-10 flex items-center gap-3 text-white">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shadow-sm">
            <GraduationCap className="w-7 h-7" />
          </div>
          <span className="text-2xl font-bold tracking-tight">EduGenius AI</span>
        </div>

        {/* Main Content */}
        <div className="relative z-10 w-full mx-auto flex flex-col justify-center my-auto py-8">
          <h1 className="text-4xl xl:text-5xl font-extrabold text-[#dad7ff] mb-4 lg:mb-6 leading-tight">
            The Future of Education
          </h1>
          <p className="text-lg xl:text-xl font-medium text-[#dad7ff]/90 mb-8 lg:mb-12 leading-relaxed">
            Empowering the next generation of academic excellence through intelligent mentorship and automated exam generation.
          </p>

          <div className="w-full max-w-[400px] aspect-square mx-auto rounded-3xl overflow-hidden shadow-2xl bg-[#e4e1ee]/10 backdrop-blur-sm border border-[#dad7ff]/20">
            <img
              alt="Educational AI Concept"
              className="w-full h-full object-cover mix-blend-luminosity opacity-90 hover:opacity-100 transition-opacity duration-500"
              src={imgUrl}
            />
          </div>
        </div>

        {/* Footer Text */}
        <div className="relative z-10 text-[#dad7ff]/50 text-xs xl:text-sm uppercase tracking-widest font-semibold">
          The Intelligent Mentor System © 2024
        </div>
      </section>

      {/* Right Side */}
      <section className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 bg-[#fcf8ff] overflow-y-auto">
        <main className="w-full max-w-[500px]">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-10 flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 bg-[#3525cd] rounded-xl flex items-center justify-center shadow-lg shadow-[#3525cd]/20">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-extrabold text-[#3525cd] tracking-tight">EduGenius AI</span>
          </div>

          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#e4e1ee] p-8 md:p-10 transition-all duration-300">
            <SignUpForm />
          </div>
        </main>
      </section>
    </div>
  );
}
