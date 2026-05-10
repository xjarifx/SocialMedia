"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SafeImage from "@/components/common/SafeImage";
import { useAuth } from "@/lib/context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: "" });
    }

    if (name === "password") {
      let strength = 0;
      if (value.length >= 8) strength++;
      if (/[A-Z]/.test(value)) strength++;
      if (/[a-z]/.test(value)) strength++;
      if (/[0-9]/.test(value)) strength++;
      if (/[^A-Za-z0-9]/.test(value)) strength++;
      setPasswordStrength(strength);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.username || formData.username.length < 2) {
      errors.username = "Username must be at least 2 characters";
    }
    if (!formData.email || !formData.email.includes("@")) {
      errors.email = "Please enter a valid email";
    }
    if (!formData.firstName) {
      errors.firstName = "First name is required";
    }
    if (!formData.lastName) {
      errors.lastName = "Last name is required";
    }
    if (!formData.password || formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
    if (!/[A-Z]/.test(formData.password)) {
      errors.password = "Password must contain an uppercase letter";
    }
    if (!/[0-9]/.test(formData.password)) {
      errors.password = "Password must contain a number";
    }
    if (!/[^A-Za-z0-9]/.test(formData.password)) {
      errors.password = "Password must contain a special character";
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      clearError();
      await register(formData);
      router.push("/");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  const strengthColor: Record<number, string> = {
    0: "bg-surface-hover",
    1: "bg-danger",
    2: "bg-warning",
    3: "bg-warning",
    4: "bg-success",
    5: "bg-success",
  };

  return (
    <div className="flex min-h-screen bg-background text-text-primary">
      {/* Left Panel — Brand */}
      <div className="hidden shrink-0 flex-col items-center justify-center border-r border-border bg-background px-12 lg:flex lg:w-120 xl:w-140">
        <div className="max-w-85 text-center">
          <SafeImage
            src="/fire.png"
            alt="Social Network logo"
            width={64}
            height={64}
            className="mx-auto mb-6 h-20 w-20"
          />
          <h2 className="text-[28px] font-semibold text-text-primary">
            Join Social Network
          </h2>
          <p className="mt-3 text-base leading-relaxed text-text-secondary">
            Create your account and start connecting with people around the
            world.
          </p>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-115">
          {/* Mobile logo */}
          <div className="mb-8 text-center lg:hidden">
            <SafeImage
              src="/fire.png"
              alt="Social Network logo"
              width={64}
              height={64}
              className="mx-auto mb-4 h-14 w-14"
            />
          </div>

          <h1 className="text-[32px] font-bold text-text-primary">
            Create your account
          </h1>
          <p className="mt-2 text-base text-text-secondary">
            Join the Social Network
          </p>

          {error && (
            <div className="mt-6 rounded-xl border border-danger/50 bg-danger-muted px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                Username
              </label>
              <Input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="johndoe"
                className={`h-12 rounded-xl ${fieldErrors.username ? "border-danger" : ""}`}
              />
              {fieldErrors.username && (
                <p className="mt-1 text-xs text-danger">
                  {fieldErrors.username}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                Email address
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`h-12 rounded-xl ${fieldErrors.email ? "border-danger" : ""}`}
              />
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-danger">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                  First name
                </label>
                <Input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className={`h-12 rounded-xl ${fieldErrors.firstName ? "border-danger" : ""}`}
                />
                {fieldErrors.firstName && (
                  <p className="mt-1 text-xs text-danger">
                    {fieldErrors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                  Last name
                </label>
                <Input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className={`h-12 rounded-xl ${fieldErrors.lastName ? "border-danger" : ""}`}
                />
                {fieldErrors.lastName && (
                  <p className="mt-1 text-xs text-danger">
                    {fieldErrors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className={`h-12 rounded-xl ${fieldErrors.password ? "border-danger" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-text-muted hover:text-text-primary"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {formData.password && (
                <div className="mt-2.5 flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div
                      key={s}
                      className={`h-1.5 flex-1 rounded-full transition-all ${
                        s <= passwordStrength ? strengthColor[s] : "bg-surface-hover"
                      }`}
                    />
                  ))}
                </div>
              )}

              {fieldErrors.password && (
                <p className="mt-1 text-xs text-danger">
                  {fieldErrors.password}
                </p>
              )}
              <p className="mt-1 text-xs text-text-muted">
                Must be 8+ characters with uppercase, number, and special
                character
              </p>
            </div>

            <div className="flex items-center justify-between pt-4">
              <Link
                href="/login"
                className="text-sm font-medium text-accent hover:underline"
              >
                Sign in instead
              </Link>
              <Button
                type="submit"
                disabled={isLoading}
                className="h-11 rounded-xl px-8"
              >
                {isLoading ? "Creating..." : "Create account"}
              </Button>
            </div>
          </form>

          <p className="mt-10 text-xs text-text-muted">
            By creating an account, you agree to our Terms of Service and
            Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
