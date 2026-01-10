import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, ExternalLink, Calendar, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Post, Project } from '../types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Post | Project | null;
  type: 'blog' | 'project' | null;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, data, type }) => {
  if (!data || !isOpen) return null;

  const isProject = type === 'project';
  const projectData = isProject ? (data as Project) : null;
  const blogData = !isProject ? (data as Post) : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-[#111] border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white/70 hover:text-white hover:bg-white/10 transition-all"
            >
              <X size={20} />
            </button>

            {/* Scrollable Area */}
            <div className="overflow-y-auto custom-scrollbar flex-1">
              
              {/* Project Header Image */}
              {isProject && projectData?.image && (
                <div className="w-full h-64 md:h-96 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent z-10" />
                  <img
                    src={projectData.image}
                    alt={projectData.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className={`p-6 md:p-12 ${isProject ? '-mt-20 relative z-20' : ''}`}>
                
                {/* Header Info */}
                <div className="mb-8">
                  {!isProject && blogData && (
                    <div className="flex items-center gap-4 text-sm text-neutral-400 mb-4">
                      <span className="flex items-center gap-1"><Calendar size={14} /> {blogData.date}</span>
                      <span className="w-1 h-1 rounded-full bg-neutral-600" />
                      <div className="flex gap-2">
                        {blogData.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 rounded-full bg-white/5 text-xs border border-white/5">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                    {data.title}
                  </h2>

                  {isProject && projectData && (
                    <div className="flex flex-wrap gap-3 mb-6">
                      {projectData.techStack.map((tech) => (
                        <span key={tech} className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {isProject && (
                    <div className="flex gap-4 mt-6">
                      <a href="#" className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-semibold hover:bg-neutral-200 transition-colors">
                        <ExternalLink size={18} /> Visit Site
                      </a>
                      <a href="#" className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors">
                        <Github size={18} /> Source
                      </a>
                    </div>
                  )}
                </div>

                <div className="w-full h-[1px] bg-neutral-800 mb-8" />

                {/* Content Body */}
                <div className="text-lg text-neutral-300 leading-relaxed">
                  {isProject ? (
                    <p>{projectData?.description}</p>
                  ) : (
                    <div className="markdown-content">
                      <ReactMarkdown>{blogData?.content || ''}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
