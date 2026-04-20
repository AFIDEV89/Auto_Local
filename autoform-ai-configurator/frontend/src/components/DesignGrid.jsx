import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2 } from 'lucide-react';
import { animate } from 'animejs/animation';
import { DESIGNS } from '../mockData';

const DesignGrid = ({ selectedDesign, setSelectedDesign }) => {
  const cardsRef = useRef([]);
  const [zoomedDesign, setZoomedDesign] = useState(null);

  useEffect(() => {
    const targets = cardsRef.current.filter(el => el !== null);
    if (targets.length === 0) return;
    
    animate(targets, {
      opacity: [0, 1],
      scale: [0.9, 1],
      delay: (el, i) => i * 40,
      duration: 500,
      easing: 'easeOutQuart'
    });
  }, []);

  return (
    <div className="w-full flex flex-col space-y-4">
      <h3 className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-bold px-1">
        Design Selection 
      </h3>
      
      <div className="grid grid-cols-2 gap-4 max-h-[380px] overflow-y-auto px-2 py-2 custom-scrollbar">
        {DESIGNS.map((design, i) => (
          <div
            key={design.id}
            ref={el => cardsRef.current[i] = el}
            role="button"
            tabIndex={0}
            onClick={() => setSelectedDesign(design)}
            onKeyDown={(e) => e.key === 'Enter' && setSelectedDesign(design)}
            className={`group relative flex flex-col transition-all duration-500 cursor-pointer p-1 ${
              selectedDesign?.id === design.id ? "scale-[1.02]" : "opacity-70 hover:opacity-100"
            }`}
          >
            <div 
              className={`aspect-square w-full rounded-xl transition-all duration-500 overflow-hidden relative shadow-lg bg-zinc-950 ${
                selectedDesign?.id === design.id ? "ring-2 ring-inset ring-accent-gold shadow-accent-gold/40 border-none" : "border border-white/5 hover:border-white/20"
              }`}
            >
              {/* Floating Price Badge (Appears on Hover) */}
              <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10">
                  <p className="text-[7px] tracking-[0.2em] text-accent-gold uppercase font-bold">{design.price}</p>
                </div>
              </div>

              {/* Texture Image or Placeholder Gradient */}
              {design.preview ? (
                <div className="w-full h-full p-2 relative">
                  <img 
                    src={design.preview} 
                    alt={design.name} 
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                  />
                  <span 
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      setZoomedDesign(design);
                    }}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); setZoomedDesign(design); }}}
                    className="absolute bottom-2 right-2 p-1.5 bg-black/60 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-accent-gold hover:text-white cursor-pointer"
                  >
                    <Maximize2 className="w-3 h-3" />
                  </span>
                </div>
              ) : (
                <div className={`w-full h-full bg-gradient-to-br transition-transform duration-700 group-hover:scale-110 ${
                  design.id % 2 === 0 ? "from-zinc-800 to-zinc-950" : "from-zinc-700 to-zinc-900"
                }`} />
              )}
            </div>

            <div className="mt-3 text-left px-1">
              <h4 className={`text-[9px] uppercase tracking-[0.2em] transition-colors mb-1 ${
                selectedDesign?.id === design.id ? "text-accent-gold font-bold" : "text-zinc-400"
              }`}>
                {design.name}
              </h4>
              <p className="text-[7px] uppercase tracking-[0.1em] text-zinc-600">
                {design.color}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Zoomed Design Modal */}
      <AnimatePresence>
        {zoomedDesign && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-20 bg-black/90 backdrop-blur-xl"
            onClick={() => setZoomedDesign(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative max-w-4xl w-full h-full flex flex-col items-center justify-center"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setZoomedDesign(null)}
                className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 backdrop-blur-xl rounded-full text-white/50 hover:text-white transition-all duration-300 border border-white/10 z-50 shadow-2xl"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-full flex-1 flex items-center justify-center p-4 md:p-12">
                 <motion.img 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  src={zoomedDesign.preview} 
                  alt={zoomedDesign.name}
                  className="max-w-full max-h-[70vh] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                 />
              </div>
              
              <div className="pb-12 text-center space-y-3 px-6">
                <h2 className="text-3xl md:text-4xl font-extralight tracking-[0.4em] text-white uppercase leading-tight">
                  {zoomedDesign.name}
                </h2>
                <div className="flex items-center justify-center space-x-4">
                    <div className="h-[1px] w-8 bg-accent-gold/30" />
                    <p className="text-accent-gold text-[10px] md:text-xs tracking-[0.5em] font-medium uppercase">
                    {zoomedDesign.color} • {zoomedDesign.price}
                    </p>
                    <div className="h-[1px] w-8 bg-accent-gold/30" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DesignGrid;
