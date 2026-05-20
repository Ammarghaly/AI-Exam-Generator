export default function FooterLogo() {
  return (
    <div className="col-span-2 md:col-span-1">
      <div className="flex items-center gap-sm mb-lg">
        <span className="material-symbols-outlined text-primary text-[24px]">quiz</span>
        <span className="font-display text-h3 font-extrabold text-primary">Academix AI</span>
      </div>
      <p className="font-body text-small text-on-surface-variant">
        The future of academic assessment is here. Empowering educators with intelligent mentoring
        tools.
      </p>
    </div>
  );
}
