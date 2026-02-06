import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Calendar } from 'lucide-react';

type CategoryType = 'career' | 'activity';

interface HistoryItem {
    id: string;
    title: string;
    role?: string;
    period: string;
    description?: string;
    type: CategoryType;
}

interface CardProps {
    item: HistoryItem;
    align: 'left' | 'right';
    onHover: (category: CategoryType | null) => void;
}

const Card: React.FC<CardProps> = ({ item, align, onHover }) => {
    const isCareer = item.type === 'career';
    const hoverBorderColor = isCareer ? 'hover:border-red-500/40' : 'hover:border-blue-500/40';
    const hoverBgColor = isCareer ? 'hover:bg-red-500/5' : 'hover:bg-blue-500/5';
    const hoverTitleColor = isCareer ? 'group-hover:text-red-400' : 'group-hover:text-blue-400';
    const hoverDescColor = isCareer ? 'group-hover:text-red-200/70' : 'group-hover:text-blue-200/70';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, x: align === 'left' ? -20 : 20 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className={`relative mb-12 ${align === 'left' ? 'md:text-right md:pr-12 pl-8 md:pl-0' : 'md:text-left md:pl-12 pl-8'}`}
            onMouseEnter={() => onHover(item.type)}
            onMouseLeave={() => onHover(null)}
        >
            {/* Desktop Timeline Dot */}
            <div className={`hidden md:block absolute top-6 w-4 h-4 rounded-full border-2 border-black z-10 transition-colors duration-500
        ${align === 'left' ? '-right-[9px]' : '-left-[9px]'}
        ${isCareer ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]' : 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]'}
      `} />

            {/* Mobile Timeline Dot */}
            <div className={`md:hidden absolute top-6 left-[1px] w-3 h-3 rounded-full border-2 border-black z-10
        ${isCareer ? 'bg-red-500' : 'bg-blue-500'}
      `} />

            {/* Card Content */}
            <div className={`group relative p-6 rounded-2xl bg-white/5 border border-white/5 transition-all duration-300 backdrop-blur-sm cursor-default
        ${align === 'left' ? 'md:hover:-translate-x-1' : 'md:hover:translate-x-1'}
        ${hoverBorderColor} ${hoverBgColor}
      `}>
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none
           bg-gradient-to-r ${isCareer ? 'from-red-500/10 to-transparent' : 'from-blue-500/10 to-transparent'}
        `} />

                <div className={`flex flex-col gap-1 ${align === 'left' ? 'md:items-end' : 'md:items-start'} relative z-10`}>
          <span className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-500 bg-black/30 px-2 py-1 rounded border border-white/5 mb-2">
            <Calendar size={10} /> {item.period}
          </span>
                    <h4 className={`text-xl font-bold text-white transition-colors duration-300 ${hoverTitleColor}`}>
                        {item.title}
                    </h4>
                    <p className={`text-sm font-semibold tracking-wide ${isCareer ? 'text-red-400' : 'text-blue-400'}`}>
                        {item.role}
                    </p>
                    {item.description && (
                        <p className={`text-sm text-neutral-400 mt-2 font-light leading-relaxed transition-colors duration-300 ${hoverDescColor}`}>
                            {item.description}
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

const HistorySection: React.FC = () => {
    const [focusedCategory, setFocusedCategory] = useState<CategoryType | null>(null);

    const handleHover = (category: CategoryType | null) => {
        setFocusedCategory(category);
    };

    const isActivityFocused = focusedCategory === 'activity';
    const isCareerFocused = focusedCategory === 'career';

    // Left Title (Studies) - Matches Activity/Blue
    const leftTitleClass = `flex-1 text-right transition-colors duration-500 ease-in-out ${
        isActivityFocused
            ? 'text-blue-400'
            : isCareerFocused
                ? 'text-neutral-800 blur-[1px]' // Dimmed when Career is focused
                : 'text-white' // Default White
    }`;

    // Right Title (Careers) - Matches Career/Red
    const rightTitleClass = `flex-1 text-left transition-colors duration-500 ease-in-out ${
        isCareerFocused
            ? 'text-red-400'
            : isActivityFocused
                ? 'text-neutral-800 blur-[1px]' // Dimmed when Activity is focused
                : 'text-neutral-400' // Default Light Gray
    }`;

    const activityHeaderClass = `flex items-center gap-3 transition-colors duration-300 ${
        isActivityFocused ? 'text-blue-400' : 'text-white'
    }`;

    const careerHeaderClass = `flex items-center gap-3 transition-colors duration-300 ${
        isCareerFocused ? 'text-red-400' : 'text-white'
    }`;

    // Data with explicit 'type' added
    const careers: HistoryItem[] = [
        {
            id: 'c1',
            title: 'OSCO MICE Contest',
            role: 'Chungbuk-Governer Prize (1st Prize)',
            period: '2024.12.23',
            type: 'career'
        },
        {
            id: 'c2',
            title: 'Gyeonggi Tourism Organization',
            role: 'ITB Asia Singapore 2024 Dispatched Intern',
            period: '2024.10.18 - 2024.10.27',
            type: 'career'
        },
        {
            id: 'c3',
            title: 'PremiumPass International',
            role: 'MICE Business Intern',
            period: '2024.07.15 - 2024.08.30',
            type: 'career'
        },
        {
            id: 'c4',
            title: 'Wrtn Prompthon',
            role: "2nd Prize",
            period: '2023.11.09 - 11.11',
            type: 'career'
        }
    ];

    const activities: HistoryItem[] = [
        {
            id: 'e1',
            title: 'Hongik University',
            role: 'Business Management & Computer Engineering',
            period: '2019.03 - 2026.02',
            type: 'activity'
        },
        {
            id: 'e2',
            title: 'IHHH (Institute of Hongik, Hacking, Honor)',
            role: 'PWNABLE / 1-day CVE Instructor',
            period: '2024.03 - 2025.08',
            type: 'activity'
        },
        {
            id: 'e3',
            title: 'HI-ARC (HongIk-Algorithm Research Club',
            role: 'Dyanmic Programming Instructor',
            period: '2024.03 - 2025.08',
            type: 'activity'
        },
        {
            id: 'e4',
            title: 'Gyeonggi MICE Academy',
            role: 'Graduate Student',
            period: '2024.06.15 - 2024.07.05',
            type: 'activity'
        },
    ];

    return (
        <section id="history" className="py-32 px-6 md:px-12 max-w-7xl mx-auto border-b border-neutral-900 overflow-hidden">
            <div className="flex flex-col items-center text-center mb-24">
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500 uppercase tracking-[0.2em] mb-4"
                >
                    Path & Progress
                </motion.span>

                {/* Dynamic Title - Perfectly Centered Layout with Symmetrical Character Count */}
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="w-full flex items-center justify-center text-4xl md:text-6xl font-bold tracking-tighter"
                >
          <span className={leftTitleClass}>
            Studies
          </span>

                    <span className="text-neutral-600 px-3 md:px-6 shrink-0 font-light">&</span>

                    <span className={rightTitleClass}>
            Careers
          </span>
                </motion.h2>
            </div>

            <div className="relative">
                {/* Central Gradient Line (Desktop) */}
                <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-500/50 via-purple-500/50 to-red-500/50 -translate-x-1/2 rounded-full" />

                {/* Left Side Line (Mobile) */}
                <div className="md:hidden absolute left-1.5 top-0 bottom-0 w-[2px] bg-neutral-800 rounded-full" />

                <div className="grid md:grid-cols-2 gap-8 md:gap-0">

                    {/* Left Column: Education / Activity */}
                    <div className="flex flex-col justify-start">
                        <div className="md:hidden flex items-center gap-2 mb-8 pl-8 text-blue-400">
                            <GraduationCap size={20} /> <h3 className="text-xl font-bold text-white">Activity</h3>
                        </div>
                        {/* Header for Desktop */}
                        <div className="hidden md:flex justify-end pr-12 mb-12">
                            <div className={activityHeaderClass}>
                                <h3 className="text-2xl font-bold tracking-tight">Education</h3>
                                <GraduationCap size={24} />
                            </div>
                        </div>

                        {activities.map((item) => (
                            <Card
                                key={item.id}
                                item={item}
                                align="left"
                                onHover={handleHover}
                            />
                        ))}
                    </div>

                    {/* Right Column: Career */}
                    <div className="flex flex-col justify-start md:mt-24">
                        <div className="md:hidden flex items-center gap-2 mb-8 mt-12 pl-8 text-red-400">
                            <Briefcase size={20} /> <h3 className="text-xl font-bold text-white">Career</h3>
                        </div>

                        <div className="hidden md:flex justify-start pl-12 mb-12">
                            <div className={careerHeaderClass}>
                                <Briefcase size={24} />
                                <h3 className="text-2xl font-bold tracking-tight">Career & Experience</h3>
                            </div>
                        </div>

                        {careers.map((item) => (
                            <Card
                                key={item.id}
                                item={item}
                                align="right"
                                onHover={handleHover}
                            />
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default HistorySection;