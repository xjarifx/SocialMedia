"use client";
import { useState } from "react";
import type { FormEvent } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const demoTrends = [
  { category: "Technology · Trending", title: "AI tools for creators", posts: "12.5K" },
  { category: "Lifestyle · Trending", title: "Weekend travel ideas", posts: "8.2K" },
  { category: "Science · Trending", title: "New space telescope images", posts: "15.3K" },
  { category: "Culture · Trending", title: "Top movies this month", posts: "9.7K" },
];

export function RightSidebar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <aside className="sticky top-0 hidden w-[350px] shrink-0 space-y-4 self-start py-1 xl:block">
      {/* Search Bar */}
      <div className="px-4">
        <form
          onSubmit={handleSubmit}
          className="group flex items-center gap-4 rounded-full border-2 border-border bg-surface-hover px-4 py-3 transition-all duration-150 hover:border-border-hover focus-within:border-accent"
        >
          <Search className="h-5 w-5 text-text-secondary" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
            className="w-full bg-transparent text-base text-text-primary outline-none placeholder:text-text-secondary"
          />
        </form>
      </div>

      {/* Subscribe to Premium Card */}
      <section className="mx-4 overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="p-4">
          <h3 className="mb-1 text-xl font-extrabold text-text-primary">
            Subscribe to Premium
          </h3>
          <p className="mb-3 text-sm text-text-primary">
            Subscribe to unlock new features and if eligible, receive a share of ads revenue.
          </p>
          <Button
            onClick={() => router.push("/billing")}
            className="rounded-full px-4 py-2 text-base font-bold"
          >
            Subscribe
          </Button>
        </div>
      </section>

      {/* What's Happening Card */}
      <section className="mx-4 overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="px-4 py-3">
          <h3 className="text-xl font-extrabold text-text-primary">
            What's happening
          </h3>
        </div>
        <div>
          {demoTrends.map((trend, index) => (
            <button
              key={index}
              className="block w-full cursor-pointer px-4 py-3 text-left transition-colors duration-200 hover:bg-surface-hover"
            >
              <div className="text-xs text-text-secondary">
                {trend.category}
              </div>
              <div className="mt-0.5 text-base font-bold text-text-primary">
                {trend.title}
              </div>
              <div className="mt-0.5 text-xs text-text-secondary">
                {trend.posts} posts
              </div>
            </button>
          ))}
        </div>
        <button className="block w-full cursor-pointer px-4 py-3 text-left text-base text-accent transition-colors duration-200 hover:bg-surface-hover">
          Show more
        </button>
      </section>

      {/* Footer Links */}
      <div className="px-4 py-2">
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-text-secondary">
          <span className="cursor-default">Terms of Service</span>
          <span className="cursor-default">Privacy Policy</span>
          <span className="cursor-default">Cookie Policy</span>
          <span className="cursor-default">Accessibility</span>
          <span className="cursor-default">Ads info</span>
          <span className="cursor-default">More</span>
          <span>© 2026 Social Network</span>
        </div>
      </div>
    </aside>
  );
}
