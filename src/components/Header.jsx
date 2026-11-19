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
  Sun,
  Moon
} from 'lucide-react';

export default function Header({ 
  mode, 
  setMode, 
  onOpenChaosModal, 
  activeIncidentsCount, 
  kpis,
  isSimulating,
  theme = 'charcoal',
  setTheme
}) {
  return (
    <header className="top-header">
      <div className="header-top-row">
        {/* System Component Statuses */}
        <div className="system-statuses">
          <div className="status-chip" title="FastAPI + Redis Stream Buffer (FR-01)">
            <span className="status-dot pulse" style={{ background: '#FFFFFF', boxShadow: '0 0 8px #FFFFFF' }}></span>
            <span>Redis Stream: 10.4k ev/s</span>
          </div>

          <div className="status-chip" title="ONNX Isolation Forest + DistilBERT (FR-02)">
            <Cpu size={14} color="#FFFFFF" />
            <span>ONNX Runtime: 3.2ms</span>
          </div>

          <div className="status-chip" title="Qdrant Vector DB 384d Embeddings (FR-03)">
            <Layers size={14} color="#FFFFFF" />
            <span>Qdrant RAG: Online</span>
          </div>

          <div className="status-chip" title="Ephemeral Docker Sandbox (--net=none) (FR-04)">
            <Terminal size={14} color="#8E8E93" />
            <span>Sandbox: --net=none</span>
          </div>
        </div>

        {/* Operational Modes & Actions */}
        <div className="header-actions">
          {/* Palette indicator pill */}
          <div 
            className="palette-preview-pill" 
            title="Design Palette: Black (#000000), White (#FFFFFF), Dark Maroon (#660000)"
          >
            <span className="palette-chip" style={{ background: '#000000', borderColor: 'rgba(255,255,255,0.4)' }} title="Pitch Black #000000"></span>
            <span className="palette-chip" style={{ background: '#FFFFFF', borderColor: 'rgba(255,255,255,0.8)' }} title="Pure White #FFFFFF"></span>
            <span className="palette-chip" style={{ background: '#660000', borderColor: '#8B0000' }} title="Dark Maroon #660000"></span>
          </div>

          {/* Theme Switcher */}
          {setTheme && (
            <button
              className="theme-toggle-btn"
              onClick={() => setTheme(theme === 'charcoal' ? 'canvas' : 'charcoal')}
              title={`Switch palette view (Currently: ${theme.toUpperCase()})`}
            >
              {theme === 'charcoal' ? (
                <>
                  <Sun size={13} />
                  <span>Canvas</span>
                </>
              ) : (
                <>
                  <Moon size={13} />
                  <span>Charcoal</span>
                </>
              )}
            </button>
          )}

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
            <Clock size={22} color="#FFFFFF" />
          </div>
        </div>

        <div className="glass-panel kpi-card kpi-indigo">
          <div>
            <div className="kpi-label">Autonomous MTTR</div>
            <div className="kpi-value">{kpis.mttr}</div>
            <div className="kpi-target">Target: &lt; 3 min (Baseline: 45m)</div>
          </div>
          <div className="kpi-icon-wrap">
            <Zap size={22} color="#FFFFFF" />
          </div>
        </div>

        <div className="glass-panel kpi-card kpi-amber">
          <div>
            <div className="kpi-label">Detection Precision</div>
            <div className="kpi-value">{kpis.precision}%</div>
            <div className="kpi-target">Target: &gt; 94% (Isolation Forest)</div>
          </div>
          <div className="kpi-icon-wrap">
            <Activity size={22} color="#FFFFFF" />
          </div>
        </div>

        <div className="glass-panel kpi-card kpi-rose">
          <div>
            <div className="kpi-label">Sandbox Verification</div>
            <div className="kpi-value">{kpis.sandboxVerified}%</div>
            <div className="kpi-target">100% Tested Live Execution</div>
          </div>
          <div className="kpi-icon-wrap">
            <CheckCircle2 size={22} color="#FFFFFF" />
          </div>
        </div>
      </div>
    </header>
  );
}
