
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Github, ArrowUpRight, PenTool, LogOut, Sparkles, Gamepad2, Wand2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: 'Project', path: '/project' },
  ];

  return (
      <nav
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out border-b ${
              isScrolled
                  ? 'bg-black/80 backdrop-blur-xl border-white/5 py-4'
                  : 'bg-transparent border-transparent py-6'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="z-50 block hover:opacity-80 transition-opacity">
          <span className="text-xl font-bold tracking-tighter text-white">
            TAEYUN RYU'S <span className="text-neutral-500">TECH BLOG</span>
          </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            <div className="flex items-center space-x-6 mr-8 bg-white/5 px-6 py-2 rounded-full border border-white/5 backdrop-blur-md">
              {navLinks.map((link) => (
                  <Link
                      key={link.name}
                      to={link.path}
                      className={`text-sm font-medium tracking-wide transition-colors duration-300 ${
                          location.pathname === link.path ? 'text-white' : 'text-neutral-400 hover:text-white'
                      }`}
                  >
                    {link.name}
                  </Link>
              ))}

              {/* Asset Factory Link */}
              <Link
                  to="/assets"
                  className={`text-sm font-medium tracking-wide flex items-center gap-1.5 transition-colors duration-300 ${
                      location.pathname === '/assets' ? 'text-purple-400' : 'text-purple-400/70 hover:text-purple-400'
                  }`}
              >
                <Wand2 size={12} /> Factory
              </Link>

              {/* Arcade Link */}
              <Link
                  to="/arcade"
                  className={`text-sm font-medium tracking-wide flex items-center gap-1.5 transition-colors duration-300 ${
                      location.pathname === '/arcade' ? 'text-red-400' : 'text-red-400/70 hover:text-red-400'
                  }`}
              >
                <Gamepad2 size={12} /> Arcade
              </Link>

              {/* AI Lab Link */}
              <Link
                  to="/ailab"
                  className={`text-sm font-medium tracking-wide flex items-center gap-1.5 transition-colors duration-300 ${
                      location.pathname === '/ailab' ? 'text-cyan-400' : 'text-cyan-400/70 hover:text-cyan-400'
                  }`}
              >
                <Sparkles size={12} /> AI Lab
              </Link>

              {isAuthenticated && (
                  <Link to="/admin/write" className="text-sm font-medium tracking-wide text-green-400 hover:text-green-300 flex items-center gap-2">
                    <PenTool size={14} /> Write
                  </Link>
              )}
            </div>

            <div className="flex items-center gap-4">
              <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-white transition-colors p-2"
              >
                <Github size={20} />
              </a>

              {isAuthenticated ? (
                  <button
                      onClick={logout}
                      className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-500/10 text-red-400 text-sm font-bold hover:bg-red-500/20 transition-all duration-300 border border-red-500/20"
                  >
                    <LogOut size={16} /> Logout
                  </button>
              ) : (
                  <a
                      href="mailto:hello@example.com"
                      className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-sm font-bold hover:bg-neutral-200 transition-all duration-300"
                  >
                    Let's Talk
                    <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
              )}
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
              className="md:hidden text-white z-50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
            <div className="fixed inset-0 bg-black z-40 flex items-center justify-center animate-fade-in">
              <div className="flex flex-col space-y-8 text-center">
                {navLinks.map((link) => (
                    <Link
                        key={link.name}
                        to={link.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-3xl font-bold text-white hover:text-neutral-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                ))}
                <Link
                    to="/assets"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-3xl font-bold text-purple-400 hover:text-purple-300 flex items-center justify-center gap-2"
                >
                  <Wand2 /> Factory
                </Link>
                <Link
                    to="/arcade"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-3xl font-bold text-red-400 hover:text-red-300 flex items-center justify-center gap-2"
                >
                  <Gamepad2 /> Arcade
                </Link>
                <Link
                    to="/ailab"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-3xl font-bold text-cyan-400 hover:text-cyan-300 flex items-center justify-center gap-2"
                >
                  <Sparkles /> AI Lab
                </Link>
                {isAuthenticated && (
                    <Link
                        to="/admin/write"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-3xl font-bold text-green-500 hover:text-green-400"
                    >
                      Write Post
                    </Link>
                )}
                <a
                    href="mailto:hello@example.com"
                    className="text-xl text-neutral-400 hover:text-white pt-8"
                >
                  Let's Talk ->
                </a>
              </div>
            </div>
        )}
      </nav>
  );
};

export default Navbar;
