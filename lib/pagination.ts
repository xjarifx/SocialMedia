import { AppError } from "@/lib/errors";

function parseIntegerParam(
  value: string | null,
  fallback: number,
  name: string,
  min: number,
): number {
  if (value === null) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed < min) {
    throw new AppError(`${name} must be an integer >= ${min}`, 400);
  }
  return parsed;
}

export function parsePaginationParams(
  searchParams: URLSearchParams,
  defaults: { limit: number; offset: number },
) {
  const limit = parseIntegerParam(searchParams.get("limit"), defaults.limit, "limit", 1);
  const offset = parseIntegerParam(searchParams.get("offset"), defaults.offset, "offset", 0);
  return { limit, offset };
}
