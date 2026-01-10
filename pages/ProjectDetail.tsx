import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PROJECTS } from '../data/ProjectData.ts';
import { ArrowLeft, Github, ExternalLink, Scan, Sparkles, Loader2, X, Network, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const project = PROJECTS.find(p => p.id === id);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [visionResult, setVisionResult] = useState('');
  const [showVisionPanel, setShowVisionPanel] = useState(false);

  // New state for Architecture Modal
  const [showArchModal, setShowArchModal] = useState(false);

  if (!project) {
    return (
        <div className="min-h-screen flex items-center justify-center text-white bg-black">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Project not found</h1>
            <Link to="/project" className="text-neutral-400 hover:text-white transition-colors">Back to Projects</Link>
          </div>
        </div>
    );
  }

  const isArchitecture = project.linkType === 'architecture';

  const handleVisionAnalysis = async () => {
    if (!project.image) return;

    setIsAnalyzing(true);
    setShowVisionPanel(true);
    setVisionResult('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      // Fetch the local image and convert to base64 for the API
      const response = await fetch(project.image);
      const blob = await response.blob();
      const base64Data = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(blob);
      });

      const imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: blob.type
        }
      };

      const prompt = `Act as a Senior UX Engineer and Tech Lead. 
      Analyze this UI screenshot of the project titled "${project.title}".
      
      1. **Visual & UX Analysis**: Describe the design aesthetic, layout choices, and user experience flow visible in the image.
      2. **Technical Deduction**: Based on the visual components (charts, 3D elements, real-time feeds, etc.), deduce likely technical challenges involved in building this frontend.
      
      Keep the tone analytical, professional, and appreciative. Keep it under 200 words.`;

      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [imagePart, { text: prompt }]
        }
      });

      setVisionResult(result.text || "Could not analyze image.");

    } catch (error) {
      console.error("Vision Error:", error);
      setVisionResult("Failed to analyze the visual interface. Please check API key or image source.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
      <div className="min-h-screen bg-black pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
          >
            <Link to="/project" className="inline-flex items-center text-neutral-500 hover:text-white mb-12 transition-colors group">
              <ArrowLeft size={20} className="mr-2 transform group-hover:-translate-x-1 transition-transform" /> Back to Projects
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="space-y-8"
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tighter leading-[1] break-words">
                {project.title}
              </h1>
              <p className="text-xl md:text-2xl text-neutral-400 leading-relaxed font-light">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-3 py-4">
                {project.techStack.map((tech, index) => (
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        key={tech}
                        className="px-4 py-2 rounded-full bg-white/5 text-neutral-200 text-sm font-medium border border-white/10"
                    >
                      {tech}
                    </motion.span>
                ))}
              </div>

              <div className="flex gap-4 pt-6">
                {isArchitecture ? (
                    <button
                        onClick={() => setShowArchModal(true)}
                        className="flex items-center gap-2 px-8 py-4 rounded-full font-bold transition-colors bg-blue-600 hover:bg-blue-500 text-white"
                    >
                      <Network size={20} /> View Architecture
                    </button>
                ) : (
                    <a
                        href={project.link || '#'}
                        target={project.link && project.link !== '#' ? "_blank" : "_self"}
                        rel={project.link && project.link !== '#' ? "noopener noreferrer" : ""}
                        className="flex items-center gap-2 px-8 py-4 rounded-full font-bold transition-colors bg-white hover:bg-neutral-200 text-black"
                    >
                      <ExternalLink size={20} /> Visit Site
                    </a>
                )}

                {project.sourceLink && (
                    <a
                        href={project.sourceLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-8 py-4 rounded-full bg-transparent text-white font-bold border border-white/20 hover:bg-white/10 transition-colors"
                    >
                      <Github size={20} /> Source Code
                    </a>
                )}
              </div>
            </motion.div>

            {/* Image Section with Vision Capability */}
            <div className="relative">
              <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-neutral-900 group"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 pointer-events-none" />
                <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-1000 ease-out"
                />

                {/* Vision Scan Button */}
                <button
                    onClick={handleVisionAnalysis}
                    className="absolute bottom-6 right-6 z-20 flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-medium hover:bg-white hover:text-black transition-all duration-300 shadow-lg group-hover:scale-105"
                >
                  <Scan size={16} /> Analyze UI/UX
                </button>
              </motion.div>

              {/* Analysis Result Panel (Overlay) */}
              <AnimatePresence>
                {showVisionPanel && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute top-4 left-4 right-4 bottom-4 z-30 bg-neutral-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 overflow-y-auto custom-scrollbar shadow-2xl"
                    >
                      <button
                          onClick={() => setShowVisionPanel(false)}
                          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/20 transition-colors"
                      >
                        <X size={20} className="text-white" />
                      </button>

                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                          <Scan size={24} className="text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">Vision Insight</h3>
                          <p className="text-xs text-neutral-400">Powered by Gemini Vision</p>
                        </div>
                      </div>

                      {isAnalyzing ? (
                          <div className="flex flex-col items-center justify-center h-48 space-y-4">
                            <Loader2 size={32} className="text-blue-400 animate-spin" />
                            <p className="text-neutral-400 animate-pulse text-sm">Scanning interface elements...</p>
                          </div>
                      ) : (
                          <div className="prose prose-invert prose-sm max-w-none">
                            <ReactMarkdown>{visionResult}</ReactMarkdown>
                          </div>
                      )}
                    </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-3xl mx-auto border-t border-neutral-900 pt-16"
          >
            <h3 className="text-2xl font-bold text-white mb-8">About the project</h3>
            <div className="prose prose-invert prose-lg text-neutral-400 font-light leading-relaxed">
              <ReactMarkdown
                  components={{
                    strong: ({node, ...props}) => <strong className="text-white font-semibold" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-xl font-bold text-white mt-8 mb-4" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-2 mt-4" {...props} />,
                    li: ({node, ...props}) => <li className="pl-1" {...props} />,
                  }}
              >
                {project.content || "Detailed case study content is being updated."}
              </ReactMarkdown>
            </div>
          </motion.div>
        </div>

        {/* Architecture Image Modal */}
        <AnimatePresence>
          {showArchModal && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowArchModal(false)}
                    className="absolute inset-0 bg-black/90 backdrop-blur-md"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative max-w-7xl w-full max-h-[90vh] flex flex-col items-center justify-center z-10 pointer-events-none"
                >
                  {/* Box Container */}
                  <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-2 w-full pointer-events-auto relative">
                    {/* Moved Close Button Inside */}
                    <button
                        onClick={() => setShowArchModal(false)}
                        className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-white/20 rounded-full text-white/70 hover:text-white transition-colors"
                    >
                      <X size={24} />
                    </button>

                    <div className="relative w-full h-[60vh] md:h-[80vh] bg-black/50 rounded-xl overflow-hidden flex items-center justify-center">
                      {project.architectureImage ? (
                          <img
                              src={project.architectureImage}
                              alt={`${project.title} Architecture`}
                              className="max-w-full max-h-full object-contain"
                          />
                      ) : (
                          <div className="text-center text-neutral-500">
                            <Network size={64} className="mx-auto mb-4 opacity-50" />
                            <p>Architecture Diagram Not Available</p>
                          </div>
                      )}
                    </div>
                    <div className="p-4 flex justify-between items-center text-sm text-neutral-400">
                      <span className="font-mono">System Architecture Diagram</span>
                      <a href={project.architectureImage} target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-2">
                        <ZoomIn size={14} /> Open Full Size
                      </a>
                    </div>
                  </div>
                </motion.div>
              </div>
          )}
        </AnimatePresence>
      </div>
  );
};

export default ProjectDetail;