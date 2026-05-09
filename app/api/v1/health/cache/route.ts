import { successResponse, handleApiError } from "@/lib/errors";
import { cache } from "@/lib/cache";

export async function GET() {
  try {
    await cache.set("health-check", "ok", 5000);
    const result = await cache.get("health-check");
    return successResponse({
      status: result === "ok" ? "healthy" : "unhealthy",
      cacheEnabled: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
