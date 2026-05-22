import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward } from 'lucide-react';

interface SplashProps {
  onComplete: () => void;
}

const words = ["Equity", "FnO", "McX", "PMS", "X"];
const intervals = [450, 400, 350, 350, 1000]; 

export default function Splash({ onComplete }: SplashProps) {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFinishing, setIsFinishing] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;

    if (index < words.length - 1) {
      const timer = setTimeout(() => {
        setIndex(prev => prev + 1);
      }, intervals[index]);
      return () => clearTimeout(timer);
    } else {
      // Last word (X.ai) - auto-completes and fades out after delay
      const timer = setTimeout(() => {
        setIsFinishing(true);
      }, intervals[index]);
      return () => clearTimeout(timer);
    }
  }, [index, isPlaying]);

  useEffect(() => {
    if (isFinishing) {
      const timer = setTimeout(() => {
        onComplete();
      }, 600); // match fade-out dur
      return () => clearTimeout(timer);
    }
  }, [isFinishing, onComplete]);

  return (
    <AnimatePresence>
      {!isFinishing && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-b from-[#1C1C1E] to-[#000000]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Ambient space light background */}
          <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
             <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.04)_0%,transparent_55%)] pointer-events-none filter blur-[10px]" />
          </div>

          {/* Premium Animated Suffix Title */}
          <div 
            className="w-full flex items-center select-none z-10"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            {/* Left half ending exactly at the center of the viewport */}
            <div className="w-[50vw] flex justify-end pr-2 sm:pr-3">
              <span className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white text-right">
                Waya
              </span>
            </div>

            {/* Right half starting exactly at the center of the viewport */}
            <div className="w-[50vw] flex justify-start pl-0">
              <div 
                style={{ height: '80px' }}
                className="relative w-[220px] sm:w-[280px] md:w-[320px] overflow-hidden flex items-center"
              >
                <AnimatePresence mode="popLayout flex items-center">
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 38, filter: 'blur(12px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -38, filter: 'blur(12px)' }}
                    transition={{ 
                      duration: 0.45, 
                      ease: [0.16, 1, 0.3, 1] 
                    }}
                    style={{ height: '80px', width: '218.484px' }}
                    className={`absolute left-0 text-4xl sm:text-5xl md:text-6xl font-black flex items-center ${
                      index === words.length - 1 
                        ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-200 to-indigo-400 font-extrabold' 
                        : 'text-white font-bold'
                    }`}
                  >
                    {words[index]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Premium Controller Panel in the Bottom Right */}
          <motion.div 
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 p-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl select-none"
          >
            {/* Play / Pause Micro Button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 active:scale-95 text-white transition-all cursor-pointer border border-white/5"
              title={isPlaying ? "Pause timeline" : "Resume timeline"}
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-current text-white" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current text-white ml-0.5" />
              )}
            </button>

            {/* Timeline expanded track - only opens up when paused */}
            <AnimatePresence initial={false}>
              {!isPlaying && (
                <motion.div
                  initial={{ width: 0, opacity: 0, marginLeft: 0 }}
                  animate={{ width: 'auto', opacity: 1, marginLeft: 4 }}
                  exit={{ width: 0, opacity: 0, marginLeft: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="flex items-center gap-2 overflow-hidden px-1"
                >
                  <div className="h-1 w-24 bg-white/10 rounded-full relative">
                    <input
                      type="range"
                      min={0}
                      max={words.length - 1}
                      value={index}
                      onChange={(e) => {
                        setIndex(parseInt(e.target.value, 10));
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div 
                      className="h-full bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full transition-all duration-150"
                      style={{ width: `${(index / (words.length - 1)) * 100}%` }}
                    />
                    <div 
                      className="absolute top-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-md border border-indigo-400 -translate-y-1/2 pointer-events-none"
                      style={{ left: `calc(${(index / (words.length - 1)) * 100}% - 5px)` }}
                    />
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono tracking-wider ml-1 w-6">
                    {index + 1}/{words.length}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Skip button */}
            <button
              onClick={() => setIsFinishing(true)}
              className="h-8 px-3 rounded-full flex items-center justify-center bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer border border-indigo-500/20"
              title="Skip intro animation"
            >
              Skip
              <SkipForward className="w-2.5 h-2.5 ml-1" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
