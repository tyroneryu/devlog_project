import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, MapPin, Search, RefreshCw, Mic, MicOff } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';

const GroundingHub: React.FC = () => {
  const [groundingQuery, setGroundingQuery] = useState('');
  const [groundingResult, setGroundingResult] = useState<{text: string, chunks: any[]} | null>(null);
  const [isGroundingLoading, setIsGroundingLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleGroundingSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groundingQuery.trim()) return;

    setIsGroundingLoading(true);
    setGroundingResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Using gemini-2.5-flash for Maps support as per guidelines
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash", 
        contents: groundingQuery,
        config: {
          tools: [{ googleSearch: {} }, { googleMaps: {} }],
        },
      });

      const text = response.text || "No data retrieved.";
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

      setGroundingResult({ text, chunks });

    } catch (error) {
      console.error(error);
      setGroundingResult({ text: "Connection to global satellites failed. Please try again.", chunks: [] });
    } finally {
      setIsGroundingLoading(false);
    }
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Voice input is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'en-US'; // Default to English, could be dynamic
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setGroundingQuery(transcript);
      setIsListening(false);
      // Optional: Auto-submit after voice
      // handleGroundingSearch({ preventDefault: () => {} } as any);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <section id="grounding" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-b border-neutral-900">
      <div className="relative rounded-3xl overflow-hidden bg-neutral-900 border border-white/5">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-purple-900/20" />
          
          <div className="relative z-10 p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center mb-12">
                <div className="inline-flex items-center gap-2 text-blue-400 mb-4 bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20">
                  <Globe size={14} className="animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-widest">Global Intelligence Grid</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                  Real-time <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Grounding</span>.
                </h2>
                <p className="text-neutral-400 text-lg">
                  As a hybrid professional, I need live data. Use this terminal to find 
                  <strong> MICE venues</strong> or <strong>Tech trends</strong> via Google Search & Maps.
                </p>
            </div>

            <div className="max-w-2xl mx-auto">
                <form onSubmit={handleGroundingSearch} className="relative group mb-12">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl group-hover:opacity-100 opacity-50 transition-opacity" />
                  <div className={`relative flex items-center bg-black/80 backdrop-blur-xl border rounded-full p-2 transition-all duration-300 ${isListening ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'border-white/10 focus-within:border-blue-500/50'}`}>
                      
                      <button
                        type="button"
                        onClick={toggleVoiceInput}
                        className={`p-3 rounded-full transition-all duration-300 ${
                          isListening 
                            ? 'bg-red-500/20 text-red-500 animate-pulse' 
                            : 'bg-transparent text-neutral-400 hover:text-white'
                        }`}
                        title="Toggle Voice Input"
                      >
                        {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                      </button>

                      <input 
                        type="text" 
                        value={groundingQuery}
                        onChange={(e) => setGroundingQuery(e.target.value)}
                        placeholder={isListening ? "Listening..." : "e.g. 'Convention centers in Seoul' or 'React 19 release date'"}
                        className="flex-1 bg-transparent border-none text-white px-4 py-3 focus:outline-none placeholder-neutral-600"
                      />
                      
                      <button 
                        type="submit"
                        disabled={isGroundingLoading}
                        className="p-3 rounded-full bg-white text-black hover:bg-neutral-200 transition-colors disabled:opacity-50"
                      >
                        {isGroundingLoading ? <RefreshCw className="animate-spin" size={20} /> : <Search size={20} />}
                      </button>
                  </div>
                  {isListening && (
                    <p className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-red-400 font-mono animate-pulse">
                      ● REC - Speak now
                    </p>
                  )}
                </form>

                <AnimatePresence>
                  {groundingResult && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-black/40 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md"
                      >
                        <div className="prose prose-invert prose-sm max-w-none mb-6">
                            <ReactMarkdown>{groundingResult.text}</ReactMarkdown>
                        </div>

                        {/* Grounding Source Cards */}
                        {groundingResult.chunks.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 border-t border-white/5 pt-6">
                              {groundingResult.chunks.map((chunk, idx) => {
                                  if (chunk.web) {
                                    return (
                                        <a key={idx} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group">
                                          <Globe size={16} className="text-blue-400 mt-1 flex-shrink-0" />
                                          <div className="overflow-hidden">
                                              <p className="text-xs font-bold text-neutral-200 truncate group-hover:text-blue-300">{chunk.web.title}</p>
                                              <p className="text-[10px] text-neutral-500 truncate">{chunk.web.uri}</p>
                                          </div>
                                        </a>
                                    );
                                  }
                                  if (chunk.maps) {
                                    return (
                                        <a key={idx} href={chunk.maps.googleMapsUri} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group">
                                          <MapPin size={16} className="text-red-400 mt-1 flex-shrink-0" />
                                          <div className="overflow-hidden">
                                              <p className="text-xs font-bold text-neutral-200 truncate group-hover:text-red-300">{chunk.maps.title}</p>
                                              <p className="text-[10px] text-neutral-500 truncate">{chunk.maps.address}</p>
                                          </div>
                                        </a>
                                    );
                                  }
                                  return null;
                              })}
                            </div>
                        )}
                      </motion.div>
                  )}
                </AnimatePresence>
            </div>
          </div>
      </div>
    </section>
  );
};

export default GroundingHub;