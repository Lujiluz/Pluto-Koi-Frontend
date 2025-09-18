import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names with clsx and merges Tailwind classes with tailwind-merge
 * @param inputs - Class values to combine
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Typography utility classes for consistent text styling
 */
export const typography = {
  // Headings
  h1: "text-responsive-3xl font-bold text-black font-poppins",
  h2: "text-responsive-2xl font-semibold text-black font-poppins",
  h3: "text-responsive-xl font-semibold text-black font-poppins",
  h4: "text-responsive-lg font-medium text-black font-poppins",
  h5: "text-responsive-base font-medium text-black font-poppins",
  h6: "text-responsive-sm font-medium text-black font-poppins",

  // Body text
  body: "text-responsive-base text-black font-poppins",
  bodyLarge: "text-responsive-lg text-black font-poppins",
  bodySmall: "text-responsive-sm text-black font-poppins",

  // Utility text
  caption: "text-responsive-sm text-gray-600 font-poppins",
  small: "text-xs text-gray-600 font-poppins",
  lead: "text-responsive-lg text-gray-700 font-poppins",

  // Special styles
  primary: "text-primary font-poppins",
  muted: "text-gray-600 font-poppins",
  white: "text-white font-poppins",
} as const;

/**
 * Button variant utility classes
 */
export const buttonVariants = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  outline: "btn-outline",
} as const;

/**
 * Format currency to Indonesian Rupiah
 * @param amount - Amount to format
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format number with thousands separator
 * @param num - Number to format
 * @returns Formatted number string
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("id-ID").format(num);
}

/**
 * Generate initials from a name
 * @param name - Full name
 * @returns Initials string
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Truncate text to specified length
 * @param text - Text to truncate
 * @param length - Maximum length
 * @returns Truncated text with ellipsis
 */
export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

/**
 * Check if email is valid
 * @param email - Email to validate
 * @returns Boolean indicating if email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if phone number is valid (Indonesian format)
 * @param phone - Phone number to validate
 * @returns Boolean indicating if phone is valid
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+62|62|0)[8][1-9][0-9]{6,9}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ""));
}

/**
 * Format date to Indonesian locale
 * @param date - Date to format
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("id-ID", options).format(dateObj);
}

/**
 * Format time to Indonesian locale
 * @param date - Date to format
 * @returns Formatted time string
 */
export function formatTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  }).format(dateObj);
}

/**
 * Calculate time remaining for countdown
 * @param endDate - End date for countdown
 * @returns Object with days, hours, minutes, seconds
 */
export function getTimeRemaining(endDate: Date | string) {
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;
  const now = new Date();
  const difference = end.getTime() - now.getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isExpired: false };
}

/**
 * Debounce function
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Generate random ID
 * @param length - Length of ID
 * @returns Random ID string
 */
export function generateId(length: number = 8): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Sleep function for async operations
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after specified time
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
