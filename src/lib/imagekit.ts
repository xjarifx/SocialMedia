import ImageKit from "@imagekit/nodejs";

const publicKey = process.env.IMAGEKIT_PUBLIC_KEY || "";
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || "";
const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT || "";

const imagekit = new ImageKit({
  publicKey,
  privateKey,
  urlEndpoint,
} as any);

export async function uploadMedia(
  file: File,
): Promise<{ url: string; fileId: string }> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await (imagekit as any).upload({
    file: buffer.toString("base64"),
    fileName: file.name,
    folder: "/social-network/posts",
  });
  return { url: result.url, fileId: result.fileId };
}
