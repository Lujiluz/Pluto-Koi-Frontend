"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useGalleries, useRefreshGalleries, useGalleryFolders } from "@/hooks/useGalleries";
import { GalleryQueryParams } from "@/services/galleryService";
import { GalleryApiResponse, BackendGallery } from "@/lib/types";
import GalleryCard from "@/app/components/common/GalleryCard";
import GalleryModal from "@/app/components/common/GalleryModal";
import { RefreshCw, AlertCircle, Grid, Search, ChevronLeft, ChevronRight } from "react-feather";

interface GalleryPageClientProps {
  initialData?: GalleryApiResponse | null;
}

export default function GalleryPageClient({ initialData }: GalleryPageClientProps) {
  const searchParams = useSearchParams();
  const [selectedGallery, setSelectedGallery] = useState<BackendGallery | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [filterOwner, setFilterOwner] = useState("");
  const [filterFolder, setFilterFolder] = useState("");

  const [queryParams, setQueryParams] = useState<GalleryQueryParams>({
    page: 1,
    limit: 12,
    isActive: true,
  });

  const { data, isLoading, error, refetch } = useGalleries(queryParams);
  const { data: foldersData, isLoading: foldersLoading } = useGalleryFolders();
  const refreshGalleries = useRefreshGalleries();

  // Use initial data if available
  const galleryData = data || initialData;
  const galleries = galleryData?.data.galleries || [];

  useEffect(() => {
    // Parse URL parameters
    const page = searchParams.get("page");
    const owner = searchParams.get("owner");
    const folderName = searchParams.get("folderName");
    const search = searchParams.get("search");

    if (page) {
      setQueryParams((prev) => ({ ...prev, page: parseInt(page) }));
    }
    if (owner) {
      setFilterOwner(owner);
      setQueryParams((prev) => ({ ...prev, owner }));
    }
    if (folderName) {
      setFilterFolder(folderName);
      setQueryParams((prev) => ({ ...prev, folderName }));
    }
    if (search) {
      setSearchQuery(search);
      setDebouncedSearchQuery(search);
      setQueryParams((prev) => ({ ...prev, search }));
    }
  }, [searchParams]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Auto-refetch when filters change
  useEffect(() => {
    const newParams: GalleryQueryParams = {
      page: 1, // Reset to first page when filters change
      limit: 12,
      isActive: true,
    };

    if (debouncedSearchQuery) {
      newParams.search = debouncedSearchQuery;
    }
    if (filterOwner) {
      newParams.owner = filterOwner;
    }
    if (filterFolder) {
      newParams.folderName = filterFolder;
    }

    setQueryParams(newParams);
  }, [debouncedSearchQuery, filterOwner, filterFolder]);

  const handleRefresh = () => {
    refreshGalleries.mutate(queryParams);
  };

  const handleLoadMore = () => {
    if (galleryData?.data.metadata.hasNextPage) {
      setQueryParams((prev) => ({
        ...prev,
        page: (prev.page || 1) + 1,
      }));
    }
  };

  const handlePageChange = (newPage: number) => {
    setQueryParams((prev) => ({
      ...prev,
      page: newPage,
    }));
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePreviousPage = () => {
    const currentPage = queryParams.page || 1;
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    const currentPage = queryParams.page || 1;
    if (galleryData?.data.metadata.hasNextPage) {
      handlePageChange(currentPage + 1);
    }
  };

  const handleGalleryClick = (gallery: BackendGallery) => {
    setSelectedGallery(gallery);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGallery(null);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
    setFilterOwner("");
    setFilterFolder("");
    setQueryParams({
      page: 1,
      limit: 12,
      isActive: true,
    });
  };

  // Get unique owners for filter dropdown
  const owners = galleries.reduce((acc, gallery) => {
    if (!acc.includes(gallery.owner)) {
      acc.push(gallery.owner);
    }
    return acc;
  }, [] as string[]);

  if (isLoading && !galleryData) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container-custom py-24">
          <div className="text-center">
            <h1 className="text-responsive-4xl font-bold text-black mb-6">
              <span className="text-primary">Galeri</span> & Momen
            </h1>
            <div className="flex justify-center mb-4">
              <RefreshCw className="animate-spin text-primary" size={32} />
            </div>
            <p className="text-gray-600">Memuat galeri...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-8">
      <div className="container-custom py-24">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-responsive-3xl font-bold text-black mb-6">
            <span className="text-primary">Galeri</span> & Momen
          </h1>
          <p className="text-responsive-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Jelajahi koleksi momen berharga dan galeri ikan koi terbaik dari komunitas Pluto Koi. Temukan inspirasi dan kenangan indah dari setiap lelang dan acara yang telah berlangsung.
          </p>

          {galleryData?.data.statistics && (
            <div className="mt-6 flex justify-center space-x-8 text-sm text-gray-600">
              <span>{galleryData.data.statistics.totalGalleries} galeri</span>
              <span>{galleryData.data.statistics.totalMediaFiles} media</span>
            </div>
          )}
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 p-6 bg-gray-50 rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search by name */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari galeri..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Filter by owner */}
            <select value={filterOwner} onChange={(e) => setFilterOwner(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer">
              <option value="">Semua Pemilik</option>
              {owners.map((owner) => (
                <option key={owner} value={owner}>
                  {owner}
                </option>
              ))}
            </select>

            {/* Filter by folder */}
            <select
              value={filterFolder}
              onChange={(e) => setFilterFolder(e.target.value)}
              disabled={foldersLoading}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer disabled:opacity-50"
            >
              <option value="">Semua Folder</option>
              {foldersData?.data.folders.map((folder) => (
                <option key={folder._id} value={folder.folderName}>
                  {folder.folderName}
                </option>
              ))}
            </select>

            {/* Clear Filters */}
            <button onClick={clearFilters} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              Reset Filter
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && !galleryData && (
          <div className="text-center py-12">
            <div className="flex justify-center items-center space-x-3 text-red-500 mb-4">
              <AlertCircle size={24} />
              <p>Gagal memuat galeri</p>
            </div>
            <button onClick={handleRefresh} disabled={refreshGalleries.isPending} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 disabled:opacity-50">
              {refreshGalleries.isPending ? "Memuat..." : "Coba Lagi"}
            </button>
          </div>
        )}

        {/* Gallery Grid */}
        {galleries.length === 0 ? (
          <div className="text-center py-12">
            <Grid size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600">Belum ada galeri tersedia</p>
          </div>
        ) : (
          <>
            {/* Refresh Button */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Menampilkan {galleries.length} dari {galleryData?.data.metadata.totalItems || 0} galeri
              </p>
              <button onClick={handleRefresh} disabled={refreshGalleries.isPending} className="p-2 text-gray-500 hover:text-primary transition-colors disabled:opacity-50 cursor-pointer" title="Refresh galeri">
                <RefreshCw size={20} className={refreshGalleries.isPending ? "animate-spin" : ""} />
              </button>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {galleries.map((gallery) => (
                <GalleryCard key={gallery._id} gallery={gallery} size="medium" onClick={handleGalleryClick} />
              ))}
            </div>

            {/* Pagination */}
            {galleryData?.data.metadata && galleryData.data.metadata.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                {/* Previous Button */}
                <button
                  onClick={handlePreviousPage}
                  disabled={!galleryData.data.metadata.hasPreviousPage || isLoading}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronLeft size={16} className="mr-1" />
                  Sebelumnya
                </button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {(() => {
                    const currentPage = galleryData.data.metadata.page;
                    const totalPages = galleryData.data.metadata.totalPages;
                    const pages = [];

                    // Always show first page
                    if (currentPage > 3) {
                      pages.push(
                        <button key={1} onClick={() => handlePageChange(1)} className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                          1
                        </button>
                      );
                      if (currentPage > 4) {
                        pages.push(
                          <span key="ellipsis1" className="px-2 text-gray-500">
                            ...
                          </span>
                        );
                      }
                    }

                    // Show pages around current page
                    const start = Math.max(1, currentPage - 2);
                    const end = Math.min(totalPages, currentPage + 2);

                    for (let i = start; i <= end; i++) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => handlePageChange(i)}
                          className={`cursor-pointer px-3 py-2 border rounded-lg transition-colors ${i === currentPage ? "bg-primary text-white border-primary" : "border-gray-300 hover:bg-gray-50"}`}
                        >
                          {i}
                        </button>
                      );
                    }

                    // Always show last page
                    if (currentPage < totalPages - 2) {
                      if (currentPage < totalPages - 3) {
                        pages.push(
                          <span key="ellipsis2" className="px-2 text-gray-500">
                            ...
                          </span>
                        );
                      }
                      pages.push(
                        <button key={totalPages} onClick={() => handlePageChange(totalPages)} className="cursor-pointer px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          {totalPages}
                        </button>
                      );
                    }

                    return pages;
                  })()}
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNextPage}
                  disabled={!galleryData.data.metadata.hasNextPage || isLoading}
                  className="cursor-pointer flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Selanjutnya
                  <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Gallery Modal */}
      <GalleryModal isOpen={isModalOpen} onClose={handleCloseModal} gallery={selectedGallery} />
    </div>
  );
}
