import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Disc, X, Music, Minimize2, ExternalLink } from 'lucide-react';

const PLAYLIST_ID = "pl.u-6mo4aPvCBPNLEJJ"; // Default: Cyberpunk/Coding mix

const MusicWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-6 left-6 z-[90] flex flex-col items-start gap-4">

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: "bottom left" }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="origin-bottom-left"
                    >
                        <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] w-[320px] md:w-[380px]">

                            {/* Header */}
                            <div className="flex items-center justify-between p-3 bg-white/5 border-b border-white/5">
                                <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                    SYSTEM_AUDIO
                                </div>
                                <div className="flex items-center gap-2">
                                    <a
                                        href={`https://music.apple.com/kr/playlist/${PLAYLIST_ID}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1.5 hover:bg-white/10 rounded-md text-neutral-400 hover:text-white transition-colors"
                                        title="Open in Apple Music"
                                    >
                                        <ExternalLink size={14} />
                                    </a>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-1.5 hover:bg-white/10 rounded-md text-neutral-400 hover:text-white transition-colors"
                                    >
                                        <Minimize2 size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Apple Music Embed */}
                            <div className="relative h-[450px] bg-black">
                                {/* Loading Spinner underneath */}
                                <div className="absolute inset-0 flex items-center justify-center z-0">
                                    <div className="w-8 h-8 border-2 border-neutral-800 border-t-neutral-500 rounded-full animate-spin"></div>
                                </div>

                                <iframe
                                    allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
                                    frameBorder="0"
                                    height="450"
                                    style={{ width: '100%', maxWidth: '660px', overflow: 'hidden', background: 'transparent', position: 'relative', zIndex: 10 }}
                                    sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
                                    src={`https://embed.music.apple.com/kr/playlist/${PLAYLIST_ID}`}
                                    title="Apple Music Player"
                                ></iframe>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Trigger Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`group relative flex items-center justify-center w-14 h-14 rounded-full border transition-all duration-300 shadow-2xl overflow-hidden ${
                    isOpen
                        ? 'bg-white text-black border-white'
                        : 'bg-black/60 backdrop-blur-md text-white border-white/10 hover:border-red-500/50'
                }`}
            >
                {/* Spinning Gradient Border Effect when closed */}
                {!isOpen && (
                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-red-500/50 border-r-blue-500/50 animate-spin-slow opacity-0 group-hover:opacity-100 transition-opacity" />
                )}

                <div className="relative z-10">
                    {isOpen ? (
                        <X size={24} />
                    ) : (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        >
                            <Disc size={28} className="text-neutral-300 group-hover:text-white transition-colors" />
                        </motion.div>
                    )}
                </div>

                {/* Music Note Float Animation */}
                {!isOpen && (
                    <motion.div
                        className="absolute top-0 right-0 text-red-500 opacity-0 group-hover:opacity-100"
                        initial={{ y: 10, x: -10, opacity: 0 }}
                        animate={{ y: -10, x: 10, opacity: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                    >
                        <Music size={12} />
                    </motion.div>
                )}
            </motion.button>

        </div>
    );
};

export default MusicWidget;