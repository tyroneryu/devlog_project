import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, Sparkles, RefreshCw, Link2, ExternalLink } from 'lucide-react';
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

  // Dynamically build context from fetched posts, INCLUDING THE ID for linking
  const blogContext = posts.map(post => `- [${post.category}] (ID: ${post.id}) ${post.title}: ${post.excerpt}`).join('\n');

  const generateSynergyIdea = async () => {
    setIsGenerating(true);
    setSynergyData(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      const prompt = `You are the "Synergy Engine" for a hybrid professional who is both a Software Engineer and a MICE (Event) Planner.
      
      Analyze their actual written articles to understand their specific niche interests:
      ${blogContext || "User has no articles yet, use general knowledge about Event Tech."}

      Task: Generate a specific, innovative project concept that combines their TECHNICAL expertise (e.g. React, K8s, Event-Driven Architecture) with their EVENT expertise (e.g. Sustainability, Crowd Control, Registration).
      
      Requirements:
      1. The idea must clearly reference specific technologies or concepts mentioned in their blogs.
      2. You MUST identify exactly which 2 or 3 blog posts you "combined" to create this idea. 
      3. Return the exact Title and the exact ID for each source article found in the context.
      
      Example Output: "Zero-Waste IoT Tracker" combining "Zero-Waste Event Protocols" (ID: mice-01) and "Node.js Streams" (ID: dev-02).`;

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
                    id: { type: Type.STRING, description: "The ID of the blog post as listed in the context." }
                  }
                },
                description: "The list of specific blog posts used as inspiration."
              }
            }
          }
        }
      });

      if (response.text) {
        setSynergyData(JSON.parse(response.text));
      }
    } catch (e) {
      console.error(e);
      setSynergyData({
        title: "System Error",
        concept: "Creativity buffer underflow. Please check the API key or try again.",
        source_articles: []
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
      <section id="synergy" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-b border-neutral-900">
        <div className="bg-gradient-to-br from-neutral-900 via-black to-neutral-900 border border-white/5 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 p-32 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

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
                This isn't random generation. The AI analyzes <strong>my actual blog posts</strong>—fetched live from the backend—to synthesize a unique hybrid project concept tailored to my specific expertise.
              </p>
              <button
                  onClick={generateSynergyIdea}
                  disabled={isGenerating}
                  className="group flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-neutral-200 transition-all disabled:opacity-50"
              >
                {isGenerating ? <RefreshCw className="animate-spin" /> : <Sparkles />}
                {isGenerating ? "Synthesizing..." : "Generate Custom Idea"}
              </button>
            </div>

            <div className="md:w-1/2 w-full min-h-[200px] flex items-center justify-center">
              <AnimatePresence mode='wait'>
                {synergyData ? (
                    <motion.div
                        key="idea"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl w-full shadow-2xl"
                    >
                      <div className="text-xl md:text-2xl font-bold text-white mb-4">
                        {synergyData.title}
                      </div>
                      <p className="text-neutral-300 leading-relaxed mb-6">
                        {synergyData.concept}
                      </p>

                      {/* Source Articles Display */}
                      {synergyData.source_articles && synergyData.source_articles.length > 0 && (
                          <div className="pt-6 border-t border-white/10">
                            <div className="flex items-center gap-2 mb-3 text-neutral-500">
                              <Link2 size={14} />
                              <span className="text-xs font-mono uppercase tracking-widest">Neural Connections (Sources)</span>
                            </div>
                            <div className="flex flex-wrap gap-3">
                              {synergyData.source_articles.map((article, idx) => (
                                  <Link
                                      key={idx}
                                      to={`/blog/${article.id}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="group/link flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium hover:bg-blue-500/20 hover:text-white hover:border-blue-500/40 transition-all"
                                  >
                                    <span>{article.title}</span>
                                    <ExternalLink size={10} className="opacity-50 group-hover/link:opacity-100 transition-opacity" />
                                  </Link>
                              ))}
                            </div>
                          </div>
                      )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center text-neutral-600"
                    >
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