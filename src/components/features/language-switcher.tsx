"use client"

import { useLocale } from "next-intl"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"

export function LanguageSwitcher() {
    const locale = useLocale()
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const onSelectChange = (nextLocale: string) => {
        startTransition(() => {
            // Replace the locale in the pathname
            // Since we don't have a sophisticated path replacement utility yet, simple approach:
            // This assumes we are using the middleware rewrite
            // But router.replace might need the full path
            // Actually with next-intl and app router, standard links often work if prefix is handled
            // But programmatic navigation usually requires constructing the path

            const currentPath = window.location.pathname
            const segments = currentPath.split('/')
            // segments[0] is empty, segments[1] is locale
            segments[1] = nextLocale
            const newPath = segments.join('/')
            router.replace(newPath)
        })
    }

    const languages = {
        en: "English",
        pt: "Português",
        es: "Español"
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" disabled={isPending}>
                    <Globe className="h-5 w-5" />
                    <span className="sr-only">Switch Language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {Object.entries(languages).map(([key, label]) => (
                    <DropdownMenuItem
                        key={key}
                        onClick={() => onSelectChange(key)}
                        className={locale === key ? "bg-accent" : ""}
                    >
                        {label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
