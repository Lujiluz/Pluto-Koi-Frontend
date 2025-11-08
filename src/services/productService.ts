import AxiosInstance from "@/utils/axiosInstance";
import { ProductApiResponse } from "@/lib/types";

// Base product API endpoints
const PRODUCT_ENDPOINTS = {
  GET_ALL: "/product",
} as const;

// Product query parameters interface
export interface ProductQueryParams {
  page?: number;
  limit?: number;
  isActive?: boolean;
  search?: string;
  category?: string;
  type?: string; // "Produk" or "Koi Store"
}

// Client-side product service (using axios with auth)
export const getProductsClient = async (params: ProductQueryParams = {}): Promise<ProductApiResponse> => {
  try {
    const queryParams = new URLSearchParams();

    // Add pagination parameters with defaults
    queryParams.append("page", (params.page || 1).toString());
    queryParams.append("limit", (params.limit || 10).toString());

    // Add optional filters
    if (params.isActive !== undefined) queryParams.append("isActive", params.isActive.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.category) queryParams.append("category", params.category);
    if (params.type) queryParams.append("type", params.type);

    const response = await AxiosInstance.get(`${PRODUCT_ENDPOINTS.GET_ALL}?${queryParams.toString()}`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching products:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch products");
  }
};

// Server-side product service (for SSR/SSG)
export const getProductsServer = async (params: ProductQueryParams = {}): Promise<ProductApiResponse> => {
  try {
    const baseUrl = process.env.BACKEND_BASE_URL || "http://localhost:1728";

    const queryParams = new URLSearchParams();

    // Add pagination parameters with defaults
    queryParams.append("page", (params.page || 1).toString());
    queryParams.append("limit", (params.limit || 10).toString());

    // Add optional filters
    if (params.isActive !== undefined) queryParams.append("isActive", params.isActive.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.category) queryParams.append("category", params.category);
    if (params.type) queryParams.append("type", params.type);

    const response = await fetch(`${baseUrl}${PRODUCT_ENDPOINTS.GET_ALL}?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // For server-side rendering, we can add cache control
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ProductApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching products on server:", error);
    throw error;
  }
};

// Helper function to get product by ID (if needed)
export const getProductById = async (id: string): Promise<any> => {
  try {
    const response = await AxiosInstance.get(`${PRODUCT_ENDPOINTS.GET_ALL}/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching product ${id}:`, error);
    throw new Error(error.response?.data?.message || "Failed to fetch product");
  }
};

// Helper function to format product price
export const formatProductPrice = (price: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

// Helper function to get price range text
export const getPriceRangeText = (min: number, max: number): string => {
  if (min === max) {
    return formatProductPrice(min);
  }
  return `${formatProductPrice(min)} - ${formatProductPrice(max)}`;
};

// Helper function to get first media URL for preview
export const getPreviewMediaUrl = (product: any): string => {
  if (product.media && product.media.length > 0) {
    return product.media[0].fileUrl;
  }
  return "/images/products/produk_koi.png"; // fallback image
};

// Helper function to categorize product by price range
export const getProductPriceCategory = (price: number): string => {
  if (price < 500000) {
    return "budget";
  } else if (price < 2000000) {
    return "mid-range";
  } else {
    return "premium";
  }
};
