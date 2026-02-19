"use client";

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const ParticleWave = () => {
    const ref = useRef<THREE.Points>(null);

    const count = 2000;
    const positions = useMemo(() => {
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            // Grid layout
            const x = (Math.random() - 0.5) * 20;
            const z = (Math.random() - 0.5) * 20;
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

        for (let i = 0; i < count; i++) {
            const x = positions[i * 3];
            const z = positions[i * 3 + 2];

            // Wave equation
            // y = A * sin(B * x + C * t) + D * cos(E * z + F * t)
            positions[i * 3 + 1] = Math.sin(x * 0.5 + t) * 1 + Math.cos(z * 0.3 + t * 0.5) * 0.5;
        }

        ref.current.geometry.attributes.position.needsUpdate = true;

        // Subtle rotation
        ref.current.rotation.y = t * 0.05;
    });

    return (
        <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#8B5CF6" // Violet/Purple to match TapDown brand if applicable, or generic styling
                size={0.1}
                sizeAttenuation={true}
                depthWrite={false}
            />
        </Points>
    );
};

const Waves = () => {
    return (
        <div className="absolute inset-0 -z-10 w-full h-full bg-black">
            <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
                <ParticleWave />
            </Canvas>
        </div>
    );
};

export default Waves;
