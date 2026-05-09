"use client";
import { useEffect, useRef, useState } from "react";
import { Image } from "lucide-react";
import { toast } from "sonner";
import { postsAPI } from "@/services/api";
import { useAuth } from "@/context/auth-context";
import { useDraft } from "@/hooks/useDraft";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface PostComposerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mediaPickerRequestId?: number;
}

export function PostComposerModal({
  open,
  onOpenChange,
  mediaPickerRequestId,
}: PostComposerModalProps) {
  const { user } = useAuth();
  const { draft: content, setDraft: setContent, clearDraft } = useDraft('post-modal-draft');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const maxUploadBytes = 50 * 1024 * 1024;
  const charLimit = user?.plan === "PRO" ? 100 : 20;
  const currentLength = content.length;
  const remainingChars = charLimit - currentLength;
  const isOverLimit = currentLength > charLimit;
  const isNearLimit = remainingChars <= 10 && remainingChars > 0;
  const progressPercent = Math.min((currentLength / charLimit) * 100, 100);

  let countColor = "text-text-secondary";
  let progressColor = "bg-blue-500";
  if (isOverLimit) {
    countColor = "text-red-500";
    progressColor = "bg-red-500";
  } else if (isNearLimit) {
    countColor = "text-yellow-500";
    progressColor = "bg-yellow-500";
  }

  useEffect(() => {
    return () => {
      if (mediaPreviewUrl) {
        URL.revokeObjectURL(mediaPreviewUrl);
      }
    };
  }, [mediaPreviewUrl]);

  useEffect(() => {
    if (!open) {
      // Don't clear draft when closing - only clear on successful submit
      setMediaFile(null);
      setMediaPreviewUrl(null);
      setVisibility("PUBLIC");
      setError(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [open]);

  useEffect(() => {
    if (!open || !mediaPickerRequestId) return;
    const timer = window.setTimeout(() => {
      fileInputRef.current?.click();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [open, mediaPickerRequestId]);

  const handleMediaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (!file) {
      setMediaFile(null);
      setMediaPreviewUrl(null);
      return;
    }
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      setError("Please select an image or video file");
      event.target.value = "";
      return;
    }
    if (file.size > maxUploadBytes) {
      setError("File size exceeds 50 MB limit");
      event.target.value = "";
      return;
    }
    setError(null);
    setMediaFile(file);
    setMediaPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveMedia = () => {
    setMediaFile(null);
    setMediaPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if ((!content.trim() && !mediaFile) || isSubmitting || isOverLimit) return;
    try {
      setIsSubmitting(true);
      setError(null);
      await postsAPI.create(content.trim(), mediaFile, visibility);
      toast.success("Post created successfully!");
      clearDraft();
      onOpenChange(false);
      window.dispatchEvent(new Event("post-created"));
    } catch (err) {
      console.error("Failed to create post:", err);
      setError(err instanceof Error ? err.message : "Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = Boolean(content.trim() || mediaFile);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-border bg-background text-text-primary">
        <DialogHeader>
          <DialogTitle>Create post</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 px-6 pb-6">
          <Textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="What's on your mind?"
            className={`min-h-36 resize-none ${isOverLimit ? "focus:border-danger" : ""}`}
            autoFocus
          />

          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <select
                value={visibility}
                onChange={(event) =>
                  setVisibility(event.target.value as "PUBLIC" | "PRIVATE")
                }
                className="h-10 min-w-27.5 rounded-lg border-2 border-border bg-surface-hover px-3 text-sm text-text-primary transition-all duration-150 hover:border-border-hover focus:border-accent focus:outline-none"
              >
                <option value="PUBLIC">Public</option>
                <option value="PRIVATE">Private</option>
              </select>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-10 shrink-0 items-center gap-2 rounded-lg border-2 border-border bg-surface-hover px-4 text-sm text-text-primary transition-all duration-150 hover:border-border-hover hover:bg-surface"
                aria-label="Upload media"
                title="Upload media"
              >
                <Image className="h-4 w-4" />
                <span>Media</span>
              </button>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleMediaChange}
                ref={fileInputRef}
                className="hidden"
              />
            </div>
            {visibility === "PRIVATE" && (
              <p className="mt-2 text-xs text-text-muted">
                Only you can see this post
              </p>
            )}
          </div>

          {mediaPreviewUrl && (
            <div className="rounded-xl border-2 border-border bg-surface p-3">
              {mediaFile?.type.startsWith("video/") ? (
                <video
                  src={mediaPreviewUrl}
                  controls
                  className="max-h-80 w-full rounded-lg"
                />
              ) : (
                <img
                  src={mediaPreviewUrl}
                  alt="Selected"
                  className="max-h-80 w-full rounded-lg object-contain"
                />
              )}
              <div className="mt-3 flex items-center justify-between text-sm text-text-secondary">
                <span>{mediaFile?.name}</span>
                <button
                  type="button"
                  onClick={handleRemoveMedia}
                  className="rounded-lg px-3 py-1 text-accent transition-colors duration-150 hover:bg-surface-hover"
                >
                  Remove media
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
              <div
                className={`h-full transition-[width,background-color] duration-150 ease-out ${progressColor}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className={`text-sm transition-colors duration-150 ${countColor}`}>
              {currentLength}/{charLimit} characters
              {isOverLimit && (
                <span className="ml-2 font-medium">
                  ({Math.abs(remainingChars)} over limit)
                </span>
              )}
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-3">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting || isOverLimit}
              title={
                isOverLimit
                  ? `Post exceeds ${charLimit} character limit`
                  : "Post"
              }
            >
              {isSubmitting ? "Posting..." : "Post"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
