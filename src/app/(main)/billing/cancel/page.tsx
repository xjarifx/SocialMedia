"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function BillingCancelPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="border border-white/15 bg-white/5 p-8 text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-none bg-[#fce8e6]">
            <X className="h-8 w-8 text-[#d33b27]" />
          </div>
        </div>
        <h1 className="mb-2 text-[24px] font-medium text-white">
          Checkout Cancelled
        </h1>
        <p className="mb-6 text-[15px] text-white/70">
          Your checkout was cancelled. No charges have been made to your
          account.
        </p>
        <div className="flex justify-center gap-3">
          <Button
            variant="secondary"
            onClick={() => router.push("/")}
            className="h-11 rounded-none"
          >
            Back to Home
          </Button>
          <Button
            onClick={() => router.push("/billing")}
            className="h-11 rounded-none"
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}
