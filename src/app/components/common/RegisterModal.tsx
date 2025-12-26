"use client";

import { useState } from "react";
import { X, Eye, EyeOff, AlertCircle, XCircle, CheckCircle, Mail } from "react-feather";
import { registerUser, validateEmail, validatePassword, validateName, validatePasswordMatch, validatePhoneNumber, validateAddress } from "@/services/authService";
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
  phoneNumber?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  general?: string;
}

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin, onSuccess }: RegisterModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    // Handle address fields
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: newValue as string,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    }

    // Real-time validation - clear error when user starts typing
    const errorKey = name.startsWith("address.") ? name.split(".")[1] : name;
    if (errors[errorKey as keyof ValidationErrors]) {
      setErrors((prev) => ({
        ...prev,
        [errorKey]: undefined,
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
      const phoneNumberError = validatePhoneNumber(formData.phoneNumber);
      const addressErrors = validateAddress(formData.address);

      if (nameError || emailError || passwordError || confirmPasswordError || phoneNumberError || Object.values(addressErrors).some((error) => error)) {
        setErrors({
          name: nameError || undefined,
          email: emailError || undefined,
          password: passwordError || undefined,
          confirmPassword: confirmPasswordError || undefined,
          phoneNumber: phoneNumberError || undefined,
          street: addressErrors.street || undefined,
          city: addressErrors.city || undefined,
          state: addressErrors.state || undefined,
          zipCode: addressErrors.zipCode || undefined,
          country: addressErrors.country || undefined,
        });
        return;
      }

      // Call register API
      const response = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        role: UserRole.endUser,
        address: formData.address,
      });

      console.log("response: ", response);

      if (response.status === "success") {
        // Registration successful - show pending approval message
        console.log("Registration successful:", response.data);
        setRegistrationSuccess(true);

        // Reset form data (but keep success state)
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          phoneNumber: "",
          address: {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
          },
          rememberMe: false,
        });
        setErrors({});

        // Note: We don't close the modal or call onSuccess here
        // because user needs to wait for admin approval
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
    setRegistrationSuccess(false); // Reset success state when switching
    onClose();
    setTimeout(() => onSwitchToLogin(), 150);
  };

  const handleClose = () => {
    setRegistrationSuccess(false); // Reset success state when closing
    onClose();
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
        className=" bg-white rounded-2xl p-6 sm:p-8 relative animate-in fade-in-0 zoom-in-95 duration-200
  w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl max-h-[90vh] overflow-y-auto no-scrollbar"
      >
        {/* Close Button */}
        <button onClick={handleClose} className="absolute top-4 right-4 p-1 rounded-full cursor-pointer transition-colors">
          <XCircle size={18} />
        </button>

        {/* Show Success Message when registration is pending approval */}
        {registrationSuccess ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail size={40} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Pendaftaran Berhasil! 🎉</h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-green-800 font-medium mb-2">Akun Anda sedang menunggu persetujuan</p>
                  <p className="text-green-700 text-sm">Tim admin kami akan meninjau pendaftaran Anda. Setelah disetujui, Anda akan menerima email dengan link verifikasi untuk mengaktifkan akun.</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-gray-600 text-sm">
                <strong>Catatan:</strong> Proses persetujuan biasanya memakan waktu 1-2 hari kerja. Pastikan untuk memeriksa folder spam/junk jika email tidak masuk ke inbox.
              </p>
            </div>
            <button onClick={handleClose} className="bg-primary hover:bg-primary/90 text-white py-3 px-8 rounded-lg font-medium transition-colors duration-200">
              Mengerti
            </button>
          </div>
        ) : (
          <>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
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

                {/* Phone Number */}
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium mb-2">
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="+62 812-3456-7890"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors duration-200 ${
                      errors.phoneNumber ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-gray-200"
                    }`}
                    required
                  />
                  <ErrorMessage error={errors.phoneNumber} />
                </div>

                {/* Street Address */}
                <div>
                  <label htmlFor="address.street" className="block text-sm font-medium mb-2">
                    Alamat Lengkap
                  </label>
                  <input
                    type="text"
                    id="address.street"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleInputChange}
                    placeholder="Jl. Merdeka No. 123"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors duration-200 ${
                      errors.street ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-gray-200"
                    }`}
                    required
                  />
                  <ErrorMessage error={errors.street} />
                </div>

                {/* Password */}
                <div>
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
                <div>
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

                {/* City */}
                <div>
                  <label htmlFor="address.city" className="block text-sm font-medium mb-2">
                    Kota
                  </label>
                  <input
                    type="text"
                    id="address.city"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleInputChange}
                    placeholder="Jakarta"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors duration-200 ${
                      errors.city ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-gray-200"
                    }`}
                    required
                  />
                  <ErrorMessage error={errors.city} />
                </div>

                {/* State */}
                <div>
                  <label htmlFor="address.state" className="block text-sm font-medium mb-2">
                    Provinsi
                  </label>
                  <input
                    type="text"
                    id="address.state"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleInputChange}
                    placeholder="DKI Jakarta"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors duration-200 ${
                      errors.state ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-gray-200"
                    }`}
                    required
                  />
                  <ErrorMessage error={errors.state} />
                </div>
              </div>

              {/* Additional Address Fields Row */}
              <div className="grid grid-cols-2 gap-4 md:gap-8 mt-4">
                {/* ZIP Code */}
                <div>
                  <label htmlFor="address.zipCode" className="block text-sm font-medium mb-2">
                    Kode Pos
                  </label>
                  <input
                    type="text"
                    id="address.zipCode"
                    name="address.zipCode"
                    value={formData.address.zipCode}
                    onChange={handleInputChange}
                    placeholder="12345"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors duration-200 ${
                      errors.zipCode ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-gray-200"
                    }`}
                    required
                  />
                  <ErrorMessage error={errors.zipCode} />
                </div>

                {/* Country */}
                <div>
                  <label htmlFor="address.country" className="block text-sm font-medium mb-2">
                    Negara
                  </label>
                  <input
                    type="text"
                    id="address.country"
                    name="address.country"
                    value={formData.address.country}
                    onChange={handleInputChange}
                    placeholder="Indonesia"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors duration-200 ${
                      errors.country ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-gray-200"
                    }`}
                    required
                  />
                  <ErrorMessage error={errors.country} />
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
          </>
        )}
      </div>
    </div>
  );
}
