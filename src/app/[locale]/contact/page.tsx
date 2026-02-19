"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Mail, Copy, Check } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function ContactPage() {
    const t = useTranslations('ContactPage')
    const [copied, setCopied] = useState(false)
    const email = "lkswp.contato@gmail.com"

    const handleCopy = () => {
        navigator.clipboard.writeText(email)
        setCopied(true)
        toast.success(t('copied'))
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 relative">
            {/* Background Effects */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-[128px] animate-pulse" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full"
            >
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 animate-gradient-x"></div>
                    <div className="relative bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 text-center space-y-8">
                        <div>
                            <div className="h-20 w-20 mx-auto rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-xl">
                                <Mail className="h-10 w-10 text-white/90" />
                            </div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                                {t('title')}
                            </h1>
                            <p className="text-muted-foreground mt-2">
                                {t('desc')}
                            </p>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-4 group/item hover:border-white/20 transition-colors">
                            <div className="text-left overflow-hidden">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">{t('emailLabel')}</p>
                                <p className="text-lg font-mono text-white/90 truncate">{email}</p>
                            </div>
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={handleCopy}
                                className="h-10 w-10 shrink-0 rounded-xl hover:bg-white/10"
                            >
                                {copied ? (
                                    <Check className="h-5 w-5 text-green-500" />
                                ) : (
                                    <Copy className="h-5 w-5 text-white/70" />
                                )}
                            </Button>
                        </div>

                        <div className="flex justify-center">
                            <Button
                                className="w-full rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/5 backdrop-blur-sm"
                                onClick={() => window.open(`mailto:${email}`)}
                            >
                                Send Email
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
