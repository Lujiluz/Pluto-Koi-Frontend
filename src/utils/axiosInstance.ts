import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: process.env.BACKEND_BASE_URL,
});

AxiosInstance.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default AxiosInstance;
