import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Palette, Upload, Image, Check, Layout, Type } from "lucide-react";

interface StoreBrandingProps {
    data: Record<string, string>;
    onChange: (key: string, value: string) => void;
}

const themeColors = [
    { name: "Teal (Default)", primary: "#0d9488", secondary: "#14b8a6" },
    { name: "Ocean Blue", primary: "#0284c7", secondary: "#0ea5e9" },
    { name: "Royal Purple", primary: "#7c3aed", secondary: "#8b5cf6" },
    { name: "Midnight Red", primary: "#dc2626", secondary: "#ef4444" },
    { name: "Forest Green", primary: "#16a34a", secondary: "#22c55e" },
    { name: "Luxe Gold", primary: "#b45309", secondary: "#d97706" },
    { name: "Deep Charcoal", primary: "#334155", secondary: "#475569" },
];

const fontStyles = [
    { id: "inter", name: "Modern (Inter)", class: "font-sans" },
    { id: "roboto", name: "clean (Roboto)", class: "font-sans" },
    { id: "outfit", name: "Premium (Outfit)", class: "font-sans" },
    { id: "playfair", name: "Elegant (Playfair Display)", class: "font-serif" },
];

const StoreBranding = ({ data, onChange }: StoreBrandingProps) => {
    const [selectedColor, setSelectedColor] = useState(data.primaryColor || themeColors[0].primary);

    const handleColorSelect = (color: string) => {
        setSelectedColor(color);
        onChange("primaryColor", color);
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
                    <Palette className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Store Branding</h2>
                <p className="text-muted-foreground mt-1">Make your store stand out with your unique brand</p>
            </div>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Configuration */}
                <div className="space-y-5">
                    <Card>
                        <CardContent className="p-5 space-y-4">
                            <h3 className="font-semibold text-foreground flex items-center gap-2">
                                <Image className="h-4 w-4 text-primary" /> Store Logo
                            </h3>
                            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-xl hover:bg-primary/5 hover:border-primary/50 transition-all cursor-pointer group">
                                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                    <Upload className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <p className="text-sm font-medium text-foreground">Upload Logo</p>
                                <p className="text-[11px] text-muted-foreground mt-1 text-center">Transparent PNG or SVG recommended<br />Max size 2MB</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-5 space-y-4">
                            <h3 className="font-semibold text-foreground flex items-center gap-2">
                                <Palette className="h-4 w-4 text-primary" /> Brand Colors
                            </h3>
                            <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                                {themeColors.map((color) => (
                                    <button
                                        key={color.name}
                                        onClick={() => handleColorSelect(color.primary)}
                                        className={`h-10 w-10 rounded-full border-2 transition-all flex items-center justify-center ${selectedColor === color.primary ? "border-primary scale-110 shadow-md" : "border-transparent"
                                            }`}
                                        style={{ backgroundColor: color.primary }}
                                        title={color.name}
                                    >
                                        {selectedColor === color.primary && <Check className="h-5 w-5 text-white" />}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-3 pt-2">
                                <Label className="text-xs">Custom Color</Label>
                                <input
                                    type="color"
                                    value={selectedColor}
                                    onChange={(e) => handleColorSelect(e.target.value)}
                                    className="h-8 w-16 p-0.5 rounded cursor-pointer bg-card border border-border"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-5 space-y-4">
                            <h3 className="font-semibold text-foreground flex items-center gap-2">
                                <Type className="h-4 w-4 text-primary" /> Typography
                            </h3>
                            <div className="grid grid-cols-1 gap-2">
                                {fontStyles.map((font) => (
                                    <button
                                        key={font.id}
                                        onClick={() => onChange("fontFamily", font.id)}
                                        className={`flex items-center justify-between p-3 rounded-lg border text-sm transition-all ${data.fontFamily === font.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/30"
                                            }`}
                                    >
                                        <span className={font.class}>{font.name}</span>
                                        {data.fontFamily === font.id && <Check className="h-4 w-4 text-primary" />}
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right: Preview */}
                <div className="space-y-4">
                    <div className="sticky top-24">
                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Layout className="h-3 w-3" /> Live Preview
                        </h3>
                        <Card className="overflow-hidden border-2 shadow-xl">
                            <div className="h-10 border-b border-border bg-card flex items-center px-3 gap-2">
                                <div className="flex gap-1">
                                    <div className="h-2 w-2 rounded-full bg-red-500/50" />
                                    <div className="h-2 w-2 rounded-full bg-amber-500/50" />
                                    <div className="h-2 w-2 rounded-full bg-emerald-500/50" />
                                </div>
                                <div className="flex-1 max-w-[150px] h-4 bg-muted/50 rounded-full mx-auto" />
                            </div>

                            {/* Fake Storefront Preview */}
                            <div className="aspect-[4/5] bg-background p-0 flex flex-col">
                                <header className="p-4 border-b border-border flex items-center justify-between">
                                    <div className="h-6 w-20 bg-muted rounded animate-pulse" />
                                    <div className="flex gap-3">
                                        <div className="h-2 w-8 bg-muted rounded" />
                                        <div className="h-2 w-8 bg-muted rounded" />
                                    </div>
                                </header>

                                <main className="flex-1 p-6 space-y-6">
                                    <div className="space-y-2 text-center">
                                        <h4 className="text-2xl font-bold" style={{ color: selectedColor }}>Luxury Collection</h4>
                                        <p className="text-[10px] text-muted-foreground max-w-[200px] mx-auto">Elevate your lifestyle with our premium curated products.</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        {[1, 2].map(i => (
                                            <div key={i} className="space-y-2">
                                                <div className="aspect-square bg-muted rounded-lg" />
                                                <div className="h-2 w-full bg-muted rounded" />
                                                <div className="h-2 w-1/2 bg-muted rounded" />
                                            </div>
                                        ))}
                                    </div>

                                    <Button
                                        className="w-full text-xs font-bold h-10 shadow-lg shadow-black/5"
                                        style={{ backgroundColor: selectedColor }}
                                    >
                                        Browse Collections
                                    </Button>
                                </main>
                            </div>
                        </Card>

                        <p className="text-[10px] text-muted-foreground mt-4 text-center italic">
                            💡 You can further customize your store's appearance anytime from the <b>Theme Editor</b>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreBranding;
