import { FOOTER_PRODUCT_LINKS, FOOTER_COMPANY_LINKS, FOOTER_SOCIAL_LINKS } from './footerData';

export default function FooterLinks() {
  return (
    <>
       <div>
        <h4 className="font-label text-label text-on-surface mb-lg">Product</h4>
        <ul className="space-y-sm">
          {FOOTER_PRODUCT_LINKS.map((label) => (
            <li key={label}>
              <a
                href={`#${label.toLowerCase()}`}
                className="font-body text-small text-on-surface-variant hover:text-primary transition-colors"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>

       <div>
        <h4 className="font-label text-label text-on-surface mb-lg">Company</h4>
        <ul className="space-y-sm">
          {FOOTER_COMPANY_LINKS.map((label) => (
            <li key={label}>
              <a
                href="#"
                className="font-body text-small text-on-surface-variant hover:text-primary transition-colors"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>

       <div>
        <h4 className="font-label text-label text-on-surface mb-lg">Connect</h4>
        <div className="flex gap-md">
          {FOOTER_SOCIAL_LINKS.map(({ label, icon, href }) => (
            <a
              key={label}
              href={href}
              className="w-10 h-10 bg-surface-container rounded-lg flex items-center justify-center hover:text-primary transition-colors"
              aria-label={label}
            >
              <span className="material-symbols-outlined">{icon}</span>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
