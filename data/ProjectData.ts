import { Project } from '../types';

// BLOGS are now fetched from API via useBlogData hook.
export const BLOGS = [];

export const PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'taeyun.com',
    description: 'An autonomous conversational agent capable of understanding complex context and maintaining long-term memory.',
    techStack: ['Python', 'TensorFlow', 'React'],
    category: 'Dev',
    linkType: 'site',
    link: 'https://taeyunryu.vercel.app/',
    sourceLink: 'https://github.com/tyroneryu/portfolio_dev.taeyun',
    image: '/images/taeyun_com.png'
  },
  {
    id: 'm1',
    title: 'Korea MICE Expo 2024',
    description: 'Orchestrated a 3-day international conference for 5,000+ attendees. Managed end-to-end logistics, from venue selection to keynote speaker coordination.',
    techStack: ['Event Planning', 'Logistics', 'Budgeting'],
    category: 'MICE',
    linkType: 'site',
    image: '/images/kme.png'
  },
  {
    id: 'p2',
    title: 'Trigger Forge',
    description: 'High-performance video streaming platform using WebRTC and edge computing for sub-second latency.',
    techStack: ['Go', 'WebRTC', 'Next.js'],
    category: 'Dev',
    linkType: 'architecture',
    sourceLink: 'https://github.com/tyroneryu/trigger_forge',
    image: '/images/trigger_forge.png'
  },
  {
    id: 'm2',
    title: 'ICCZ Fam Tour',
    description: 'Designed and executed a sustainable trade show featuring 200+ exhibitors. Implemented zero-waste protocols and digital registration systems.',
    techStack: ['Exhibition Management', 'Sustainability', 'Operations'],
    category: 'MICE',
    linkType: 'site',
    image: '/images/iccz.png'
  },
  {
    id: 'p3',
    title: 'GitKubeOps',
    description: 'Decentralized exchange aggregator visualizing arbitrage opportunities in a 3D interactive environment.',
    techStack: ['Solidity', 'Three.js', 'Rust'],
    category: 'Dev',
    linkType: 'architecture',
    sourceLink: 'https://github.com/tyroneryu/gitkubeops',
    image: '/images/gitkubeops.png'
  },
  {
    id: 'p4',
    title: 'Tech Blog',
    description: 'Real-time speech synthesis engine for accessibility tools, providing natural sounding voice generation.',
    techStack: ['C++', 'WASM', 'AudioWorklet'],
    category: 'Dev',
    linkType: 'site',
    sourceLink: 'https://github.com/tyroneryu/gitkubeops',
    image: '/images/blog_taeyun.png'
  },
  {
    id: 'm3',
    title: 'Seoul Hiking Tourism Center (Gwanak-mountain)',
    description: 'Decetralized exchange aggregator visualizing arbitrage opportunities in a 3D interactive environment.',
    techStack: ['Sustainability', 'Operations'],
    category: 'MICE',
    linkType: 'site',
    image: '/images/gwanak.png'
  },
  {
    id: 'p5',
    title: 'Malware Analysis Service',
    description: 'Real-time malware analysis service via AWS CI/CD automatiation.',
    techStack: ['Python','Tensorflow'],
    category: 'Dev',
    linkType: 'architecture',
    architectureImage: '/images/malware_architecture.png',
    sourceLink: 'https://github.com/tyroneryu/malware-analysis-service',
    image: '/images/malware_analysis.png'
  }
];