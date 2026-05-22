import { NavLink } from 'react-router-dom';
import { useLayoutStore } from '../../stores/use-layout-store';

const navItems = [
  { name: 'Dashboard', path: '/', icon: 'dashboard' },
  { name: 'My Groups', path: '/groups', icon: 'group' },
  { name: 'Generate Exam', path: '/generate-exam', icon: 'auto_awesome' },
  { name: 'Exams', path: '/exams', icon: 'quiz' },
  { name: 'History', path: '/history', icon: 'history' },
  { name: 'Settings', path: '/settings', icon: 'settings' },
];

export default function Sidebar() {
  const { isSidebarCollapsed, toggleSidebar } = useLayoutStore();

  return (
    <aside 
      className={`fixed h-screen left-0 top-0 bg-surface-container-lowest border-r border-outline-variant hidden md:flex flex-col z-50 transition-all duration-300 ${
        isSidebarCollapsed ? 'w-[80px]' : 'w-[220px]'
      }`}
    >
      {/* Logo Area */}
      <div className={`p-xl border-b border-outline-variant flex items-center justify-center gap-sm`}>
        <div className="flex items-center gap-sm">
          <div className="w-8 h-8 shrink-0 rounded-lg bg-primary flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined text-lg">school</span>
          </div>
          {!isSidebarCollapsed && (
            <h1 className="font-h1 text-h2 text-on-surface whitespace-nowrap">Academix</h1>
          )}
        </div>
      </div>



      {/* Navigation Links */}
      <nav className="flex-1 p-md flex flex-col gap-sm overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-md px-md py-sm rounded-lg font-label text-body transition-colors ${
                isActive
                  ? 'bg-primary-container text-on-primary-container font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              } ${isSidebarCollapsed ? 'justify-center' : ''}`
            }
            title={isSidebarCollapsed ? item.name : undefined}
          >
            <span className="material-symbols-outlined text-xl shrink-0">{item.icon}</span>
            {!isSidebarCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Area (Toggle & Logout) */}
      <div className="p-md border-t border-outline-variant flex flex-col gap-sm">
        {/* Toggle Sidebar Button */}
        <button 
          onClick={toggleSidebar} 
          className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-md'} px-md py-sm rounded-lg font-label text-body text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer`}
          title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <span className="material-symbols-outlined text-xl shrink-0">
            {isSidebarCollapsed ? 'menu' : 'menu_open'}
          </span>
          {!isSidebarCollapsed && <span>Collapse Menu</span>}
        </button>

        {/* Logout Button */}
        <button className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-md'} px-md py-sm rounded-lg font-label text-body text-error hover:bg-error-container hover:text-on-error-container transition-colors cursor-pointer`}
          title={isSidebarCollapsed ? "Logout" : undefined}
        >
          <span className="material-symbols-outlined text-xl shrink-0">logout</span>
          {!isSidebarCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
