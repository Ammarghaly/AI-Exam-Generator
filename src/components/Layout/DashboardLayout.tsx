import { Outlet } from "react-router-dom";
import { TeacherSidebar } from "../common/TeacherSidebar";
import TopNavBar from "../common/TopNavBar";
import BottomBar from "../common/BottomBar";
import CreateGroupModal from "../groups/CreateGroupModal";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <TeacherSidebar />

      <div className="flex-1 flex flex-col transition-all duration-300 w-full md:ml-64">
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
