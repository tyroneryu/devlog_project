import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleGenAI } from "@google/genai";
import { ArrowLeft, Lock, Loader2, Sparkles, Download, Image as ImageIcon, Wand2 } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminAssets: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const generateLogo = async () => {
        setIsGenerating(true);
        setGeneratedImage(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = "Design a high-tech, futuristic favicon logo for a personal portfolio. The subject is the monogram 'TR' (Taeyun Ryu). Style: Cyberpunk, Neon Blue and Purple gradients on a deep black background. Minimalist, strong geometric lines, vector art style. High contrast, suitable for small icon usage.";

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

            // Extract image from response parts
            const parts = response.candidates?.[0]?.content?.parts || [];
            for (const part of parts) {
                if (part.inlineData) {
                    setGeneratedImage(`data:image/png;base64,${part.inlineData.data}`);
                    break;
                }
            }
        } catch (error) {
            console.error("Image Gen Error:", error);
            alert("Generation Protocol Failed. Check API Quota or Key.");
        } finally {
            setIsGenerating(false);
        }
    };

    // Access Denied Screen (Copied from AdminWrite for consistency)
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-white px-4 relative bg-black overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/20 rounded-full blur-[120px] pointer-events-none" />
                <div className="relative z-10 bg-[#111]/80 backdrop-blur-xl p-8 rounded-3xl border border-red-500/30 text-center max-w-md w-full shadow-2xl">
                    <div className="flex justify-center mb-6">
                        <div className="p-4 rounded-full bg-red-500/10 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                            <Lock size={48} className="text-red-500" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold mb-2 tracking-tight">Access Restricted</h1>
                    <button onClick={() => navigate('/admin')} className="mt-6 px-8 py-3 bg-white text-black rounded-xl font-bold hover:bg-neutral-200 transition-colors">Authenticate</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black pt-32 pb-24 px-6 md:px-12 relative z-40 overflow-hidden text-white">
            {/* Cinematic Background */}
            <div className="fixed top-0 left-0 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-5xl mx-auto relative z-10"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-16">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-600/10 border border-purple-500/20 rounded-xl backdrop-blur-md">
                            <Wand2 size={24} className="text-purple-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white tracking-tight">Neural Asset Factory</h1>
                            <p className="text-neutral-500 text-xs font-mono uppercase tracking-widest mt-1">Gemini 3.0 Pro Image Engine</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/admin/write')}
                        className="text-neutral-400 hover:text-white flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                    >
                        <ArrowLeft size={18} /> <span className="text-sm font-medium">Back to Console</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Controls */}
                    <div className="space-y-8">
                        <div className="bg-[#111] border border-white/10 p-8 rounded-3xl">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Sparkles size={18} className="text-yellow-400" /> Generation Protocol
                            </h2>
                            <p className="text-neutral-400 mb-8 leading-relaxed">
                                Initiate the creation of a unique brand identity asset.
                                The system will generate a "TR" monogram favicon using the current design language (Cyberpunk/Neon).
                            </p>

                            <div className="space-y-4">
                                <div className="p-4 bg-black rounded-xl border border-white/5">
                                    <span className="text-xs font-mono text-neutral-500 uppercase">Target Model</span>
                                    <div className="text-white font-mono mt-1">gemini-3-pro-image-preview</div>
                                </div>
                                <div className="p-4 bg-black rounded-xl border border-white/5">
                                    <span className="text-xs font-mono text-neutral-500 uppercase">Prompt Configuration</span>
                                    <div className="text-neutral-300 text-sm mt-1">"TR" Monogram, Cyberpunk, Neon Blue/Purple, Minimalist Vector</div>
                                </div>
                            </div>

                            <button
                                onClick={generateLogo}
                                disabled={isGenerating}
                                className="w-full mt-8 py-4 bg-white text-black rounded-xl font-bold text-lg hover:bg-neutral-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {isGenerating ? <Loader2 className="animate-spin" /> : <ImageIcon />}
                                {isGenerating ? 'Synthesizing...' : 'Generate Asset'}
                            </button>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="flex items-center justify-center bg-[#050505] border border-neutral-800 rounded-3xl p-8 min-h-[500px] relative overflow-hidden">
                        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-10" />

                        {generatedImage ? (
                            <div className="relative group">
                                <img src={generatedImage} alt="Generated Logo" className="w-64 h-64 md:w-80 md:h-80 object-contain rounded-2xl shadow-[0_0_50px_rgba(124,58,237,0.3)]" />
                                <a
                                    href={generatedImage}
                                    download="tr-logo.png"
                                    className="absolute bottom-4 right-4 p-3 bg-white text-black rounded-full shadow-lg hover:scale-110 transition-transform"
                                    title="Download Asset"
                                >
                                    <Download size={20} />
                                </a>
                            </div>
                        ) : (
                            <div className="text-center text-neutral-700">
                                <div className="w-20 h-20 border-2 border-neutral-800 border-dashed rounded-2xl mx-auto mb-4 flex items-center justify-center">
                                    <ImageIcon size={32} />
                                </div>
                                <p className="font-mono text-xs uppercase tracking-widest">Awaiting Visual Output</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminAssets;