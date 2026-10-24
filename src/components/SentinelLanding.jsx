import React, { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';

// ============================================================================
// Interactive 3D Point-Cloud Particle Sphere
// ============================================================================
function ParticleGlobe() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    const dpr = window.devicePixelRatio || 1;

    const setupCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = (rect.width || 120) * dpr;
      canvas.height = (rect.height || 120) * dpr;
    };
    setupCanvas();

    let width = canvas.width;
    let height = canvas.height;

    const NUM_POINTS = 340;
    const points = [];
    let radius = Math.min(width, height) * 0.38;

    for (let i = 0; i < NUM_POINTS; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / NUM_POINTS);
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);

      points.push({
        baseX: radius * Math.sin(phi) * Math.cos(theta),
        baseY: radius * Math.sin(phi) * Math.sin(theta),
        baseZ: radius * Math.cos(phi),
      });
    }

    let rotX = 0.25;
    let rotY = 0;
    const speedY = 0.008;

    const handleResize = () => {
      if (!canvas) return;
      setupCanvas();
      width = canvas.width;
      height = canvas.height;
      radius = Math.min(width, height) * 0.38;
      for (let i = 0; i < points.length; i++) {
        const phi = Math.acos(1 - 2 * (i + 0.5) / NUM_POINTS);
        const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
        points[i].baseX = radius * Math.sin(phi) * Math.cos(theta);
        points[i].baseY = radius * Math.sin(phi) * Math.sin(theta);
        points[i].baseZ = radius * Math.cos(phi);
      }
    };

    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      rotY += speedY;
      rotX += 0.0015;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const cx = width / 2;
      const cy = height / 2;

      const projected = [];

      for (let i = 0; i < points.length; i++) {
        const p = points[i];

        const x1 = p.baseX * cosY - p.baseZ * sinY;
        const z1 = p.baseZ * cosY + p.baseX * sinY;

        const y2 = p.baseY * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.baseY * sinX;

        const fov = radius * 2.4;
        const scale = fov / (fov + z2);
        const px = cx + x1 * scale;
        const py = cy + y2 * scale;
        const alpha = Math.max(0.12, Math.min(0.95, (z2 + radius) / (2 * radius)));

        projected.push({ px, py, scale, alpha, z: z2 });
      }

      projected.sort((a, b) => a.z - b.z);

      for (let i = 0; i < projected.length; i++) {
        const pt = projected[i];
        const dotSize = Math.max(0.7, pt.scale * 1.2 * dpr);

        ctx.beginPath();
        ctx.arc(pt.px, pt.py, dotSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${pt.alpha * 0.9})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block cursor-grab active:cursor-grabbing"
    />
  );
}

// ============================================================================
// Delicate 12-Point Radial Starburst Icon
// ============================================================================
function StarburstIcon() {
  return (
    <svg viewBox="0 0 36 36" className="w-6 h-6 xl:w-7 xl:h-7 text-white/90" fill="none" stroke="currentColor">
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
        <g key={deg} transform={`rotate(${deg} 18 18)`}>
          <line x1="18" y1="18" x2="18" y2="4.5" stroke="rgba(255,255,255,0.75)" strokeWidth="1" />
          <circle cx="18" cy="4" r="1.1" fill="white" />
        </g>
      ))}
      <circle cx="18" cy="18" r="1.4" fill="white" />
    </svg>
  );
}

