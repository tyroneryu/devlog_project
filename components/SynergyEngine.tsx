import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, Sparkles, RefreshCw, Link2, ExternalLink, AlertCircle } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { useBlogData } from '../hooks/useBlogData';

interface SynergyResult {
  title: string;
  concept: string;
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

  const blogContext = posts.map(post => `- [${post.category}] (ID: ${post.id}) ${post.title}: ${post.excerpt}`).join('\n');

  const generateSynergyIdea = async () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      setError("AI API Key is missing. Check deployment settings.");
      return;
    }

    setIsGenerating(true);
    setSynergyData(null);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `You are the "Synergy Engine" for a hybrid professional who is both a Software Engineer and a MICE (Event) Planner.
      
      Analyze their actual written articles to understand their specific niche interests:
      ${blogContext || "User has no articles yet, use general knowledge about Event Tech."}

      Task: Generate a specific, innovative project concept that combines their TECHNICAL expertise with their EVENT expertise.
      
      Return JSON strictly:
      {
        "title": string,
        "concept": string,
        "source_articles": [{"title": string, "id": string}]
      }`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              concept: { type: Type.STRING },
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
            }
          }
        }
      });

      if (response.text) {
        setSynergyData(JSON.parse(response.text));
      }
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Failed to generate idea.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
      <section id="synergy" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-b border-neutral-900">
        <div className="bg-gradient-to-br from-neutral-900 via-black to-neutral-900 border border-white/5 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={20} className="text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest">Innovation Lab</span>
              </div>
              <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Synergy Engine</span>.
              </h3>
              <p className="text-neutral-400 text-lg leading-relaxed mb-8">
                AI analyzes my actual blog posts to synthesize a unique hybrid project concept.
              </p>
              <button
                  onClick={generateSynergyIdea}
                  disabled={isGenerating}
                  className="group flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-neutral-200 transition-all disabled:opacity-50"
              >
                {isGenerating ? <RefreshCw className="animate-spin" /> : <Sparkles />}
                {isGenerating ? "Synthesizing..." : "Generate Custom Idea"}
              </button>

              {error && (
                  <div className="mt-4 flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                    <AlertCircle size={16} /> {error}
                  </div>
              )}
            </div>

            <div className="md:w-1/2 w-full min-h-[200px] flex items-center justify-center">
              <AnimatePresence mode='wait'>
                {synergyData ? (
                    <motion.div
                        key="idea"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl w-full shadow-2xl"
                    >
                      <div className="text-xl md:text-2xl font-bold text-white mb-4">{synergyData.title}</div>
                      <p className="text-neutral-300 leading-relaxed mb-6">{synergyData.concept}</p>
                      {synergyData.source_articles?.length > 0 && (
                          <div className="pt-6 border-t border-white/10">
                            <div className="flex flex-wrap gap-3">
                              {synergyData.source_articles.map((article, idx) => (
                                  <Link key={idx} to={`/blog/${article.id}`} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs hover:bg-blue-500/20 transition-all">
                                    <span>{article.title}</span>
                                    <ExternalLink size={10} />
                                  </Link>
                              ))}
                            </div>
                          </div>
                      )}
                    </motion.div>
                ) : (
                    <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-neutral-600">
                      <div className="w-16 h-16 border-2 border-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4 border-dashed animate-spin-slow">
                        <Zap size={24} />
                      </div>
                      <p className="text-sm uppercase tracking-widest">Awaiting Analysis</p>
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