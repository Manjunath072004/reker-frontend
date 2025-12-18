import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    //  Do NOT attach token for auth-related APIs
    if (
      config.url.includes("/auth/login") ||
      config.url.includes("/auth/signup") ||
      config.url.includes("/auth/verify") ||
      config.url.includes("/auth/resend") ||
      config.url.includes("/auth/check")
    ) {
      return config;
    }

    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
