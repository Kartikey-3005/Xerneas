import React, { useMemo } from 'react';
import { 
  Activity, 
  Cpu, 
  Database, 
  AlertTriangle, 
  Radio, 
  Terminal as TerminalIcon, 
  TrendingUp, 
  CheckCircle, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function TelemetryView({ 
  telemetryHistory, 
  currentMetrics, 
  anomalyResult, 
  logs, 
  activeIncident, 
  onViewIncident 
}) {
  // Generate SVG polyline points for dynamic charts
  const chartWidth = 320;
  const chartHeight = 85;

  const renderSparkline = (metricKey, maxVal = 100, strokeColor = "#06b6d4", fillColor = "rgba(6, 182, 212, 0.15)") => {
    if (!telemetryHistory || telemetryHistory.length === 0) return null;

    const points = telemetryHistory.map((item, index) => {
      const x = (index / (telemetryHistory.length - 1 || 1)) * chartWidth;
      const val = item[metricKey] || 0;
      const y = chartHeight - (val / maxVal) * (chartHeight - 10) - 5;
      return `${x},${y}`;
    }).join(' ');

    const areaPoints = `0,${chartHeight} ${points} ${chartWidth},${chartHeight}`;

    return (
      <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id={`grad-${metricKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill={`url(#grad-${metricKey})`} />
        <polyline fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" points={points} />
      </svg>
    );
  };

  return (
    <div className="telemetry-dashboard">
      {/* Active Incident Warning Alert */}
      {anomalyResult.isAnomalous && (
        <div className="alert-strip alert-danger">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertTriangle size={20} color="#ef4444" />
            <div>
              <strong>PRE-CRASH TELEMETRY ANOMALY DETECTED (Score: {anomalyResult.score} &gt; 0.85 Threshold)</strong>
              <div style={{ fontSize: '0.78rem', color: '#fca5a5' }}>
                ONNX Isolation Forest detected severe telemetry deviation. LangGraph autonomous remediation active.
              </div>
            </div>
          </div>
          {activeIncident && (
            <button className="btn btn-primary" onClick={onViewIncident}>
              Inspect LangGraph Agent <ArrowRight size={14} />
            </button>
          )}
        </div>
      )}

      {/* 4 Telemetry Metrics Grid */}
      <div className="grid-2col" style={{ marginBottom: '1.5rem' }}>
        {/* Metric 1: CPU Utilization */}
        <div className="glass-panel metric-chart-card">
          <div className="chart-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Cpu size={16} color="#38bdf8" />
              <span className="chart-metric-title">Kernel & User CPU Utilization</span>
            </div>
            <span className="chart-current-val" style={{ color: currentMetrics.cpu_usage > 80 ? '#f43f5e' : '#38bdf8' }}>
              {currentMetrics.cpu_usage.toFixed(1)}%
            </span>
          </div>
          {renderSparkline('cpu_usage', 100, currentMetrics.cpu_usage > 80 ? '#f43f5e' : '#06b6d4')}
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.4rem', display: 'flex', justifyContent: 'space-between' }}>
            <span>Window: 60s (5s sample intervals)</span>
            <span>Rolling Avg: {((currentMetrics.cpu_usage + 5) * 0.95).toFixed(1)}%</span>
          </div>
        </div>

        {/* Metric 2: Resident Set Memory (RSS) */}
        <div className="glass-panel metric-chart-card">
          <div className="chart-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Database size={16} color="#818cf8" />
              <span className="chart-metric-title">Resident Set Size (RSS) Memory</span>
            </div>
            <span className="chart-current-val" style={{ color: currentMetrics.memory_rss > 85 ? '#f43f5e' : '#818cf8' }}>
              {currentMetrics.memory_rss.toFixed(1)}%
            </span>
          </div>
          {renderSparkline('memory_rss', 100, currentMetrics.memory_rss > 85 ? '#f43f5e' : '#6366f1')}
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.4rem', display: 'flex', justifyContent: 'space-between' }}>
            <span>Cgroup Limit: 2048Mi</span>
            <span>Allocated: {((currentMetrics.memory_rss / 100) * 2048).toFixed(0)} Mi</span>
          </div>
        </div>

        {/* Metric 3: Disk / Socket I/O Wait */}
        <div className="glass-panel metric-chart-card">
          <div className="chart-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={16} color="#34d399" />
              <span className="chart-metric-title">I/O Wait Latency</span>
            </div>
            <span className="chart-current-val" style={{ color: currentMetrics.io_wait > 18 ? '#f59e0b' : '#34d399' }}>
              {currentMetrics.io_wait.toFixed(1)}ms
            </span>
          </div>
          {renderSparkline('io_wait', 35, currentMetrics.io_wait > 18 ? '#f59e0b' : '#10b981')}
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.4rem', display: 'flex', justifyContent: 'space-between' }}>
            <span>Block device queue: normal</span>
            <span>p99 Latency: 3.4ms</span>
          </div>
        </div>

        {/* Metric 4: TX Error Rate / 5xx Surge */}
        <div className="glass-panel metric-chart-card">
          <div className="chart-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={16} color="#fbbf24" />
              <span className="chart-metric-title">TX Network & 5xx Error Rate</span>
            </div>
            <span className="chart-current-val" style={{ color: currentMetrics.tx_error_rate > 3.0 ? '#f43f5e' : '#fbbf24' }}>
              {currentMetrics.tx_error_rate.toFixed(2)}%
            </span>
          </div>
          {renderSparkline('tx_error_rate', 10, currentMetrics.tx_error_rate > 3.0 ? '#f43f5e' : '#f59e0b')}
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.4rem', display: 'flex', justifyContent: 'space-between' }}>
            <span>Ingress HTTP Gateway</span>
            <span>Target: &lt; 0.05%</span>
          </div>
        </div>
      </div>

      {/* Lower Split: Anomaly Inference Engine + DistilBERT Log Stream */}
      <div className="grid-2col">
        {/* Left: Isolation Forest ML Engine Details */}
        <div className="glass-panel">
          <div className="panel-header">
            <div className="panel-title">
              <Sparkles size={18} color="#6366f1" />
              Tier 1: Isolation Forest Multivariate Engine
            </div>
            <span className="brand-badge" style={{ background: 'rgba(99, 102, 241, 0.2)' }}>
              ONNX DirectML • {anomalyResult.evalLatencyMs}ms
            </span>
          </div>
          <div className="panel-body">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Current Anomaly Score
                </div>
                <div style={{ 
                  fontSize: '2.5rem', 
                  fontFamily: 'var(--font-mono)', 
                  fontWeight: 800,
                  color: anomalyResult.isAnomalous ? '#f43f5e' : '#34d399'
                }}>
                  {anomalyResult.score}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Triage Trigger Threshold</div>
                <div style={{ fontSize: '1.25rem', fontFamily: 'var(--font-mono)', color: '#f59e0b', fontWeight: 700 }}>
                  &gt; 0.850
                </div>
                <span className={`brand-badge ${anomalyResult.isAnomalous ? 'bg-red-500' : ''}`} style={{
                  background: anomalyResult.isAnomalous ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                  color: anomalyResult.isAnomalous ? '#f87171' : '#34d399',
                  borderColor: anomalyResult.isAnomalous ? '#ef4444' : '#10b981'
                }}>
                  {anomalyResult.isAnomalous ? 'TRIAGE ACTIVE' : 'NOMINAL BASELINE'}
                </span>
              </div>
            </div>

            {/* Score progress bar */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                <span>0.00 (Normal)</span>
                <span style={{ color: '#f59e0b' }}>0.85 (Threshold)</span>
                <span>1.00 (Failure)</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min(100, anomalyResult.score * 100)}%`,
                  background: anomalyResult.isAnomalous 
                    ? 'linear-gradient(90deg, #f59e0b, #ef4444)' 
                    : 'linear-gradient(90deg, #10b981, #06b6d4)',
                  transition: 'width 0.4s ease'
                }} />
                {/* 0.85 line */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: '85%',
                  width: '2px',
                  background: '#f59e0b',
                  boxShadow: '0 0 4px #f59e0b'
                }} />
              </div>
            </div>

            {/* Ingestion Payload Spec (TRD Section 2) */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                FastAPI / Redis Stream Payload Contract (stream:telemetry:raw)
              </div>
              <pre className="code-view" style={{ fontSize: '0.72rem', maxHeight: '110px' }}>
{JSON.stringify({
  client_id: "c8f2a1b9-40e1-4c6d-92a4-79018e77c8e2",
  metrics: {
    cpu_pct: Number(currentMetrics.cpu_usage.toFixed(1)),
    mem_pct: Number(currentMetrics.memory_rss.toFixed(1)),
    io_wait_ms: Number(currentMetrics.io_wait.toFixed(1))
  },
  buffer_stream: "stream:telemetry:raw",
  event_ttl_hours: 4
}, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        {/* Right: Tier 2 DistilBERT Log Stream */}
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="terminal-dots">
              <span className="terminal-dot dot-red"></span>
              <span className="terminal-dot dot-yellow"></span>
              <span className="terminal-dot dot-green"></span>
            </div>
            <div className="terminal-title">
              Tier 2: DistilBERT NLP Stream (LogHub Fine-Tuned)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', color: '#10b981' }}>
              <Radio size={12} className="pulse" />
              LIVE INGEST
            </div>
          </div>
          <div className="terminal-body" id="log-terminal-stream">
            {logs.map((log, index) => {
              const tagClass = 
                log.classification === 'OOM_EARLY_WARNING' ? 'distil-oom' :
                log.classification === 'DB_CONNECTION_EXHAUSTION' ? 'distil-pool' :
                log.classification === 'FATAL_DEADLOCK' ? 'distil-deadlock' :
                'distil-routine';

              return (
                <div key={index} className="term-line">
                  <span className="term-ts">{log.ts}</span>
                  <span className={`distil-tag ${tagClass}`}>
                    {log.classification}
                  </span>
                  <span className="term-msg">
                    <strong style={{ color: '#94a3b8' }}>[{log.src}]</strong> {log.msg}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
