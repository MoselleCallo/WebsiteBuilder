import { isImageMimeType, isImageSizeOk } from "@/utils/validation";

export type DataURIResult =
  | { dataUri: string }
  | { error: string };

// Longest edge (px) the stored image is capped to. Smaller images are never upscaled.
const MAX_EDGE = 1200;
// JPEG re-encode quality for non-transparent images.
const JPEG_QUALITY = 0.85;

/** Reads a File as a raw Data URI (no processing). */
function readRawDataURI(file: File): Promise<DataURIResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ dataUri: reader.result as string });
    reader.onerror = () =>
      resolve({ error: "Failed to read the file. Please try again." });
    reader.readAsDataURL(file);
  });
}

/** Loads a Data URI into an HTMLImageElement. */
function loadImage(dataUri: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("image decode failed"));
    img.src = dataUri;
  });
}

/**
 * Downscales a raw image Data URI so its longest edge is <= MAX_EDGE, then
 * re-encodes it. PNGs stay PNG (preserves transparency); everything else
 * (JPEG/WebP) is re-encoded to JPEG at JPEG_QUALITY.
 *
 * Falls back to the original Data URI if any step fails (canvas unsupported,
 * decode error, etc.) so an upload never hard-fails on processing.
 */
async function downscaleDataURI(
  rawDataUri: string,
  mimeType: string
): Promise<string> {
  try {
    const img = await loadImage(rawDataUri);
    const { naturalWidth: w, naturalHeight: h } = img;

    if (!w || !h) return rawDataUri;

    const scale = Math.min(1, MAX_EDGE / Math.max(w, h));
    const targetW = Math.round(w * scale);
    const targetH = Math.round(h * scale);

    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;

    const ctx = canvas.getContext("2d");
    if (!ctx) return rawDataUri;

    ctx.drawImage(img, 0, 0, targetW, targetH);

    // Preserve transparency for PNG; otherwise use JPEG for smaller output.
    const isPng = mimeType === "image/png";
    const outType = isPng ? "image/png" : "image/jpeg";
    const encoded = isPng
      ? canvas.toDataURL(outType)
      : canvas.toDataURL(outType, JPEG_QUALITY);

    // Guard against environments where toDataURL returns an empty/odd value.
    if (!encoded || !encoded.startsWith("data:image/")) return rawDataUri;

    return encoded;
  } catch {
    return rawDataUri;
  }
}

/**
 * Reads a File as a base64 Data URI.
 * Validates MIME type and file size before reading, then downscales raster
 * images to keep the stored string small. SVGs are passed through untouched.
 * Returns { dataUri } on success or { error } on failure.
 */
export async function readFileAsDataURI(file: File): Promise<DataURIResult> {
  if (!isImageMimeType(file.type)) {
    return {
      error:
        "Unsupported file type. Please upload a JPEG, PNG, GIF, WebP, or SVG image.",
    };
  }

  if (!isImageSizeOk(file.size)) {
    return {
      error: "Image exceeds the 5 MB size limit. Please choose a smaller file.",
    };
  }

  const raw = await readRawDataURI(file);
  if ("error" in raw) return raw;

  // SVG is vector — rasterizing would degrade it. Store as-is.
  if (file.type === "image/svg+xml") return raw;

  const processed = await downscaleDataURI(raw.dataUri, file.type);
  return { dataUri: processed };
}
