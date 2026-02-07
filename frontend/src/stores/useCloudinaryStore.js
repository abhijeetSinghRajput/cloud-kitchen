import { create } from "zustand";

export const useCloudinaryStore = create((set, get) => ({
  error: "",
  uploadedUrls: [], // Track multiple uploads
  loading: {
    uploadImage: false,
    deleteImage: false,
  },

  // ✅ Helper to extract public_id from Cloudinary URL
  extractPublicId: (url) => {
    if (!url || typeof url !== "string") return null;
    try {
      // Extract from URL like: https://res.cloudinary.com/demo/image/upload/v1234567890/folder/filename.jpg
      const parts = url.split("/");
      const uploadIndex = parts.findIndex((part) => part === "upload");
      if (uploadIndex === -1) return null;

      // Get everything after version (v1234567890)
      let pathAfterVersion = parts.slice(uploadIndex + 2).join("/");

      // Remove file extension
      const lastDotIndex = pathAfterVersion.lastIndexOf(".");
      if (lastDotIndex > -1) {
        pathAfterVersion = pathAfterVersion.substring(0, lastDotIndex);
      }

      return pathAfterVersion;
    } catch (error) {
      console.error("Error extracting public_id:", error);
      return null;
    }
  },

  // ✅ Set loading state
  setLoading: (type, value) =>
    set((state) => ({
      loading: { ...state.loading, [type]: value },
    })),

  // ✅ Set error
  setError: (error) =>
    set({
      error:
        typeof error === "string" ? error : error?.message || "Unknown error",
    }),

  // ✅ Clear error
  clearError: () => set({ error: "" }),

  // ✅ Upload image - Let Cloudinary generate unique IDs
  uploadImage: async ({ file, folder = "general", transformation }) => {
    const { setLoading, setError, clearError } = get();

    setLoading("uploadImage", true);
    clearError();

    try {
      if (!file) throw new Error("No file provided");

      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error("File size must be less than 10MB");
      }

      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        throw new Error("Only JPEG, PNG, and WebP images are allowed");
      }

      const cloudName = import.meta.env.VITE_CLOUDINARY_NAME;
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_PRESET;

      if (!cloudName || !uploadPreset) {
        throw new Error("Cloudinary configuration missing");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      if (folder) formData.append("folder", folder);
      // ⭐ No publicId - let Cloudinary generate unique names
      if (transformation) formData.append("transformation", transformation);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Cloudinary error:", errorData);
        throw new Error(
          errorData?.error?.message || `HTTP error! status: ${response.status}`,
        );
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message || "Upload failed");
      }

      set((state) => ({
        uploadedUrls: [...state.uploadedUrls, data.secure_url],
      }));

      return {
        url: data.secure_url,
        publicId: data.public_id,
        width: data.width,
        height: data.height,
        format: data.format,
        bytes: data.bytes,
      };
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      setError(error);
      throw error;
    } finally {
      setLoading("uploadImage", false);
    }
  },

  // ✅ Delete old image URL from state (track for cleanup)
  markImageForDeletion: (imageUrl) => {
    set((state) => ({
      uploadedUrls: state.uploadedUrls.filter((url) => url !== imageUrl),
    }));
  },

  // ✅ Delete image (requires backend support)
  deleteImage: async (imageUrl) => {
    const { setLoading, setError, clearError, extractPublicId } = get();

    setLoading("deleteImage", true);
    clearError();

    try {
      if (!imageUrl) throw new Error("No image URL provided");

      const publicId = extractPublicId(imageUrl);
      if (!publicId) throw new Error("Invalid image URL format");

      // This requires a backend endpoint for security
      const response = await fetch("/api/cloudinary/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publicId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to delete image: ${response.status}`,
        );
      }

      const result = await response.json();

      // Remove from uploaded URLs
      set((state) => ({
        uploadedUrls: state.uploadedUrls.filter((url) => url !== imageUrl),
      }));

      return result;
    } catch (error) {
      console.error("Cloudinary delete error:", error);
      setError(error);
      throw error;
    } finally {
      setLoading("deleteImage", false);
    }
  },

  // ✅ Delete image with fallback (for development)
  deleteImageFallback: async (imageUrl) => {
    console.warn(
      "Image deletion skipped - backend endpoint required for production",
    );

    // Remove from local state only (for development)
    set((state) => ({
      uploadedUrls: state.uploadedUrls.filter((url) => url !== imageUrl),
    }));

    return { result: "ok", message: "Removed from local state only" };
  },

  // ✅ Clear all data
  clear: () =>
    set({
      uploadedUrls: [],
      error: "",
      loading: {
        uploadImage: false,
        deleteImage: false,
      },
    }),
}));
