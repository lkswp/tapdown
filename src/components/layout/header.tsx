"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Github, Twitter } from "lucide-react"

export function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-background/60 backdrop-blur-xl">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xl">
                        T
                    </div>
                    <span className="text-xl font-bold tracking-tight">TapDown</span>
                </Link>

                <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
                    <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                    <Link href="/how-it-works" className="hover:text-foreground transition-colors">How it works</Link>
                    <Link href="/faq" className="hover:text-foreground transition-colors">FAQ</Link>
                </nav>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="https://github.com" target="_blank">
                            <Github className="h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </div>
        </header>
    )
}
