import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Avatar from "../../components/ui/Avatar";
import PageHeader from "../../components/ui/PageHeader";

export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const navigateToEdit = () => {
    navigate("/profile/edit");
  };

  const navigateToChangePassword = () => {
    navigate("/profile/password");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <PageHeader
        title="Profile"
        subtitle="Manage your account settings"
        showBackButton={true}
        backTo="/dashboard"
      />
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview Card */}
          <div className="lg:col-span-1">
            <Card>
              <div className="text-center">
                <Avatar src={user?.avatarUrl} size="xl" className="mx-auto" />
                <h2 className="mt-4 text-xl font-semibold text-neutral-900">
                  @{user?.username}
                </h2>
                <p className="text-neutral-600">{user?.email}</p>

                {user?.bio && (
                  <p className="mt-3 text-sm text-neutral-700 leading-relaxed">
                    {user.bio}
                  </p>
                )}

                <div className="mt-4 flex justify-center space-x-4 text-sm text-neutral-500">
                  <div>
                    <span className="font-semibold text-neutral-900">0</span>{" "}
                    Posts
                  </div>
                  <div>
                    <span className="font-semibold text-neutral-900">0</span>{" "}
                    Following
                  </div>
                  <div>
                    <span className="font-semibold text-neutral-900">0</span>{" "}
                    Followers
                  </div>
                </div>

                {/* Profile Status Indicators */}
                <div className="mt-4 space-y-2">
                  {user?.isVerified && (
                    <div className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-soft">
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Verified
                    </div>
                  )}

                  {user?.isPrivate && (
                    <div className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-soft">
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Private Account
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-2">
                  <Button onClick={navigateToEdit} className="w-full" size="sm">
                    Edit Profile
                  </Button>
                  <Button
                    onClick={navigateToChangePassword}
                    variant="secondary"
                    className="w-full"
                    size="sm"
                  >
                    Change Password
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Profile Details Card */}
          <div className="lg:col-span-2">
            <Card>
              <h3 className="text-lg font-semibold text-neutral-900 mb-6">
                Account Information
              </h3>

              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h4 className="text-sm font-medium text-neutral-700 mb-4">
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wide">
                        Email Address
                      </label>
                      <p className="mt-1 text-sm text-neutral-900">
                        {user?.email}
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wide">
                        Phone Number
                      </label>
                      <p className="mt-1 text-sm text-neutral-900">
                        {user?.phone || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wide">
                        Member Since
                      </label>
                      <p className="mt-1 text-sm text-neutral-900">
                        {user?.createdAt
                          ? formatDate(user.createdAt)
                          : "Unknown"}
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wide">
                        Last Updated
                      </label>
                      <p className="mt-1 text-sm text-neutral-900">
                        {user?.updatedAt
                          ? formatDate(user.updatedAt)
                          : "Unknown"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Account Settings */}
                <div className="border-t border-neutral-200 pt-6">
                  <h4 className="text-sm font-medium text-neutral-700 mb-4">
                    Account Settings
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-soft">
                      <div>
                        <h5 className="text-sm font-medium text-neutral-900">
                          Account Status
                        </h5>
                        <p className="text-xs text-neutral-600">
                          Your account is currently active
                        </p>
                      </div>
                      <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-soft">
                        Active
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-soft">
                      <div>
                        <h5 className="text-sm font-medium text-neutral-900">
                          Privacy
                        </h5>
                        <p className="text-xs text-neutral-600">
                          {user?.isPrivate
                            ? "Only approved followers can see your posts"
                            : "Your posts are public"}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-soft ${
                          user?.isPrivate
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {user?.isPrivate ? "Private" : "Public"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
