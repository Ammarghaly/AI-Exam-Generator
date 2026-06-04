import { LANDING_IMAGES } from './landingAssets';

const TESTIMONIALS = [
  {
    quote:
      'Academix AI cut my exam prep from 4 hours to 20 minutes. The question quality is remarkably balanced.',
    name: 'Dr. Sarah Chen',
    role: 'Biology Professor, Stanford',
    avatar: LANDING_IMAGES.educator1,
  },
  {
    quote:
      'Uploading PDFs and getting structured assessments instantly changed how our department collaborates.',
    name: 'James Okonkwo',
    role: 'Department Head, MIT',
    avatar: LANDING_IMAGES.educator2,
  },
  {
    quote:
      'The analytics dashboard helped me spot exactly which topics my students struggled with before the final.',
    name: 'Elena Vasquez',
    role: 'High School Educator',
    avatar: LANDING_IMAGES.educator3,
  },
] as const;

export default function TestimonialsSection() {
  return (
    <section className="px-lg md:px-xl py-12 max-w-7xl mx-auto" id="testimonials">
      <div className="text-center mb-xl">
        <h2 className="font-display text-display mb-md">Loved by Educators</h2>
        <p className="font-body text-h3 text-on-surface-variant max-w-2xl mx-auto">
          Hear from teachers and professors who transformed their workflow with Academix AI.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        {TESTIMONIALS.map((item) => (
          <article
            key={item.name}
            className="bg-surface-container rounded-xl p-xl border border-outline-variant flex flex-col gap-lg hover:shadow-lg transition-shadow"
          >
            <div className="flex gap-xs text-secondary">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className="material-symbols-outlined material-symbols-filled text-[18px]"
                >
                  star
                </span>
              ))}
            </div>
            <p className="font-body text-body text-on-surface grow leading-relaxed">
              &ldquo;{item.quote}&rdquo;
            </p>
            <div className="flex items-center gap-md pt-md border-t border-outline-variant">
              <img
                src={item.avatar}
                alt=""
                className="w-12 h-12 rounded-full border-2 border-surface object-cover"
              />
              <div>
                <p className="text-h3 font-semibold text-on-surface">{item.name}</p>
                <p className="font-body text-small text-on-surface-variant">{item.role}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
