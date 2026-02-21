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
        <div className="min-h-[80vh] flex flex-col items-center justify-center py-20 px-4 relative">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
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
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -10 }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                        className="relative group h-full"
                    >
                        <div className="absolute -inset-1 bg-gradient-to-b from-primary/20 to-accent/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-50 transition duration-500" />
                        <div className="relative h-full glass-panel glow-border rounded-[2rem] p-10 flex flex-col items-center text-center space-y-8">
                            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/20 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.05)] group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                                {step.icon}
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-2xl font-bold tracking-tight">{step.title}</h3>
                                <p className="text-muted-foreground leading-relaxed font-medium">
                                    {step.desc}
                                </p>
                            </div>
                            <div className="absolute -top-4 -right-4 h-10 w-10 bg-gradient-to-br from-primary to-accent border border-white/20 rounded-full flex items-center justify-center text-md font-black text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                                {index + 1}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
