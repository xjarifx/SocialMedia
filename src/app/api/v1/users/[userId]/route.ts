import { NextRequest } from "next/server";
import { getProfile } from "@/services/user.service";
import { successResponse, handleApiError } from "@/lib/errors";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;
    const user = await getProfile(userId);
    return successResponse(user);
  } catch (error) {
    return handleApiError(error);
  }
}
