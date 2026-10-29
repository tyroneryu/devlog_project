import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, GraduationCap, Calendar, Sparkles, Award } from 'lucide-react';

type TabFilter = 'all' | 'career' | 'education';

interface HistoryItem {
    id: string;
    title: string;
    role: string;
    period: string;
    tag: string;
    description: string;
    isCurrent?: boolean;
}

const HistorySection: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabFilter>('all');

    const careers: HistoryItem[] = [
        {
            id: 'c1',
            title: 'INTERCOM Convention Service, Inc.',
            role: 'PCO Coordinator',
            period: '2026.03 — Present',
            tag: 'Career',
            isCurrent: true,
            description: 'International convention coordination, client relations, and digital event operational management.'
        },
        {
            id: 'c2',
            title: 'OSCO MICE Contest',
            role: "Chungbuk Governor's Prize (1st Prize)",
            period: '2024.12.23',
            tag: 'Award',
            description: 'Grand prize proposal on smart convention logistics and automated participant experience platforms.'
        },
        {
            id: 'c3',
            title: 'Gyeonggi Tourism Organization',
            role: 'ITB Asia Singapore 2024 Dispatched Intern',
            period: '2024.10.18 — 2024.10.27',
            tag: 'Global MICE',
            description: 'Represented regional tourism pavilion and coordinated global B2B buyer matchmaking in Singapore.'
        },
        {
            id: 'c4',
            title: 'PremiumPass International',
            role: 'MICE Business Intern',
            period: '2024.07.15 — 2024.08.30',
            tag: 'Internship',
            description: 'VIP protocol management, logistics execution, and onsite conference operational support.'
        },
        {
            id: 'c5',
            title: 'Wrtn Prompthon',
            role: '2nd Prize Winner',
            period: '2023.11.09 — 2023.11.11',
            tag: 'Hackathon',
            description: 'Engineered specialized LLM prompt chaining architectures and context-retrieval pipelines.'
        }
    ];

    const educations: HistoryItem[] = [
        {
            id: 'e1',
            title: 'Hongik University',
            role: 'Computer Engineering & Business Administration',
            period: '2019.03 — 2026.08',
            tag: 'Degree',
            description: 'Dual major focusing on distributed software engineering, data structures, and enterprise strategy.'
        },
        {
            id: 'e2',
            title: 'IHHH (Institute of Hongik, Hacking, Honor)',
            role: 'PWNABLE / 1-day CVE Instructor',
            period: '2024.03 — 2025.08',
            tag: 'Security Mentorship',
            description: 'Conducted binary exploitation workshops, memory corruption analyses, and vulnerability research.'
        },
        {
            id: 'e3',
            title: 'HI-ARC (Hongik-Algorithm Research Club)',
            role: 'Dynamic Programming Instructor',
            period: '2024.03 — 2025.08',
            tag: 'Algorithms',
            description: 'Mentored undergraduate engineering students in computational problem-solving and graph algorithms.'
        },
        {
            id: 'e4',
            title: 'Gyeonggi MICE Academy',
            role: 'Specialized Program Graduate',
            period: '2024.06.15 — 2024.07.05',
            tag: 'Certification',
            description: 'Completed intensive executive coursework on international meeting planning and exhibition curation.'
        },
        {
            id: 'e5',
            title: 'Francis W. Parker School',
            role: 'Secondary Education',
            period: '2014.08 — 2017.02',
            tag: 'Education',
            description: 'International curriculum cultivating global perspectives and foundational bilingual fluency.'
        }
    ];

    return (
        <section id="history" className="py-28 md:py-36 px-6 md:px-12 max-w-7xl mx-auto border-b border-neutral-900">
            {/* Header Area */}
            <div className="flex flex-col items-center text-center mb-16 md:mb-20">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-neutral-400 text-xs font-mono uppercase tracking-[0.2em] mb-5"
                >
                    <Sparkles size={12} className="text-neutral-400" />
                    Chronology
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-5"
                >
                    Experience <span className="text-neutral-500 font-light">&</span> Education
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-sm md:text-base text-neutral-400 max-w-xl font-normal leading-relaxed"
                >
                    A curated timeline of industry leadership, engineering engagements, and academic milestones.
                </motion.p>

                {/* Filter Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.25 }}
                    className="flex items-center gap-1.5 p-1.5 mt-8 rounded-full bg-neutral-900/80 border border-white/[0.08] backdrop-blur-md"
                >
                    {(
                        [
                            { id: 'all', label: 'All Milestones' },
                            { id: 'career', label: 'Experience' },
                            { id: 'education', label: 'Education' }
                        ] as const
                    ).map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 relative ${
                                activeTab === tab.id
                                    ? 'text-white'
                                    : 'text-neutral-400 hover:text-white'
                            }`}
                        >
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeHistoryTab"
                                    className="absolute inset-0 bg-white/10 border border-white/15 rounded-full"
                                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10">{tab.label}</span>
                        </button>
                    ))}
                </motion.div>
            </div>

            {/* Timeline Columns Grid */}
            <div className={`grid gap-12 lg:gap-16 ${
                activeTab === 'all' ? 'lg:grid-cols-2' : 'max-w-3xl mx-auto'
            }`}>
                {/* Career / Experience Column */}
                {(activeTab === 'all' || activeTab === 'career') && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="flex flex-col"
                    >
                        {/* Column Header */}
                        <div className="flex items-center justify-between pb-6 mb-8 border-b border-white/[0.08]">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white">
                                    <Briefcase size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold tracking-tight text-white">Experience & Career</h3>
                                    <p className="text-xs text-neutral-500 font-mono">Professional engagements & awards</p>
                                </div>
                            </div>
                            <span className="text-xs font-mono text-neutral-400 bg-white/[0.04] px-2.5 py-1 rounded-full border border-white/[0.06]">
                                0{careers.length}
                            </span>
                        </div>

                        {/* Timeline Rail */}
                        <div className="relative pl-6 md:pl-8 border-l border-white/[0.08] space-y-8 ml-3 md:ml-4">
                            {careers.map((item, idx) => (
                                <TimelineCard key={item.id} item={item} index={idx} />
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Education / Activity Column */}
                {(activeTab === 'all' || activeTab === 'education') && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="flex flex-col"
                    >
                        {/* Column Header */}
                        <div className="flex items-center justify-between pb-6 mb-8 border-b border-white/[0.08]">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white">
                                    <GraduationCap size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold tracking-tight text-white">Education & Leadership</h3>
                                    <p className="text-xs text-neutral-500 font-mono">Academic roots & mentorship</p>
                                </div>
                            </div>
                            <span className="text-xs font-mono text-neutral-400 bg-white/[0.04] px-2.5 py-1 rounded-full border border-white/[0.06]">
                                0{educations.length}
                            </span>
                        </div>

                        {/* Timeline Rail */}
                        <div className="relative pl-6 md:pl-8 border-l border-white/[0.08] space-y-8 ml-3 md:ml-4">
                            {educations.map((item, idx) => (
                                <TimelineCard key={item.id} item={item} index={idx} />
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

interface TimelineCardProps {
    item: HistoryItem;
    index: number;
}

const TimelineCard: React.FC<TimelineCardProps> = ({ item, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            className="group relative"
        >
            {/* Timeline Node Bullet */}
            <div className="absolute -left-[31px] md:-left-[39px] top-6 flex items-center justify-center">
                <div className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 ${
                    item.isCurrent
                        ? 'bg-emerald-500 border-black shadow-[0_0_12px_rgba(16,185,129,0.8)]'
                        : 'bg-black border-neutral-500 group-hover:border-white group-hover:scale-125'
                }`} />
                {item.isCurrent && (
                    <span className="absolute w-6 h-6 rounded-full bg-emerald-500/30 animate-ping -z-10" />
                )}
            </div>

            {/* Card Body */}
            <div className="relative p-6 rounded-2xl bg-neutral-900/40 border border-white/[0.07] hover:border-white/20 transition-all duration-300 backdrop-blur-md hover:bg-neutral-900/80 hover:-translate-y-0.5">
                {/* Subtle Hover Gradient Layer */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.04] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative z-10 flex flex-col gap-2">
                    {/* Top Row: Period & Badge */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400">
                            <Calendar size={12} className="text-neutral-500" />
                            {item.period}
                        </span>

                        <div className="flex items-center gap-2">
                            {item.isCurrent && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    Active
                                </span>
                            )}
                            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 rounded-md">
                                {item.tag}
                            </span>
                        </div>
                    </div>

                    {/* Title & Role */}
                    <h4 className="text-lg md:text-xl font-bold tracking-tight text-white group-hover:text-white transition-colors mt-1">
                        {item.title}
                    </h4>

                    <p className="text-sm font-medium text-neutral-300">
                        {item.role}
                    </p>

                    {/* Description */}
                    {item.description && (
                        <p className="text-xs md:text-sm text-neutral-400 mt-2 font-light leading-relaxed">
                            {item.description}
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default HistorySection;

