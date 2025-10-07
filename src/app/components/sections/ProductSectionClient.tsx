"use client";

import { useState } from "react";
import { useProducts, useRefreshProducts } from "@/hooks/useProducts";
import { ProductQueryParams } from "@/services/productService";
import ProductCard from "../common/ProductCard";
import { RefreshCw, AlertCircle } from "react-feather";

export default function ProductSectionClient() {
  const [queryParams, setQueryParams] = useState<ProductQueryParams>({
    page: 1,
    limit: 8, // Show 8 products in grid
    isActive: true, // Only show active products
  });

  const { data, isLoading, error, refetch } = useProducts(queryParams);
  const refreshProducts = useRefreshProducts();

  const handleRefresh = () => {
    refreshProducts.mutate(queryParams);
  };

  if (isLoading) {
    return (
      <section className="section-padding bg-white" id="belanja">
        <div className="container-custom px-8 flex flex-col">
          <div className="text-center py-12">
            <h2 className="text-responsive-3xl font-bold text-black mb-6 leading-tight">
              <span className="text-primary">Peralatan</span> & Ikan Terbaik
            </h2>
            <div className="flex justify-center">
              <RefreshCw className="animate-spin text-primary" size={32} />
            </div>
            <p className="text-gray-600 mt-4">Memuat produk...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section-padding bg-white" id="belanja">
        <div className="container-custom px-8 flex flex-col">
          <div className="text-center py-12">
            <h2 className="text-responsive-3xl font-bold text-black mb-6 leading-tight">
              <span className="text-primary">Peralatan</span> & Ikan Terbaik
            </h2>
            <div className="flex justify-center items-center space-x-3 text-red-500">
              <AlertCircle size={24} />
              <p>Gagal memuat produk</p>
            </div>
            <button onClick={handleRefresh} disabled={refreshProducts.isPending} className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 disabled:opacity-50">
              {refreshProducts.isPending ? "Memuat..." : "Coba Lagi"}
            </button>
          </div>
        </div>
      </section>
    );
  }

  const products = data?.data.products || [];

  return (
    <section className="section-padding bg-white" id="belanja">
      <div className="container-custom px-8 flex flex-col">
        {/* Section Header */}
        <div className="mb-12 flex md:flex-row flex-col justify-between">
          <div className="flex items-start">
            <h2 className="text-responsive-3xl font-bold text-black mb-6 leading-tight">
              <span className="text-primary">Peralatan</span> & Ikan Terbaik
            </h2>
          </div>
          <div className="flex items-start">
            <p className="text-responsive-base text-gray-800 leading-relaxed max-w-2xl">Temukan berbagai alat memancing berkualitas dan ikan segar siap dibeli. Jelajahi koleksi kami, pilih yang kamu butuhkan.</p>
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Belum ada produk tersedia</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Statistics Footer */}
        {data?.data.statistics && products.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Harga mulai dari{" "}
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(data.data.statistics.priceRange.min)}{" "}
              -{" "}
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(data.data.statistics.priceRange.max)}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
