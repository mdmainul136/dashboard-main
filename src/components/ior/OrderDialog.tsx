"use client";

import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Globe, Package, User, ShoppingCart, Loader2, DollarSign, RefreshCw } from "lucide-react";
import { PriceBreakdown } from "./PriceBreakdown";
import { useIorOrders } from "@/hooks/ior/useIorOrders";
import { toast } from "sonner";

interface OrderDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function OrderDialog({ open, onOpenChange }: OrderDialogProps) {
    const { createOrder } = useIorOrders();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        product_url: "",
        product_name: "",
        customer_name: "",
        source_marketplace: "amazon",
        price_usd: "",
        quantity: "1",
    });

    const [calculation, setCalculation] = useState({
        price_usd: 0,
        estimated_duty_bdt: 0,
        shipping_fee_bdt: 500, // Fixed base for now
        total_landed_bdt: 0,
    });

    const exchangeRate = 120;

    useEffect(() => {
        const usd = parseFloat(formData.price_usd) || 0;
        const qty = parseInt(formData.quantity) || 1;
        const baseBdt = usd * exchangeRate * qty;

        // Simple mock calculation logic
        const duty = baseBdt * 0.25; // 25% duty
        const shipping = 500 * qty;
        const margin = baseBdt * 0.15; // 15% margin

        setCalculation({
            price_usd: usd,
            estimated_duty_bdt: Math.round(duty),
            shipping_fee_bdt: shipping,
            total_landed_bdt: Math.round(baseBdt + duty + shipping + margin),
        });
    }, [formData.price_usd, formData.quantity]);

    const handleChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.product_url || !formData.product_name || !formData.customer_name || !formData.price_usd) {
            toast.error("Please fill in all required fields");
            return;
        }

        setIsSubmitting(true);
        const success = await createOrder({
            ...formData,
            price_usd: parseFloat(formData.price_usd),
            quantity: parseInt(formData.quantity),
            final_price_bdt: calculation.total_landed_bdt
        });

        if (success) {
            onOpenChange(false);
            setFormData({
                product_url: "",
                product_name: "",
                customer_name: "",
                source_marketplace: "amazon",
                price_usd: "",
                quantity: "1",
            });
        }
        setIsSubmitting(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl">
                        <Package className="h-6 w-6 text-sidebar-primary" /> Create Foreign Order
                    </DialogTitle>
                    <DialogDescription>
                        Enter the details of the product you want to import. We'll handle the sourcing and logistics.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="product_url">Product URL *</Label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="product_url"
                                    placeholder="https://amazon.com/dp/..."
                                    className="pl-10"
                                    value={formData.product_url}
                                    onChange={(e) => handleChange("product_url", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="product_name">Product Title *</Label>
                            <Input
                                id="product_name"
                                placeholder="iPhone 15 Pro Max - 256GB"
                                value={formData.product_name}
                                onChange={(e) => handleChange("product_name", e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Marketplace</Label>
                                <Select
                                    value={formData.source_marketplace}
                                    onValueChange={(v) => handleChange("source_marketplace", v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="amazon">Amazon</SelectItem>
                                        <SelectItem value="ebay">eBay</SelectItem>
                                        <SelectItem value="walmart">Walmart</SelectItem>
                                        <SelectItem value="alibaba">Alibaba</SelectItem>
                                        <SelectItem value="other">Other Global</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="quantity">Quantity</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    min="1"
                                    value={formData.quantity}
                                    onChange={(e) => handleChange("quantity", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="price_usd">Item Price (USD) *</Label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="price_usd"
                                    type="number"
                                    step="0.01"
                                    placeholder="999.00"
                                    className="pl-10 font-mono"
                                    value={formData.price_usd}
                                    onChange={(e) => handleChange("price_usd", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="customer_name">Customer Name *</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="customer_name"
                                    placeholder="Abdur Rahman"
                                    className="pl-10"
                                    value={formData.customer_name}
                                    onChange={(e) => handleChange("customer_name", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <PriceBreakdown data={calculation} className="border-2 border-sidebar-primary/10 shadow-md bg-sidebar-primary/5" />

                        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl space-y-2">
                            <h4 className="text-sm font-bold text-amber-800 flex items-center gap-2">
                                <RefreshCw className="h-4 w-4" /> Live Exchange Note
                            </h4>
                            <p className="text-xs text-amber-700 leading-relaxed">
                                Currenly using <strong>1 USD = ৳{exchangeRate}</strong>. This rate is locked for 2 hours once order is placed.
                            </p>
                        </div>
                    </div>
                </form>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button
                        className="bg-sidebar-primary hover:bg-sidebar-primary/90 px-8"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                            </>
                        ) : (
                            <>
                                <ShoppingCart className="mr-2 h-4 w-4" /> Place Order
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
