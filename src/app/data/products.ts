// Product data for the equipment and fish section
export interface ProductData {
  id: string;
  name: string;
  price: number;
  image: string;
  category: "equipment" | "fish";
}

export const mockProductsData: ProductData[] = [
  {
    id: "1",
    name: "Mata pancing",
    price: 3000,
    image: "/images/products/mata_pancing.png",
    category: "equipment",
  },
  {
    id: "2",
    name: "Joran Pancing",
    price: 1000000,
    image: "/images/products/joran_pancing.png",
    category: "equipment",
  },
  {
    id: "3",
    name: "Ikan Koi Mas BSD",
    price: 800000,
    image: "/images/products/produk_koi.png",
    category: "fish",
  },
  {
    id: "4",
    name: "Perlengkapan Mancing",
    price: 100000,
    image: "/images/products/perlengkapan_mancing.png",
    category: "equipment",
  },
];

export const productsSection = {
  title: "Peralatan & Ikan Terbaik",
  subtitle: "Temukan berbagai alat memancing berkualitas dan ikan segar siap dibeli. Jelajahi koleksi kami, pilih yang kamu butuhkan.",
};
