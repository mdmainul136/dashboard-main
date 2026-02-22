import axios from "axios";

/**
 * iorApi — Centralized Axios instance for IOR Module.
 * Handles multi-tenant routing and Laravel Sanctum compatibility.
 */
const iorApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "", // Empty for relative calls on same domain
    withCredentials: true,
    headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Accept": "application/json",
        "Content-Type": "application/json",
    },
});

// Add CSRF token support for Laravel Sanctum
iorApi.interceptors.request.use(config => {
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

// Error handling interceptor
iorApi.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            console.error("Unauthorized. Redirecting to login or handling session...");
        }
        return Promise.reject(error);
    }
);

export default iorApi;
