import { NAV_LINKS } from './navData';

export default function NavLinks() {
  return (
    <div className="hidden md:flex items-center gap-xl">
      {NAV_LINKS.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="relative py-2 font-label text-label text-on-surface-variant hover:text-primary transition-colors duration-200 group"
        >
          {link.label}
          <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full rounded-full" />
        </a>
      ))}
    </div>
  );
}
