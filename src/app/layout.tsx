import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "TapDown - Social Media Video Downloader",
  description: "Download videos from TikTok, Instagram, and more in high quality. Fast, free, and easy.",
};

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "sonner"; // Assuming shadcn/ui creates a toaster using sonner? No, I installed sonner directly. I need to check if I have a ui/sonner component locally or if I should use sonner directly.
// Shadcn usually uses a wrapper. I haven't added 'sonner' via shadcn CLI. 
// I will import Toaster from "sonner" directly for now.

// ... existing imports

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} antialiased bg-background text-foreground selection:bg-primary/20 selection:text-primary relative overflow-x-hidden min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="fixed inset-0 -z-10 h-full w-full bg-background [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] opacity-20" />
          <Header />
          <main className="flex-1 container mx-auto px-4 pt-24 pb-12">
            {children}
          </main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
