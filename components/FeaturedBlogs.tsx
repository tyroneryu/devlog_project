import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Loader2, FileWarning, ArrowUpRight } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import Card from './Card';
import { useBlogData } from '../hooks/useBlogData';

const FeaturedBlogs: React.FC = () => {
    const { posts, loading, error } = useBlogData();

    const featuredBlogs = useMemo(() => {
        if (!posts) return [];
        return [...posts].slice(0, 3);
    }, [posts]);

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

    // Loading Skeleton
    if (loading) {
        return (
            <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto border-b border-neutral-900">
                <div className="flex items-center gap-4 text-neutral-500">
                    <Loader2 className="animate-spin" /> Loading posts...
                </div>
            </section>
        );
    }

    // Error or Empty State
    if (error || featuredBlogs.length === 0) {
        return (
            <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto border-b border-neutral-900">
                <div className="flex justify-between items-end mb-16">
                    <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter">Latest Thoughts</h2>
                </div>
                <div className="flex flex-col items-center justify-center p-12 border border-white/5 rounded-2xl bg-neutral-900/50 text-neutral-400 gap-4">
                    <FileWarning size={32} />
                    <p>{error ? "Could not connect to backend." : "No posts found in the /posts folder."}</p>
                    <p className="text-xs font-mono bg-black p-2 rounded border border-white/10">
                        Tip: Run 'npm run server' and add .md files to 'posts/'
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="relative py-32 px-6 md:px-12 max-w-7xl mx-auto border-b border-neutral-900 overflow-hidden">
            {/* Ambient Background Light (Purple/Pink Theme) */}
            <div className="absolute top-1/4 left-[-10%] -z-10 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse duration-[6000ms]" />
            <div className="absolute bottom-[-10%] right-[-10%] -z-10 w-[600px] h-[600px] bg-pink-600/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="relative z-10 group/section"
            >
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <motion.div variants={itemVariants} className="cursor-default">
                        <span className="text-purple-500 font-mono text-xs tracking-widest uppercase mb-2 block transition-opacity group-hover/section:opacity-80">Insights</span>
                        <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter">
                            Latest <span className="text-neutral-500 group-hover/section:text-purple-500 transition-colors duration-300">Thoughts.</span>
                        </h2>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Link
                            to="/blog"
                            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white hover:text-black hover:border-white transition-all duration-300 group/btn"
                        >
                            <span className="text-sm font-bold">Read all articles</span>
                            <ArrowUpRight size={16} className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredBlogs.map(blog => (
                        <motion.div key={blog.id} variants={itemVariants} className="h-full">
                            <Card
                                type="blog"
                                id={blog.id}
                                title={blog.title}
                                subtitle={blog.excerpt}
                                date={blog.date}
                                tags={blog.tags}
                            />
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
};

export default FeaturedBlogs;