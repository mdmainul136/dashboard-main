import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const tenantApi = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

export const registerTenant = async (data: any) => {
    const response = await tenantApi.post("/api/tenants/register", data);
    return response.data;
};

export const checkProvisioningStatus = async (tenantId: string) => {
    const response = await tenantApi.get(`/api/tenants/${tenantId}/status`);
    return response.data;
};

export default tenantApi;
