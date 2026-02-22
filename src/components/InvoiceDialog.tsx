import { useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Printer } from "lucide-react";

interface InvoiceItem {
  name: string;
  quantity: number;
  unitPrice: number;
}

interface InvoiceData {
  id: string;
  date: string;
  type: "Sales Invoice" | "Purchase Order";
  from: { name: string; address?: string; email?: string; phone?: string };
  to: { name: string; address?: string; email?: string; phone?: string };
  items: InvoiceItem[];
  subtotal: number;
  shipping?: number;
  discount?: number;
  tax?: number;
  total: number;
  paymentMethod?: string;
  notes?: string;
}

interface InvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: InvoiceData | null;
}

const InvoiceDialog = ({ open, onOpenChange, data }: InvoiceDialogProps) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!printRef.current) return;
    const content = printRef.current.innerHTML;
    const win = window.open("", "_blank", "width=800,height=900");
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html><head><title>Invoice ${data?.id}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', system-ui, sans-serif; color: #1a1a1a; padding: 40px; max-width: 800px; margin: 0 auto; }
        .invoice-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; }
        .invoice-title { font-size: 28px; font-weight: 700; color: #3b82f6; }
        .invoice-meta { text-align: right; font-size: 13px; color: #666; }
        .invoice-meta strong { color: #1a1a1a; display: block; font-size: 14px; }
        .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px; }
        .party-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 6px; font-weight: 600; }
        .party-name { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
        .party-detail { font-size: 13px; color: #555; line-height: 1.5; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        th { background: #f8fafc; border-bottom: 2px solid #e2e8f0; padding: 10px 12px; text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; }
        td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
        .text-right { text-align: right; }
        .totals { margin-left: auto; width: 280px; }
        .total-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; color: #555; }
        .total-row.grand { border-top: 2px solid #1a1a1a; padding-top: 10px; margin-top: 6px; font-size: 18px; font-weight: 700; color: #1a1a1a; }
        .footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #999; text-align: center; }
        @media print { body { padding: 20px; } }
      </style>
      </head><body>${content}
      <script>window.onload=function(){window.print();}<\/script>
      </body></html>
    `);
    win.document.close();
  };

  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Invoice Preview</DialogTitle>
            <Button onClick={handlePrint} className="gap-2"><Printer className="h-4 w-4" />Print / PDF</Button>
          </div>
        </DialogHeader>

        <div ref={printRef}>
          {/* Header with Logo */}
          <div className="invoice-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: "linear-gradient(135deg, #3b82f6, #1d4ed8)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 22, fontWeight: 700 }}>T</div>
              <div>
                <div className="invoice-title" style={{ fontSize: 24, fontWeight: 700, color: "#3b82f6" }}>TailAdmin</div>
                <div style={{ fontSize: 12, color: "#888", letterSpacing: 1, textTransform: "uppercase" }}>{data.type}</div>
              </div>
            </div>
            <div className="invoice-meta" style={{ textAlign: "right", fontSize: 13, color: "#666" }}>
              <strong style={{ color: "#1a1a1a", display: "block", fontSize: 16, fontWeight: 600 }}>{data.id}</strong>
              <div>Date: {data.date}</div>
              {data.paymentMethod && <div>Payment: {data.paymentMethod}</div>}
            </div>
          </div>

          {/* Parties */}
          <div className="parties" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
            <div>
              <div className="party-label" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "#999", marginBottom: 6, fontWeight: 600 }}>From</div>
              <div className="party-name" style={{ fontSize: 15, fontWeight: 600 }}>{data.from.name}</div>
              {data.from.address && <div className="party-detail" style={{ fontSize: 13, color: "#555" }}>{data.from.address}</div>}
              {data.from.email && <div className="party-detail" style={{ fontSize: 13, color: "#555" }}>{data.from.email}</div>}
              {data.from.phone && <div className="party-detail" style={{ fontSize: 13, color: "#555" }}>{data.from.phone}</div>}
            </div>
            <div>
              <div className="party-label" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "#999", marginBottom: 6, fontWeight: 600 }}>To</div>
              <div className="party-name" style={{ fontSize: 15, fontWeight: 600 }}>{data.to.name}</div>
              {data.to.address && <div className="party-detail" style={{ fontSize: 13, color: "#555" }}>{data.to.address}</div>}
              {data.to.email && <div className="party-detail" style={{ fontSize: 13, color: "#555" }}>{data.to.email}</div>}
              {data.to.phone && <div className="party-detail" style={{ fontSize: 13, color: "#555" }}>{data.to.phone}</div>}
            </div>
          </div>

          {/* Items Table */}
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
                <th style={{ padding: "10px 12px", textAlign: "left", fontSize: 12, textTransform: "uppercase", color: "#64748b", background: "#f8fafc" }}>#</th>
                <th style={{ padding: "10px 12px", textAlign: "left", fontSize: 12, textTransform: "uppercase", color: "#64748b", background: "#f8fafc" }}>Item</th>
                <th style={{ padding: "10px 12px", textAlign: "right", fontSize: 12, textTransform: "uppercase", color: "#64748b", background: "#f8fafc" }}>Qty</th>
                <th style={{ padding: "10px 12px", textAlign: "right", fontSize: 12, textTransform: "uppercase", color: "#64748b", background: "#f8fafc" }}>Unit Price</th>
                <th style={{ padding: "10px 12px", textAlign: "right", fontSize: 12, textTransform: "uppercase", color: "#64748b", background: "#f8fafc" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "10px 12px", fontSize: 14 }}>{i + 1}</td>
                  <td style={{ padding: "10px 12px", fontSize: 14, fontWeight: 500 }}>{item.name}</td>
                  <td style={{ padding: "10px 12px", fontSize: 14, textAlign: "right" }}>{item.quantity}</td>
                  <td style={{ padding: "10px 12px", fontSize: 14, textAlign: "right" }}>৳{item.unitPrice.toFixed(2)}</td>
                  <td style={{ padding: "10px 12px", fontSize: 14, textAlign: "right", fontWeight: 600 }}>৳{(item.quantity * item.unitPrice).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="totals" style={{ marginLeft: "auto", width: 280 }}>
            <div className="total-row" style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 14, color: "#555" }}>
              <span>Subtotal</span><span>৳{data.subtotal.toFixed(2)}</span>
            </div>
            {(data.shipping !== undefined && data.shipping > 0) && (
              <div className="total-row" style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 14, color: "#555" }}>
                <span>Shipping</span><span>৳{data.shipping.toFixed(2)}</span>
              </div>
            )}
            {(data.discount !== undefined && data.discount > 0) && (
              <div className="total-row" style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 14, color: "#555" }}>
                <span>Discount</span><span>-৳{data.discount.toFixed(2)}</span>
              </div>
            )}
            {(data.tax !== undefined && data.tax > 0) && (
              <div className="total-row" style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 14, color: "#555" }}>
                <span>Tax</span><span>৳{data.tax.toFixed(2)}</span>
              </div>
            )}
            <div className="total-row grand" style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, marginTop: 6, fontSize: 18, fontWeight: 700, borderTop: "2px solid #1a1a1a" }}>
              <span>Total</span><span>৳{data.total.toFixed(2)}</span>
            </div>
          </div>

          {data.notes && (
            <div style={{ marginTop: 24, fontSize: 13, color: "#666" }}>
              <strong>Notes:</strong> {data.notes}
            </div>
          )}

          {/* Bank Details */}
          <div style={{ marginTop: 32, padding: 16, background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1, color: "#999", fontWeight: 600, marginBottom: 8 }}>Bank Details</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 13, color: "#555" }}>
              <div><strong style={{ color: "#333" }}>Bank:</strong> Dutch-Bangla Bank Ltd.</div>
              <div><strong style={{ color: "#333" }}>Branch:</strong> Gulshan, Dhaka</div>
              <div><strong style={{ color: "#333" }}>A/C Name:</strong> TailAdmin Ltd.</div>
              <div><strong style={{ color: "#333" }}>A/C No:</strong> 1501-0200-12345</div>
              <div><strong style={{ color: "#333" }}>Routing:</strong> 090261524</div>
              <div><strong style={{ color: "#333" }}>Swift:</strong> DBBLBDDH</div>
            </div>
            <div style={{ marginTop: 8, fontSize: 12, color: "#888" }}>
              <strong>bKash/Nagad:</strong> 01700-000000 (Merchant)
            </div>
          </div>

          {/* Footer */}
          <div className="footer" style={{ marginTop: 32, paddingTop: 16, borderTop: "1px solid #e2e8f0", textAlign: "center" }}>
            <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Terms: Payment due within 15 days. Late payments subject to 2% monthly interest.</div>
            <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>Goods once sold are non-refundable unless covered under our Returns Policy.</div>
            <div style={{ fontSize: 11, color: "#999" }}>TailAdmin Ltd. • BIN: 000123456789 • TIN: 123456789012 • Trade License: DSCC-2024-00123</div>
            <div style={{ fontSize: 11, color: "#aaa", marginTop: 4 }}>123 Business Ave, Gulshan-2, Dhaka-1212, Bangladesh • +880-1700-000000 • info@tailadmin.com</div>
            <div style={{ fontSize: 11, color: "#bbb", marginTop: 8, fontStyle: "italic" }}>This is a computer-generated invoice and does not require a signature.</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export type { InvoiceData, InvoiceItem };
export default InvoiceDialog;