// ============================================================================
// Sentinel Landing Page (Strict Single-Viewport, Zero Scroll)
// ============================================================================
export default function SentinelLanding({ onEnterCockpit }) {
  // Global keyboard shortcut to launch Cockpit
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'c' || e.key === 'C' || e.key === 'Enter') {
        onEnterCockpit?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onEnterCockpit]);

  return (
    <div className="h-screen max-h-screen w-full bg-[#050505] text-white font-sans overflow-hidden flex flex-col justify-between px-8 sm:px-12 lg:px-16 xl:px-20 pb-6 select-none selection:bg-white selection:text-black" style={{ paddingTop: '64px' }}>

      {/* =====================================================================
          MAIN SECTION: ZERO SCROLL, PROPORTIONAL FIT
          ===================================================================== */}
      <main className="flex-1 w-full max-w-[1720px] mx-auto flex items-start" style={{ marginTop: '1px' }}>

        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 items-start">

          {/* =================================================================
              LEFT SIDE (Cols 1-9): Horizontally Extended White Block
              ================================================================= */}
          <div className="lg:col-span-9 xl:col-span-9 flex flex-col justify-start w-full">

            <div className="relative w-full" style={{ marginTop: '1px' }}>
              {/* Primary Harmoniously Aligned White Block */}
              <div
                className="w-full bg-white text-black rounded-[36px] sm:rounded-[44px] lg:rounded-[52px] px-10 sm:px-14 lg:px-16 xl:px-20 py-12 sm:py-14 lg:py-16 shadow-[0_24px_60px_rgba(0,0,0,0.6)] flex flex-col justify-center"
                style={{ minHeight: '420px' }}
              >
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[72px] xl:text-[84px] 2xl:text-[96px] font-bold tracking-tight text-neutral-950 leading-none select-text">
                  XERNEAS
                </h1>
              </div>
            </div>

            {/* Bottom-Left Descriptive Micro-copy & Discover Link */}
            <div className="mt-6 lg:mt-5 max-w-md">
              <button
                onClick={onEnterCockpit}
                className="group inline-flex items-center gap-2 text-[13px] xl:text-[14px] font-medium text-white pb-1 border-b border-white/60 hover:border-white transition-all cursor-pointer"
              >
                <span>Discover more</span>
                <ArrowUpRight
                  size={15}
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </button>
            </div>

          </div>

          {/* =================================================================
              RIGHT SIDE (Cols 10-12): Compact Smaller Bento Tiles
              ================================================================= */}
          <div className="lg:col-span-3 xl:col-span-3 flex justify-end">
            <div className="grid grid-cols-2 gap-3.5 xl:gap-4 w-full max-w-[300px] xl:max-w-[340px]">

              {/* ROW 1: Left = "+ Intelligence" Feature */}
              <div className="flex flex-col justify-center pr-1">
                <span className="text-white/60 text-base font-light leading-none">+</span>
                <h3 className="text-white text-sm xl:text-base font-semibold mt-1 tracking-tight">
                  Intelligence
                </h3>
                <p className="text-neutral-400 text-[11px] xl:text-[12px] mt-1 leading-relaxed">
                  Smarter systems for faster, better decisions.
                </p>
              </div>

              {/* ROW 1: Right = Standalone White Rounded Tile with Arrow */}
              <div className="flex justify-center items-center">
                <button
                  onClick={onEnterCockpit}
                  className="group w-full aspect-square rounded-[20px] xl:rounded-[26px] bg-white text-black flex items-center justify-center shadow-md hover:scale-[1.04] active:scale-95 transition-all duration-300 cursor-pointer"
                  title="Launch Cockpit"
                >
                  <ArrowUpRight
                    size={32}
                    strokeWidth={2.4}
                    className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </button>
              </div>

              {/* ROW 2: Left = The 3D Point-Cloud Particle Sphere Tile */}
              <div className="w-full aspect-square rounded-[20px] xl:rounded-[26px] bg-[#0c0c0e] border border-white/10 p-2 flex items-center justify-center overflow-hidden shadow-[inset_0_0_30px_rgba(255,255,255,0.03)] hover:border-white/30 transition-colors">
                <ParticleGlobe />
              </div>

              {/* ROW 2: Right = "+ Connection" Feature */}
              <div className="flex flex-col justify-center pl-1">
                <span className="text-white/60 text-base font-light leading-none">+</span>
                <h3 className="text-white text-sm xl:text-base font-semibold mt-1 tracking-tight">
                  Connection
                </h3>
                <p className="text-neutral-400 text-[11px] xl:text-[12px] mt-1 leading-relaxed">
                  Bridging people, data and ideas seamlessly.
                </p>
              </div>

              {/* ROW 3: Left = "+ Impact" with Radial Starburst */}
              <div className="flex flex-col justify-center pr-1">
                <div className="mb-1">
                  <StarburstIcon />
                </div>
                <h3 className="text-white text-sm xl:text-base font-semibold tracking-tight">
                  Impact
                </h3>
                <p className="text-neutral-400 text-[11px] xl:text-[12px] mt-1 leading-relaxed">
                  Creating sustainable value for business and society.
                </p>
              </div>

              {/* ROW 3: Right = Connected White Rounded Tile */}
              <div className="w-full aspect-square rounded-[20px] xl:rounded-[26px] bg-white transition-transform duration-300 hover:scale-[1.02] shadow-sm" />

              {/* ROW 4: Left = Connected White Rounded Tile */}
              <div className="w-full aspect-square rounded-[20px] xl:rounded-[26px] bg-white transition-transform duration-300 hover:scale-[1.02] shadow-sm" />

              {/* ROW 4: Right = Connected White Rounded Tile */}
              <div className="w-full aspect-square rounded-[20px] xl:rounded-[26px] bg-white transition-transform duration-300 hover:scale-[1.02] shadow-sm" />

            </div>
          </div>

        </div>

      </main>

      {/* =====================================================================
          BOTTOM STATUS FOOTER (Fits smoothly inside viewport)
          ===================================================================== */}
      <footer className="w-full max-w-[1720px] mx-auto pt-2 flex items-center justify-between text-[11px] text-white/25 font-mono tracking-widest uppercase">
        <span>XERNEAS // ARCHITECTURE</span>
        <span className="hidden sm:inline">PRESS [C] OR CLICK ARROW TO ENTER</span>
        <span>AUTONOMOUS ENGINE</span>
      </footer>

    </div>
  );
}
