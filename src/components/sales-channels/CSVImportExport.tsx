import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Upload, Download, FileSpreadsheet, CheckCircle2, AlertCircle, Clock,
  FileUp, Trash2, Eye, X
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

/* ── Types ─────────────────────────────────────── */

interface ImportRow {
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  channel: string;
}

interface ImportResult {
  total: number;
  success: number;
  errors: number;
  rows: (ImportRow & { status: "success" | "error"; error?: string })[];
}

/* ── Component ─────────────────────────────────── */

interface SyncProduct {
  id: string;
  name: string;
  sku: string;
  channel: string;
  platform: "shopify" | "salla";
  status: "synced" | "pending" | "error";
  localStock: number;
  remoteStock: number;
  lastSynced: string;
}

interface CSVImportExportProps {
  products: SyncProduct[];
}

const CSVImportExport = ({ products }: CSVImportExportProps) => {
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [importing, setImporting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [previewData, setPreviewData] = useState<string[][] | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseCSV = (text: string): string[][] => {
    return text
      .trim()
      .split("\n")
      .map(line =>
        line.split(",").map(cell => cell.trim().replace(/^"|"$/g, ""))
      );
  };

  const handleFile = (file: File) => {
    if (!file.name.endsWith(".csv")) {
      toast({ title: "Invalid file", description: "Please upload a .csv file", variant: "destructive" });
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = parseCSV(text);
      setPreviewData(rows);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const processImport = () => {
    if (!previewData || previewData.length < 2) return;

    setImporting(true);

    // Simulate processing
    setTimeout(() => {
      const headers = previewData[0].map(h => h.toLowerCase());
      const nameIdx = headers.indexOf("name");
      const skuIdx = headers.indexOf("sku");
      const priceIdx = headers.indexOf("price");
      const stockIdx = headers.indexOf("stock");
      const categoryIdx = headers.indexOf("category");
      const channelIdx = headers.indexOf("channel");

      const results: ImportResult = { total: 0, success: 0, errors: 0, rows: [] };

      for (let i = 1; i < previewData.length; i++) {
        const row = previewData[i];
        if (row.length < 2 || row.every(c => !c)) continue;

        results.total++;
        const name = nameIdx >= 0 ? row[nameIdx] : "";
        const sku = skuIdx >= 0 ? row[skuIdx] : "";
        const price = priceIdx >= 0 ? parseFloat(row[priceIdx]) : 0;
        const stock = stockIdx >= 0 ? parseInt(row[stockIdx]) : 0;
        const category = categoryIdx >= 0 ? row[categoryIdx] : "";
        const channel = channelIdx >= 0 ? row[channelIdx] : "My Shopify Store";

        if (!name || !sku) {
          results.errors++;
          results.rows.push({ name, sku, price, stock, category, channel, status: "error", error: "Missing name or SKU" });
        } else if (isNaN(price) || price < 0) {
          results.errors++;
          results.rows.push({ name, sku, price, stock, category, channel, status: "error", error: "Invalid price" });
        } else {
          results.success++;
          results.rows.push({ name, sku, price, stock, category, channel, status: "success" });
        }
      }

      setImportResult(results);
      setImporting(false);
      setPreviewData(null);

      toast({
        title: "Import Complete",
        description: `${results.success} of ${results.total} products imported successfully`,
      });
    }, 1500);
  };

  const exportCSV = () => {
    const headers = ["Name", "SKU", "Channel", "Platform", "Local Stock", "Remote Stock", "Status", "Last Synced"];
    const rows = products.map(p => [
      p.name, p.sku, p.channel, p.platform, p.localStock.toString(), p.remoteStock.toString(), p.status, p.lastSynced,
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `products-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({ title: "Export Complete", description: `${products.length} products exported as CSV` });
  };

  const downloadTemplate = () => {
    const csv = "Name,SKU,Price,Stock,Category,Channel\nWireless Mouse,WM-100,29.99,50,Electronics,My Shopify Store\nKeyboard,KB-200,89.99,30,Electronics,Salla متجري";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "import-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setPreviewData(null);
    setImportResult(null);
    setFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-5">
      {/* Action Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm" variant="outline" className="gap-2" onClick={downloadTemplate}>
          <FileSpreadsheet className="h-4 w-4" /> Download Template
        </Button>
        <Button size="sm" variant="outline" className="gap-2" onClick={exportCSV}>
          <Download className="h-4 w-4" /> Export Products
        </Button>
        <Badge variant="outline" className="text-muted-foreground">
          {products.length} products available for export
        </Badge>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Import Zone */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Upload className="h-4 w-4 text-primary" /> Import Products
            </CardTitle>
            <CardDescription>Upload a CSV file to bulk import or update products across channels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileInput}
            />

            {!previewData && !importResult && (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
                  dragOver
                    ? "border-primary bg-primary/5 scale-[1.02]"
                    : "border-border hover:border-primary/50 hover:bg-muted/30"
                }`}
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <FileUp className="h-7 w-7 text-primary" />
                </div>
                <p className="font-medium text-foreground mb-1">Drop CSV file here</p>
                <p className="text-sm text-muted-foreground">or click to browse</p>
                <p className="text-xs text-muted-foreground mt-3">
                  Required columns: <span className="font-mono text-foreground">Name, SKU, Price, Stock, Category, Channel</span>
                </p>
              </div>
            )}

            {/* Preview */}
            {previewData && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">{fileName}</span>
                    <Badge variant="outline">{previewData.length - 1} rows</Badge>
                  </div>
                  <Button size="sm" variant="ghost" onClick={clearAll}><X className="h-4 w-4" /></Button>
                </div>
                <div className="max-h-48 overflow-auto rounded-lg border border-border">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-muted/50">
                        {previewData[0].map((h, i) => (
                          <th key={i} className="p-2 text-left font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.slice(1, 6).map((row, ri) => (
                        <tr key={ri} className="border-t border-border/50">
                          {row.map((cell, ci) => (
                            <td key={ci} className="p-2 text-foreground whitespace-nowrap">{cell}</td>
                          ))}
                        </tr>
                      ))}
                      {previewData.length > 6 && (
                        <tr className="border-t border-border/50">
                          <td colSpan={previewData[0].length} className="p-2 text-center text-muted-foreground">
                            ... and {previewData.length - 6} more rows
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 gap-2" onClick={processImport} disabled={importing}>
                    {importing ? (
                      <><span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" /> Processing...</>
                    ) : (
                      <><Upload className="h-4 w-4" /> Import {previewData.length - 1} Products</>
                    )}
                  </Button>
                  <Button size="sm" variant="outline" onClick={clearAll}>Cancel</Button>
                </div>
              </div>
            )}

            {/* Result */}
            {importResult && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Import Results</span>
                  <Button size="sm" variant="ghost" onClick={clearAll}><X className="h-4 w-4" /></Button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-muted/50 p-3 text-center">
                    <p className="text-xl font-bold text-foreground">{importResult.total}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                  <div className="rounded-lg bg-success/10 p-3 text-center">
                    <p className="text-xl font-bold text-success">{importResult.success}</p>
                    <p className="text-xs text-muted-foreground">Success</p>
                  </div>
                  <div className="rounded-lg bg-destructive/10 p-3 text-center">
                    <p className="text-xl font-bold text-destructive">{importResult.errors}</p>
                    <p className="text-xs text-muted-foreground">Errors</p>
                  </div>
                </div>
                <Progress value={(importResult.success / importResult.total) * 100} className="h-1.5" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Import Result Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" /> Import Log
            </CardTitle>
            <CardDescription>Review the status of each imported product</CardDescription>
          </CardHeader>
          <CardContent>
            {importResult ? (
              <div className="max-h-80 overflow-auto rounded-lg border border-border">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-muted/50 sticky top-0">
                      <th className="p-2.5 text-left font-medium text-muted-foreground">Product</th>
                      <th className="p-2.5 text-left font-medium text-muted-foreground">SKU</th>
                      <th className="p-2.5 text-left font-medium text-muted-foreground">Channel</th>
                      <th className="p-2.5 text-left font-medium text-muted-foreground">Price</th>
                      <th className="p-2.5 text-left font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importResult.rows.map((row, i) => (
                      <tr key={i} className="border-t border-border/50">
                        <td className="p-2.5 text-foreground font-medium">{row.name || "—"}</td>
                        <td className="p-2.5 text-muted-foreground font-mono">{row.sku || "—"}</td>
                        <td className="p-2.5 text-muted-foreground">{row.channel}</td>
                        <td className="p-2.5 text-foreground font-mono">${row.price.toFixed(2)}</td>
                        <td className="p-2.5">
                          {row.status === "success" ? (
                            <Badge className="bg-success/10 text-success border-success/20 gap-1 text-[10px]">
                              <CheckCircle2 className="h-2.5 w-2.5" /> OK
                            </Badge>
                          ) : (
                            <Badge className="bg-destructive/10 text-destructive border-destructive/20 gap-1 text-[10px]" title={row.error}>
                              <AlertCircle className="h-2.5 w-2.5" /> {row.error}
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <FileSpreadsheet className="h-10 w-10 mb-3 opacity-30" />
                <p className="text-sm">No import data yet</p>
                <p className="text-xs mt-1">Upload and process a CSV to see results here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CSVImportExport;
