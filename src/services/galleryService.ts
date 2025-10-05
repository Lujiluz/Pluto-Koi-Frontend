import AxiosInstance from "@/utils/axiosInstance";
import { GalleryApiResponse } from "@/lib/types";

// Base gallery API endpoints
const GALLERY_ENDPOINTS = {
  GET_ALL: "/gallery",
} as const;

// Gallery query parameters interface
export interface GalleryQueryParams {
  page?: number;
  limit?: number;
  owner?: string;
  isActive?: boolean;
}

// Client-side gallery service (using axios with auth)
export const getGalleriesClient = async (params: GalleryQueryParams = {}): Promise<GalleryApiResponse> => {
  try {
    const queryParams = new URLSearchParams();

    // Add pagination parameters with defaults
    queryParams.append("page", (params.page || 1).toString());
    queryParams.append("limit", (params.limit || 10).toString());

    // Add optional filters
    if (params.owner) queryParams.append("owner", params.owner);
    if (params.isActive !== undefined) queryParams.append("isActive", params.isActive.toString());

    const response = await AxiosInstance.get(`${GALLERY_ENDPOINTS.GET_ALL}?${queryParams.toString()}`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching galleries:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch galleries");
  }
};

// Server-side gallery service (for SSG/SSR)
export const getGalleriesServer = async (params: GalleryQueryParams = {}): Promise<GalleryApiResponse> => {
  try {
    const baseUrl = process.env.BACKEND_BASE_URL || "http://localhost:1728";

    const queryParams = new URLSearchParams();

    // Add pagination parameters with defaults
    queryParams.append("page", (params.page || 1).toString());
    queryParams.append("limit", (params.limit || 10).toString());

    // Add optional filters
    if (params.owner) queryParams.append("owner", params.owner);
    if (params.isActive !== undefined) queryParams.append("isActive", params.isActive.toString());

    const response = await fetch(`${baseUrl}${GALLERY_ENDPOINTS.GET_ALL}?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // For SSG, we can add cache control and revalidation
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });

    console.log("response: ", response);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: GalleryApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching galleries on server:", error);
    throw error;
  }
};

// Helper function to get gallery by ID (if needed)
export const getGalleryById = async (id: string): Promise<any> => {
  try {
    const response = await AxiosInstance.get(`${GALLERY_ENDPOINTS.GET_ALL}/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching gallery ${id}:`, error);
    throw new Error(error.response?.data?.message || "Failed to fetch gallery");
  }
};

// Helper function to format gallery owner display
export const formatOwnerName = (owner: string): string => {
  return owner
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

// Helper function to get total media count for a gallery
export const getTotalMediaCount = (gallery: any): number => {
  return gallery.media ? gallery.media.length : 0;
};

// Helper function to get first media URL for preview
export const getPreviewMediaUrl = (gallery: any): string => {
  if (gallery.media && gallery.media.length > 0) {
    return gallery.media[0].fileUrl;
  }
  return "/images/koi/contoh_ikan.png"; // fallback image
};
