import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import PasswordInput from "../../components/ui/PasswordInput";
import Card from "../../components/ui/Card";
import { ApiError } from "../../utils/api";

export default function RegisterPage() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

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

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Username validation
    const usernameRegex = /^[a-zA-Z0-9_]{3,50}$/;
    if (!usernameRegex.test(formData.username)) {
      newErrors.username =
        "Username must be 3-50 characters long and contain only letters, numbers, and underscores";
    }

    // Password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#+\-_.])[A-Za-z\d@$!%*?&#+\-_.]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character";
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      await register({
        email: formData.email,
        username: formData.username,
        password: formData.password,
      });
      // Redirect will happen automatically due to auth state change
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        if (error.status === 409) {
          if (error.message.toLowerCase().includes("email")) {
            setErrors({ email: "Email already exists" });
          } else if (error.message.toLowerCase().includes("username")) {
            setErrors({ username: "Username already exists" });
          } else {
            setErrors({ form: error.message });
          }
        } else if (error.status === 400) {
          setErrors({ form: "Please check your information and try again" });
        } else {
          // Show the full error message for debugging
          setErrors({ form: `Error: ${error.message}` });
        }
      } else {
        // Show debug info for non-ApiError
        const message =
          (error as { message?: string })?.message || "Unknown error";
        setErrors({ form: `Non-API Error: ${message}` });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-neutral-100">
            Create your account
          </h2>
          <p className="mt-2 text-neutral-400">
            Join our community and start sharing
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.form && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-soft text-red-700 text-sm">
                {errors.form}
              </div>
            )}

            <Input
              label="Email address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
              placeholder="Enter your email"
            />

            <Input
              label="Username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              required
              placeholder="Choose a username"
              helperText="3-50 characters, letters, numbers, and underscores only"
            />

            <PasswordInput
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
              placeholder="Create a strong password"
              helperText="At least 8 characters with uppercase, lowercase, number, and special character (@$!%*?&#+-_.)"
            />

            <PasswordInput
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
              placeholder="Confirm your password"
            />

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              disabled={
                !formData.email ||
                !formData.username ||
                !formData.password ||
                !formData.confirmPassword
              }
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-neutral-600">
              Already have an account?{" "}
              <button
                onClick={() => (window.location.href = "/login")}
                className="font-medium text-primary-500 hover:text-primary-600 transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
