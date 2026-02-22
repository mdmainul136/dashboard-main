"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Plus, FileText, Eye, Pencil, Trash2, Copy,
  Mail, MessageSquare, Phone, MapPin, Upload,
  Type, Hash, Calendar, CheckSquare, ListChecks,
  ToggleLeft, Star, ArrowRight, Inbox, Clock,
  Users, BarChart3, GripVertical,
} from "lucide-react";

interface ContactForm {
  id: string;
  name: string;
  fields: number;
  submissions: number;
  lastSubmission: string;
  status: "active" | "draft" | "archived";
  type: string;
}

interface FormField {
  id: string;
  type: string;
  label: string;
  required: boolean;
  icon: React.ReactNode;
}

interface Submission {
  id: string;
  form: string;
  name: string;
  email: string;
  date: string;
  status: "new" | "read" | "replied";
  message: string;
}

const mockForms: ContactForm[] = [
  { id: "1", name: "Contact Us", fields: 5, submissions: 124, lastSubmission: "2 hours ago", status: "active", type: "Contact" },
  { id: "2", name: "Get a Quote", fields: 8, submissions: 67, lastSubmission: "1 day ago", status: "active", type: "Lead Gen" },
  { id: "3", name: "Newsletter Signup", fields: 2, submissions: 340, lastSubmission: "30 min ago", status: "active", type: "Newsletter" },
  { id: "4", name: "Feedback Form", fields: 6, submissions: 45, lastSubmission: "3 days ago", status: "active", type: "Feedback" },
  { id: "5", name: "Job Application", fields: 10, submissions: 12, lastSubmission: "1 week ago", status: "draft", type: "Recruitment" },
];

const fieldTypes: FormField[] = [
  { id: "text", type: "Text Input", label: "Single line text", required: false, icon: <Type className="h-4 w-4" /> },
  { id: "email", type: "Email", label: "Email address", required: true, icon: <Mail className="h-4 w-4" /> },
  { id: "phone", type: "Phone", label: "Phone number", required: false, icon: <Phone className="h-4 w-4" /> },
  { id: "textarea", type: "Text Area", label: "Multi-line text", required: false, icon: <MessageSquare className="h-4 w-4" /> },
  { id: "select", type: "Dropdown", label: "Select options", required: false, icon: <ListChecks className="h-4 w-4" /> },
  { id: "checkbox", type: "Checkbox", label: "Single checkbox", required: false, icon: <CheckSquare className="h-4 w-4" /> },
  { id: "number", type: "Number", label: "Numeric input", required: false, icon: <Hash className="h-4 w-4" /> },
  { id: "date", type: "Date Picker", label: "Date selection", required: false, icon: <Calendar className="h-4 w-4" /> },
  { id: "file", type: "File Upload", label: "Attach files", required: false, icon: <Upload className="h-4 w-4" /> },
  { id: "rating", type: "Star Rating", label: "1-5 star rating", required: false, icon: <Star className="h-4 w-4" /> },
];

const mockSubmissions: Submission[] = [
  { id: "1", form: "Contact Us", name: "Hasan Ali", email: "hasan@example.com", date: "2 hours ago", status: "new", message: "I'd like to discuss a potential partnership opportunity." },
  { id: "2", form: "Get a Quote", name: "Maryam Qasim", email: "maryam@company.com", date: "5 hours ago", status: "new", message: "Need a quote for a full website redesign for our startup." },
  { id: "3", form: "Contact Us", name: "Faisal Rahman", email: "faisal@email.com", date: "1 day ago", status: "read", message: "Question about your design services and pricing." },
  { id: "4", form: "Feedback Form", name: "Noura Salem", email: "noura@email.com", date: "2 days ago", status: "replied", message: "Great website! The portfolio section is impressive." },
  { id: "5", form: "Newsletter Signup", name: "Tariq Mansour", email: "tariq@startup.io", date: "3 days ago", status: "read", message: "Subscribed to newsletter" },
];

