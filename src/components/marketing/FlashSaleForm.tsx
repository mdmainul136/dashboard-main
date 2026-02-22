"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, Percent, Zap, Clock, Package } from "lucide-react";
import { toast } from "sonner";

interface FlashSaleFormProps {
    onSuccess?: () => void;
}

const FlashSaleForm = ({ onSuccess }: FlashSaleFormProps) => {
    const [formData, setFormData] = useState({
        name: "",
        discount_percentage: "15",
        starts_at: "",
        ends_at: "",
        product_ids: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/flash-sales", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    product_ids: formData.product_ids.split(",").map(id => id.trim()),
                }),
            });

            if (response.ok) {
                toast.success("Flash sale scheduled!");
                if (onSuccess) onSuccess();
            } else {
                toast.error("Failed to schedule flash sale.");
            }
        } catch (error) {
            toast.error("An error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-amber-500" /> Event Name
                        </Label>
                        <Input
                            value={formData.name}
                            onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                            placeholder="e.g. Midnight Madness"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            <Percent className="h-4 w-4 text-emerald-500" /> Discount Percentage
                        </Label>
                        <div className="relative">
                            <Input
                                type="number"
                                value={formData.discount_percentage}
                                onChange={e => setFormData(p => ({ ...p, discount_percentage: e.target.value }))}
                                className="pr-8"
                                required
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" /> Start Date & Time
                        </Label>
                        <Input
                            type="datetime-local"
                            value={formData.starts_at}
                            onChange={e => setFormData(p => ({ ...p, starts_at: e.target.value }))}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-destructive" /> End Date & Time
                        </Label>
                        <Input
                            type="datetime-local"
                            value={formData.ends_at}
                            onChange={e => setFormData(p => ({ ...p, ends_at: e.target.value }))}
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-sky-500" /> Target Products (Comma separated IDs)
                </Label>
                <textarea
                    className="w-full flex h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.product_ids}
                    onChange={e => setFormData(p => ({ ...p, product_ids: e.target.value }))}
                    placeholder="PROD-001, PROD-002..."
                    required
                />
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">AI Brain will automatically highlight these products on the storefront during the sale window.</p>
            </div>

            <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                <Clock className="h-4 w-4" /> {isSubmitting ? "Scheduling..." : "Lock In Flash Sale"}
            </Button>
        </form>
    );
};

export default FlashSaleForm;
