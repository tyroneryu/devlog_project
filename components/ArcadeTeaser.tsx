import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Bug, ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const ArcadeTeaser: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [score, setScore] = useState(0);
    const [glitchIndex, setGlitchIndex] = useState<number | null>(null);
    const [timeLeft, setTimeLeft] = useState(0);

    // Timer Logic
    useEffect(() => {
        let timer: any;
        if (isPlaying && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isPlaying) {
            setIsPlaying(false);
            setGlitchIndex(null);
        }
        return () => clearInterval(timer);
    }, [isPlaying, timeLeft]);

    // Glitch Movement Logic
    useEffect(() => {
        let moveTimer: any;
        if (isPlaying && timeLeft > 0) {
            moveTimer = setInterval(() => {
                // Move glitch to a new random spot
                setGlitchIndex(prev => {
                    let newIndex;
                    do {
                        newIndex = Math.floor(Math.random() * 9);
                    } while (newIndex === prev);
                    return newIndex;
                });
            }, 700); // Speed of glitch movement
        }
        return () => clearInterval(moveTimer);
    }, [isPlaying, timeLeft]);

    const startGame = () => {
        setScore(0);
        setTimeLeft(10);
        setIsPlaying(true);
        setGlitchIndex(Math.floor(Math.random() * 9));
    };

    const handleClick = (index: number) => {
        if (!isPlaying) return;
        if (index === glitchIndex) {
            setScore((prev) => prev + 100);
            // Move immediately on hit for responsiveness
            setGlitchIndex(Math.floor(Math.random() * 9));
        } else {
            setScore((prev) => Math.max(0, prev - 50));
        }
    };

    return (
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-b border-neutral-900 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="flex flex-col md:flex-row gap-16 items-center relative z-10">
                {/* Text Content */}
                <div className="w-full md:w-1/2">
                    <div className="flex items-center gap-2 mb-4">
                        <Gamepad2 size={20} className="text-red-500" />
                        <span className="text-xs font-bold text-red-500 uppercase tracking-widest font-mono">System Arcade</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                        Reflex <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Test</span>.
                    </h2>
                    <p className="text-xl text-neutral-400 leading-relaxed mb-8">
                        Need a break from the code? Engage in neural training exercises directly from the terminal.
                        The full Arcade features global leaderboards, typing defense, and PvP protocols.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            to="/arcade"
                            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-neutral-200 transition-all hover:scale-105 group"
                        >
                            Enter Full Arcade <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* Mini Game Board */}
                <div className="w-full md:w-1/2">
                    <div className="bg-[#111] border border-white/10 rounded-3xl p-6 relative shadow-2xl group">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

                        {/* Header / HUD */}
                        <div className="flex justify-between items-center mb-6 font-mono text-sm relative z-10">
                            <div className="text-neutral-500 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                MINI-GLITCH HUNTER
                            </div>
                            <div className="flex gap-4">
                            <span className={`${timeLeft <= 3 && timeLeft > 0 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                                TIME: {timeLeft.toString().padStart(2, '0')}s
                            </span>
                                <span className="text-red-400">SCORE: {score}</span>
                            </div>
                        </div>

                        {/* Game Grid */}
                        <div className="grid grid-cols-3 gap-3 aspect-square max-w-[320px] mx-auto relative z-10">
                            {(!isPlaying) && (
                                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-2xl border border-white/5">
                                    {score > 0 ? (
                                        <div className="text-center mb-6">
                                            <p className="text-neutral-400 text-xs font-mono uppercase mb-1">Session Complete</p>
                                            <p className="text-4xl font-bold text-white">{score}</p>
                                        </div>
                                    ) : (
                                        <div className="text-center mb-6">
                                            <Bug size={48} className="text-red-500 mx-auto mb-2 opacity-50" />
                                            <p className="text-neutral-400 font-mono text-sm">Purge the bugs.</p>
                                        </div>
                                    )}

                                    <button
                                        onClick={startGame}
                                        className="flex items-center gap-2 px-8 py-3 bg-red-600 text-white rounded-full font-bold hover:bg-red-500 transition-all hover:scale-105 shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                                    >
                                        <Play size={16} fill="currentColor" /> {score > 0 ? 'RETRY' : 'START DEMO'}
                                    </button>
                                </div>
                            )}

                            {Array.from({ length: 9 }).map((_, i) => (
                                <button
                                    key={i}
                                    onMouseDown={() => handleClick(i)}
                                    disabled={!isPlaying}
                                    className={`rounded-xl border transition-all duration-200 relative flex items-center justify-center
                                    ${i === glitchIndex && isPlaying
                                        ? 'bg-red-500/20 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.4)] scale-95'
                                        : 'bg-white/5 border-white/5 hover:bg-white/10'}
                                `}
                                >
                                    {i === glitchIndex && isPlaying && (
                                        <motion.div
                                            initial={{ scale: 0, rotate: -45 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                            className="text-red-500"
                                        >
                                            <Bug size={32} />
                                        </motion.div>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="text-center mt-6 relative z-10">
                            <p className="text-[10px] text-neutral-600 font-mono uppercase tracking-widest">
                                * Initializing Lite Version v0.9
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ArcadeTeaser;