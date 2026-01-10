import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Upload, RefreshCw, ScanFace, Image as ImageIcon } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const RetroTerminal: React.FC = () => {
  const [asciiArt, setAsciiArt] = useState<string>('');
  const [asciiImage, setAsciiImage] = useState<string | null>(null);
  const [visionAnalysis, setVisionAnalysis] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAsciiImage(reader.result as string);
        setAsciiArt('');
        setVisionAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    if (!asciiImage) return;
    setIsProcessing(true);

    try {
      // 1. Client-Side ASCII Generation (High Fidelity)
      await generateAsciiFromCanvas(asciiImage);

      // 2. Gemini Vision Analysis (Semantic Understanding)
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Data = asciiImage.split(',')[1];
      const mimeType = asciiImage.split(';')[0].split(':')[1];

      const prompt = `Analyze this image as if you are a futuristic cyberpunk terminal. 
      Provide a "System Scan" report.
      Output format strictly:
      [SUBJECT]: (Short description of person/object)
      [MOOD]: (Detected emotion or vibe)
      [THREAT_LEVEL]: (Humorous assessment, e.g. "Low", "Code Ninja", "Caffeine Overdose")
      
      Keep it brief, tech-noir style, uppercase.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType: mimeType } },
            { text: prompt }
          ]
        }
      });

      setVisionAnalysis(response.text || "NO DATA DETECTED");

    } catch (error) {
      console.error(error);
      setVisionAnalysis("SYSTEM_ERR: NEURAL LINK SEVERED");
    } finally {
      setIsProcessing(false);
    }
  };

  const generateAsciiFromCanvas = (imgSrc: string): Promise<void> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = imgSrc;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = 120;
        const aspectRatio = img.height / img.width;
        const height = Math.floor(width * aspectRatio * 0.55);

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        const chars = "@%#*+=-:. ";
        let art = "";

        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const offset = (y * width + x) * 4;
            const avg = (data[offset] + data[offset + 1] + data[offset + 2]) / 3;
            const charIndex = Math.floor((avg / 255) * (chars.length - 1));
            art += chars[charIndex];
          }
          art += "\n";
        }
        setAsciiArt(art);
        resolve();
      };
    });
  };

  return (
      <section id="terminal" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-b border-neutral-900">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Terminal size={20} className="text-green-500" />
              <span className="text-xs font-bold text-green-500 uppercase tracking-widest font-mono">Vision Processor</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Pixel to <span className="text-green-500 font-mono">ASCII</span>.
            </h2>
            <p className="text-neutral-400 text-lg mb-6 leading-relaxed">
              Upload any image to initialize the hybrid engine.
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3 text-sm text-neutral-300">
                <span className="font-mono text-green-500 font-bold mt-0.5">01.</span>
                <span><strong className="text-white">Canvas API</strong> renders the high-fidelity ASCII visual.</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-neutral-300">
                <span className="font-mono text-green-500 font-bold mt-0.5">02.</span>
                <span><strong className="text-white">Gemini Vision</strong> scans the image for a system report.</span>
              </li>
            </ul>

            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
            />

            <div className="flex gap-4">
              <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
              >
                <Upload size={18} /> Upload Target
              </button>

              {asciiImage && (
                  <button
                      onClick={processImage}
                      disabled={isProcessing}
                      className="flex items-center gap-2 px-6 py-3 rounded-full bg-green-600/20 text-green-400 border border-green-500/50 hover:bg-green-600/30 transition-colors font-mono disabled:opacity-50"
                  >
                    {isProcessing ? <RefreshCw className="animate-spin" size={18} /> : <ScanFace size={18} />}
                    INITIALIZE SCAN
                  </button>
              )}
            </div>

            <AnimatePresence>
              {asciiImage && (
                  <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-8"
                  >
                    <p className="text-xs text-neutral-500 mb-2 uppercase tracking-wide">Optical Sensor Feed</p>
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-white/10">
                      <img src={asciiImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ASCII Output Screen */}
          <div className="relative group">
            <div className="w-full aspect-[4/3] bg-[#0c0c0c] rounded-lg border border-green-900/30 p-4 md:p-6 overflow-hidden shadow-[0_0_30px_rgba(0,255,0,0.05)] flex flex-col relative font-mono">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 pointer-events-none bg-[length:100%_4px,3px_100%]"></div>

              <div className="flex justify-between items-center mb-4 border-b border-green-900/50 pb-2 z-20">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                </div>
                <span className="font-mono text-[10px] text-green-700">GEMINI_V3_ANALYSIS_TOOL</span>
              </div>

              <div className="flex-1 overflow-hidden relative z-20 flex flex-col">
                {isProcessing ? (
                    <div className="h-full flex flex-col items-center justify-center text-green-500 font-mono text-sm space-y-2">
                      <RefreshCw className="animate-spin" />
                      <span className="animate-pulse">DIGITIZING & SCANNING...</span>
                    </div>
                ) : asciiArt ? (
                    <div className="relative h-full flex flex-col">
                      <div className="flex-1 overflow-auto custom-scrollbar">
                        <pre className="text-[5px] md:text-[6px] leading-[3px] md:leading-[4px] text-green-500 whitespace-pre font-bold tracking-tighter transform scale-100 origin-top-left">
                          {asciiArt}
                      </pre>
                      </div>

                      {visionAnalysis && (
                          <div className="mt-2 pt-2 border-t border-green-900/50 text-[10px] md:text-xs text-green-400 font-mono leading-tight whitespace-pre-wrap animate-pulse">
                            {visionAnalysis}
                          </div>
                      )}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-green-900/40 font-mono">
                      <ImageIcon size={48} className="mb-4 opacity-50" />
                      <p className="text-xs text-center">AWAITING VISUAL DATA...</p>
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
  );
};

export default RetroTerminal;