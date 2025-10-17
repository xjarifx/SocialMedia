import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Avatar from "../components/ui/Avatar";

export default function HomePage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Navigation Header */}
      <header className="bg-neutral-900 border-b border-neutral-800 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-primary-500">
                SocialMedia
              </h1>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div
                className="flex items-center space-x-2 cursor-pointer hover:bg-neutral-100 rounded-xl px-2 py-1 transition-colors"
                onClick={() => (window.location.href = "/profile")}
              >
                <Avatar src={user?.avatarUrl} size="sm" />
                <span className="text-sm font-medium text-neutral-300">
                  @{user?.username}
                </span>
              </div>
              <Button variant="ghost" onClick={logout} size="sm">
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <div className="text-center">
                <Avatar src={user?.avatarUrl} size="xl" className="mx-auto" />
                <h2 className="mt-4 text-xl font-semibold text-neutral-100">
                  {user?.username}
                </h2>
                <p className="text-neutral-400">{user?.email}</p>
                {user?.bio && (
                  <p className="mt-2 text-sm text-neutral-300">{user.bio}</p>
                )}
                <div className="mt-4 flex justify-center space-x-4 text-sm text-neutral-500">
                  <div>
                    <span className="font-semibold text-neutral-100">0</span>{" "}
                    Posts
                  </div>
                  <div>
                    <span className="font-semibold text-neutral-100">0</span>{" "}
                    Following
                  </div>
                  <div>
                    <span className="font-semibold text-neutral-100">0</span>{" "}
                    Followers
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-4 w-full"
                  onClick={() => (window.location.href = "/profile")}
                >
                  View Profile
                </Button>
              </div>
            </Card>
          </div>

          {/* Center - Feed */}
          <div className="lg:col-span-2">
            {/* Create Post Card */}
            <Card className="mb-6">
              <div className="flex space-x-3">
                <Avatar src={user?.avatarUrl} size="md" />
                <div className="flex-1">
                  <div className="bg-neutral-800 rounded-xl px-4 py-3 text-neutral-400 cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                    What's on your mind, {user?.username}?
                  </div>
                  <div className="flex justify-end mt-3">
                    <Button size="sm">Create Post</Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Empty State */}
            <Card>
              <div className="text-center py-12">
                <div className="text-neutral-400 mb-4">
                  <svg
                    className="mx-auto h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-neutral-100 mb-2">
                  Welcome to your feed!
                </h3>
                <p className="text-neutral-400 mb-4">
                  Start by creating your first post or following some users.
                </p>
                <div className="flex justify-center space-x-3">
                  <Button size="sm">Create First Post</Button>
                  <Button variant="secondary" size="sm">
                    Find Users
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
