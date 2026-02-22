import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Award, Download, Eye, Palette, Settings, Search, CheckCircle2,
  FileText, Users, Calendar, Sparkles, RotateCcw, Type, Image,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

// ─── Certificate Templates ───
const templates = [
  {
    id: "classic",
    name: "Classic Elegance",
    preview: "linear-gradient(135deg, hsl(40, 60%, 95%), hsl(40, 40%, 85%))",
    borderColor: "hsl(40, 70%, 45%)",
    textColor: "#2d2d2d",
    accentColor: "hsl(40, 70%, 45%)",
    fontFamily: "Georgia, serif",
  },
  {
    id: "modern",
    name: "Modern Blue",
    preview: "linear-gradient(135deg, hsl(220, 60%, 97%), hsl(220, 50%, 90%))",
    borderColor: "hsl(220, 70%, 50%)",
    textColor: "#1a1a2e",
    accentColor: "hsl(220, 70%, 50%)",
    fontFamily: "'Segoe UI', sans-serif",
  },
  {
    id: "dark",
    name: "Dark Premium",
    preview: "linear-gradient(135deg, hsl(240, 15%, 15%), hsl(240, 10%, 25%))",
    borderColor: "hsl(45, 90%, 55%)",
    textColor: "#f0f0f0",
    accentColor: "hsl(45, 90%, 55%)",
    fontFamily: "'Trebuchet MS', sans-serif",
  },
  {
    id: "minimal",
    name: "Minimal Clean",
    preview: "linear-gradient(135deg, #ffffff, #f8f8f8)",
    borderColor: "hsl(0, 0%, 20%)",
    textColor: "#333333",
    accentColor: "hsl(0, 0%, 20%)",
    fontFamily: "'Helvetica Neue', sans-serif",
  },
];

// ─── Issued Certificates ───
const issuedCertificates = [
  { id: "c1", student: "Ahmed Al-Rashid", course: "Web Development Bootcamp", date: "2025-02-15", template: "modern", credentialId: "CERT-WD-2025-001", status: "active" },
  { id: "c2", student: "Sarah Johnson", course: "UI/UX Design Masterclass", date: "2025-02-10", template: "classic", credentialId: "CERT-UX-2025-002", status: "active" },
  { id: "c3", student: "Mohammed Khalid", course: "Web Development Bootcamp", date: "2025-02-08", template: "modern", credentialId: "CERT-WD-2025-003", status: "active" },
  { id: "c4", student: "Mohammed Khalid", course: "UI/UX Design Masterclass", date: "2025-01-28", template: "classic", credentialId: "CERT-UX-2025-004", status: "active" },
  { id: "c5", student: "Mohammed Khalid", course: "Digital Marketing A-Z", date: "2025-01-15", template: "dark", credentialId: "CERT-DM-2025-005", status: "active" },
  { id: "c6", student: "Layla Hassan", course: "Web Development Bootcamp", date: "2025-01-10", template: "modern", credentialId: "CERT-WD-2025-006", status: "revoked" },
  { id: "c7", student: "Layla Hassan", course: "Digital Marketing A-Z", date: "2025-01-05", template: "dark", credentialId: "CERT-DM-2025-007", status: "active" },
];

