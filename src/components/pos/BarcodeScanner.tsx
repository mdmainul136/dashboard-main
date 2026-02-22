import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScanLine, X } from "lucide-react";

interface BarcodeScannerProps {
  open: boolean;
  onClose: () => void;
  onScan: (code: string) => void;
}

const BarcodeScanner = ({ open, onClose, onScan }: BarcodeScannerProps) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isRunningRef = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState("");

  useEffect(() => {
    if (!open) return;

    const scannerId = "barcode-scanner-region";

    const timeout = setTimeout(() => {
      const scanner = new Html5Qrcode(scannerId);
      scannerRef.current = scanner;

      scanner
        .start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 150 } },
          (decodedText) => {
            isRunningRef.current = false;
            scanner.stop().catch(() => {});
            onScan(decodedText);
            onClose();
          },
          () => {}
        )
        .then(() => {
          isRunningRef.current = true;
        })
        .catch((err) => {
          console.error("Scanner error:", err);
          isRunningRef.current = false;
          setError("Camera access denied or not available. You can enter the barcode manually below.");
        });
    }, 300);

    return () => {
      clearTimeout(timeout);
      if (scannerRef.current && isRunningRef.current) {
        isRunningRef.current = false;
        scannerRef.current.stop().catch(() => {});
      }
      scannerRef.current = null;
      setError(null);
      setManualCode("");
    };
  }, [open, onScan, onClose]);

  const handleManualSubmit = () => {
    if (manualCode.trim()) {
      onScan(manualCode.trim());
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ScanLine className="h-5 w-5 text-primary" /> Barcode Scanner
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {!error ? (
            <div className="relative overflow-hidden rounded-lg border border-border bg-black">
              <div id="barcode-scanner-region" className="w-full" />
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-muted/50 p-6 text-center">
              <ScanLine className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          )}

          {/* Manual input fallback */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground text-center">Or enter barcode manually:</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleManualSubmit()}
                placeholder="Enter barcode / product ID..."
                className="flex-1 h-9 rounded-md border border-border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              />
              <Button size="sm" onClick={handleManualSubmit} disabled={!manualCode.trim()}>
                Add
              </Button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Demo barcodes: p1, p2, p3... p12 অথবা 100001–100012
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BarcodeScanner;
