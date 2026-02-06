import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, Sparkles, RefreshCw, ExternalLink, AlertCircle, Terminal, Cpu, Target, Binary, Fingerprint, ShieldAlert } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { useBlogData } from '../hooks/useBlogData';

interface SynergyResult {
  title: string;
  concept: string;
  tech_stack: string[];
  core_thesis: string;
  strategic_value: string;
  source_articles: {
    title: string;
    id: string;
  }[];
}

const SynergyEngine: React.FC = () => {
  const { posts } = useBlogData();
  const [synergyData, setSynergyData] = useState<SynergyResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const blogContext = posts.map(post => `- [${post.category}] ${post.title}: ${post.excerpt}`).join('\n');

  const generateSynergyIdea = async () => {
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      setError("NEURAL_LINK_NULL: API_KEY is required for synthesis.");
      return;
    }

    setIsGenerating(true);
    setSynergyData(null);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey });

      const systemInstruction = `You are a visionary CTO & Experience Architect specializing in Cyber-Industrial Systems. 
      Your thinking is inspired by the intersection of Low-Level Engineering and Global MICE Logistics.

      STRICT OUTPUT PROTOCOLS:
      1. TERMINOLOGY: Use high-fidelity engineering language (e.g., "deterministic latency," "asynchronous orchestration," "zero-knowledge verification").
      2. NO CLICHÉS: Ban words like "Smart," "Innovative," "Seamless," or "Game-changer."
      3. LOGICAL COLLISION: Synthesize a project that solves a physical world problem (Event Ops) using advanced software paradigms (Distributed Systems, WASM, Edge, etc.).
      4. CATEGORY CREATION: Don't just suggest an app; suggest a "System Prototype" or a "Protocol."

      CONTEXT (YOUR KNOWLEDGE BASE):
      ${blogContext}`;

      const prompt = `Perform a deep neural synthesis based on my technical DNA. 
      Create a project concept that sounds like a classified DARPA prototype for the MICE/Tech sector.

      Response must be a strict JSON object:
      {
        "title": "A sharp, multi-syllabic technical name",
        "concept": "A detailed 2-sentence architectural breakdown.",
        "tech_stack": ["4 specific high-performance tools/protocols"],
        "core_thesis": "The underlying engineering philosophy of this system.",
        "strategic_value": "The paradigm shift this project creates.",
        "source_articles": [{"title": "Post Title", "id": "Post ID"}]
      }`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview', // High quota, high performance
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              concept: { type: Type.STRING },
              tech_stack: { type: Type.ARRAY, items: { type: Type.STRING } },
              core_thesis: { type: Type.STRING },
              strategic_value: { type: Type.STRING },
              source_articles: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    id: { type: Type.STRING }
                  }
                }
              }
            },
            required: ["title", "concept", "tech_stack", "core_thesis", "strategic_value", "source_articles"]
          }
        }
      });

      if (response.text) {
        setSynergyData(JSON.parse(response.text));
      }
    } catch (e: any) {
      console.error("Synergy Engine Error:", e);
      if (e.message?.includes('429')) {
        setError("QUOTA_EXHAUSTED: Neural link is saturated. Please wait 60 seconds.");
      } else {
        setError("SYNTHESIS_FAILED: System integrity compromised.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
      <section id="synergy" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-b border-neutral-900">
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[40px] p-8 md:p-16 relative overflow-hidden group/section">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:50px_50px]" />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-stretch justify-between gap-20">
            <div className="lg:w-[40%] space-y-10">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Binary size={20} className="text-blue-400" />
                  </div>
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] font-mono">Neural Synthesizer v3.5</span>
                </div>
                <h3 className="text-5xl md:text-7xl font-bold text-white tracking-tighter leading-[0.9]">
                  Synergy <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Engine.</span>
                </h3>
                <p className="text-neutral-500 text-lg leading-relaxed font-light">
                  Cross-referencing technical whitepapers and operational logs to simulate high-concept project prototypes.
                </p>
              </div>

              <div className="space-y-4">
                <button
                    onClick={generateSynergyIdea}
                    disabled={isGenerating}
                    className="w-full md:w-auto flex items-center justify-center gap-4 px-10 py-5 bg-white text-black rounded-2xl font-black text-lg hover:bg-blue-50 transition-all disabled:opacity-50 shadow-[0_0_50px_rgba(255,255,255,0.1)] active:scale-95 group/btn"
                >
                  {isGenerating ? <RefreshCw className="animate-spin" size={24} /> : <Zap size={24} className="group-hover:fill-yellow-400 transition-all" />}
                  {isGenerating ? "RECONSTRUCTING..." : "INITIALIZE SYNTHESIS"}
                </button>
              </div>

              {error && (
                  <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400 text-xs font-mono flex items-center gap-3"
                  >
                    <ShieldAlert size={14} className="shrink-0" />
                    <span>[SIGNAL_ERROR]: {error}</span>
                  </motion.div>
              )}
            </div>

            <div className="lg:w-[60%] min-h-[500px] flex items-center justify-center">
              <AnimatePresence mode='wait'>
                {synergyData ? (
                    <motion.div
                        key="idea"
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-neutral-900/40 backdrop-blur-3xl border border-white/10 p-10 md:p-12 rounded-[32px] w-full shadow-2xl relative"
                    >
                      <div className="absolute top-8 right-10 text-[8px] font-mono text-blue-500/40 tracking-[0.3em]">STABLE_BUILD_F32</div>

                      <div className="mb-12">
                        <div className="text-[10px] font-mono text-blue-400 mb-3 uppercase tracking-[0.5em] flex items-center gap-2">
                          <Target size={12} /> Project Designation
                        </div>
                        <h4 className="text-4xl md:text-5xl font-black text-white tracking-tighter">{synergyData.title}</h4>
                      </div>

                      <div className="grid md:grid-cols-2 gap-10 mb-12">
                        <div className="space-y-4">
                          <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest border-l-2 border-blue-500 pl-3">Architecture Payload</div>
                          <p className="text-neutral-300 text-sm leading-relaxed font-light">{synergyData.concept}</p>
                        </div>
                        <div className="space-y-4">
                          <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest border-l-2 border-purple-500 pl-3">Core Thesis</div>
                          <p className="text-neutral-400 text-sm italic font-light leading-relaxed">
                            "{synergyData.core_thesis}"
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-12">
                        {synergyData.tech_stack.map(tech => (
                            <span key={tech} className="px-3 py-1.5 bg-black/50 rounded-lg border border-white/5 text-[10px] font-mono text-blue-300 flex items-center gap-2">
                                <Cpu size={10} /> {tech}
                            </span>
                        ))}
                      </div>

                      <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-3">
                          <div className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest">Inspiration Nodes</div>
                          <div className="flex flex-wrap gap-2">
                            {synergyData.source_articles?.map((article, idx) => (
                                <Link key={idx} to={`/blog/${article.id}`} className="flex items-center gap-2 px-3 py-1 bg-white/5 text-neutral-400 text-[10px] hover:text-white transition-all rounded">
                                  <span>{article.title}</span>
                                  <ExternalLink size={8} />
                                </Link>
                            ))}
                          </div>
                        </div>
                        <div className="shrink-0 font-mono text-[9px] text-neutral-700 bg-black/40 px-3 py-1 rounded-full border border-white/5">
                          VALIDATED_BY_FLASH_LITE
                        </div>
                      </div>
                    </motion.div>
                ) : (
                    <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-8">
                      <div className="w-24 h-24 border border-neutral-900 rounded-[30px] flex items-center justify-center mx-auto relative">
                        <Terminal size={32} className="text-neutral-800" />
                      </div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-neutral-700">Awaiting Signal Inflow</p>
                    </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
  );
};

export default SynergyEngine;