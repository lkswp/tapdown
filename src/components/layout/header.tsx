"use client"

import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"
import { LanguageSwitcher } from "@/components/features/language-switcher"
import { useTranslations } from "next-intl"
import Image from "next/image"

export function Header() {
    const t = useTranslations('Header')

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-background/60 backdrop-blur-xl">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative h-10 w-10 overflow-hidden rounded-xl group-hover:scale-105 transition-transform">
                        <Image
                            src="/logo.png"
                            alt="TapDown Logo"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                    <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">TapDown</span>
                </Link>

                {/* Centered Navigation for better alignment */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground absolute left-1/2 -translate-x-1/2">
                    <Link href="/" className="hover:text-foreground transition-colors hover:bg-white/5 px-4 py-2 rounded-full">{t('home')}</Link>
                    <Link href="/how-it-works" className="hover:text-foreground transition-colors hover:bg-white/5 px-4 py-2 rounded-full">{t('howItWorks')}</Link>
                    <Link href="/faq" className="hover:text-foreground transition-colors hover:bg-white/5 px-4 py-2 rounded-full">{t('faq')}</Link>
                </nav>

                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <Button variant="ghost" size="icon" asChild>
                        <a href="https://github.com/lkswp/tapdown" target="_blank" rel="noopener noreferrer">
                            <Github className="h-5 w-5" />
                        </a>
                    </Button>
                </div>
            </div>
        </header>
    )
}
