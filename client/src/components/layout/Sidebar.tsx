import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import type { ReactNode } from "react";
import Avatar from "../ui/Avatar";

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
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showMenu]);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setShowMenu(false);
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
      </nav>

      {/* User Profile Section - Twitter/X Style */}
      <div className="px-3 py-3 relative" ref={menuRef}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-full hover:bg-neutral-900 transition-colors"
        >
          <Avatar src={user?.avatarUrl} alt={user?.username} size="md" />
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

        {/* Dropdown Menu */}
        {showMenu && (
          <div className="absolute bottom-full left-3 right-3 mb-2 bg-black border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 text-left text-white hover:bg-neutral-900 transition-colors font-bold text-sm"
            >
              Log out @{user?.username?.toLowerCase()}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
