import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  // Mouse position using MotionValues for performance
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Spring config for the trailing ring (smooth lag effect)
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const ringX = useSpring(cursorX, springConfig);
  const ringY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Detect if device supports hover (desktop)
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice) return;

    setIsVisible(true);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if hovering over clickable elements
      const isClickable =
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('.cursor-hover'); // Class for custom clickable areas

      setIsHovering(!!isClickable);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    // Hide default cursor globally
    document.body.style.cursor = 'none';
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      a, button, input, textarea, .cursor-pointer { cursor: none !important; }
    `;
    document.head.appendChild(styleElement);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
      document.body.style.cursor = 'auto';
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Main Dot */}
      <motion.div
        className="absolute w-2 h-2 bg-white rounded-full mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />

      {/* Trailing Ring */}
      <motion.div
        className="absolute rounded-full border border-white mix-blend-difference"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovering ? 60 : isClicking ? 20 : 32,
          height: isHovering ? 60 : isClicking ? 20 : 32,
          borderColor: isHovering ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.3)',
          backgroundColor: isHovering ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
          scale: isClicking ? 0.8 : 1,
        }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 400,
          mass: 0.2 // Faster reaction for size changes
        }}
      >
        {/* Crosshair decoration inside ring when hovering */}
        <motion.div
            animate={{ opacity: isHovering ? 1 : 0, rotate: isHovering ? 90 : 0 }}
            className="w-full h-full relative"
        >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-2 bg-white/50" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-2 bg-white/50" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-[1px] bg-white/50" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-[1px] bg-white/50" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CustomCursor;