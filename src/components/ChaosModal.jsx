import React from 'react';
import { 
  Flame, 
  X, 
  AlertTriangle, 
  Database, 
  TrendingUp, 
  ShieldAlert, 
  Play, 
  Zap 
} from 'lucide-react';

export default function ChaosModal({ isOpen, onClose, onInjectChaos }) {
  if (!isOpen) return null;

  const scenarios = [
    {
      id: "chaos-mem-oom",
      title: "Memory Leak Injection (stress-ng)",
      type: "OOM_EARLY_WARNING",
      command: "stress-ng --vm 2 --vm-bytes 90% --timeout 60s",
      impact: "Simulates worker pod resident memory escalating to 92.4%. Triggers Isolation Forest anomaly > 0.85.",
      icon: AlertTriangle,
      color: "#ef4444",
      actionText: "Inject Memory Leak"
    },
    {
      id: "chaos-pg-pool",
      title: "Connection Pool Exhaustion",
      type: "DB_CONNECTION_EXHAUSTION",
      command: "pgbench -i -s 10 -c 120 -j 8 -T 30 postgres://...",
      impact: "Saturates PostgreSQL port 5432 remaining slots. Triggers DistilBERT connection exhaustion classification.",
      icon: Database,
      color: "#f59e0b",
      actionText: "Saturate DB Pool"
    },
    {
      id: "chaos-5xx-storm",
      title: "Cascading 5xx Gateway Storm",
      type: "FATAL_DEADLOCK",
      command: "hey -z 30s -c 400 -q 50 https://api.prod.local/checkout",
      impact: "Drives HTTP 504 gateway timeout rate past 6.8%. Validates autonomous replica autoscaling (3 -> 8 pods).",
      icon: TrendingUp,
      color: "#a855f7",
      actionText: "Trigger 5xx Storm"
    },
    {
      id: "chaos-ast-malicious",
      title: "Destructive Script Guardrail Test",
      type: "AST_SECURITY_EXCEPTION",
      command: "rm -rf / && mkfs.ext4 /dev/sda1 && echo evil >> /etc/passwd",
      impact: "Injects destructive command into agent pipeline to verify TRD Section 7 AST quarantine filter.",
      icon: ShieldAlert,
      color: "#ec4899",
      actionText: "Test AST Intercept"
    }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="panel-header">
          <div className="panel-title" style={{ color: '#f43f5e' }}>
            <Flame size={20} />
            Verification Matrix &amp; Chaos Engineering Lab (TRD Section 8)
          </div>
          <button 
            className="btn btn-outline" 
            style={{ padding: '0.25rem 0.5rem', border: 'none' }}
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div className="panel-body">
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Inject controlled synthetic faults into the live telemetry stream to validate closed-loop detection, LangGraph diagnosis, Docker sandboxing, and autonomous remediation.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {scenarios.map((sc) => {
              const Icon = sc.icon;
              return (
                <div 
                  key={sc.id}
                  style={{
                    background: 'rgba(15, 23, 42, 0.7)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-sm)',
                      background: `rgba(${sc.color === '#ef4444' ? '239, 68, 68' : sc.color === '#f59e0b' ? '245, 158, 11' : sc.color === '#a855f7' ? '168, 85, 247' : '236, 72, 153'}, 0.15)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: sc.color,
                      flexShrink: 0
                    }}>
                      <Icon size={20} />
                    </div>

                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>
                        {sc.title}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#94a3b8', margin: '0.2rem 0' }}>
                        <code>{sc.command}</code>
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        {sc.impact}
                      </div>
                    </div>
                  </div>

                  <button
                    className="btn btn-primary"
                    style={{
                      background: `linear-gradient(135deg, ${sc.color}, #0284c7)`,
                      fontSize: '0.75rem',
                      padding: '0.45rem 0.85rem',
                      whiteSpace: 'nowrap'
                    }}
                    onClick={() => {
                      onInjectChaos(sc.id);
                      onClose();
                    }}
                  >
                    <Play size={13} />
                    {sc.actionText}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
