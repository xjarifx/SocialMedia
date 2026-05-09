"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import { usersAPI } from "@/services/api";
import type { User } from "@/services/api";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageTransition } from "@/components/common";

export default function EditProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<User | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const current = await usersAPI.getCurrentProfile();
        setProfile(current);
        setFirstName(current.firstName || "");
        setLastName(current.lastName || "");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      const updated = await usersAPI.updateProfile({ firstName, lastName });
      setProfile(updated);
      toast.success("Profile updated successfully!");
      router.push("/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = 
    firstName !== (profile?.firstName || "") || 
    lastName !== (profile?.lastName || "");

  return (
    <PageTransition>
      <div className="flex h-[53px] items-center border-b border-border bg-background px-4">
        <button
          onClick={() => router.push("/profile")}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-text-primary transition-colors duration-200 hover:bg-surface-hover"
          title="Back"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>

      <div className="mx-auto max-w-2xl p-4">
        {/* Profile Preview */}
        <div className="mb-6 rounded-2xl border border-border bg-surface p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-accent bg-accent text-2xl font-semibold text-white">
              {firstName?.[0] || user?.firstName?.[0]}
              {lastName?.[0] || user?.lastName?.[0]}
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary">
                {firstName || profile?.firstName} {lastName || profile?.lastName}
              </h2>
              <p className="text-sm text-text-secondary">@{profile?.username}</p>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="space-y-6">
          {error && (
            <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="rounded-2xl border border-border bg-surface p-6">
              <p className="text-sm text-text-secondary">Loading profile...</p>
            </div>
          ) : (
            <>
              {/* Read-only fields */}
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-primary">
                    Username
                  </label>
                  <Input
                    value={profile?.username ?? ""}
                    disabled
                    className="bg-surface/50 text-text-muted cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-text-muted">Username cannot be changed</p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-text-primary">
                    Email
                  </label>
                  <Input
                    value={profile?.email ?? ""}
                    disabled
                    className="bg-surface/50 text-text-muted cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-text-muted">Email cannot be changed</p>
                </div>
              </div>

              {/* Editable fields */}
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-primary">
                    First name
                  </label>
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                    className="bg-surface border-border"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-text-primary">
                    Last name
                  </label>
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter your last name"
                    className="bg-surface border-border"
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => router.push("/profile")}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving || !hasChanges}
                  className="flex-1"
                >
                  {isSaving ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
