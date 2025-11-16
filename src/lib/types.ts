// Base types
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Metadata {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Auth types
export enum UserRole {
  admin = "admin",
  endUser = "endUser",
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  role?: UserRole;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface AuthResponse {
  status: string;
  message?: string;
  data?: {
    user: User;
    token: string;
  };
  error?: string;
}

// Backend User types (from your API)
export interface BackendUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

// User types
export interface User extends BaseEntity {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  isActive: boolean;
}

// Backend Auction Media
export interface AuctionMedia {
  fileUrl: string;
  _id: string;
  mediaType?: "image" | "video"; // Optional, will be determined from file extension
}

// Backend Gallery Media
export interface GalleryMedia {
  fileUrl: string;
  _id: string;
  mediaType?: "image" | "video"; // Optional, will be determined from file extension
}

// Media type helper
export type MediaType = "image" | "video";

// Backend Auction Winner/Bidder
export interface AuctionBid {
  userId: BackendUser;
  bidAmount: number;
}

// Backend Auction (from your API response)
export interface BackendAuction {
  _id: string;
  itemName: string;
  startPrice: number;
  endPrice: number;
  startDate: string;
  endDate: string;
  highestBid: number;
  media: AuctionMedia[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  currentHighestBid: number | null;
  currentWinner: AuctionBid | null;
}

// Backend Auction Detail (from detail endpoint)
export interface BackendAuctionDetail extends BackendAuction {
  note: string; // HTML content with auction details
  endTime: string; // Specific end time
  extraTime: number; // Extra time in minutes
}

// Backend Auction Detail API Response
export interface AuctionDetailApiResponse {
  status: string;
  message: string;
  data: BackendAuctionDetail;
}

// Backend API Response Structure
export interface AuctionApiResponse {
  status: string;
  message: string;
  data: {
    statistics: {
      totalAuctions: number;
      activeAuctions: number;
      completedAuctions: number;
    };
    auctions: BackendAuction[];
    metadata: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

// Backend Gallery (from your API response)
export interface BackendGallery {
  _id: string;
  galleryName: string;
  owner: string;
  handling: string;
  folderName: string;
  isActive: boolean;
  media: GalleryMedia[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Backend Gallery API Response Structure
export interface GalleryApiResponse {
  status: string;
  message: string;
  data: {
    galleries: BackendGallery[];
    metadata: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
    statistics: {
      totalGalleries: number;
      activeGalleries: number;
      inactiveGalleries: number;
      totalMediaFiles: number;
      galleriesByOwner: Array<{
        owner: string;
        count: number;
      }>;
      galleriesByFolder: Array<{
        folderName: string;
        count: number;
      }>;
    };
  };
}

// Backend Product Category
export interface ProductCategory {
  _id: string;
  name: string;
  description?: string;
}

// Backend Category (for categories endpoint)
export interface BackendCategory {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Backend Category API Response Structure
export interface CategoryApiResponse {
  status: string;
  message: string;
  data: {
    categories: BackendCategory[];
    metadata: {
      page: number;
      limit: number;
      total: number;
      pages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
    statistics: {
      totalCategories: number;
      activeCategories: number;
      inactiveCategories: number;
    };
  };
}

// Backend Product Media
export interface ProductMedia {
  fileUrl: string;
  _id: string;
  mediaType?: "image" | "video"; // Optional, will be determined from file extension
}

// Backend Product (from your API response)
export interface BackendProduct {
  _id: string;
  productName: string;
  productPrice: number;
  productType: "Produk" | "Koi Store";
  productCategory: ProductCategory;
  isActive: boolean;
  media: ProductMedia[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Backend Product API Response Structure
export interface ProductApiResponse {
  status: string;
  message: string;
  data: {
    products: BackendProduct[];
    metadata: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
    statistics: {
      totalProducts: number;
      activeProducts: number;
      inactiveProducts: number;
      averagePrice: number;
      priceRange: {
        min: number;
        max: number;
      };
    };
  };
}

// Koi fish types
export interface KoiFish extends BaseEntity {
  name: string;
  description: string;
  images: string[];
  category: string;
  origin: string;
  size: number; // in cm
  age: number; // in months
  gender: "male" | "female" | "unknown";
  price: number;
  isAvailable: boolean;
  owner?: User;
  ownerId?: string;
}

// Auction types
export interface Auction extends BaseEntity {
  title: string;
  description: string;
  koiFish: KoiFish;
  koiFishId: string;
  images: string[];
  startPrice: number;
  currentPrice: number;
  highestBid: number;
  buyNowPrice?: number;
  startTime: Date;
  endTime: Date;
  status: "upcoming" | "active" | "ending-soon" | "completed" | "cancelled";
  bids: Bid[];
  bidCount: number;
  winner?: User;
  winnerId?: string;
}

// Bid types
export interface Bid extends BaseEntity {
  amount: number;
  bidder: User;
  bidderId: string;
  auction: Auction;
  auctionId: string;
  isWinning: boolean;
}

// Product types
export interface Product extends BaseEntity {
  name: string;
  description: string;
  images: string[];
  category: "food" | "equipment" | "medicine" | "decoration" | "other";
  price: number;
  stock: number;
  isActive: boolean;
  specifications?: Record<string, string>;
}

// Order types
export interface Order extends BaseEntity {
  orderNumber: string;
  user: User;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  status: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress: Address;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  notes?: string;
}

export interface OrderItem {
  id: string;
  product?: Product;
  productId?: string;
  koiFish?: KoiFish;
  koiFishId?: string;
  auction?: Auction;
  auctionId?: string;
  quantity: number;
  price: number;
  total: number;
}

// Address types
export interface Address {
  name: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

// Gallery folder types
export interface GalleryFolderData {
  folders: GalleryFolder;
  metadata: Metadata;
  statistics: {
    activeFolders: number;
    foldersWithGalleryCount: object[];
    inactiveFolders: number;
    totalFolders: number;
  };
}
export interface GalleryFolder {
  _id: string;
  folderName: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryFoldersResponse {
  status: string;
  message: string;
  data: {
    folders: GalleryFolder[];
    metadata: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
    statistics: {
      totalFolders: number;
      activeFolders: number;
      inactiveFolders: number;
      foldersWithGalleryCount: Array<{
        folderName: string | null;
        galleryCount: number;
      }>;
    };
  };
}

// Gallery types
export interface GalleryImage extends BaseEntity {
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  category: "koi" | "pond" | "equipment" | "event" | "other";
  tags: string[];
  isPublic: boolean;
  uploadedBy: User;
  uploadedById: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

// Navigation types
export interface NavItem {
  label: string;
  href: string;
  isActive?: boolean;
  icon?: string;
  children?: NavItem[];
}

// Component props types
export interface ButtonProps {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  closeOnOverlayClick?: boolean;
}

// Feature types
export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  image?: string;
  benefits: string[];
}

// Statistics types
export interface DashboardStats {
  totalUsers: number;
  activeAuctions: number;
  totalProducts: number;
  monthlyRevenue: number;
  recentOrders: Order[];
  popularProducts: Product[];
}

// Search and filter types
export interface SearchFilters {
  query?: string;
  category?: string;
  priceMin?: number;
  priceMax?: number;
  sortBy?: "name" | "price" | "date" | "popularity";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

// Notification types
export interface Notification extends BaseEntity {
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  user: User;
  userId: string;
  actionUrl?: string;
}

// Wishlist types
export interface WishlistItem {
  itemId: string;
  itemType: "product" | "auction";
  itemData: {
    itemName: string;
    price: number;
    imageUrl: string;
  };
  addedAt: string;
}

export interface Wishlist {
  _id: string;
  userId: string;
  items: WishlistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface WishlistApiResponse {
  status: string;
  message: string;
  data: Wishlist;
}

export interface WishlistItemsApiResponse {
  status: string;
  message: string;
  data: WishlistItem[];
}

export interface AddWishlistRequest {
  itemId: string;
  itemType: "product" | "auction";
}

export interface RemoveWishlistRequest {
  itemId: string;
  itemType: "product" | "auction";
}

// General Rules types
export interface GeneralRules {
  _id: string;
  content: string;
}

export interface GeneralRulesApiResponse {
  status: string;
  message: string;
  data: GeneralRules;
}

// Event types
export interface ActiveEvent {
  _id: string;
  isActive: boolean;
  totalBidAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ActiveEventApiResponse {
  status: string;
  message: string;
  data: ActiveEvent | null;
}

// Settings types
export interface UserSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  auctionReminders: boolean;
  bidNotifications: boolean;
  language: "id" | "en";
  timezone: string;
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  logo: string;
  favicon: string;
  contactEmail: string;
  contactPhone: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  maintenanceMode: boolean;
  registrationEnabled: boolean;
}
