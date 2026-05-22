import { Outlet } from 'react-router-dom';
import Sidebar from '../Common/Sidebar';
import TopNavBar from '../Common/TopNavBar';
import BottomBar from '../Common/BottomBar';
import { useLayoutStore } from '../../stores/use-layout-store';
import CreateGroupModal from '../groups/CreateGroupModal';

export default function DashboardLayout() {
  const { isSidebarCollapsed } = useLayoutStore();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content Wrapper */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 w-full
          ${isSidebarCollapsed ? 'md:ml-[80px]' : 'md:ml-[220px]'}
        `}
      >
        <TopNavBar />

        {/* Page Content */}
        <main className="flex-1 p-xl pb-32 md:pb-xl">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Bar */}
      <BottomBar />

      {/* Global Modals */}
      <CreateGroupModal />
    </div>
  );
}
