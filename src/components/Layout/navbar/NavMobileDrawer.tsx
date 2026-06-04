interface NavMobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

import { NAV_LINKS } from './navData';

export default function NavMobileDrawer({ isOpen, onClose }: NavMobileDrawerProps) {
  return (
    <div
      className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-outline-variant/30 ${
        isOpen
          ? 'max-h-80 border-t opacity-100 bg-surface'
          : 'max-h-0 opacity-0 pointer-events-none'
      }`}
    >
      <div className="px-4 py-6 flex flex-col gap-sm">
        {/* Nav Links */}
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={onClose}
            className="font-label text-label text-on-surface-variant hover:text-primary p-2 rounded-md hover:bg-primary/5 transition-all duration-200"
          >
            {link.label}
          </a>
        ))}

        <hr className="border-outline-variant/30 my-1" />

        {/* Sign In */}
        <a
          href="/login"
          onClick={onClose}
          className="text-center font-label text-label text-primary border border-primary/30 py-sm rounded-lg hover:bg-primary/5 transition-all duration-200"
        >
          Sign In
        </a>

        {/* Get Started */}
        <a
          href="/register"
          onClick={onClose}
          className="bg-primary text-on-primary w-full py-sm rounded-lg font-label text-label hover:opacity-90 shadow-md shadow-primary/10 active:scale-[0.99] transition-all duration-200 cursor-pointer text-center"
        >
          Get Started
        </a>
      </div>
    </div>
  );
}
