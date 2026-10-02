import { isImageMimeType, isImageSizeOk } from "@/utils/validation";

export type DataURIResult =
  | { dataUri: string }
  | { error: string };

/**
 * Reads a File as a base64 Data URI.
 * Validates MIME type and file size before reading.
 * Returns { dataUri } on success or { error } on failure.
 */
export function readFileAsDataURI(file: File): Promise<DataURIResult> {
  if (!isImageMimeType(file.type)) {
    return Promise.resolve({
      error: "Unsupported file type. Please upload a JPEG, PNG, GIF, WebP, or SVG image.",
    });
  }

  if (!isImageSizeOk(file.size)) {
    return Promise.resolve({
      error: "Image exceeds the 5 MB size limit. Please choose a smaller file.",
    });
  }

  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve({ dataUri: reader.result as string });
    };

    reader.onerror = () => {
      resolve({ error: "Failed to read the file. Please try again." });
    };

    reader.readAsDataURL(file);
  });
}
