export const COLORS = {
  primary: {
    50: "#FFE5E5",
    100: "#FFCCCC",
    200: "#FF9999",
    300: "#FF6666",
    400: "#FF3333",
    500: "#FD0001",
    600: "#E60001",
    700: "#CC0001",
    800: "#B30001",
    900: "#990001",
    DEFAULT: "#FD0001",
  },
  white: "#FFFFFF",
  black: "#050505",
  gray: {
    50: "#F9F9F9",
    100: "#F3F3F3",
    200: "#E7E7E7",
    300: "#DBDBDB",
    400: "#CFCFCF",
    500: "#C3C3C3",
    600: "#9C9C9C",
    700: "#757575",
    800: "#4E4E4E",
    900: "#272727",
  },
} as const;

export const FONTS = {
  primary: "Poppins, sans-serif",
  sans: 'Poppins, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
} as const;

export const BREAKPOINTS = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

export const SPACING = {
  container: {
    padding: {
      mobile: "1rem",
      tablet: "1.5rem",
      desktop: "2rem",
    },
    maxWidth: "80rem", // 1280px
  },
  section: {
    padding: {
      mobile: "3rem 0",
      tablet: "4rem 0",
      desktop: "5rem 0",
    },
  },
  button: {
    padding: {
      sm: "0.5rem 1rem",
      md: "0.75rem 1.5rem",
      lg: "1rem 2rem",
    },
  },
  card: {
    padding: "1.5rem",
    borderRadius: "0.5rem",
  },
} as const;

export const ANIMATION = {
  transition: {
    fast: "0.15s ease",
    normal: "0.2s ease",
    slow: "0.3s ease",
  },
  easing: {
    ease: "ease",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
  },
} as const;

export const SHADOWS = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  primary: "0 4px 14px 0 rgba(253, 0, 1, 0.15)",
} as const;

export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal: 1040,
  popover: 1050,
  tooltip: 1060,
  toast: 1070,
} as const;

// Navigation items
export const NAVIGATION = {
  main: [
    { label: "Beranda", href: "/#beranda" },
    { label: "Fitur", href: "/#fitur" },
    { label: "Lelang", href: "/lelang" },
    { label: "Galeri", href: "/#galeri" },
    { label: "Belanja", href: "/belanja" },
  ],
} as const;

// Site configuration
export const SITE_CONFIG = {
  name: "Pluto Koi",
  description: "Temukan Keseruan Lelang & Belanja Ikan Favoritmu!",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  logo: "/images/pluto-koi-logo.svg",
  favicon: "/images/pluto-koi-icon.svg",
} as const;

// Whatsapp Message Templates
export const WHATSAPP_TEMPLATES = {
  inquiry: "Halo, saya tertarik dengan ikan/plankton/produk yang Anda tawarkan di Pluto Koi. Bisa tolong berikan informasi lebih lanjut?",
  order: "Halo, saya ingin memesan ikan/plankton/produk dari Pluto Koi. Berikut detail pesanan saya:",
  general: "Halo, saya ingin bertanya lebih lanjut tentang Pluto Koi.",
  auctionWinConfirmation: (auctionName: string, userName: string) => `Halo, Saya ${userName} adalah pemenang bid "${auctionName}" dan hendak mengirimkan bukti pembayaran sebagai berikut.`,
};
