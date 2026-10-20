import React, { useState } from 'react';
import { 
  FileText, 
  Copy, 
  Check, 
  MessageSquare, 
  Database, 
  ShieldCheck, 
  Clock, 
  AlertCircle,
  ExternalLink 
} from 'lucide-react';
import { INITIAL_INCIDENTS, INITIAL_AUDIT_LOGS, INITIAL_CLIENT } from '../data/mockIncidents';

export default function PostMortemView({ incidents = INITIAL_INCIDENTS, onApproveSlackRemediation }) {
  const [selectedIncident, setSelectedIncident] = useState(incidents[0] || INITIAL_INCIDENTS[0]);
  const [copied, setCopied] = useState(false);
  const [activeSubView, setActiveSubView] = useState('postmortem'); // 'postmortem' | 'slack' | 'postgres'
  const [approvedInSlack, setApprovedInSlack] = useState(false);

  const generateMarkdownReport = (inc) => {
    return `# Incident Post-Mortem: ${inc.title}
**Incident ID:** ${inc.id}
**Client:** ${INITIAL_CLIENT.name} (${inc.clientId})
**Detection Engine:** Xerneas / AIOps Sentinel v1.0 (ONNX Isolation Forest)
**Anomaly Score:** ${inc.score} (Threshold: 0.85)
**Classification:** ${inc.classification}
**Resolution Status:** ${inc.status}
**Time to Detect (MTTD):** ${inc.timeToDetectSec}s
**Autonomous MTTR:** ${inc.autonomousMttrSec}s
**Affected Entities:** ${inc.entities.join(', ')}

---

## 1. Executive Summary
On ${inc.createdAt}, the Xerneas telemetry ingestion gateway detected a critical pre-crash anomaly in \`${inc.entities[0]}\`. Isolation Forest scoring breached threshold (score: ${inc.score} > 0.85). The LangGraph state machine autonomously retrieved runbook \`${inc.classification}\`, validated a parameterized shell remediation inside an ephemeral Docker sandbox (\`--net=none\`, exit code: 0), and applied the verified patch.

## 2. Root Cause Analysis (RCA)
- **Primary Mechanism:** ${inc.summary}
- **Retrieved Runbook Vector Similarity:** 96.2% via Qdrant \`bge-small-en-v1.5\` (384d).
- **Blast Radius Governance:** ${inc.mode} Mode executed with ${inc.retries} self-correction reflection cycle(s).

## 3. Verified Remediation Script (Docker Tested)
\`\`\`bash
${inc.remediationScript}
\`\`\`

## 4. Telemetry Recovery Timeline
- **T-00:00:00** - Ingestion pipeline registers telemetry frame deviation.
- **T+00:00:07** - Isolation Forest evaluates sliding window (eval latency: 3.2ms) & flags incident.
- **T+00:00:15** - LangGraph \`diagnose_node\` synthesizes JSON root cause diagnostics.
- **T+00:00:32** - AST guardrail checks 0 destructive commands.
- **T+00:00:54** - Docker ephemeral sandbox dry-run returns exit code 0.
- **T+00:01:38** - Live cluster actuation completes; metrics stabilize at baseline.

## 5. Preventative Action Items
- [x] Auto-scale cgroup memory thresholds in Helm chart to prevent recurrence.
- [x] Register permanent regression canary in CI/CD pipeline.
`;
  };

  const copyToClipboard = () => {
    const md = generateMarkdownReport(selectedIncident);
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="post-mortem-view">
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem', background: 'var(--bg-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={20} color="#06b6d4" />
              Incident Post-Mortems &amp; PostgreSQL Relational State (TRD Section 7)
            </h2>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Deterministic Markdown incident post-mortems, Slack card approval simulator, and PostgreSQL relational state schema
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className={`btn ${activeSubView === 'postmortem' ? 'btn-primary' : 'btn-outline'}`}
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}
              onClick={() => setActiveSubView('postmortem')}
            >
              <FileText size={14} />
              Markdown Report
            </button>
            <button 
              className={`btn ${activeSubView === 'slack' ? 'btn-primary' : 'btn-outline'}`}
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}
              onClick={() => setActiveSubView('slack')}
            >
              <MessageSquare size={14} />
              Slack Approval Card
            </button>
            <button 
              className={`btn ${activeSubView === 'postgres' ? 'btn-primary' : 'btn-outline'}`}
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}
              onClick={() => setActiveSubView('postgres')}
            >
              <Database size={14} />
              PostgreSQL State
            </button>
          </div>
        </div>
      </div>

      <div className="grid-2col">
        {/* Left: Incident Selector List */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Historical Incidents ({incidents.length})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {incidents.map((inc) => {
              const isSelected = selectedIncident.id === inc.id;
              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  style={{
                    padding: '0.9rem',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'rgba(6, 182, 212, 0.12)' : 'rgba(15, 23, 42, 0.6)',
                    border: `1px solid ${isSelected ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>
                      {inc.id}
                    </span>
                    <span className="distil-tag distil-routine" style={{ fontSize: '0.62rem' }}>
                      {inc.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.3rem' }}>
                    {inc.title}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    MTTD: {inc.timeToDetectSec}s • MTTR: {inc.autonomousMttrSec}s • Mode: {inc.mode}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active View */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          {activeSubView === 'postmortem' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>
                  Generated Post-Mortem (Markdown)
                </span>
                <button className="btn btn-outline" style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem' }} onClick={copyToClipboard}>
                  {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  {copied ? "Copied!" : "Copy Markdown"}
                </button>
              </div>

              <pre className="code-view" style={{ maxHeight: '420px', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
{generateMarkdownReport(selectedIncident)}
              </pre>
            </div>
          )}

          {activeSubView === 'slack' && (
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.75rem' }}>
                Slack Interactive Card Preview (Safe Mode Blast-Radius Control)
              </div>

              {/* Slack Card Simulation */}
              <div style={{
                background: '#1a1d21',
                border: '1px solid #383f45',
                borderRadius: '8px',
                padding: '1.25rem',
                borderLeft: '4px solid #f59e0b',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ background: '#06b6d4', width: '20px', height: '20px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#000', fontWeight: 'bold' }}>X</span>
                  <strong style={{ fontSize: '0.88rem', color: '#fff' }}>Xerneas Autonomous SRE Sentinel</strong>
                  <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>APP • 2m ago</span>
                </div>

                <div style={{ fontSize: '0.9rem', color: '#e5e7eb', marginBottom: '0.75rem', fontWeight: 600 }}>
                  🚨 Incident Triage Required: {selectedIncident.title}
                </div>

                <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginBottom: '0.75rem' }}>
                  <strong>Affected Entities:</strong> {selectedIncident.entities.join(', ')}<br />
                  <strong>Isolation Forest Score:</strong> {selectedIncident.score} (Severity: High)<br />
                  <strong>Sandbox Dry-Run:</strong> ✅ PASSED in Docker (Exit code: 0, 0 faults)
                </div>

                <div style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', padding: '0.75rem', marginBottom: '1rem', fontFamily: 'monospace', fontSize: '0.74rem', color: '#7ee787' }}>
                  {selectedIncident.remediationScript}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    className="btn btn-primary" 
                    style={{ background: '#2ea44f', borderColor: '#2ea44f', fontSize: '0.75rem', padding: '0.4rem 0.85rem' }}
                    onClick={() => {
                      setApprovedInSlack(true);
                      if (onApproveSlackRemediation) onApproveSlackRemediation(selectedIncident);
                    }}
                    disabled={approvedInSlack}
                  >
                    {approvedInSlack ? "✓ Remediation Approved & Actuated" : "Approve & Apply Live Remediation"}
                  </button>
                  <button className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.4rem 0.85rem' }}>
                    Quarantine &amp; Hold
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSubView === 'postgres' && (
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.75rem' }}>
                PostgreSQL Relational State Records (TRD Section 7 Schema)
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Table: <code>incidents</code> &amp; <code>audit_logs</code> (FK constraint on client_id)
              </div>

              <pre className="code-view" style={{ maxHeight: '380px' }}>
{JSON.stringify({
  client: INITIAL_CLIENT,
  current_incident: selectedIncident,
  relational_audit_logs: INITIAL_AUDIT_LOGS.filter(a => a.incidentId === selectedIncident.id)
}, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
