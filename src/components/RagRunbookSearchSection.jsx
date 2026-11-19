import React, { useState, useMemo } from 'react';
import { Search, CheckCircle } from 'lucide-react';
import { RUNBOOKS } from '../data/runbooks';

export default function RagRunbookSearchSection() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  const PRESET_QUERIES = [
    "postgres deadlock port 5432 connection starvation",
    "k8s OOMKilled RSS memory limit expansion",
    "gateway 504 timeouts cascading 5xx storm"
  ];

  const filteredRunbooks = useMemo(() => {
    if (!query.trim()) return RUNBOOKS;
    const qLower = query.toLowerCase();
    return RUNBOOKS.filter(rb => 
      rb.title.toLowerCase().includes(qLower) ||
      rb.symptom.toLowerCase().includes(qLower) ||
      rb.classification.toLowerCase().includes(qLower)
    );
  }, [query]);

  const activeRunbook = filteredRunbooks[activeTab] || filteredRunbooks[0] || RUNBOOKS[0];

  return (
    <section className="relative w-full min-h-screen bg-black overflow-hidden z-20 pt-28 pb-44 px-6 sm:px-10 lg:px-16 flex flex-col items-center justify-center">
      
      {/* ── Section Header with Ample Margin ── */}
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center mb-16 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-tight font-exo mb-6">
          Interactive RAG Runbook Search
        </h2>
        <br></br>
        <br></br>
      </div>

      {/* ── Main Command Palette Box with Strict Monochromatic Palette ── */}
      <div
        style={{
          borderRadius: '26px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          backgroundColor: 'rgba(18, 18, 18, 0.85)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
        }}
        className="w-full max-w-5xl mx-auto overflow-hidden text-white"
      >
        {/* Search Input Bar with Substantial Inset Padding */}
        <div className="p-6 sm:p-7 border-b border-white/10 flex items-center gap-4 bg-neutral-950/60">
          <Search className="w-5 h-5 text-zinc-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActiveTab(0); }}
            placeholder="Type incident symptom (e.g. postgres deadlock, OOMKilled pod, 504 gateway)..."
            className="w-full bg-transparent border-none text-sm sm:text-base text-white placeholder-zinc-500 focus:outline-none font-mono"
          />
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-md border border-white/10 bg-white/[0.04] text-[10px] font-mono text-zinc-400">
            <span>Cmd</span>
            <span>+</span>
            <span>K</span>
          </div>
        </div>

        {/* Preset Query Chips with Good Spacing */}
        <div className="px-6 sm:px-7 py-3.5 border-b border-white/5 bg-neutral-900/40 flex items-center gap-2.5 overflow-x-auto text-xs font-mono">
          <span className="text-zinc-500 uppercase tracking-widest shrink-0 text-[10px]">
            SUGGESTIONS:
          </span>
          {PRESET_QUERIES.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => { setQuery(preset); setActiveTab(0); }}
              className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 hover:border-white/30 text-zinc-400 hover:text-white transition-all shrink-0 cursor-pointer text-[11px]"
            >
              {preset}
            </button>
          ))}
          {query && (
            <button
              onClick={() => setQuery('')}
              className="ml-auto text-[11px] text-zinc-500 hover:text-zinc-300 underline cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Content Body: Split View with Plentiful Inner Margin */}
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[440px]">
          {/* Left Column: Result Runbook Cards */}
          <div className="md:col-span-5 border-r border-white/10 p-5 sm:p-6 flex flex-col gap-3 bg-neutral-950/40">
            <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1 px-1">
              SEMANTIC MATCHES ({filteredRunbooks.length})
            </div>

            {filteredRunbooks.map((rb, idx) => {
              const isSelected = activeTab === idx;
              return (
                <button
                  key={rb.id}
                  onClick={() => setActiveTab(idx)}
                  className={`text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-neutral-800/80 border-white/30 shadow-md'
                      : 'bg-neutral-900/30 border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded font-semibold bg-white/5 text-zinc-300 border border-white/10">
                      {rb.classification}
                    </span>
                    <span className="text-[10px] font-mono text-white font-bold">
                      {(rb.similarityScore * 100).toFixed(1)}% match
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-white truncate font-exo mt-1">
                    {rb.title}
                  </h4>
                  <p className="text-[10px] text-zinc-400 truncate mt-1">
                    {rb.symptom}
                  </p>
                </button>
              );
            })}

            {filteredRunbooks.length === 0 && (
              <div className="p-8 text-center text-zinc-500 text-xs font-mono">
                No direct vector match found. Try a broader search term.
              </div>
            )}
          </div>

          {/* Right Column: Code & Architecture Detail */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-neutral-900/20">
            {activeRunbook ? (
              <>
                <div>
                  <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
                    <div>
                      <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500">RUNBOOK IDENTIFIER</span>
                      <h3 className="text-sm sm:text-base font-semibold text-white font-exo mt-1">
                        {activeRunbook.title}
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500">VECTOR EMBEDDING</span>
                      <div className="text-xs font-mono text-zinc-300 font-semibold mt-1">
                        bge-small 384d
                      </div>
                    </div>
                  </div>

                  {/* Symptom Context Card */}
                  <div className="mb-5 text-xs font-mono text-zinc-400 bg-black/50 p-4 rounded-xl border border-white/5 leading-relaxed">
                    <span className="text-zinc-300 font-semibold">Symptom Signature: </span>
                    {activeRunbook.symptom}
                  </div>

                  {/* Remediation Script Terminal Preview */}
                  <div className="relative rounded-xl border border-white/10 bg-black/70 p-5 font-mono text-xs overflow-x-auto text-zinc-300 leading-relaxed">
                    <div className="flex items-center justify-between text-[10px] text-zinc-500 pb-2.5 mb-3 border-b border-white/10">
                      <span># remediation_plan.sh (AST Vetted)</span>
                      <span className="text-white flex items-center gap-1.5 font-semibold">
                        <CheckCircle className="w-3.5 h-3.5 text-white" /> VERIFIED
                      </span>
                    </div>
                    <pre className="whitespace-pre-wrap text-zinc-300">{activeRunbook.remediationScript}</pre>
                  </div>
                </div>

                {/* Footer Metadata Bar */}
                <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-zinc-400">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500">Target Entities:</span>
                    <span className="text-white font-semibold">{activeRunbook.targetEntities.join(', ')}</span>
                  </div>
                  <div className="text-white font-semibold">
                    Confidence: {(activeRunbook.similarityScore * 100).toFixed(1)}%
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
