import { LANDING_IMAGES } from './landingAssets';

export default function HeroSection() {
  return (
    <section className="px-lg md:px-xl mb-12 overflow-hidden" id="hero">
      <div className="max-w-7xl mx-auto text-center">
       

        <h1 className="font-display text-[48px] md:text-[64px] leading-tight font-extrabold mb-md max-w-4xl mx-auto text-on-background">
          Generate Professional{' '}
          <span className="text-primary">Exams &amp; Assessments</span> in Seconds
        </h1>

        <p className="font-body text-h2 text-on-surface-variant mb-xl max-w-2xl mx-auto">
          The intelligent mentor for educators. Transform documents, videos, or topics into
          comprehensive assessments with AI-driven pedagogical precision.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-md mb-32">
          <a
            href="/register"
            className="bg-primary-container text-on-primary-container px-xl py-lg rounded-xl text-h3 font-semibold flex items-center justify-center gap-sm shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
          >
            Start Building for Free
            <span className="material-symbols-outlined">arrow_forward</span>
          </a>
          <button
            type="button"
            className="bg-surface text-primary border border-outline-variant px-xl py-lg rounded-xl text-h3 font-semibold flex items-center justify-center gap-sm hover:bg-surface-container-low transition-all cursor-pointer"
          >
            Watch Demo
            <span className="material-symbols-outlined">play_circle</span>
          </button>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div
            className="absolute -top-12 -left-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"
            aria-hidden
          />
          <div
            className="absolute -bottom-12 -right-12 w-64 h-64 bg-secondary/10 rounded-full blur-3xl pointer-events-none"
            aria-hidden
          />
          <div className="bg-surface-container-highest rounded-xl p-sm shadow-2xl border border-outline-variant relative z-10">
            <div className="bg-surface-container-lowest rounded-lg overflow-hidden border border-outline-variant">
              <div className="h-10 bg-surface-container flex items-center px-md gap-sm border-b border-outline-variant">
                <div className="flex gap-xs">
                  <div className="w-2.5 h-2.5 rounded-full bg-error/30" />
                  <div className="w-2.5 h-2.5 rounded-full bg-secondary/30" />
                  <div className="w-2.5 h-2.5 rounded-full bg-on-surface-variant/30" />
                </div>
                <div className="bg-surface rounded px-xl py-xs text-[10px] text-on-surface-variant mx-auto w-1/3 min-w-[140px]">
                  academix.ai/dashboard
                </div>
              </div>
              <img
                src={LANDING_IMAGES.heroDashboard}
                alt="Academix AI dashboard preview on a laptop"
                className="w-full aspect-video object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
