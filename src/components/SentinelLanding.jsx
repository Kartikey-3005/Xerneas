import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import GlassIconReveal from './GlassIconReveal';
import GatewayFlowBackground from './GatewayFlowBackground';
import AgentBentoGrid from './AgentBentoGrid';
import SandboxGuardrailSection from './SandboxGuardrailSection';
import LiveKpiTickerSection from './LiveKpiTickerSection';
import RagRunbookSearchSection from './RagRunbookSearchSection';
import XerneasFooter from './XerneasFooter';
import TechText from './TechText';
import { XERNEAS_SVG } from '../data/logoSvg';

export default function SentinelLanding({ onEnterCockpit }) {
  const [isRevealed, setIsRevealed] = useState(false);
  const isRevealedRef = useRef(false);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (isRevealedRef.current) return;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          if (scrollY > 20) {
            isRevealedRef.current = true;
            setIsRevealed(true);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="relative w-full bg-black text-white select-none">
      
      {/* =====================================================================
          SECTION 1: HERO
          - Perfectly centered Logo + XERNEAS Name with TechText interactive effect
          - Reduced gap between logo and text
          - Capsule arrow button to connect with dashboard
          ===================================================================== */}
      <section className="relative w-full h-screen min-h-screen flex flex-col items-center justify-center overflow-hidden z-20 bg-black">
        
        {/* Centered Lockup: Logo + XERNEAS Name */}
        <div className="relative flex items-center justify-center transition-all duration-700 ease-out">
          
          {/* Logo container */}
          <div className="relative flex-shrink-0 flex items-center justify-center">
            <GlassIconReveal
              logo={XERNEAS_SVG}
              look="dark"
              background="#000000"
              plateColor="#000000"
              logoColor="#ffffff"
              iconPlate={false}
              keepPlate={false}
              tileSize={340}
              logoScale={0.76}
              finalScale={0.92}
              speed={0.85}
              loop={false}
              label="Xerneas Logo"
              className="w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72"
            />
          </div>

          {/* Website Name: TechText with interactive hover/sweep/kick, draggable=false */}
          <div
            className="flex items-center transition-all duration-700 ease-out will-change-transform"
            style={{
              width: isRevealed ? 'clamp(340px, 40vw, 540px)' : '0px',
              maxWidth: isRevealed ? '540px' : '0px',
              height: '140px',
              opacity: isRevealed ? 1 : 0,
              marginLeft: isRevealed ? '0.35rem' : '0px',
              transform: isRevealed ? 'translate3d(0, 0, 0)' : 'translate3d(50px, 0, 0)',
              overflow: 'visible',
              pointerEvents: isRevealed ? 'auto' : 'none',
            }}
          >
            {isRevealed && (
              <TechText
                text="XERNEAS"
                fontWeight={600}
                fontSize={56}
                reveal="letter"
                dashLength={4}
                dashGap={2}
                specks={16}
                intro="metrics"
                introDuration={1.4}
                clickKick={true}
                guides={false}
                fontFamily="'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
                letterSpacing={0.14}
                accentColor="#ffffff"
                reach={220}
                softness={0.7}
                lineStyle="dashed"
                strokeWidth={1.5}
                speed={1}
                bounce={0.4}
                selection={true}
                labels={true}
                color="#ffffff"
                align="left"
                draggable={false}
                sweep={true}
                className="w-full h-full"
              />
            )}
          </div>
        </div>

        {/* Elongated Pill/Capsule Arrow Button */}
        <div className="mt-12 flex items-center justify-center z-30">
          <button
            onClick={onEnterCockpit}
            aria-label="Connect to Dashboard"
            title="Connect to Dashboard"
            className="group relative flex items-center justify-center w-24 h-10 sm:w-28 sm:h-11 rounded-full border border-white/20 bg-white/[0.04] hover:border-white hover:bg-white/10 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
          >
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-white/85 group-hover:text-white group-hover:translate-x-1.5 transition-all duration-300" />
          </button>
        </div>

      </section>

      {/* =====================================================================
          SECTION 2: GATEWAY FLOW TRANSITION SECTION
          - Follows right after the hero section with full display clearance
          - Unobstructed particle trajectory paths
          ===================================================================== */}
      <section className="relative w-full h-[70vh] sm:h-[85vh] bg-black overflow-hidden z-10">
        <GatewayFlowBackground speed={1} opacity={0.9} className="w-full h-full" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
      </section>

      {/* =====================================================================
          SECTION 3: LIVE AUTONOMOUS LOOPS (AGENT BENTO GRID)
          - Appears cleanly after Gateway Flow without overlap or clipping
          ===================================================================== */}
      <section className="relative w-full min-h-screen bg-black overflow-hidden z-20 pt-28 pb-40 px-6 sm:px-10 lg:px-16 flex flex-col items-center justify-center">
        {/* Section Heading with generous bottom margin */}
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center mb-20 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-tight font-exo">
            Live Automation Loops
          </h2>
          <br></br>
          <br></br>
        </div>

        <div className="w-full max-w-6xl mx-auto flex justify-center">
          <AgentBentoGrid className="w-full" />
        </div>
      </section>

      {/* =====================================================================
          SECTION 4: AST GUARDRAIL & ZERO-TRUST SANDBOX DEMONSTRATION
          Split-screen interactive comparison: Dangerous vs. Vetted AST
          ===================================================================== */}
      <SandboxGuardrailSection />

      {/* =====================================================================
          SECTION 5: LIVE KEY PERFORMANCE INDICATORS (TICKER / HUD COUNTERS)
          Monospaced futuristic reliability HUD: MTTD, MTTR, Precision, Blast Radius
          ===================================================================== */}
      <LiveKpiTickerSection />

      {/* =====================================================================
          SECTION 6: INTERACTIVE RAG RUNBOOK SEARCH (CMD+K STYLE)
          Sub-millisecond semantic vector search across Qdrant 384d architectures
          ===================================================================== */}
      <RagRunbookSearchSection />

      {/* =====================================================================
          SECTION 7: OUTWAY-STYLE EDITORIAL RED FOOTER
          - Bold tomato red background (#FF3B00)
          - Serif "Stay in the know" headline with underlined subscribe input
          - Multi-column site navigation (Platform, Explore, Support)
          - Giant full-bleed "XERNEAS" base typography
          ===================================================================== */}
      <XerneasFooter onEnterCockpit={onEnterCockpit} />

    </div>
  );
}