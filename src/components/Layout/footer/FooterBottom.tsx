import { FOOTER_LEGAL_LINKS } from './footerData';

export default function FooterBottom() {
  return (
    <div className="max-w-7xl mx-auto px-lg mt-12 pt-lg border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-md">
      <p className="font-body text-small text-on-surface-variant">
        © {new Date().getFullYear()} Academix AI Inc. All rights reserved.
      </p>
      <div className="flex gap-xl">
        {FOOTER_LEGAL_LINKS.map((label) => (
          <a
            key={label}
            href="#"
            className="font-body text-small text-on-surface-variant hover:text-primary transition-colors"
          >
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}
