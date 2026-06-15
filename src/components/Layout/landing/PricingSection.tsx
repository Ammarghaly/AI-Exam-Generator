import { useState } from "react";
import PricingHeader from "../../../components/pricing/PricingHeader";
import PricingCard from "../../../components/pricing/PricingCard";

export default function PricingSection() {
  const [activeView, setActiveView] = useState<"student" | "teacher">("student");

  const handleSubscribeRedirect = () => {
    // Redirect guests to login/signup to subscribe from inside dashboard
    window.location.href = "/login";
  };

  return (
    <section className="bg-surface-container-lowest py-16" id="pricing">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        <PricingHeader activeView={activeView} onViewChange={setActiveView} />

        {/* Student Pricing Grid */}
        {activeView === "student" && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <PricingCard
              title="Free Tier"
              price="$0"
              billing="/forever"
              features={["30 free credits", "Max 10 questions/exam", "24h exam expiry"]}
              onSubscribe={handleSubscribeRedirect}
              buttonText="Start for Free"
            />
            <PricingCard
              title="Student Lite"
              price="$3"
              billing="/month"
              infoText="Monthly credits do not roll over"
              features={["150 credits / month", "Permanent exams", "Export to PDF/Docs"]}
              isPopular={true}
              popularText="MOST POPULAR"
              onSubscribe={handleSubscribeRedirect}
            />
            <PricingCard
              title="Student Premium"
              price="$10"
              billing="/month"
              features={[
                "500 credits / month",
                "Credits roll over monthly",
                "Priority AI Generation",
                "Permanent exams",
              ]}
              onSubscribe={handleSubscribeRedirect}
            />
          </div>
        )}

        {/* Teacher Pricing Grid */}
        {activeView === "teacher" && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <PricingCard
              title="Free Tier"
              price="$0"
              billing="/forever"
              features={["50 free credits", "3-day exam expiry"]}
              onSubscribe={handleSubscribeRedirect}
              buttonText="Get Started"
            />
            <PricingCard
              title="Teacher Premium"
              price="$15"
              billing="/month"
              features={["1,000 credits / month", "Permanent exams", "Bulk generation tools"]}
              isPopular={true}
              popularText="INSTITUTIONAL GRADE"
              onSubscribe={handleSubscribeRedirect}
            />
            <PricingCard
              title="Institutions"
              price="$135"
              billing="/month"
              features={[
                "10,000 credits / month",
                "Custom pedagogy fine-tuning",
                "LMS Integration (Canvas/Moodle)",
              ]}
              onSubscribe={handleSubscribeRedirect}
            />
          </div>
        )}

        {/* Custom add-on credits note */}
        <div className="max-w-4xl mx-auto w-full mt-12 bg-surface p-6 rounded-2xl border border-dashed border-border text-center space-y-1.5 shadow-sm">
          <h4 className="text-sm font-bold text-primary font-sans">
            * Need custom credit add-ons?
          </h4>
          <p className="text-xs text-muted-foreground font-sans">
            Once logged in, you can purchase custom add-on credits directly from your dashboard to support high-volume exam generation.
          </p>
        </div>
      </div>
    </section>
  );
}
