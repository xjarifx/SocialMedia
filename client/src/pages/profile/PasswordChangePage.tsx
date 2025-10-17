import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../utils/api";
import Button from "../../components/ui/Button";
import PasswordInput from "../../components/ui/PasswordInput";
import Card from "../../components/ui/Card";
import PageHeader from "../../components/ui/PageHeader";
import { ApiError } from "../../utils/api";

export default function PasswordChangePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Current password required
    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    // New password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.newPassword)) {
      newErrors.newPassword =
        "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character";
    }

    // Confirm password validation
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Ensure new password is different from current
    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword =
        "New password must be different from current password";
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
      await api.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      setShowSuccess(true);
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Navigate back to profile after successful password change
      setTimeout(() => {
        navigate("/profile");
      }, 2000);

      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          setErrors({ currentPassword: "Current password is incorrect" });
        } else if (error.status === 400) {
          setErrors({ form: "Invalid request. Please check your input." });
        } else {
          setErrors({ form: "Failed to change password. Please try again." });
        }
      } else {
        setErrors({ form: "Network error. Please check your connection." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950">
      <PageHeader
        title="Change Password"
        subtitle="Update your account password to keep it secure"
        showBackButton={true}
        backTo="/profile"
      />
      <div className="max-w-lg mx-auto py-8 px-4">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.form && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-soft text-red-700 text-sm">
                {errors.form}
              </div>
            )}

            {showSuccess && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-soft text-green-700 text-sm">
                Password changed successfully! Your new password is now active.
              </div>
            )}

            <PasswordInput
              label="Current Password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              error={errors.currentPassword}
              required
              placeholder="Enter your current password"
            />

            <PasswordInput
              label="New Password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              error={errors.newPassword}
              required
              placeholder="Enter your new password"
              helperText="At least 8 characters with uppercase, lowercase, number, and special character"
            />

            <PasswordInput
              label="Confirm New Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
              placeholder="Confirm your new password"
            />

            {/* Security Tips */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-soft">
              <h3 className="text-sm font-medium text-blue-900 mb-2">
                Password Security Tips
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Use a unique password for this account</li>
                <li>• Include a mix of letters, numbers, and symbols</li>
                <li>• Avoid using personal information</li>
                <li>• Consider using a password manager</li>
              </ul>
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
              <Button
                type="submit"
                isLoading={isLoading}
                disabled={
                  isLoading ||
                  !formData.currentPassword ||
                  !formData.newPassword ||
                  !formData.confirmPassword
                }
              >
                {isLoading ? "Changing Password..." : "Change Password"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
