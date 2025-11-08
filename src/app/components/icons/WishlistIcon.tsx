interface HeartIconProps {
  filled?: boolean;
  size?: number;
  color?: string;
  className?: string;
  onClick?: () => void;
}

export function HeartIcon({ filled = false, size = 24, color = "currentColor", className = "", onClick }: HeartIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? color : "none"}
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`cursor-pointer transition-all duration-200 ${className}`}
      onClick={onClick}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

interface WishlistButtonProps {
  isInWishlist: boolean;
  isLoading?: boolean;
  onToggle: () => void;
  size?: number;
  className?: string;
}

export function WishlistButton({ isInWishlist, isLoading = false, onToggle, size = 24, className = "" }: WishlistButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoading) {
      onToggle();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`
        relative flex items-center justify-center
        p-2 rounded-full
        bg-white/80 backdrop-blur-sm
        hover:bg-white/90 hover:scale-110
        active:scale-95
        transition-all duration-200
        shadow-md hover:shadow-lg
        ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      {isLoading ? (
        <div className="animate-spin">
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="text-gray-500">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75" />
          </svg>
        </div>
      ) : (
        <HeartIcon filled={isInWishlist} size={size} color={isInWishlist ? "#ef4444" : "#6b7280"} className={isInWishlist ? "text-red-500" : "text-gray-500"} />
      )}
    </button>
  );
}
