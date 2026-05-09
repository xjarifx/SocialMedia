"use client";

import { useState, useEffect } from "react";
import { TopNav } from "@/components/TopNav";
import { RightSidebar } from "@/components/RightSidebar";
import { MobileNav } from "@/components/MobileNav";
import { PostComposerModal } from "@/components/PostComposerModal";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isPostComposerOpen, setIsPostComposerOpen] = useState(false);
  const [mediaPickerRequestId, setMediaPickerRequestId] = useState(0);

  useEffect(() => {
    const handleOpenComposer = (event: Event) => {
      setIsPostComposerOpen(true);
      const detail = (event as CustomEvent<{ openMediaPicker?: boolean }>).detail;
      if (detail?.openMediaPicker) {
        setMediaPickerRequestId((prev) => prev + 1);
      }
    };
    window.addEventListener("open-post-composer", handleOpenComposer);
    return () => {
      window.removeEventListener("open-post-composer", handleOpenComposer);
    };
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-text-primary">
        <div className="mx-auto flex w-full max-w-[1280px] justify-center">
          <TopNav onOpenPostComposer={() => setIsPostComposerOpen(true)} />
          <div className="min-h-screen min-w-0 flex-1 border-x border-border pt-16 pb-24 lg:max-w-[600px] lg:pt-0 lg:pb-0">
            <main className="w-full">{children}</main>
          </div>
          <RightSidebar />
        </div>
        <PostComposerModal
          open={isPostComposerOpen}
          onOpenChange={setIsPostComposerOpen}
          mediaPickerRequestId={mediaPickerRequestId}
        />
        <MobileNav />
      </div>
    </ProtectedRoute>
  );
}
