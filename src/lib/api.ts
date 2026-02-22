import axios from "axios";

/**
 * api — Unified Axios instance for the multi-tenant dashboard.
 * Provides Laravel Sanctum & CSRF support.
 */
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
    withCredentials: true,
    headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Accept": "application/json",
        "Content-Type": "application/json",
    },
});

// Interceptor for CSRF
api.interceptors.request.use(config => {
    if (typeof document !== "undefined") {
        const token = document.cookie
            .split("; ")
            .find(row => row.startsWith("XSRF-TOKEN="))
            ?.split("=")[1];

        if (token) {
            config.headers["X-XSRF-TOKEN"] = decodeURIComponent(token);
        }
    }
    return config;
});

export default api;
