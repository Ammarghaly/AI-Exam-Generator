import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useUserStore } from "../stores/use-user-store";
import { useThemeStore } from "../stores/use-theme-store";
import { StudentLayout } from "../components/Layout/StudentLayout";
import { TeacherLayout } from "../components/Layout/TeacherLayout";
import BillingForm from "../components/checkout/BillingForm";
import OrderSummary from "../components/checkout/OrderSummary";
import { ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";

import { updateUserCredits } from "../api/auth";
import api from "../api/axios";

export default function CheckoutPage() {
  const { currentUser, updateUser } = useUserStore();
  const theme = useThemeStore((state) => state.theme);
  const navigate = useNavigate();
  const location = useLocation();
  const isStudentRole = currentUser?.role?.toLowerCase() === "student";

  // Fallback defaults if accessed directly without selecting a plan
  const stateData = location.state as {
    planName: string;
    planBilling: string;
    planPrice: number;
    isAddon: boolean;
    addonCredits?: number;
  } | null;

  const planName = stateData?.planName || "Student Lite Plan";
  const planBilling = stateData?.planBilling || "/month";
  const planPrice = stateData?.planPrice ?? 3.0;
  const isAddon = stateData?.isAddon ?? false;
  const addonCredits = stateData?.addonCredits ?? 0;

  const Layout = isStudentRole ? StudentLayout : TeacherLayout;

  const [stripe, setStripe] = useState<any>(null);
  const [cardElement, setCardElement] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize Stripe Elements
  useEffect(() => {
    let active = true;

    async function initializeStripe() {
      try {
        const StripeLib = await new Promise<any>((resolve, reject) => {
          if ((window as any).Stripe) {
            resolve((window as any).Stripe);
            return;
          }
          const existingScript = document.querySelector('script[src="https://js.stripe.com/v3/"]');
          if (existingScript) {
            existingScript.addEventListener('load', () => resolve((window as any).Stripe));
            existingScript.addEventListener('error', () => reject(new Error("Stripe.js failed to load")));
            return;
          }
          const script = document.createElement("script");
          script.src = "https://js.stripe.com/v3/";
          script.async = true;
          script.onload = () => resolve((window as any).Stripe);
          script.onerror = () => reject(new Error("Stripe.js failed to load"));
          document.body.appendChild(script);
        });

        const configRes = await api.get("/payments/config");
        if (!active) return;

        const stripeInstance = StripeLib(configRes.data.publishableKey);
        setStripe(stripeInstance);

        const elements = stripeInstance.elements({ locale: "en" });
        const card = elements.create("card", {
          hidePostalCode: true,
          style: {
            base: {
              color: theme === "dark" ? "#ffffff" : "#0f172a",
              fontFamily: "Geist, system-ui, -apple-system, sans-serif",
              fontSmoothing: "antialiased",
              fontSize: "14px",
              "::placeholder": {
                color: theme === "dark" ? "#9ca3af" : "#64748b",
              },
            },
            invalid: {
              color: "#ef4444",
              iconColor: "#ef4444",
            },
          },
        });

        setTimeout(() => {
          if (active && document.getElementById("card-element")) {
            card.mount("#card-element");
            setCardElement(card);
          }
        }, 150);

      } catch (err) {
        console.error("Failed to initialize Stripe Elements:", err);
        toast.error("Failed to initialize payment fields. Please refresh the page.");
      }
    }

    initializeStripe();

    return () => {
      active = false;
    };
  }, []);

  // Sync Stripe Elements style with theme state
  useEffect(() => {
    if (cardElement) {
      cardElement.update({
        style: {
          base: {
            color: theme === "dark" ? "#ffffff" : "#0f172a",
            "::placeholder": {
              color: theme === "dark" ? "#9ca3af" : "#64748b",
            },
          },
        },
      });
    }
  }, [theme, cardElement]);

  const handleConfirmPayment = async () => {
    if (!stripe || !cardElement) {
      toast.error("Payment fields are not fully initialized. Please wait a moment.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Gather inputs
      const cardholder = (document.getElementById("cardholder") as HTMLInputElement)?.value || "";
      const city = (document.getElementById("city") as HTMLInputElement)?.value || "";
      const country = (document.getElementById("country") as HTMLSelectElement)?.value || "United States";
      const zip = (document.getElementById("zip") as HTMLInputElement)?.value || "";

      if (!cardholder || !city || !zip) {
        toast.error("Please fill in all billing information");
        setIsSubmitting(false);
        return;
      }

      // Create Intent Client Secret
      let clientSecret = "";

      if (!isAddon && isStudentRole) {
        // Subscription flow for Student
        const intentRes = await api.post("/payments/create-subscription-intent", {
          plan: planName.toLowerCase().includes("lite") ? "lite" : "premium",
          userEmail: currentUser.email,
          userId: currentUser._id,
        });
        clientSecret = intentRes.data.clientSecret;
      } else {
        // Addon flow or Teacher flat payment flow
        const creditsAmount = isAddon
          ? addonCredits
          : planName.includes("Premium")
          ? 1000
          : 10000;
        
        const teacherPlanName = isStudentRole
          ? ""
          : planName.toLowerCase().includes("premium")
          ? "premium"
          : "institution";

        const intentRes = await api.post("/payments/create-addon-intent", {
          totalCostInDollars: planPrice,
          amountOfCredits: creditsAmount,
          userId: currentUser._id,
          planName: teacherPlanName,
        });
        clientSecret = intentRes.data.clientSecret;
      }

      if (!clientSecret) {
        throw new Error("Failed to initialize payment session with Stripe.");
      }

      // Map country name to ISO-2 code
      const countryMap: Record<string, string> = {
        "United States": "US",
        "United Kingdom": "GB",
        "Canada": "CA",
        "Germany": "DE",
        "Egypt": "EG"
      };
      const isoCountry = countryMap[country] || "US";

      // Confirm card payment via Stripe Elements
      const stripeResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: cardholder,
            address: {
              city,
              country: isoCountry,
              postal_code: zip,
            },
          },
        },
      });

      if (stripeResult.error) {
        throw new Error(stripeResult.error.message);
      }

      // 5. Update local user state
      let newSubscriptionCredits = currentUser.subscription_credits ?? 0;
      let newPurchasedCredits = currentUser.purchased_credits ?? 0;

      if (isAddon) {
        newPurchasedCredits += addonCredits;
      } else {
        if (isStudentRole) {
          if (planName.includes("Lite")) {
            newSubscriptionCredits = 150;
          } else if (planName.includes("Premium")) {
            newSubscriptionCredits = 500;
          } else {
            newSubscriptionCredits = 30;
          }
        } else {
          // For Teachers: paid plan credits (Premium/Institutions) go directly to purchased_credits (permanent)
          let planCredits = 50;
          if (planName.includes("Premium")) {
            planCredits = 1000;
          } else if (planName.includes("Institutional")) {
            planCredits = 10000;
          }
          newPurchasedCredits += planCredits;
          // Keep teacher subscription credits as 50
          newSubscriptionCredits = currentUser.subscription_credits ?? 50;
        }
      }

      const totalCredits = newSubscriptionCredits + newPurchasedCredits;
      const subType = isAddon
        ? (currentUser.subscription_type || "free")
        : planName.toLowerCase().includes("lite")
        ? "lite"
        : planName.toLowerCase().includes("premium")
        ? "premium"
        : planName.toLowerCase().includes("institution") || planName.toLowerCase().includes("institutional")
        ? "institution"
        : "free";

      // Update backend database for instant sync
      await updateUserCredits({
        available_credits: totalCredits,
        subscription_credits: newSubscriptionCredits,
        purchased_credits: newPurchasedCredits,
        subscription_type: subType,
      });

      // Update local storage store
      updateUser({
        available_credits: totalCredits,
        subscription_credits: newSubscriptionCredits,
        purchased_credits: newPurchasedCredits,
        subscription_type: subType,
      });

      toast.success("Payment completed successfully! Credits added.");
      
      const dashboardUrl = isStudentRole ? "/student/dashboard" : "/teacher/dashboard";
      navigate(dashboardUrl);
    } catch (error: any) {
      console.error("Payment failed:", error);
      toast.error(error.message || "Failed to process payment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const backUrl = isStudentRole ? "/student/pricing" : "/teacher/pricing";

  return (
    <Layout title="Checkout & Payment">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 pb-24">
        {/* Back Button */}
        <Link
          to={backUrl}
          className="inline-flex items-center gap-1.5 text-primary text-sm font-semibold hover:-translate-x-1 transition-transform duration-200"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Plans</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Billing Form Left Column */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h1 className="text-3xl font-extrabold text-foreground font-sans">Payment Details</h1>
              <p className="text-muted-foreground text-sm mt-1.5 font-sans">
                Complete your purchase to unlock premium AI capabilities.
              </p>
            </div>

            <BillingForm />
          </div>

          {/* Order Summary Right Column */}
          <aside className="lg:col-span-5 w-full">
            <OrderSummary
              planName={planName}
              planBilling={planBilling}
              planPrice={planPrice}
              isAddon={isAddon}
              isSubmitting={isSubmitting}
              onConfirm={handleConfirmPayment}
            />
          </aside>
        </div>
      </div>
    </Layout>
  );
}
