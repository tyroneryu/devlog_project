import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Loader2, Sparkles, Download, Image as ImageIcon, Wand2, Type, Hexagon } from 'lucide-react';
import { motion } from 'framer-motion';

const LogoGeneratorSection: React.FC = () => {
    const [inputText, setInputText] = useState('');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const generateLogo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        setIsGenerating(true);
        setGeneratedImage(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Design a high-end, futuristic logo for the text "${inputText}". 
      Style requirements:
      - Aesthetic: Luxurious Cyberpunk & Minimalist Tech.
      - Colors: Deep void black background with glowing Neon Blue (Cyan) and Electric Purple accents.
      - Texture: Sleek metallic or glass-like finish.
      - Composition: Strong geometric lines, vector art style, centered, symmetrical if possible.
      - Usage: Suitable for a tech startup icon or high-fidelity portfolio favicon.`;

            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-image-preview',
                contents: {
                    parts: [{ text: prompt }],
                },
                config: {
                    imageConfig: {
                        aspectRatio: "1:1",
                        imageSize: "1K"
                    }
                }
            });

            const parts = response.candidates?.[0]?.content?.parts || [];
            for (const part of parts) {
                if (part.inlineData) {
                    setGeneratedImage(`data:image/png;base64,${part.inlineData.data}`);
                    break;
                }
            }
        } catch (error) {
            console.error("Image Gen Error:", error);
            alert("Generation limit reached or API signal lost. Please try again later.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <section id="logo-lab" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-b border-neutral-900 relative overflow-hidden">
            {/* Background Glows (Absolute to section) */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10">
                <div className="flex flex-col md:flex-row gap-12 items-center">

                    {/* Left: Content & Controls */}
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
                                Need a futuristic brand mark? Enter your initials, and Gemini 3.0 Vision will render a high-fidelity vector-style logo in real-time.
                            </p>
                        </div>

                        <div className="bg-[#111] border border-white/10 p-6 rounded-3xl relative group">
                            <form onSubmit={generateLogo} className="space-y-4">
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
                                            maxLength={6}
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
                            </form>
                        </div>
                    </div>

                    {/* Right: Preview */}
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
                                        title="Download Asset"
                                    >
                                        <Download size={20} />
                                    </a>
                                </div>
                            ) : (
                                <div className="text-center text-neutral-700 z-10">
                                    <div className="w-20 h-20 border-2 border-neutral-800 border-dashed rounded-2xl mx-auto mb-4 flex items-center justify-center">
                                        <Hexagon size={32} />
                                    </div>
                                    <p className="font-mono text-xs uppercase tracking-widest">Preview Output</p>
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