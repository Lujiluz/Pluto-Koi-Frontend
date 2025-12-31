import ProductPageClient from "@/app/components/pages/ProductPageClient";
import { keywords } from "@/lib/constants";
import { getProductsServer } from "@/services/productService";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Belanja - Pluto Koi",
  description: "Jelajahi koleksi lengkap produk koi terbaik. Temukan ikan koi berkualitas, peralatan akuarium, pakan, dan aksesoris lainnya untuk kolam ikan koi Anda.",
  keywords: keywords,
  openGraph: {
    title: "Belanja Produk Koi Terbaik - Pluto Koi",
    description: "Temukan berbagai produk koi berkualitas tinggi dengan harga terbaik. Dapatkan ikan koi, peralatan, dan aksesoris untuk kolam impian Anda.",
    type: "website",
    images: [
      {
        url: "/images/about/og-about.jpg",
        width: 1200,
        height: 630,
        alt: "Pluto Koi Centre",
      },
    ],
  },
};

// JSON-LD structured data for better SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Pluto Koi Centre",
  description: "Spesialis Koi Shiro Utsuri berkualitas sejak 2014, menyediakan ikan koi terbaik dengan passion dan dedikasi tinggi.",
  foundingDate: "2014",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://plutokoi.com",
  logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://plutokoi.com"}/images/LOGO PLUTO-02.png`,
  address: {
    "@type": "PostalAddress",
    addressCountry: "ID",
  },
  sameAs: ["https://www.instagram.com/pluto_koi_centre", "https://youtube.com/@plutokarpio1984", "https://www.tiktok.com/@plutokarpio"],
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
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-white">
        <ProductPageClient initialData={initialData} initialParams={{ page, limit, search, category, type }} />
      </div>
    </>
  );
}
