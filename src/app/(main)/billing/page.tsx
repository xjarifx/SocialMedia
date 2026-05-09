"use client";

import { useEffect, useState } from "react";
import { billingAPI } from "@/lib/services/api";
import type { BillingStatus } from "@/lib/services/api";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, RefreshCw } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";

// ---------------------------------------------------------------------------
// Main billing page - redirects to Stripe Checkout
// ---------------------------------------------------------------------------

export default function BillingPage() {
  const { user, refreshUserProfile, setUserPlan } = useAuth();
  const [status, setStatus] = useState<BillingStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDowngrading, setIsDowngrading] = useState(false);

  const loadStatus = async () => {
    try {
      setIsLoading(true);
      const response = await billingAPI.getStatus();
      setStatus(response);
      setUserPlan(response.plan);
      await refreshUserProfile();
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load billing";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      const response = await billingAPI.getStatus();
      setStatus(response);
      setUserPlan(response.plan);
      await refreshUserProfile();
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to refresh billing status";
      setError(message);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadStatus();

    // Listen for visibility changes (user returning to tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("📱 Page regained focus, refreshing billing status...");
        loadStatus();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleUpgradeToPro = async () => {
    try {
      setIsRedirecting(true);
      setError(null);

      console.log("\n" + "=".repeat(60));
      console.log("🚀 Starting checkout flow...");
      console.log("=".repeat(60));

      // Create checkout session and redirect to Stripe
      const result = await billingAPI.createCheckoutSession();
      console.log("✅ Checkout session created:", result);

      if (!result || !result.url) {
        console.error("❌ No URL in response:", result);
        throw new Error("Failed to create checkout session - no redirect URL");
      }

      console.log("\n📍 Redirecting to Stripe:");
      console.log("  URL:", result.url);
      console.log("  Time:", new Date().toISOString());
      console.log("=".repeat(60) + "\n");

      // Redirect to Stripe's hosted checkout page
      window.location.href = result.url;
    } catch (err) {
      console.error("❌ Checkout error:", err);
      const message =
        err instanceof Error ? err.message : "Failed to start checkout";
      setError(message);
      setIsRedirecting(false);
    }
  };

  const handleDowngradeToFree = async () => {
    try {
      setIsDowngrading(true);
      setError(null);

      console.log("🔄 Starting downgrade to FREE...");
      const result = await billingAPI.downgrade();
      console.log("✅ Downgraded successfully:", result);
      if (result.plan === "FREE" || result.plan === "PRO") {
        setUserPlan(result.plan);
      }
      await refreshUserProfile();

      // Refresh status to reflect the change
      await loadStatus();
    } catch (err) {
      console.error("❌ Downgrade error:", err);
      const message =
        err instanceof Error ? err.message : "Failed to downgrade";
      setError(message);
    } finally {
      setIsDowngrading(false);
    }
  };

  // Use auth context user plan as source of truth when available
  const currentPlan = status?.plan || user?.plan || "FREE";
  const isPro = currentPlan === "PRO";

  return (
    <div>
      {/* Header */}
      <div className="border-b border-white/15 p-3 text-center">
        <h1 className="text-[24px] font-normal text-white">Choose Your Plan</h1>
        <p className="mt-2 text-[15px] text-white/60">
          Select the plan that works best for you
        </p>
      </div>

      {error && (
        <div className="flex items-center justify-between border border-[#ea4335]/30 bg-[#fce8e6] px-4 py-3 text-[13px] text-[#c5221f]">
          <span>{error}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-6 w-6 p-0"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-5">
          {[0, 1].map((i) => (
            <div key={i} className="border border-white/15 bg-white/5 p-8">
              <div className="space-y-3">
                <div className="h-4 w-16 animate-pulse rounded bg-white/15" />
                <div className="h-8 w-20 animate-pulse rounded bg-white/15" />
                <div className="h-3 w-28 animate-pulse rounded bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {/* Free Plan */}
          <div className="relative overflow-hidden border border-white/15 bg-white/5 p-7">
            <div className="mb-6">
              <h3 className="text-[18px] font-medium text-white">Free</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-[36px] font-normal text-white">$0</span>
                <span className="text-[14px] text-white/60">/forever</span>
              </div>
            </div>

            <div className="mb-8 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#e8f0fe]">
                  <Check className="h-3.5 w-3.5 text-[#1a73e8]" />
                </div>
                <p className="text-[14px] text-white/85">
                  Posts up to 20 characters
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#e8f0fe]">
                  <Check className="h-3.5 w-3.5 text-[#1a73e8]" />
                </div>
                <p className="text-[14px] text-white/85">Unlimited follows</p>
              </div>
            </div>

            <Button
              variant="secondary"
              disabled={!isPro || isDowngrading}
              onClick={isPro ? handleDowngradeToFree : undefined}
              className="h-11 w-full rounded-none"
            >
              {!isPro
                ? "Current Plan"
                : isDowngrading
                  ? "Downgrading..."
                  : "Downgrade"}
            </Button>
          </div>

          {/* Pro Plan */}
          <div className="relative overflow-hidden border border-white/15 bg-white/5 p-7">
            {/* Popular badge */}
            {!isPro && (
              <div className="absolute top-4 right-4">
                <div className="inline-flex items-center gap-1 rounded-full bg-[#e8f0fe] px-3 py-1 text-[11px] font-medium text-[#1a73e8]">
                  <Sparkles className="h-3 w-3" />
                  Popular
                </div>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-[18px] font-medium text-white">Pro</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-[36px] font-normal text-white">
                  $9.99
                </span>
                <span className="text-[14px] text-white/60">/month</span>
              </div>
            </div>

            <div className="mb-8 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#e8f0fe]">
                  <Check className="h-3.5 w-3.5 text-[#1a73e8]" />
                </div>
                <p className="text-[14px] text-white/85">
                  Posts up to 100 characters
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#e8f0fe]">
                  <Check className="h-3.5 w-3.5 text-[#1a73e8]" />
                </div>
                <p className="text-[14px] text-white/85">
                  Pro badge beside your name
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#e8f0fe]">
                  <Check className="h-3.5 w-3.5 text-[#1a73e8]" />
                </div>
                <p className="text-[14px] text-white/85">Priority support</p>
              </div>
            </div>

            {isPro ? (
              <Button disabled className="h-11 w-full rounded-none">
                Current Plan
              </Button>
            ) : (
              <Button
                className="h-11 w-full rounded-none"
                onClick={handleUpgradeToPro}
                disabled={isRedirecting}
              >
                {isRedirecting ? "Redirecting to Stripe..." : "Pay $9.99"}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
