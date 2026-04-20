import React, { useState, useRef, useEffect } from 'react';
import { animate } from 'animejs/animation';
import { ChevronDown, Search } from 'lucide-react';
import { VEHICLE_DATA } from '../mockData';

const CustomDropdown = ({ label, options, selected, onSelect, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const menuRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    if (isOpen) {
      if (menuRef.current) {
        animate(menuRef.current, {
          opacity: [0, 1],
          translateY: [-10, 0],
          duration: 400,
          easing: 'easeOutExpo'
        });
      }
      
      const targets = itemsRef.current.filter(el => el !== null);
      if (targets.length > 0) {
        animate(targets, {
          opacity: [0, 1],
          translateX: [-10, 0],
          delay: (el, i) => i * 30,
          duration: 400,
          easing: 'easeOutExpo'
        });
      }
    }
  }, [isOpen]);

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full group">
      <label className="text-[9px] uppercase tracking-[0.3em] text-zinc-500 mb-2 block font-bold">
        {label}
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-12 glass-panel px-4 flex items-center justify-between text-white hover:border-zinc-500 transition-all duration-300 rounded-lg group"
      >
        <span className={`text-[10px] tracking-widest truncate max-w-[85%] ${!selected ? "text-zinc-500" : "text-white font-medium"}`}>
          {selected || placeholder}
        </span>
        <ChevronDown 
          className={`w-3 h-3 text-zinc-500 group-hover:text-white transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`} 
        />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div 
            ref={menuRef}
            className="absolute top-14 left-0 w-full bg-zinc-950/95 backdrop-blur-3xl z-50 overflow-hidden rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 origin-top"
          >
            <div className="p-3 border-b border-white/5 bg-white/5">
              <div className="relative flex items-center">
                <Search className="absolute left-3 w-3 h-3 text-zinc-500" />
                <input
                  type="text"
                  placeholder="SEARCH..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border-none text-[10px] tracking-[0.2em] text-white pl-9 py-2.5 rounded-md focus:ring-0 placeholder:text-zinc-600 uppercase"
                  autoFocus
                />
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto py-2 custom-scrollbar">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt, i) => (
                  <button
                    key={opt}
                    ref={el => itemsRef.current[i] = el}
                    onClick={() => {
                      onSelect(opt);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className={`w-full text-left px-5 py-3 text-[10px] tracking-[0.2em] uppercase hover:bg-white/10 transition-colors ${
                      selected === opt ? "text-accent-gold font-bold" : "text-zinc-400"
                    }`}
                  >
                    {opt}
                  </button>
                ))
              ) : (
                <div className="px-5 py-4 text-[10px] text-zinc-600 uppercase tracking-widest">No results found</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const VehicleSelector = ({ selectedBrand, setSelectedBrand, selectedModel, setSelectedModel }) => {
  const brands = VEHICLE_DATA.map(v => v.brand);
  const models = VEHICLE_DATA.find(b => b.brand === selectedBrand)?.models || [];

  return (
    <div className="flex flex-col space-y-5 w-full">
        <CustomDropdown
          label="Select Brand"
          options={brands}
          selected={selectedBrand}
          onSelect={(val) => {
            setSelectedBrand(val);
            setSelectedModel('');
          }}
          placeholder="CHOOSE BRAND"
        />
        <CustomDropdown
          label="Select Model"
          options={models}
          selected={selectedModel}
          onSelect={setSelectedModel}
          placeholder={selectedBrand ? "CHOOSE MODEL" : "SELECT BRAND FIRST"}
        />
    </div>
  );
};

export default VehicleSelector;
