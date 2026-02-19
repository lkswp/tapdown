"use client";

import { useRef, useState, MouseEvent } from "react";
import { motion } from "framer-motion";

interface MagnetProps {
    children: React.ReactNode;
    className?: string;
    padding?: number;
    disabled?: boolean;
    magnetStrength?: number;
    activeTransition?: string;
    inactiveTransition?: string;
}

const Magnet = ({
    children,
    className = "",
    padding = 100,
    disabled = false,
    magnetStrength = 2,
    activeTransition = "spring", // type of transition
    inactiveTransition = "spring",
}: MagnetProps) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const ref = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (disabled || !ref.current) return;

        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current.getBoundingClientRect();

        const centerX = left + width / 2;
        const centerY = top + height / 2;

        // Calculate distance from center
        const dist = Math.sqrt(Math.pow(clientX - centerX, 2) + Math.pow(clientY - centerY, 2));

        if (dist < (width / 2 + padding)) {
            const x = (clientX - centerX) / magnetStrength;
            const y = (clientY - centerY) / magnetStrength;
            setPosition({ x, y });
        } else {
            setPosition({ x: 0, y: 0 });
        }
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    const transition = {
        type: "spring",
        stiffness: 150,
        damping: 15,
        mass: 0.1
    }

    return (
        <motion.div
            ref={ref}
            className={className}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ x: position.x, y: position.y }}
            transition={transition as any}
        >
            {children}
        </motion.div>
    );
};

export default Magnet;
