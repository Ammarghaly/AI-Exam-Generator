import { useState } from "react";
import NavLogo from "./NavLogo";
import NavLinks from "./NavLinks";
import NavActions from "./NavActions";
import NavMobileDrawer from "./NavMobileDrawer";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-lg md:px-xl h-20 flex items-center justify-between gap-lg">
        <NavLogo />
        <NavLinks />
        <div className="flex items-center gap-sm">
          <NavActions />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-on-surface hover:bg-on-surface/5 rounded-md transition-colors focus:outline-none cursor-pointer"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            {...{ "aria-expanded": isMobileMenuOpen ? "true" : "false" }}
          >
            <span className="material-symbols-outlined text-[28px] select-none block">
              {isMobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      <NavMobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </nav>
  );
}
