import AxiosInstance from "@/utils/axiosInstance";
import { AuthResponse, LoginRequest, RegisterRequest, UserRole } from "@/lib/types";

// Base API URLs
const AUTH_ENDPOINTS = {
  LOGIN: "/api/pluto-koi/v1/auth/login",
  REGISTER: "/api/pluto-koi/v1/auth/register",
} as const;

// Login service
export const loginUser = async (credentials: LoginRequest): Promise<AuthResponse> => {
  try {
    const response = await AxiosInstance.post(AUTH_ENDPOINTS.LOGIN, {
      email: credentials.email.toLowerCase().trim(),
      password: credentials.password,
    });

    // Handle successful response
    if (response.data.success && response.data.data?.token) {
      // Store token in localStorage
      localStorage.setItem("authToken", response.data.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
    }

    return response.data;
  } catch (error: any) {
    // Handle error response
    if (error.response?.data) {
      return {
        success: false,
        error: error.response.data.message || "Login failed",
      };
    }

    return {
      success: false,
      error: "Network error. Please check your connection.",
    };
  }
};

// Register service
export const registerUser = async (userData: RegisterRequest): Promise<AuthResponse> => {
  try {
    const response = await AxiosInstance.post(AUTH_ENDPOINTS.REGISTER, {
      name: userData.name.trim(),
      email: userData.email.toLowerCase().trim(),
      password: userData.password,
      role: userData.role || UserRole.endUser,
    });

    // Handle successful response
    if (response.data.success && response.data.data?.token) {
      // Store token in localStorage
      localStorage.setItem("authToken", response.data.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
    }

    return response.data;
  } catch (error: any) {
    // Handle error response
    if (error.response?.data) {
      return {
        success: false,
        error: error.response.data.message || "Registration failed",
      };
    }

    return {
      success: false,
      error: "Network error. Please check your connection.",
    };
  }
};

// Logout service
export const logoutUser = (): void => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
};

// Get current user from localStorage
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("authToken");
};

// Validation functions to match backend schema
export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) return "Email is required";
  if (!emailRegex.test(email)) return "Please enter a valid email address";
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters long";
  if (password.length > 128) return "Password cannot exceed 128 characters";
  return null;
};

export const validateName = (name: string): string | null => {
  if (!name.trim()) return "Name is required";
  if (name.trim().length < 2) return "Name must be at least 2 characters long";
  if (name.trim().length > 50) return "Name cannot exceed 50 characters";
  return null;
};

export const validatePasswordMatch = (password: string, confirmPassword: string): string | null => {
  if (password !== confirmPassword) return "Passwords do not match";
  return null;
};
