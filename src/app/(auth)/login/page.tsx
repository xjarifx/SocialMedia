"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/auth-context";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: "" });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!formData.email.includes("@")) {
      errors.email = "Please enter a valid email";
    }
    if (!formData.password) {
      errors.password = "Password is required";
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
      await login(formData.email, formData.password);
      router.push("/");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleTestLogin = async (accountNumber: 1 | 2) => {
    const testEmail = `test${accountNumber}@example.com`;
    const testPassword = "Password123!";

    setFormData({ email: testEmail, password: testPassword });
    setFieldErrors({});

    try {
      clearError();
      await login(testEmail, testPassword);
      router.push("/");
    } catch (err) {
      console.error("Test login failed:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Left Panel — Brand / Illustration */}
      <div className="hidden shrink-0 flex-col items-center justify-center border-r border-[#2f3336] bg-[#16181c] px-12 lg:flex lg:w-120 xl:w-140">
        <div className="max-w-85 text-center">
          <Image
            src="/fire.png"
            alt="Social Network logo"
            width={64}
            height={64}
            className="mx-auto mb-6 h-20 w-20"
          />
          <h2 className="text-[28px] font-semibold text-white">
            Welcome to Social Network
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-white/70">
            Connect with friends, share your thoughts, and discover what&apos;s
            happening in the world.
          </p>
          <div className="mt-10 flex flex-col gap-4">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#16181c] px-4 py-3 text-left">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1d9bf0]/20 text-[#1d9bf0]">
                <ArrowRight className="h-5 w-5" />
              </div>
              <p className="text-[13px] text-white/80">
                Share your ideas with a growing community
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#16181c] px-4 py-3 text-left">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1d9bf0]/20 text-[#1d9bf0]">
                <ArrowRight className="h-5 w-5" />
              </div>
              <p className="text-[13px] text-white/80">
                Follow people and stay up to date
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-100">
          {/* Mobile logo */}
          <div className="mb-8 text-center lg:hidden">
            <Image
              src="/fire.png"
              alt="Social Network logo"
              width={64}
              height={64}
              className="mx-auto mb-4 h-14 w-14"
            />
          </div>

          <h1 className="text-[32px] font-bold text-white">Sign in</h1>
          <p className="mt-2 text-[15px] text-white/70">
            Use your Social Network account
          </p>

          {error && (
            <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-[13px] text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-white/70">
                Email address
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`h-12 rounded-xl ${fieldErrors.email ? "border-[#ea4335]" : ""}`}
              />
              {fieldErrors.email && (
                <p className="mt-1 text-[12px] text-[#ea4335]">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-white/70">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`h-12 rounded-xl ${fieldErrors.password ? "border-[#ea4335]" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-white/60 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-[12px] text-[#ea4335]">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-4">
              <Link
                href="/register"
                className="text-[14px] font-medium text-[#1a73e8] hover:underline"
              >
                Create account
              </Link>
              <Button
                type="submit"
                disabled={isLoading}
                className="h-11 rounded-xl px-8"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>

          {/* Test Account Quick Login */}
          <div className="mt-8 border-t border-white/10 pt-6">
            <p className="mb-4 text-center text-[14px] font-medium text-white/70">
              Quick test login
            </p>
            <div className="flex gap-3">
              <Button
                type="button"
                onClick={() => handleTestLogin(1)}
                disabled={isLoading}
                variant="outline"
                className="h-11 flex-1 rounded-xl border-[#1d9bf0]/50 bg-[#1d9bf0]/10 text-[14px] font-medium text-[#1d9bf0] hover:border-[#1d9bf0] hover:bg-[#1d9bf0]/20"
              >
                Test Account 1 (Free)
              </Button>
              <Button
                type="button"
                onClick={() => handleTestLogin(2)}
                disabled={isLoading}
                variant="outline"
                className="h-11 flex-1 rounded-xl border-[#f91880]/50 bg-[#f91880]/10 text-[14px] font-medium text-[#f91880] hover:border-[#f91880] hover:bg-[#f91880]/20"
              >
                Test Account 2 (Pro)
              </Button>
            </div>
          </div>

          <p className="mt-10 text-[11px] text-white/50">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
