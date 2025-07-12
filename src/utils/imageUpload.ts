import supabase from "@/config/supabaseClient";
import compress from "compressorjs";

export interface ImageUploadOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: "webp" | "jpeg" | "png";
  bucket?: string;
  userId: string;
  filename?: string;
}

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  error?: string;
  path?: string;
}

/**
 * Compresses an image using compressorjs
 */
export const compressImage = async (
  file: Blob,
  options: { maxWidth?: number; maxHeight?: number; quality?: number } = {}
): Promise<Blob> => {
  const { maxWidth = 1024, maxHeight = 1024, quality = 0.8 } = options;

  return new Promise((resolve, reject) => {
    new compress(file, {
      maxWidth,
      maxHeight,
      quality,
      success(result) {
        resolve(result);
      },
      error(error) {
        reject(error);
      },
    });
  });
};

/**
 * Converts an image to a specific format (WebP, JPEG, PNG)
 */
export const convertImageFormat = async (
  file: Blob,
  format: "webp" | "jpeg" | "png" = "webp"
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = URL.createObjectURL(file);

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(image, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to convert image format"));
        }
      }, `image/${format}`);
    };

    image.onerror = reject;
  });
};

/**
 * Uploads an image to Supabase storage
 */
export const uploadToStorage = async (
  file: Blob,
  userId: string,
  bucket: string,
  filename?: string
): Promise<{ data: any; error: any }> => {
  const timestamp = Date.now();
  const finalFilename = filename || `${userId}_${timestamp}.webp`;
  const filePath = `${userId}/${finalFilename}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      contentType: "image/webp",
      upsert: false,
    });

  return { data, error };
};

/**
 * Generates a CDN URL for an uploaded image
 */
export const generateCDNUrl = (bucket: string, path: string): string => {
  return `${
    import.meta.env.VITE_REACT_APP_SUPABASE_URL
  }/storage/v1/object/public/${bucket}/${path}`;
};

/**
 * Complete image upload pipeline: compress, convert, and upload
 */
export const uploadImage = async (
  file: Blob,
  options: ImageUploadOptions
): Promise<ImageUploadResult> => {
  try {
    const {
      maxWidth = 1024,
      maxHeight = 1024,
      quality = 0.8,
      format = "webp",
      bucket = "cover_images",
      userId,
      filename,
    } = options;

    // Step 1: Compress the image
    const compressedFile = await compressImage(file, {
      maxWidth,
      maxHeight,
      quality,
    });

    // Step 2: Convert to desired format
    const convertedFile = await convertImageFormat(compressedFile, format);

    // Step 3: Upload to storage
    const { data, error } = await uploadToStorage(
      convertedFile,
      userId,
      bucket,
      filename
    );

    if (error) {
      return {
        success: false,
        error: error.message || "Failed to upload image",
      };
    }

    // Step 4: Generate CDN URL
    const url = generateCDNUrl(bucket, data.path);

    return {
      success: true,
      url,
      path: data.path,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Upload image with default settings for artist images
 */
export const uploadArtistImage = async (
  file: Blob,
  userId: string
): Promise<ImageUploadResult> => {
  return uploadImage(file, {
    userId,
    bucket: "artist-images",
    maxWidth: 1024,
    maxHeight: 1024,
    quality: 0.8,
    format: "webp",
  });
};

/**
 * Upload image with default settings for cover images
 */
export const uploadCoverImage = async (
  file: Blob,
  userId: string,
  postId: string
): Promise<ImageUploadResult> => {
  return uploadImage(file, {
    userId,
    bucket: "cover_images",
    filename: postId,
    maxWidth: 1024,
    maxHeight: 1024,
    quality: 0.8,
    format: "webp",
  });
};

/**
 * Delete an image from storage
 */
export const deleteImage = async (
  bucket: string,
  path: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
