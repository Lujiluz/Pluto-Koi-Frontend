"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Upload, XCircle } from "react-feather";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { BackendProduct } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/common/Toast";
import { createGuestPurchase, createUserPurchase, validateEmail, validatePhoneNumber, validateName, validateAddress, validateQuantity, validatePaymentProof, Address } from "@/services/transactionService";

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: BackendProduct | null;
  onSuccess?: () => void;
}

interface GuestFormData {
  name: string;
  email: string;
  phoneNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  quantity: number | string;
  paymentProof: File | null;
}

interface UserFormData {
  quantity: number | string;
  paymentProof: File | null;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  phoneNumber?: string;
  address?: Partial<Address>;
  quantity?: string;
  paymentProof?: string;
  general?: string;
}

export default function PurchaseModal({ isOpen, onClose, product, onSuccess }: PurchaseModalProps) {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Guest form data
  const [guestFormData, setGuestFormData] = useState<GuestFormData>({
    name: "",
    email: "",
    phoneNumber: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "Indonesia",
    },
    quantity: 1,
    paymentProof: null,
  });

  // User form data
  const [userFormData, setUserFormData] = useState<UserFormData>({
    quantity: 1,
    paymentProof: null,
  });

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          handleClose();
        }
      };

      document.addEventListener("keydown", handleEscape);

      return () => {
        document.body.style.overflow = originalStyle;
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isOpen]);

  const resetForm = () => {
    setGuestFormData({
      name: "",
      email: "",
      phoneNumber: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "Indonesia",
      },
      quantity: 1,
      paymentProof: null,
    });
    setUserFormData({
      quantity: 1,
      paymentProof: null,
    });
    setErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleGuestInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1] as keyof Address;
      setGuestFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else if (name === "quantity") {
      setGuestFormData((prev) => ({
        ...prev,
        [name]: value === "" ? "" : parseInt(value) || "",
      }));
    } else {
      setGuestFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "quantity") {
      setUserFormData((prev) => ({
        ...prev,
        [name]: value === "" ? "" : parseInt(value) || "",
      }));
    }

    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleQuantityBlur = () => {
    if (isAuthenticated) {
      if (userFormData.quantity === "" || userFormData.quantity === 0) {
        setUserFormData((prev) => ({
          ...prev,
          quantity: 1,
        }));
      }
    } else {
      if (guestFormData.quantity === "" || guestFormData.quantity === 0) {
        setGuestFormData((prev) => ({
          ...prev,
          quantity: 1,
        }));
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (isAuthenticated) {
      setUserFormData((prev) => ({
        ...prev,
        paymentProof: file,
      }));
    } else {
      setGuestFormData((prev) => ({
        ...prev,
        paymentProof: file,
      }));
    }

    if (errors.paymentProof) {
      setErrors((prev) => ({
        ...prev,
        paymentProof: undefined,
      }));
    }
  };

  const validateGuestForm = (): ValidationErrors => {
    const validationErrors: ValidationErrors = {};

    const nameError = validateName(guestFormData.name);
    if (nameError) validationErrors.name = nameError;

    const emailError = validateEmail(guestFormData.email);
    if (emailError) validationErrors.email = emailError;

    const phoneError = validatePhoneNumber(guestFormData.phoneNumber);
    if (phoneError) validationErrors.phoneNumber = phoneError;

    const addressErrors = validateAddress(guestFormData.address);
    if (Object.keys(addressErrors).length > 0) {
      validationErrors.address = addressErrors;
    }

    const quantity = typeof guestFormData.quantity === "string" ? parseInt(guestFormData.quantity) || 1 : guestFormData.quantity;
    const quantityError = validateQuantity(quantity);
    if (quantityError) validationErrors.quantity = quantityError;

    const fileError = validatePaymentProof(guestFormData.paymentProof);
    if (fileError) validationErrors.paymentProof = fileError;

    return validationErrors;
  };

  const validateUserForm = (): ValidationErrors => {
    const validationErrors: ValidationErrors = {};

    const quantity = typeof userFormData.quantity === "string" ? parseInt(userFormData.quantity) || 1 : userFormData.quantity;
    const quantityError = validateQuantity(quantity);
    if (quantityError) validationErrors.quantity = quantityError;

    const fileError = validatePaymentProof(userFormData.paymentProof);
    if (fileError) validationErrors.paymentProof = fileError;

    return validationErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    if (!product) {
      setErrors({ general: "Product information is missing" });
      setIsSubmitting(false);
      return;
    }

    try {
      let response;

      if (isAuthenticated) {
        const validationErrors = validateUserForm();
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          setIsSubmitting(false);
          return;
        }

        response = await createUserPurchase({
          productId: product._id,
          quantity: typeof userFormData.quantity === "string" ? parseInt(userFormData.quantity) || 1 : userFormData.quantity,
          paymentProof: userFormData.paymentProof!,
        });
      } else {
        const validationErrors = validateGuestForm();
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          setIsSubmitting(false);
          return;
        }

        response = await createGuestPurchase({
          name: guestFormData.name,
          email: guestFormData.email,
          phoneNumber: guestFormData.phoneNumber,
          address: guestFormData.address,
          productId: product._id,
          quantity: typeof guestFormData.quantity === "string" ? parseInt(guestFormData.quantity) || 1 : guestFormData.quantity,
          paymentProof: guestFormData.paymentProof!,
        });
      }

      if (response.success) {
        console.log("Purchase successful:", response.data);
        resetForm();
        onClose();
        onSuccess?.();

        showToast({
          type: "success",
          title: "Pembelian Berhasil!",
          message: "Pembelian Anda telah berhasil dibuat dan menunggu konfirmasi.",
        });

        setTimeout(() => {
          router.push("/transaksi");
        }, 2000);
      } else {
        setErrors({ general: "Purchase failed. Please try again." });
      }
    } catch (error: any) {
      console.error("Purchase error:", error);
      setErrors({
        general: error.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !product) return null;

  const currentFormData = isAuthenticated ? userFormData : guestFormData;
  const currentQuantity = typeof currentFormData.quantity === "string" ? parseInt(currentFormData.quantity) || 1 : currentFormData.quantity;
  const totalPrice = product.productPrice * currentQuantity;

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={handleBackdropClick}>
      <div className="bg-white rounded-2xl p-6 w-[941px] relative animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Close Button */}
        <button onClick={handleClose} className="absolute top-4 right-4 p-1 rounded-full cursor-pointer transition-colors">
          <XCircle size={18} />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl leading-tight font-bold mb-2">Beli Produk</h2>
          <p className="text-gray-600 text-sm">{isAuthenticated ? "Lengkapi form untuk melakukan pembelian produk" : "Lengkapi data diri untuk melakukan pembelian sebagai tamu"}</p>
        </div>

        {/* Product Info */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex gap-4">
            <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden flex-shrink-0">
              <Image src={product.media?.[0]?.fileUrl || "/images/products/produk_koi.png"} alt={product.productName} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">{product.productName}</h3>
              <p className="text-xs md:text-sm text-gray-600 mb-2">{product.productCategory?.name || "Produk"}</p>
              <p className="text-sm md:text-lg font-bold text-primary">{formatCurrency(product.productPrice)}</p>
            </div>
          </div>
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

          {/* Guest Form Fields */}
          {!isAuthenticated && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={guestFormData.name}
                    onChange={handleGuestInputChange}
                    placeholder="Masukkan nama lengkap"
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
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={guestFormData.email}
                    onChange={handleGuestInputChange}
                    placeholder="contoh@email.com"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors duration-200 ${
                      errors.email ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-gray-200"
                    }`}
                    required
                  />
                  <ErrorMessage error={errors.email} />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium mb-2">
                  Nomor Telepon <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={guestFormData.phoneNumber}
                  onChange={handleGuestInputChange}
                  placeholder="08123456789"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors duration-200 ${
                    errors.phoneNumber ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-gray-200"
                  }`}
                  required
                />
                <ErrorMessage error={errors.phoneNumber} />
              </div>

              {/* Address Fields */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Alamat Pengiriman</h4>

                {/* Street */}
                <div>
                  <label htmlFor="address.street" className="block text-sm font-medium mb-2">
                    Alamat Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="address.street"
                    name="address.street"
                    value={guestFormData.address.street}
                    onChange={handleGuestInputChange}
                    placeholder="Jalan, Nomor Rumah, RT/RW"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors duration-200 ${
                      errors.address?.street ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-gray-200"
                    }`}
                    required
                  />
                  <ErrorMessage error={errors.address?.street} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* City */}
                  <div>
                    <label htmlFor="address.city" className="block text-sm font-medium mb-2">
                      Kota <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="address.city"
                      name="address.city"
                      value={guestFormData.address.city}
                      onChange={handleGuestInputChange}
                      placeholder="Jakarta"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors duration-200 ${
                        errors.address?.city ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-gray-200"
                      }`}
                      required
                    />
                    <ErrorMessage error={errors.address?.city} />
                  </div>

                  {/* State */}
                  <div>
                    <label htmlFor="address.state" className="block text-sm font-medium mb-2">
                      Provinsi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="address.state"
                      name="address.state"
                      value={guestFormData.address.state}
                      onChange={handleGuestInputChange}
                      placeholder="DKI Jakarta"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors duration-200 ${
                        errors.address?.state ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-gray-200"
                      }`}
                      required
                    />
                    <ErrorMessage error={errors.address?.state} />
                  </div>

                  {/* ZIP Code */}
                  <div>
                    <label htmlFor="address.zipCode" className="block text-sm font-medium mb-2">
                      Kode Pos <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="address.zipCode"
                      name="address.zipCode"
                      value={guestFormData.address.zipCode}
                      onChange={handleGuestInputChange}
                      placeholder="12345"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors duration-200 ${
                        errors.address?.zipCode ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-gray-200"
                      }`}
                      required
                    />
                    <ErrorMessage error={errors.address?.zipCode} />
                  </div>

                  {/* Country */}
                  <div>
                    <label htmlFor="address.country" className="block text-sm font-medium mb-2">
                      Negara <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="address.country"
                      name="address.country"
                      value={guestFormData.address.country}
                      onChange={handleGuestInputChange}
                      placeholder="Indonesia"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors duration-200 ${
                        errors.address?.country ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-gray-200"
                      }`}
                      required
                    />
                    <ErrorMessage error={errors.address?.country} />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Quantity */}
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium mb-2">
              Jumlah <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={currentFormData.quantity}
              onChange={isAuthenticated ? handleUserInputChange : handleGuestInputChange}
              onBlur={handleQuantityBlur}
              min="1"
              max="100"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors duration-200 ${
                errors.quantity ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-gray-200"
              }`}
              required
            />
            <ErrorMessage error={errors.quantity} />
          </div>

          {/* Payment Proof */}
          <div>
            <label htmlFor="paymentProof" className="block text-sm font-medium mb-2">
              Bukti Pembayaran <span className="text-red-500">*</span>
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-200 ${
                errors.paymentProof ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100"
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={24} className="mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600 mb-1">{currentFormData.paymentProof ? `File dipilih: ${currentFormData.paymentProof.name}` : "Klik untuk upload bukti pembayaran"}</p>
              <p className="text-xs text-gray-500">Format yang didukung: JPG, PNG, WebP (Max 5MB)</p>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/jpeg,image/jpg,image/png,image/webp" className="hidden" required />
            </div>
            <ErrorMessage error={errors.paymentProof} />
          </div>

          {/* Total Price */}
          <div className="bg-primary/5 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">Total Pembayaran:</span>
              <span className="text-xl font-bold text-primary">{formatCurrency(totalPrice)}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/70 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                Memproses...
              </>
            ) : (
              "Beli Sekarang"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
