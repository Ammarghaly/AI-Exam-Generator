import { useState } from "react";
import { CreditCard, CheckCircle2 } from "lucide-react";

export default function BillingForm() {
  const [method, setMethod] = useState<"card" | "paypal">("card");

  return (
    <div className="space-y-8 w-full">
      {/* Payment Method Selector */}
      <div className="space-y-4">
        <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider block">
          Payment Method
        </label>
        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            className={`flex items-center gap-3 px-6 py-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
              method === "card"
                ? "border-primary bg-primary/5 text-primary font-bold"
                : "border-border text-muted-foreground hover:bg-muted/50"
            }`}
            onClick={() => setMethod("card")}
          >
            <CreditCard className="w-5 h-5 shrink-0" />
            <span>Credit Card</span>
            {method === "card" && <CheckCircle2 className="w-4 h-4 ml-1 text-primary" />}
          </button>
          <button
            type="button"
            className={`flex items-center gap-3 px-6 py-4 rounded-xl border transition-all duration-200 grayscale opacity-60 cursor-not-allowed`}
            disabled
            title="PayPal is coming soon"
          >
            <span className="text-sm font-semibold">PayPal (Soon)</span>
          </button>
        </div>
      </div>

      {/* Secure Connection Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-full border border-emerald-100 dark:border-emerald-500/15 text-xs font-semibold">
        <span className="material-symbols-outlined text-[16px] fill-current">lock</span>
        <span>Secure Checkout — Encrypted connection</span>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-full space-y-2">
            <label className="text-sm font-semibold text-foreground block" htmlFor="cardholder">
              Cardholder Name
            </label>
            <input
              type="text"
              id="cardholder"
              placeholder="Johnathan Doe"
              className="w-full bg-surface border border-border text-foreground rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all placeholder:text-muted-foreground/45 font-sans"
              required
            />
          </div>
          <div className="col-span-full space-y-2">
            <label className="text-sm font-semibold text-foreground block">
              Card Details
            </label>
            <div className="relative">
              <div 
                id="card-element" 
                className="w-full bg-surface border border-border rounded-xl px-4 py-4 text-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary focus-within:outline-none transition-all font-sans"
              >
                {/* Stripe Elements will dynamically mount here */}
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground font-sans mt-1">
              Payments are fully encrypted. Enter card number, expiry, and CVV inside the secure field above.
            </p>
          </div>
        </div>

        <hr className="border-border/50" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground block" htmlFor="city">
              City
            </label>
            <input
              type="text"
              id="city"
              placeholder="New York"
              className="w-full bg-surface border border-border text-foreground rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all placeholder:text-muted-foreground/45 font-sans"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground block" htmlFor="country">
              Country
            </label>
            <select
              id="country"
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all font-sans text-foreground"
            >
              <option>United States</option>
              <option>United Kingdom</option>
              <option>Canada</option>
              <option>Germany</option>
              <option>Egypt</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground block" htmlFor="zip">
              Zip Code
            </label>
            <input
              type="text"
              id="zip"
              placeholder="10001"
              className="w-full bg-surface border border-border text-foreground rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all placeholder:text-muted-foreground/45 font-sans"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
}
