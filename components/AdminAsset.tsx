
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleGenAI } from "@google/genai";
import { Lock, Loader2, Sparkles, Download, Image as ImageIcon, Wand2, Box, Layers, Cpu, Monitor, Layout, Send, Share2, Presentation, ShieldCheck, FileText, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminAssets: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [hasKey, setHasKey] = useState(false);
    const [customPrompt, setCustomPrompt] = useState('');

    useEffect(() => {
        const checkKey = async () => {
            if (window.aistudio) {
                const selected = await window.aistudio.hasSelectedApiKey();
                setHasKey(selected);
            }
        };
        checkKey();
    }, []);

    const handleSelectKey = async () => {
        if (window.aistudio) {
            await window.aistudio.openSelectKey();
            // Assume success due to potential race condition in hasSelectedApiKey
            setHasKey(true);
        }
    };

    const generateAsset = async (type: string) => {
        if (!hasKey) {
            handleSelectKey();
            return;
        }

        setIsGenerating(true);
        setGeneratedImage(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

            let prompt = "";
            let aspectRatio: "1:1" | "16:9" | "4:3" | "9:16" | "3:4" = "16:9";

            switch(type) {
                case 'GitKubeOps':
                    prompt = `Cinematic 3D isometric architectural visualization of a GitOps Kubernetes delivery pipeline. In the center, a glowing translucent blue 'Helm' ship wheel. Surrounding it are sleek, dark metallic cubic containers (pods) with glowing cyan outlines. Background: Deep matte void black. Lighting: Soft volumetric cyan glows. High resolution.`;
                    break;
                case 'SocialCover':
                    prompt = `A sleek, high-end OpenGraph social media cover for a tech blog post. Use minimalist 3D glass shapes, neon purple refraction, and a large empty area on the left for text overlay. 4K, ray-traced, futuristic industrial style. Deep black background.`;
                    break;
                case 'Background':
                    prompt = `Abstract cyber-industrial background pattern. Interlocking fiber optic lines, dark metallic surfaces, faint glowing data grid. Professional, minimal, sophisticated tech aesthetic. Blue and Slate palette.`;
                    break;
                case 'Custom':
                    prompt = customPrompt;
                    break;
                default:
                    prompt = `Futuristic tech logo monogram 'TR'. Neon cyan on black.`;
                    aspectRatio = "1:1";
            }

            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-image-preview',
                contents: { parts: [{ text: prompt }] },
                config: {
                    imageConfig: {
                        aspectRatio,
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
        } catch (error: any) {
            console.error("Image Gen Error:", error);
            if (error.message?.includes("Requested entity was not found")) {
                setHasKey(false);
                alert("API Key session expired. Please re-select your key.");
            } else {
                alert("Synthesis Interrupted: System integrity unstable.");
            }
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-black pt-32 pb-24 px-6 md:px-12 relative z-40 overflow-hidden text-white">
            <div className="fixed top-0 left-0 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto relative z-10"
            >
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8 border-b border-white/5 pb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-600/10 border border-purple-500/20 rounded-xl backdrop-blur-md">
                            <Wand2 size={24} className="text-purple-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white tracking-tight">Neural Asset Factory</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <p className="text-neutral-500 text-xs font-mono uppercase tracking-widest">Generative Visual Protocol</p>
                                <span className="w-1 h-1 rounded-full bg-purple-500 animate-pulse" />
                            </div>
                        </div>
                    </div>

                    {/* ADMIN NAVIGATION TABS (Visible only to admins) */}
                    {isAuthenticated && (
                        <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl">
                            <Link
                                to="/admin/write"
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${location.pathname === '/admin/write' ? 'bg-white text-black shadow-lg' : 'text-neutral-400 hover:text-white'}`}
                            >
                                <FileText size={16} /> Transmissions
                            </Link>
                            <Link
                                to="/admin/assets"
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${location.pathname === '/admin/assets' ? 'bg-white text-black shadow-lg' : 'text-neutral-400 hover:text-white'}`}
                            >
                                <ImageIcon size={16} /> Factory
                            </Link>
                        </div>
                    )}
                </div>

                {!hasKey ? (
                    <div className="bg-[#0a0a0a] border border-white/10 p-12 md:p-20 rounded-[40px] text-center max-w-2xl mx-auto shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-50" />
                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10 group-hover:scale-110 transition-transform duration-500">
                                <Lock className="text-purple-400" size={32} />
                            </div>
                            <h2 className="text-3xl font-bold mb-4">Neural Link Required</h2>
                            <p className="text-neutral-400 mb-8 leading-relaxed max-w-md mx-auto">
                                To synthesize high-fidelity 4K assets using <strong>Gemini 3 Pro</strong>, you must select an authorized API key with billing enabled.
                            </p>
                            <div className="flex flex-col gap-4 items-center">
                                <button
                                    onClick={handleSelectKey}
                                    className="px-10 py-4 bg-white text-black rounded-2xl font-black text-lg hover:bg-neutral-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                                >
                                    SELECT KEY
                                </button>
                                <a
                                    href="https://ai.google.dev/gemini-api/docs/billing"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-neutral-600 hover:text-neutral-400 underline underline-offset-4 transition-colors flex items-center gap-1"
                                >
                                    Learn about API billing <ExternalLink size={10} />
                                </a>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Control Panel */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-neutral-900/50 border border-white/10 p-8 rounded-[32px] backdrop-blur-md">
                                <h3 className="text-[10px] font-mono text-neutral-500 uppercase tracking-[0.4em] mb-6">Synthesis Presets</h3>

                                <div className="space-y-3">
                                    <PresetButton
                                        onClick={() => generateAsset('GitKubeOps')}
                                        icon={<Box size={20} />}
                                        title="Project Concept Art"
                                        sub="3D Isometric Tech Viz"
                                        disabled={isGenerating}
                                    />
                                    <PresetButton
                                        onClick={() => generateAsset('SocialCover')}
                                        icon={<Layout size={20} />}
                                        title="Metadata Cover"
                                        sub="High-End OG/Preview Art"
                                        disabled={isGenerating}
                                    />
                                    <PresetButton
                                        onClick={() => generateAsset('Background')}
                                        icon={<Monitor size={20} />}
                                        title="Neural Wallpaper"
                                        sub="Abstract Cyber-Industrial"
                                        disabled={isGenerating}
                                    />
                                </div>

                                <div className="mt-8 pt-8 border-t border-white/5">
                                    <h3 className="text-[10px] font-mono text-neutral-500 uppercase tracking-[0.4em] mb-4">Neural Override</h3>
                                    <div className="relative">
                        <textarea
                            value={customPrompt}
                            onChange={(e) => setCustomPrompt(e.target.value)}
                            placeholder="Describe asset phenotype..."
                            className="w-full bg-black border border-white/10 rounded-xl p-4 text-xs font-mono text-neutral-300 h-24 focus:outline-none focus:border-purple-500/50 resize-none transition-all"
                        />
                                        <button
                                            onClick={() => generateAsset('Custom')}
                                            disabled={isGenerating || !customPrompt}
                                            className="absolute bottom-3 right-3 p-2 bg-purple-600 rounded-lg text-white hover:bg-purple-500 transition-all disabled:opacity-30"
                                        >
                                            <Send size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* WORKFLOW GUIDE */}
                            <div className="bg-neutral-900/30 border border-white/5 p-8 rounded-[32px]">
                                <h3 className="text-[10px] font-mono text-neutral-600 uppercase tracking-[0.4em] mb-6 flex items-center gap-2">
                                    <ShieldCheck size={12} /> Integration Vectors
                                </h3>
                                <div className="space-y-5">
                                    <UseCaseItem
                                        icon={<Share2 size={16} />}
                                        title="Social Architecture"
                                        desc="Share high-fidelity project thumbnails that stand out on technical networks."
                                    />
                                    <UseCaseItem
                                        icon={<Presentation size={16} />}
                                        title="Immersive Context"
                                        desc="Inject cinematic backgrounds into blog posts to heighten reader immersion."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Preview Stage */}
                        <div className="lg:col-span-8">
                            <div className="bg-[#050505] border border-neutral-800 rounded-[40px] aspect-video flex items-center justify-center relative overflow-hidden shadow-2xl group">
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[length:40px_40px] pointer-events-none" />

                                <AnimatePresence mode="wait">
                                    {isGenerating ? (
                                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                                            <div className="w-20 h-20 border-2 border-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                                                <div className="absolute inset-0 border-t-2 border-purple-500 rounded-full animate-spin" />
                                                <Cpu className="text-purple-400 animate-pulse" size={24} />
                                            </div>
                                            <p className="font-mono text-[10px] text-purple-400 animate-pulse tracking-[0.4em]">INITIATING QUANTUM RENDER...</p>
                                        </motion.div>
                                    ) : generatedImage ? (
                                        <motion.div key="image" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full h-full p-8">
                                            <img src={generatedImage} alt="Generated" className="relative z-10 w-full h-full object-contain rounded-2xl shadow-2xl transition-all" />
                                            <div className="absolute bottom-6 right-6 z-20 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                                <a href={generatedImage} download="neural-asset.png" className="p-4 bg-white text-black rounded-full shadow-2xl hover:scale-110 transition-all flex items-center">
                                                    <Download size={20} />
                                                </a>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div key="empty" className="text-center space-y-4">
                                            <div className="w-32 h-32 border border-neutral-900 rounded-[40px] flex items-center justify-center mx-auto bg-neutral-900/20">
                                                <ImageIcon size={48} className="text-neutral-800" />
                                            </div>
                                            <p className="font-mono text-[9px] uppercase tracking-[0.5em] text-neutral-700">Awaiting Signal Input</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="mt-8 grid grid-cols-3 gap-6">
                                <StatusCard icon={<Cpu size={14} />} label="Model" value="Gemini 3 Pro" />
                                <StatusCard icon={<Monitor size={14} />} label="Output" value="1024x576" />
                                <StatusCard icon={<Layers size={14} />} label="Type" value="Neural PNG" />
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

const PresetButton: React.FC<{ onClick: () => void, icon: any, title: string, sub: string, disabled: boolean }> = ({ onClick, icon, title, sub, disabled }) => (
    <button onClick={onClick} disabled={disabled} className="w-full p-5 bg-black border border-white/5 rounded-2xl text-left hover:border-purple-500/50 transition-all group flex items-start gap-4 disabled:opacity-50">
        <div className="p-2.5 bg-neutral-900 rounded-xl text-neutral-400 group-hover:text-purple-400 group-hover:bg-purple-400/10 transition-all">{icon}</div>
        <div>
            <p className="font-bold text-sm text-white group-hover:text-purple-400 transition-colors">{title}</p>
            <p className="text-[10px] text-neutral-600 mt-0.5">{sub}</p>
        </div>
    </button>
);

const UseCaseItem: React.FC<{ icon: any, title: string, desc: string }> = ({ icon, title, desc }) => (
    <div className="flex items-start gap-4">
        <div className="mt-1 text-neutral-500">{icon}</div>
        <div>
            <p className="text-xs font-bold text-neutral-300 mb-1">{title}</p>
            <p className="text-[10px] text-neutral-500 leading-relaxed">{desc}</p>
        </div>
    </div>
);

const StatusCard: React.FC<{ icon: any, label: string, value: string }> = ({ icon, label, value }) => (
    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl flex items-center gap-4">
        <div className="text-neutral-500">{icon}</div>
        <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-600 mb-0.5">{label}</p>
            <p className="text-[10px] font-mono text-neutral-400">{value}</p>
        </div>
    </div>
);

export default AdminAssets;
