import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Command, Search, CornerDownLeft, Hash, ArrowRight, Loader2 } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

const NeuralPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const navigate = useNavigate();

  // Toggle with Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const executeCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsThinking(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      const prompt = `You are the navigation controller for a portfolio website.
      Map the user's natural language request to a specific ACTION and TARGET.
      
      Available Targets (IDs/Paths):
      - Routes: "/", "/blog", "/project", "/admin", "/lab/logo"
      - Sections on Home: "intro", "synergy", "grounding", "terminal"
      - External: "github", "email"

      User Input: "${input}"

      Return JSON strictly matching this schema:
      {
        "action": "NAVIGATE" | "SCROLL" | "EXTERNAL",
        "target": string,
        "reasoning": string
      }
      
      Examples:
      "Show me your work" -> {"action": "NAVIGATE", "target": "/project"}
      "I want to hire you" -> {"action": "EXTERNAL", "target": "email"}
      "Go to the AI terminal" -> {"action": "SCROLL", "target": "terminal"}
      "Generate a logo" or "AI Lab" -> {"action": "NAVIGATE", "target": "/lab/logo"}
      "Back to top" -> {"action": "SCROLL", "target": "hero"}
      "Login" or "Admin" -> {"action": "NAVIGATE", "target": "/admin"}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              action: { type: Type.STRING },
              target: { type: Type.STRING },
              reasoning: { type: Type.STRING }
            }
          }
        }
      });

      if (response.text) {
        const result = JSON.parse(response.text);
        handleAction(result);
      }

    } catch (error) {
      console.error(error);
      // Fallback or error shake animation could go here
    } finally {
      setIsThinking(false);
      setInput('');
    }
  };

  const handleAction = (command: { action: string, target: string }) => {
    setIsOpen(false);

    if (command.action === 'NAVIGATE') {
      navigate(command.target);
    } else if (command.action === 'SCROLL') {
      // If we are not home, go home first, then scroll
      if (window.location.hash !== '#/') {
        navigate('/');
        setTimeout(() => scrollToId(command.target), 100);
      } else {
        scrollToId(command.target);
      }
    } else if (command.action === 'EXTERNAL') {
      if (command.target === 'email') window.location.href = 'mailto:hello@example.com';
      if (command.target === 'github') window.open('https://github.com', '_blank');
    }
  };

  const scrollToId = (id: string) => {
    // Map abstract targets to real DOM IDs if needed, or assume IDs match section components
    // We need to add IDs to the sections in Home.tsx for this to work perfectly.
    // For now, let's assume we scroll to sections by partial matching or known IDs.

    // Simple ID mapping strategy for the demo
    const element = document.getElementById(id) || document.querySelector(`section[id="${id}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback: Try to find by text content or loose match?
      // For robustness, let's just scroll top if 'hero'
      if (id === 'hero') window.scrollTo({ top: 0, behavior: 'smooth'});
    }
  };

  return (
      <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4"
            >
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

              <motion.div
                  initial={{ scale: 0.9, y: -20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: -20 }}
                  className="relative w-full max-w-lg bg-[#111] border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
              >
                <div className="flex items-center px-4 py-4 border-b border-white/10">
                  <Command className="text-neutral-500 mr-3" size={20} />
                  <form onSubmit={executeCommand} className="flex-1">
                    <input
                        autoFocus
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask the system to navigate... (e.g. 'Go to the AI Terminal')"
                        className="w-full bg-transparent text-white text-lg placeholder-neutral-600 focus:outline-none"
                    />
                  </form>
                  {isThinking ? (
                      <Loader2 className="animate-spin text-blue-400" size={20} />
                  ) : (
                      <div className="flex gap-2">
                   <span className="hidden md:inline-flex items-center gap-1 text-[10px] bg-white/10 px-2 py-1 rounded text-neutral-400 font-mono">
                      ESC
                   </span>
                        <button onClick={executeCommand} className="bg-white text-black p-1 rounded-md hover:bg-neutral-200 transition-colors">
                          <CornerDownLeft size={16} />
                        </button>
                      </div>
                  )}
                </div>

                <div className="bg-black/50 px-4 py-3 text-[10px] text-neutral-500 font-mono flex justify-between uppercase tracking-wider">
                  <span>Neural Navigation Active</span>
                  <span>Powered by Gemini 3.0</span>
                </div>

                {!input && (
                    <div className="p-2 space-y-1">
                      {[
                        { label: 'View Latest Projects', cmd: 'Go to projects' },
                        { label: 'Read Technical Blogs', cmd: 'Go to blog' },
                        { label: 'Generate Brand Logo (AI)', cmd: 'Go to Logo Lab' },
                        { label: 'Contact Me', cmd: 'Send an email' },
                        { label: 'System Access', cmd: 'Admin Login' },
                      ].map((item, idx) => (
                          <button
                              key={idx}
                              onClick={() => { setInput(item.cmd); }}
                              className="w-full text-left px-3 py-2 rounded-lg text-sm text-neutral-400 hover:text-white hover:bg-white/5 flex items-center justify-between group transition-colors"
                          >
                            <span className="flex items-center gap-2">
                                <Search size={14} /> {item.label}
                            </span>
                            <span className="opacity-0 group-hover:opacity-100 text-[10px] bg-white/10 px-2 py-0.5 rounded text-neutral-300">
                                {item.cmd}
                            </span>
                          </button>
                      ))}
                    </div>
                )}
              </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
  );
};

export default NeuralPalette;