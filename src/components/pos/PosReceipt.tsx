import { QRCodeSVG } from "qrcode.react";
import { format } from "date-fns";
import { Printer, Download, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ReceiptProps {
    order: any;
    onClose: () => void;
    isOpen: boolean;
}

const PosReceipt = ({ order, onClose, isOpen }: ReceiptProps) => {
    const handlePrint = () => {
        window.print();
    };

    if (!order) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden bg-white text-black print:shadow-none print:border-none">
                <div className="p-6 space-y-4 NO-PRINT">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                            <CheckCircle className="h-5 w-5" /> Transaction Complete
                        </div>
                        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full"><X className="h-5 w-5" /></button>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={handlePrint} className="flex-1 gap-2"><Printer className="h-4 w-4" /> Print Receipt</Button>
                        <Button variant="outline" className="flex-1 gap-2"><Download className="h-4 w-4" /> Save PDF</Button>
                    </div>
                </div>

                {/* Real Receipt Content */}
                <div id="receipt-content" className="p-8 font-mono text-sm border-t border-dashed print:border-none print:p-0">
                    <div className="text-center space-y-1 mb-6">
                        <h2 className="text-xl font-bold uppercase tracking-tighter">ELITE RETAIL POS</h2>
                        <p className="text-xs">King Fahd Road, Riyadh, Saudi Arabia</p>
                        <p className="text-xs">VAT No: 300000000000003</p>
                        <p className="text-xs">Tel: +966 11 123 4567</p>
                    </div>

                    <div className="flex justify-between text-[10px] border-b border-black pb-2 mb-4">
                        <span>#{order.id || order.tempId}</span>
                        <span>{format(order.date || order.createdAt, "dd/MM/yyyy HH:mm")}</span>
                    </div>

                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between font-bold border-b border-black pb-1 text-[11px]">
                            <span>ITEM</span>
                            <span>QTY</span>
                            <span>TOTAL</span>
                        </div>
                        {order.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between text-[11px]">
                                <div className="flex flex-col">
                                    <span className="truncate max-w-[180px]">{item.name}</span>
                                    <span className="text-[9px] text-gray-500">SAR {item.price.toFixed(2)}/unit</span>
                                </div>
                                <span>{item.qty}</span>
                                <span>{(item.price * item.qty).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-black pt-2 space-y-1 text-xs">
                        <div className="flex justify-between"><span>Subtotal</span><span>SAR {order.subtotal.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span>Tax (15% VAT)</span><span>SAR {order.tax.toFixed(2)}</span></div>
                        {order.discount > 0 && (
                            <div className="flex justify-between font-bold"><span>Discount</span><span>-SAR {order.discount.toFixed(2)}</span></div>
                        )}
                        <div className="flex justify-between text-base font-bold border-t border-black pt-1 mt-1">
                            <span>TOTAL</span>
                            <span>SAR {order.total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="mt-4 pt-2 border-t border-dashed border-gray-300 text-center space-y-3">
                        <p className="text-[10px] font-bold">PAYMENT: {order.paymentMethod?.toUpperCase()}</p>

                        {/* ZATCA QR CODE */}
                        <div className="flex flex-col items-center gap-1">
                            <div className="p-2 bg-white border border-gray-100 rounded-md">
                                <QRCodeSVG
                                    value={order.zatcaData || "ZATCA_PHASE_1_PENDING_SYNC"}
                                    size={100}
                                    level="M"
                                    marginSize={0}
                                />
                            </div>
                            <p className="text-[9px] text-gray-500">Scan for ZATCA E-Invoice Verification</p>
                        </div>

                        <p className="text-[10px] italic">Thank you for shopping with us!</p>
                    </div>
                </div>
            </DialogContent>

            <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #receipt-content, #receipt-content * { visibility: visible; }
          #receipt-content { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 80mm;
            padding: 5mm;
          }
          .NO-PRINT { display: none !important; }
        }
      `}</style>
        </Dialog>
    );
};

export default PosReceipt;
