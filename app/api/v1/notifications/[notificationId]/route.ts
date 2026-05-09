import { NextRequest } from "next/server";
import { z } from "zod";
import { authenticateRequest } from "@/lib/auth";
import { getNotification, updateNotification, deleteNotification } from "@/lib/services/notifications.service";
import { successResponse, handleApiError, AppError } from "@/lib/errors";

const updateNotificationSchema = z.object({
  read: z.boolean(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ notificationId: string }> },
) {
  try {
    const { userId } = authenticateRequest(request);
    const { notificationId } = await params;
    const notification = await getNotification(notificationId, userId);
    return successResponse(notification);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ notificationId: string }> },
) {
  try {
    const { userId } = authenticateRequest(request);
    const { notificationId } = await params;
    const body = await request.json();
    const parsed = updateNotificationSchema.parse(body);
    const notification = await updateNotification(notificationId, userId, parsed);
    return successResponse(notification);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleApiError(new AppError(error.issues[0].message));
    }
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ notificationId: string }> },
) {
  try {
    const { userId } = authenticateRequest(request);
    const { notificationId } = await params;
    await deleteNotification(notificationId, userId);
    return successResponse({ message: "Notification deleted" });
  } catch (error) {
    return handleApiError(error);
  }
}
