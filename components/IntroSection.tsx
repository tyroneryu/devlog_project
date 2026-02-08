import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

// ----------------------------------------------------------------------
// 📷 PORTRAIT CONFIGURATION
// Place your image in: public/images/
// Example: public/images/profile.png
// ----------------------------------------------------------------------

const PROFILE_IMAGE_PATH = "/images/profile.png";

const IntroSection: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  const skills = [
    "TypeScript", "React", "Node.js", "System Design", // Dev
    "Event Planning", "Logistics", "Budget Management", "Vendor Relations" // MICE
  ];

  return (
      <section id="intro" className="py-32 px-6 md:px-12 max-w-7xl mx-auto border-b border-neutral-900">
        <div className="grid lg:grid-cols-12 gap-16 items-start">

          {/* Portrait Column */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative group w-full aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-900 cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
              <div className="absolute inset-0 bg-neutral-900/20 group-hover:bg-transparent transition-colors duration-500 z-10 mix-blend-multiply" />
              <img
                  src={PROFILE_IMAGE_PATH}
                  alt="Taeyun Ryu"
                  className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out scale-100 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback image if yours isn't found
                    e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop";
                  }}
              />

              <div className="absolute bottom-6 left-6 z-20 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Available for hire</span>
              </div>
            </motion.div>
          </div>

          {/* Text Content Column */}
          <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col justify-center h-full space-y-10">
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-6xl font-bold leading-[1.1] tracking-tighter"
            >
            <span className={`transition-colors duration-500 ease-in-out ${isHovered ? 'text-blue-400' : 'text-neutral-500'}`}>
              Bridging Technology &
            </span><br />
              <span className="text-white">Experience Design.</span>
            </motion.h2>

            <div className="space-y-6 text-lg text-neutral-400 leading-relaxed font-light max-w-2xl">
              <p>
                I am a unique hybrid professional: a <strong>Software Engineer</strong> who builds scalable systems, and a <strong>MICE Specialist</strong> who orchestrates large-scale international events.
              </p>
              <p>
                Whether it's optimizing a React render cycle or managing the logistics of a global summit, my philosophy remains the same: meticulous planning, seamless execution, and an obsession with the user experience.
              </p>
            </div>

            {/* Skills Tags */}
            <div className="pt-4">
              <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4">Core Competencies</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                    <span
                        key={skill}
                        className="px-3 py-1.5 rounded-md bg-neutral-900 text-neutral-300 text-xs font-mono border border-neutral-800 hover:border-neutral-600 transition-colors"
                    >
                  {skill}
                </span>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <a
                  href="/resume.pdf"
                  download="Taeyun_Ryu_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white font-medium hover:text-neutral-300 transition-colors border-b border-white pb-0.5 hover:border-neutral-300"
              >
                <Download size={18} /> Download Resume
              </a>
            </div>
          </div>
        </div>
      </section>
  );
};

export default IntroSection;