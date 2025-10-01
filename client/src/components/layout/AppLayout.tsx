import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import RightSidebar from "./RightSidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <div className="flex w-full">
        {/* Left Sidebar */}
        <div className="w-[32rem] sticky top-0 h-screen flex-shrink-0">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-h-screen">{children}</div>

        {/* Right Sidebar (Global Search etc.) */}
        <div className="hidden lg:block flex-shrink-0">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}
