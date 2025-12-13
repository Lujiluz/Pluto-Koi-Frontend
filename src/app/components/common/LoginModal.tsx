"use client";

import { useState, useEffect } from "react";
import { X, Eye, EyeOff, AlertCircle, XCircle, CheckCircle } from "react-feather";
import { loginUser, validateEmail, validatePassword } from "@/services/authService";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
  onSuccess?: () => void;
  showVerifiedMessage?: boolean; // Show success message when user just verified their account
}

interface ValidationErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginModal({ isOpen, onClose, onSwitchToRegister, onSuccess, showVerifiedMessage = false }: LoginModalProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVerified, setShowVerified] = useState(showVerifiedMessage);

  // Update showVerified when prop changes
  useEffect(() => {
    setShowVerified(showVerifiedMessage);
  }, [showVerifiedMessage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Real-time validation - clear error when user starts typing
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      // Client-side validation
      const emailError = validateEmail(formData.email);
      const passwordError = validatePassword(formData.password);

      if (emailError || passwordError) {
        setErrors({
          email: emailError || undefined,
          password: passwordError || undefined,
        });
        return;
      }

      // Call login API
      const response = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      console.log("Login response received:", response);

      if (response.status === "success") {
        // Login successful
        console.log("Login successful:", response.data);
        setShowVerified(false); // Clear verified message

        // Reset form
        setFormData({
          email: "",
          password: "",
          rememberMe: false,
        });
        setErrors({});

        // Call success callback first to refresh auth state
        if (onSuccess) {
          console.log("Calling onSuccess callback to refresh auth state");
          onSuccess();
        }

        // Then close modal
        onClose();
      } else {
        // Login failed - handle specific approval-related errors
        console.log("Login failed:", response.error);
        const errorMessage = response.error || "Login failed. Please try again.";

        // Check for specific error messages from backend
        if (errorMessage.toLowerCase().includes("pending approval") || errorMessage.toLowerCase().includes("pending")) {
          setErrors({
            general: "Akun Anda masih menunggu persetujuan admin. Silakan tunggu email konfirmasi.",
          });
        } else if (errorMessage.toLowerCase().includes("rejected") || errorMessage.toLowerCase().includes("ditolak")) {
          setErrors({
            general: "Pendaftaran Anda ditolak. Silakan hubungi support untuk informasi lebih lanjut.",
          });
        } else if (errorMessage.toLowerCase().includes("blocked") || errorMessage.toLowerCase().includes("banned")) {
          setErrors({
            general: "Akun Anda telah diblokir. Silakan hubungi support.",
          });
        } else if (errorMessage.toLowerCase().includes("deleted") || errorMessage.toLowerCase().includes("dihapus")) {
          setErrors({
            general: "Akun ini telah dihapus.",
          });
        } else {
          setErrors({
            general: errorMessage,
          });
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({
        general: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSwitchToRegister = () => {
    onClose();
    setTimeout(() => onSwitchToRegister(), 150);
  };

  if (!isOpen) return null;

  const ErrorMessage = ({ error }: { error?: string }) => {
    if (!error) return null;
    return (
      <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
        <AlertCircle size={14} />
        <span>{error}</span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6">
      <div
        className="bg-white rounded-2xl p-6 sm:p-8 relative animate-in fade-in-0 zoom-in-95 duration-200
  w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}

        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full cursor-pointer transition-colors">
          <XCircle size={18} />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-responsive-2xl leading-tight font-bold mb-2">Masuk ke Akun Anda</h2>
          <p className="text-gray-600 text-sm">Masuk untuk mengikuti lelang, berbelanja, dan mengakses fitur eksklusif.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Verified Success Message */}
          {showVerified && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              <CheckCircle size={16} className="flex-shrink-0" />
              <span>✅ Akun Anda telah diverifikasi! Silakan login untuk melanjutkan.</span>
            </div>
          )}

          {/* General Error Message */}
          {errors.general && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle size={16} />
              <span>{errors.general}</span>
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="loginEmail" className="block text-sm font-medium mb-2">
              Email address
            </label>
            <input
              type="email"
              id="loginEmail"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="john.doe@example.com"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors duration-200 ${
                errors.email ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-gray-200"
              }`}
              required
            />
            <ErrorMessage error={errors.email} />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="loginPassword" className="block text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="loginPassword"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="***********"
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors duration-200 ${
                  errors.password ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-gray-200"
                }`}
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <ErrorMessage error={errors.password} />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleInputChange} className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary/20" />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            <button type="button" className="text-sm text-primary hover:text-primary/80 transition-colors duration-200">
              Lupa Password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-40 bg-primary hover:bg-primary/90 disabled:bg-primary/70 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 mt-6 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                Masuk...
              </>
            ) : (
              "Masuk"
            )}
          </button>
        </form>

        {/* Switch to Register */}
        <div className="mt-6">
          <p className="text-sm text-gray-600">
            Kamu belum punya akun?{" "}
            <button onClick={handleSwitchToRegister} className="text-primary hover:text-primary/80 font-medium transition-colors duration-200 cursor-pointer">
              Daftar sekarang
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
