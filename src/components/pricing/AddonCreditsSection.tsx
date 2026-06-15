import React, { useState, useEffect } from "react";

interface AddonCreditsSectionProps {
  role: "student" | "teacher";
  onBuy: (credits: number, cost: number) => void;
}

export default function AddonCreditsSection({ role, onBuy }: AddonCreditsSectionProps) {
  const minCredits = role === "teacher" ? 300 : 100;
  const [credits, setCredits] = useState<number>(minCredits);

  // Sync state if role changes
  useEffect(() => {
    setCredits(minCredits);
  }, [role, minCredits]);

  const cost = Number((credits * 0.05).toFixed(2));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setCredits(val);
  };

  const handleBlur = () => {
    if (credits < minCredits) {
      setCredits(minCredits);
    }
  };

  return (
    <section className="max-w-4xl mx-auto w-full">
      <div className="bg-surface-container border border-border p-6 md:p-8 rounded-2xl flex flex-col md:flex-row items-center gap-6 shadow-sm">
        <div className="flex-1 space-y-2 text-center md:text-left">
          <h2 className="text-xl font-bold text-primary font-sans">
            Need more power? Add-on Credits
          </h2>
          <p className="text-sm text-muted-foreground font-sans">
            Add-on credits never expire. Perfect for peak exam seasons.
          </p>
        </div>
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4 items-stretch sm:items-end">
          <div className="space-y-1.5 w-full sm:w-48">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
              Credit Amount
            </label>
            <input
              type="number"
              min={minCredits}
              value={credits}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all text-sm font-semibold font-sans text-foreground"
            />
            <p className="text-sm text-primary font-bold pt-1.5 font-sans">
              Total Cost: ${cost.toFixed(2)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onBuy(credits, cost)}
            disabled={credits < minCredits}
            className="bg-primary hover:opacity-90 disabled:opacity-50 text-primary-foreground font-bold py-3 px-8 rounded-xl h-[46px] flex items-center justify-center transition-all active:scale-95 whitespace-nowrap cursor-pointer text-sm"
          >
            Buy Credits
          </button>
        </div>
      </div>
    </section>
  );
}
