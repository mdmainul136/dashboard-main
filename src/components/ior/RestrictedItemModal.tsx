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
import { AlertTriangle, Loader2, ListPlus } from "lucide-react";
import { toast } from "sonner";

interface RestrictedItemModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function RestrictedItemModal({ open, onOpenChange }: RestrictedItemModalProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [itemName, setItemName] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!itemName) {
            toast.error("Please enter an item name or category");
            return;
        }

        setIsProcessing(true);
        // Mock API call
        setTimeout(() => {
            setIsProcessing(false);
            toast.success(`${itemName} added to global restricted list`);
            onOpenChange(false);
            setItemName("");
        }, 1000);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-5 w-5" /> Add Restricted Item
                    </DialogTitle>
                    <DialogDescription>
                        This will block sourcing of this item/category across the entire platform.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="itemName">Item Name or Keyword</Label>
                        <div className="relative">
                            <ListPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="itemName"
                                placeholder="e.g. Flammable Liquids"
                                className="pl-10"
                                value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
                            />
                        </div>
                    </div>
                </form>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button
                        variant="destructive"
                        onClick={handleSubmit}
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
                            </>
                        ) : (
                            "Restrict Globally"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
