import { getProductsServer } from "@/services/productService";
import ProductSectionClient from "./ProductSectionClient";

interface ProductSectionProps {
  initialData?: any;
}

export default async function ProductSection({ initialData }: ProductSectionProps) {
  let serverData = initialData;

  // If no initial data provided, fetch on server
  if (!serverData) {
    try {
      serverData = await getProductsServer({
        page: 1,
        limit: 8,
        isActive: true,
      });
    } catch (error) {
      console.error("Failed to fetch products on server:", error);
      // Fall back to client-side rendering
      serverData = null;
    }
  }

  // Use client-side rendering for better interactivity
  return <ProductSectionClient />;
}
