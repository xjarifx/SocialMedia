import type { ReactNode } from "react";
import Sidebar from "./Sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <div className="flex w-full">
        {/* Global Sidebar - Always visible */}
        <div className="w-64 sticky top-0 h-screen">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
