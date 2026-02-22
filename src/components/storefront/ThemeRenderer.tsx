"use client";

import React from "react";

// --- Section Component Registry ---

const HeroSection = ({ settings }: { settings: any }) => (
    <section className="py-20 text-center" style={{ backgroundColor: settings.backgroundColor || 'transparent' }}>
        <h1 className="text-5xl font-bold mb-4">{settings.title || "Welcome to our store"}</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{settings.subtitle || "Check out our latest products."}</p>
    </section>
);

const FeaturedProducts = ({ settings }: { settings: any }) => (
    <section className="py-12 px-6">
        <h2 className="text-2xl font-bold mb-8">Featured Collection (Showing {settings.count || 4} items)</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(settings.count || 4)].map((_, i) => (
                <div key={i} className="aspect-square bg-slate-100 rounded-xl flex items-center justify-center border border-dashed">
                    Product Placeholder
                </div>
            ))}
        </div>
    </section>
);

const NewsletterSection = ({ settings }: { settings: any }) => (
    <section className="py-12 bg-slate-900 text-white text-center">
        <h2 className="text-2xl font-bold mb-2">{settings.title || "Join our Newsletter"}</h2>
        <p className="text-slate-400 mb-6">{settings.subtitle || "Get weekly updates on new arrivals."}</p>
    </section>
);

const COMPONENT_MAP: Record<string, React.FC<{ settings: any }>> = {
    "hero": HeroSection,
    "featured-products": FeaturedProducts,
    "newsletter": NewsletterSection,
};

// --- Main Renderer ---

interface ThemeRendererProps {
    blueprint: {
        globalSettings: {
            primaryColor: string;
            accentColor: string;
            headingFont: string;
            bodyFont: string;
        };
        layouts: {
            home: {
                sections: Array<{ type: string; settings: any }>;
            };
        };
    };
    device?: "desktop" | "mobile";
}

const ThemeRenderer: React.FC<ThemeRendererProps> = ({ blueprint, device = "desktop" }) => {
    if (!blueprint || !blueprint.layouts || !blueprint.layouts.home) {
        return <div className="p-10 text-center text-muted-foreground">Invalid Layout Blueprint</div>;
    }

    const { globalSettings, layouts } = blueprint;
    const { sections } = layouts.home;

    return (
        <div
            className={`transition-all mx-auto bg-white border shadow-2xl rounded-lg overflow-hidden ${device === 'mobile' ? 'max-w-[375px]' : 'w-full'}`}
            style={{
                '--primary': globalSettings.primaryColor,
                '--accent': globalSettings.accentColor,
                fontFamily: globalSettings.bodyFont,
            } as React.CSSProperties}
        >
            <style jsx global>{`
                h1, h2, h3, h4, h5, h6 { font-family: ${globalSettings.headingFont}, sans-serif !important; }
                .text-primary { color: var(--primary) !important; }
                .bg-primary { background-color: var(--primary) !important; }
            `}</style>

            {/* Simulated Navigation */}
            <nav className="h-16 border-b px-6 flex items-center justify-between">
                <div className="font-bold text-lg" style={{ color: globalSettings.primaryColor }}>STORE_LOGO</div>
                <div className="flex gap-4 text-xs font-medium text-slate-600">
                    <span>Home</span>
                    <span>Shop</span>
                    <span>About</span>
                </div>
            </nav>

            {/* Dynamic Sections */}
            <main>
                {sections.map((section, index) => {
                    const Component = COMPONENT_MAP[section.type];
                    if (!Component) {
                        return (
                            <div key={index} className="p-4 bg-red-50 text-red-500 text-xs text-center border-y">
                                Unknown Section Type: <strong>{section.type}</strong>
                            </div>
                        );
                    }
                    return <Component key={index} settings={section.settings} />;
                })}
            </main>

            {/* Simulated Footer */}
            <footer className="py-8 border-t text-center text-[10px] text-slate-400">
                &copy; 2026 Your Enterprise Store. Powered by Soho OS.
            </footer>
        </div>
    );
};

export default ThemeRenderer;
