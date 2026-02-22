import tenantApi from "./tenantApi";

export interface ModuleSubscription {
    id: number;
    module_key: string;
    module_name: string;
    status: "active" | "inactive" | "trial" | "expired";
    is_active: boolean;
    expires_at: string | null;
}

export const getMyModules = async (): Promise<ModuleSubscription[]> => {
    const response = await tenantApi.get("/api/modules/my");
    if (response.data.success) {
        return response.data.data;
    }
    return [];
};

export const checkModuleAccess = async (key: string): Promise<boolean> => {
    const response = await tenantApi.get(`/api/modules/check/${key}`);
    return response.data.has_access;
};

export const subscribeToModule = async (key: string, type: string = "trial") => {
    const response = await tenantApi.post(`/api/modules/${key}/subscribe`, {
        subscription_type: type
    });
    return response.data;
};
