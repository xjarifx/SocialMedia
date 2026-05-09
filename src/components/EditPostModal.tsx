"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface EditPostModalProps {
  editingContent: string;
  visibility: "PUBLIC" | "PRIVATE";
  isSaving: boolean;
  onClose: () => void;
  onSave: (content: string) => void;
  onContentChange: (content: string) => void;
  onVisibilityChange: (visibility: "PUBLIC" | "PRIVATE") => void;
}

export function EditPostModal({
  editingContent,
  visibility,
  isSaving,
  onClose,
  onSave,
  onContentChange,
  onVisibilityChange,
}: EditPostModalProps) {
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    if (!editingContent.trim()) {
      setError("Post content cannot be empty");
      return;
    }
    setError(null);
    onSave(editingContent);
  };

  return (
    <Dialog onOpenChange={(open: boolean) => !open && onClose()} open>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit post</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 px-6 pb-2">
          <Textarea
            value={editingContent}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder="What would you like to change?"
            className="min-h-[140px]"
            autoFocus
          />

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={visibility}
              onChange={(event) =>
                onVisibilityChange(event.target.value as "PUBLIC" | "PRIVATE")
              }
              className="h-9 rounded-xl border border-border bg-white px-3 text-[13px] text-text-primary focus:ring-1 focus:ring-accent focus:outline-none"
            >
              <option value="PUBLIC">Public</option>
              <option value="PRIVATE">Private</option>
            </select>
            {visibility === "PRIVATE" && (
              <span className="text-[12px] text-text-secondary">
                Only you can see this post
              </span>
            )}
          </div>

          {error && (
            <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !editingContent.trim()}
          >
            {isSaving ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
