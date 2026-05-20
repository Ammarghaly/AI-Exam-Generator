export default function NavActions() {
  return (
    <div className="hidden md:flex items-center gap-sm">
      <a
        href="/login"
        className="px-lg py-sm rounded-lg font-label text-label text-primary border border-primary/30 hover:bg-primary/5 hover:border-primary/60 transition-all duration-200 cursor-pointer"
      >
        Sign In
      </a>

      <a
        href="/register"
        className="bg-primary text-on-primary px-lg py-sm rounded-lg font-label text-label hover:opacity-90 transition-all duration-200 cursor-pointer shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98]"
      >
        Get Started
      </a>
    </div>
  );
}
