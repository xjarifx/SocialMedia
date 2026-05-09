interface Stat {
  label: string;
  value: number;
  onClick?: () => void;
}

interface StatsCardProps {
  stats: Stat[];
  className?: string;
}

export function StatsCard({ stats, className = "" }: StatsCardProps) {
  return (
    <div className={`flex gap-2 ${className}`}>
      {stats.map((stat, index) => (
        <button
          key={index}
          onClick={stat.onClick}
          disabled={!stat.onClick}
          className={`flex-1 border border-border bg-surface px-4 py-3 text-center transition-colors duration-200 ${
            stat.onClick
              ? "cursor-pointer hover:bg-surface-hover"
              : "cursor-default"
          }`}
        >
          <p className="text-xl font-medium text-text-primary">{stat.value}</p>
          <p className="text-xs text-text-secondary">{stat.label}</p>
        </button>
      ))}
    </div>
  );
}
