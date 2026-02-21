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
              <div className="fixed inset-0 -z-10 h-full w-full bg-background [background:radial-gradient(125%_125%_at_50%_10%,transparent_40%,var(--primary)_150%)] opacity-10" />

              {/* Global Fixed Background Effects */}
              <div className="fixed inset-0 -z-5 pointer-events-none overflow-hidden">
                <div className="absolute -top-[10%] -left-[10%] h-[50vw] w-[50vw] bg-primary/10 rounded-full blur-[120px] mix-blend-screen opacity-50 pointer-events-none" />
                <div className="absolute top-[20%] -right-[10%] h-[40vw] w-[40vw] bg-accent/10 rounded-full blur-[120px] mix-blend-screen opacity-50 pointer-events-none" />
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
