import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowUpRight } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import Card from './Card';
import { PROJECTS } from '../data/ProjectData.ts';

const FeaturedProjects: React.FC = () => {
    const featuredProjects = useMemo(() => {
        return [...PROJECTS].sort(() => 0.5 - Math.random()).slice(0, 3);
    }, []);

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.215, 0.61, 0.355, 1] } }
    };

    return (
        <section className="relative py-32 px-6 md:px-12 max-w-7xl mx-auto border-b border-neutral-900 overflow-hidden">
            {/* Ambient Background Light (Blue/Indigo Theme) */}
            <div className="absolute top-[-20%] right-[-10%] -z-10 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse duration-[5000ms]" />
            <div className="absolute bottom-[-10%] left-[-10%] -z-10 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="relative z-10 group/section"
            >
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <motion.div variants={itemVariants} className="cursor-default">
                        <span className="text-blue-500 font-mono text-xs tracking-widest uppercase mb-2 block transition-opacity group-hover/section:opacity-80">Portfolio</span>
                        <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter">
                            Selected <span className="text-neutral-500 group-hover/section:text-blue-500 transition-colors duration-300">Works.</span>
                        </h2>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Link
                            to="/project"
                            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white hover:text-black hover:border-white transition-all duration-300 group/btn"
                        >
                            <span className="text-sm font-bold">View all projects</span>
                            <ArrowUpRight size={16} className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredProjects.map((project) => (
                        <motion.div key={project.id} variants={itemVariants} className="h-full">
                            <Card
                                type="project"
                                id={project.id}
                                title={project.title}
                                subtitle={project.description}
                                image={project.image}
                                tags={project.techStack}
                            />
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
};

export default FeaturedProjects;