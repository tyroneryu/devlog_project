import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, Sparkles, RefreshCw, ExternalLink, AlertCircle, Terminal, Cpu, Target, Binary, Fingerprint } from 'lucide-react';
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
      setError("AI_KEY_MISSING: Neural link could not be established.");
      return;
    }

    setIsGenerating(true);
    setSynergyData(null);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey });

      const systemInstruction = `You are an Elite Cybernetic Architect and CTO with 20 years of experience in both Low-Level Systems Engineering and International MICE Strategy.

CRITICAL DIRECTIVES:
1. ABSOLUTELY NO BUZZWORDS: Never use words like "Next-gen", "Smart", "Seamless", "AI-powered", or "Innovative". If the technology is AI, describe its specific mathematical function (e.g., "Transformer-based sequence modeling").
2. ARCHITECTURAL RIGOR: Propose solutions that sound like a 'Black Mirror' prototype or a DARPA-level engineering project.
3. HYBRID COLLISION: Synthesize concepts where high-performance software (e.g., WebAudio API, WASM, Rust, eBPF) directly solves a physical event crisis (e.g., 50k pax crowd stampede prevention, head-of-state protocol automation, zero-latency remote interpretation).
4. GROUNDED IN REALITY: Use the provided context from the user's blog posts to identify their specific expertise and push it to its logical, extreme conclusion.

Context Data (User's Brain):
${blogContext}`;

      const prompt = `Based on my technical DNA, synthesize a "High-Concept Engineering Prototype" that defines a new category in the hybrid tech-experience sector.

The output must be a JSON object with:
- title: A sharp, cold, technical designation.
- concept: A high-fidelity description of the implementation (hardware + software).
- tech_stack: 4 specific, advanced tools or protocols.
- core_thesis: The underlying engineering or psychological logic that makes this essential.
- strategic_value: How this shifts the industry paradigm.
- source_articles: The specific articles that inspired this synthesis.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', // Complex reasoning upgrade
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
      console.error("Synergy Engine Fault:", e);
      setError(e.message || "NEURAL_LINK_ERROR: The synthesis cycle was interrupted.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
      <section id="synergy" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-b border-neutral-900">
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[40px] p-8 md:p-16 relative overflow-hidden group/section">
          {/* Animated Grid Background */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
          </div>

          {/* Glow Orbs */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none group-hover/section:bg-blue-500/20 transition-colors duration-1000" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-stretch justify-between gap-20">
            <div className="lg:w-[45%] space-y-10">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-yellow-400/10 rounded-lg">
                    <Zap size={20} className="text-yellow-400 fill-yellow-400" />
                  </div>
                  <span className="text-xs font-black text-yellow-400 uppercase tracking-[0.3em] font-mono">Neural Synthesizer v3.0</span>
                </div>
                <h3 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter leading-[0.9]">
                  Synergy <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Engine.</span>
                </h3>
                <p className="text-neutral-500 text-xl leading-relaxed font-light">
                  당신의 기술적 통찰과 운영적 경험의 DNA를 결합하여, 아직 존재하지 않는 하이엔드 프로젝트 프로토타입을 설계합니다.
                </p>
              </div>

              <div className="space-y-4">
                <button
                    onClick={generateSynergyIdea}
                    disabled={isGenerating}
                    className="w-full md:w-auto flex items-center justify-center gap-4 px-12 py-6 bg-white text-black rounded-2xl font-black text-xl hover:bg-cyan-50 transition-all disabled:opacity-50 shadow-[0_0_40px_rgba(255,255,255,0.1)] active:scale-95 group/btn"
                >
                  {isGenerating ? <RefreshCw className="animate-spin" size={24} /> : <Binary size={24} className="group-hover/btn:rotate-180 transition-transform duration-500" />}
                  {isGenerating ? "SYNTHESIZING..." : "INITIALIZE SYNTHESIS"}
                </button>
                <p className="text-[10px] font-mono text-neutral-700 tracking-widest pl-2">SYSTEM_MODE: HIGH_FIDELITY_REASONING</p>
              </div>

              {error && (
                  <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono flex items-start gap-3"
                  >
                    <AlertCircle size={14} className="shrink-0 mt-0.5" />
                    <span>[FATAL_EXCEPTION]: {error}</span>
                  </motion.div>
              )}
            </div>

            <div className="lg:w-[55%] min-h-[550px] flex items-center justify-center">
              <AnimatePresence mode='wait'>
                {synergyData ? (
                    <motion.div
                        key="idea"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-neutral-900/40 backdrop-blur-3xl border border-white/10 p-10 md:p-14 rounded-[32px] w-full shadow-2xl relative overflow-hidden"
                    >
                      {/* Interior Scanline */}
                      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] opacity-10" />

                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-12">
                          <div>
                            <div className="text-[10px] font-mono text-cyan-400 mb-3 uppercase tracking-[0.4em] flex items-center gap-2">
                              <Target size={12} /> Project Designation
                            </div>
                            <h4 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none">{synergyData.title}</h4>
                          </div>
                          <div className="p-3 bg-white/5 rounded-full border border-white/10">
                            <Fingerprint size={24} className="text-neutral-500" />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-12 mb-12">
                          <div className="space-y-4">
                            <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest border-l-2 border-cyan-500 pl-3">Concept Payload</div>
                            <p className="text-neutral-300 text-sm leading-relaxed font-light">{synergyData.concept}</p>
                          </div>
                          <div className="space-y-4">
                            <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest border-l-2 border-purple-500 pl-3">Core Thesis</div>
                            <p className="text-neutral-400 text-sm italic font-light leading-relaxed">
                              "{synergyData.core_thesis}"
                            </p>
                          </div>
                        </div>

                        <div className="mb-12">
                          <div className="text-[10px] font-mono text-neutral-600 mb-4 uppercase tracking-widest">Protocol Stack</div>
                          <div className="flex flex-wrap gap-2">
                            {synergyData.tech_stack.map(tech => (
                                <span key={tech} className="px-4 py-2 bg-black/50 rounded-lg border border-white/5 text-[11px] font-mono text-cyan-300 flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-cyan-500 animate-pulse" /> {tech}
                                    </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="space-y-3">
                            <div className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest">Reference Nodes</div>
                            <div className="flex flex-wrap gap-2">
                              {synergyData.source_articles?.map((article, idx) => (
                                  <Link key={idx} to={`/blog/${article.id}`} className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 text-neutral-400 text-[10px] hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/10">
                                    <span>{article.title}</span>
                                    <ExternalLink size={8} />
                                  </Link>
                              ))}
                            </div>
                          </div>
                          <div className="shrink-0 flex items-center gap-2 text-neutral-700 font-mono text-[8px] uppercase tracking-widest bg-black/30 px-3 py-1 rounded-full">
                            <Cpu size={10} /> Validated_By_Gemini_Pro
                          </div>
                        </div>
                      </div>
                    </motion.div>
                ) : (
                    <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-8">
                      <div className="w-32 h-32 border-2 border-neutral-900 rounded-[40px] flex items-center justify-center mx-auto relative group">
                        <div className="absolute inset-0 border-2 border-neutral-800 rounded-[40px] animate-ping opacity-20" />
                        <Terminal size={40} className="text-neutral-800 group-hover:text-neutral-600 transition-colors" />
                      </div>
                      <div className="space-y-2">
                        <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-neutral-700">Awaiting Signal Inflow</p>
                        <div className="flex justify-center gap-1">
                          {[0, 1, 2].map(i => <motion.div key={i} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }} className="w-1 h-1 bg-neutral-800 rounded-full" />)}
                        </div>
                      </div>
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