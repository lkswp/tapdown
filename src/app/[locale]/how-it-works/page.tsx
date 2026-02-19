"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Copy, ArrowRight, Download, CheckCircle2 } from "lucide-react"

export default function HowItWorksPage() {
    const t = useTranslations('HowItWorksPage')

    const steps = [
        {
            icon: <Copy className="h-8 w-8 text-primary" />,
            title: t('step1Title'),
            desc: t('step1Desc'),
        },
        {
            icon: <ArrowRight className="h-8 w-8 text-secondary-foreground" />,
            title: t('step2Title'),
            desc: t('step2Desc'),
        },
        {
            icon: <Download className="h-8 w-8 text-accent" />,
            title: t('step3Title'),
            desc: t('step3Desc'),
        }
    ]

    return (
        <div className="min-h-screen flex flex-col items-center justify-center py-20 px-4">
            {/* Background Effects */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 h-96 w-96 bg-primary/20 rounded-full blur-[128px]" />
                <div className="absolute bottom-1/4 right-1/4 h-96 w-96 bg-accent/20 rounded-full blur-[128px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16 space-y-4"
            >
                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/50">
                    {t('title')}
                </h1>
                <div className="h-1 w-24 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
                {steps.map((step, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                        className="relative group"
                    >
                        <div className="absolute -inset-0.5 bg-gradient-to-b from-white/10 to-transparent rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
                        <div className="relative h-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center space-y-6 hover:border-white/20 transition-colors">
                            <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-[0_0_15px_-5px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform duration-300">
                                {step.icon}
                            </div>
                            <h3 className="text-2xl font-bold">{step.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {step.desc}
                            </p>
                            <div className="absolute -top-4 -right-4 h-8 w-8 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-sm font-bold text-muted-foreground">
                                {index + 1}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
