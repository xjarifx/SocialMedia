import ImageKit from "@imagekit/nodejs";
import { requireEnv } from "@/lib/env";

const privateKey = requireEnv("IMAGEKIT_PRIVATE_KEY");
requireEnv("IMAGEKIT_PUBLIC_KEY");
requireEnv("IMAGEKIT_URL_ENDPOINT");

const imagekit = new ImageKit({
  privateKey,
});

export async function uploadMedia(
  file: File,
): Promise<{ url: string; fileId: string }> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await imagekit.files.upload({
    file: buffer.toString("base64"),
    fileName: file.name,
    folder: "/better-media/posts",
  });
  if (!result.url || !result.fileId) {
    throw new Error("ImageKit upload failed: missing url or fileId");
  }
  return { url: result.url, fileId: result.fileId };
}
