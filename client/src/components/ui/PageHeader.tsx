import { useNavigate } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backTo?: string;
  children?: React.ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  showBackButton = false,
  backTo = "/dashboard",
  children,
}: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(backTo);
  };

  return (
    <div className="bg-neutral-900 border-b border-neutral-800 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <button
                onClick={handleBack}
                className="p-2 hover:bg-neutral-800 rounded-full transition-colors"
                aria-label="Go back"
              >
                <svg
                  className="w-5 h-5 text-primary-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>
            )}
            <div>
              <h1 className="text-xl font-bold text-primary-400">{title}</h1>
              {subtitle && (
                <p className="text-sm text-primary-400 mt-1">{subtitle}</p>
              )}
            </div>
          </div>
          {children && (
            <div className="flex items-center space-x-2">{children}</div>
          )}
        </div>
      </div>
    </div>
  );
}
