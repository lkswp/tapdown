"use client"

import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"
import { LanguageSwitcher } from "@/components/features/language-switcher"
import { useTranslations } from "next-intl"
import Image from "next/image"

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { LogIn, Sparkles } from "lucide-react"

export function Header() {
    const t = useTranslations('Header')

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-background/60 backdrop-blur-xl">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative h-12 w-32 group-hover:scale-105 transition-transform">
                        <Image
                            src="/logo.png"
                            alt="TapDown Logo"
                            fill
                            className="object-contain object-left"
                            priority
                        />
                    </div>
                </Link>

                {/* Centered Navigation for better alignment */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground absolute left-1/2 -translate-x-1/2">
                    <Link href="/" className="hover:text-foreground transition-colors hover:bg-white/5 px-4 py-2 rounded-full">{t('home')}</Link>
                    <Link href="/pricing" className="hover:text-foreground transition-colors hover:bg-white/5 px-4 py-2 rounded-full flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                        Pricing
                    </Link>
                    <Link href="/how-it-works" className="hover:text-foreground transition-colors hover:bg-white/5 px-4 py-2 rounded-full">{t('howItWorks')}</Link>
                    <Link href="/contact" className="hover:text-foreground transition-colors hover:bg-white/5 px-4 py-2 rounded-full">{t('contact')}</Link>
                </nav>

                <div className="flex items-center gap-4">
                    <LanguageSwitcher />

                    <SignedOut>
                        <SignInButton mode="modal">
                            <Button variant="ghost" size="sm" className="gap-2">
                                <LogIn className="h-4 w-4" />
                                Login
                            </Button>
                        </SignInButton>
                    </SignedOut>

                    <SignedIn>
                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: "h-9 w-9 ring-2 ring-primary/20 hover:ring-primary/50 transition-all"
                                }
                            }}
                        />
                    </SignedIn>
                </div>
            </div>
        </header>
    )
}
