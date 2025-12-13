import AxiosInstance from "@/utils/axiosInstance";
import { AuthResponse, LoginRequest, RegisterRequest, UserRole } from "@/lib/types";

// Base API URLs
const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
} as const;

// Login service
export const loginUser = async (credentials: LoginRequest): Promise<AuthResponse> => {
  try {
    const response = await AxiosInstance.post(AUTH_ENDPOINTS.LOGIN, {
      email: credentials.email.toLowerCase().trim(),
      password: credentials.password,
    });

    console.log("Full response: ", response.data);
    console.log("Token: ", response.data.data?.token);

    // Handle successful response - check for either success field or status
    const isSuccess = response.data.success === true || response.data.status === "success";
    const tokenData = response.data.data?.token || response.data.token;
    const userData = response.data.data?.user || response.data.user;

    if (isSuccess && tokenData) {
      // Check if localStorage is available
      if (typeof window !== "undefined" && window.localStorage) {
        // Store token in localStorage
        console.log("Storing token in localStorage:", tokenData);
        try {
          localStorage.setItem("authToken", tokenData);
          localStorage.setItem("user", JSON.stringify(userData));

          // Verify storage immediately
          const storedToken = localStorage.getItem("authToken");
          const storedUser = localStorage.getItem("user");
          console.log("Token stored successfully:", storedToken === tokenData);
          console.log("User stored successfully:", !!storedUser);
        } catch (storageError) {
          console.error("localStorage error:", storageError);
          return {
            status: "error",
            error: "Failed to store authentication data. Please check if localStorage is enabled.",
          };
        }
      } else {
        console.error("localStorage not available");
        return {
          status: "error",
          error: "Browser storage not available. Please enable localStorage.",
        };
      }
    } else {
      console.log("Login failed - no token received or not successful", {
        isSuccess,
        tokenData,
        userData,
        fullResponse: response.data,
      });
    }

    // Normalize response format
    return {
      status: isSuccess ? "success" : "error",
      message: response.data.message,
      data: response.data.data || { token: tokenData, user: userData },
      error: response.data.error,
    };
  } catch (error: any) {
    console.error("Login error caught:", error);

    // Handle error response
    if (error.response?.data) {
      console.log("Server error response:", error.response.data);
      return {
        status: "error",
        error: error.response.data.message || error.response.data.error || "Login failed",
      };
    }

    // Handle network errors
    if (error.code === "NETWORK_ERROR" || error.message?.includes("Network")) {
      console.error("Network error:", error.message);
      return {
        status: "error",
        error: "Network error. Please check your connection and try again.",
      };
    }

    // Handle other errors
    console.error("Unexpected error:", error.message);
    return {
      status: "error",
      error: error.message || "An unexpected error occurred. Please try again.",
    };
  }
};

// Register service
// Note: With the new approval flow, registered users will have approvalStatus: "pending"
// and will NOT receive a token. They must wait for admin approval and email verification.
export const registerUser = async (userRegistrationData: RegisterRequest): Promise<AuthResponse> => {
  try {
    const response = await AxiosInstance.post(AUTH_ENDPOINTS.REGISTER, {
      name: userRegistrationData.name.trim(),
      email: userRegistrationData.email.toLowerCase().trim(),
      password: userRegistrationData.password,
      phoneNumber: userRegistrationData.phoneNumber.trim(),
      role: userRegistrationData.role || UserRole.endUser,
      address: {
        street: userRegistrationData.address.street.trim(),
        city: userRegistrationData.address.city.trim(),
        state: userRegistrationData.address.state.trim(),
        zipCode: userRegistrationData.address.zipCode.trim(),
        country: userRegistrationData.address.country.trim(),
      },
    });

    console.log("Registration response: ", response.data);

    // Handle successful response - check for either success field or status
    const isSuccess = response.data.success === true || response.data.status === "success";
    const userData = response.data.data?.user || response.data.user;

    // Note: With the new approval flow, token is NOT provided for pending users
    // User must wait for admin approval and click the verification link in email
    if (isSuccess) {
      console.log("Registration successful - user is pending approval", {
        userData,
        approvalStatus: userData?.approvalStatus,
      });
    }

    // Normalize response format
    return {
      status: isSuccess ? "success" : "error",
      message: response.data.message,
      data: response.data.data || { user: userData },
      error: response.data.error,
    };
  } catch (error: any) {
    console.error("Registration error caught:", error);

    // Handle error response
    if (error.response?.data) {
      console.log("Server error response:", error.response.data);
      return {
        status: "error",
        error: error.response.data.message || error.response.data.error || "Registration failed",
      };
    }

    // Handle network errors
    if (error.code === "NETWORK_ERROR" || error.message?.includes("Network")) {
      console.error("Network error:", error.message);
      return {
        status: "error",
        error: "Network error. Please check your connection and try again.",
      };
    }

    // Handle other errors
    console.error("Unexpected error:", error.message);
    return {
      status: "error",
      error: error.message || "An unexpected error occurred. Please try again.",
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

export const validatePhoneNumber = (phoneNumber: string): string | null => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  if (!phoneNumber.trim()) return "Phone number is required";
  if (!phoneRegex.test(phoneNumber)) return "Please enter a valid phone number";
  return null;
};

export const validateAddress = (address: { street: string; city: string; state: string; zipCode: string; country: string }): { [key: string]: string | null } => {
  const errors: { [key: string]: string | null } = {};

  if (!address.street?.trim()) errors.street = "Street address is required";
  if (!address.city?.trim()) errors.city = "City is required";
  if (!address.state?.trim()) errors.state = "State is required";
  if (!address.zipCode?.trim()) errors.zipCode = "ZIP code is required";
  if (!address.country?.trim()) errors.country = "Country is required";

  return errors;
};
