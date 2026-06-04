export default function CtaSection() {
  return (
    <section className="px-lg md:px-xl py-12 bg-primary text-on-primary text-center">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-[40px] font-extrabold mb-lg leading-tight">
          Ready to transform your assessments?
        </h2>
        <p className="font-body text-h3 mb-xl opacity-80">
          Join 12,000+ educators who are already saving 10+ hours a week with Academix AI.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-md">
          <a
            href="/register"
            className="bg-on-primary text-primary px-xl py-lg rounded-xl text-h3 font-semibold shadow-lg hover:scale-[1.02] transition-transform"
          >
            Get Started Now
          </a>
          <button
            type="button"
            className="bg-overlay-10 text-on-primary border border-overlay-20 px-xl py-lg rounded-xl text-h3 font-semibold hover:bg-overlay-20 transition-all cursor-pointer"
          >
            Schedule Demo
          </button>
        </div>
      </div>
    </section>
  );
}
