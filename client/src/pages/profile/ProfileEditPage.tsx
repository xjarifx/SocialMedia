import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";
import Avatar from "../../components/ui/Avatar";
import PageHeader from "../../components/ui/PageHeader";
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
    <div className="min-h-screen bg-neutral-50">
      <PageHeader
        title="Edit Profile"
        subtitle="Update your personal information and preferences"
        showBackButton={true}
        backTo="/profile"
      />
      <div className="max-w-2xl mx-auto py-8 px-4">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.form && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-soft text-red-700 text-sm">
                {errors.form}
              </div>
            )}

            {showSuccess && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-soft text-green-700 text-sm">
                Profile updated successfully!
              </div>
            )}

            {/* Avatar Section */}
            <div className="flex items-center space-x-6">
              <Avatar src={formData.avatarUrl || user?.avatarUrl} size="xl" />
              <div className="flex-1">
                <Input
                  label="Avatar URL"
                  name="avatarUrl"
                  type="url"
                  value={formData.avatarUrl}
                  onChange={handleChange}
                  error={errors.avatarUrl}
                  placeholder="https://example.com/your-avatar.jpg"
                  helperText="Enter a URL to your profile picture"
                />
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                error={errors.username}
                required
                placeholder="Enter your username"
                helperText="3-50 characters, letters, numbers, and underscores only"
              />

              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                placeholder="+1 (555) 123-4567"
                helperText="Optional - for account recovery"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-neutral-300 rounded-soft text-neutral-900 placeholder-neutral-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                placeholder="Tell people about yourself..."
              />
              {errors.bio && (
                <p className="text-sm text-red-600 mt-1">{errors.bio}</p>
              )}
              <p className="text-sm text-neutral-500 mt-1">
                {formData.bio.length}/500 characters
              </p>
            </div>

            {/* Privacy Settings */}
            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-soft">
              <div>
                <h3 className="text-sm font-medium text-neutral-900">
                  Private Account
                </h3>
                <p className="text-sm text-neutral-600">
                  When your account is private, only people you approve can see
                  your posts
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
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
              <Button
                type="button"
                variant="secondary"
                onClick={() => window.history.back()}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={isLoading} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
