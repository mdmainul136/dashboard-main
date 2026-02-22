import axios from "axios";

/**
 * trackingApi — Centralized Axios instance for sGTM & Tracking Module.
 * Connects to Laravel backend tracking endpoints.
 */
const trackingApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "",
    withCredentials: true,
    headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Accept": "application/json",
        "Content-Type": "application/json",
    },
});

// CSRF token interceptor (identical to iorApi for consistency)
trackingApi.interceptors.request.use(config => {
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

export default trackingApi;
