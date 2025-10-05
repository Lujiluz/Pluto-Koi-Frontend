import { getGalleriesServer } from "@/services/galleryService";
import GallerySectionClient from "./GallerySectionClient";

interface GallerySectionProps {
  initialData?: any;
}

export default async function GallerySection({ initialData }: GallerySectionProps) {
  let serverData = initialData;

  // If no initial data provided, fetch on server
  if (!serverData) {
    try {
      serverData = await getGalleriesServer({
        page: 1,
        limit: 6,
        isActive: true,
      });
    } catch (error) {
      console.error("Failed to fetch galleries on server:", error);
      // Fall back to client-side rendering
      serverData = null;
    }
  }

  // If we have server data, we could pre-populate the client component
  // For now, let's use client-side rendering for better interactivity
  return <GallerySectionClient />;
}

// Server component version for static generation
export async function GallerySectionStatic() {
  try {
    const data = await getGalleriesServer({
      page: 1,
      limit: 6,
      isActive: true,
    });

    const galleries = data?.data.galleries || [];

    if (galleries.length === 0) {
      return (
        <section className="section-padding mx-6 bg-[#FFE6E630]" id="galeri">
          <div className="container-custom">
            <div className="text-center py-12">
              <h2 className="text-responsive-3xl font-bold text-black mb-6 leading-tight">
                <span className="text-primary">Galeri</span> & Momen
              </h2>
              <p className="text-gray-600">Belum ada galeri tersedia</p>
            </div>
          </div>
        </section>
      );
    }

    return (
      <section className="section-padding mx-6 bg-[#FFE6E630]" id="galeri">
        <div className="container-custom">
          {/* Section Header */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start mb-12">
            <div>
              <h2 className="text-responsive-3xl font-bold text-black mb-6 leading-tight">
                <span className="text-primary">Galeri</span> & Momen
              </h2>
              {data?.data.statistics && (
                <p className="text-sm text-gray-600">
                  {data.data.statistics.totalGalleries} galeri • {data.data.statistics.totalMediaFiles} media
                </p>
              )}
            </div>
            <div>
              <p className="text-responsive-base text-gray-800 leading-relaxed max-w-2xl">
                Jelajahi koleksi momen berharga dan galeri ikan koi terbaik dari komunitas Pluto Koi. Temukan inspirasi dan kenangan indah dari setiap lelang dan acara yang telah berlangsung.
              </p>
            </div>
          </div>

          {/* Static Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 mb-8">
            {galleries.slice(0, 6).map((gallery, index) => {
              // Bento grid layout logic
              let className = "";
              switch (index) {
                case 0:
                  className = "md:col-span-2 md:row-span-1";
                  break;
                case 1:
                  className = "md:col-span-1 md:row-span-1";
                  break;
                case 2:
                  className = "md:col-span-1 md:row-span-1";
                  break;
                case 3:
                  className = "md:col-span-2 md:row-span-1";
                  break;
                default:
                  className = "md:col-span-1";
              }

              return (
                <div key={gallery._id} className={`relative group overflow-hidden rounded-2xl ${index === 0 || index === 3 ? "h-64 md:h-80 lg:h-96" : "h-56 md:h-64 lg:h-72"} ${className}`}>
                  {/* Static preview for SSG */}
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">Gallery: {gallery.galleryName}</p>
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                    <h3 className="text-white font-semibold text-lg md:text-xl line-clamp-2">{gallery.galleryName}</h3>
                    <p className="text-white/80 text-sm mt-2">
                      {gallery.owner} • {gallery.handling}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Enhanced with client-side functionality */}
          <div className="text-center">
            <p className="text-gray-600 text-sm">Interaksi penuh tersedia dengan JavaScript aktif</p>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error("Error in static gallery generation:", error);

    return (
      <section className="section-padding mx-6 bg-[#FFE6E630]" id="galeri">
        <div className="container-custom">
          <div className="text-center py-12">
            <h2 className="text-responsive-3xl font-bold text-black mb-6 leading-tight">
              <span className="text-primary">Galeri</span> & Momen
            </h2>
            <p className="text-gray-600">Galeri akan dimuat saat halaman siap</p>
          </div>
        </div>
      </section>
    );
  }
}
