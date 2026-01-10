import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useSinglePost } from '../hooks/useBlogData';
import { Calendar, ArrowLeft, Github, Mail, Twitter, Volume2, Sparkles, StopCircle, Loader2, X, ArrowRight, Link2, Check, Globe, ChevronDown, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, HarmCategory, HarmBlockThreshold, Modality } from "@google/genai";

// Audio Helper Functions
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { post, loading } = useSinglePost(id);

  // AI Chat State
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Translation State
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('Original');
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  // Audio State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);

  // Refs for Audio Streaming Management
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const isCancelledRef = useRef<boolean>(false);

  // Copy State
  const [copied, setCopied] = useState(false);

  // Define stopAudio BEFORE useEffect to avoid ReferenceError/TDZ issues
  const stopAudio = () => {
    isCancelledRef.current = true;
    activeSourcesRef.current.forEach(source => {
      try { source.stop(); } catch(e) {}
    });
    activeSourcesRef.current = [];
    setIsPlaying(false);
    setIsAudioLoading(false);
  };

  useEffect(() => {
    return () => {
      stopAudio();
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
          <Loader2 size={32} className="animate-spin text-neutral-500" />
        </div>
    );
  }

  if (!post) {
    return (
        <div className="min-h-screen flex items-center justify-center text-white bg-black">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Post not found</h1>
            <p className="text-neutral-500 mb-6">It might have been deleted from the backend.</p>
            <Link to="/blog" className="text-neutral-400 hover:text-white transition-colors">Back to Blog</Link>
          </div>
        </div>
    );
  }

  const handleShare = async (platform: 'twitter' | 'mail' | 'copy') => {
    const url = window.location.href;
    const text = `Check out "${post.title}" by Taeyun Ryu`;

    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'mail') {
      window.location.href = `mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(text + '\n\n' + url)}`;
    } else if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy', err);
      }
    }
  };

  const handleTranslate = async (targetLang: string) => {
    setIsLangMenuOpen(false);
    if (targetLang === 'Original') {
      setCurrentLang('Original');
      setTranslatedContent(null);
      return;
    }

    if (targetLang === currentLang) return;

    setIsTranslating(true);
    setCurrentLang(targetLang);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `You are a professional tech blog translator. 
      Translate the following Markdown blog post content into ${targetLang}.
      
      IMPORTANT RULES:
      1. Keep all Markdown formatting (headers, bold, lists, code blocks) exactly as is.
      2. Do NOT translate code inside code blocks (keep variable names, logic in English). Only translate comments if they explain the code.
      3. Maintain a professional, technical, yet engaging tone.
      
      Content to translate:
      ${post.content}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [{ text: prompt }]
        },
        config: {
          // Disable safety filters to prevent blocking technical terms like "Attack", "Virus", "Kill process"
          safetySettings: [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          ]
        }
      });

      if (response.text) {
        setTranslatedContent(response.text);
      } else {
        throw new Error("Model returned empty response (likely filtered).");
      }
    } catch (error: any) {
      console.error("Translation Error:", error);
      alert(`Translation failed: ${error.message || "Unknown error"}`);
      setCurrentLang('Original');
      setTranslatedContent(null);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleAiSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsAiLoading(true);
    setAiAnswer('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const systemInstruction = `You are an AI assistant. Context:\nTitle: ${post.title}\nContent: ${post.content}`;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: query,
        config: { systemInstruction }
      });
      setAiAnswer(response.text || "No response generated.");
    } catch (error) {
      setAiAnswer("AI Error.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const toggleAudio = async () => {
    if (isPlaying) {
      stopAudio();
      return;
    }

    setIsAudioLoading(true);
    setIsPlaying(true);
    isCancelledRef.current = false;
    activeSourcesRef.current = [];

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      // Initialize AudioContext allowing default sample rate
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;

      // Resume if suspended (browser autoplay policy)
      if (ctx.state === 'suspended') await ctx.resume();

      // Schedule start time slightly in the future to allow buffering
      nextStartTimeRef.current = ctx.currentTime + 0.1;

      // Use generateContentStream for low latency (Chunked Transfer)
      const stream = await ai.models.generateContentStream({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: (translatedContent || post.content).substring(0, 4000) }] }], // Read the current language
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
        },
      });

      // Process chunks as they arrive
      for await (const chunk of stream) {
        if (isCancelledRef.current) break;

        const base64Audio = chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
          // As soon as first chunk arrives, stop loading spinner
          setIsAudioLoading(false);

          const audioBytes = decode(base64Audio);
          // Decode 24kHz raw PCM from Gemini to AudioBuffer
          const audioBuffer = await decodeAudioData(audioBytes, ctx, 24000, 1);

          const source = ctx.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(ctx.destination);

          // Gapless Playback Logic:
          // Schedule this chunk to play exactly when the previous one ends.
          // If the previous one ended in the past (underrun), play immediately.
          const startTime = Math.max(ctx.currentTime, nextStartTimeRef.current);
          source.start(startTime);
          nextStartTimeRef.current = startTime + audioBuffer.duration;

          activeSourcesRef.current.push(source);

          // Cleanup finished sources
          source.onended = () => {
            activeSourcesRef.current = activeSourcesRef.current.filter(s => s !== source);
          };
        }
      }

      // When stream loop finishes, ensure UI updates when audio actually finishes
      const lastSource = activeSourcesRef.current[activeSourcesRef.current.length - 1];
      if (lastSource) {
        lastSource.onended = () => {
          // Only turn off if not cancelled (to avoid race conditions)
          if (!isCancelledRef.current) setIsPlaying(false);
        };
      } else {
        setIsPlaying(false);
      }

    } catch (error) {
      console.error("Streaming error:", error);
      stopAudio();
      alert("Audio generation failed.");
    }
  };

  // Markdown Render Config
  const MarkdownComponents = {
    h1: ({node, ...props}: any) => <h1 className="text-3xl md:text-5xl font-bold text-white mt-16 mb-8 tracking-tight" {...props} />,
    h2: ({node, ...props}: any) => <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6" {...props} />,
    h3: ({node, ...props}: any) => <h3 className="text-xl md:text-2xl font-semibold text-white mt-8 mb-4" {...props} />,
    p: ({node, ...props}: any) => <p className="text-lg text-neutral-300 leading-8 mb-6 font-light" {...props} />,
    ul: ({node, ...props}: any) => <ul className="list-disc ml-6 space-y-2 mb-6 text-neutral-300 text-lg" {...props} />,
    ol: ({node, ...props}: any) => <ol className="list-decimal ml-6 space-y-2 mb-6 text-neutral-300 text-lg" {...props} />,
    li: ({node, ...props}: any) => <li className="pl-2" {...props} />,
    blockquote: ({node, ...props}: any) => <blockquote className="border-l-2 border-white/20 pl-6 py-2 my-10 italic text-xl text-neutral-400" {...props} />,
    code: ({node, inline, className, children, ...props}: any) => {
      if (inline) return <code className="bg-neutral-900 text-blue-300 px-1.5 py-0.5 rounded text-sm font-mono border border-white/5" {...props}>{children}</code>;
      return <div className="my-8 rounded-lg overflow-hidden border border-white/10 bg-[#0d0d0d]"><pre className="p-6 overflow-x-auto text-sm md:text-base text-neutral-300 font-mono"><code {...props}>{children}</code></pre></div>;
    },
    a: ({node, ...props}: any) => <a className="text-blue-400 hover:text-blue-300 underline underline-offset-4" {...props} />,
    img: ({node, ...props}: any) => <img className="rounded-xl my-8 border border-white/10 w-full" {...props} />,
  };

  const languages = ['Original', 'Korean', 'English', 'Japanese', 'Spanish', 'French'];

  return (
      <div className="min-h-screen bg-black pt-32 pb-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl mx-auto px-6 md:px-8">
          <Link to="/blog" className="inline-flex items-center text-neutral-500 hover:text-white mb-12 transition-colors group">
            <ArrowLeft size={20} className="mr-2 transform group-hover:-translate-x-1 transition-transform" /> Back to Blog
          </Link>

          <header className="mb-8 border-b border-neutral-900 pb-8">
            <div className="flex flex-wrap gap-4 items-center text-sm font-medium text-neutral-500 mb-8 uppercase tracking-wider">
              <span className="flex items-center gap-2"><Calendar size={14} /> {post.date}</span>
              <span className="w-1 h-1 rounded-full bg-neutral-800"></span>
              <div className="flex gap-2">{post.tags.map(tag => <span key={tag} className="px-3 py-1 rounded-full bg-white/5 text-neutral-300 border border-white/5">{tag}</span>)}</div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-[1.1] mb-8">{post.title}</h1>
            <p className="text-xl md:text-2xl text-neutral-400 leading-relaxed font-light">{post.excerpt}</p>
          </header>

          {/* Action Bar */}
          <div className="flex flex-wrap gap-3 mb-16">

            {/* TTS Button */}
            <button onClick={toggleAudio} disabled={isAudioLoading} className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all ${isPlaying ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}>
              {isAudioLoading ? <Loader2 size={18} className="animate-spin" /> : isPlaying ? <StopCircle size={18} /> : <Volume2 size={18} />}
              <span className="text-sm font-medium">{isPlaying ? 'Stop' : 'Listen'}</span>
            </button>

            {/* Translation Menu */}
            <div className="relative">
              <button
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all ${currentLang !== 'Original' ? 'bg-blue-500/10 border-blue-500/30 text-blue-300' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
              >
                {isTranslating ? <Loader2 size={18} className="animate-spin" /> : <Globe size={18} />}
                <span className="text-sm font-medium">{currentLang === 'Original' ? 'Translate' : currentLang}</span>
                <ChevronDown size={14} className={`transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isLangMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full left-0 mt-2 w-40 bg-[#111] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 py-1"
                    >
                      {languages.map((lang) => (
                          <button
                              key={lang}
                              onClick={() => handleTranslate(lang)}
                              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/10 transition-colors flex items-center justify-between ${currentLang === lang ? 'text-blue-400 font-bold' : 'text-neutral-300'}`}
                          >
                            {lang}
                            {currentLang === lang && <Check size={14} />}
                          </button>
                      ))}
                    </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* AI Search Button */}
            <button onClick={() => setIsAiOpen(!isAiOpen)} className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all ${isAiOpen ? 'bg-purple-500/10 border-purple-500/30 text-purple-300' : 'bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-purple-500/30 text-purple-200 hover:opacity-80'}`}>
              <Sparkles size={18} className={isAiOpen ? "text-purple-400" : "text-purple-400 animate-pulse"} />
              <span className="text-sm font-medium">Ask AI</span>
            </button>
          </div>

          {/* AI Panel */}
          <AnimatePresence>
            {isAiOpen && (
                <motion.div initial={{ height: 0, opacity: 0, marginBottom: 0 }} animate={{ height: 'auto', opacity: 1, marginBottom: 64 }} exit={{ height: 0, opacity: 0, marginBottom: 0 }} className="overflow-hidden">
                  <div className="bg-neutral-900/40 border border-purple-500/20 rounded-2xl p-6 backdrop-blur-sm relative">
                    <button onClick={() => setIsAiOpen(false)} className="absolute top-4 right-4 text-neutral-500 hover:text-white"><X size={20} /></button>
                    <form onSubmit={handleAiSearch} className="relative mb-6 mt-4">
                      <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ask about this article..." className="w-full bg-black/50 border border-white/10 rounded-xl px-6 py-4 pr-14 text-white focus:outline-none focus:border-purple-500/50" />
                      <button type="submit" disabled={isAiLoading} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/10 text-white hover:bg-purple-600">{isAiLoading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}</button>
                    </form>
                    {aiAnswer && <div className="prose prose-invert bg-black/30 p-6 rounded-xl"><ReactMarkdown>{aiAnswer}</ReactMarkdown></div>}
                  </div>
                </motion.div>
            )}
          </AnimatePresence>

          {/* Article Body */}
          <article className="min-w-full relative">
            {isTranslating && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-2xl h-64">
                  <RefreshCw size={32} className="animate-spin text-blue-400 mb-4" />
                  <p className="text-blue-200 font-mono animate-pulse">Translating to {currentLang}...</p>
                </div>
            )}
            <ReactMarkdown components={MarkdownComponents}>
              {translatedContent || post.content}
            </ReactMarkdown>
          </article>

          <div className="mt-24 mb-12 flex flex-col items-center gap-6 border-t border-neutral-900 pt-12">
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">Share this article</span>
            <div className="flex items-center gap-4">
              <button onClick={() => handleShare('twitter')} className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors group" title="Share on Twitter">
                <Twitter size={24} className="text-neutral-400 group-hover:text-white transition-colors" />
              </button>
              <button onClick={() => handleShare('mail')} className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors group" title="Share via Email">
                <Mail size={24} className="text-neutral-400 group-hover:text-white transition-colors" />
              </button>
              <button onClick={() => handleShare('copy')} className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors group" title="Copy Link">
                {copied ? (
                    <Check size={24} className="text-green-500 transition-colors" />
                ) : (
                    <Link2 size={24} className="text-neutral-400 group-hover:text-white transition-colors" />
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
  );
};

export default BlogPost;