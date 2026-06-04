const PLANS = [
  {
    tier: 'PERSONAL',
    price: '$0',
    period: '/month',
    highlight: false,
    features: ['5 exams per month', 'Text & PDF input', 'Standard PDF export'],
    cta: 'Start for Free',
    ctaClass:
      'w-full py-md border border-primary text-primary rounded-lg text-h3 font-semibold hover:bg-surface-container-low transition-colors text-center',
    href: '/register',
  },
  {
    tier: 'EDUCATOR PRO',
    price: '$19',
    period: '/month',
    highlight: true,
    badge: 'Most Popular',
    features: [
      'Unlimited exams',
      'Video & URL input',
      'LMS Integrations',
      'Advanced analytics',
    ],
    cta: 'Get Pro Access',
    ctaClass:
      'w-full py-md bg-primary text-on-primary rounded-lg text-h3 font-semibold hover:opacity-90 transition-opacity text-center',
    href: '/register',
  },
  {
    tier: 'INSTITUTION',
    price: 'Custom',
    period: null,
    highlight: false,
    features: [
      'Single Sign-On (SSO)',
      'Dedicated success manager',
      'Department-wide collaboration',
      'Unlimited storage',
    ],
    cta: 'Contact Sales',
    ctaClass:
      'w-full py-md border border-outline text-on-surface rounded-lg text-h3 font-semibold hover:bg-surface-container-low transition-colors text-center',
    href: '#contact',
  },
] as const;

export default function PricingSection() {
  return (
    <section className="bg-surface-container-lowest py-12" id="pricing">
      <div className="max-w-7xl mx-auto px-lg">
        <div className="text-center mb-xl ">
          <h2 className="font-display text-display font-extrabold mb-md">
            Simple, Predictable Pricing
          </h2>
          <p className="font-body text-h3 text-on-surface-variant">
            Scale your assessment strategy without breaking the bank.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
          {PLANS.map((plan) => (
            <div
              key={plan.tier}
              className={`bg-surface rounded-xl p-xl border flex flex-col ${
                plan.highlight
                  ? 'border-2 border-primary relative md:scale-105 shadow-xl z-10'
                  : 'border-outline-variant'
              }`}
            >
              {plan.highlight && 'badge' in plan && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-md py-1 rounded-full font-label text-[10px] tracking-wider uppercase">
                  {plan.badge}
                </div>
              )}
              <span
                className={`font-label text-label mb-sm ${
                  plan.highlight ? 'text-primary' : 'text-on-surface-variant'
                }`}
              >
                {plan.tier}
              </span>
              <div className="mb-lg">
                <span className="font-display text-[40px] font-extrabold">{plan.price}</span>
                {plan.period && (
                  <span className="font-body text-on-surface-variant">{plan.period}</span>
                )}
              </div>
              <ul className="space-y-md mb-xl grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-sm">
                    <span className="material-symbols-outlined text-primary text-[18px]">
                      check_circle
                    </span>
                    <span className="font-body">{feature}</span>
                  </li>
                ))}
              </ul>
              <a href={plan.href} className={plan.ctaClass}>
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
