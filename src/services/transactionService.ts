import AxiosInstance from "@/utils/axiosInstance";

// Transaction types
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface GuestPurchaseRequest {
  name: string;
  email: string;
  phoneNumber: string;
  address: Address;
  productId: string;
  quantity: number;
  paymentProof: File;
}

export interface UserPurchaseRequest {
  productId: string;
  quantity: number;
  paymentProof: File;
}

export interface TrackOrderRequest {
  email: string;
  page?: number;
  limit?: number;
}

export interface Transaction {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: Address;
  productId: string;
  quantity: number;
  totalAmount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  paymentProofUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionResponse {
  success: boolean;
  message: string;
  data: Transaction;
}

export interface TransactionListResponse {
  success: boolean;
  message: string;
  data: Transaction[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

// Create guest purchase
export const createGuestPurchase = async (purchaseData: GuestPurchaseRequest): Promise<TransactionResponse> => {
  try {
    const formData = new FormData();
    formData.append("name", purchaseData.name);
    formData.append("email", purchaseData.email);
    formData.append("phoneNumber", purchaseData.phoneNumber);
    formData.append("address", JSON.stringify(purchaseData.address));
    formData.append("productId", purchaseData.productId);
    formData.append("quantity", purchaseData.quantity.toString());
    formData.append("paymentProof", purchaseData.paymentProof);

    const response = await AxiosInstance.post("/transaction/guest-purchase", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error creating guest purchase:", error);
    throw new Error(error.response?.data?.message || "Failed to create purchase");
  }
};

// Create user purchase (requires authentication)
export const createUserPurchase = async (purchaseData: UserPurchaseRequest): Promise<TransactionResponse> => {
  try {
    const formData = new FormData();
    formData.append("productId", purchaseData.productId);
    formData.append("quantity", purchaseData.quantity.toString());
    formData.append("paymentProof", purchaseData.paymentProof);

    const response = await AxiosInstance.post("/transaction/user-purchase", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error creating user purchase:", error);
    throw new Error(error.response?.data?.message || "Failed to create purchase");
  }
};

// Track order by email
export const trackOrderByEmail = async ({ email, page = 1, limit = 10 }: TrackOrderRequest): Promise<TransactionListResponse> => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await AxiosInstance.post(`/transaction/track?${queryParams.toString()}`, {
      email,
    });

    return response.data;
  } catch (error: any) {
    console.error("Error tracking order:", error);
    throw new Error(error.response?.data?.message || "Failed to track order");
  }
};

// Get my transactions (requires authentication)
export const getMyTransactions = async (page = 1, limit = 10): Promise<TransactionListResponse> => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await AxiosInstance.get(`/transaction/my-transactions?${queryParams.toString()}`);

    return response.data;
  } catch (error: any) {
    console.error("Error fetching my transactions:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch transactions");
  }
};

// Get transaction by ID (requires authentication)
export const getTransactionById = async (id: string): Promise<TransactionResponse> => {
  try {
    const response = await AxiosInstance.get(`/transaction/${id}`);

    return response.data;
  } catch (error: any) {
    console.error("Error fetching transaction:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch transaction");
  }
};

// Validation helpers
export const validateEmail = (email: string): string | null => {
  if (!email) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Please enter a valid email address";
  return null;
};

export const validatePhoneNumber = (phoneNumber: string): string | null => {
  if (!phoneNumber) return "Phone number is required";
  const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
  if (!phoneRegex.test(phoneNumber)) return "Please enter a valid Indonesian phone number";
  return null;
};

export const validateName = (name: string): string | null => {
  if (!name || name.trim().length === 0) return "Name is required";
  if (name.trim().length < 2) return "Name must be at least 2 characters long";
  return null;
};

export const validateAddress = (address: Address): Partial<Address> => {
  const errors: Partial<Address> = {};

  if (!address.street || address.street.trim().length === 0) {
    errors.street = "Street address is required";
  }
  if (!address.city || address.city.trim().length === 0) {
    errors.city = "City is required";
  }
  if (!address.state || address.state.trim().length === 0) {
    errors.state = "State/Province is required";
  }
  if (!address.zipCode || address.zipCode.trim().length === 0) {
    errors.zipCode = "ZIP/Postal code is required";
  }
  if (!address.country || address.country.trim().length === 0) {
    errors.country = "Country is required";
  }

  return errors;
};

export const validateQuantity = (quantity: number): string | null => {
  if (!quantity || quantity < 1) return "Quantity must be at least 1";
  if (quantity > 100) return "Quantity cannot exceed 100";
  return null;
};

export const validatePaymentProof = (file: File | null): string | null => {
  if (!file) return "Payment proof is required";

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return "Please upload a valid image file (JPG, PNG, or WebP)";
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return "File size must be less than 5MB";
  }

  return null;
};
