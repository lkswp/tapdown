"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export function CustomCursor() {
    const [isVisible, setIsVisible] = useState(false)
    const cursorX = useMotionValue(-100)
    const cursorY = useMotionValue(-100)

    // Smooth spring animation for the trailer - tighter spring for less lag
    const springConfig = { damping: 20, stiffness: 300, mass: 0.5 }
    const cursorXSpring = useSpring(cursorX, springConfig)
    const cursorYSpring = useSpring(cursorY, springConfig)

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            // Update motion values directly without causing re-renders
            cursorX.set(e.clientX - 16)
            cursorY.set(e.clientY - 16)
            if (!isVisible) setIsVisible(true)
        }

        const handleMouseEnter = () => setIsVisible(true)
        const handleMouseLeave = () => setIsVisible(false)

        window.addEventListener("mousemove", moveCursor, { passive: true })
        window.addEventListener("mouseenter", handleMouseEnter)
        window.addEventListener("mouseleave", handleMouseLeave)

        return () => {
            window.removeEventListener("mousemove", moveCursor)
            window.removeEventListener("mouseenter", handleMouseEnter)
            window.removeEventListener("mouseleave", handleMouseLeave)
        }
    }, [cursorX, cursorY, isVisible])

    // Only show on desktop (coarse pointer check)
    if (typeof window !== 'undefined' && window.matchMedia("(pointer: coarse)").matches) {
        return null;
    }

    return (
        <>
            {/* Main Dot - No spring, instant follow */}
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
            {/* Trailer Ring - Spring physics */}
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
