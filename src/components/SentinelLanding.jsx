import React, { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';

// ============================================================================
// Interactive 3D Point-Cloud Particle Sphere
// Pure monochrome white/gray dotted spherical particle visualization
// ============================================================================
function ParticleGlobe() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, isHovered: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    const dpr = window.devicePixelRatio || 1;

    const setupCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const size = Math.max(rect.width || 140, rect.height || 140);
      canvas.width = size * dpr;
      canvas.height = size * dpr;
    };
    setupCanvas();

    let width = canvas.width;
    let height = canvas.height;

    const NUM_POINTS = 380;
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
    const targetSpeedY = 0.007;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const my = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      mouseRef.current = { x: mx, y: my, isHovered: true };
    };

    const handleMouseLeave = () => {
      mouseRef.current.isHovered = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

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

      if (mouseRef.current.isHovered) {
        rotY += targetSpeedY + mouseRef.current.x * 0.012;
        rotX += (mouseRef.current.y * 0.35 - rotX) * 0.05;
      } else {
        rotY += targetSpeedY;
        rotX += (0.2 - rotX) * 0.02;
      }

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

        const fov = radius * 2.5;
        const scale = fov / (fov + z2);
        const px = cx + x1 * scale;
        const py = cy + y2 * scale;
        const alpha = Math.max(0.12, Math.min(0.95, (z2 + radius) / (2 * radius)));

        projected.push({ px, py, scale, alpha, z: z2 });
      }

      projected.sort((a, b) => a.z - b.z);

      for (let i = 0; i < projected.length; i++) {
        const pt = projected[i];
        const dotSize = Math.max(0.7, pt.scale * 1.25 * dpr);

        ctx.beginPath();
        ctx.arc(pt.px, pt.py, dotSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${pt.alpha * 0.95})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block cursor-pointer"
    />
  );
}

// ============================================================================
// Delicate 12-Point Radial Starburst Icon (✳)
// ============================================================================
function StarburstIcon() {
  return (
    <svg viewBox="0 0 36 36" className="w-6 h-6 xl:w-7 xl:h-7 text-white" fill="none">
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
        <g key={deg} transform={`rotate(${deg} 18 18)`}>
          <line
            x1="18"
            y1="18"
            x2="18"
            y2="4.5"
            stroke="rgba(255,255,255,0.85)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <circle cx="18" cy="4" r="1.3" fill="white" />
        </g>
      ))}
      <circle cx="18" cy="18" r="1.6" fill="white" />
    </svg>
  );
}

