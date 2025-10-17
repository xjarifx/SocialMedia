import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import RightSidebar from "./RightSidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Twitter/X Style Layout - No Top Bar */}
      <div className="flex justify-center w-full">
        {/* Left Sidebar */}
        <aside className="hidden md:flex w-[275px] flex-shrink-0 justify-end">
          <div className="fixed h-screen w-[275px] px-3">
            <Sidebar />
          </div>
        </aside>

        {/* Main Content Area - Twitter/X width */}
        <main className="flex-1 max-w-[600px] min-h-screen border-x border-neutral-800">
          {children}
        </main>

        {/* Right Sidebar */}
        <aside className="hidden lg:flex w-[350px] flex-shrink-0">
          <div className="fixed h-screen w-[350px] px-8 py-2">
            <RightSidebar />
          </div>
        </aside>
      </div>
    </div>
  );
}
