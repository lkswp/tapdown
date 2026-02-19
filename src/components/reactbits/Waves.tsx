"use client";

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const ParticleWave = () => {
    const ref = useRef<THREE.Points>(null);

    // Mouse interaction state
    const mouse = useRef({ x: 0, y: 0 });

    const handleMouseMove = (event: MouseEvent) => {
        mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    useMemo(() => {
        if (typeof window !== 'undefined') {
            window.addEventListener('mousemove', handleMouseMove);
        }
        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('mousemove', handleMouseMove);
            }
        };
    }, []);

    const count = 3000; // Increased count for density
    const positions = useMemo(() => {
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 25;
            const z = (Math.random() - 0.5) * 25;
            const y = 0;
            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
        }
        return positions;
    }, [count]);

    useFrame((state) => {
        if (!ref.current) return;
        const { clock } = state;
        const t = clock.getElapsedTime();

        // Access the position attribute
        const positions = ref.current.geometry.attributes.position.array as Float32Array;

        const mouseX = mouse.current.x * 0.5; // Reduced mouse influence
        const mouseY = mouse.current.y * 0.5;

        for (let i = 0; i < count; i++) {
            const x = positions[i * 3];
            const z = positions[i * 3 + 2];

            // Dynamic wave equation influenced by mouse
            const dist = Math.sqrt((x - mouseX) ** 2 + (z - mouseY) ** 2);
            const mouseInfluence = Math.max(0, 2 - dist) * 0.1; // Reduced ripple effect

            // y = A * sin(B * x + C * t) + ... mouse ripple
            positions[i * 3 + 1] =
                Math.sin(x * 0.5 + t + mouseX) * 1 +
                Math.cos(z * 0.3 + t * 0.5 + mouseY) * 0.5 +
                Math.sin(dist - t * 2) * mouseInfluence; // Ripple from cursor
        }

        ref.current.geometry.attributes.position.needsUpdate = true;

        // Rotation follows mouse slightly
        ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, t * 0.05 + mouseX * 0.05, 0.05);
        ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, mouseY * 0.05, 0.05);
    });

    return (
        <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#8B5CF6"
                size={0.12} // Slightly larger particles
                sizeAttenuation={true}
                depthWrite={false}
                opacity={0.8}
            />
        </Points>
    );
};

const Waves = () => {
    return (
        <div className="fixed inset-0 -z-50 w-full h-full bg-black pointer-events-none">
            <Canvas camera={{ position: [0, 5, 10], fov: 60 }} style={{ pointerEvents: 'auto' }}>
                <ParticleWave />
            </Canvas>
        </div>
    );
};

export default Waves;
