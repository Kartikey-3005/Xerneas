import React from 'react';
import { 
  Shield, 
  Cpu, 
  Activity, 
  Terminal, 
  Clock, 
  CheckCircle2, 
  Zap, 
  Layers, 
  Flame, 
  SlidersHorizontal 
} from 'lucide-react';

export default function Header({ 
  mode, 
  setMode, 
  onOpenChaosModal, 
  activeIncidentsCount, 
  kpis,
  isSimulating 
}) {
  return (
    <header className="top-header">
      <div className="header-top-row">
        {/* Brand Section */}
        <div className="brand-section">
          <div className="brand-logo-hex">
            <Shield className="w-5 h-5 text-cyan-400" size={22} color="#06b6d4" />
          </div>
          <div>
            <div className="brand-title">
              XERNEAS
              <span className="brand-badge">AIOps Sentinel v1.0</span>
            </div>
            <div className="sub-tagline">
              Autonomous SRE Engine • Closed-Loop ML Anomaly Detection & Sandbox Remediation
            </div>
          </div>
        </div>

        {/* System Component Statuses */}
        <div className="system-statuses">
          <div className="status-chip" title="FastAPI + Redis Stream Buffer (FR-01)">
            <span className="status-dot pulse"></span>
            <span>Redis Stream: 10.4k ev/s</span>
          </div>

          <div className="status-chip" title="ONNX Isolation Forest + DistilBERT (FR-02)">
            <Cpu size={14} color="#6366f1" />
            <span>ONNX Runtime: 3.2ms</span>
          </div>

          <div className="status-chip" title="Qdrant Vector DB 384d Embeddings (FR-03)">
            <Layers size={14} color="#06b6d4" />
            <span>Qdrant RAG: Online</span>
          </div>

          <div className="status-chip" title="Ephemeral Docker Sandbox (--net=none) (FR-04)">
            <Terminal size={14} color="#10b981" />
            <span>Sandbox: --net=none</span>
          </div>
        </div>

        {/* Operational Modes & Actions */}
        <div className="header-actions">
          {/* Mode Selector */}
          <div className="mode-toggle-group" title="Governance & Blast-Radius Control (PRD Section 6)">
            <button 
              className={`mode-btn ${mode === 'SAFE' ? 'active safe' : ''}`}
              onClick={() => setMode('SAFE')}
            >
              <Shield size={14} />
              Safe Mode
            </button>
            <button 
              className={`mode-btn ${mode === 'AUTONOMOUS' ? 'active autonomous' : ''}`}
              onClick={() => setMode('AUTONOMOUS')}
            >
              <Zap size={14} />
              Autonomous
            </button>
          </div>

          {/* Chaos Button */}
          <button 
            className="btn btn-danger" 
            onClick={onOpenChaosModal}
            id="btn-chaos-injection"
          >
            <Flame size={16} />
            Chaos Matrix
          </button>
        </div>
      </div>

      {/* KPI Target Row */}
      <div className="kpi-row">
        <div className="glass-panel kpi-card kpi-emerald">
          <div>
            <div className="kpi-label">Mean Time to Detect (MTTD)</div>
            <div className="kpi-value">{kpis.mttd}s</div>
            <div className="kpi-target">Target: ≤ 15s (99.99% SLA)</div>
          </div>
          <div className="kpi-icon-wrap">
            <Clock size={22} color="#10b981" />
          </div>
        </div>

        <div className="glass-panel kpi-card kpi-indigo">
          <div>
            <div className="kpi-label">Autonomous MTTR</div>
            <div className="kpi-value">{kpis.mttr}</div>
            <div className="kpi-target">Target: &lt; 3 min (Baseline: 45m)</div>
          </div>
          <div className="kpi-icon-wrap">
            <Zap size={22} color="#6366f1" />
          </div>
        </div>

        <div className="glass-panel kpi-card kpi-amber">
          <div>
            <div className="kpi-label">Detection Precision</div>
            <div className="kpi-value">{kpis.precision}%</div>
            <div className="kpi-target">Target: &gt; 94% (Isolation Forest)</div>
          </div>
          <div className="kpi-icon-wrap">
            <Activity size={22} color="#f59e0b" />
          </div>
        </div>

        <div className="glass-panel kpi-card kpi-rose">
          <div>
            <div className="kpi-label">Sandbox Verification</div>
            <div className="kpi-value">{kpis.sandboxVerified}%</div>
            <div className="kpi-target">100% Tested Live Execution</div>
          </div>
          <div className="kpi-icon-wrap">
            <CheckCircle2 size={22} color="#f43f5e" />
          </div>
        </div>
      </div>
    </header>
  );
}
