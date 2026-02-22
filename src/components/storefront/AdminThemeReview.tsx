"use client";

import React, { useState, useEffect } from "react";
import {
    CheckCircle,
    XCircle,
    ExternalLink,
    Eye,
    Clock,
    User,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

const AdminThemeReview = () => {
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPending = async () => {
        try {
            const response = await fetch('/api/themes/admin/themes/pending');
            const data = await response.json();
            setSubmissions(data);
        } catch (error) {
            toast.error("Failed to load submission queue.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPending();
    }, []);

    const handleAction = async (id: number, action: 'approve' | 'reject') => {
        try {
            const response = await fetch(`/api/themes/admin/themes/${id}/${action}`, {
                method: 'PATCH'
            });
            if (response.ok) {
                toast.success(`Theme ${action}ed successfully!`);
                setSubmissions(prev => prev.filter(s => s.id !== id));
            }
        } catch (error) {
            toast.error(`Failed to ${action} theme.`);
        }
    };

    if (loading) return <div className="p-10 text-center text-muted-foreground">Loading queue...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Clock className="h-5 w-5 text-amber-500" />
                        Moderation Queue
                    </h2>
                    <p className="text-sm text-muted-foreground">Review and publish third-party developer themes</p>
                </div>
                <Badge variant="outline">{submissions.length} Pending</Badge>
            </div>

            {submissions.length === 0 ? (
                <Card className="border-dashed py-12 text-center">
                    <CardContent>
                        <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="h-6 w-6 text-slate-400" />
                        </div>
                        <h3 className="font-semibold text-slate-900">Inbox Zero</h3>
                        <p className="text-sm text-slate-500">No themes currently awaiting review.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {submissions.map((theme) => (
                        <Card key={theme.id} className="overflow-hidden">
                            <div className="flex flex-col md:flex-row">
                                <div
                                    className="w-full md:w-48 h-32 md:h-auto bg-slate-100 flex items-center justify-center"
                                    style={{ background: theme.preview_url.startsWith('linear') ? theme.preview_url : '#f1f5f9' }}
                                >
                                    <Eye className="h-8 w-8 text-white opacity-40" />
                                </div>
                                <div className="flex-1 p-5 space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-bold text-lg">{theme.name}</h3>
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                                                <span className="flex items-center gap-1"><User className="h-3 w-3" /> Dev #{theme.developer_id}</span>
                                                <Badge variant="secondary" className="text-[10px]">{theme.vertical}</Badge>
                                                <span>v{theme.version}</span>
                                            </div>
                                        </div>
                                        <div className="font-bold text-lg text-emerald-600">${theme.price}</div>
                                    </div>

                                    <div className="bg-slate-50 p-3 rounded text-[10px] font-mono whitespace-pre-wrap max-h-24 overflow-y-auto">
                                        {JSON.stringify(theme.config, null, 2)}
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="gap-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                                            onClick={() => handleAction(theme.id, 'approve')}
                                        >
                                            <CheckCircle className="h-4 w-4" /> Approve & Go Live
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="gap-2 text-destructive hover:bg-destructive/5"
                                            onClick={() => handleAction(theme.id, 'reject')}
                                        >
                                            <XCircle className="h-4 w-4" /> Reject
                                        </Button>
                                        <Button size="sm" variant="ghost" className="gap-2 ml-auto">
                                            <ExternalLink className="h-4 w-4" /> View Full Blueprint
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <p>
                    <strong>Note for Curators:</strong> Approval will immediately make the theme available for adoption by all 1,200+ active tenants.
                    Ensure configurations don't contain absolute external URLs or malicious script injections.
                </p>
            </div>
        </div>
    );
};

export default AdminThemeReview;