// ─── Certificate Preview Component ───
const CertificatePreview = ({
  template,
  studentName,
  courseName,
  date,
  credentialId,
  orgName,
  signatory,
}: {
  template: typeof templates[0];
  studentName: string;
  courseName: string;
  date: string;
  credentialId: string;
  orgName: string;
  signatory: string;
}) => (
  <div
    className="relative w-full aspect-[1.414/1] rounded-xl overflow-hidden shadow-lg"
    style={{ background: template.preview, fontFamily: template.fontFamily }}
  >
    {/* Border frame */}
    <div
      className="absolute inset-3 rounded-lg"
      style={{ border: `3px solid ${template.borderColor}`, opacity: 0.6 }}
    />
    <div
      className="absolute inset-5 rounded-md"
      style={{ border: `1px solid ${template.borderColor}`, opacity: 0.3 }}
    />

    {/* Content */}
    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
      {/* Logo / Icon */}
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
        style={{ backgroundColor: `${template.accentColor}20`, color: template.accentColor }}
      >
        <Award className="w-6 h-6" />
      </div>

      <p className="text-[10px] uppercase tracking-[0.3em] mb-1" style={{ color: template.accentColor }}>
        Certificate of Completion
      </p>

      <p className="text-xs mb-2" style={{ color: template.textColor, opacity: 0.6 }}>
        This is to certify that
      </p>

      <h2
        className="text-xl font-bold mb-2"
        style={{
          color: template.accentColor,
          borderBottom: `2px solid ${template.accentColor}40`,
          paddingBottom: 4,
        }}
      >
        {studentName || "Student Name"}
      </h2>

      <p className="text-xs mb-1" style={{ color: template.textColor, opacity: 0.6 }}>
        has successfully completed
      </p>

      <h3 className="text-sm font-semibold mb-3" style={{ color: template.textColor }}>
        {courseName || "Course Name"}
      </h3>

      <p className="text-[9px] mb-4" style={{ color: template.textColor, opacity: 0.5 }}>
        Issued on {date} · {orgName}
      </p>

      {/* Signature line */}
      <div className="flex items-end gap-8">
        <div className="text-center">
          <div className="w-24 border-b mb-1" style={{ borderColor: `${template.textColor}40` }} />
          <p className="text-[8px]" style={{ color: template.textColor, opacity: 0.5 }}>{signatory || "Instructor"}</p>
        </div>
        <div className="text-center">
          <div className="w-24 border-b mb-1" style={{ borderColor: `${template.textColor}40` }} />
          <p className="text-[8px]" style={{ color: template.textColor, opacity: 0.5 }}>Date</p>
        </div>
      </div>

      {/* Credential ID */}
      <p className="absolute bottom-3 text-[7px]" style={{ color: template.textColor, opacity: 0.3 }}>
        Credential ID: {credentialId}
      </p>
    </div>
  </div>
);

