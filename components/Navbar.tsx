
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Github, ArrowUpRight, PenTool, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Blog', path: '/blog' },
    { name: 'Project', path: '/project' },
    { name: 'Factory', path: '/assets' },
    { name: 'Arcade', path: '/arcade' },
    { name: 'AI Lab', path: '/ailab' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled
          ? 'bg-black/85 backdrop-blur-md border-b border-white/[0.08] py-4 md:py-5'
          : 'bg-transparent py-7 md:py-9'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
        {/* Left Group: Logo + Left-aligned Navigation Links */}
        <div className="flex items-center gap-8 lg:gap-12">
          {/* Logo */}
          <Link to="/" className="flex items-center group transition-opacity hover:opacity-90">
            <span className="text-base md:text-[17px] font-bold tracking-tight text-white">
              TAEYUN RYU'S <span className="text-neutral-400 font-normal ml-1">TECH BLOG</span>
            </span>
          </Link>

          {/* Desktop Nav - Google I/O style crisp typography */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-[14.5px] transition-colors duration-200 tracking-normal font-medium ${
                    isActive
                      ? 'text-white'
                      : 'text-white/75 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {isAuthenticated && (
              <Link
                to="/admin/write"
                className="text-[14.5px] font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors"
              >
                <PenTool size={15} /> Write
              </Link>
            )}
          </div>
        </div>

        {/* Right Area: Minimal Icons & Links (No bulky pill panels) */}
        <div className="hidden md:flex items-center gap-6">
          <a
            href="https://github.com/tyroneryu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-white transition-colors p-1"
            aria-label="GitHub"
          >
            <Github size={20} />
          </a>

          {isAuthenticated ? (
            <button
              onClick={logout}
              className="text-[14px] font-medium text-neutral-400 hover:text-red-400 transition-colors flex items-center gap-1.5 py-1"
            >
              <LogOut size={15} /> Logout
            </button>
          ) : (
            <a
              href="mailto:ryu.tyrone@gmail.com"
              className="text-[14px] font-medium text-white/80 hover:text-white transition-colors flex items-center gap-1 py-1"
            >
              Contact
              <ArrowUpRight size={15} className="opacity-70" />
            </a>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white/90 hover:text-white p-2 z-50 focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-40 flex flex-col justify-center px-8 animate-fade-in md:hidden">
          <div className="flex flex-col space-y-6 text-left">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-2xl font-medium transition-colors ${
                  location.pathname === link.path ? 'text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                to="/admin/write"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-2xl font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-2"
              >
                <PenTool size={20} /> Write Post
              </Link>
            )}
            <div className="pt-6 border-t border-neutral-800 flex items-center gap-6">
              <a
                href="https://github.com/tyroneryu"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <Github size={22} />
              </a>
              <a
                href="mailto:ryu.tyrone@gmail.com"
                className="text-sm text-neutral-400 hover:text-white"
              >
                ryu.tyrone@gmail.com &rarr;
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
