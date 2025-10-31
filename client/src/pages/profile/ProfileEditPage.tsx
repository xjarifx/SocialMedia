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
    isPrivate: user?.isPrivate || false,
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        avatar: "Please select a valid image file (JPEG, PNG, GIF, or WebP)",
      }));
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        avatar: "Image size must be less than 5MB",
      }));
      return;
    }

    setAvatarFile(file);
    setErrors((prev) => ({ ...prev, avatar: "" }));

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
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
      // Check if we have file upload or regular updates
      if (avatarFile) {
        // Use FormData for file upload
        const formDataToSend = new FormData();
        formDataToSend.append("avatar", avatarFile);

        // Add other fields
        if (formData.username !== user?.username)
          formDataToSend.append("username", formData.username);
        if (formData.phone !== (user?.phone || ""))
          formDataToSend.append("phone", formData.phone || "");
        if (formData.bio !== (user?.bio || ""))
          formDataToSend.append("bio", formData.bio || "");
        if (formData.isPrivate !== (user?.isPrivate || false))
          formDataToSend.append("isPrivate", String(formData.isPrivate));

        await updateProfile(formDataToSend);
      } else {
        // Regular JSON update
        const updates: Record<string, unknown> = {};
        if (formData.username !== user?.username)
          updates.username = formData.username;
        if (formData.phone !== (user?.phone || ""))
          updates.phone = formData.phone || null;
        if (formData.bio !== (user?.bio || ""))
          updates.bio = formData.bio || null;
        if (formData.isPrivate !== (user?.isPrivate || false))
          updates.isPrivate = formData.isPrivate;

        if (Object.keys(updates).length > 0) {
          await updateProfile(updates);
        }
      }

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/profile");
      }, 2000);
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
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col">
      {/* Sticky Header */}
      <div className="bg-neutral-950 border-b border-neutral-800 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate("/profile")}
            className="p-1.5 hover:bg-neutral-800 rounded-xl transition-colors"
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
          <h1 className="text-lg font-semibold text-neutral-100">
            Edit Profile
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/profile")}
            className="px-4 py-2 text-sm h-10"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="profile-form"
            isLoading={isLoading}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-bold h-10 !bg-white !text-black hover:!bg-gray-100 shadow-lg hover:shadow-xl"
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-10">
          <form id="profile-form" onSubmit={handleSubmit} className="space-y-8">
            {/* Alerts */}
            {errors.form && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-700 font-medium">
                  {errors.form}
                </p>
              </div>
            )}
            {showSuccess && (
              <div className="p-3 bg-green-600 border border-green-500 rounded-xl">
                <p className="text-sm text-white font-medium">
                  Profile updated successfully!
                </p>
              </div>
            )}

            {/* Unified Card */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl shadow-soft p-6 flex flex-col gap-10">
              {/* Identity Section */}
              <section className="flex flex-col gap-6">
                <h2 className="text-sm font-semibold tracking-wide text-neutral-300 uppercase">
                  Profile Identity
                </h2>
                <div className="flex flex-col md:flex-row md:items-start gap-5">
                  <div className="flex flex-col items-center gap-3">
                    <Avatar
                      src={avatarPreview || user?.avatarUrl}
                      size="xl"
                      className="ring-2 ring-neutral-800"
                    />
                    <div className="flex gap-2">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-primary-400 bg-primary-400/10 hover:bg-primary-400/20 rounded-lg transition-colors">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          Upload
                        </span>
                      </label>
                      {(avatarPreview || user?.avatarUrl) && (
                        <button
                          type="button"
                          onClick={removeAvatar}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-400 bg-red-400/10 hover:bg-red-400/20 rounded-lg transition-colors"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Remove
                        </button>
                      )}
                    </div>
                    {errors.avatar && (
                      <p className="text-xs text-red-500">{errors.avatar}</p>
                    )}
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Input
                          label="Username"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          error={errors.username}
                          required
                          placeholder="username"
                        />
                        <p className="text-[11px] text-neutral-400 mt-1">
                          Profile URL: /@{formData.username}
                        </p>
                      </div>
                      <div>
                        <Input
                          label="Phone Number"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          error={errors.phone}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <div className="h-px bg-neutral-800" />

              {/* Bio Section */}
              <section className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold tracking-wide text-neutral-300 uppercase">
                    Bio
                  </h2>
                  <span
                    className={`text-xs ${
                      formData.bio.length > 500
                        ? "text-red-500"
                        : "text-primary-400"
                    }`}
                  >
                    {formData.bio.length}/500
                  </span>
                </div>
                <div className="relative">
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={7}
                    maxLength={600}
                    className="w-full px-4 py-3 border border-neutral-800 rounded-xl text-neutral-100 placeholder-neutral-500 bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none leading-relaxed"
                    placeholder="Tell people about yourself, your interests, goals, passions..."
                  />
                  {errors.bio && (
                    <p className="text-xs text-red-600 mt-2">{errors.bio}</p>
                  )}
                </div>
                <p className="text-[11px] text-neutral-400">
                  Tip: A clear bio helps others decide to follow you.
                </p>
              </section>

              <div className="h-px bg-neutral-800" />

              {/* Privacy Section */}
              <section className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <h2 className="text-sm font-semibold tracking-wide text-neutral-300 uppercase mb-1">
                      Privacy
                    </h2>
                    <p className="text-xs text-neutral-400 max-w-sm">
                      When private, only approved followers can see your posts
                      and full profile details.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer mt-1">
                    <input
                      type="checkbox"
                      name="isPrivate"
                      checked={formData.isPrivate}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-300 dark:bg-neutral-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white dark:after:bg-neutral-200 after:border-neutral-300 dark:after:border-neutral-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>
                <div className="mt-2 flex items-center text-xs font-medium">
                  {formData.isPrivate ? (
                    <span className="flex items-center gap-1 text-primary-400">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>{" "}
                      Private
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-green-600">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>{" "}
                      Public
                    </span>
                  )}
                </div>
              </section>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
