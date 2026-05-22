import { NavLink } from 'react-router-dom';
import { useModalStore } from '../../stores/use-modal-store';

const bottomNavItems = [
  { name: 'Dashboard', path: '/', icon: 'dashboard' },
  { name: 'Generate', path: '/generate-exam', icon: 'auto_awesome' },
  { name: 'Groups', path: '/groups', icon: 'groups' },
  { name: 'History', path: '/history', icon: 'history' },
];

export default function BottomBar() {
  const { openModal } = useModalStore();

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <button 
        onClick={() => openModal('createGroup')}
        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-br from-secondary to-tertiary text-on-primary rounded-full shadow-xl flex items-center justify-center active:scale-90 transition-transform z-40 md:hidden cursor-pointer"
      >
        <span className="material-symbols-outlined text-[28px]">add</span>
      </button>

      {/* Bottom Navigation Bar (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-lg flex justify-around items-center h-20 px-4 shadow-[0_-4px_20px_rgba(30,64,175,0.05)] z-50 md:hidden border-t border-outline-variant">
        {bottomNavItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 transition-colors ${
                isActive ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`${isActive ? 'bg-primary-fixed-dim px-4 py-1 rounded-full flex items-center justify-center' : ''}`}>
                  <span 
                    className="material-symbols-outlined" 
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {item.icon}
                  </span>
                </div>
                <span className={`text-label-sm font-label-sm ${isActive ? 'font-bold' : ''}`}>
                  {item.name}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
