"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { billingApi, SubscriptionPlan, TenantSubscription } from "@/lib/billingApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
    CreditCard,
    History,
    Zap,
    CheckCircle2,
    AlertCircle,
    ArrowUpCircle,
    Calendar,
    ShieldCheck,
    Package,
    Users,
    HardDrive,
    FileText
} from "lucide-react";
import { toast } from "sonner";

const BillingPage = () => {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [subscription, setSubscription] = useState<TenantSubscription | null>(null);
    const [loading, setLoading] = useState(true);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [plansRes, statusRes] = await Promise.all([
                billingApi.getPlans(),
                billingApi.getStatus()
            ]);
            setPlans(plansRes.data);
            setSubscription(statusRes.data.subscription);
            if (statusRes.data.subscription?.billing_cycle) {
                setBillingCycle(statusRes.data.subscription.billing_cycle);
            }
        } catch (error) {
            console.error("Error fetching billing data:", error);
            toast.error("Failed to load billing information");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        try {
            await billingApi.cancelSubscription();
            toast.success("Subscription canceled successfully");
            fetchData();
        } catch (error) {
            toast.error("Failed to cancel subscription");
        }
    };

    const handleReactivate = async () => {
        try {
            await billingApi.reactivateSubscription();
            toast.success("Subscription reactivated!");
            fetchData();
        } catch (error) {
            toast.error("Failed to reactivate subscription");
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </DashboardLayout>
        );
    }

    const activePlan = subscription?.plan;
    const isTrial = subscription?.status === 'trialing';

    return (
        <DashboardLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">Billing & Subscription</h1>
                <p className="mt-1 text-sm text-muted-foreground">Manage your plan, billing history, and usage limits</p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Current Plan Overview */}
                <Card className="lg:col-span-2 border-primary/20 bg-primary/5">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="space-y-1">
                            <CardTitle className="text-xl flex items-center gap-2">
                                {activePlan?.name || "Free Tier"}
                                {subscription?.status === 'active' && <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Active</Badge>}
                                {isTrial && <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Trialing</Badge>}
                                {subscription?.status === 'canceled' && <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20">Ending Soon</Badge>}
                            </CardTitle>
                            <CardDescription>
                                {activePlan?.description || "Basic access to platform features"}
                            </CardDescription>
                        </div>
                        <Zap className="h-8 w-8 text-primary opacity-50" />
                    </CardHeader>
                    <CardContent>
                        <div className="mt-4 flex flex-wrap gap-8">
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Renewal Date</p>
                                <p className="text-sm font-medium flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    {subscription?.renews_at ? new Date(subscription.renews_at).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Billing Cycle</p>
                                <p className="text-sm font-medium capitalize">{subscription?.billing_cycle || 'N/A'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Price</p>
                                <p className="text-sm font-medium">
                                    {activePlan ? `$${subscription?.billing_cycle === 'yearly' ? activePlan.price_yearly : activePlan.price_monthly}` : 'Free'}
                                </p>
                            </div>
                        </div>

                        {subscription?.status === 'canceled' && (
                            <div className="mt-6 flex items-center gap-3 p-3 rounded-lg bg-rose-500/5 border border-rose-500/10">
                                <AlertCircle className="h-5 w-5 text-rose-500" />
                                <p className="text-xs text-rose-600 font-medium">
                                    Your subscription was canceled and will expire on {new Date(subscription.ends_at!).toLocaleDateString()}.
                                </p>
                                <Button variant="outline" size="sm" className="ml-auto text-rose-600 hover:bg-rose-500/10" onClick={handleReactivate}>
                                    Reactivate
                                </Button>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="border-t border-primary/10 pt-4 flex gap-3">
                        <Button className="gap-2">
                            <ArrowUpCircle className="h-4 w-4" /> Upgrade Plan
                        </Button>
                        {subscription?.status === 'active' && (
                            <Button variant="ghost" className="text-muted-foreground hover:text-rose-500" onClick={handleCancel}>
                                Cancel Subscription
                            </Button>
                        )}
                    </CardFooter>
                </Card>

                {/* Usage Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-primary" /> Usage Limits
                        </CardTitle>
                        <CardDescription>Monitor your resource consumption</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-medium">
                                <span className="flex items-center gap-1.5"><Package className="h-3.5 w-3.5" /> Products</span>
                                <span>45 / {activePlan?.quotas?.max_products === -1 ? 'Unlimited' : activePlan?.quotas?.max_products || 20}</span>
                            </div>
                            <Progress value={45} className="h-1.5" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-medium">
                                <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> Admin Users</span>
                                <span>1 / {activePlan?.quotas?.max_users === -1 ? 'Unlimited' : activePlan?.quotas?.max_users || 1}</span>
                            </div>
                            <Progress value={100} className="h-1.5 bg-primary/10" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-medium">
                                <span className="flex items-center gap-1.5"><HardDrive className="h-3.5 w-3.5" /> Storage</span>
                                <span>1.2 GB / {activePlan?.quotas?.storage_gb || 2} GB</span>
                            </div>
                            <Progress value={60} className="h-1.5" />
                        </div>
                    </CardContent>
                </Card>

                {/* Plan Selection Tabs */}
                <div className="lg:col-span-3 mt-4">
                    <div className="flex flex-col items-center mb-8">
                        <h2 className="text-2xl font-bold">Choose the best plan for your scale</h2>
                        <div className="flex items-center gap-4 mt-4 p-1 rounded-full bg-muted border border-border">
                            <button
                                onClick={() => setBillingCycle('monthly')}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${billingCycle === 'monthly' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setBillingCycle('yearly')}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${billingCycle === 'yearly' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                Yearly <Badge className="ml-1 bg-emerald-500/15 text-emerald-500 border-none text-[10px]">Save 20%</Badge>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {plans.map((plan) => {
                            const isActive = activePlan?.plan_key === plan.plan_key;
                            const price = billingCycle === 'yearly' ? plan.price_yearly : plan.price_monthly;
                            const period = billingCycle === 'yearly' ? '/yr' : '/mo';

                            return (
                                <Card key={plan.id} className={`relative flex flex-col ${isActive ? 'border-primary ring-1 ring-primary' : ''}`}>
                                    {isActive && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                            Current Plan
                                        </div>
                                    )}
                                    <CardHeader>
                                        <CardTitle>{plan.name}</CardTitle>
                                        <CardDescription>{plan.description}</CardDescription>
                                        <div className="mt-4 flex items-baseline gap-1">
                                            <span className="text-3xl font-bold">${price}</span>
                                            <span className="text-sm text-muted-foreground">{period}</span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <ul className="space-y-2.5">
                                            {(plan.features as any).map((feature: string) => (
                                                <li key={feature} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                                                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                    <CardFooter>
                                        <Button
                                            className="w-full"
                                            variant={isActive ? "outline" : "default"}
                                            disabled={isActive}
                                        >
                                            {isActive ? "Manage Plan" : "Upgrade to " + plan.name}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                </div>

                {/* Tabs for Invoices and Payment Methods */}
                <div className="lg:col-span-3 mt-8">
                    <Tabs defaultValue="invoices">
                        <TabsList className="bg-muted/50 border border-border">
                            <TabsTrigger value="invoices" className="gap-2"><FileText className="h-4 w-4" /> Invoices</TabsTrigger>
                            <TabsTrigger value="payment-methods" className="gap-2"><CreditCard className="h-4 w-4" /> Payment Methods</TabsTrigger>
                            <TabsTrigger value="history" className="gap-2"><History className="h-4 w-4" /> Billing History</TabsTrigger>
                        </TabsList>

                        <TabsContent value="invoices" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base font-semibold">Recent Invoices</CardTitle>
                                    <CardDescription>Download your previous payment statements</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="rounded-lg border border-border">
                                        <div className="grid grid-cols-4 bg-muted/50 p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                            <span>Invoice URL</span>
                                            <span>Date</span>
                                            <span>Amount</span>
                                            <span className="text-right">Action</span>
                                        </div>
                                        {/* Placeholder for real data */}
                                        <div className="divide-y divide-border">
                                            <div className="grid grid-cols-4 p-4 text-sm items-center hover:bg-muted/30 transition-colors">
                                                <span className="font-medium">INV-2026-0042</span>
                                                <span className="text-muted-foreground">Feb 22, 2026</span>
                                                <span className="font-semibold">$79.00</span>
                                                <div className="text-right">
                                                    <Button variant="ghost" size="sm" className="h-8 text-xs text-primary">Download PDF</Button>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-4 p-4 text-sm items-center hover:bg-muted/30 transition-colors">
                                                <span className="font-medium">INV-2026-0015</span>
                                                <span className="text-muted-foreground">Jan 22, 2026</span>
                                                <span className="font-semibold">$79.00</span>
                                                <div className="text-right">
                                                    <Button variant="ghost" size="sm" className="h-8 text-xs text-primary">Download PDF</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="payment-methods" className="mt-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="text-base font-semibold">Payment Methods</CardTitle>
                                        <CardDescription>Manage your stored cards and accounts</CardDescription>
                                    </div>
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <CreditCard className="h-4 w-4" /> Add Card
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-4 p-4 rounded-xl border border-primary/20 bg-primary/5">
                                        <div className="h-10 w-14 bg-white rounded-md border flex items-center justify-center shadow-sm">
                                            <span className="text-[10px] font-bold text-blue-800">VISA</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold flex items-center gap-2">
                                                •••• •••• •••• 4242
                                                <Badge variant="secondary" className="text-[10px] h-5 bg-primary/10 text-primary border-none">Default</Badge>
                                            </p>
                                            <p className="text-xs text-muted-foreground">Expires 12/28</p>
                                        </div>
                                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-rose-500">Remove</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default BillingPage;
