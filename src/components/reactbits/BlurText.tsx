"use client";

import { useRef, useEffect, useState } from 'react';
import { useInView, motion, Variants } from 'framer-motion';

interface BlurTextProps {
    text: string;
    delay?: number;
    className?: string;
    animateBy?: 'words' | 'letters';
    direction?: 'top' | 'bottom';
    threshold?: number;
    rootMargin?: string;
}

const BlurText: React.FC<BlurTextProps> = ({
    text,
    delay = 200,
    className = '',
    animateBy = 'words',
    direction = 'top',
    threshold = 0.1,
    rootMargin = '-50px',
}) => {
    const elements = animateBy === 'words' ? text.split(' ') : text.split('');
    const [inView, setInView] = useState(false);
    const ref = useRef<HTMLParagraphElement>(null);
    const isInView = useInView(ref, { once: true, amount: threshold, margin: rootMargin as any });

    useEffect(() => {
        if (isInView) {
            setInView(true);
        }
    }, [isInView]);

    const defaultFrom =
        direction === 'top'
            ? { filter: 'blur(10px)', opacity: 0, transform: 'translate3d(0,-50px,0)' }
            : { filter: 'blur(10px)', opacity: 0, transform: 'translate3d(0,50px,0)' };

    const defaultTo = [
        {
            filter: 'blur(5px)',
            opacity: 0.5,
            transform: direction === 'top' ? 'translate3d(0,5px,0)' : 'translate3d(0,-5px,0)',
        },
        { filter: 'blur(0px)', opacity: 1, transform: 'translate3d(0,0,0)' },
    ];

    return (
        <p ref={ref} className={`flex flex-wrap ${className}`}>
            {elements.map((element, index) => (
                <motion.span
                    key={index}
                    initial={defaultFrom}
                    animate={inView ? {
                        filter: 'blur(0px)',
                        opacity: 1,
                        transform: 'translate3d(0,0,0)'
                    } : defaultFrom}
                    transition={{
                        duration: 1,
                        delay: (index * delay) / 1000,
                        ease: [0.25, 0.46, 0.45, 0.94], // easeOutQuad-ish
                    }}
                    className="inline-block mr-1" // Add margin for words
                    style={{ willChange: 'transform, filter, opacity' }} // Optimization
                >
                    {element === ' ' ? '\u00A0' : element}
                </motion.span>
            ))}
        </p>
    );
};

export default BlurText;
