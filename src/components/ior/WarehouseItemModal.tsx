"use client";

import React, { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Package, Hash, MapPin, Scale, Box, Loader2, Search } from "lucide-react";
import { useIorWarehouse } from "@/hooks/ior/useIorWarehouse";
import { toast } from "sonner";

interface WarehouseItemModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function WarehouseItemModal({ open, onOpenChange }: WarehouseItemModalProps) {
    const { receiveOrder, isProcessing } = useIorWarehouse();
    const [formData, setFormData] = useState({
        identifier: "",
        location: "A1-Section-4",
        weight: "",
        dimensions: "",
        note: ""
    });

    const handleChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.identifier) {
            toast.error("Please enter an Order ID or Tracking Number");
            return;
        }

        const fullNote = `${formData.note}${formData.weight ? ` | Weight: ${formData.weight}kg` : ""}${formData.dimensions ? ` | Dim: ${formData.dimensions}` : ""}`;

        const result = await receiveOrder(formData.identifier, formData.location, fullNote);

        if (result) {
            onOpenChange(false);
            setFormData({
                identifier: "",
                location: "A1-Section-4",
                weight: "",
                dimensions: "",
                note: ""
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-sidebar-primary" /> Inbound New Item
                    </DialogTitle>
                    <DialogDescription>
                        Register a received item into the warehouse inventory.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="identifier">Order ID / Tracking # *</Label>
                        <div className="relative">
                            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="identifier"
                                placeholder="e.g. IOR-9918 or ABC123456789"
                                className="pl-10"
                                value={formData.identifier}
                                onChange={(e) => handleChange("identifier", e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="weight">Weight (kg)</Label>
                            <div className="relative">
                                <Scale className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="weight"
                                    type="number"
                                    step="0.01"
                                    placeholder="2.5"
                                    className="pl-10"
                                    value={formData.weight}
                                    onChange={(e) => handleChange("weight", e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location">Warehouse Bin</Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="location"
                                    placeholder="Shelf-B2"
                                    className="pl-10 uppercase font-mono"
                                    value={formData.location}
                                    onChange={(e) => handleChange("location", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dimensions">Dimensions (L x W x H cm)</Label>
                        <div className="relative">
                            <Box className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="dimensions"
                                placeholder="30 x 20 x 15"
                                className="pl-10"
                                value={formData.dimensions}
                                onChange={(e) => handleChange("dimensions", e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="note">Reception Note</Label>
                        <Textarea
                            id="note"
                            placeholder="e.g. Packaging slightly damaged, contents intact."
                            value={formData.note}
                            onChange={(e) => handleChange("note", e.target.value)}
                        />
                    </div>
                </form>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button
                        className="bg-sidebar-primary hover:bg-sidebar-primary/90"
                        onClick={handleSubmit}
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Recording...
                            </>
                        ) : (
                            "Confirm Reception"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
