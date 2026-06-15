import { CheckCircle2, Info } from "lucide-react";

interface PricingCardProps {
  title: string;
  price: string;
  billing: string;
  features: string[];
  popularText?: string;
  isPopular?: boolean;
  isCurrent?: boolean;
  infoText?: string;
  onSubscribe: () => void;
  buttonText?: string;
}

export default function PricingCard({
  title,
  price,
  billing,
  features,
  popularText,
  isPopular = false,
  isCurrent = false,
  infoText,
  onSubscribe,
  buttonText = "Subscribe Now",
}: PricingCardProps) {
  return (
    <div
      className={`relative flex flex-col bg-surface border rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 ${
        isPopular ? "border-2 border-primary" : "border-border"
      }`}
    >
      {isPopular && popularText && (
        <span className="absolute top-0 right-8 -translate-y-1/2 bg-primary text-primary-foreground text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
          {popularText}
        </span>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-bold text-foreground font-sans">{title}</h3>
        <div className="mt-4 flex items-baseline gap-1.5">
          <span className="text-4xl font-extrabold text-foreground font-sans">{price}</span>
          <span className="text-muted-foreground text-sm font-medium font-sans">{billing}</span>
        </div>
      </div>

      {infoText && (
        <div className="bg-primary/5 text-primary text-xs font-semibold px-3 py-2.5 rounded-lg mb-6 flex items-center gap-2 border border-primary/10">
          <Info className="w-4 h-4 shrink-0" />
          <span>{infoText}</span>
        </div>
      )}

      <ul className="space-y-4 mb-8 flex-1">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3 text-sm text-foreground/80 leading-relaxed font-sans">
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {isCurrent ? (
        <button
          type="button"
          disabled
          className="w-full py-3 px-6 rounded-xl font-bold border border-border text-muted-foreground bg-muted/20 select-none cursor-default"
        >
          Current Plan
        </button>
      ) : (
        <button
          type="button"
          onClick={onSubscribe}
          className={`w-full py-3 px-6 rounded-xl font-bold transition-all active:scale-[0.98] cursor-pointer ${
            isPopular
              ? "bg-primary text-primary-foreground hover:opacity-90 shadow-md shadow-primary/10"
              : "border border-primary text-primary hover:bg-primary/5"
          }`}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}
