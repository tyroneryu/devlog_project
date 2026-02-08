
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import BlogList from './pages/BlogList';
import ProjectList from './pages/ProjectList';
import BlogPost from './pages/BlogPost';
import ProjectDetail from './pages/ProjectDetail';
import NeuralPalette from './components/NeuralPalette';
import EasterEgg from './components/EasterEgg';
import AdminLogin from './pages/AdminLogin';
import AdminWrite from './pages/AdminWrite';
import AiLab from './pages/AiLab';
import Arcade from './pages/Arcade';
import MusicWidget from './components/MusicWidget';
import AdminAssets from './pages/AdminAssets';
import Preloader from './components/Preloader';
import { AuthProvider } from './context/AuthContext';
import { AlertCircle } from 'lucide-react';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const NotFound = () => (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div className="bg-neutral-900/50 p-8 rounded-2xl border border-red-500/20">
        <div className="inline-block p-4 rounded-full bg-red-500/10 mb-4">
          <AlertCircle className="text-red-500" size={32} />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">404: Signal Lost</h1>
        <p className="text-neutral-400">The requested frequency was not found.</p>
      </div>
    </div>
);

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if we've already shown the preloader in this session
    const hasLoaded = sessionStorage.getItem('hasLoaded');
    if (hasLoaded) {
      setLoading(false);
    }
  }, []);

  const handlePreloaderComplete = () => {
    setLoading(false);
    sessionStorage.setItem('hasLoaded', 'true');
  };

  return (
      <AuthProvider>
        {loading && <Preloader onComplete={handlePreloaderComplete} />}
        <Router>
          <ScrollToTop />
          <NeuralPalette />
          <EasterEgg />
          <MusicWidget />
          <div className="flex flex-col min-h-screen bg-black text-white font-sans">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Lab routes */}
                <Route path="/ailab" element={<AiLab />} />
                <Route path="/arcade" element={<Arcade />} />
                <Route path="/assets" element={<AdminAssets />} />

                {/* Specific routes first */}
                <Route path="/admin/write" element={<AdminWrite />} />
                <Route path="/admin/assets" element={<AdminAssets />} />
                <Route path="/admin" element={<AdminLogin />} />

                <Route path="/blog" element={<BlogList />} />
                <Route path="/blog/:id" element={<BlogPost />} />
                <Route path="/project" element={<ProjectList />} />
                <Route path="/project/:id" element={<ProjectDetail />} />

                {/* Home route */}
                <Route path="/" element={<Home />} />

                {/* Catch-all 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
  );
};

export default App;
