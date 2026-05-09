"use client";
import { useState, useCallback } from "react";
import { postsAPI } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { useDraft } from "@/hooks/useDraft";
import {
  Avatar,
  MediaUpload,
  CharacterCounter,
  VisibilityToggle,
  MediaPreview,
  ErrorMessage,
} from "@/components/common";
import { Button } from "@/components/ui/button";

interface PostComposerProps {
  onPostCreated?: () => void;
  placeholder?: string;
  className?: string;
}

export function PostComposer({
  onPostCreated,
  placeholder = "What's happening?",
  className = "",
}: PostComposerProps) {
  const { user } = useAuth();
  const { draft: composerText, setDraft: setComposerText, clearDraft } = useDraft('post-composer-draft');
  const [composerVisibility, setComposerVisibility] = useState<
    "PUBLIC" | "PRIVATE"
  >("PUBLIC");
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);

  const charLimit = user?.plan === "PRO" ? 100 : 20;
  const charCount = composerText.length;
  const isOverCharLimit = charCount > charLimit;
  const canPost =
    (composerText.trim().length > 0 || Boolean(mediaFile)) &&
    !isPosting &&
    !isOverCharLimit;

  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`;

  const handlePost = useCallback(async () => {
    if (!canPost) return;

    try {
      setIsPosting(true);
      setError(null);
      await postsAPI.create(
        composerText.trim(),
        mediaFile,
        composerVisibility,
      );
      clearDraft();
      setMediaFile(null);
      setComposerVisibility("PUBLIC");
      window.dispatchEvent(new Event("post-created"));
      onPostCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post");
    } finally {
      setIsPosting(false);
    }
  }, [canPost, composerText, composerVisibility, mediaFile, onPostCreated, clearDraft]);

  const toggleVisibility = useCallback(() => {
    setComposerVisibility((prev) => (prev === "PUBLIC" ? "PRIVATE" : "PUBLIC"));
  }, []);

  return (
    <section className={`border-b border-border bg-background px-4 py-3 ${className}`}>
      <div className="flex items-start gap-3">
        <Avatar initials={initials || "U"} size="md" />

        <div className="min-w-0 flex-1">
          <textarea
            value={composerText}
            onChange={(e) => setComposerText(e.target.value)}
            placeholder={placeholder}
            className="h-16 w-full resize-none bg-transparent text-lg leading-6 text-text-primary outline-none placeholder:text-text-muted"
          />

          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-3 text-accent">
              <MediaUpload onFileSelect={setMediaFile} />
              <VisibilityToggle
                visibility={composerVisibility}
                onToggle={toggleVisibility}
              />
            </div>

            <Button
              onClick={handlePost}
              disabled={!canPost}
              className="rounded-full px-4 py-1.5 text-base font-bold"
            >
              {isPosting ? "Posting..." : "Post"}
            </Button>
          </div>

          {mediaFile && (
            <div className="mt-2">
              <MediaPreview file={mediaFile} onRemove={() => setMediaFile(null)} />
            </div>
          )}

          <CharacterCounter
            current={charCount}
            limit={charLimit}
            className="mt-2"
          />

          {error && <ErrorMessage message={error} className="mt-2" />}
        </div>
      </div>
    </section>
  );
}
