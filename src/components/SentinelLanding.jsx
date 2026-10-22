import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Compass } from 'lucide-react';

export default function SentinelLanding({ onEnterCockpit }) {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Keyboard shortcut listener to enter Cockpit
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'c' || e.key === 'C' || e.key === 'Enter' || e.key === ' ') {
        onEnterCockpit?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onEnterCockpit]);

  // Track mouse coordinates for subtle parallax
  const handleMouseMove = (e) => {
    const { clientWidth, clientHeight } = document.documentElement;
    const normX = (e.clientX / clientWidth - 0.5) * 2;
    const normY = (e.clientY / clientHeight - 0.5) * 2;
    setMouseOffset({ x: normX, y: normY });
  };

  return (
    <div 
      className="relative w-full h-screen overflow-hidden bg-[#0d0d0f] font-sans select-none"
      onMouseMove={handleMouseMove}
    >
      {/* =========================================================================
          LAYER 1 (z-10): Razor-Sharp Photographic Mountain Panorama (Sky & Ridges)
          Clean, crisp, no dark murky overlays, peaks fully visible at top!
          ========================================================================= */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        <img 
          src="/mountain_bg_sharp.jpg" 
          alt="Crystal Clear Alpine Landscape"
          className="w-full h-full object-cover filter contrast-[1.06] brightness-[1.02]"
          style={{
            objectPosition: 'center 0%',
            transform: `scale(1.04) translate3d(${mouseOffset.x * -6}px, ${mouseOffset.y * -3}px, 0)`,
            transition: 'transform 0.4s cubic-bezier(0.2, 0, 0.2, 1)'
          }}
        />
      </div>

      {/* =========================================================================
          LAYER 2 (z-20): Crisp Mid-Ground Floating Clouds (Behind Foreground Peaks)
          Distinct, billowy clouds drifting naturally across mountain ridges.
          ========================================================================= */}
      <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none mix-blend-screen">
        <div 
          className="absolute inset-x-[-30%] top-[14%] h-[35%] pointer-events-none"
          style={{
            transform: `translate3d(${mouseOffset.x * 12}px, ${mouseOffset.y * 3}px, 0)`
          }}
        >
          <div className="w-full h-full animate-cloud-slow opacity-80">
            <img 
              src="/crisp_cloud_1.png" 
              alt="Crisp Ridge Clouds" 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
      </div>

      {/* =========================================================================
          LAYER 3 (z-30): Razor-Sharp Foreground Mountain Peaks (Transparent Sky)
          Locks 1:1 with Layer 1, providing pure crisp rock textures and jagged ridges.
          ========================================================================= */}
      <div className="absolute inset-0 z-30 overflow-hidden pointer-events-none">
        <img 
          src="/mountain_fg_sharp.png" 
          alt="Foreground Mountain Ridges"
          className="w-full h-full object-cover filter contrast-[1.06] brightness-[1.02]"
          style={{
            objectPosition: 'center 0%',
            transform: `scale(1.04) translate3d(${mouseOffset.x * -6}px, ${mouseOffset.y * -3}px, 0)`,
            transition: 'transform 0.4s cubic-bezier(0.2, 0, 0.2, 1)'
          }}
        />
      </div>

      {/* =========================================================================
          LAYER 4 (z-40): Crisp Foreground Drifting Clouds Across Valley
          Clear, visible horizontal cloud drift flowing across the valley gap.
          ========================================================================= */}
      <div className="absolute inset-0 z-40 overflow-hidden pointer-events-none mix-blend-screen">
        <div 
          className="absolute inset-x-[-30%] top-[40%] h-[34%] pointer-events-none"
          style={{
            transform: `translate3d(${mouseOffset.x * 20}px, ${mouseOffset.y * 5}px, 0)`
          }}
        >
          <div className="w-full h-full animate-cloud-valley opacity-85">
            <img 
              src="/crisp_cloud_2.png" 
              alt="Valley Floating Clouds" 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
      </div>

      {/* =========================================================================
          CENTERED ROUND COCKPIT BUTTON (z-50)
          Centered horizontally in a sleek circular round button with ambient glow.
          ========================================================================= */}
      <div className="absolute bottom-10 md:bottom-14 left-1/2 -translate-x-1/2 z-50 pointer-events-auto flex flex-col items-center gap-2">
        
        {/* Pulsing Outer Ring */}
        <div className="relative group">
          <div className="absolute -inset-2 rounded-full bg-white/10 blur-sm group-hover:bg-white/20 transition-all duration-500 animate-pulse" />
          
          {/* Main Circular Round Button */}
          <button 
            onClick={onEnterCockpit}
            className="relative flex flex-col items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-black/85 hover:bg-black text-white backdrop-blur-xl border-2 border-white/30 hover:border-white shadow-[0_12px_40px_rgba(0,0,0,0.65)] hover:shadow-[0_16px_50px_rgba(255,255,255,0.25)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            title="Launch SRE Cockpit (or Press 'C')"
          >
            {/* Top Compass/Arrow Icon */}
            <ArrowUpRight 
              size={22} 
              className="text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" 
            />
            
            {/* Center Label */}
            <span className="text-[10px] md:text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-white/95 mt-1">
              COCKPIT
            </span>

            {/* Subtle Status Light Dot */}
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
          </button>
        </div>

        {/* Minimalist Hint Below Button */}
        <span className="text-[10px] font-mono tracking-widest uppercase text-white/40 drop-shadow">
          PRESS [C] OR CLICK TO ENTER
        </span>

      </div>

    </div>
  );
}
