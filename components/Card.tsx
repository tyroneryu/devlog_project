import React from 'react';
import { ArrowRight, Calendar, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface CardProps {
  type: 'blog' | 'project';
  id: string;
  title: string;
  subtitle: string;
  image?: string;
  tags?: string[];
  date?: string;
}

const Card: React.FC<CardProps> = ({ type, id, title, subtitle, image, tags, date }) => {
  const isProject = type === 'project';
  const path = isProject ? `/project/${id}` : `/blog/${id}`;

  // Dynamic Theme Colors based on Type
  const themeClasses = isProject
      ? {
        border: 'hover:border-blue-500/50',
        bg: 'hover:bg-blue-500/10',
        shadow: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]',
        title: '', // Keep title white, no hover effect
        subtitle: 'group-hover:text-blue-200/70',
        meta: 'text-neutral-500 group-hover:text-blue-400',
        dot: 'bg-neutral-500 group-hover:bg-blue-400',
        gradient: 'from-blue-500/20 to-transparent',
        tag: 'group-hover:border-blue-500/30 group-hover:text-blue-300 group-hover:bg-blue-500/10',
        icon: 'text-white group-hover:text-blue-400'
      }
      : {
        border: 'hover:border-purple-500/50',
        bg: 'hover:bg-purple-500/10',
        shadow: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]',
        title: '', // Keep title white, no hover effect
        subtitle: 'group-hover:text-purple-200/70',
        meta: 'text-neutral-500 group-hover:text-purple-400',
        dot: 'bg-neutral-500 group-hover:bg-purple-400',
        gradient: 'from-purple-500/20 to-transparent',
        tag: 'group-hover:border-purple-500/30 group-hover:text-purple-300 group-hover:bg-purple-500/10',
        icon: 'text-white group-hover:text-purple-400'
      };

  return (
      <Link to={path} className="block h-full">
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`group relative flex flex-col gap-4 p-5 rounded-3xl bg-white/5 border border-white/5 transition-all duration-300 h-full backdrop-blur-sm overflow-hidden ${themeClasses.border} ${themeClasses.bg} ${themeClasses.shadow}`}
        >
          {/* Hover Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${themeClasses.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

          {image && (
              <div className="w-full aspect-video overflow-hidden rounded-2xl mb-2 relative">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Project Indicator Badge */}
                {isProject && (
                    <div className="absolute top-3 right-3 z-20 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full group-hover:border-white/20 transition-colors">
                      <ArrowRight className={`w-4 h-4 -rotate-45 group-hover:rotate-0 transition-all duration-300 ${themeClasses.icon}`} />
                    </div>
                )}
              </div>
          )}

          <div className="flex flex-col gap-3 flex-grow relative z-10">
            <div className="flex justify-between items-start">
            <span className={`flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase transition-colors duration-300 ${themeClasses.meta}`}>
              {isProject ? (
                  <>
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse transition-colors duration-300 ${themeClasses.dot}`} /> Project
                  </>
              ) : (
                  <>
                    <Calendar size={10} /> {date}
                  </>
              )}
            </span>
            </div>

            <h3 className={`text-xl md:text-2xl font-bold text-white transition-colors duration-300 leading-tight ${themeClasses.title}`}>
              {title}
            </h3>

            <p className={`text-sm text-neutral-400 line-clamp-2 leading-relaxed transition-colors duration-300 ${themeClasses.subtitle}`}>
              {subtitle}
            </p>

            {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-auto pt-4">
                  {tags.slice(0, 3).map(tag => (
                      <span key={tag} className={`flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full bg-white/5 text-neutral-400 border border-white/5 transition-all duration-300 ${themeClasses.tag}`}>
                  {tag}
                </span>
                  ))}
                  {tags.length > 3 && (
                      <span className="text-[10px] px-2 py-1 text-neutral-500">+{tags.length - 3}</span>
                  )}
                </div>
            )}
          </div>
        </motion.div>
      </Link>
  );
};

export default Card;