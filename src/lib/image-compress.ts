export type CompressedImage = {
  blob: Blob;
  ext: string;
  origWidth: number;
  origHeight: number;
  width: number;
  height: number;
  originalSize: number;
};

function toBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/**
 * Resizes (never upscales) and converts an image to WebP in the browser.
 * Lowers quality step by step until the file is under maxBytes.
 */
export async function compressToWebp(
  file: File,
  maxWidth: number,
  maxBytes: number,
): Promise<CompressedImage> {
  const bitmap = await createImageBitmap(file);
  const origWidth = bitmap.width;
  const origHeight = bitmap.height;

  const scale = Math.min(1, maxWidth / origWidth);
  const width = Math.round(origWidth * scale);
  const height = Math.round(origHeight * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser could not process this image");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  let blob: Blob | null = null;
  for (const q of [0.85, 0.75, 0.65, 0.5, 0.4]) {
    blob = await toBlob(canvas, "image/webp", q);
    if (blob && blob.size <= maxBytes) break;
  }
  if (!blob) throw new Error("Could not compress this image");

  const ext = blob.type === "image/webp" ? "webp" : blob.type === "image/png" ? "png" : "jpg";
  return { blob, ext, origWidth, origHeight, width, height, originalSize: file.size };
}