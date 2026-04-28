import React, { useState, useEffect } from 'react'
import SplashScreen from './components/SplashScreen'
import VehicleSelector from './components/VehicleSelector'
import DesignGrid from './components/DesignGrid'
import { motion, AnimatePresence } from 'framer-motion'
import { Info, Download, ChevronLeft, ChevronRight, Zap } from 'lucide-react'
import axios from 'axios'
import { animate } from 'animejs/animation'
import logo from './assets/logo.png'
import synthesisCore from './assets/synthesis_animated.gif'
import { DESIGNS } from './mockData'

function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [selectedBrand, setSelectedBrand] = useState('Mahindra')
  const [selectedModel, setSelectedModel] = useState('Thar')
  const [selectedDesign, setSelectedDesign] = useState(null) // Handled in useEffect to avoid double-render issues

  useEffect(() => {
    // Initializing with the first design for immediate 'WOW' factor
    if (!selectedDesign && DESIGNS.length > 0) {
      setSelectedDesign(DESIGNS[0]);
    }
  }, []);
  const [isGenerating, setIsGenerating] = useState(false)
  
  // View & Generation State
  const [viewMode, setViewMode] = useState('front') // 'front' or 'rear'
  const [generatedViews, setGeneratedViews] = useState({ front: null, rear: null })

  const handleGenerate = async (targetView = viewMode) => {
    if (!selectedModel || !selectedDesign) return;
    setIsGenerating(true)
    
    try {
      const formData = new FormData();
      formData.append('car_model', selectedModel);
      formData.append('design_name', selectedDesign.name);
      formData.append('lighting', 'day');
      formData.append('view', targetView);
      
      const response = await axios.post('http://127.0.0.1:8000/generate-design/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob'
      });
      
      const imageUrl = URL.createObjectURL(response.data);
      
      setGeneratedViews(prev => ({
        ...prev,
        [targetView]: imageUrl
      }));
      
    } catch (error) {
      console.error("Generation failed:", error);
      alert("Something went wrong during generation. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  const handleDownload = () => {
    if (!currentImage) return;
    const link = document.createElement('a');
    link.href = currentImage;
    link.download = `Autoform_${selectedModel}_${viewMode}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const currentImage = generatedViews[viewMode];

  return (
    <div className={`h-screen w-screen bg-[#050505] text-white font-sans selection:bg-accent-gold selection:text-black overflow-hidden`}>
      <AnimatePresence mode="wait">
        {showSplash ? (
          <SplashScreen key="splash" onFinish={() => setShowSplash(false)} />
        ) : (
          <motion.main
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full w-full flex flex-col lg:flex-row"
          >
            {/* LEFT PANEL: Sidebar Customization */}
            <aside className="w-full lg:w-[420px] h-full glass-panel border-y-0 border-l-0 z-30 flex flex-col shadow-2xl relative overflow-hidden">
               {/* Sidebar Header */}
               <div className="p-10 pb-6 relative">
                    <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white/5 to-transparent pointer-events-none opacity-50" />
                    <img src={logo} alt="Autoform" className="w-44 h-auto mb-3 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-transform duration-700 hover:scale-105" />
                    <div className="flex items-center space-x-3 mb-1">
                        <div className="w-1.5 h-[1px] bg-accent-gold" />
                        <p className="text-[9px] tracking-[0.4em] font-medium text-zinc-400 uppercase">
                            STUDIO CONTROL CENTER
                        </p>
                    </div>
               </div>

               {/* Scrollable Configuration Area */}
               <div className="flex-1 overflow-y-auto px-8 py-4 space-y-10 custom-scrollbar">
                    <section className="space-y-6">
                        <VehicleSelector 
                            selectedBrand={selectedBrand}
                            setSelectedBrand={setSelectedBrand}
                            selectedModel={selectedModel}
                            setSelectedModel={setSelectedModel}
                        />
                    </section>

                    <section className="space-y-6">
                        <DesignGrid 
                            selectedDesign={selectedDesign}
                            setSelectedDesign={setSelectedDesign}
                        />
                    </section>
               </div>

               {/* Sidebar Footer: Action Area (High-Fidelity Restored) */}
               <div className="px-8 pt-6 pb-4 border-t border-white/5 bg-black/20 backdrop-blur-3xl">
                    <motion.button
                        disabled={!selectedModel || !selectedDesign || isGenerating}
                        whileHover={(!selectedModel || !selectedDesign || isGenerating) ? {} : { scale: 1.02, boxShadow: "0 0 40px rgba(212, 175, 55, 0.3)" }}
                        whileTap={(!selectedModel || !selectedDesign || isGenerating) ? {} : { scale: 0.98 }}
                        onClick={() => handleGenerate()}
                        className={`w-full py-5 text-[10px] tracking-[0.5em] font-black uppercase transition-all duration-700 rounded-xl shadow-2xl relative overflow-hidden group ${
                            (!selectedModel || !selectedDesign || isGenerating)
                            ? "bg-zinc-900 text-zinc-600 border border-white/5 cursor-not-allowed"
                            : "bg-gradient-to-r from-white to-zinc-200 text-black hover:from-accent-gold hover:to-[#B8860B] border border-white/10"
                        }`}
                    >
                        <div className="relative z-10 flex items-center justify-center space-x-3">
                            <Zap className={`w-3 h-3 ${isGenerating ? "animate-spin" : ""}`} />
                            <span>{isGenerating ? "Synthesizing..." : "Generate Studio View"}</span>
                        </div>
                        {!isGenerating && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        )}
                    </motion.button>
                    
                    <p className="mt-3 text-[7px] uppercase tracking-[0.4em] text-zinc-600 text-center opacity-40">
                        Neural Engine v1.5_Flash Active
                    </p>
               </div>
            </aside>

            {/* RIGHT PANEL: Showcase & Gallery */}
            <section className="flex-1 h-full relative z-10 bg-zinc-950 overflow-hidden">
                {/* Background Textures/Fills */}
                <div className="absolute inset-0 bg-zinc-900/20" />
                
                {/* Main Viewport */}
                <div className="absolute inset-0 z-0">
                    <AnimatePresence mode="wait">
                        {currentImage ? (
                            <motion.img 
                                key={currentImage}
                                initial={{ opacity: 0, scale: 1.05 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                                src={currentImage} 
                                alt="Cabin View" 
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        ) : (
                            <motion.div 
                                key="placeholder"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-zinc-800"
                            >
                                {/* Showcase: Digital Grid Mesh */}
                                <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                                    <div className="w-full h-full" style={{ 
                                        backgroundImage: `linear-gradient(to right, #ffffff11 1px, transparent 1px), linear-gradient(to bottom, #ffffff11 1px, transparent 1px)`,
                                        backgroundSize: '40px 40px'
                                    }} />
                                </div>

                                {/* Showcase: Scanning Module */}
                                <motion.div
                                    initial={{ top: "-10%", opacity: 0 }}
                                    animate={{ top: ["-10%", "100%"], opacity: [0, 0.5, 0.5, 0] }}
                                    transition={{ 
                                        duration: 4, 
                                        times: [0, 0.1, 0.9, 1], 
                                        repeat: Infinity,
                                        ease: "linear" 
                                    }}
                                    className="absolute left-0 w-full h-[1px] bg-accent-gold/40 shadow-[0_0_20px_#D4AF37] z-10"
                                />

                                {/* Showcase Centerpiece: High-Fidelity Synthesis Animation */}
                                <div className="relative flex items-center justify-center mb-6">
                                    <motion.div 
                                        animate={{ opacity: [0.15, 0.3, 0.15] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px]"
                                    />
                                    <div className="relative z-20 w-[600px] h-auto overflow-hidden">
                                        <motion.img 
                                            initial={{ opacity: 0, scale: 0.95, y: 10, filter: "brightness(1.5) contrast(1.1)" }}
                                            animate={{ opacity: 0.7, scale: 1, y: 0 }}
                                            whileHover={{ opacity: 0.9, scale: 1.02, filter: "brightness(1.8) contrast(1.2)" }}
                                            transition={{ duration: 2, ease: "easeOut" }}
                                            src={synthesisCore}
                                            alt="Autoform Synthesis Dynamic"
                                            className="w-full h-auto grayscale transition-all duration-1000 select-none pointer-events-none drop-shadow-[0_0_80px_rgba(34,211,238,0.2)]"
                                            style={{ marginBottom: "-12%" }} // Heuristic crop to hide 'loading' text at bottom
                                        />
                                    </div>
                                </div>

                                {/* Status: Pixelated Text Forming */}
                                <div className="text-center space-y-4 relative z-20">
                                    <div className="flex items-center space-x-2 justify-center mb-2">
                                        <div className="w-1.5 h-1.5 bg-accent-gold rounded-full animate-ping" />
                                        <p className="text-[9px] tracking-[0.8em] text-white/60 uppercase">
                                            {"STUDIO READY".split("").map((char, index) => (
                                                <motion.span
                                                    key={index}
                                                    initial={{ opacity: 0, filter: "blur(4px)", scale: 1.5 }}
                                                    animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                                                    transition={{ 
                                                        delay: (index * 0.08),
                                                        duration: 0.6,
                                                        ease: "easeOut"
                                                    }}
                                                    className="inline-block"
                                                >
                                                    {char === " " ? "\u00A0" : char}
                                                </motion.span>
                                            ))}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    
                    <div className="absolute inset-0 z-10 studio-vignette pointer-events-none" />
                    
                    {/* Top-Left Logo & Minimalist Status */}
                    <div className="absolute top-10 left-10 z-50 flex flex-col items-start space-y-2 pointer-events-none">
                        <img src={logo} alt="Autoform" className="w-32 h-auto grayscale brightness-200 opacity-30" />
                        <div className="flex items-center space-x-3 pl-1 opacity-20">
                            <div className="w-1 h-1 bg-accent-gold rounded-full" />
                            <p className="text-[6px] text-white tracking-[0.4em] uppercase font-medium">
                                Synthesis: v1.5_Flash • Output: Nominal
                            </p>
                        </div>
                    </div>
                </div>

                {/* Overlays: Toolbar, Navigation, Controls */}
                <div className="h-full w-full relative z-50 flex flex-col pointer-events-none">
                    
                    {/* Top-Right Technical Overlay: System Calibration */}
                    <div className="absolute top-10 right-10 z-50 flex items-center space-x-6 pointer-events-auto">
                        <div className="flex flex-col items-end space-y-1">
                            <p className="text-[7px] text-zinc-500 tracking-[0.4em] uppercase">System: Calibration</p>
                            <div className="flex items-center space-x-2">
                                <motion.div 
                                    animate={{ opacity: [1, 0.4, 1], scale: [1, 1.2, 1] }} 
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="w-1.5 h-1.5 bg-accent-gold rounded-full shadow-[0_0_10px_rgba(212,175,55,0.8)]" 
                                />
                                <p className="text-[8px] text-white font-bold tracking-[0.2em] uppercase">Active Heartbeat</p>
                            </div>
                        </div>
                        <div className="h-8 w-[1px] bg-white/10" />
                        <div className="relative group">
                            <button className="p-3 glass-panel rounded-full hover:bg-white/10 transition-colors border-white/10">
                                <Info className="w-3 h-3 text-zinc-500 group-hover:text-white transition-colors" />
                            </button>
                            
                            {/* Premium Disclaimer Tooltip */}
                            <div className="absolute top-14 right-0 w-48 p-4 glass-panel border border-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none shadow-2xl backdrop-blur-3xl z-50">
                                <p className="text-[7px] leading-relaxed tracking-[0.1em] text-zinc-400 uppercase">
                                    All synthesized images & designs are property of <span className="text-white font-bold">Autoform India</span>. For demonstration purposes only.
                                </p>
                            </div>
                        </div>
                    </div>


                    {/* Gallery Navigation: Removed Center Arrows for specific View Toggles at bottom */}
                    <div className="flex-1" />

                    <div className="p-8 pb-12 mt-auto flex items-center justify-center relative w-full pointer-events-auto">
                        {/* Centered View Toggles (High-Fidelity) */}
                        <div className="glass-panel p-1.5 rounded-full flex items-center shadow-2xl border border-white/10 bg-black/40 backdrop-blur-3xl">
                            <button 
                                onClick={() => setViewMode('front')}
                                className={`px-10 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.3em] transition-all duration-700 ${
                                    viewMode === 'front' ? 'bg-white text-black shadow-xl scale-105' : 'text-zinc-500 hover:text-white'
                                }`}
                            >
                                Front View
                            </button>
                            <button 
                                onClick={() => setViewMode('rear')}
                                className={`px-10 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.3em] transition-all duration-700 ${
                                    viewMode === 'rear' ? 'bg-white text-black shadow-xl scale-105' : 'text-zinc-500 hover:text-white'
                                }`}
                            >
                                Rear View
                            </button>
                        </div>
                        
                        {/* Status indicators below console */}
                        <div className="absolute bottom-6 text-[6px] tracking-[0.5em] text-zinc-600 uppercase flex items-center space-x-4 opacity-40">
                             <span>Autoform AI v1.5 Stable</span>
                             <div className="w-1 h-1 bg-accent-gold rounded-full shadow-[0_0_5px_rgba(212,175,55,1)]" />
                             <span>Secure Studio Environment</span>
                        </div>

                        {/* Action Buttons (Pinned Right) */}
                        <div className="absolute right-8 flex items-center space-x-4">
                           <button 
                                onClick={handleDownload}
                                className={`p-4 glass-panel rounded-full transition-all duration-500 border border-white/10 shadow-xl group ${
                                    currentImage ? "hover:bg-white text-white hover:text-black cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.1)]" : "opacity-20 cursor-not-allowed"
                                }`}
                                title="Download Cinematic Result"
                           >
                               <Download className="w-4 h-4 transition-transform group-hover:scale-110" />
                           </button>
                        </div>
                    </div>

                </div>
            </section>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
