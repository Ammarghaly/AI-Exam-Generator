import { LANDING_IMAGES } from './landingAssets';

const SMALL_FEATURES = [
  {
    icon: 'groups',
    color: 'text-secondary',
    surface: undefined,
    title: 'Team Groups',
    description:
      'Share question banks and collaborate with department colleagues in real-time.',
  },
  {
    icon: 'history_edu',
    color: 'text-tertiary',
    surface: undefined,
    title: 'Export Anywhere',
    description:
      'Direct export to Canvas, Moodle, Google Classroom, or download as PDF/Word.',
  },
  {
    icon: 'lock_person',
    color: 'text-primary',
    title: 'Proctoring',
    description: 'Built-in AI monitoring to ensure academic integrity for remote exams.',
    surface: 'bg-surface-container-high',
  },
] as const;

export default function FeaturesSection() {
  return (
    <section className="px-lg md:px-xl py-12 max-w-7xl mx-auto" id="features">
      <div className="text-center mb-xl">
        <h2 className="font-display text-display font-extrabold mb-md">
          Supercharge Your Teaching
        </h2>
        <p className="font-body text-h3 text-on-surface-variant max-w-2xl mx-auto">
          Everything you need to create, manage, and analyze student assessments in one platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-lg auto-rows-auto md:auto-rows-[240px]">
        <div className="md:col-span-8 md:row-span-2 bg-surface-container rounded-xl p-xl flex flex-col justify-between border border-outline-variant hover:shadow-lg transition-all group">
          <div>
            <div className="w-12 h-12 bg-primary-container/10 rounded-lg flex items-center justify-center mb-lg group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined material-symbols-filled text-primary-container">
                auto_awesome
              </span>
            </div>
            <h3 className="font-display text-[28px] font-bold mb-md">Multi-Source AI Engine</h3>
            <p className="font-body text-h3 text-on-surface-variant ">
              Input text, upload PDFs, or paste YouTube links. Our AI parses complex subjects and
              creates balanced questionnaires across all difficulty levels.
            </p>
          </div>
          <div className="mt-lg rounded-lg overflow-hidden border border-outline-variant h-48 bg-surface">
            <img
              src={LANDING_IMAGES.sourceAnalysis}
              alt="AI document analysis interface"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="md:col-span-4 md:row-span-2 bg-primary-container text-on-primary-container rounded-xl p-xl flex flex-col justify-between hover:shadow-lg transition-all group">
          <div className="w-12 h-12 bg-overlay-20 rounded-lg flex items-center justify-center mb-lg group-hover:rotate-12 transition-transform">
            <span className="material-symbols-outlined material-symbols-filled">analytics</span>
          </div>
          <div>
            <h3 className="font-display text-h1 font-bold mb-md">Deep Analytics</h3>
            <p className="font-body text-body text-on-primary-container/80 mb-xl">
              Identify learning gaps with student-by-student breakdown and question difficulty
              metrics.
            </p>
          </div>
          <div className="p-lg bg-overlay-10 rounded-lg border border-overlay-20">
            <div className="flex items-center justify-between mb-sm">
              <span className="text-label font-semibold">Class Average</span>
              <span className="text-h3 font-semibold">84%</span>
            </div>
            <div className="w-full h-2 bg-overlay-20 rounded-full overflow-hidden">
              <div className="w-[84%] h-full bg-on-primary rounded-full" />
            </div>
          </div>
        </div>

        {SMALL_FEATURES.map(({ icon, color, title, description, surface }) => (
          <div
            key={title}
            className={`md:col-span-4 ${surface ?? 'bg-surface-container'} rounded-xl p-xl border border-outline-variant hover:shadow-lg transition-all`}
          >
            <div className="flex items-center gap-md mb-md">
              <span className={`material-symbols-outlined material-symbols-filled ${color}`}>
                {icon}
              </span>
              <h3 className="text-h2 font-semibold">{title}</h3>
            </div>
            <p className="font-body text-body text-on-surface-variant">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
