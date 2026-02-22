"use client";

import React, { useState, useRef } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FileText, Upload, X, CheckCircle2, AlertCircle, Loader2, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DocumentUploadOverlayProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description?: string;
    targetId?: string; // Order ID or Batch ID
}

export function DocumentUploadOverlay({
    open,
    onOpenChange,
    title = "Upload Compliance Document",
    description = "Select or drag files here to upload. Supported formats: PDF, JPG, PNG.",
    targetId
}: DocumentUploadOverlayProps) {
    const [dragActive, setDragActive] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            toast.error("Please select a file first");
            return;
        }

        setIsUploading(true);
        // Mock upload logic
        setTimeout(() => {
            setIsUploading(false);
            toast.success("Documents uploaded successfully");
            onOpenChange(false);
            setFiles([]);
        }, 1500);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5 text-sidebar-primary" /> {title}
                    </DialogTitle>
                    <DialogDescription>
                        {description} {targetId && <span className="font-bold text-sidebar-primary">({targetId})</span>}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    <div
                        className={cn(
                            "relative border-2 border-dashed rounded-xl p-8 transition-all flex flex-col items-center justify-center text-center gap-3",
                            dragActive ? "border-sidebar-primary bg-sidebar-primary/5 scale-[1.02]" : "border-gray-200 hover:border-gray-300 bg-gray-50/50"
                        )}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleFileChange}
                        />

                        <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400">
                            <Upload className="h-6 w-6" />
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm font-bold">Click to upload or drag and drop</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Maximum file size 5MB</p>
                        </div>
                    </div>

                    {files.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Selected Files ({files.length})</p>
                            <div className="space-y-1">
                                {files.map((file, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100 group animate-in slide-in-from-bottom-2 fade-in">
                                        <div className="flex items-center gap-3 truncate">
                                            <div className="h-8 w-8 rounded bg-white border flex items-center justify-center text-primary shrink-0">
                                                <FileText className="h-4 w-4" />
                                            </div>
                                            <div className="truncate">
                                                <p className="text-xs font-bold truncate max-w-[200px]">{file.name}</p>
                                                <p className="text-[10px] text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                                            onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 flex gap-3">
                        <AlertCircle className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-blue-600 leading-relaxed">
                            Ensuring all documents are updated avoids delays in customs clearance. Please double check the expiry dates of your Trade License.
                        </p>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button
                        className="bg-sidebar-primary hover:bg-sidebar-primary/90 min-w-[120px]"
                        onClick={handleUpload}
                        disabled={isUploading || files.length === 0}
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                            </>
                        ) : (
                            "Start Upload"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
