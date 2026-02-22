"use client";

import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
    children?: ReactNode;
    showRadialGradient?: boolean;
}

export const AuroraBackground = ({
    className,
    children,
    showRadialGradient = true,
    ...props
}: AuroraBackgroundProps) => {
    return (
        <div
            className={cn(
                "relative flex flex-col items-center justify-center bg-background text-foreground transition-bg overflow-hidden",
                className
            )}
            {...props}
        >
            <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
                <div
                    className={cn(
                        `
                          [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]
                          [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)]
                          [--aurora:repeating-linear-gradient(100deg,oklch(0.65_0.25_10)_10%,oklch(0.6_0.25_20)_15%,oklch(0.7_0.2_350)_20%,oklch(0.65_0.25_10)_25%,oklch(0.55_0.25_350)_30%)]
                          [background-image:var(--dark-gradient),var(--aurora)]
                          [background-size:300%,_200%]
                          [background-position:50%_50%,50%_50%]
                          filter blur-[60px]
                          after:content-[""] after:absolute after:inset-0 after:[background-image:var(--dark-gradient),var(--aurora)]
                          after:[background-size:200%,_100%] 
                          after:animate-aurora after:[background-attachment:fixed] after:mix-blend-difference
                          absolute -inset-[10px] opacity-40 will-change-transform`,
                        showRadialGradient &&
                        `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`
                    )}
                ></div>
                <div
                    className={cn(
                        `
                          [--aurora-2:repeating-linear-gradient(-100deg,oklch(0.6_0.25_20)_10%,oklch(0.65_0.25_10)_15%,oklch(0.55_0.25_350)_20%,oklch(0.7_0.2_350)_25%,oklch(0.65_0.25_10)_30%)]
                          [background-image:var(--dark-gradient),var(--aurora-2)]
                          [background-size:300%,_200%]
                          [background-position:50%_50%,50%_50%]
                          filter blur-[60px]
                          after:content-[""] after:absolute after:inset-0 after:[background-image:var(--dark-gradient),var(--aurora-2)]
                          after:[background-size:200%,_100%] 
                          after:animate-aurora-2 after:[background-attachment:fixed] after:mix-blend-difference
                          absolute -inset-[10px] opacity-30 will-change-transform`,
                        showRadialGradient &&
                        `[mask-image:radial-gradient(ellipse_at_0%_100%,black_10%,var(--transparent)_70%)]`
                    )}
                ></div>
            </div>
            {children}
        </div>
    );
};
