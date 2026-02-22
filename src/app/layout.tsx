import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BusinessPurposeProvider } from "@/context/BusinessPurposeContext";
import { Toaster } from "sonner";
import { Providers } from "./providers";
import { LanguageProvider } from "@/hooks/useLanguage";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Since Satoshi is typically a local font or from a specific CDN, 
// and I've already @imported it in globals.css with the name "Satoshi",
// I will ensure the body class uses the variable defined in @theme.


export const metadata: Metadata = {
  title: "Zosair | Merchant Dashboard",
  description: "Advanced multi-tenant business management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <Providers>
          <LanguageProvider>
            <BusinessPurposeProvider>
              {children}
              <Toaster position="top-center" expand={false} richColors />
            </BusinessPurposeProvider>
          </LanguageProvider>
        </Providers>
      </body>
    </html>
  );
}
