"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { usersAPI, type User } from "@/lib/services/api";
import { useAuth } from "@/lib/context/AuthContext";
import { Search } from "lucide-react";
import {
  LoadingSkeleton,
  UserCard,
  ErrorMessage,
} from "@/components";

export default function SearchPage() {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [searchInput, setSearchInput] = useState(query);
  const limit = 20;

  useEffect(() => {
    setSearchInput(query);
    setOffset(0);
  }, [query]);

  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
        setResults([]);
        setTotal(0);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const response = await usersAPI.search(query, limit, offset);
        setResults(response.results);
        setTotal(response.total);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to search users";
        setError(message);
        console.error("Search error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [query, offset]);

  const handleLoadMore = () => {
    setOffset((prev) => prev + limit);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextQuery = searchInput.trim();
    setOffset(0);
    if (!nextQuery) {
      router.replace("/search");
      return;
    }
    router.push(`/search?q=${encodeURIComponent(nextQuery)}`);
  };

  return (
    <div>
      <div className="border-b border-border bg-background px-4 pb-4 pt-3">
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center gap-3 rounded-full border border-border bg-surface px-4 py-3 transition-all duration-200 focus-within:border-accent focus-within:shadow-lg"
        >
          <Search className="h-5 w-5 text-accent transition-colors" />
          <input
            type="text"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search users"
            className="w-full bg-transparent text-base text-text-primary outline-none placeholder:text-text-secondary"
          />
        </form>
      </div>

      {error && <ErrorMessage message={error} />}

      {!query.trim() ? (
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-accent/10">
              <Search className="h-12 w-12 text-accent" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-text-primary">
              Search for people
            </h2>
            <p className="text-base text-text-secondary">
              Enter a search query to find users
            </p>
          </div>
        </div>
      ) : isLoading && results.length === 0 ? (
        <LoadingSkeleton variant="user" count={4} />
      ) : results.length === 0 ? (
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-text-secondary/10">
              <Search className="h-12 w-12 text-text-secondary" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-text-primary">
              No results
            </h2>
            <p className="text-base text-text-secondary">
              No users found matching "{query}"
            </p>
          </div>
        </div>
      ) : (
        <>
          <div>
            {results.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                currentUserId={currentUser?.id}
                action={{
                  label: "View",
                  onClick: () => router.push(`/users/${user.id}`),
                  variant: "outline",
                }}
              />
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-surface/50 p-4">
            <p className="text-sm text-text-secondary">
              Showing {results.length} of {total} results
            </p>
            {offset + limit < total && (
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-accent-hover disabled:opacity-50"
              >
                {isLoading ? "Loading..." : "Load more"}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
