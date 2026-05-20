import FooterBottom from './FooterBottom';
import FooterLinks from './FooterLinks';
import FooterLogo from './FooterLogo';

export default function Footer() {
  return (
    <footer className="bg-surface-container-highest py-12 border-t border-outline-variant">
      <div className="max-w-7xl mx-auto px-lg grid grid-cols-2 md:grid-cols-4 gap-xl">
        <FooterLogo />
        <FooterLinks />
      </div>
      <FooterBottom />
    </footer>
  );
}