// ============================================================================
// Sentinel Landing Page — Strict Visual Replication of References
// ============================================================================
export default function SentinelLanding({ onEnterCockpit }) {
  // Global keyboard shortcut to launch Cockpit via [C] key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) return;
      if (e.key === 'c' || e.key === 'C') {
        onEnterCockpit?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onEnterCockpit]);

  return (
    <div className="h-screen max-h-screen w-full bg-[#000000] text-white font-sans overflow-hidden flex flex-col justify-between px-6 sm:px-10 lg:px-14 xl:px-20 pt-6 sm:pt-8 pb-14 select-none selection:bg-white selection:text-black">

      {/* =====================================================================
          MAIN CANVAS: Modular Unit Grid (Strict 4-Row System)
          ===================================================================== */}
      <main className="flex-1 w-full max-w-[1480px] mx-auto flex items-center justify-center my-auto">
        <div
          className="w-full flex flex-col lg:flex-row items-stretch justify-between gap-4 sm:gap-5 xl:gap-6"
          style={{
            // Base unit tile size dynamically computed from viewport height
            '--tile-size': 'clamp(110px, 15.5vh, 160px)',
            '--gap': '16px',
            '--radius': '32px',
          }}
        >

          {/* =================================================================
              LEFT HERO SECTION: Interlocking Puzzle Shape + Black Cutout
              Top: Connected White block containing "XERNEAS" (spans Rows 1 & 2)
              Bottom-Right: White stepped-down leg (spans Row 3)
              Bottom-Left: Negative space cutout for description & CTA (Rows 3 & 4)
              ================================================================= */}
          <div className="flex-1 flex flex-col justify-between relative min-w-0">

            {/* TOP WHITE CONNECTED SECTION (Spans Rows 1 & 2) */}
            <div
              className="w-full bg-[#FFFFFF] text-black rounded-[36px] flex items-center px-8 sm:px-12 lg:px-14 xl:px-16 relative z-10"
              style={{
                height: 'calc(2 * var(--tile-size) + var(--gap))',
              }}
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[76px] xl:text-[88px] 2xl:text-[98px] font-black tracking-[-0.04em] text-[#000000] leading-none select-text">
                XERNEAS
              </h1>
            </div>

            {/* BOTTOM SECTION (Spans Rows 3 & 4) */}
            <div
              className="w-full flex items-stretch justify-between relative"
              style={{
                height: 'calc(2 * var(--tile-size) + var(--gap))',
                marginTop: 'var(--gap)',
              }}
            >

              {/* LOWER-LEFT COPY: Negative Space Cutout */}
              <div className="flex-1 flex flex-col justify-between py-2 sm:py-3 pr-6 z-10">
                <p className="text-sm sm:text-[15px] xl:text-base text-[#888888] leading-relaxed max-w-md font-normal">
                  We build intelligent systems<br />
                  that empower people, simplify<br />
                  complexity, and drive real impact<br />
                  in a connected world.
                </p>

                <div className="pt-4">
                  <button
                    onClick={onEnterCockpit}
                    className="group inline-flex items-center gap-2 text-sm sm:text-base font-medium text-white pb-1 border-b border-white/60 hover:border-white transition-all cursor-pointer"
                  >
                    <span>Discover more</span>
                    <ArrowUpRight
                      size={18}
                      className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </button>
                </div>
              </div>

              {/* STEPPED-DOWN WHITE INTERLOCKING LEG (Row 3 Right) */}
              <div
                className="relative flex-shrink-0"
                style={{ width: 'var(--tile-size)' }}
              >
                {/* Continuous White Leg: Sits in Row 3 and seamlessly extends upwards to join the Top Block */}
                <div
                  className="w-full bg-[#FFFFFF] rounded-b-[32px] relative z-10"
                  style={{
                    height: 'var(--tile-size)',
                    marginTop: 'calc(-1 * var(--gap))',
                    paddingTop: 'var(--gap)',
                  }}
                >
                  {/* CONCAVE / INVERTED FILLETS: Smooth organic curve bridging Left Cutout and Stepped Leg */}
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    className="absolute -left-8 top-0 pointer-events-none select-none"
                    style={{ width: '32px', height: '32px' }}
                  >
                    <path
                      d="M 0 0 H 32 V 32 C 32 14.33 17.67 0 0 0 Z"
                      fill="#FFFFFF"
                    />
                  </svg>
                </div>
              </div>

            </div>

          </div>

          {/* =================================================================
              RIGHT-SIDE INTERLOCKING BENTO MODULES (2-Column Grid × 4 Rows)
              ================================================================= */}
          <div
            className="flex-shrink-0 grid grid-cols-2 gap-[var(--gap)]"
            style={{
              width: 'calc(2 * var(--tile-size) + var(--gap))',
            }}
          >

            {/* ROW 1: Left = INTELLIGENCE BLOCK, Right = Arrow Tile (White) */}
            <div
              className="flex flex-col justify-center pr-2"
              style={{ height: 'var(--tile-size)' }}
            >
              <span className="text-white/60 text-base sm:text-lg font-light leading-none">+</span>
              <h3 className="text-white text-sm sm:text-base xl:text-lg font-bold mt-1.5 tracking-tight">
                Intelligence
              </h3>
              <p className="text-[#888888] text-xs sm:text-[13px] mt-1 leading-snug">
                Smarter systems<br />
                for faster, better<br />
                decisions.
              </p>
            </div>

            <button
              onClick={onEnterCockpit}
              className="group aspect-square rounded-[32px] bg-[#FFFFFF] text-black flex items-center justify-center hover:scale-[1.03] active:scale-95 transition-transform duration-300 cursor-pointer"
              style={{ width: 'var(--tile-size)', height: 'var(--tile-size)' }}
              title="Launch Cockpit"
            >
              <ArrowUpRight
                size={36}
                strokeWidth={2.4}
                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </button>

            {/* ROW 2: Left = CENTER VISUAL (Particle Globe), Right = CONNECTION BLOCK */}
            <div
              className="aspect-square rounded-[32px] bg-[#0c0c0e] border border-white/10 p-2 flex items-center justify-center overflow-hidden hover:border-white/30 hover:scale-[1.02] transition-all duration-300"
              style={{ width: 'var(--tile-size)', height: 'var(--tile-size)' }}
            >
              <ParticleGlobe />
            </div>

            <div
              className="flex flex-col justify-center pl-2"
              style={{ height: 'var(--tile-size)' }}
            >
              <span className="text-white/60 text-base sm:text-lg font-light leading-none">+</span>
              <h3 className="text-white text-sm sm:text-base xl:text-lg font-bold mt-1.5 tracking-tight">
                Connection
              </h3>
              <p className="text-[#888888] text-xs sm:text-[13px] mt-1 leading-snug">
                Bridging people,<br />
                data and ideas<br />
                seamlessly.
              </p>
            </div>

            {/* ROW 3: Left = IMPACT BLOCK, Right = White Squircle Tile */}
            <div
              className="flex flex-col justify-center pr-2"
              style={{ height: 'var(--tile-size)' }}
            >
              <div className="mb-1.5">
                <StarburstIcon />
              </div>
              <h3 className="text-white text-sm sm:text-base xl:text-lg font-bold tracking-tight">
                Impact
              </h3>
              <p className="text-[#888888] text-xs sm:text-[13px] mt-1 leading-snug">
                Creating sustainable<br />
                value for business<br />
                and society.
              </p>
            </div>

            <div
              className="aspect-square rounded-[32px] bg-[#FFFFFF] hover:scale-[1.03] transition-transform duration-300"
              style={{ width: 'var(--tile-size)', height: 'var(--tile-size)' }}
            />

            {/* ROW 4: Two Solid White Squircle Tiles Side-by-Side */}
            <div
              className="aspect-square rounded-[32px] bg-[#FFFFFF] hover:scale-[1.03] transition-transform duration-300"
              style={{ width: 'var(--tile-size)', height: 'var(--tile-size)' }}
            />
            <div
              className="aspect-square rounded-[32px] bg-[#FFFFFF] hover:scale-[1.03] transition-transform duration-300"
              style={{ width: 'var(--tile-size)', height: 'var(--tile-size)' }}
            />

          </div>

        </div>
      </main>

      {/* =====================================================================
          FOOTER: Tiny, low-contrast, uppercase monospaced labels
          Left: XERNEAS // ARCHITECTURE
          Center: PRESS [C] OR CLICK ARROW TO ENTER
          Right: AUTONOMOUS ENGINE
          ===================================================================== */}
      <footer className="fixed bottom-0 left-0 right-0 w-full py-3.5 px-6 sm:px-10 lg:px-14 xl:px-20 border-t border-white/[0.08] bg-[#000000]/90 backdrop-blur-sm flex items-center justify-between text-xs font-mono tracking-widest uppercase text-[#888888] select-none z-20">
        <span>XERNEAS // ARCHITECTURE</span>
        <span className="hidden sm:inline">PRESS [C] OR CLICK ARROW TO ENTER</span>
        <span>AUTONOMOUS ENGINE</span>
      </footer>

    </div>
  );
}
