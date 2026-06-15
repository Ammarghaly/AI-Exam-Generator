import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/use-user-store";
import { StudentLayout } from "../components/Layout/StudentLayout";
import { TeacherLayout } from "../components/Layout/TeacherLayout";
import PricingHeader from "../components/pricing/PricingHeader";
import PricingCard from "../components/pricing/PricingCard";
import AddonCreditsSection from "../components/pricing/AddonCreditsSection";
import PricingAIPanel from "../components/pricing/PricingAIPanel";

export default function PricingPage() {
  const { currentUser } = useUserStore();
  const navigate = useNavigate();
  const isStudentRole = currentUser?.role?.toLowerCase() === "student";

  const activeView = isStudentRole ? "student" : "teacher";

  const Layout = isStudentRole ? StudentLayout : TeacherLayout;

  const handleSubscribe = (planName: string, price: number, billing: string) => {
    const checkoutUrl = isStudentRole ? "/student/checkout" : "/teacher/checkout";
    navigate(checkoutUrl, {
      state: {
        planName,
        planPrice: price,
        planBilling: billing,
        isAddon: false,
      },
    });
  };

  const handleBuyAddon = (credits: number, cost: number) => {
    const checkoutUrl = isStudentRole ? "/student/checkout" : "/teacher/checkout";
    navigate(checkoutUrl, {
      state: {
        planName: `Add-on Credits (${credits} credits)`,
        planPrice: cost,
        planBilling: "One-time Charge",
        isAddon: true,
        addonCredits: credits,
      },
    });
  };

  return (
    <Layout title="Pricing Plans">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12 pb-24">
        <PricingHeader activeView={activeView} />

        {/* Student Pricing Grid */}
        {activeView === "student" && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <PricingCard
              title="Free Tier"
              price="$0"
              billing="/forever"
              features={["30 free credits", "Max 10 questions/exam", "24h exam expiry"]}
              isCurrent={currentUser?.subscription_type === "free"}
              onSubscribe={() => handleSubscribe("Free Tier", 0, "/forever")}
              buttonText="Current Plan"
            />
            <PricingCard
              title="Student Lite"
              price="$3"
              billing="/month"
              infoText="Monthly credits do not roll over"
              features={["150 credits / month", "Permanent exams", "Export to PDF/Docs"]}
              isPopular={true}
              popularText="MOST POPULAR"
              isCurrent={currentUser?.subscription_type === "premium_lite"} // Example check
              onSubscribe={() => handleSubscribe("Student Lite Plan", 3, "/month")}
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
              isCurrent={currentUser?.subscription_type === "premium"}
              onSubscribe={() => handleSubscribe("Student Premium Plan", 10, "/month")}
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
              isCurrent={currentUser?.subscription_type === "free" && currentUser?.role === "Teacher"}
              onSubscribe={() => handleSubscribe("Free Tier", 0, "/forever")}
              buttonText="Get Started"
            />
            <PricingCard
              title="Teacher Premium"
              price="$15"
              billing="/month"
              features={["1,000 credits / month", "Permanent exams", "Bulk generation tools"]}
              isPopular={true}
              popularText="INSTITUTIONAL GRADE"
              isCurrent={currentUser?.subscription_type === "premium" && currentUser?.role === "Teacher"}
              onSubscribe={() => handleSubscribe("Teacher Premium Plan", 15, "/month")}
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
              isCurrent={currentUser?.subscription_type === "institution"}
              onSubscribe={() => handleSubscribe("Institutional Plan", 135, "/month")}
            />
          </div>
        )}

        {/* Add-on Credits */}
        <AddonCreditsSection role={activeView} onBuy={handleBuyAddon} />

        {/* Shimmer / Promotional Panel */}
        <PricingAIPanel />
      </div>
    </Layout>
  );
}
