import { useState, useRef, useEffect } from 'react';
import { useThemeStore } from '../../stores/use-theme-store';
import { useSearchStore } from '../../stores/use-search-store';

export default function TopNavBar() {
  const { theme, toggleTheme } = useThemeStore();
  const { searchQuery, setSearchQuery } = useSearchStore();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const dummySearchResults = [
    { id: 1, title: 'Physics 101 Group', type: 'Group', icon: 'groups' },
    { id: 2, title: 'Midterm Exam - Biology', type: 'Exam', icon: 'quiz' },
    { id: 3, title: 'Ahmed Ali', type: 'Student', icon: 'person' },
  ];

  const dummyNotifications = [
    { id: 1, text: 'New student joined Physics 101', time: '5m ago', icon: 'person_add' },
    { id: 2, text: 'Math exam processing completed', time: '1h ago', icon: 'check_circle' },
  ];

  return (
    <header className="flex justify-between items-center w-full px-lg py-md bg-surface shadow-sm sticky top-0 z-40 border-b border-outline-variant">
      
      {/* Search Area */}
      <div className="flex items-center gap-lg flex-1">
        {/* Mobile Search Icon (only visible when search is NOT open on mobile) */}
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
          className={`relative w-full ${isMobileSearchOpen ? 'flex' : 'hidden md:flex'} max-w-2xl transition-all duration-300`}
        >
          {isMobileSearchOpen && (
            <button 
              className="absolute left-1 top-1/2 -translate-y-1/2 p-sm text-on-surface-variant z-10 md:hidden"
              onClick={() => setIsMobileSearchOpen(false)}
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
          )}
          <span className={`material-symbols-outlined absolute ${isMobileSearchOpen ? 'left-10' : 'left-md'} top-1/2 -translate-y-1/2 text-outline z-10`}>
            search
          </span>
          <input
            className={`w-full ${isMobileSearchOpen ? 'pl-16' : 'pl-xl'} pr-md py-sm bg-surface-container border-none rounded-full focus:ring-2 focus:ring-primary/20 font-body text-body outline-none transition-all`}
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
                <span className="text-label-sm font-label-sm text-on-surface-variant uppercase">Results for "{searchQuery}"</span>
              </div>
              {dummySearchResults.map((result) => (
                <button key={result.id} className="flex items-center gap-md px-md py-sm hover:bg-surface-container transition-colors text-left">
                  <span className="material-symbols-outlined text-outline">{result.icon}</span>
                  <div>
                    <div className="font-title-md text-label-md text-on-surface">{result.title}</div>
                    <div className="font-label-sm text-label-sm text-on-surface-variant">{result.type}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Side Icons */}
      <div className={`flex items-center gap-sm md:gap-md ${isMobileSearchOpen ? 'hidden' : 'flex'}`}>
        
        {/* Theme Toggle */}
        <button onClick={toggleTheme} className="p-sm flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors rounded-full cursor-pointer">
          <span className="material-symbols-outlined">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} 
            className="p-sm flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors rounded-full cursor-pointer relative"
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full border-2 border-surface"></span>
          </button>

          {/* Notifications Dropdown */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-sm w-80 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg overflow-hidden flex flex-col z-50">
              <div className="px-md py-sm border-b border-surface-container flex justify-between items-center bg-surface-container-lowest">
                <span className="font-title-md text-title-md text-on-surface">Notifications</span>
                <button className="text-primary text-label-sm font-label-sm hover:underline">Mark all read</button>
              </div>
              <div className="flex flex-col max-h-96 overflow-y-auto">
                {dummyNotifications.map((notif) => (
                  <div key={notif.id} className="flex items-start gap-md px-md py-sm hover:bg-surface-container transition-colors cursor-pointer border-b border-surface-container last:border-0">
                    <div className="p-xs bg-primary-container text-on-primary-container rounded-full mt-1">
                      <span className="material-symbols-outlined text-[16px]">{notif.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-body-sm text-label-md text-on-surface">{notif.text}</p>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">{notif.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-outline-variant mx-xs hidden md:block"></div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-sm cursor-pointer focus:outline-none rounded-full ring-offset-2 ring-offset-surface focus:ring-2 focus:ring-primary"
          >
            <img
              alt="User Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-surface-container-lowest shadow-sm"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-RMwGlgnO5n19w1piijLOTU6kqYCkFoA-ZZhNs2WmW_hy-SLMCHjBMUSfpqq5XKSSXfM-fSFQ72Q2TpCBLQLoMJKAhkDwFp0BDGzItNGgUY08xTuTHce31AXJecD3LZn0yQfXHAqjJMCg_aDeSAXWLv8zmVWLWMynWsoYvh8Q_xUthVN4UXWxAluOCUQRd8B27p7zTuw76zYXK2I1M91wSjC7y-AloBdjTTFWJPCGKcVJNQHNPYRrsaozlgW2k4hgu-9bvgWXVik"
            />
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-sm w-56 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg overflow-hidden flex flex-col z-50">
              <div className="px-md py-sm border-b border-surface-container bg-surface-container-lowest flex flex-col">
                <span className="font-title-md text-label-md text-on-surface font-semibold">Dr. Ahmed</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">ahmed@university.edu</span>
              </div>
              <div className="flex flex-col py-xs">
                <button className="flex items-center gap-sm px-md py-sm hover:bg-surface-container transition-colors text-left text-on-surface">
                  <span className="material-symbols-outlined text-outline">person</span>
                  <span className="font-label-md text-label-md">My Profile</span>
                </button>
                <button className="flex items-center gap-sm px-md py-sm hover:bg-surface-container transition-colors text-left text-on-surface">
                  <span className="material-symbols-outlined text-outline">settings</span>
                  <span className="font-label-md text-label-md">Settings</span>
                </button>
              </div>
              <div className="border-t border-surface-container py-xs">
                <button className="w-full flex items-center gap-sm px-md py-sm hover:bg-error-container transition-colors text-left text-error hover:text-on-error-container">
                  <span className="material-symbols-outlined text-xl">logout</span>
                  <span className="font-label-md text-label-md">Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
