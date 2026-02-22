import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Lock, Delete, ArrowRight } from "lucide-react";

interface PosPinPadProps {
    onSuccess: (staffId: number, name: string) => void;
    isOpen: boolean;
}

const PosPinPad = ({ onSuccess, isOpen }: PosPinPadProps) => {
    const [pin, setPin] = useState("");
    const [error, setError] = useState(false);

    const handleKeyPress = (val: string) => {
        if (pin.length < 4) {
            setPin(prev => prev + val);
        }
    };

    const handleClear = () => setPin("");

    const handleSubmit = () => {
        // Placeholder logic for PIN verification
        if (pin === "1234") {
            onSuccess(1, "Admin Staff");
        } else {
            setError(true);
            setPin("");
            setTimeout(() => setError(false), 500);
        }
    };

    return (
        <Dialog open={isOpen}>
            <DialogContent className="sm:max-width-[360px] p-6">
                <DialogHeader className="flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                        <Lock className="h-6 w-6 text-primary" />
                    </div>
                    <DialogTitle>Staff PIN Required</DialogTitle>
                    <p className="text-xs text-muted-foreground">Please enter your 4-digit access code</p>
                </DialogHeader>

                <div className="mt-6 flex flex-col items-center gap-6">
                    <div className={`flex gap-3 ${error ? 'animate-shake' : ''}`}>
                        {[...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className={`h-4 w-4 rounded-full border-2 border-primary transition-all duration-200 ${pin.length > i ? "bg-primary" : "bg-transparent"
                                    } ${error ? "border-destructive bg-destructive" : ""}`}
                            />
                        ))}
                    </div>

                    <div className="grid grid-cols-3 gap-3 w-full max-w-[280px]">
                        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "OK"].map((btn) => (
                            <Button
                                key={btn}
                                variant={btn === "OK" ? "default" : "outline"}
                                className={`h-14 text-lg font-bold rounded-xl ${btn === "OK" ? "bg-primary hover:bg-primary/90" : "hover:bg-accent"
                                    }`}
                                onClick={() => {
                                    if (btn === "C") handleClear();
                                    else if (btn === "OK") handleSubmit();
                                    else handleKeyPress(btn);
                                }}
                            >
                                {btn === "C" ? <Delete className="h-5 w-5" /> : btn === "OK" ? <ArrowRight className="h-5 w-5" /> : btn}
                            </Button>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PosPinPad;
