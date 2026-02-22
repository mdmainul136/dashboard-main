"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Settings, Send, BarChart3, ArrowRight, Mail, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export default function NotificationsPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <span className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 text-2xl">
                                🔔
                            </span>
                            Notification Center
                        </h1>
                        <p className="text-muted-foreground">Broadcast messages and automated alerts</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="gap-2">
                            <Settings className="h-4 w-4" /> Templates
                        </Button>
                        <Button className="gap-2 shadow-lg shadow-blue-500/25 bg-blue-500 hover:bg-blue-600">
                            <Send className="h-4 w-4" /> Send Broadcast
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[
                        { name: "In-App Alerts", icon: <Bell className="h-4 w-4" /> },
                        { name: "Email Campaigns", icon: <Mail className="h-4 w-4" /> },
                        { name: "SMS Messaging", icon: <MessageSquare className="h-4 w-4" /> },
                        { name: "Push Notifications", icon: <Bell className="h-4 w-4" /> },
                        { name: "Slack Integration", icon: <Settings className="h-4 w-4" /> },
                        { name: "Activity Logs", icon: <BarChart3 className="h-4 w-4" /> }
                    ].map((feature, idx) => (
                        <motion.div
                            key={feature.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Card className="group cursor-pointer border-border/60 hover:border-blue-500/40 hover:shadow-md transition-all duration-300">
                                <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                                    <CardTitle className="text-base font-bold group-hover:text-blue-500 transition-colors">
                                        {feature.name}
                                    </CardTitle>
                                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-blue-500/10 group-hover:text-blue-500 transition-colors">
                                        <ArrowRight className="h-4 w-4" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xs text-muted-foreground mb-4">
                                        Monitor and send {feature.name.toLowerCase()} across all channels.
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">Operational</Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
