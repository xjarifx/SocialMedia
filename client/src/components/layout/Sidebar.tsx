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
    <div className="h-full flex flex-col bg-white border-r border-orange-200">
      {/* Logo */}
      {/* <div className="p-4">
        <h1 className="text-xl font-bold text-primary-600">SocialMedia</h1>
      </div> */}

      {/* Navigation */}
      <nav className="flex-1 px-4 pt-4">
        <ul className="space-y-0">
          {sidebarItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-soft transition-colors ${
                  item.isActive
                    ? "bg-primary-50 text-primary-600"
                    : "text-primary-400 hover:bg-orange-50 hover:text-primary-600"
                }`}
              >
                <span
                  className={
                    item.isActive ? "text-primary-600" : "text-primary-400"
                  }
                >
                  {item.icon}
                </span>
                <span className="font-medium text-base">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-orange-200">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-600 font-medium">
              {user?.username?.[0]?.toUpperCase() || "U"}
            </span>
          </div>
          <div className="flex-1">
            <p className="font-medium text-primary-600">{user?.username}</p>
            <p className="text-sm text-primary-400">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-2 px-3 py-2 text-primary-400 hover:bg-orange-50 hover:text-primary-600 rounded-soft transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );
}
