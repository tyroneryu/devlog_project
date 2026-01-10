import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Check, Wifi, Cpu, Shield } from 'lucide-react';

interface PreloaderProps {
    onComplete: () => void;
}

const bootSequence = [
    { text: "INITIALIZING KERNEL...", icon: <Cpu size={14} /> },
    { text: "CHECKING MEMORY INTEGRITY...", icon: <Terminal size={14} /> },
    { text: "ESTABLISHING SECURE LINK...", icon: <Shield size={14} /> },
    { text: "LOADING NEURAL ENGINE (GEMINI 3.0)...", icon: <Wifi size={14} /> },
    { text: "RENDERING 3D ASSETS...", icon: <Terminal size={14} /> },
    { text: "SYSTEM READY.", icon: <Check size={14} className="text-green-500" /> },
];

const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
    const [currentLine, setCurrentLine] = useState(0);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        // Process boot lines
        if (currentLine < bootSequence.length) {
            const timeout = setTimeout(() => {
                setCurrentLine(prev => prev + 1);
            }, Math.random() * 400 + 200); // Random delay between 200-600ms
            return () => clearTimeout(timeout);
        } else {
            // Finished
            const timeout = setTimeout(() => {
                setIsExiting(true);
                setTimeout(onComplete, 800); // Wait for exit animation
            }, 800);
            return () => clearTimeout(timeout);
        }
    }, [currentLine, onComplete]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            animate={isExiting ? { y: '-100%', opacity: 0 } : { y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] bg-black flex items-center justify-center font-mono cursor-wait"
        >
            <div className="w-full max-w-md px-6">
                {/* Header */}
                <div className="flex justify-between items-center border-b border-white/20 pb-2 mb-4 text-xs text-neutral-500">
                    <span>TR-OS v2.0.24</span>
                    <span>BOOT SEQUENCE</span>
                </div>

                {/* Log Output */}
                <div className="space-y-2 mb-8 min-h-[200px]">
                    {bootSequence.slice(0, currentLine + 1).map((line, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`flex items-center gap-3 text-sm ${
                                idx === bootSequence.length - 1 ? 'text-green-400 font-bold' : 'text-neutral-400'
                            }`}
                        >
                            <span className="opacity-50">{line.icon}</span>
                            <span>{line.text}</span>
                        </motion.div>
                    ))}
                    {currentLine < bootSequence.length && (
                        <motion.div
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ repeat: Infinity, duration: 0.5 }}
                            className="w-2 h-4 bg-green-500 mt-2"
                        />
                    )}
                </div>

                {/* Progress Bar */}
                <div className="relative h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        className="absolute top-0 left-0 h-full bg-green-500"
                        initial={{ width: "0%" }}
                        animate={{ width: `${(currentLine / bootSequence.length) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
                <div className="flex justify-between mt-2 text-[10px] text-neutral-600 uppercase">
                    <span>Loading Modules</span>
                    <span>{Math.round((currentLine / bootSequence.length) * 100)}%</span>
                </div>
            </div>
        </motion.div>
    );
};

export default Preloader;