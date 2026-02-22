import api from './api';

export interface SubscriptionPlan {
    id: number;
    name: string;
    plan_key: string;
    description: string;
    price_monthly: number;
    price_yearly: number;
    currency: string;
    features: string[];
    quotas: Record<string, number>;
}

export interface TenantSubscription {
    id: number;
    tenant_id: number;
    subscription_plan_id: number;
    status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'expired';
    billing_cycle: 'monthly' | 'yearly';
    trial_ends_at: string | null;
    renews_at: string | null;
    canceled_at: string | null;
    ends_at: string | null;
    auto_renew: boolean;
    plan?: SubscriptionPlan;
}

export const billingApi = {
    getPlans: async () => {
        const response = await api.get('/subscriptions/plans');
        return response.data;
    },

    getStatus: async () => {
        const response = await api.get('/subscriptions/status');
        return response.data;
    },

    cancelSubscription: async () => {
        const response = await api.post('/subscriptions/cancel');
        return response.data;
    },

    reactivateSubscription: async () => {
        const response = await api.post('/subscriptions/reactivate');
        return response.data;
    },

    getPaymentHistory: async () => {
        const response = await api.get('/payment/history');
        return response.data;
    },

    getInvoices: async () => {
        const response = await api.get('/invoices');
        return response.data;
    }
};
