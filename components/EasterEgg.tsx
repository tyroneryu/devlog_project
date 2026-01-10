import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Terminal, Zap, AlertTriangle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// Konami Code Sequence
const KONAMI_CODE = [
    'ArrowUp', 'ArrowUp',
    'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight',
    'ArrowLeft', 'ArrowRight',
    'b', 'a'
];

// Audio Helper (Same as used in BlogPost)
function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) {
        channelData[i] = dataInt16[i] / 32768.0;
    }
    return buffer;
}

const EasterEgg: React.FC = () => {
    const [input, setInput] = useState<string[]>([]);
    const [isActive, setIsActive] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const audioContextRef = useRef<AudioContext | null>(null);
    const nextStartTimeRef = useRef<number>(0);
    const isCancelledRef = useRef<boolean>(false);

    // Keyboard Listener
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Add new key to history, keep only last N keys
            const newHistory = [...input, e.key].slice(-KONAMI_CODE.length);
            setInput(newHistory);

            // Check match
            if (JSON.stringify(newHistory) === JSON.stringify(KONAMI_CODE)) {
                activatePartyMode();
                setInput([]); // Reset
            }

            // Exit on Escape
            if (e.key === 'Escape' && isActive) {
                deactivatePartyMode();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [input, isActive]);

    const activatePartyMode = async () => {
        setIsActive(true);
        setErrorMsg(null);
        document.documentElement.classList.add('party-mode');
        isCancelledRef.current = false;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

            // Initialize Audio Context
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
            const ctx = audioContextRef.current;
            if(ctx.state === 'suspended') await ctx.resume();

            nextStartTimeRef.current = ctx.currentTime + 0.1;

            // Use Stream for faster response
            const stream = await ai.models.generateContentStream({
                model: "gemini-2.5-flash-preview-tts",
                contents: [{ parts: [{ text: "System Override Detected. Party Protocol Initiated. Welcome to the event." }] }],
                config: {
                    responseModalities: ['AUDIO'] as any, // Fixed: use string literal to avoid import crash
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Fenrir' } } },
                },
            });

            for await (const chunk of stream) {
                if (isCancelledRef.current) break;

                const base64Audio = chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
                if (base64Audio) {
                    const audioBytes = decode(base64Audio);
                    const audioBuffer = await decodeAudioData(audioBytes, ctx);

                    const source = ctx.createBufferSource();
                    source.buffer = audioBuffer;
                    source.connect(ctx.destination);

                    const startTime = Math.max(ctx.currentTime, nextStartTimeRef.current);
                    source.start(startTime);
                    nextStartTimeRef.current = startTime + audioBuffer.duration;
                }
            }

        } catch (e: any) {
            console.error("TTS Failed", e);
            // Show error to user if it's likely a quota limit or API issue
            if (e.message?.includes('429')) {
                setErrorMsg("System Overload (API Limit Reached). Try again in a minute.");
            } else {
                setErrorMsg("Audio System Failure. Check console.");
            }

            // Auto-hide error after 5s
            setTimeout(() => setErrorMsg(null), 5000);
        }
    };

    const deactivatePartyMode = () => {
        setIsActive(false);
        isCancelledRef.current = true;
        document.documentElement.classList.remove('party-mode');
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
    };

    // Particles generator
    const particles = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2,
        emoji: ['🎉', '⚡️', '💾', '🚀', '💎'][Math.floor(Math.random() * 5)]
    }));

    return (
        <>
            {/* Global Style Injection for Hue Rotate */}
            <style>{`
        .party-mode {
          animation: rainbow 2s linear infinite;
        }
        .party-mode img {
          filter: invert(1) !important;
        }
        @keyframes rainbow {
          100% { filter: hue-rotate(360deg); }
        }
      `}</style>

            <AnimatePresence>
                {isActive && (
                    <div className="fixed inset-0 z-[999] pointer-events-none overflow-hidden">
                        {/* Top Bar Overlay (Pointer events allowed here) */}
                        <motion.div
                            initial={{ y: -100 }}
                            animate={{ y: 0 }}
                            exit={{ y: -100 }}
                            className="absolute top-0 left-0 right-0 bg-red-600 text-white p-4 flex justify-between items-center pointer-events-auto shadow-[0_0_50px_rgba(255,0,0,0.5)]"
                        >
                            <div className="flex items-center gap-4 font-mono font-bold animate-pulse">
                                {errorMsg ? <AlertTriangle size={24} className="text-yellow-300" /> : <Terminal size={24} />}
                                <span>{errorMsg || "SYSTEM OVERRIDE: DEVELOPER PARTY MODE"}</span>
                            </div>
                            <button
                                onClick={deactivatePartyMode}
                                className="bg-black/50 hover:bg-black/80 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors border border-white/20"
                            >
                                <X size={18} /> TERMINATE
                            </button>
                        </motion.div>

                        {/* Floating Particles */}
                        {!errorMsg && particles.map((p) => (
                            <motion.div
                                key={p.id}
                                initial={{ y: '110vh', x: `${p.x}vw`, opacity: 0, scale: 0.5 }}
                                animate={{ y: '-10vh', opacity: [0, 1, 1, 0], scale: 1.5, rotate: 360 }}
                                transition={{ duration: 4, repeat: Infinity, delay: p.delay, ease: "linear" }}
                                className="absolute text-4xl"
                            >
                                {p.emoji}
                            </motion.div>
                        ))}

                        {/* Flash Effect on Entry */}
                        <motion.div
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 bg-white pointer-events-none"
                        />
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default EasterEgg;