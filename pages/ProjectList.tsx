import React, { useState, useMemo } from 'react';
import Card from '../components/Card';
import { PROJECTS } from '../data/ProjectData.ts';
import { Category } from '../types';

const ProjectList: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'All' | Category>('All');

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return PROJECTS;
    return PROJECTS.filter(project => project.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white">Work.</h1>
          <p className="text-neutral-400 text-xl max-w-2xl">
            A selection of projects across technology and experience design.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex p-1 rounded-full bg-neutral-900/50 border border-white/5 backdrop-blur-md self-start md:self-end">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredProjects.map(project => (
          <Card 
            key={project.id}
            type="project"
            id={project.id}
            title={project.title}
            subtitle={project.description}
            image={project.image}
            tags={project.techStack}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectList;