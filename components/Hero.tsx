import React from 'react';
import { motion } from 'framer-motion';

const m = motion as any;

const Hero: React.FC = () => {
    return (
        <div className="relative w-full h-screen min-h-[100dvh] overflow-hidden bg-black flex items-center justify-center">
            {/* 3D Background - The Spline Robot */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <iframe
                    src="https://my.spline.design/nexbotrobotcharacterconcept-KPP5QTN9TJH1QRnjQZixC1Z2/"
                    frameBorder="0"
                    width="100%"
                    height="100%"
                    className="w-full h-full scale-105 pointer-events-auto"
                    title="Spline 3D Robot"
                ></iframe>
            </div>

            {/* Subtle Dark Overlays for Readability - MUST BE pointer-events-none */}
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-transparent to-black pointer-events-none" />
            <div className="absolute inset-0 z-10 bg-black/20 pointer-events-none" />

            {/* Content - Entire container is pointer-events-none so mouse passes to robot */}
            <div className="relative z-20 text-center px-4 max-w-5xl mx-auto mt-20 md:mt-0 pointer-events-none">
                <m.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-lg md:text-xl font-medium text-neutral-300 mb-2 tracking-wide"
                >
                    Hello, I'm Taeyun Ryu.
                </m.p>

                <m.h1
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="text-5xl md:text-8xl font-bold tracking-tighter text-white drop-shadow-2xl leading-[1.1]"
                >
                    Event - Driven <br />
                    <span className="text-white/50 backdrop-blur-sm">Engineering.</span>
                </m.h1>

                <m.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="mt-6 text-sm md:text-base text-neutral-400 max-w-lg mx-auto leading-relaxed"
                >
                    Crafting high-fidelity digital experiences that blend aesthetic precision with technical excellence.
                </m.p>
            </div>

            {/* Scroll Indicator */}
            <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-10 z-20 pointer-events-none"
            >
                <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-white to-transparent opacity-50"></div>
            </m.div>
        </div>
    );
};

export default Hero;