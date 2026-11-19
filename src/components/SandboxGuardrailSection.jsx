import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, CheckCircle2, Lock } from 'lucide-react';
import { inspectCommandAST } from '../services/astGuardrail';

const DANGEROUS_SNIPPETS = [
  {
    name: "Wildcard Root Purge",
    cmd: `rm -rf / --no-preserve-root\necho "Cleaning disk space..."`,
    violation: "Root filesystem deletion (rm -rf /)",
    consequence: "Total node corruption, catastrophic data wipeout, cluster node unschedulable."
  },
  {
    name: "Raw Block Overwrite",
    cmd: `dd if=/dev/zero of=/dev/sda bs=1M count=100\nmkfs.ext4 /dev/sda1`,
    violation: "Raw block device overwriting (dd of=/dev/sda)",
    consequence: "Partition table destruction, persistent storage volume unrecoverable."
  },
  {
    name: "Fork-Bomb Injection",
    cmd: `:(){ :|:& };:\necho "Starting concurrent thread workers..."`,
    violation: "Bash fork bomb injection",
    consequence: "Linux kernel thread exhaustion, CPU lockup, cascading host reboot."
  },
  {
    name: "Auth Credential Mutation",
    cmd: `cat evil_keys >> /etc/passwd\nchmod 777 /`,
    violation: "System authentication file mutation (/etc/passwd)",
    consequence: "Root privilege escalation, zero-trust perimeter breach."
  }
];

export default function SandboxGuardrailSection() {
  const [selectedIdx, setSelectedIdx] = useState(0);

  const currentSnippet = DANGEROUS_SNIPPETS[selectedIdx];
  const guardrailInspection = inspectCommandAST(currentSnippet.cmd);

  return (
    <section className="relative w-full min-h-screen bg-black overflow-hidden z-20 pt-28 pb-40 px-6 sm:px-10 lg:px-16 flex flex-col items-center justify-center">
      
      {/* ── Section Header with Ample Breathing Room ── */}
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center mb-16 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-tight font-exo mb-6">
          The AST Guardrail &amp; Zero-Trust Sandbox
        </h2>
        <br></br>
        <br></br>

        {/* Preset Selector Chips with Clear Separation */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest mr-1">
            TEST SCENARIO:
          </span>
          {DANGEROUS_SNIPPETS.map((snip, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all duration-200 border cursor-pointer ${
                selectedIdx === idx
                  ? 'bg-white text-black border-white font-semibold shadow-[0_0_15px_rgba(255,255,255,0.25)]'
                  : 'bg-neutral-900/60 text-zinc-400 border-white/10 hover:border-white/30 hover:text-white'
              }`}
            >
              {snip.name}
            </button>
          ))}
        </div>
        <br></br>
        <br></br>
      </div>

      {/* ── Split-Screen Demonstration with Substantial Spacing ── */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        
        {/* LEFT: Unrestricted / Naive Agent (Minimal Monochrome / Subtle Rose) */}
        <div
          style={{
            padding: '36px 32px',
            borderRadius: '26px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            backgroundColor: 'rgba(18, 18, 18, 0.85)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          }}
          className="flex flex-col justify-between text-white group hover:border-white/20 transition-all duration-300"
        >
          <div>
            {/* Header with Title and Status */}
            <div className="flex items-center justify-between pb-5 mb-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/15 flex items-center justify-center text-zinc-300">
                  <AlertTriangle className="w-4 h-4 text-zinc-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg tracking-tight font-exo">
                    Unrestricted AI Agent (Naive)
                  </h3>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                    DIRECT HOST SHELL EXECUTION
                  </span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase font-semibold bg-white/5 text-zinc-400 border border-white/15">
                CRITICAL RISK
              </span>
            </div>

            {/* Terminal Preview with Generous Padding */}
            <div
              style={{
                padding: '24px 22px',
                borderRadius: '18px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backgroundColor: 'rgba(0, 0, 0, 0.7)'
              }}
              className="font-mono text-xs text-zinc-300 mb-6 overflow-x-auto leading-relaxed"
            >
              <div className="text-[10px] text-zinc-500 mb-3 pb-2 border-b border-white/10">
                $ bash -c "raw_agent_output.sh"
              </div>
              <pre className="whitespace-pre-wrap text-zinc-300">{currentSnippet.cmd}</pre>
            </div>

            {/* Description Bullet Items */}
            <div className="space-y-3 font-mono text-xs text-zinc-400 px-1">
              <div className="flex items-start gap-2.5">
                <span className="text-zinc-500 font-bold">—</span>
                <span>Zero AST validation: executed directly in privileged environment.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-zinc-500 font-bold">—</span>
                <span>Immediate blast radius: {currentSnippet.consequence}</span>
              </div>
            </div>
          </div>

          {/* Footer Status Bar */}
          <div className="mt-8 pt-5 border-t border-white/10 flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>Blast Radius: Uncontained</span>
            <span className="font-semibold text-zinc-300 uppercase tracking-wider">HALT FAILED</span>
          </div>
        </div>

        {/* RIGHT: Xerneas Guardrail (Clean Minimal Monochrome with Soft White/Emerald Accent) */}
        <div
          style={{
            padding: '36px 32px',
            borderRadius: '26px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            backgroundColor: 'rgba(20, 20, 20, 0.85)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
          }}
          className="flex flex-col justify-between text-white group hover:border-white/30 transition-all duration-300"
        >
          <div>
            {/* Header with Title and Zero Blast Radius Badge */}
            <div className="flex items-center justify-between pb-5 mb-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg tracking-tight font-exo">
                    Xerneas AST Guardrail
                  </h3>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                    AST LEXER + SCRATCH SANDBOX
                  </span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase font-semibold bg-white/10 text-white border border-white/20 flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-white" />
                ZERO BLAST RADIUS
              </span>
            </div>

            {/* Terminal Preview: AST Intercept with Generous Inset */}
            <div
              style={{
                padding: '24px 22px',
                borderRadius: '18px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: 'rgba(0, 0, 0, 0.7)'
              }}
              className="font-mono text-xs text-zinc-300 mb-6 overflow-x-auto leading-relaxed"
            >
              <div className="text-[10px] text-zinc-500 mb-3 pb-2 border-b border-white/10 flex items-center justify-between">
                <span>[AST_PARSER] sys_call_eval</span>
                <span className="text-white font-semibold">INTERCEPTED</span>
              </div>
              <div className="space-y-1.5 text-zinc-300">
                <p className="text-zinc-500">&gt; Parsing command AST tokens...</p>
                <p className="text-white font-medium">&gt; Threat Detected: {guardrailInspection.violations[0]?.rule || currentSnippet.violation}</p>
                <p className="text-zinc-400">&gt; Quarantined in Docker container: sha256:d8f2b1...</p>
                <p className="text-zinc-500">&gt; Flags: --net=none --read-only --user=nobody --cap-drop=ALL</p>
              </div>
            </div>

            {/* Bullet Details */}
            <div className="space-y-3 font-mono text-xs text-zinc-300 px-1">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-white" />
                <span>Deterministic AST rule engine blocks destructive wildcard patterns.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-white" />
                <span>Live production cluster insulated with 100% blast radius containment.</span>
              </div>
            </div>
          </div>

          {/* Footer Status Bar */}
          <div className="mt-8 pt-5 border-t border-white/10 flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400">Interception Latency: <strong className="text-white font-semibold">1.4ms</strong></span>
            <span className="text-white font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              PROTECTION ACTIVE
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
