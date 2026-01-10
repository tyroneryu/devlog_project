import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, API_BASE } from '../context/AuthContext';
import { Save, Loader2, ArrowLeft, Lock, AlertCircle, Terminal, Eye, FileText, Hash, Layers, Sparkles, Wand2, RefreshCw, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { GoogleGenAI } from "@google/genai";

const AdminWrite: React.FC = () => {
    const { isAuthenticated, token } = useAuth();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [category, setCategory] = useState<'Dev' | 'MICE'>('Dev');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // AI States
    const [aiLoading, setAiLoading] = useState<'excerpt' | 'tags' | null>(null);

    useEffect(() => {
        console.log("AdminWrite Mounted. Auth:", isAuthenticated);
        // Load draft from local storage on mount
        const savedDraft = localStorage.getItem('admin_draft');
        if (savedDraft) {
            try {
                const parsed = JSON.parse(savedDraft);
                setTitle(parsed.title || '');
                setExcerpt(parsed.excerpt || '');
                setContent(parsed.content || '');
                setTags(parsed.tags || '');
                setCategory(parsed.category || 'Dev');
            } catch (e) {
                console.error("Failed to load draft", e);
            }
        }
    }, [isAuthenticated]);

    // Auto-save draft
    useEffect(() => {
        const draft = { title, excerpt, content, tags, category };
        localStorage.setItem('admin_draft', JSON.stringify(draft));
    }, [title, excerpt, content, tags, category]);

    const handleAiAssist = async (type: 'excerpt' | 'tags') => {
        if (!content) {
            alert("Please enter some content first for analysis.");
            return;
        }

        setAiLoading(type);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const model = 'gemini-3-flash-preview';

            let prompt = "";
            if (type === 'excerpt') {
                prompt = `Analyze the following blog post content and generate a concise, engaging summary (excerpt) under 150 characters. Maintain a professional yet technical tone. Content:\n\n${content.substring(0, 3000)}`;
            } else {
                prompt = `Analyze the following blog post content and extract 3-5 relevant technical tags (comma separated). Example output: "React, Node.js, AI". Content:\n\n${content.substring(0, 3000)}`;
            }

            const result = await ai.models.generateContent({
                model,
                contents: prompt,
            });

            const responseText = result.text?.trim() || "";

            if (type === 'excerpt') {
                setExcerpt(responseText);
            } else {
                setTags(responseText);
            }

        } catch (error) {
            console.error("AI Assist Error:", error);
            alert("Neural Link Failed (AI Error)");
        } finally {
            setAiLoading(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content) return;

        setIsSubmitting(true);
        const tagArray = tags.split(',').map(t => t.trim()).filter(t => t);

        try {
            const response = await fetch(`${API_BASE}/api/admin/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    excerpt,
                    content,
                    tags: tagArray,
                    category
                })
            });

            if (response.ok) {
                alert('Transmission Secured (Post Published).');
                localStorage.removeItem('admin_draft'); // Clear draft on success
                navigate('/blog');
            } else {
                const err = await response.json();
                alert(`Transmission Failed: ${err.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error(error);
            alert('Network Signal Lost');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Access Denied Screen
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-white px-4 relative bg-black overflow-hidden">
                {/* Ambient Background */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/20 rounded-full blur-[120px] pointer-events-none" />

                <div className="relative z-10 bg-[#111]/80 backdrop-blur-xl p-8 rounded-3xl border border-red-500/30 text-center max-w-md w-full shadow-2xl">
                    <div className="flex justify-center mb-6">
                        <div className="p-4 rounded-full bg-red-500/10 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                            <Lock size={48} className="text-red-500" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold mb-2 tracking-tight">Access Restricted</h1>
                    <p className="mb-8 text-neutral-400 text-sm">
                        Secure channel required. Please authenticate to proceed.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => navigate('/admin')}
                            className="px-8 py-3 bg-white text-black rounded-xl font-bold hover:bg-neutral-200 transition-colors shadow-lg"
                        >
                            Authenticate
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black pt-32 pb-24 px-6 md:px-12 relative z-40 overflow-hidden">
            {/* Cinematic Ambient Background */}
            <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-7xl mx-auto relative z-10"
            >

                {/* Header Section */}
                <div className="flex items-center justify-between mb-16">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-600/10 border border-blue-500/20 rounded-xl backdrop-blur-md">
                            <Terminal size={24} className="text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white tracking-tight">Transmission Console</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <p className="text-neutral-500 text-xs font-mono uppercase tracking-widest">Create New Entry</p>
                                <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] text-green-500 font-mono">DRAFT AUTO-SAVED</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/blog')}
                        className="text-neutral-400 hover:text-white flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                    >
                        <ArrowLeft size={18} /> <span className="text-sm font-medium">Abort</span>
                    </button>
                </div>

                {/* Removed items-start so grid items stretch to match height */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 h-full">

                    {/* ---------------- EDITOR COLUMN ---------------- */}
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-8 h-full"
                    >
                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* Title Input (Hero Style) */}
                            <div className="group">
                                <input
                                    type="text"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder="UNTITLED TRANSMISSION"
                                    className="w-full bg-transparent border-b border-neutral-800 py-4 text-4xl md:text-5xl font-bold text-white placeholder-neutral-700 focus:outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>

                            {/* Meta Data Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-neutral-900/30 border border-white/5 backdrop-blur-sm">

                                {/* Category */}
                                <div>
                                    <label className="flex items-center gap-2 text-xs font-mono text-blue-400 uppercase mb-3">
                                        <Layers size={12} /> Category Protocol
                                    </label>
                                    <div className="flex gap-2">
                                        {(['Dev', 'MICE'] as const).map((cat) => (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => setCategory(cat)}
                                                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold border transition-all duration-300 ${
                                                    category === cat
                                                        ? 'bg-blue-600 text-white border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)]'
                                                        : 'bg-black/40 text-neutral-500 border-neutral-800 hover:border-neutral-600 hover:text-white'
                                                }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Tags with AI Button */}
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="flex items-center gap-2 text-xs font-mono text-purple-400 uppercase">
                                            <Hash size={12} /> Metadata Tags
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => handleAiAssist('tags')}
                                            disabled={aiLoading === 'tags'}
                                            className="text-[10px] flex items-center gap-1 text-purple-300 hover:text-white transition-colors disabled:opacity-50"
                                        >
                                            {aiLoading === 'tags' ? <Loader2 size={10} className="animate-spin" /> : <Bot size={10} />}
                                            AI EXTRACT
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        value={tags}
                                        onChange={e => setTags(e.target.value)}
                                        placeholder="React, AI, Protocol..."
                                        className="w-full bg-black/40 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:bg-purple-500/5 transition-all"
                                    />
                                </div>

                                {/* Excerpt with AI Button */}
                                <div className="md:col-span-2">
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="flex items-center gap-2 text-xs font-mono text-neutral-500 uppercase">
                                            <FileText size={12} /> Abstract Summary
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => handleAiAssist('excerpt')}
                                            disabled={aiLoading === 'excerpt'}
                                            className="text-[10px] flex items-center gap-1 text-blue-400 hover:text-white transition-colors disabled:opacity-50"
                                        >
                                            {aiLoading === 'excerpt' ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                                            AI GENERATE
                                        </button>
                                    </div>
                                    <textarea
                                        value={excerpt}
                                        onChange={e => setExcerpt(e.target.value)}
                                        placeholder="Brief intelligence summary..."
                                        className="w-full h-24 bg-black/40 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-300 focus:border-white/30 focus:outline-none resize-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Main Content with Toolbar */}
                            <div className="relative group">
                                <div className="flex items-center justify-between mb-3 px-2">
                                    <div className="flex items-center gap-2">
                                        <div className="px-2 bg-black text-xs font-mono text-neutral-500 uppercase tracking-widest">
                                            Payload Content (Markdown)
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {/* Placeholder for future toolbar items */}
                                        <div className="text-[10px] text-neutral-600 font-mono">NEURAL EDITOR V1.0</div>
                                    </div>
                                </div>

                                <textarea
                                    value={content}
                                    onChange={e => setContent(e.target.value)}
                                    placeholder="# Initiate protocol..."
                                    className="w-full h-[600px] bg-neutral-900/30 border border-white/10 rounded-2xl px-6 py-6 text-neutral-300 font-mono text-sm leading-relaxed focus:border-blue-500/50 focus:bg-neutral-900/50 focus:outline-none focus:shadow-[0_0_30px_rgba(0,0,0,0.5)] custom-scrollbar resize-none transition-all"
                                />
                            </div>

                            {/* Submit Action */}
                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="relative group overflow-hidden bg-white text-black px-12 py-4 rounded-xl font-bold text-lg disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <span className="relative z-10 flex items-center gap-3">
                        {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                                        {isSubmitting ? 'UPLOADING...' : 'INITIATE UPLOAD'}
                     </span>
                                </button>
                            </div>

                        </form>
                    </motion.div>


                    {/* ---------------- PREVIEW COLUMN ---------------- */}
                    {/* Changed: Removed sticky top-32, added flex col and h-full to match left column height */}
                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="hidden lg:flex flex-col h-full"
                    >
                        <div className="flex items-center gap-2 mb-4 shrink-0">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <label className="text-xs font-mono text-green-500 uppercase tracking-widest">Live Visual Feed</label>
                        </div>

                        {/* Changed: flex-1 to fill the remaining space, ensuring bottom alignment with left column */}
                        <div className="bg-[#050505] border border-neutral-800 rounded-3xl p-8 flex-1 overflow-y-auto custom-scrollbar shadow-2xl relative min-h-[600px]">
                            {/* Scanline Effect */}
                            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-10" />

                            <div className="relative z-10">
                                {category && (
                                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-6 border ${
                                        category === 'Dev'
                                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                            : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                    }`}>
                        {category} Protocol
                     </span>
                                )}

                                <h1 className={`text-4xl font-bold text-white mb-6 leading-tight ${!title && 'opacity-30'}`}>
                                    {title || "TITLE_UNDEFINED"}
                                </h1>

                                {excerpt && (
                                    <p className="text-xl text-neutral-400 leading-relaxed font-light mb-8 border-l-2 border-white/10 pl-4">
                                        {excerpt}
                                    </p>
                                )}

                                <div className="prose prose-invert max-w-none text-neutral-300 font-light leading-7">
                                    {content ? (
                                        <ReactMarkdown
                                            components={{
                                                h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-white mt-8 mb-4" {...props} />,
                                                h2: ({node, ...props}) => <h2 className="text-xl font-bold text-white mt-6 mb-3" {...props} />,
                                                code: ({node, ...props}) => <code className="bg-neutral-800 text-blue-300 px-1 py-0.5 rounded text-xs font-mono" {...props} />,
                                                blockquote: ({node, ...props}) => <blockquote className="border-l-2 border-white/20 pl-4 italic text-neutral-500 my-4" {...props} />,
                                            }}
                                        >
                                            {content}
                                        </ReactMarkdown>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-20 text-neutral-800 gap-4">
                                            <Eye size={48} />
                                            <p className="font-mono text-xs">AWAITING DATA STREAM...</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Decoration - Tech lines */}
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 border-r-2 border-b-2 border-white/10 rounded-br-3xl pointer-events-none" />
                        <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-white/10 rounded-tl-3xl pointer-events-none" />
                    </motion.div>

                </div>
            </motion.div>
        </div>
    );
};

export default AdminWrite;