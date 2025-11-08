import ProductPageClient from "@/app/components/pages/ProductPageClient";
import { getProductsServer } from "@/services/productService";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Belanja - Pluto Koi",
  description: "Jelajahi koleksi lengkap produk koi terbaik. Temukan ikan koi berkualitas, peralatan akuarium, pakan, dan aksesoris lainnya untuk kolam ikan koi Anda.",
  keywords: "belanja koi, produk koi, ikan koi, akuarium, pakan ikan, aksesoris koi",
  openGraph: {
    title: "Belanja Produk Koi Terbaik - Pluto Koi",
    description: "Temukan berbagai produk koi berkualitas tinggi dengan harga terbaik. Dapatkan ikan koi, peralatan, dan aksesoris untuk kolam impian Anda.",
    type: "website",
  },
};

interface ProductPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ProductPage({ searchParams }: ProductPageProps) {
  // Parse search params
  const page = typeof searchParams.page === "string" ? parseInt(searchParams.page, 10) : 1;
  const limit = typeof searchParams.limit === "string" ? parseInt(searchParams.limit, 10) : 12;
  const search = typeof searchParams.search === "string" ? searchParams.search : undefined;
  const category = typeof searchParams.category === "string" ? searchParams.category : undefined;
  const type = typeof searchParams.type === "string" ? searchParams.type : undefined;

  let initialData = null;

  try {
    // Fetch initial data on server
    initialData = await getProductsServer({
      page,
      limit,
      isActive: true,
      search,
      category,
      type,
    });
  } catch (error) {
    console.error("Failed to fetch products on server:", error);
    // Let client handle the error
  }

  return (
    <div className="min-h-screen bg-white">
      <ProductPageClient initialData={initialData} initialParams={{ page, limit, search, category, type }} />
    </div>
  );
}
