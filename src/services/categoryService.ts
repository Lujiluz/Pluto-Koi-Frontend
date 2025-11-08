import AxiosInstance from "@/utils/axiosInstance";
import { CategoryApiResponse } from "@/lib/types";

// Base category API endpoints
const CATEGORY_ENDPOINTS = {
  GET_ALL: "/categories",
} as const;

// Category query parameters interface
export interface CategoryQueryParams {
  page?: number;
  limit?: number;
  isActive?: boolean;
  search?: string;
}

// Client-side category service (using axios with auth)
export const getCategoriesClient = async (params: CategoryQueryParams = {}): Promise<CategoryApiResponse> => {
  try {
    const queryParams = new URLSearchParams();

    // Add pagination parameters with defaults
    queryParams.append("page", (params.page || 1).toString());
    queryParams.append("limit", (params.limit || 50).toString()); // Get more categories by default

    // Add optional filters
    if (params.isActive !== undefined) queryParams.append("isActive", params.isActive.toString());
    if (params.search) queryParams.append("search", params.search);

    const response = await AxiosInstance.get(`${CATEGORY_ENDPOINTS.GET_ALL}?${queryParams.toString()}`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch categories");
  }
};

// Server-side category service (for SSR/SSG)
export const getCategoriesServer = async (params: CategoryQueryParams = {}): Promise<CategoryApiResponse> => {
  try {
    const baseUrl = process.env.BACKEND_BASE_URL || "http://localhost:1728";

    const queryParams = new URLSearchParams();

    // Add pagination parameters with defaults
    queryParams.append("page", (params.page || 1).toString());
    queryParams.append("limit", (params.limit || 50).toString());

    // Add optional filters
    if (params.isActive !== undefined) queryParams.append("isActive", params.isActive.toString());
    if (params.search) queryParams.append("search", params.search);

    const response = await fetch(`${baseUrl}${CATEGORY_ENDPOINTS.GET_ALL}?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // For server-side rendering, we can add cache control
      next: { revalidate: 300 }, // Revalidate every 5 minutes (categories don't change often)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CategoryApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching categories on server:", error);
    throw error;
  }
};

// Helper function to format categories for dropdown/filter use
export const formatCategoriesForFilter = (categories: any[] = []) => {
  const formattedCategories = [
    { id: "", name: "Semua Kategori", count: 0, description: undefined },
    ...categories.map((category) => ({
      id: category._id,
      name: category.name,
      count: 0, // Product count can be added if needed
      description: category.description,
      isActive: category.isActive,
    })),
  ];

  return formattedCategories;
};

// Helper function to get category by ID
export const getCategoryById = async (id: string): Promise<any> => {
  try {
    const response = await AxiosInstance.get(`${CATEGORY_ENDPOINTS.GET_ALL}/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching category ${id}:`, error);
    throw new Error(error.response?.data?.message || "Failed to fetch category");
  }
};
