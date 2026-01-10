import React, { useState } from 'react';
import { ArrowUpRight, Github, Linkedin, Twitter, Lock, X, Map, FileText, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Footer: React.FC = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'sitemap' | null>(null);

    const socialLinks = [
        { icon: Github, href: "https://github.com/tyroneryu", label: "GitHub" },
        { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
        { icon: Twitter, href: "https://twitter.com", label: "Twitter" }
    ];

    const sitemapLinks = [
        { title: "Main", links: [
                { name: "Home", path: "/" },
                { name: "Blog", path: "/blog" },
                { name: "Projects", path: "/project" }
            ]},
        { title: "Experimental", links: [
                { name: "AI Lab", path: "/ailab" },
                { name: "Arcade", path: "/arcade" },
                { name: "Admin Console", path: "/admin" }
            ]}
    ];

    const legalContent = {
        privacy: {
            title: "Privacy Policy",
            icon: <Shield className="text-green-400" size={24} />,
            content: (
                <div className="space-y-4 text-neutral-300">
                    <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
                    <p>Your privacy is important to us. It is Taeyun Ryu's policy to respect your privacy regarding any information we may collect from you across our website.</p>
                    <h3 className="text-white font-bold mt-4">1. Information We Collect</h3>
                    <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent (e.g., Guestbook entries, Contact forms).</p>
                    <h3 className="text-white font-bold mt-4">2. Data Usage</h3>
                    <p>We do not share any personally identifying information publicly or with third-parties, except when required to by law.</p>
                    <h3 className="text-white font-bold mt-4">3. Cookies</h3>
                    <p>We use local storage to improve your experience (e.g., saving your admin session). No tracking cookies are used for advertising purposes.</p>
                </div>
            )
        },
        terms: {
            title: "Terms of Use",
            icon: <FileText className="text-blue-400" size={24} />,
            content: (
                <div className="space-y-4 text-neutral-300">
                    <p><strong>1. Acceptance of Terms</strong><br/>By accessing this website, you agree to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
                    <p><strong>2. Use License</strong><br/>Permission is granted to temporarily download one copy of the materials (information or software) on Taeyun Ryu's website for personal, non-commercial transitory viewing only.</p>
                    <p><strong>3. Disclaimer</strong><br/>The materials on this website are provided on an 'as is' basis. Taeyun Ryu makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability.</p>
                </div>
            )
        }
    };

    return (
        <footer className="bg-black pt-24 pb-12 border-t border-neutral-900 relative z-50">
            <div className="max-w-7xl mx-auto px-6">

                {/* Main CTA Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-12">
                    <div className="max-w-3xl">
                        <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter leading-tight mb-8">
                            Let's create something <br />
                            <span className={`transition-colors duration-500 ease-in-out ${isHovered ? 'text-blue-400' : 'text-neutral-500'}`}>
                extraordinary.
              </span>
                        </h2>
                        <a
                            href="mailto:ryu.tyrone@gmail.com"
                            className="inline-flex items-center gap-3 text-2xl md:text-3xl text-white hover:text-neutral-400 transition-colors border-b-2 border-white/20 pb-2 hover:border-white"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            ryu.tyrone@gmail.com <ArrowUpRight size={24} />
                        </a>
                    </div>

                    <div className="flex flex-col gap-4">
                        <p className="text-neutral-500 font-medium uppercase tracking-wider text-sm">Socials</p>
                        <div className="flex gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 rounded-full bg-neutral-900 text-white hover:bg-white hover:text-black transition-all hover:scale-110"
                                    aria-label={social.label}
                                >
                                    <social.icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="w-full h-[1px] bg-neutral-900 mb-8" />

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center text-xs text-neutral-600 gap-4">
                    <p className="flex items-center gap-2">
                        &copy; {new Date().getFullYear()} Taeyun Ryu. Crafted with precision.
                        <Link to="/admin" className="opacity-10 hover:opacity-100 transition-opacity p-2" aria-label="Admin Access">
                            <Lock size={10} />
                        </Link>
                    </p>
                    <div className="flex space-x-8">
                        <button onClick={() => setActiveModal('privacy')} className="hover:text-white transition-colors">Privacy Policy</button>
                        <button onClick={() => setActiveModal('terms')} className="hover:text-white transition-colors">Terms of Use</button>
                        <button onClick={() => setActiveModal('sitemap')} className="hover:text-white transition-colors">Sitemap</button>
                    </div>
                </div>
            </div>

            {/* Info Modal */}
            <AnimatePresence>
                {activeModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setActiveModal(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ scale: 0.95, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.95, y: 20, opacity: 0 }}
                            className="relative w-full max-w-2xl bg-[#111] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
                        >
                            <button
                                onClick={() => setActiveModal(null)}
                                className="absolute top-6 right-6 text-neutral-500 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>

                            {/* Sitemap Layout */}
                            {activeModal === 'sitemap' ? (
                                <div>
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="p-3 rounded-full bg-purple-500/10 text-purple-400">
                                            <Map size={24} />
                                        </div>
                                        <h2 className="text-2xl font-bold text-white">Sitemap</h2>
                                    </div>
                                    <div className="grid grid-cols-2 gap-12">
                                        {sitemapLinks.map((section) => (
                                            <div key={section.title}>
                                                <h3 className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-4 border-b border-white/5 pb-2">
                                                    {section.title}
                                                </h3>
                                                <ul className="space-y-3">
                                                    {section.links.map((link) => (
                                                        <li key={link.path}>
                                                            <Link
                                                                to={link.path}
                                                                onClick={() => setActiveModal(null)}
                                                                className="text-lg text-neutral-300 hover:text-white hover:translate-x-2 transition-all inline-block"
                                                            >
                                                                {link.name}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                // Legal Layout (Privacy / Terms)
                                <div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 rounded-full bg-white/5">
                                            {legalContent[activeModal].icon}
                                        </div>
                                        <h2 className="text-2xl font-bold text-white">{legalContent[activeModal].title}</h2>
                                    </div>
                                    <div className="h-64 overflow-y-auto custom-scrollbar pr-4">
                                        {legalContent[activeModal].content}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </footer>
    );
};

export default Footer;