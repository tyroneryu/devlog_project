import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Loader2, Sparkles, Download, Image as ImageIcon, Wand2, Type, Hexagon, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LogoGeneratorSection: React.FC = () => {
    const [inputText, setInputText] = useState('');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateLogo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        setIsGenerating(true);
        setGeneratedImage(null);
        setError(null);

        try {
            // Use process.env.API_KEY directly as per guidelines for non-Pro models
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

            const prompt = `Design a high-end, futuristic minimal logo for the text "${inputText}". 
      Style: Cyber-Industrial, Clean Vector Art, Geometric. 
      Colors: Deep black background with glowing Neon Cyan and Electric Violet accents. 
      Composition: Perfectly centered, symmetrical monogram. 
      High contrast, suitable for a tech executive's brand identity.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: {
                    parts: [{ text: prompt }],
                },
                config: {
                    imageConfig: {
                        aspectRatio: "1:1"
                    }
                }
            });

            const parts = response.candidates?.[0]?.content?.parts || [];
            let found = false;
            for (const part of parts) {
                if (part.inlineData) {
                    setGeneratedImage(`data:image/png;base64,${part.inlineData.data}`);
                    found = true;
                    break;
                }
            }

            if (!found) throw new Error("NODE_SIGNAL_LOST: Image data could not be parsed.");

        } catch (err: any) {
            console.error("Image Gen Error:", err);
            setError(err.message?.includes('429')
                ? "SYSTEM_OVERLOAD: Global quota reached. Please retry in 60s."
                : "CORE_FAILURE: Neural link interrupted.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <section id="logo-lab" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-b border-neutral-900 relative overflow-hidden">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10">
                <div className="flex flex-col md:flex-row gap-16 items-center">

                    <div className="w-full md:w-1/2 space-y-10">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-cyan-500/10 rounded-lg">
                                    <Wand2 size={20} className="text-cyan-400" />
                                </div>
                                <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em] font-mono">Generative Asset v2.1</span>
                            </div>
                            <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter leading-[0.9]">
                                Instant <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Identity.</span>
                            </h2>
                            <p className="text-neutral-500 text-lg leading-relaxed font-light">
                                Leveraging latent space diffusion to render unique brand assets from symbolic input.
                            </p>
                        </div>

                        <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[32px] relative group">
                            <form onSubmit={generateLogo} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-mono text-neutral-600 uppercase tracking-widest mb-4 ml-1">
                                        Designation / Initials
                                    </label>
                                    <div className="relative">
                                        <Type className="absolute left-5 top-4.5 text-neutral-700" size={18} />
                                        <input
                                            type="text"
                                            value={inputText}
                                            onChange={(e) => setInputText(e.target.value)}
                                            placeholder="e.g. TR"
                                            maxLength={10}
                                            className="w-full bg-black border border-white/10 rounded-2xl pl-14 pr-4 py-4 text-white text-lg font-bold tracking-widest placeholder-neutral-800 focus:outline-none focus:border-cyan-500/50 transition-all uppercase"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isGenerating || !inputText}
                                    className="w-full py-5 bg-white text-black rounded-2xl font-black text-lg hover:bg-cyan-50 transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-98 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
                                >
                                    {isGenerating ? <Loader2 className="animate-spin" size={24} /> : <Sparkles size={24} />}
                                    {isGenerating ? 'PROCESSING...' : 'INITIALIZE DESIGN'}
                                </button>

                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="flex items-center gap-2 p-3 bg-red-500/5 border border-red-500/20 rounded-xl text-red-400 text-[10px] font-mono"
                                        >
                                            <AlertCircle size={12} />
                                            <span>[ERR]: {error}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </form>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2">
                        <div className="bg-[#050505] border border-white/5 rounded-[40px] aspect-square flex items-center justify-center relative overflow-hidden shadow-2xl group">
                            {/* Visual Grid Decor */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:40px_40px] pointer-events-none" />

                            {generatedImage ? (
                                <div className="relative w-full h-full flex items-center justify-center p-12">
                                    <div className="absolute inset-0 bg-cyan-500/5 blur-[100px] pointer-events-none" />
                                    <img
                                        src={generatedImage}
                                        alt="Generated Asset"
                                        className="relative z-10 w-full h-full object-contain drop-shadow-[0_0_50px_rgba(34,211,238,0.2)] transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <a
                                        href={generatedImage}
                                        download={`logo-${inputText}.png`}
                                        className="absolute bottom-8 right-8 p-4 bg-white text-black rounded-full shadow-2xl hover:scale-110 transition-all opacity-0 group-hover:opacity-100 z-20"
                                    >
                                        <Download size={20} />
                                    </a>
                                </div>
                            ) : (
                                <div className="text-center space-y-6 z-10">
                                    <div className="w-24 h-24 border border-neutral-900 rounded-[32px] mx-auto flex items-center justify-center relative">
                                        {isGenerating ? (
                                            <div className="absolute inset-0 border border-cyan-500/50 rounded-[32px] animate-ping opacity-20" />
                                        ) : (
                                            <Hexagon size={40} className="text-neutral-800" />
                                        )}
                                        <Loader2 size={32} className={`text-cyan-500 animate-spin transition-opacity duration-300 ${isGenerating ? 'opacity-100' : 'opacity-0'}`} />
                                    </div>
                                    <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-neutral-800">
                                        {isGenerating ? 'Synthesizing...' : 'Awaiting Matrix'}
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