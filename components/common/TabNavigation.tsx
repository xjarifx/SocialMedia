interface Tab {
  id: string;
  label: string;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function TabNavigation({
  tabs,
  activeTab,
  onTabChange,
  className = "",
}: TabNavigationProps) {
  const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);

  return (
    <div className={`sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur-sm ${className}`}>
      <div className="flex divide-x divide-border border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 px-4 py-3 text-center font-medium transition-colors duration-200 ${
              activeTab === tab.id
                ? "text-text-primary"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="relative h-1 bg-border">
        <div
          className="absolute top-0 h-full bg-accent transition-all duration-300"
          style={{
            width: `${100 / tabs.length}%`,
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        />
      </div>
    </div>
  );
}
