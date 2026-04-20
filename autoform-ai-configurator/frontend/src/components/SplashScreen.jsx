import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png';
import tharInterior from '../assets/thar_interior.png';

const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 4500); // Cinematic duration
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#020202] z-50 overflow-hidden flex items-center justify-center font-mono"
    >
      {/* Background Cinematic Asset */}
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.4 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <img 
            src={tharInterior} 
            alt="Interior Context" 
            className="w-full h-full object-cover grayscale brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80" />
      </motion.div>

      {/* Modern AI Scanning Line */}
      <motion.div
        initial={{ top: "-10%", opacity: 0 }}
        animate={{ top: ["-10%", "100%"], opacity: [0, 1, 1, 0] }}
        transition={{ 
            duration: 3, 
            times: [0, 0.1, 0.9, 1], 
            repeat: Infinity,
            repeatDelay: 0.5,
            ease: "linear" 
        }}
        className="absolute left-0 w-full h-[2px] bg-accent-gold shadow-[0_0_30px_#D4AF37] z-20 flex items-center justify-center"
      >
          <div className="w-1/3 h-[50px] bg-gradient-to-b from-accent-gold/20 to-transparent absolute top-0" />
      </motion.div>

      {/* Digital Grid Mesh Overlay */}
      <div className="absolute inset-0 z-10 opacity-10 pointer-events-none">
          <div className="w-full h-full" style={{ 
              backgroundImage: `linear-gradient(to right, #ffffff11 1px, transparent 1px), linear-gradient(to bottom, #ffffff11 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
          }} />
      </div>

      {/* Autoform AI Terminal Output (Center-ish focus but subtle) */}
      <div className="relative z-30 text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-col items-center"
          >
              <div className="flex items-center space-x-3 mb-2">
                  <div className="w-1 h-1 bg-accent-gold rounded-full animate-ping" />
                  <p className="text-[10px] tracking-[0.8em] text-accent-gold/60 uppercase">
                    {"SYNTHESIZING".split("").map((char, index) => (
                        <motion.span
                            key={index}
                            initial={{ opacity: 0, filter: "blur(4px)", scale: 1.5 }}
                            animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                            transition={{ 
                                delay: 1 + (index * 0.1),
                                duration: 0.5,
                                ease: "easeOut"
                            }}
                            className="inline-block"
                        >
                            {char}
                        </motion.span>
                    ))}
                  </p>
              </div>
              <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </motion.div>
      </div>

      {/* Logo Watermark & OS Indicator (Top Left as requested) */}
      <div className="absolute top-12 left-12 z-40">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center space-x-6"
          >
              <img src={logo} alt="Autoform" className="w-32 h-auto brightness-200 grayscale contrast-150" />
              <div className="h-4 w-[1px] bg-white/20" />
              <div className="space-y-1">
                  <p className="text-[7px] text-zinc-500 tracking-[0.3em] uppercase">Status: Online</p>
                  <p className="text-[7px] text-accent-gold tracking-[0.3em] uppercase animate-pulse">Building Interior Mesh...</p>
              </div>
          </motion.div>
      </div>

      {/* Bottom Technical Indicators */}
      <div className="absolute bottom-12 left-12 z-40">
          <div className="flex flex-col space-y-2">
              <p className="text-[6px] text-zinc-700 tracking-[0.5em] uppercase">GPU Acceleration: Active</p>
              <p className="text-[6px] text-zinc-700 tracking-[0.5em] uppercase">Neural Engine: Version 1.5.0</p>
          </div>
      </div>

    </motion.div>
  );
};

export default SplashScreen;
