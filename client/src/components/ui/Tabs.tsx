import type { ReactNode } from "react";

interface Tab {
  id: string;
  label: string;
  content?: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: "default" | "pills";
  className?: string;
}

export default function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = "default",
  className = "",
}: TabsProps) {
  if (variant === "pills") {
    return (
      <div className={`flex space-x-2 ${className}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? "bg-white text-black"
                : "text-neutral-400 hover:bg-neutral-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex border-b border-neutral-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="flex-1 hover:bg-neutral-900 transition-colors relative"
          >
            <div className="flex items-center justify-center h-[53px]">
              <span
                className={`text-[15px] ${
                  activeTab === tab.id
                    ? "font-bold text-white"
                    : "font-medium text-neutral-500"
                }`}
              >
                {tab.label}
              </span>
            </div>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-14 h-1 bg-primary-500 rounded-full"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
