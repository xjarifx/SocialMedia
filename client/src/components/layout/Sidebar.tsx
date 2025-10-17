import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";

interface SidebarItem {
  icon: ReactNode;
  label: string;
  path: string;
  isActive?: boolean;
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const sidebarItems: SidebarItem[] = [
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      label: "Home",
      path: "/dashboard",
      isActive: location.pathname === "/dashboard",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      ),
      label: "Post",
      path: "/post",
      isActive: location.pathname === "/post",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 2a7 7 0 017 7v3a3 3 0 003 3h1a1 1 0 110 2H3a1 1 0 110-2h1a3 3 0 003-3V9a7 7 0 017-7z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.73 21a2 2 0 01-3.46 0"
          />
        </svg>
      ),
      label: "Notifications",
      path: "/notifications",
      isActive: location.pathname === "/notifications",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      label: "Profile",
      path: "/profile",
      isActive: location.pathname === "/profile",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
      label: "Messages",
      path: "/messages",
      isActive: location.pathname === "/messages",
    },
  ];

  return (
    <div className="h-full flex flex-col py-2">
      {/* Logo - Twitter/X Style */}
      <div className="px-3 mb-2">
        <div className="w-12 h-12 rounded-full hover:bg-neutral-900 flex items-center justify-center transition-colors cursor-pointer">
          <svg
            className="w-7 h-7 text-white"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-1">
          {sidebarItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-4 px-4 py-3 rounded-full transition-all ${
                  item.isActive
                    ? "font-bold"
                    : "font-normal hover:bg-neutral-900"
                }`}
              >
                <span className={item.isActive ? "text-white" : "text-white"}>
                  {item.icon}
                </span>
                <span className={`text-xl ${item.isActive ? "font-bold" : ""}`}>
                  {item.label}
                </span>
              </button>
            </li>
          ))}
        </ul>

        {/* Post Button - Twitter/X Style */}
        <div className="px-3 mt-4">
          <button
            onClick={() => navigate("/post")}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-6 rounded-full transition-colors shadow-lg"
          >
            Post
          </button>
        </div>
      </nav>

      {/* User Profile Section - Twitter/X Style */}
      <div className="px-3 py-3">
        <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-full hover:bg-neutral-900 transition-colors">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {user?.username?.[0]?.toUpperCase() || "U"}
            </span>
          </div>
          <div className="flex-1 text-left">
            <p className="font-bold text-sm text-white truncate">
              {user?.username}
            </p>
            <p className="text-xs text-neutral-500 truncate">
              @{user?.username?.toLowerCase()}
            </p>
          </div>
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
