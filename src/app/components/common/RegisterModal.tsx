"use client";

import { useState } from "react";
import { X, Eye, EyeOff, AlertCircle, XCircle } from "react-feather";
import { registerUser, validateEmail, validatePassword, validateName, validatePasswordMatch } from "@/services/authService";
import { UserRole } from "@/lib/types";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  onSuccess?: () => void;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin, onSuccess }: RegisterModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const nameError = validateName(formData.name);
      const emailError = validateEmail(formData.email);
      const passwordError = validatePassword(formData.password);
      const confirmPasswordError = validatePasswordMatch(formData.password, formData.confirmPassword);

      if (nameError || emailError || passwordError || confirmPasswordError) {
        setErrors({
          name: nameError || undefined,
          email: emailError || undefined,
          password: passwordError || undefined,
          confirmPassword: confirmPasswordError || undefined,
        });
        return;
      }

      // Call register API
      const response = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: UserRole.endUser,
      });

      console.log("response: ", response);

      if (response.success) {
        // Registration successful
        console.log("Registration successful:", response.data);

        // Reset form
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          rememberMe: false,
        });
        setErrors({});

        onClose();
        onSuccess?.(); // Call success callback to refresh auth state

        // You can add a success message here
      } else {
        // Registration failed
        setErrors({
          general: response.error || "Registration failed. Please try again.",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({
        general: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSwitchToLogin = () => {
    onClose();
    setTimeout(() => onSwitchToLogin(), 150);
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-[941px] relative animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full cursor-pointer transition-colors">
          <XCircle size={18} />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-responsive-2xl leading-tight font-bold mb-2">Daftarkan Akun Anda</h2>
          <p className="text-gray-600 text-sm">Daftar untuk mengikuti lelang, berbelanja, dan mengakses fitur eksklusif.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* General Error Message */}
          {errors.general && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle size={16} />
              <span>{errors.general}</span>
            </div>
          )}

          <div className="grid grid-rows-2 grid-cols-2 gap-8">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors duration-200 ${
                  errors.name ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-gray-200"
                }`}
                required
              />
              <ErrorMessage error={errors.name} />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email address
              </label>
              <input
                type="email"
                id="email"
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
            <div className="row-start-2">
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
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

            {/* Confirm Password */}
            <div className="row-start-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                Konfirmasi Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="***********"
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors duration-200 ${
                    errors.confirmPassword ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-gray-200"
                  }`}
                  required
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200">
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <ErrorMessage error={errors.confirmPassword} />
            </div>
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
                Mendaftar...
              </>
            ) : (
              "Daftar"
            )}
          </button>
        </form>

        {/* Switch to Login */}
        <div className="mt-6">
          <p className="text-sm text-gray-600">
            Kamu sudah punya akun?{" "}
            <button onClick={handleSwitchToLogin} className="text-primary hover:text-primary/80 font-medium transition-colors duration-200 cursor-pointer">
              Masuk sekarang
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
