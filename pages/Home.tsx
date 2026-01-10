import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import IntroSection from '../components/IntroSection';
import HistorySection from '../components/HistorySection';
import FeaturedBlogs from '../components/FeaturedBlogs';
import FeaturedProjects from '../components/FeaturedProjects';
import LogoGeneratorSection from '../components/LogoGeneratorSection';
import SynergyEngine from '../components/SynergyEngine';
import ArcadeTeaser from '../components/ArcadeTeaser';
import Guestbook from '../components/Guestbook';
import { ArrowRight, Sparkles } from 'lucide-react';

const Home: React.FC = () => {
    return (
        <div className="bg-black min-h-screen">
            <Hero />
            <IntroSection />
            <HistorySection />
            <FeaturedBlogs />
            <FeaturedProjects />

            {/* Interactive Highlights on Home: Logo & Synergy */}
            <LogoGeneratorSection />
            <SynergyEngine />


            {/* AI Lab CTA: Directs users to Grounding & ASCII features */}
            <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-b border-neutral-900 text-center">
                <div className="max-w-3xl mx-auto space-y-8">
                    <div className="inline-flex items-center justify-center p-3 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
                        <Sparkles size={24} className="text-purple-400" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tighter">
                        Deeper into the <span className="text-purple-400">Neural Network</span>.
                    </h2>
                    <p className="text-xl text-neutral-400 leading-relaxed">
                        There is more to explore. Access the <strong>Real-time Grounding Hub</strong> and <strong>ASCII Vision Terminal</strong> in the dedicated laboratory.
                    </p>
                    <div className="pt-4">
                        <Link
                            to="/ailab"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-neutral-200 transition-all hover:scale-105"
                        >
                            Enter AI Lab <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Arcade Mini Game Preview */}
            <ArcadeTeaser />

            <Guestbook />
        </div>
    );
};

export default Home;