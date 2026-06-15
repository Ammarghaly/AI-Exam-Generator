
interface PricingHeaderProps {
  activeView: "student" | "teacher";
  onViewChange?: (view: "student" | "teacher") => void;
}

export default function PricingHeader({ activeView, onViewChange }: PricingHeaderProps) {
  return (
    <section className="text-center space-y-4 pt-8 md:pt-12">
      <h1 className="text-3xl md:text-5xl font-bold text-primary tracking-tight font-sans">
        Upgrade Your Academic Potential
      </h1>
      <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto font-sans leading-relaxed">
        Choose the right plan to power your exams with AI. Simplified pedagogy for students and educators alike.
      </p>

      {/* Toggle Switcher */}
      {onViewChange && (
        <div className="flex justify-center pt-6">
          <div className="bg-muted p-1 rounded-xl flex relative border border-border/50">
            <button
              type="button"
              className={`relative z-10 px-8 py-2.5 text-sm font-semibold transition-all duration-300 rounded-lg cursor-pointer ${
                activeView === "student" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => onViewChange("student")}
            >
              Student
            </button>
            <button
              type="button"
              className={`relative z-10 px-8 py-2.5 text-sm font-semibold transition-all duration-300 rounded-lg cursor-pointer ${
                activeView === "teacher" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => onViewChange("teacher")}
            >
              Teacher
            </button>
            <div
              className="absolute top-1 bottom-1 bg-primary rounded-lg transition-all duration-300 shadow-sm"
              style={{
                left: activeView === "student" ? "4px" : "calc(50% - 2px)",
                width: "calc(50% - 2px)",
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
