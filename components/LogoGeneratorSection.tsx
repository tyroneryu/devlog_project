import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Loader2, Sparkles, Download, Image as ImageIcon, Wand2, Type, Hexagon, Key, AlertCircle, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LogoGeneratorSection: React.FC = () => {
    const [inputText, setInputText] = useState('');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [hasKey, setHasKey] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        checkApiKey();
    }, []);

    const checkApiKey = async () => {
        if (window.aistudio) {
            const selected = await window.aistudio.hasSelectedApiKey();
            setHasKey(selected);
        }
    };

    const handleSelectKey = async () => {
        if (window.aistudio) {
            await window.aistudio.openSelectKey();
            setHasKey(true);
            setError(null);
        }
    };

    const generateLogo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        if (!hasKey) {
            setError("Please connect your API key to use the image generator.");
            return;
        }

        setIsGenerating(true);
        setGeneratedImage(null);
        setError(null);

        try {
            // Create fresh instance right before call
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Design a high-end, futuristic logo for the text "${inputText}". 
      Style: Luxurious Cyberpunk & Minimalist Tech. 
      Colors: Deep black background, glowing Neon Blue and Electric Purple. 
      Format: Clean vector-style mark, centered.`;

            const response = await ai.models.generateContent({
                // Switched to 2.5 Flash Image for better free-tier availability
                model: 'gemini-2.5-flash-image',
                contents: {
                    parts: [{ text: prompt }],
                },
                config: {
                    imageConfig: {
                        aspectRatio: "1:1"
                        // imageSize is only for Pro models
                    }
                }
            });

            const parts = response.candidates?.[0]?.content?.parts || [];
            let foundImage = false;
            for (const part of parts) {
                if (part.inlineData) {
                    setGeneratedImage(`data:image/png;base64,${part.inlineData.data}`);
                    foundImage = true;
                    break;
                }
            }

            if (!foundImage) {
                throw new Error("The model didn't return an image. It might be a temporary safety filter or quota issue.");
            }

        } catch (err: any) {
            console.error("Image Gen Error:", err);
            const msg = err.message || "";

            if (msg.includes("Requested entity was not found")) {
                setHasKey(false); // Reset key state to trigger re-selection
                setError("Your API key doesn't have access to this preview model. Please click 'Connect API Key' and select a key from a paid project.");
            } else if (msg.includes("429") || msg.includes("limit reached")) {
                setError("You've hit the Gemini Image API limit. Please wait a minute or use a paid API key.");
            } else {
                setError("The neural link was interrupted. Check your console for details.");
            }
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <section id="logo-lab" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-b border-neutral-900 relative overflow-hidden">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10">
                <div className="flex flex-col md:flex-row gap-12 items-center">

                    <div className="w-full md:w-1/2 space-y-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Wand2 size={20} className="text-cyan-400" />
                                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest font-mono">Generative Asset</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                Instant <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Identity</span>.
                            </h2>
                            <p className="text-neutral-400 text-lg leading-relaxed">
                                Enter your initials, and Gemini's vision engine will render a high-fidelity vector-style logo.
                            </p>
                        </div>

                        <div className="bg-[#111] border border-white/10 p-6 rounded-3xl relative group">
                            <form onSubmit={generateLogo} className="space-y-4">
                                {!hasKey ? (
                                    <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-center space-y-4">
                                        <div className="inline-block p-3 rounded-full bg-blue-500/20 text-blue-400">
                                            <Key size={24} />
                                        </div>
                                        <h3 className="text-white font-bold">API Key Required</h3>
                                        <p className="text-sm text-neutral-400">
                                            Image generation requires a personal API key. For high usage, please use a key from a project with billing enabled.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={handleSelectKey}
                                            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all"
                                        >
                                            Connect API Key
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div>
                                            <label className="block text-xs font-mono text-neutral-500 uppercase mb-2">
                                                Initials / Brand Name
                                            </label>
                                            <div className="relative">
                                                <Type className="absolute left-4 top-3.5 text-neutral-600" size={18} />
                                                <input
                                                    type="text"
                                                    value={inputText}
                                                    onChange={(e) => setInputText(e.target.value)}
                                                    placeholder="e.g. TR"
                                                    maxLength={10}
                                                    className="w-full bg-black border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white text-lg placeholder-neutral-700 focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isGenerating || !inputText}
                                            className="w-full py-4 bg-white text-black rounded-xl font-bold hover:bg-cyan-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                                            {isGenerating ? 'Designing...' : 'Generate Logo'}
                                        </button>
                                    </>
                                )}

                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs"
                                        >
                                            <AlertCircle size={14} className="shrink-0 mt-0.5" />
                                            <div className="flex-1">
                                                <p className="font-bold mb-1">Quota/Auth Alert</p>
                                                <p className="opacity-80">{error}</p>
                                                <a href="https://aistudio.google.com/app/usage" target="_blank" rel="noopener noreferrer" className="inline-block mt-2 underline opacity-60 hover:opacity-100">Check usage dashboard</a>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </form>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2">
                        <div className="bg-[#050505] border border-neutral-800 rounded-3xl p-8 aspect-square flex items-center justify-center relative overflow-hidden shadow-2xl">
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:30px_30px] pointer-events-none" />

                            {generatedImage ? (
                                <div className="relative group w-full h-full flex items-center justify-center">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 bg-cyan-500/10 blur-[60px] rounded-full pointer-events-none" />
                                    <img
                                        src={generatedImage}
                                        alt="Generated Logo"
                                        className="relative z-10 w-4/5 h-4/5 object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <a
                                        href={generatedImage}
                                        download={`logo-${inputText}.png`}
                                        className="absolute bottom-0 right-0 p-3 bg-white text-black rounded-full shadow-lg hover:scale-110 transition-transform opacity-0 group-hover:opacity-100 z-20"
                                    >
                                        <Download size={20} />
                                    </a>
                                </div>
                            ) : (
                                <div className="text-center text-neutral-700 z-10">
                                    <div className="w-20 h-20 border-2 border-neutral-800 border-dashed rounded-2xl mx-auto mb-4 flex items-center justify-center">
                                        {isGenerating ? <Loader2 size={32} className="animate-spin text-cyan-500" /> : <Hexagon size={32} />}
                                    </div>
                                    <p className="font-mono text-xs uppercase tracking-widest text-center">
                                        {isGenerating ? 'Rendering...' : 'Preview Output'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LogoGeneratorSection;