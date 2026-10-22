import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Activity, 
  GitBranch, 
  Terminal, 
  Database, 
  FileText, 
  Network, 
  Flame, 
  AlertTriangle,
  RotateCcw,
  Compass
} from 'lucide-react';

import Header from './components/Header';
import SentinelLanding from './components/SentinelLanding';
import TelemetryView from './components/TelemetryView';
import LangGraphVisualizer from './components/LangGraphVisualizer';
import SandboxTerminal from './components/SandboxTerminal';
import RunbookExplorer from './components/RunbookExplorer';
import PostMortemView from './components/PostMortemView';
import ArchitectureView from './components/ArchitectureView';
import ChaosModal from './components/ChaosModal';

import { evaluateIsolationForest, classifyLogDistilBERT } from './services/anomalyEngine';
import { runLangGraphPipeline } from './services/langGraphRunner';
import { inspectCommandAST } from './services/astGuardrail';
import { INITIAL_INCIDENTS, INITIAL_AUDIT_LOGS } from './data/mockIncidents';

export default function App() {
  const [theme, setTheme] = useState('charcoal'); // 'charcoal' | 'canvas'
  const [activeTab, setActiveTab] = useState('landing'); // 'landing' | 'telemetry' | 'langgraph' | 'sandbox' | 'runbooks' | 'postmortem' | 'architecture'
  const [mode, setMode] = useState('AUTONOMOUS'); // 'SAFE' | 'AUTONOMOUS'
  const [isChaosModalOpen, setIsChaosModalOpen] = useState(false);
  const [incidents, setIncidents] = useState(INITIAL_INCIDENTS);
  const [activeIncident, setActiveIncident] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // KPIs
  const [kpis, setKpis] = useState({
    mttd: 8.4,
    mttr: "1m 42s",
    precision: 97.4,
    sandboxVerified: 100
  });

  // Telemetry stream state
  const [currentMetrics, setCurrentMetrics] = useState({
    cpu_usage: 24.5,
    memory_rss: 48.2,
    io_wait: 2.1,
    tx_error_rate: 0.02
  });

  const [telemetryHistory, setTelemetryHistory] = useState([
    { cpu_usage: 22, memory_rss: 45, io_wait: 1.8, tx_error_rate: 0.01 },
    { cpu_usage: 25, memory_rss: 47, io_wait: 2.2, tx_error_rate: 0.02 },
    { cpu_usage: 24, memory_rss: 48, io_wait: 2.0, tx_error_rate: 0.02 },
    { cpu_usage: 26, memory_rss: 49, io_wait: 2.4, tx_error_rate: 0.03 }
  ]);

  const [logs, setLogs] = useState([
    { ts: "02:34:10", lvl: "INFO", src: "worker-pool-4", classification: "ROUTINE", msg: "Worker thread pool heartbeat acknowledged (20/20 active)." },
    { ts: "02:34:15", lvl: "INFO", src: "redis-stream", classification: "ROUTINE", msg: "Buffered 10,240 events from 64 client agents into stream:telemetry:raw." },
    { ts: "02:34:20", lvl: "INFO", src: "onnx-directml", classification: "ROUTINE", msg: "Evaluated 120 sliding metric frames. Isolation Forest p99 latency: 3.1ms." }
  ]);

  const [executionTrace, setExecutionTrace] = useState(null);
  const [isGraphRunning, setIsGraphRunning] = useState(false);

  // Calculated Anomaly Result
  const anomalyResult = evaluateIsolationForest(currentMetrics);

  // Live telemetry pulse tick (adds natural noise when not anomalous)
  useEffect(() => {
    const timer = setInterval(() => {
      // If no active incident, gently fluctuate around nominal baseline
      if (!activeIncident) {
        setCurrentMetrics(prev => {
          const next = {
            cpu_usage: Math.max(15, Math.min(45, prev.cpu_usage + (Math.random() * 4 - 2))),
            memory_rss: Math.max(35, Math.min(55, prev.memory_rss + (Math.random() * 2 - 1))),
            io_wait: Math.max(1, Math.min(6, prev.io_wait + (Math.random() * 0.8 - 0.4))),
            tx_error_rate: Math.max(0.01, Math.min(0.08, prev.tx_error_rate + (Math.random() * 0.02 - 0.01)))
          };

          setTelemetryHistory(hist => {
            const copy = [...hist.slice(-19), next];
            return copy;
          });

          return next;
        });

        // Add periodic routine log
        if (Math.random() > 0.6) {
          const nowStr = new Date().toLocaleTimeString();
          setLogs(prev => [
            {
              ts: nowStr,
              lvl: "INFO",
              src: `agent-cgroup-${Math.floor(Math.random() * 8)}`,
              classification: "ROUTINE",
              msg: `Telemetry batch ingested: 5s average CPU=${currentMetrics.cpu_usage.toFixed(1)}%, RSS=${currentMetrics.memory_rss.toFixed(1)}%`
            },
            ...prev.slice(0, 40)
          ]);
        }
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [activeIncident, currentMetrics]);

  // Trigger Chaos Injection
  const handleInjectChaos = async (scenarioId) => {
    const nowStr = new Date().toLocaleTimeString();

    if (scenarioId === "chaos-mem-oom") {
      // Memory Leak Injection
      const anomalousMetrics = {
        cpu_usage: 74.2,
        memory_rss: 93.6,
        io_wait: 8.5,
        tx_error_rate: 0.12
      };
      setCurrentMetrics(anomalousMetrics);
      setTelemetryHistory(prev => [...prev.slice(-19), anomalousMetrics]);

      const oomLog = {
        ts: nowStr,
        lvl: "ERROR",
        src: "worker-cgroup-0",
        classification: "OOM_EARLY_WARNING",
        msg: "CRITICAL: Resident set size (1980Mi/2048Mi) breaching cgroup limits. Kernel page allocator stalling."
      };
      setLogs(prev => [oomLog, ...prev]);

      const incident = {
        id: `inc-${Date.now().toString().slice(-4)}-oom`,
        clientId: "c8f2a1b9-40e1-4c6d-92a4-79018e77c8e2",
        title: "Synthetic OOM Memory Saturation (stress-ng)",
        score: 0.962,
        status: "ACTIVE_TRIAGE",
        classification: "OOM_EARLY_WARNING",
        createdAt: new Date().toISOString(),
        anomalyScore: 0.962,
        entities: ["deployment/payment-processor", "container/worker-cgroup-0"]
      };

      setActiveIncident(incident);
      setActiveTab('langgraph');
      runPipelineForIncident(incident, false);

    } else if (scenarioId === "chaos-pg-pool") {
      // Connection Pool Exhaustion
      const anomalousMetrics = {
        cpu_usage: 62.0,
        memory_rss: 68.4,
        io_wait: 24.8,
        tx_error_rate: 2.4
      };
      setCurrentMetrics(anomalousMetrics);
      setTelemetryHistory(prev => [...prev.slice(-19), anomalousMetrics]);

      const poolLog = {
        ts: nowStr,
        lvl: "ERROR",
        src: "postgres-primary:5432",
        classification: "DB_CONNECTION_EXHAUSTION",
        msg: "FATAL: remaining connection slots are reserved for non-replication superuser connections (100/100 exhausted)."
      };
      setLogs(prev => [poolLog, ...prev]);

      const incident = {
        id: `inc-${Date.now().toString().slice(-4)}-pool`,
        clientId: "c8f2a1b9-40e1-4c6d-92a4-79018e77c8e2",
        title: "PostgreSQL Port 5432 Connection Starvation",
        score: 0.924,
        status: "ACTIVE_TRIAGE",
        classification: "DB_CONNECTION_EXHAUSTION",
        createdAt: new Date().toISOString(),
        anomalyScore: 0.924,
        entities: ["service/postgres-primary", "pooler/pgbouncer-auth"]
      };

      setActiveIncident(incident);
      setActiveTab('langgraph');
      runPipelineForIncident(incident, false);

    } else if (scenarioId === "chaos-5xx-storm") {
      // Cascading 5xx Storm
      const anomalousMetrics = {
        cpu_usage: 88.5,
        memory_rss: 78.0,
        io_wait: 18.2,
        tx_error_rate: 7.8
      };
      setCurrentMetrics(anomalousMetrics);
      setTelemetryHistory(prev => [...prev.slice(-19), anomalousMetrics]);

      const timeoutLog = {
        ts: nowStr,
        lvl: "ERROR",
        src: "ingress/api-gateway",
        classification: "FATAL_DEADLOCK",
        msg: "HTTP 504 Gateway Timeout storm: upstream response time > 4500ms across 400 concurrent sockets."
      };
      setLogs(prev => [timeoutLog, ...prev]);

      const incident = {
        id: `inc-${Date.now().toString().slice(-4)}-storm`,
        clientId: "c8f2a1b9-40e1-4c6d-92a4-79018e77c8e2",
        title: "Cascading 5xx Ingress Timeout Storm",
        score: 0.948,
        status: "ACTIVE_TRIAGE",
        classification: "FATAL_DEADLOCK",
        createdAt: new Date().toISOString(),
        anomalyScore: 0.948,
        entities: ["ingress/api-gateway", "hpa/auth-gateway-scaler"]
      };

      setActiveIncident(incident);
      setActiveTab('langgraph');
      runPipelineForIncident(incident, false);

    } else if (scenarioId === "chaos-ast-malicious") {
      // AST Guardrail Destructive Test
      setActiveTab('sandbox');
    }
  };

  // Run LangGraph Pipeline
  const runPipelineForIncident = async (incident, forceSandboxFailureOnce = false) => {
    setIsGraphRunning(true);
    setExecutionTrace({ steps: [] });

    try {
      const result = await runLangGraphPipeline({
        incident,
        mode,
        forceSandboxFailureOnce,
        onStepProgress: ({ steps }) => {
          setExecutionTrace({ steps });
        }
      });

      if (result.success && mode === 'AUTONOMOUS') {
        // Celebrate self-healing!
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });

        // Add to incidents history
        const resolvedInc = {
          ...incident,
          status: "RESOLVED",
          resolvedAt: new Date().toISOString(),
          timeToDetectSec: 7.4,
          autonomousMttrSec: 86,
          summary: `Closed-loop detection and auto-remediation verified inside Docker sandbox with ${result.retriesUsed} reflection cycle(s).`,
          remediationScript: result.finalScript,
          sandboxPass: true,
          retries: result.retriesUsed,
          mode
        };
        setIncidents(prev => [resolvedInc, ...prev]);

        // Restore metrics smoothly to baseline
        setTimeout(() => {
          setCurrentMetrics({
            cpu_usage: 25.0,
            memory_rss: 48.0,
            io_wait: 2.2,
            tx_error_rate: 0.02
          });
          setActiveIncident(null);
        }, 1500);
      }
    } catch (err) {
      console.error("LangGraph error:", err);
    } finally {
      setIsGraphRunning(false);
    }
  };

  const handleRunSelfCorrectionDemo = () => {
    const incident = activeIncident || {
      id: `inc-demo-${Date.now().toString().slice(-4)}`,
      clientId: "c8f2a1b9-40e1-4c6d-92a4-79018e77c8e2",
      title: "Worker Pod Resident Memory Saturation",
      score: 0.954,
      status: "ACTIVE_TRIAGE",
      classification: "OOM_EARLY_WARNING",
      createdAt: new Date().toISOString(),
      anomalyScore: 0.954,
      entities: ["deployment/payment-processor"]
    };
    setActiveIncident(incident);
    runPipelineForIncident(incident, true);
  };

  const handleResetBaseline = () => {
    setCurrentMetrics({
      cpu_usage: 24.5,
      memory_rss: 47.0,
      io_wait: 2.0,
      tx_error_rate: 0.02
    });
    setActiveIncident(null);
    setExecutionTrace(null);
  };

  return (
    <div className="app-container">
      {activeTab === 'landing' ? (
        <SentinelLanding
          onEnterCockpit={() => setActiveTab('telemetry')}
          currentMetrics={currentMetrics}
          anomalyResult={anomalyResult}
          mode={mode}
          setMode={setMode}
          kpis={kpis}
        />
      ) : (
        <>
          {/* HUD Header */}
          <Header
            mode={mode}
            setMode={setMode}
            onOpenChaosModal={() => setIsChaosModalOpen(true)}
            activeIncidentsCount={activeIncident ? 1 : 0}
            kpis={kpis}
            isSimulating={isGraphRunning}
            theme={theme}
            setTheme={setTheme}
          />

          {/* Navigation Tabs */}
          <nav className="nav-bar">
            <button 
              className={`nav-tab ${activeTab === 'landing' ? 'active' : ''}`}
              onClick={() => setActiveTab('landing')}
            >
              <Compass size={16} />
              Sentinel Landing
            </button>

            <button 
              className={`nav-tab ${activeTab === 'telemetry' ? 'active' : ''}`}
              onClick={() => setActiveTab('telemetry')}
            >
              <Activity size={16} />
              Live SRE Cockpit
              {anomalyResult.isAnomalous && (
                <span className="nav-tab-badge" style={{ background: 'rgba(201, 130, 130, 0.25)', color: 'var(--accent-rose)' }}>
                  Anomaly &gt; 0.85
                </span>
              )}
            </button>

            <button 
              className={`nav-tab ${activeTab === 'langgraph' ? 'active' : ''}`}
              onClick={() => setActiveTab('langgraph')}
            >
              <GitBranch size={16} />
              LangGraph State Machine
              {isGraphRunning && (
                <span className="nav-tab-badge" style={{ background: 'rgba(83, 83, 102, 0.4)', color: 'var(--text-primary)' }}>
                  Executing
                </span>
              )}
            </button>

            <button 
              className={`nav-tab ${activeTab === 'sandbox' ? 'active' : ''}`}
              onClick={() => setActiveTab('sandbox')}
            >
              <Terminal size={16} />
              Docker Sandbox &amp; AST Guardrail
            </button>

            <button 
              className={`nav-tab ${activeTab === 'runbooks' ? 'active' : ''}`}
              onClick={() => setActiveTab('runbooks')}
            >
              <Database size={16} />
              Qdrant Vector DB &amp; RAG
            </button>

            <button 
              className={`nav-tab ${activeTab === 'postmortem' ? 'active' : ''}`}
              onClick={() => setActiveTab('postmortem')}
            >
              <FileText size={16} />
              Post-Mortems &amp; Governance
            </button>

            <button 
              className={`nav-tab ${activeTab === 'architecture' ? 'active' : ''}`}
              onClick={() => setActiveTab('architecture')}
            >
              <Network size={16} />
              Distributed Topology Blueprint
            </button>

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button 
                className="btn btn-outline" 
                style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem' }}
                onClick={handleResetBaseline}
                title="Restore telemetry to nominal baseline"
              >
                <RotateCcw size={13} />
                Reset Baseline
              </button>
            </div>
          </nav>

          {/* Main Viewport */}
          <main className="main-viewport">
            {activeTab === 'telemetry' && (
              <TelemetryView
                telemetryHistory={telemetryHistory}
                currentMetrics={currentMetrics}
                anomalyResult={anomalyResult}
                logs={logs}
                activeIncident={activeIncident}
                onViewIncident={() => setActiveTab('langgraph')}
              />
            )}

            {activeTab === 'langgraph' && (
              <LangGraphVisualizer
                executionTrace={executionTrace}
                isRunning={isGraphRunning}
                activeIncident={activeIncident}
                onRunSelfCorrectionDemo={handleRunSelfCorrectionDemo}
              />
            )}

            {activeTab === 'sandbox' && (
              <SandboxTerminal
                activeScript={null}
                onTestScriptInSandbox={() => {}}
              />
            )}

            {activeTab === 'runbooks' && (
              <RunbookExplorer />
            )}

            {activeTab === 'postmortem' && (
              <PostMortemView
                incidents={incidents}
                onApproveSlackRemediation={(inc) => {
                  confetti({ particleCount: 60, spread: 60 });
                  setTimeout(() => handleResetBaseline(), 1200);
                }}
              />
            )}

            {activeTab === 'architecture' && (
              <ArchitectureView />
            )}
          </main>
        </>
      )}

      {/* Chaos Engineering Modal */}
      <ChaosModal
        isOpen={isChaosModalOpen}
        onClose={() => setIsChaosModalOpen(false)}
        onInjectChaos={handleInjectChaos}
      />
    </div>
  );
}
