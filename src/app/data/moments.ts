// Mock data for moments and memories gallery
export interface MomentData {
  id: string;
  title: string;
  image: string;
  owner: string;
  location: string;
  handling: string;
  date: string;
  description?: string;
  tags?: string[];
}

export const mockMomentsData: MomentData[] = [
  {
    id: "1",
    title: "Ikan Koin",
    image: "/images/moments/bento_image_1.png",
    owner: "Paul Sihotang",
    location: "Tangsel",
    handling: "Pluto Koi Center",
    date: "2024-09-15",
    description: "Koleksi koi premium dengan kualitas terbaik",
    tags: ["champion", "premium", "red-white"],
  },
  {
    id: "2",
    title: "Ikan Koin",
    image: "/images/moments/bento_image_2.png",
    owner: "Paul Sihotang",
    location: "Tangsel",
    handling: "Pluto Koi Center",
    date: "2024-09-10",
    description: "Moment indah koi berenang di kolam alami",
    tags: ["natural", "swimming", "orange-white"],
  },
  {
    id: "3",
    title: "Ikan Koin",
    image: "/images/moments/bento_image_1.png",
    owner: "Paul Sihotang",
    location: "Tangsel",
    handling: "Pluto Koi Center",
    date: "2024-09-12",
    description: "Koi dengan pola warna yang menakjubkan",
    tags: ["pattern", "colorful", "showcase"],
  },
  {
    id: "4",
    title: "Ikan Koin",
    image: "/images/moments/bento_image_2.png",
    owner: "Paul Sihotang",
    location: "Tangsel",
    handling: "Pluto Koi Center",
    date: "2024-09-08",
    description: "Koleksi pribadi dengan kualitas unggulan",
    tags: ["collection", "premium", "personal"],
  },
  {
    id: "5",
    title: "Ikan Koin",
    image: "/images/moments/bento_image_1.png",
    owner: "Maria Santoso",
    location: "Jakarta",
    handling: "Pluto Koi Center",
    date: "2024-09-05",
    description: "Event lelang dengan antusiasme tinggi",
    tags: ["auction", "event", "community"],
  },
  {
    id: "6",
    title: "Ikan Koin",
    image: "/images/moments/bento_image_2.png",
    owner: "Budi Hartono",
    location: "Bogor",
    handling: "Pluto Koi Center",
    date: "2024-09-03",
    description: "Koi juara dengan sertifikat internasional",
    tags: ["champion", "certificate", "international"],
  },
];

export const momentsSection = {
  title: "Momen & Kenangan",
  subtitle: "Jelajahi kumpulan foto dan video yang menangkap keseruan lelang, kebahagiaan pembeli, serta ikan dan peralatan memancing.",
};
