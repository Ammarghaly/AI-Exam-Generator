export default function NavLogo() {
  return (
    <a href="/" className="flex items-center gap-2 group cursor-pointer select-none">
      <span className="material-symbols-outlined text-primary text-[30px] transform group-hover:rotate-12 transition-transform duration-300">
        quiz
      </span>
      <span className="font-display text-h2 font-extrabold text-primary tracking-tight">
        Academix AI
      </span>
    </a>
  );
}
