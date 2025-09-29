import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Avatar from "../../components/ui/Avatar";
import { ApiError } from "../../utils/api";

export default function ProfileEditPage() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: user?.username || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    avatarUrl: user?.avatarUrl || "",
    isPrivate: user?.isPrivate || false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const inputValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({ ...prev, [name]: inputValue }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Username validation
    const usernameRegex = /^[a-zA-Z0-9_]{3,50}$/;
    if (!usernameRegex.test(formData.username)) {
      newErrors.username =
        "Username must be 3-50 characters long and contain only letters, numbers, and underscores";
    }

    // Phone validation (optional)
    if (formData.phone && formData.phone.length > 0) {
      const phoneRegex = /^[+]?[\d\s\-()]{10,}$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = "Please enter a valid phone number";
      }
    }

    // Bio validation
    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = "Bio must be 500 characters or less";
    }

    // Avatar URL validation (optional)
    if (formData.avatarUrl && formData.avatarUrl.length > 0) {
      try {
        new URL(formData.avatarUrl);
      } catch {
        newErrors.avatarUrl = "Please enter a valid URL";
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setShowSuccess(false);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      // Only send changed fields
      const updates: any = {};
      if (formData.username !== user?.username)
        updates.username = formData.username;
      if (formData.phone !== (user?.phone || ""))
        updates.phone = formData.phone || null;
      if (formData.bio !== (user?.bio || ""))
        updates.bio = formData.bio || null;
      if (formData.avatarUrl !== (user?.avatarUrl || ""))
        updates.avatarUrl = formData.avatarUrl || null;
      if (formData.isPrivate !== (user?.isPrivate || false))
        updates.isPrivate = formData.isPrivate;

      if (Object.keys(updates).length > 0) {
        await updateProfile(updates);
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate("/profile"); // Navigate back to profile after successful update
        }, 2000);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 409) {
          if (error.message.includes("username")) {
            setErrors({ username: "Username already exists" });
          } else if (error.message.includes("phone")) {
            setErrors({ phone: "Phone number already exists" });
          } else {
            setErrors({ form: error.message });
          }
        } else {
          setErrors({ form: "Failed to update profile. Please try again." });
        }
      } else {
        setErrors({ form: "Network error. Please check your connection." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-orange-50 flex flex-col">
      {/* Compact Header */}
      <div className="bg-white border-b border-orange-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate("/profile")}
            className="p-1.5 hover:bg-orange-50 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <svg
              className="w-5 h-5 text-primary-600"
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
          <h1 className="text-lg font-semibold text-primary-900">
            Edit Profile
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/profile")}
            className="px-4 py-2 text-sm"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="profile-form"
            isLoading={isLoading}
            disabled={isLoading}
            className="px-4 py-2 text-sm"
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* Main Content - Full Width */}
      <div className="flex-1 overflow-auto">
        <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-0">
          {/* Profile Preview - Left */}
          <div className="bg-white border-r border-orange-200 p-6">
            <h2 className="text-sm font-medium text-primary-700 mb-4">
              Preview
            </h2>
            <div className="space-y-4">
              <div className="text-center">
                <Avatar
                  src={formData.avatarUrl || user?.avatarUrl}
                  size="xl"
                  className="mx-auto mb-3"
                />
                <h3 className="font-medium text-primary-900">
                  @{formData.username}
                </h3>
                {formData.phone && (
                  <p className="text-sm text-primary-500">{formData.phone}</p>
                )}
              </div>

              {formData.bio && (
                <div className="bg-orange-50 rounded-lg p-3">
                  <p className="text-sm text-primary-700 leading-relaxed">
                    {formData.bio}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-center space-x-1 text-xs">
                {formData.isPrivate ? (
                  <>
                    <svg
                      className="w-3 h-3 text-primary-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-primary-600">Private</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-3 h-3 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-green-600">Public</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Main Form - Center */}
          <div className="lg:col-span-2 bg-white p-6">
            <form
              id="profile-form"
              onSubmit={handleSubmit}
              className="h-full flex flex-col space-y-6"
            >
              {/* Status Messages */}
              {errors.form && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{errors.form}</p>
                </div>
              )}

              {showSuccess && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    Profile updated successfully!
                  </p>
                </div>
              )}

              <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Avatar */}
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">
                      Profile Picture
                    </label>
                    <div className="flex items-center space-x-4">
                      <Avatar
                        src={formData.avatarUrl || user?.avatarUrl}
                        size="lg"
                        className="flex-shrink-0"
                      />
                      <Input
                        name="avatarUrl"
                        type="url"
                        value={formData.avatarUrl}
                        onChange={handleChange}
                        error={errors.avatarUrl}
                        placeholder="Image URL"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  {/* Username */}
                  <div>
                    <Input
                      label="Username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      error={errors.username}
                      required
                      placeholder="Enter username"
                    />
                    <p className="text-xs text-primary-500 mt-1">
                      Profile URL: /@{formData.username}
                    </p>
                  </div>

                  {/* Phone */}
                  <Input
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    placeholder="+1 (555) 123-4567"
                  />

                  {/* Privacy Toggle */}
                  <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-primary-900">
                          Private Account
                        </h3>
                        <p className="text-xs text-primary-600">
                          Only followers can see your posts
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="isPrivate"
                          checked={formData.isPrivate}
                          onChange={handleChange}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-orange-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-orange-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-500"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Bio */}
                  <div className="h-full flex flex-col">
                    <label className="block text-sm font-medium text-primary-700 mb-2">
                      Bio
                    </label>
                    <div className="relative flex-1">
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={8}
                        className="w-full h-full px-3 py-2 border border-orange-300 rounded-lg text-primary-900 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                        placeholder="Tell people about yourself..."
                      />
                      <div className="absolute bottom-2 right-2 text-xs text-primary-400 bg-white px-2 py-1 rounded">
                        {formData.bio.length}/500
                      </div>
                    </div>
                    {errors.bio && (
                      <p className="text-sm text-red-600 mt-1">{errors.bio}</p>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
