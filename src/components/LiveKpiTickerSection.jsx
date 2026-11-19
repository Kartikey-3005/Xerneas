import React from 'react';
import { motion } from 'framer-motion';

export default function LiveKpiTickerSection() {
  const KPIS = [
    {
      label: "MTTD",
      sublabel: "Mean Time to Detect",
      value: "8.4s",
      comparison: "p99 Isolation Forest",
      badge: "SUB-SECOND ML",
    },
    {
      label: "MTTR",
      sublabel: "Mean Time to Resolve",
      value: "1m 42s",
      comparison: "vs. Industry Avg 4.2h",
      badge: "99.3% FASTER",
    },
    {
      label: "Precision",
      sublabel: "Autonomous Remediation",
      value: "97.4%",
      comparison: "LangGraph Multi-Turn RCA",
      badge: "ZERO HALLUCINATION",
    },
    {
      label: "Blast Radius",
      sublabel: "Sandbox Breaches",
      value: "0",
      comparison: "100% Isolated Containers",
      badge: "ZERO-TRUST VERIFIED",
    },
  ];

  return (
    <section className="relative w-full min-h-[75vh] bg-black overflow-hidden z-20 pt-28 pb-40 px-6 sm:px-10 lg:px-16 flex flex-col items-center justify-center">
      
      {/* ── Section Header with Ample Margin ── */}
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center mb-16 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-tight font-exo mb-6">
          Live Key Performance Indicators
        </h2>
        <br></br>
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          High-frequency reliability metrics quantified in production: from sub-second Isolation Forest detection to automated, zero-blast-radius self-healing.
        </p>
        <br></br>
      </div>

      {/* ── Minimalist Monochromatic HUD Cards ── */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {KPIS.map((kpi, idx) => {
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              style={{
                padding: '36px 30px',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                backgroundColor: 'rgba(18, 18, 18, 0.85)',
                backdropFilter: 'blur(16px)',
                boxShadow: `0 16px 40px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.06)`,
              }}
              className="flex flex-col justify-between group hover:border-white/30 transition-all duration-300"
            >
              {/* Top Row: Metric Tag & Micro Status Badge */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono tracking-widest text-zinc-400 uppercase font-semibold">
                  {kpi.label}
                </span>
                <span className="text-[9px] font-mono font-semibold px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.04] text-zinc-300">
                  {kpi.badge}
                </span>
              </div>

              {/* Middle: Prominent Clean White Counter */}
              <div className="my-4">
                <div className="text-4xl sm:text-5xl font-mono font-bold tracking-tight text-white">
                  {kpi.value}
                </div>
                <div className="text-xs text-zinc-400 font-medium mt-2 font-exo">
                  {kpi.sublabel}
                </div>
              </div>

              {/* Bottom: Sub-metric comparison */}
              <div className="pt-5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span>{kpi.comparison}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
