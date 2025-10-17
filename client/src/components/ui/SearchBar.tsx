import { useState } from "react";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  value?: string;
  onChange?: (value: string) => void;
}

export default function SearchBar({
  placeholder = "Search...",
  onSearch,
  value: controlledValue,
  onChange,
}: SearchBarProps) {
  const [internalQuery, setInternalQuery] = useState("");

  // Use controlled value if provided, otherwise use internal state
  const query = controlledValue !== undefined ? controlledValue : internalQuery;
  const setQuery = onChange || setInternalQuery;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    // Call onSearch on every keystroke for live search
    onSearch?.(newValue);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-neutral-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          className="block w-full pl-12 pr-4 py-3 border border-neutral-900 rounded-full bg-neutral-900 text-white placeholder-neutral-500 focus:outline-none focus:bg-black focus:border-neutral-700 transition-colors text-[15px]"
          placeholder={placeholder}
        />
      </div>
    </form>
  );
}