const submissionStatusConfig: Record<string, { label: string; bgColor: string; textColor: string }> = {
  new: { label: "New", bgColor: "bg-primary/10", textColor: "text-primary" },
  read: { label: "Read", bgColor: "bg-muted", textColor: "text-muted-foreground" },
  replied: { label: "Replied", bgColor: "bg-success/10", textColor: "text-success" },
};

const ContactFormBuilderPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const totalSubmissions = mockForms.reduce((s, f) => s + f.submissions, 0);
  const newCount = mockSubmissions.filter(s => s.status === "new").length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Forms & Contact</h1>
            <p className="text-muted-foreground text-sm mt-1">Build custom forms and manage submissions</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" /> New Form</Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Create New Form</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label>Form Name</Label>
                  <Input placeholder="e.g. Contact Us" />
                </div>
                <div className="space-y-2">
                  <Label>Form Type</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Choose type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contact">Contact Form</SelectItem>
                      <SelectItem value="lead">Lead Generation</SelectItem>
                      <SelectItem value="newsletter">Newsletter Signup</SelectItem>
                      <SelectItem value="feedback">Feedback Form</SelectItem>
                      <SelectItem value="application">Application Form</SelectItem>
                      <SelectItem value="custom">Custom Form</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Notification Email</Label>
                  <Input placeholder="admin@yoursite.com" type="email" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch id="spam" defaultChecked />
                    <Label htmlFor="spam" className="text-sm text-muted-foreground">Enable spam protection</Label>
                  </div>
                </div>
                <Button className="w-full" onClick={() => setDialogOpen(false)}>Create Form</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Active Forms", value: mockForms.filter(f => f.status === "active").length, icon: <FileText className="h-5 w-5" />, iconClass: "stat-icon" },
            { label: "Total Submissions", value: totalSubmissions, icon: <Inbox className="h-5 w-5" />, iconClass: "stat-icon-success" },
            { label: "New Unread", value: newCount, icon: <Mail className="h-5 w-5" />, iconClass: "stat-icon-warning" },
            { label: "Reply Rate", value: "85%", icon: <ArrowRight className="h-5 w-5" />, iconClass: "stat-icon-info" },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className={stat.iconClass}>{stat.icon}</div>
                <p className="text-xl font-bold text-foreground mt-2">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="forms">
          <TabsList>
            <TabsTrigger value="forms">My Forms ({mockForms.length})</TabsTrigger>
            <TabsTrigger value="submissions">Submissions ({mockSubmissions.length})</TabsTrigger>
            <TabsTrigger value="fields">Field Types</TabsTrigger>
          </TabsList>

          <TabsContent value="forms" className="space-y-3">
            {mockForms.map(form => (
              <Card key={form.id} className="group">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="stat-icon">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground">{form.name}</p>
                        <Badge variant={form.status === "active" ? "default" : "secondary"}>{form.status}</Badge>
                        <Badge variant="outline" className="text-[10px]">{form.type}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {form.fields} fields Â· {form.submissions} submissions Â· Last: {form.lastSubmission}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Copy className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="submissions" className="space-y-3">
            {mockSubmissions.map(sub => (
              <Card key={sub.id} className="group cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                        {sub.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground text-sm">{sub.name}</p>
                          <Badge variant="outline" className={`${submissionStatusConfig[sub.status].bgColor} ${submissionStatusConfig[sub.status].textColor} border-transparent text-[10px]`}>
                            {submissionStatusConfig[sub.status].label}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{sub.email} Â· via {sub.form}</p>
                        <p className="text-sm text-foreground/80 mt-1.5 line-clamp-1">{sub.message}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">{sub.date}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="fields">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {fieldTypes.map(field => (
                <Card key={field.id} className="cursor-pointer hover:border-primary/40 transition-all group">
                  <CardContent className="p-4 text-center space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto text-primary group-hover:scale-110 transition-transform">
                      {field.icon}
                    </div>
                    <p className="text-sm font-semibold text-foreground">{field.type}</p>
                    <p className="text-[11px] text-muted-foreground">{field.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ContactFormBuilderPage;