const CertificateBuilder = () => {
  const [activeSubTab, setActiveSubTab] = useState("designer");
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [orgName, setOrgName] = useState("TailAdmin Academy");
  const [signatory, setSignatory] = useState("Dr. Ahmed");
  const [autoIssue, setAutoIssue] = useState(true);
  const [includeCredentialId, setIncludeCredentialId] = useState(true);
  const [includeQR, setIncludeQR] = useState(true);
  const [searchCert, setSearchCert] = useState("");
  const [previewStudent, setPreviewStudent] = useState("Ahmed Al-Rashid");
  const [previewCourse, setPreviewCourse] = useState("Web Development Bootcamp");

  const filteredCerts = issuedCertificates.filter(
    c => c.student.toLowerCase().includes(searchCert.toLowerCase()) ||
         c.course.toLowerCase().includes(searchCert.toLowerCase()) ||
         c.credentialId.toLowerCase().includes(searchCert.toLowerCase())
  );

  const handleDownloadCert = async (cert: typeof issuedCertificates[0]) => {
    try {
      const { default: jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const tpl = templates.find(t => t.id === cert.template) || templates[0];

      // Background
      if (tpl.id === "dark") {
        doc.setFillColor(30, 30, 45);
        doc.rect(0, 0, 297, 210, "F");
      } else {
        doc.setFillColor(252, 249, 240);
        doc.rect(0, 0, 297, 210, "F");
      }

      // Border
      doc.setDrawColor(tpl.id === "dark" ? 200 : 160, tpl.id === "dark" ? 170 : 130, tpl.id === "dark" ? 50 : 50);
      doc.setLineWidth(1);
      doc.rect(10, 10, 277, 190);
      doc.setLineWidth(0.3);
      doc.rect(14, 14, 269, 182);

      const textColor = tpl.id === "dark" ? 240 : 40;
      const accentR = tpl.id === "dark" ? 220 : tpl.id === "modern" ? 59 : 160;
      const accentG = tpl.id === "dark" ? 180 : tpl.id === "modern" ? 130 : 120;
      const accentB = tpl.id === "dark" ? 50 : tpl.id === "modern" ? 246 : 40;

      // Award icon circle
      doc.setFillColor(accentR, accentG, accentB);
      doc.circle(148.5, 40, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.text("★", 148.5, 43, { align: "center" });

      // Title
      doc.setTextColor(accentR, accentG, accentB);
      doc.setFontSize(11);
      doc.text("CERTIFICATE OF COMPLETION", 148.5, 58, { align: "center" });

      // "This certifies that"
      doc.setTextColor(textColor, textColor, textColor);
      doc.setFontSize(10);
      doc.text("This is to certify that", 148.5, 70, { align: "center" });

      // Student name
      doc.setTextColor(accentR, accentG, accentB);
      doc.setFontSize(22);
      doc.text(cert.student, 148.5, 85, { align: "center" });
      doc.setDrawColor(accentR, accentG, accentB);
      doc.setLineWidth(0.5);
      doc.line(100, 88, 197, 88);

      // "has completed"
      doc.setTextColor(textColor, textColor, textColor);
      doc.setFontSize(10);
      doc.text("has successfully completed the course", 148.5, 100, { align: "center" });

      // Course name
      doc.setFontSize(16);
      doc.text(cert.course, 148.5, 112, { align: "center" });

      // Date & Org
      doc.setFontSize(9);
      doc.setTextColor(textColor, textColor, textColor);
      doc.text(`Issued on ${format(new Date(cert.date), "MMMM d, yyyy")} · ${orgName}`, 148.5, 128, { align: "center" });

      // Signature lines
      doc.setDrawColor(textColor, textColor, textColor);
      doc.setLineWidth(0.3);
      doc.line(80, 160, 130, 160);
      doc.line(167, 160, 217, 160);
      doc.setFontSize(8);
      doc.text(signatory, 105, 166, { align: "center" });
      doc.text("Date", 192, 166, { align: "center" });

      // Credential ID
      doc.setFontSize(7);
      doc.setTextColor(150, 150, 150);
      doc.text(`Credential ID: ${cert.credentialId}`, 148.5, 195, { align: "center" });

      doc.save(`${cert.credentialId}.pdf`);
      toast({ title: "Certificate downloaded", description: `${cert.credentialId}.pdf saved.` });
    } catch {
      toast({ title: "Download failed", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Issued", value: issuedCertificates.filter(c => c.status === "active").length, icon: Award, color: "text-primary bg-primary/10" },
          { label: "This Month", value: issuedCertificates.filter(c => c.date >= "2025-02-01").length, icon: Calendar, color: "text-emerald-500 bg-emerald-500/10" },
          { label: "Templates", value: templates.length, icon: Palette, color: "text-amber-500 bg-amber-500/10" },
          { label: "Unique Students", value: new Set(issuedCertificates.map(c => c.student)).size, icon: Users, color: "text-blue-500 bg-blue-500/10" },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-bold">{s.value}</p>
                <p className="text-[11px] text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <TabsList>
          <TabsTrigger value="designer"><Palette className="h-3.5 w-3.5 mr-1" />Designer</TabsTrigger>
          <TabsTrigger value="issued"><FileText className="h-3.5 w-3.5 mr-1" />Issued ({issuedCertificates.length})</TabsTrigger>
          <TabsTrigger value="settings"><Settings className="h-3.5 w-3.5 mr-1" />Settings</TabsTrigger>
        </TabsList>

        {/* ─── Designer Tab ─── */}
        <TabsContent value="designer">
          <div className="grid lg:grid-cols-2 gap-4">
            {/* Left: Template Selection & Customization */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2"><Palette className="h-4 w-4 text-primary" /> Choose Template</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {templates.map(tpl => (
                      <button
                        key={tpl.id}
                        onClick={() => setSelectedTemplate(tpl)}
                        className={`relative rounded-xl p-3 text-left border-2 transition-all hover:shadow-md ${
                          selectedTemplate.id === tpl.id ? "border-primary shadow-md" : "border-border/60"
                        }`}
                      >
                        <div
                          className="w-full aspect-[1.4/1] rounded-lg mb-2"
                          style={{ background: tpl.preview }}
                        >
                          <div className="w-full h-full flex items-center justify-center">
                            <Award className="w-6 h-6" style={{ color: tpl.accentColor }} />
                          </div>
                        </div>
                        <p className="text-xs font-medium">{tpl.name}</p>
                        {selectedTemplate.id === tpl.id && (
                          <div className="absolute top-2 right-2">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2"><Type className="h-4 w-4 text-primary" /> Customize Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-xs">Organization Name</Label>
                    <Input className="mt-1" value={orgName} onChange={e => setOrgName(e.target.value)} />
                  </div>
                  <div>
                    <Label className="text-xs">Signatory Name</Label>
                    <Input className="mt-1" value={signatory} onChange={e => setSignatory(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Preview Student</Label>
                      <Input className="mt-1" value={previewStudent} onChange={e => setPreviewStudent(e.target.value)} />
                    </div>
                    <div>
                      <Label className="text-xs">Preview Course</Label>
                      <Input className="mt-1" value={previewCourse} onChange={e => setPreviewCourse(e.target.value)} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: Live Preview */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2"><Eye className="h-4 w-4 text-primary" /> Live Preview</CardTitle>
                    <Badge variant="outline" className="text-[10px] gap-1">
                      <Sparkles className="h-2.5 w-2.5" /> {selectedTemplate.name}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CertificatePreview
                    template={selectedTemplate}
                    studentName={previewStudent}
                    courseName={previewCourse}
                    date={format(new Date(), "MMMM d, yyyy")}
                    credentialId="CERT-PREVIEW-001"
                    orgName={orgName}
                    signatory={signatory}
                  />
                </CardContent>
              </Card>

              <Button
                className="w-full gap-2"
                onClick={() => {
                  handleDownloadCert({
                    id: "preview",
                    student: previewStudent,
                    course: previewCourse,
                    date: new Date().toISOString().slice(0, 10),
                    template: selectedTemplate.id,
                    credentialId: "CERT-PREVIEW-001",
                    status: "active",
                  });
                }}
              >
                <Download className="h-4 w-4" /> Download Preview PDF
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* ─── Issued Certificates Tab ─── */}
        <TabsContent value="issued">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-base">Issued Certificates</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by student, course..." className="pl-9" value={searchCert} onChange={e => setSearchCert(e.target.value)} />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Credential ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCerts.map(cert => (
                    <TableRow key={cert.id}>
                      <TableCell className="font-medium">{cert.student}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">{cert.course}</TableCell>
                      <TableCell>
                        <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono">{cert.credentialId}</code>
                      </TableCell>
                      <TableCell className="text-xs">{format(new Date(cert.date), "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        <Badge variant={cert.status === "active" ? "default" : "destructive"} className="text-[10px]">
                          {cert.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDownloadCert(cert)}>
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── Settings Tab ─── */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Settings className="h-4 w-4 text-muted-foreground" /> Certificate Settings</CardTitle>
              <CardDescription>Configure automatic certificate issuance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between rounded-xl border border-border/60 p-4">
                <div>
                  <p className="text-sm font-medium">Auto-Issue on Completion</p>
                  <p className="text-xs text-muted-foreground">Automatically generate certificates when students complete a course</p>
                </div>
                <Switch checked={autoIssue} onCheckedChange={setAutoIssue} />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border/60 p-4">
                <div>
                  <p className="text-sm font-medium">Include Credential ID</p>
                  <p className="text-xs text-muted-foreground">Add a unique verifiable credential ID to each certificate</p>
                </div>
                <Switch checked={includeCredentialId} onCheckedChange={setIncludeCredentialId} />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border/60 p-4">
                <div>
                  <p className="text-sm font-medium">Include QR Code</p>
                  <p className="text-xs text-muted-foreground">Add a QR code linking to the verification page</p>
                </div>
                <Switch checked={includeQR} onCheckedChange={setIncludeQR} />
              </div>

              <div>
                <Label className="text-sm font-medium">Default Template</Label>
                <Select value={selectedTemplate.id} onValueChange={id => setSelectedTemplate(templates.find(t => t.id === id) || templates[0])}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map(t => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Organization Name</Label>
                <Input className="mt-1.5" value={orgName} onChange={e => setOrgName(e.target.value)} />
              </div>

              <div>
                <Label className="text-sm font-medium">Default Signatory</Label>
                <Input className="mt-1.5" value={signatory} onChange={e => setSignatory(e.target.value)} />
              </div>

              <Button onClick={() => toast({ title: "Settings saved", description: "Certificate settings updated." })}>
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CertificateBuilder;
