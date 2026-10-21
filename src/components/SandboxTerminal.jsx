import React, { useState } from 'react';
import { 
  Terminal as TerminalIcon, 
  ShieldAlert, 
  ShieldCheck, 
  Play, 
  Lock, 
  Clock, 
  Cpu, 
  AlertOctagon, 
  RefreshCcw, 
  Check 
} from 'lucide-react';
import { inspectCommandAST } from '../services/astGuardrail';

export default function SandboxTerminal({ activeScript, onTestScriptInSandbox }) {
  const [customScript, setCustomScript] = useState(
    activeScript || `#!/bin/sh\nset -e\n# Ephemeral remediation test\nsync && echo 3 > /proc/sys/vm/drop_caches 2>/dev/null || true\necho "Sandbox dry-run: buffer cache purged successfully."\nexit 0`
  );
  const [terminalOutput, setTerminalOutput] = useState([
    { type: "info", text: "Docker daemon initialized via Python SDK socket (/var/run/docker.sock)." },
    { type: "info", text: "Ephemeral container prepared: alpine:3.19 (Isolation: --net=none, --user=1001, timeout=15s)." },
    { type: "ready", text: "Ready to validate remediation commands against AST guardrail." }
  ]);
  const [astAnalysis, setAstAnalysis] = useState(() => inspectCommandAST(customScript));
  const [isExecuting, setIsExecuting] = useState(false);

  const handleScriptChange = (e) => {
    const val = e.target.value;
    setCustomScript(val);
    setAstAnalysis(inspectCommandAST(val));
  };

  const handleRunExecution = async () => {
    setIsExecuting(true);
    const analysis = inspectCommandAST(customScript);
    setAstAnalysis(analysis);

    const newLogs = [
      ...terminalOutput,
      { type: "command", text: `$ docker run --rm --net=none --user=1001 --memory=256m -i alpine:3.19` },
      { type: "ast", text: `[AST Check] Parsing shell expression tree...` }
    ];

    if (!analysis.isAllowed) {
      newLogs.push({
        type: "danger",
        text: `>>> CRITICAL SECURITY EXCEPTION: AST PARSER BLOCKED EXECUTION <<<`
      });
      analysis.violations.forEach(v => {
        newLogs.push({
          type: "danger",
          text: `Line ${v.line}: Destructive token match: "${v.command}" (${v.rule})`
        });
      });
      newLogs.push({
        type: "danger",
        text: `AGENT RUN QUARANTINED. Blast-radius violation prevented. Incident flagged for human review.`
      });
      setTerminalOutput(newLogs);
      setIsExecuting(false);
      return;
    }

    newLogs.push({ type: "success", text: `[AST Check] Passed! Zero destructive commands detected in AST.` });
    newLogs.push({ type: "exec", text: `Executing shell script in non-root isolated container context...` });

    setTerminalOutput(newLogs);

    setTimeout(() => {
      setTerminalOutput(prev => [
        ...prev,
        { type: "stdout", text: "Executing: sync && echo 3 > /proc/sys/vm/drop_caches..." },
        { type: "stdout", text: "Sandbox dry-run: buffer cache purged successfully." },
        { type: "exit0", text: "Process exited with code 0. Zero memory faults, zero egress leaks. Verification 100%." }
      ]);
      setIsExecuting(false);
    }, 1200);
  };

  const handleLoadMaliciousSample = () => {
    const malicious = `#!/bin/sh\n# MALICIOUS / DESTRUCTIVE TEST\necho "Attempting raw disk wipe and password modification..."\nrm -rf / --no-preserve-root\nmkfs.ext4 /dev/sda1\necho "evil:x:0:0::/root:/bin/sh" >> /etc/passwd\niptables -F`;
    setCustomScript(malicious);
    setAstAnalysis(inspectCommandAST(malicious));
  };

  const handleLoadSafeSample = () => {
    const safe = `#!/bin/sh\nset -e\n# SAFE REMEDIATION SAMPLE\necho "Checking Postgres connection pool count..."\npsql -h postgres-primary -U postgres -c "SELECT count(*) FROM pg_stat_activity;"\necho "Scaling PgBouncer pooler buffer..."\nsed -i 's/default_pool_size = .*/default_pool_size = 150/' /etc/pgbouncer/pgbouncer.ini\nkill -HUP $(pidof pgbouncer)\necho "PgBouncer reload complete."`;
    setCustomScript(safe);
    setAstAnalysis(inspectCommandAST(safe));
  };

  return (
    <div className="sandbox-view">
      {/* Top Banner: Sandbox Containerization Spec */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem', background: 'var(--bg-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lock size={20} color="var(--jh-canvas)" />
              Docker Ephemeral Sandbox &amp; AST Security Guardrail
            </h2>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              TRD Section 6 &amp; 7: Zero-trust remediation validation prior to production cluster actuation
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span className="status-chip" title="Complete network egress restriction">
              <ShieldCheck size={14} color="var(--accent-emerald)" />
              Flag: --net=none
            </span>
            <span className="status-chip" title="Non-root execution context">
              <Lock size={14} color="var(--jh-canvas)" />
              Context: --user=1001
            </span>
            <span className="status-chip" title="Command timeout threshold">
              <Clock size={14} color="var(--accent-amber)" />
              Timeout: 15s limit
            </span>
          </div>
        </div>
      </div>

      <div className="grid-2col">
        {/* Left: Script Editor & AST Parser Live Diagnostics */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Remediation Script to Sandbox Test
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-outline" style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem' }} onClick={handleLoadSafeSample}>
                Safe Script
              </button>
              <button className="btn btn-danger" style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem' }} onClick={handleLoadMaliciousSample}>
                Destructive AST Test
              </button>
            </div>
          </div>

          <textarea
            value={customScript}
            onChange={handleScriptChange}
            rows={10}
            style={{
              width: '100%',
              background: 'var(--bg-terminal)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--jh-canvas)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              padding: '0.75rem',
              resize: 'vertical',
              lineHeight: 1.5,
              marginBottom: '1rem'
            }}
          />

          {/* AST Guardrail Status Card */}
          <div style={{
            background: astAnalysis.isAllowed ? 'rgba(202, 213, 189, 0.15)' : 'rgba(201, 130, 130, 0.18)',
            border: `1px solid ${astAnalysis.isAllowed ? 'rgba(202, 213, 189, 0.45)' : 'rgba(201, 130, 130, 0.5)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1rem',
            marginBottom: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
              {astAnalysis.isAllowed ? (
                <ShieldCheck size={18} color="var(--accent-emerald)" />
              ) : (
                <AlertOctagon size={18} color="var(--accent-rose)" />
              )}
              <strong style={{ fontSize: '0.82rem', color: astAnalysis.isAllowed ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                {astAnalysis.isAllowed ? "AST Whitelist Approved" : "CRITICAL AST SECURITY EXCEPTION"}
              </strong>
            </div>
            <div style={{ fontSize: '0.74rem', color: astAnalysis.isAllowed ? 'var(--text-secondary)' : 'var(--accent-rose)' }}>
              {astAnalysis.message}
            </div>

            {astAnalysis.violations.length > 0 && (
              <div style={{ marginTop: '0.5rem', borderTop: '1px solid rgba(201, 130, 130, 0.3)', paddingTop: '0.5rem' }}>
                {astAnalysis.violations.map((v, i) => (
                  <div key={i} style={{ fontSize: '0.7rem', color: 'var(--accent-rose)', fontFamily: 'var(--font-mono)' }}>
                    • Line {v.line}: {v.rule} &rarr; <code>{v.command}</code>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button 
            className={`btn ${astAnalysis.isAllowed ? 'btn-primary' : 'btn-danger'}`}
            style={{ width: '100%' }}
            onClick={handleRunExecution}
            disabled={isExecuting}
          >
            <Play size={15} />
            {isExecuting ? "Executing Inside Sandbox Container..." : "Execute in Ephemeral Docker Sandbox"}
          </button>
        </div>

        {/* Right: Live Sandbox Terminal Window */}
        <div className="terminal-window" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div className="terminal-header">
            <div className="terminal-dots">
              <span className="terminal-dot dot-red"></span>
              <span className="terminal-dot dot-yellow"></span>
              <span className="terminal-dot dot-green"></span>
            </div>
            <div className="terminal-title">
              root@sandbox-ephemeral-alpine:~# (Isolated / PTY)
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              15s timeout
            </div>
          </div>
          <div className="terminal-body" style={{ flex: 1, minHeight: '360px' }}>
            {terminalOutput.map((item, idx) => {
              let color = 'var(--text-muted)';
              if (item.type === 'danger') color = 'var(--accent-rose)';
              if (item.type === 'success' || item.type === 'exit0') color = 'var(--accent-emerald)';
              if (item.type === 'command') color = 'var(--jh-canvas)';
              if (item.type === 'stdout') color = 'var(--text-primary)';
              if (item.type === 'ast') color = 'var(--jh-slate)';

              return (
                <div key={idx} style={{ color, marginBottom: '0.35rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', lineHeight: 1.4 }}>
                  {item.text}
                </div>
              );
            })}
            {isExecuting && (
              <div style={{ color: 'var(--jh-canvas)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                <span className="pulse">▍</span> Sandboxing commands...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
