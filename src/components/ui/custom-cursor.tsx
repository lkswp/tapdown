"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export function CustomCursor() {
    const [isVisible, setIsVisible] = useState(false)
    const cursorX = useMotionValue(-100)
    const cursorY = useMotionValue(-100)

    // Smooth spring animation for the trailer
    const springConfig = { damping: 25, stiffness: 700 }
    const cursorXSpring = useSpring(cursorX, springConfig)
    const cursorYSpring = useSpring(cursorY, springConfig)

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX - 16)
            cursorY.set(e.clientY - 16)
            setIsVisible(true)
        }

        const handleMouseEnter = () => setIsVisible(true)
        const handleMouseLeave = () => setIsVisible(false)

        window.addEventListener("mousemove", moveCursor)
        window.addEventListener("mouseenter", handleMouseEnter)
        window.addEventListener("mouseleave", handleMouseLeave)

        return () => {
            window.removeEventListener("mousemove", moveCursor)
            window.removeEventListener("mouseenter", handleMouseEnter)
            window.removeEventListener("mouseleave", handleMouseLeave)
        }
    }, [cursorX, cursorY])

    // Only show on desktop (coarse pointer check)
    if (typeof window !== 'undefined' && window.matchMedia("(pointer: coarse)").matches) {
        return null;
    }

    return (
        <>
            {/* Main Dot */}
            <motion.div
                className="fixed top-0 left-0 w-4 h-4 bg-primary rounded-full pointer-events-none z-[9999] mix-blend-difference"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: "8px",
                    translateY: "8px",
                    opacity: isVisible ? 1 : 0
                }}
            />
            {/* Trailer Ring */}
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 border border-primary/50 rounded-full pointer-events-none z-[9998]"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    opacity: isVisible ? 1 : 0
                }}
            />
        </>
    )
}
