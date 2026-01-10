import React, { useState, useMemo } from 'react';
import Card from '../components/Card';
import { useBlogData } from '../hooks/useBlogData';
import { Category } from '../types';
import { Sparkles, Search, X, Loader2, ArrowRight, ServerCrash } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const BlogList: React.FC = () => {
  const { posts: BLOGS, loading, error } = useBlogData();
  const [activeCategory, setActiveCategory] = useState<'All' | Category>('All');
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const filteredBlogs = useMemo(() => {
    if (activeCategory === 'All') return BLOGS;
    return BLOGS.filter(blog => blog.category === activeCategory);
  }, [activeCategory, BLOGS]);

  const handleAiSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsAiLoading(true);
    setAnswer('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const blogContext = BLOGS.map(post => 
        `ID: ${post.id}\nTitle: ${post.title}\nCategory: ${post.category}\nContent Summary: ${post.content.substring(0, 800)}...`
      ).join('\n\n---\n\n');

      const systemInstruction = `You are an AI assistant for a portfolio blog. Answer based on context.`;
      const prompt = `Context:\n${blogContext}\n\nUser Question: ${query}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { systemInstruction }
      });

      setAnswer(response.text || "No response generated.");

    } catch (error) {
      console.error("AI Error:", error);
      setAnswer("AI connection failed.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white">Blog.</h1>
          <p className="text-neutral-400 text-xl max-w-2xl">
            Served dynamically from the Node.js backend.
          </p>
        </div>

        <div className="flex flex-col md:items-end gap-4 self-start md:self-end">
          {!isAiOpen && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setIsAiOpen(true)}
              disabled={loading || !!error}
              className="group flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-purple-500/30 text-purple-200 hover:text-white hover:border-purple-400 transition-all duration-300 disabled:opacity-50"
            >
              <Sparkles size={16} className="text-purple-400 group-hover:animate-pulse" />
              <span className="text-sm font-medium">Ask AI about my articles</span>
            </motion.button>
          )}

          <div className="flex p-1 rounded-full bg-neutral-900/50 border border-white/5 backdrop-blur-md">
            {(['All', 'Dev', 'MICE'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat 
                    ? 'bg-white text-black shadow-lg' 
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {cat === 'All' ? 'All' : cat === 'Dev' ? 'Development' : 'MICE & Events'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Panel (Omitted for brevity, logic same as before but using state) */}
      <AnimatePresence>
        {isAiOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginBottom: 0 }}
            animate={{ height: 'auto', opacity: 1, marginBottom: 48 }}
            exit={{ height: 0, opacity: 0, marginBottom: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-neutral-900/40 border border-purple-500/20 rounded-2xl p-6 md:p-8 backdrop-blur-sm relative">
              <button onClick={() => setIsAiOpen(false)} className="absolute top-4 right-4 text-neutral-500 hover:text-white"><X size={20} /></button>
              <form onSubmit={handleAiSearch} className="relative mb-8 mt-6">
                  <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ask Gemini..." className="w-full bg-black/50 border border-white/10 rounded-xl px-6 py-4 pr-14 text-white focus:outline-none focus:border-purple-500/50" />
                  <button type="submit" disabled={isAiLoading} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/10 text-white hover:bg-purple-600">{isAiLoading ? <Loader2 className="animate-spin" /> : <ArrowRight />}</button>
              </form>
              {answer && <div className="prose prose-invert max-w-none bg-black/30 p-6 rounded-xl"><ReactMarkdown>{answer}</ReactMarkdown></div>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content State Handling */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center text-neutral-500 gap-4">
          <Loader2 size={32} className="animate-spin" />
          <p>Connecting to backend...</p>
        </div>
      ) : error ? (
        <div className="h-64 flex flex-col items-center justify-center text-red-400 gap-4 border border-red-500/20 rounded-2xl bg-red-500/5">
          <ServerCrash size={32} />
          <p>{error}</p>
          <p className="text-xs text-neutral-500">Make sure to run <code>npm run server</code></p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.length > 0 ? filteredBlogs.map(blog => (
            <Card 
              key={blog.id}
              type="blog"
              id={blog.id}
              title={blog.title}
              subtitle={blog.excerpt}
              date={blog.date}
              tags={blog.tags}
            />
          )) : (
            <div className="col-span-full text-center text-neutral-500 py-12">
              No posts found. Add .md files to the /posts folder.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogList;