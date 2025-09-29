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
    <div className="min-h-screen bg-primary-50">
      <PageHeader
        title="Edit Profile"
        subtitle="Customize your profile and privacy settings"
        showBackButton={true}
        backTo="/profile"
      />

      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Left Sidebar - Profile Preview */}
          <div className="xl:col-span-1 space-y-6">
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-primary-900 mb-6 flex items-center">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-2">
                    <svg className="w-3 h-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  Live Preview
                </h2>
                
                <div className="text-center space-y-4">
                  <Avatar 
                    src={formData.avatarUrl || user?.avatarUrl} 
                    size="xl" 
                    className="mx-auto ring-4 ring-primary-200 shadow-lg"
                  />
                  <div>
                    <h3 className="font-semibold text-primary-900">@{formData.username}</h3>
                    <p className="text-sm text-primary-600 mt-1">
                      {formData.phone || "No phone number"}
                    </p>
                  </div>
                  <div className="text-left bg-primary-50 rounded-soft p-3">
                    <p className="text-sm text-primary-700">
                      {formData.bio || "No bio added yet..."}
                    </p>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-xs">
                    {formData.isPrivate ? (
                      <>
                        <svg className="w-3 h-3 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-primary-600">Private Account</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-green-600">Public Account</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Profile Form */}
          <div className="xl:col-span-2">
            <Card>
              <div className="p-8">
                <h2 className="text-2xl font-semibold text-primary-900 mb-8 flex items-center">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  Profile Information
                </h2>

                <form onSubmit={handleSubmit} className="space-y-10">
                  {errors.form && (
                    <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-r-soft">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-red-800">{errors.form}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {showSuccess && (
                    <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded-r-soft">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-green-800">Profile updated successfully!</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Profile Picture Section */}
                  <div className="bg-gradient-to-br from-primary-50 via-primary-100 to-orange-100 rounded-lg p-8">
                    <h3 className="text-xl font-semibold text-primary-900 mb-6">Profile Picture</h3>
                    <div className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-8">
                      <div className="relative">
                        <Avatar
                          src={formData.avatarUrl || user?.avatarUrl}
                          size="xl" 
                          className="ring-6 ring-white shadow-2xl w-24 h-24"
                        />
                        <div className="absolute -bottom-3 -right-3 bg-primary-500 rounded-full p-3 shadow-lg ring-4 ring-white">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1 w-full">
                        <Input
                          label="Avatar URL"
                          name="avatarUrl"
                          type="url"
                          value={formData.avatarUrl}
                          onChange={handleChange}
                          error={errors.avatarUrl}
                          placeholder="https://example.com/your-avatar.jpg"
                          helperText="Paste a link to your profile picture (JPG, PNG, GIF supported)"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Basic Information */}
                  <div className="space-y-8">
                    <h3 className="text-xl font-semibold text-primary-900 border-b-2 border-primary-200 pb-3">
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-2">
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
                        <div className="flex items-center text-sm text-primary-600 bg-primary-50 rounded-soft p-2 mt-2">
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          Your profile URL: <strong>/@{formData.username}</strong>
                        </div>
                      </div>

                      <Input
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        error={errors.phone}
                        placeholder="+1 (555) 123-4567"
                        helperText="Optional - for account recovery and two-factor authentication"
                      />
                    </div>
                  </div>

                  {/* Bio Section */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-primary-900 border-b-2 border-primary-200 pb-3">
                      About You
                    </h3>
                    <div>
                      <label className="block text-base font-medium text-primary-700 mb-3">
                        Bio
                      </label>
                      <div className="relative">
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleChange}
                          rows={5}
                          className="w-full px-5 py-4 border-2 border-orange-200 rounded-lg text-primary-900 placeholder-primary-400 transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-primary-300 focus:border-primary-500 resize-none shadow-sm text-base leading-relaxed"
                          placeholder="Tell people about yourself, your interests, what you do, or what you're passionate about..."
                        />
                        <div className="absolute bottom-4 right-4 text-sm text-primary-500 bg-white px-3 py-1 rounded-full border-2 border-orange-200 shadow-sm">
                          {formData.bio.length}/500
                        </div>
                      </div>
                      {errors.bio && (
                        <p className="text-sm text-red-600 mt-3 flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.bio}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4 pt-8 border-t-2 border-primary-200">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => navigate("/profile")}
                      className="w-full sm:w-auto px-8 py-3 text-base"
                    >
                      Cancel Changes
                    </Button>
                    <Button 
                      type="submit" 
                      isLoading={isLoading} 
                      disabled={isLoading}
                      className="w-full sm:w-auto px-8 py-3 text-base"
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Saving Changes...
                        </div>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          </div>

          {/* Right Sidebar - Settings */}
          <div className="xl:col-span-1 space-y-6">
            {/* Privacy Settings */}
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-primary-900 mb-6 flex items-center">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-2">
                    <svg className="w-3 h-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  Privacy
                </h2>
                
                <div className="space-y-6">
                  <div className="p-4 bg-gradient-to-r from-primary-50 to-orange-50 rounded-soft border border-orange-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 pr-4">
                        <h3 className="text-sm font-semibold text-primary-900 mb-1">
                          Private Account
                        </h3>
                        <p className="text-sm text-primary-700 leading-relaxed">
                          Only approved followers can see your posts and profile
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
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500 shadow-sm"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Profile Tips */}
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-primary-900 mb-4 flex items-center">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-2">
                    <svg className="w-3 h-3 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Profile Tips
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 text-sm">
                    <div className="flex-shrink-0 w-2 h-2 bg-primary-400 rounded-full mt-2"></div>
                    <p className="text-primary-700 leading-relaxed">Use a clear profile picture to help others recognize you</p>
                  </div>
                  <div className="flex items-start space-x-3 text-sm">
                    <div className="flex-shrink-0 w-2 h-2 bg-primary-400 rounded-full mt-2"></div>
                    <p className="text-primary-700 leading-relaxed">Write a bio that reflects your personality or interests</p>
                  </div>
                  <div className="flex items-start space-x-3 text-sm">
                    <div className="flex-shrink-0 w-2 h-2 bg-primary-400 rounded-full mt-2"></div>
                    <p className="text-primary-700 leading-relaxed">Choose a username that's easy to remember and share</p>
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