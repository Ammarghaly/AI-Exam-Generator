import { useState, useRef, useEffect } from "react";
import { useThemeStore } from "../../stores/use-theme-store";
import { useSearchStore } from "../../stores/use-search-store";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../stores/use-user-store";

export default function TopNavBar() {
  const { theme, toggleTheme } = useThemeStore();
  const { searchQuery, setSearchQuery } = useSearchStore();
  const navigate = useNavigate();

  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const { currentUser } = useUserStore();

  // logout handled elsewhere in layout; no direct handler needed here

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dummySearchResults = [
    { id: 1, title: "Physics 101 Group", type: "Group", icon: "groups" },
    { id: 2, title: "Midterm Exam - Biology", type: "Exam", icon: "quiz" },
    { id: 3, title: "Ahmed Ali", type: "Student", icon: "person" },
  ];

  return (
    <header className="flex justify-between items-center w-full px-lg py-md bg-surface shadow-sm sticky top-0 z-40 border-b border-outline-variant">
      {/* Search Area */}
      <div className="flex items-center gap-lg flex-1">
        {!isMobileSearchOpen && (
          <button
            className="md:hidden p-sm text-on-surface-variant hover:bg-surface-container-high transition-colors rounded-full"
            onClick={() => setIsMobileSearchOpen(true)}
          >
            <span className="material-symbols-outlined">search</span>
          </button>
        )}

        {/* Search Input Container */}
        <div
          ref={searchRef}
          className={`relative w-full ${isMobileSearchOpen ? "flex" : "hidden md:flex"} max-w-2xl transition-all duration-300`}
        >
          {isMobileSearchOpen && (
            <button
              className="absolute left-1 top-1/2 -translate-y-1/2 p-sm text-on-surface-variant z-10 md:hidden"
              onClick={() => setIsMobileSearchOpen(false)}
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
          )}
          <span
            className={`material-symbols-outlined absolute ${isMobileSearchOpen ? "left-10" : "left-md"} top-1/2 -translate-y-1/2 text-outline z-10`}
          >
            search
          </span>
          <input
            className={`w-full ${isMobileSearchOpen ? "pl-16" : "pl-xl"} pr-md py-sm bg-surface-container border-none rounded-full focus:ring-2 focus:ring-primary/20 font-body text-body outline-none transition-all`}
            placeholder="Search groups, exams, students..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
          />

          {/* Search Results Dropdown */}
          {isSearchFocused && searchQuery.length > 0 && (
            <div className="absolute top-full left-0 mt-sm w-full bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg overflow-hidden flex flex-col z-50">
              <div className="px-md py-sm border-b border-surface-container bg-surface-container-lowest">
                <span className="text-label-sm font-label-sm text-on-surface-variant uppercase">
                  Results for "{searchQuery}"
                </span>
              </div>
              {dummySearchResults.map((result) => (
                <button
                  key={result.id}
                  className="flex items-center gap-md px-md py-sm hover:bg-surface-container transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-outline">
                    {result.icon}
                  </span>
                  <div>
                    <div className="font-title-md text-label-md text-on-surface">
                      {result.title}
                    </div>
                    <div className="font-label-sm text-label-sm text-on-surface-variant">
                      {result.type}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Side Icons */}
      <div
        className={`flex items-center gap-sm md:gap-md ${isMobileSearchOpen ? "hidden" : "flex"}`}
      >
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-sm flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors rounded-full cursor-pointer"
        >
          <span className="material-symbols-outlined">
            {theme === "dark" ? "light_mode" : "dark_mode"}
          </span>
        </button>

        <div className="h-8 w-px bg-outline-variant mx-xs hidden md:block"></div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => navigate("/teacher/profile")}
            className="flex items-center gap-sm cursor-pointer focus:outline-none rounded-full ring-offset-2 ring-offset-surface focus:ring-2 focus:ring-primary"
            title="My Profile"
          >
            <img
              alt="User Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-surface-container-lowest shadow-sm hover:opacity-90 transition-opacity"
              src={
                currentUser?.avatar ||
                "https://res-console.cloudinary.com/dgjw80t8x/thumbnails/transform/v1/image/upload/Y19maWxsLGhfMjAwLHdfMjAw/v1/bW9zdGFmYW1hZ2R5X2hzamJ3Mw==/template_primary"
              }
            />
          </button>
        </div>
      </div>
    </header>
  );
}
