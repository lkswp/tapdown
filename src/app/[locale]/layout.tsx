import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "TapDown - Social Media Video Downloader",
  description: "Download videos from TikTok, Instagram, and more in high quality. Fast, free, and easy.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  }
};

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "sonner";
import { CustomCursor } from "@/components/ui/custom-cursor";

import { ClerkProvider } from "@clerk/nextjs";
import { ptBR, esES, enUS } from "@clerk/localizations";

const clerkLocalizations = {
  en: enUS,
  pt: ptBR,
  es: esES,
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <ClerkProvider localization={clerkLocalizations[locale as keyof typeof clerkLocalizations]}>
      <html lang={locale} suppressHydrationWarning>
        <body
          className={`${outfit.variable} antialiased bg-background text-foreground selection:bg-primary/20 selection:text-primary relative overflow-x-hidden min-h-screen flex flex-col`}
        >
          <NextIntlClientProvider messages={messages}>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <div className="fixed inset-0 -z-10 h-full w-full bg-background [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] opacity-20" />

              {/* Global Fixed Background Effects */}
              <div className="fixed inset-0 -z-5 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 h-96 w-96 bg-primary/20 rounded-full blur-[128px] animate-pulse opacity-50" />
                <div className="absolute bottom-1/4 right-1/4 h-96 w-96 bg-accent/20 rounded-full blur-[128px] animate-pulse delay-1000 opacity-50" />
              </div>

              <CustomCursor />
              <Header />
              <main className="flex-1 container mx-auto px-4 pt-24 pb-12">
                {children}
              </main>
              <Footer />
              <Toaster />
            </ThemeProvider>
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
