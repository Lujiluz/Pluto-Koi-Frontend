"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useProducts } from "@/hooks/useProducts";
import { useCategoriesForFilter } from "@/hooks/useCategories";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/hooks/useAuth";
import { ProductApiResponse, BackendProduct } from "@/lib/types";
import { ProductQueryParams } from "@/services/productService";
import ProductCard from "@/app/components/common/ProductCard";
import Footer from "@/app/components/layout/public/Footer";
import { Search, Filter, RefreshCw, AlertCircle, ShoppingBag, ChevronDown, ChevronUp, X, Grid, List as ListIcon } from "react-feather";
import Link from "next/link";

// Debounce hook for search
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface ProductPageClientProps {
  initialData?: ProductApiResponse | null;
  initialParams?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    type?: string;
  };
}

export default function ProductPageClient({ initialData, initialParams }: ProductPageClientProps) {
  const { isAuthenticated } = useAuth();
  const { isInWishlist, addItemToWishlist, removeItemFromWishlist } = useWishlist();

  // Fetch categories from API
  const { categories: productCategories, isLoading: categoriesLoading, error: categoriesError } = useCategoriesForFilter();

  const PRODUCT_TYPES = [
    { id: "", name: "Semua Jenis" },
    { id: "Produk", name: "Produk" },
    { id: "Koi Store", name: "Koi Store" },
  ];

  const SORT_OPTIONS = [
    { value: "newest", label: "Terbaru" },
    { value: "name-asc", label: "Nama A-Z" },
    { value: "name-desc", label: "Nama Z-A" },
    { value: "price-asc", label: "Harga Terendah" },
    { value: "price-desc", label: "Harga Tertinggi" },
  ];

  // UI State
  const [searchInput, setSearchInput] = useState(initialParams?.search || "");
  const [selectedCategory, setSelectedCategory] = useState(initialParams?.category || "");
  const [selectedType, setSelectedType] = useState(initialParams?.type || "");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);

  // Debounced search to avoid excessive API calls
  const debouncedSearchInput = useDebounce(searchInput, 500); // 500ms delay

  // State for filters and pagination
  const [queryParams, setQueryParams] = useState<ProductQueryParams>({
    page: initialParams?.page || 1,
    limit: initialParams?.limit || 12,
    isActive: true,
    search: initialParams?.search || "",
    category: initialParams?.category || "",
    type: initialParams?.type || "",
  });

  // Update query params when debounced search changes
  useEffect(() => {
    setQueryParams((prev) => ({
      ...prev,
      search: debouncedSearchInput.trim(),
      page: 1, // Reset to first page when search changes
    }));
  }, [debouncedSearchInput]);

  // Fetch products
  const { data: productData, isLoading, error, refetch } = useProducts(queryParams);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (queryParams.search) params.set("search", queryParams.search);
    else params.delete("search");

    if (queryParams.category) params.set("category", queryParams.category);
    else params.delete("category");

    if (queryParams.type) params.set("type", queryParams.type);
    else params.delete("type");

    if (queryParams.page && queryParams.page > 1) params.set("page", queryParams.page.toString());
    else params.delete("page");

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }, [queryParams]);

  // Memoized products with sorting
  const sortedProducts = useMemo(() => {
    if (!productData?.data.products) return [];

    const products = [...productData.data.products];

    switch (sortBy) {
      case "name-asc":
        return products.sort((a, b) => a.productName.localeCompare(b.productName));
      case "name-desc":
        return products.sort((a, b) => b.productName.localeCompare(a.productName));
      case "price-asc":
        return products.sort((a, b) => a.productPrice - b.productPrice);
      case "price-desc":
        return products.sort((a, b) => b.productPrice - a.productPrice);
      default: // newest
        return products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }, [productData?.data.products, sortBy]);

  // Handle filter changes
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setQueryParams({
      ...queryParams,
      category: categoryId,
      page: 1,
    });
  };

  const handleTypeChange = (typeId: string) => {
    setSelectedType(typeId);
    setQueryParams({
      ...queryParams,
      type: typeId,
      page: 1,
    });
  };

  // Clear filters
  const clearAllFilters = () => {
    setSearchInput("");
    setSelectedCategory("");
    setSelectedType("");
    setSortBy("newest");
    setQueryParams({
      page: 1,
      limit: 12,
      isActive: true,
      search: "",
      category: "",
      type: "",
    });
  };

  // Pagination
  const handlePageChange = (page: number) => {
    setQueryParams({ ...queryParams, page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Get active filters count
  const activeFiltersCount = [searchInput.trim(), selectedCategory, selectedType].filter(Boolean).length;

  const products = sortedProducts;
  const statistics = productData?.data.statistics;
  const metadata = productData?.data.metadata;

  return (
    <div className="min-h-screen bg-white">
      <div className="container-custom py-8 px-4 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-responsive-3xl font-bold text-black mb-4">
            <span className="text-primary">Belanja</span> Produk Koi
          </h1>
          <p className="text-gray-600 max-w-3xl">Temukan berbagai produk berkualitas untuk koi Anda. Mulai dari pakan, peralatan kolam, hingga aksesoris terbaik.</p>

          {statistics && (
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
              <span>Total: {statistics.totalProducts} produk</span>
              <span>
                Harga: {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(statistics.priceRange.min)} -{" "}
                {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(statistics.priceRange.max)}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:w-1/4">
            <div className="sticky top-24">
              {/* Mobile Filter Toggle */}
              <button className="lg:hidden w-full flex items-center justify-between p-4 bg-gray-100 rounded-lg mb-4" onClick={() => setShowFilters(!showFilters)}>
                <span className="font-medium">Filter & Pencarian</span>
                <div className="flex items-center gap-2">
                  {activeFiltersCount > 0 && <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">{activeFiltersCount}</span>}
                  {showFilters ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </button>

              {/* Filter Content */}
              <div className={`${showFilters ? "block" : "hidden"} lg:block space-y-6`}>
                {/* Search */}
                <div className="bg-white border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Pencarian</h3>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Ketik untuk mencari produk..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                      <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      {debouncedSearchInput !== searchInput && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <RefreshCw size={16} className="animate-spin text-primary" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <div className="bg-white border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">Kategori</h3>
                    <button onClick={() => setIsFilterExpanded(!isFilterExpanded)} className="text-gray-400">
                      {isFilterExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>

                  {isFilterExpanded && (
                    <div className="space-y-2">
                      {categoriesLoading ? (
                        <div className="text-sm text-gray-500">Memuat kategori...</div>
                      ) : categoriesError ? (
                        <div className="text-sm text-red-500">Gagal memuat kategori</div>
                      ) : (
                        productCategories.map((category) => (
                          <label key={category.id} className="flex items-center cursor-pointer">
                            <input type="radio" name="category" value={category.id} checked={selectedCategory === category.id} onChange={(e) => handleCategoryChange(e.target.value)} className="mr-3 text-primary" />
                            <span className="text-sm text-gray-700 flex-1">{category.name}</span>
                            {category.description && (
                              <span className="text-xs text-gray-400" title={category.description}>
                                ℹ
                              </span>
                            )}
                          </label>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Product Type */}
                <div className="bg-white border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Jenis Produk</h3>
                  <div className="space-y-2">
                    {PRODUCT_TYPES.map((type) => (
                      <label key={type.id} className="flex items-center cursor-pointer">
                        <input type="radio" name="type" value={type.id} checked={selectedType === type.id} onChange={(e) => handleTypeChange(e.target.value)} className="mr-3 text-primary" />
                        <span className="text-sm text-gray-700">{type.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {activeFiltersCount > 0 && (
                  <button onClick={clearAllFilters} className="w-full flex items-center justify-center gap-2 py-2 text-red-600 hover:text-red-700 transition-colors">
                    <X size={16} />
                    Hapus Semua Filter
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">{metadata ? `${metadata.totalItems} produk ditemukan` : "Memuat..."}</span>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {/* View Mode */}
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button onClick={() => setViewMode("grid")} className={`p-2 ${viewMode === "grid" ? "bg-primary text-white" : "bg-white text-gray-600"}`}>
                    <Grid size={16} />
                  </button>
                  <button onClick={() => setViewMode("list")} className={`p-2 ${viewMode === "list" ? "bg-primary text-white" : "bg-white text-gray-600"}`}>
                    <ListIcon size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <div className="flex justify-center items-center space-x-3 text-red-500 mb-4">
                  <AlertCircle size={24} />
                  <p>Gagal memuat produk</p>
                </div>
                <button onClick={() => refetch()} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                  Coba Lagi
                </button>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <RefreshCw className="animate-spin text-primary" size={32} />
                  </div>
                  <p className="text-gray-600">Memuat produk...</p>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && products.length === 0 && !error && (
              <div className="text-center py-12">
                <ShoppingBag size={64} className="mx-auto text-gray-300 mb-6" />
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Produk Tidak Ditemukan</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {activeFiltersCount > 0 ? "Tidak ada produk yang sesuai dengan filter Anda. Coba ubah filter atau hapus beberapa kriteria pencarian." : "Belum ada produk yang tersedia saat ini."}
                </p>
                {activeFiltersCount > 0 && (
                  <button onClick={clearAllFilters} className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                    Hapus Filter
                  </button>
                )}
              </div>
            )}

            {/* Products Grid/List */}
            {!isLoading && products.length > 0 && (
              <>
                <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} className={viewMode === "list" ? "flex" : ""} />
                  ))}
                </div>

                {/* Pagination */}
                {metadata && metadata.totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(metadata.page - 1)}
                        disabled={!metadata.hasPreviousPage}
                        className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                      >
                        Sebelumnya
                      </button>

                      {Array.from({ length: metadata.totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 border rounded-lg transition-colors ${page === metadata.page ? "bg-primary text-white border-primary" : "border-gray-300 hover:bg-gray-50"}`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        onClick={() => handlePageChange(metadata.page + 1)}
                        disabled={!metadata.hasNextPage}
                        className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                      >
                        Selanjutnya
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
