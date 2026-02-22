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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Package, Truck, MapPin, Loader2, Check } from "lucide-react";
import { useIorWarehouse } from "@/hooks/ior/useIorWarehouse";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface BatchModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function BatchModal({ open, onOpenChange }: BatchModalProps) {
    const { inventory, createBatch, isProcessing } = useIorWarehouse();
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [formData, setFormData] = useState({
        carrier: "dhl",
        origin: "CN",
        destination: "BD",
        tracking_number: ""
    });

    // Only allow items that are not already in a batch
    const availableItems = inventory.filter(item => !item.shipment_batch_id);

    const toggleItem = (id: number) => {
        setSelectedItems(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedItems.length === 0) {
            toast.error("Please select at least one item to batch");
            return;
        }

        const success = await createBatch({
            ...formData,
            item_ids: selectedItems
        });

        if (success) {
            onOpenChange(false);
            setSelectedItems([]);
            setFormData({
                carrier: "dhl",
                origin: "CN",
                destination: "BD",
                tracking_number: ""
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Truck className="h-5 w-5 text-sidebar-primary" /> Create Shipment Batch
                    </DialogTitle>
                    <DialogDescription>
                        Combine multiple warehouse items into a single shipment batch.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 flex-1 overflow-hidden">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Select Items ({selectedItems.length})</Label>
                            <ScrollArea className="h-[300px] border rounded-md p-2">
                                {availableItems.length === 0 ? (
                                    <p className="text-xs text-center py-8 text-muted-foreground italic">
                                        No unbatched items available.
                                    </p>
                                ) : (
                                    <div className="space-y-1">
                                        {availableItems.map((item) => (
                                            <div
                                                key={item.id}
                                                className={`flex items-center space-x-3 p-2 rounded-lg transition-colors cursor-pointer border ${selectedItems.includes(item.id)
                                                        ? "bg-sidebar-primary/5 border-sidebar-primary/20"
                                                        : "hover:bg-gray-50 border-transparent"
                                                    }`}
                                                onClick={() => toggleItem(item.id)}
                                            >
                                                <Checkbox
                                                    id={`item-${item.id}`}
                                                    checked={selectedItems.includes(item.id)}
                                                    onCheckedChange={() => toggleItem(item.id)}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-bold truncate">{item.product_name}</p>
                                                    <p className="text-[10px] text-muted-foreground font-mono">{item.order_number}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Carrier</Label>
                            <Select value={formData.carrier} onValueChange={(v) => handleChange("carrier", v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="dhl">DHL Express</SelectItem>
                                    <SelectItem value="fedex">FedEx</SelectItem>
                                    <SelectItem value="aramex">Aramex</SelectItem>
                                    <SelectItem value="cargo">Special Air Cargo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="origin">Origin</Label>
                                <Input
                                    id="origin"
                                    placeholder="CN"
                                    className="uppercase font-mono"
                                    value={formData.origin}
                                    onChange={(e) => handleChange("origin", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="destination">Destination</Label>
                                <Input
                                    id="destination"
                                    placeholder="BD"
                                    className="uppercase font-mono"
                                    value={formData.destination}
                                    onChange={(e) => handleChange("destination", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tracking">Tracking # (Optional)</Label>
                            <Input
                                id="tracking"
                                placeholder="Carrier tracking number"
                                value={formData.tracking_number}
                                onChange={(e) => handleChange("tracking_number", e.target.value)}
                            />
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl border space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">Selected Weight:</span>
                                <span className="font-bold">~ 12.5 kg</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">Items Count:</span>
                                <span className="font-bold">{selectedItems.length} items</span>
                            </div>
                        </div>
                    </form>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button
                        className="bg-sidebar-primary hover:bg-sidebar-primary/90"
                        onClick={handleSubmit}
                        disabled={isProcessing || selectedItems.length === 0}
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Batching...
                            </>
                        ) : (
                            "Create Batch"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
