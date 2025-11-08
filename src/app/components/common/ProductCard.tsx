"use client";

import { useState } from "react";
import Image from "next/image";
import { BackendProduct } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { formatProductPrice, getPreviewMediaUrl } from "@/services/productService";
import { isVideoUrl } from "@/services/auctionService";
import { WishlistButton } from "../icons/WishlistIcon";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/hooks/useAuth";

interface ProductCardProps {
  product: BackendProduct;
  className?: string;
}

// Type guard to check if product is from backend
const isBackendProduct = (product: BackendProduct): product is BackendProduct => {
  return "_id" in product;
};

export default function ProductCard({ product, className = "" }: ProductCardProps) {
  const [mediaError, setMediaError] = useState(false);
  const { isAuthenticated } = useAuth();
  const { isInWishlist, addItemToWishlist, removeItemFromWishlist, isAddingToWishlist, isRemovingFromWishlist } = useWishlist();

  // Check if this product is in wishlist
  const itemInWishlist = isAuthenticated ? isInWishlist(product._id, "product") : false;
  const isWishlistLoading = isAddingToWishlist || isRemovingFromWishlist;

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      // Could trigger login modal here
      console.log("Please log in to add items to wishlist");
      return;
    }

    if (itemInWishlist) {
      await removeItemFromWishlist(product._id, "product");
    } else {
      await addItemToWishlist(product._id, "product");
    }
  };

  // Normalize product data based on type
  const normalizedProduct = {
    id: product._id,
    name: product.productName,
    price: product.productPrice,
    image: getPreviewMediaUrl(product),
    isVideo: product.media && product.media.length > 0 ? isVideoUrl(product.media[0].fileUrl) : false,
    category: product.productCategory?.name || "Kategori",
    type: product.productType,
  };

  const handleBuyClick = () => {
    // No action on click as requested
    console.log(`Buy clicked for ${normalizedProduct.name}`);
  };

  const formatPriceDisplay = (price: number) => {
    return isBackendProduct(product) ? formatProductPrice(price) : formatCurrency(price);
  };

  const renderMedia = () => {
    if (mediaError) {
      return <Image src="/images/products/produk_koi.png" alt={normalizedProduct.name} fill className="object-cover" />;
    }

    if (normalizedProduct.isVideo) {
      return <video src={normalizedProduct.image} className="w-full h-full object-cover" muted autoPlay loop playsInline onError={() => setMediaError(true)} />;
    } else {
      return <Image src={normalizedProduct.image} alt={normalizedProduct.name} fill className="object-cover" onError={() => setMediaError(true)} />;
    }
  };

  // Check if this is a list view (flex class)
  const isListView = className.includes("flex");

  if (isListView) {
    return (
      <div className={`card-hover overflow-hidden ${className}`}>
        {/* Product Image */}
        <div className="relative h-32 w-32 md:h-40 md:w-40 flex-shrink-0 overflow-hidden">{renderMedia()}</div>

        {/* Product Content */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{normalizedProduct.name}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                  <span className="px-2 py-1 bg-gray-100 rounded">{normalizedProduct.category}</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">{normalizedProduct.type}</span>
                </div>
              </div>
              {isAuthenticated && <WishlistButton isInWishlist={itemInWishlist} isLoading={isWishlistLoading} onToggle={handleWishlistToggle} size={20} />}
            </div>
            <p className="text-xl font-bold text-primary mb-4">{formatPriceDisplay(normalizedProduct.price)}</p>
          </div>

          {/* Buy Button */}
          <button onClick={handleBuyClick} className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white py-2 px-6 rounded-lg font-medium transition-colors cursor-pointer">
            Beli Sekarang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`card-hover overflow-hidden relative ${className}`}>
      {/* Product Image */}
      <div className="relative h-48 md:h-56 lg:h-64 overflow-hidden">{renderMedia()}</div>

      {/* Product Content */}
      <div className="p-6">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <span className="px-2 py-1 bg-gray-100 rounded">{normalizedProduct.category}</span>
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">{normalizedProduct.type}</span>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-3 duration-300 line-clamp-2">{normalizedProduct.name}</h3>

        <p className="text-2xl font-bold text-primary mb-6">{formatPriceDisplay(normalizedProduct.price)}</p>

        {/* Buy Button */}
        <button onClick={handleBuyClick} className="w-full bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
          Beli Sekarang
        </button>
      </div>

      {/* Wishlist Button for Grid View */}
      {isAuthenticated && (
        <div className="absolute top-2 right-2">
          <WishlistButton isInWishlist={itemInWishlist} isLoading={isWishlistLoading} onToggle={handleWishlistToggle} size={20} />
        </div>
      )}
    </div>
  );
}
