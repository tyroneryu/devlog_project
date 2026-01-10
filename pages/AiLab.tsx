import React from 'react';
import LogoGeneratorSection from '../components/LogoGeneratorSection';
import SynergyEngine from '../components/SynergyEngine';
import GroundingHub from '../components/GroundingHub';
import RetroTerminal from '../components/RetroTerminal';
import { FlaskConical } from 'lucide-react';
import { motion } from 'framer-motion';

const AiLab: React.FC = () => {
    return (
        <div className="min-h-screen bg-black pt-32 pb-24">
            {/* Page Header */}
            <div className="max-w-7xl mx-auto px-6 mb-24 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6"
                >
                    <FlaskConical size={14} className="text-purple-400" />
                    <span className="text-xs font-mono uppercase tracking-widest text-purple-300">Experimental Zone</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl md:text-7xl font-bold text-white mb-6"
                >
                    Neural <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Playground</span>.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed"
                >
                    A comprehensive suite of experimental interfaces powered by <strong>Gemini 2.5 & 3.0</strong>.
                    From generative branding to real-time vision analysis.
                </motion.p>
            </div>

            {/* All 4 Components Stacked */}
            <div className="space-y-0">
                {/* 1. Synergy Engine */}
                <SynergyEngine />

                {/* 2. Logo Generator */}
                <LogoGeneratorSection />

                {/* 3. Grounding Hub (Realtime Maps/Search) */}
                <GroundingHub />

                {/* 4. Retro Terminal (ASCII & Vision) */}
                <RetroTerminal />
            </div>
        </div>
    );
};

export default AiLab;