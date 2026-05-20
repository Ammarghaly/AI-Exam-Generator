export const FOOTER_PRODUCT_LINKS = ['Features', 'Pricing', 'API'] as const;
export const FOOTER_COMPANY_LINKS = ['About Us', 'Privacy Policy', 'Contact'] as const;
export const FOOTER_LEGAL_LINKS = ['Privacy', 'Terms', 'Cookies'] as const;

export const FOOTER_SOCIAL_LINKS = [
  { label: 'Email', icon: 'alternate_email', href: '#' },
  { label: 'Website', icon: 'public', href: '#' },
 ] as const;

export type FooterProductLink = (typeof FOOTER_PRODUCT_LINKS)[number];
export type FooterCompanyLink = (typeof FOOTER_COMPANY_LINKS)[number];
export type FooterLegalLink = (typeof FOOTER_LEGAL_LINKS)[number];
