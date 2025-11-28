import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:1728",
});

AxiosInstance.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor untuk handle 4xx errors
AxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check kalo error response ada dan status code-nya 4xx
    if (error.response && error.response.status >= 400 && error.response.status < 500) {
      const errorMessage = error.response.data?.message || error.response.data?.error || "Terjadi kesalahan";

      // Emit custom event buat nampilin toast
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("api-error", {
            detail: {
              message: errorMessage,
              status: error.response.status,
            },
          })
        );
      }
    }

    return Promise.reject(error);
  }
);

export default AxiosInstance;
