import { Info, PlusCircle, ArrowRight, Loader2 } from "lucide-react";

interface OrderSummaryProps {
  planName: string;
  planBilling: string;
  planPrice: number;
  isAddon: boolean;
  isSubmitting: boolean;
  onConfirm: () => void;
}

export default function OrderSummary({
  planName,
  planBilling,
  planPrice,
  isAddon,
  isSubmitting,
  onConfirm,
}: OrderSummaryProps) {
  const formattedPrice = `$${planPrice.toFixed(2)}`;

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 border border-border shadow-[0px_4px_20px_rgba(30,64,175,0.05)] w-full space-y-6">
      <h2 className="text-lg font-bold text-foreground font-sans">Order Summary</h2>

      {/* Item Info */}
      <div className="space-y-4">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <p className="text-sm font-bold text-foreground font-sans">{planName}</p>
            <p className="text-xs text-muted-foreground font-sans">{planBilling}</p>
          </div>
          <p className="text-sm font-bold text-foreground font-sans">{formattedPrice}</p>
        </div>

        <hr className="border-border/50" />

        {/* Pricing Totals */}
        <div className="space-y-2.5">
          <div className="flex justify-between text-sm text-muted-foreground font-sans">
            <span>Subtotal</span>
            <span>{formattedPrice}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground font-sans">
            <span>Tax (0%)</span>
            <span>$0.00</span>
          </div>
          <div className="flex justify-between text-lg font-extrabold text-primary pt-2 border-t border-border/30 font-sans">
            <span>Total</span>
            <span>{formattedPrice}</span>
          </div>
        </div>
      </div>

      {/* Disclaimers */}
      <div className="space-y-3">
        {!isAddon ? (
          <div className="p-3.5 rounded-xl bg-primary/5 border-l-4 border-primary/30 flex gap-3">
            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-left">
              <p className="text-xs font-bold text-foreground font-sans">Important Notice</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed font-sans">
                Monthly plan credits do not roll over to the next month.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-amber-500/5 border-l-4 border-amber-500/30 flex gap-3">
            <PlusCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-left">
              <p className="text-xs font-bold text-foreground font-sans">Add-on Logic</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed font-sans">
                Add-on credits never expire and will remain in your balance until used.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onConfirm}
          disabled={isSubmitting}
          className="w-full py-4 bg-primary text-primary-foreground font-bold text-sm rounded-xl shadow-lg shadow-primary/10 hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>Confirm and Pay</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      <p className="text-center text-[10px] text-muted-foreground font-sans leading-relaxed">
        By confirming, you agree to our{" "}
        <a href="#" className="underline hover:text-primary transition-colors">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline hover:text-primary transition-colors">
          Privacy Policy
        </a>
        .
      </p>

      {/* Secure badges */}
      <div className="flex justify-center items-center gap-6 pt-4 border-t border-border/30 opacity-40">
        <span className="text-[11px] font-bold tracking-wider uppercase text-muted-foreground">stripe</span>
        <span className="text-[11px] font-bold tracking-wider uppercase text-muted-foreground">visa</span>
        <span className="text-[11px] font-bold tracking-wider uppercase text-muted-foreground">mastercard</span>
      </div>
    </div>
  );
}
