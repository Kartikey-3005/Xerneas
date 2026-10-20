import React, { useState } from 'react';
import { 
  GitBranch, 
  Search, 
  FileCode2, 
  Terminal, 
  RefreshCw, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Clock, 
  Layers, 
  Cpu, 
  ShieldCheck 
} from 'lucide-react';

export default function LangGraphVisualizer({ 
  executionTrace, 
  isRunning, 
  activeIncident, 
  onRunSelfCorrectionDemo 
}) {
  const [selectedStepIndex, setSelectedStepIndex] = useState(null);

  const steps = executionTrace?.steps || [];
  const latestStep = steps[steps.length - 1];

  const nodes = [
    { id: "diagnose_node", label: "diagnose_node", title: "GenAI RAG Diagnosis", desc: "Qdrant 384d Vector Retrieval", icon: Search },
    { id: "patch_gen_node", label: "patch_gen_node", title: "Patch Generator", desc: "AST Command Whitelist Validation", icon: FileCode2 },
    { id: "sandbox_node", label: "sandbox_node", title: "Docker Sandbox", desc: "Ephemeral Dry-Run (--net=none)", icon: Terminal },
    { id: "reflect_node", label: "reflect_node", title: "Agent Reflection", desc: "STDERR Analysis (Max 3 Loops)", icon: RefreshCw },
    { id: "dispatch_node", label: "dispatch_node", title: "Action Dispatcher", desc: "Live Actuation / Slack Card", icon: Send }
  ];

  const getNodeStatus = (nodeId) => {
    const matchingSteps = steps.filter(s => s.nodeName === nodeId);
    if (!matchingSteps.length) return "IDLE";
    const lastMatching = matchingSteps[matchingSteps.length - 1];
    return lastMatching.status;
  };

  const selectedStep = selectedStepIndex !== null 
    ? steps[selectedStepIndex] 
    : latestStep || steps[0];

  return (
    <div className="glass-panel" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <GitBranch size={20} color="#06b6d4" />
            LangGraph State Machine Engine (TRD Section 5)
          </h2>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Self-correcting agent state transitions with AST guardrail condition gate and reflection loop
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            className="btn btn-outline" 
            onClick={onRunSelfCorrectionDemo}
            disabled={isRunning}
            title="Demonstrates fail -> reflect_node self-correction -> success cycle"
          >
            <RefreshCw size={14} className={isRunning ? 'pulse' : ''} />
            Simulate Self-Correction Cycle
          </button>
        </div>
      </div>

      {/* State Machine Nodes Pipeline */}
      <div className="langgraph-container" style={{ background: 'rgba(7, 10, 16, 0.7)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', marginBottom: '1.5rem' }}>
        {nodes.map((node, index) => {
          const status = getNodeStatus(node.id);
          const Icon = node.icon;
          const isLatest = latestStep?.nodeName === node.id;

          let statusClass = '';
          if (status === 'RUNNING') statusClass = 'active';
          else if (status === 'PASSED') statusClass = 'passed';
          else if (status === 'FAILED') statusClass = 'failed';
          else if (status === 'REFLECTING') statusClass = 'reflecting';

          return (
            <React.Fragment key={node.id}>
              <div 
                className={`graph-node ${statusClass}`}
                onClick={() => {
                  const stepIdx = steps.findIndex(s => s.nodeName === node.id);
                  if (stepIdx !== -1) setSelectedStepIndex(stepIdx);
                }}
              >
                <div className="node-header">
                  <Icon size={16} color={status === 'PASSED' ? '#10b981' : status === 'FAILED' ? '#f43f5e' : status === 'REFLECTING' ? '#f59e0b' : '#06b6d4'} />
                  <span className="node-title">{node.label}</span>
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                  {node.title}
                </div>
                <div className="node-desc">{node.desc}</div>

                <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ 
                    fontSize: '0.62rem', 
                    fontFamily: 'var(--font-mono)', 
                    padding: '0.1rem 0.35rem', 
                    borderRadius: '4px',
                    background: status === 'PASSED' ? 'rgba(16,185,129,0.2)' : status === 'FAILED' ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.05)',
                    color: status === 'PASSED' ? '#34d399' : status === 'FAILED' ? '#f87171' : 'var(--text-muted)'
                  }}>
                    {status}
                  </span>
                  {isLatest && isRunning && (
                    <span className="status-dot pulse" style={{ width: '6px', height: '6px' }}></span>
                  )}
                </div>
              </div>

              {index < nodes.length - 1 && (
                <div className={`node-connector ${steps.some(s => s.nodeName === node.id && s.status === 'PASSED') ? 'active' : ''}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* State Condition Gate Rule Info Banner */}
      <div style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.25)', borderRadius: 'var(--radius-md)', padding: '0.85rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ShieldCheck size={20} color="#818cf8" />
          <div style={{ fontSize: '0.78rem' }}>
            <strong style={{ color: '#c7d2fe' }}>Self-Correction State Transition Rule (TRD Sec 5):</strong>
            <span style={{ color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>
              If <code>sandbox_exit_code != 0</code> &amp; <code>retry_counter &lt; 3</code> &rarr; transition to <code>reflect_node</code> with full error traces. If <code>retry == 3</code> &rarr; abort auto-remediation &amp; trigger emergency alert.
            </span>
          </div>
        </div>
      </div>

      {/* Split Details: Timeline of Steps vs State Payload Inspector */}
      <div className="grid-2col">
        {/* Step-by-Step State Timeline */}
        <div className="glass-panel" style={{ padding: '1rem', background: 'var(--bg-secondary)' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={16} />
            Execution Chronology ({steps.length} Steps)
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '320px', overflowY: 'auto' }}>
            {steps.length === 0 ? (
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
                State machine awaiting active incident trigger or chaos injection...
              </div>
            ) : (
              steps.map((st, idx) => {
                const isSelected = selectedStepIndex === idx || (selectedStepIndex === null && idx === steps.length - 1);
                return (
                  <div 
                    key={idx}
                    onClick={() => setSelectedStepIndex(idx)}
                    style={{
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      background: isSelected ? 'rgba(6, 182, 212, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                      border: `1px solid ${isSelected ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: isSelected ? '#38bdf8' : '#e2e8f0' }}>
                          {st.nodeName}
                        </span>
                        <span style={{ 
                          fontSize: '0.62rem', 
                          padding: '0.05rem 0.35rem', 
                          borderRadius: '3px',
                          background: st.status === 'PASSED' ? 'rgba(16,185,129,0.2)' : st.status === 'FAILED' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)',
                          color: st.status === 'PASSED' ? '#34d399' : st.status === 'FAILED' ? '#f87171' : '#fbbf24'
                        }}>
                          {st.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        {st.summary}
                      </div>
                    </div>
                    <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {st.timestamp}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* State Payload Inspector */}
        <div className="glass-panel" style={{ padding: '1rem', background: 'var(--bg-secondary)' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={16} />
              Node State Payload ({selectedStep?.nodeName || 'No selection'})
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              JSON Schema Strict Contract
            </span>
          </div>

          <pre className="code-view" style={{ maxHeight: '320px', minHeight: '200px' }}>
{selectedStep ? JSON.stringify({
  node: selectedStep.nodeName,
  status: selectedStep.status,
  summary: selectedStep.summary,
  payload: selectedStep.payload
}, null, 2) : "// Awaiting LangGraph execution output"}
          </pre>
        </div>
      </div>
    </div>
  );
}
