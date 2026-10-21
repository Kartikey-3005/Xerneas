import React, { useState } from 'react';
import { 
  Network, 
  Server, 
  Cpu, 
  Layers, 
  Terminal, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  Database,
  ExternalLink 
} from 'lucide-react';

const TOPOLOGY_NODES = [
  {
    id: "node-1",
    name: "FastAPI Ingestion Gateway",
    role: "Non-blocking event listener for telemetry frames",
    latency: "0.8ms",
    load: "10,240 ev/s",
    spec: "ASGI • Python 3.11 uvloop • /api/v1/telemetry",
    status: "HEALTHY"
  },
  {
    id: "node-2",
    name: "Redis Stream Buffer",
    role: "Decouples burst spikes from ML inference pipeline",
    latency: "0.2ms",
    load: "stream:telemetry:raw",
    spec: "In-memory circular buffer • 4h retention window",
    status: "HEALTHY"
  },
  {
    id: "node-3",
    name: "ONNX DirectML Isolation Forest",
    role: "Tier 1 multivariate anomaly scoring (p99 < 5ms)",
    latency: "3.2ms",
    load: "Score: 0.21 Nominal",
    spec: "iForest 100 trees • Sliding 60s window • 4 features",
    status: "HEALTHY"
  },
  {
    id: "node-4",
    name: "LogHub DistilBERT Stream",
    role: "Tier 2 log classification & pre-crash categorization",
    latency: "14.5ms",
    load: "ROUTINE",
    spec: "6-layer transformer • Hugging Face ONNX runtime",
    status: "HEALTHY"
  },
  {
    id: "node-5",
    name: "Qdrant Vector DB (384d)",
    role: "HNSW cosine similarity retrieval across runbooks",
    latency: "6.1ms",
    load: "Top-1: 96.2% Sim",
    spec: "bge-small-en-v1.5 embeddings • strict JSON contracts",
    status: "HEALTHY"
  },
  {
    id: "node-6",
    name: "Docker Ephemeral Sandbox",
    role: "Zero-trust execution test prior to live actuation",
    latency: "820ms",
    load: "Verified 100%",
    spec: "--net=none • --user=1001 • timeout=15s • AST Guard",
    status: "HEALTHY"
  },
  {
    id: "node-7",
    name: "Live Actuation / Slack Card",
    role: "Kubernetes pod reboot & Slack card notification",
    latency: "120ms",
    load: "Safe Mode Active",
    spec: "K8s API client / Slack webhook / PostgreSQL Audit",
    status: "HEALTHY"
  }
];

export default function ArchitectureView() {
  const [selectedNode, setSelectedNode] = useState(TOPOLOGY_NODES[1]);

  const architecturalDetails = {
    "node-1": {
      name: "FastAPI Telemetry Ingestion Gateway (TRD Section 2)",
      protocol: "HTTP/2 REST + WebSockets (FastAPI + Pydantic v2)",
      throughput: "10,240 events/sec peak, p99 latency: 1.1ms",
      contracts: "Validates JSON payload with CPU, RSS, I/O Wait, TX Errors against strict Pydantic model.",
      failover: "Multi-replica Horizontal Pod Autoscaler (HPA) behind Envoy Ingress controller."
    },
    "node-2": {
      name: "Redis Stream Buffer (FR-01)",
      protocol: "RESP3 Redis Stream Protocol (XADD / XREADGROUP)",
      throughput: "Zero drop buffer up to 100,000 events backpressure surge",
      contracts: "Keys: stream:telemetry:raw, stream:logs:distilbert, Consumer group: aiops-evaluators",
      failover: "Redis Sentinel active-passive cluster with automatic master failover (< 3s)."
    },
    "node-3": {
      name: "Isolation Forest Anomaly Engine (FR-02)",
      protocol: "Local ONNX Runtime / DirectML Hardware Accelerated",
      throughput: "Evaluation latency p99: 3.2ms (well under 5ms SLA requirement)",
      contracts: "Evaluates [cpu_usage, memory_rss, io_wait, tx_error_rate]. Anomaly score normalized 0.0 - 1.0.",
      failover: "Pre-compiled static ONNX computational graph with fallback CPU threadpool."
    },
    "node-4": {
      name: "DistilBERT Log Classifier (FR-02 Tier 2)",
      protocol: "PyTorch C++ LibTorch Inference Engine",
      throughput: "Fine-tuned on LogHub 2k dataset, 98.4% categorical precision",
      contracts: "Classifies logs into ROUTINE, OOM_EARLY_WARNING, DB_CONNECTION_EXHAUSTION, FATAL_DEADLOCK.",
      failover: "Dynamic batching queue (size=16) with 50ms flush timeout."
    },
    "node-5": {
      name: "Qdrant Vector DB & RAG Pipeline (TRD Section 4)",
      protocol: "gRPC Vector Search over port 6334",
      throughput: "384-dimensional dense vectors retrieved in 6.1ms with HNSW index",
      contracts: "Chunked markdown runbooks and architectural blueprints with cosine distance metric.",
      failover: "Qdrant distributed cluster with 2x replication factor across availability zones."
    },
    "node-6": {
      name: "Ephemeral Docker Sandbox & AST Guardrail (TRD Section 6 & 7)",
      protocol: "Docker Engine Unix Socket (/var/run/docker.sock)",
      throughput: "Container boot: 320ms, command execution < 2s, memory cap: 256MB",
      contracts: "Isolation flags: --net=none, --user=1001, AST whitelist blocking rm, mkfs, iptables, dd.",
      failover: "Hard 15s timeout watchdog kill signal with automated rollback trigger."
    },
    "node-7": {
      name: "Safe Mode Governance & Slack Card (TRD Section 7)",
      protocol: "Kubernetes Client Go SDK & Slack Block Kit Webhooks",
      throughput: "Safe Mode holds blast-radius until engineer clicks Slack Card or Cockpit UI",
      contracts: "PostgreSQL audit logs stored with cryptographic hash of remediation commands.",
      failover: "Automated timeout fallback (5 min): unapproved actions quarantine automatically."
    }
  };

  const currentDetails = architecturalDetails[selectedNode.id] || architecturalDetails["node-2"];

  return (
    <div className="architecture-view">
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem', background: 'var(--bg-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Network size={20} color="var(--jh-canvas)" />
              High-Level Distributed Topology &amp; Architecture Blueprint
            </h2>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              TRD Section 1 (Figure 2.0): Decoupled telemetry ingestion, hybrid ONNX inference, LangGraph state machine, and Docker sandboxing
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <span className="status-chip">
              <Server size={14} color="var(--accent-emerald)" />
              Nodes: 7 Active Tiers
            </span>
            <span className="status-chip">
              <Zap size={14} color="var(--jh-slate)" />
              SLA: 99.99% Availability
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Topology Pipeline Ribbon */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem', background: 'var(--bg-secondary)', overflowX: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: '960px' }}>
          {TOPOLOGY_NODES.map((node, index) => {
            const isSelected = selectedNode.id === node.id;
            return (
              <React.Fragment key={node.id}>
                <div
                  onClick={() => setSelectedNode(node)}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'rgba(83, 83, 102, 0.28)' : 'var(--bg-card)',
                    border: `2px solid ${isSelected ? 'var(--border-accent)' : 'var(--border-subtle)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 0 20px rgba(234, 230, 224, 0.2)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      TIER 0{index + 1}
                    </span>
                    <span className="status-dot" style={{ background: 'var(--accent-emerald)' }} />
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    {node.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    {node.role}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--jh-canvas)' }}>
                    <span>{node.latency}</span>
                    <span>{node.load}</span>
                  </div>
                </div>

                {index < TOPOLOGY_NODES.length - 1 && (
                  <ArrowRight size={18} color="var(--border-medium)" style={{ flexShrink: 0 }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Selected Tier Architectural Specification */}
      <div className="grid-2col">
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={16} color="var(--jh-canvas)" />
            Tier Specification: {currentDetails.name}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Protocol &amp; Transport</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
                {currentDetails.protocol}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Throughput &amp; Performance SLA</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
                {currentDetails.throughput}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Payload Contract &amp; Schema</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                {currentDetails.contracts}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>High Availability &amp; Failover Resilience</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--accent-amber)', marginTop: '0.2rem' }}>
                {currentDetails.failover}
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={16} color="var(--accent-emerald)" />
            Verification Matrix &amp; Chaos Engineering (TRD Section 8)
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0.85rem' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-rose)', marginBottom: '0.25rem' }}>
                1. Memory Leak Injection
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                <code>stress-ng --vm 2 --vm-bytes 90%</code> to test proactive OOM container reboot and cache flush before kernel OOM-killer invokes.
              </div>
              <span className="distil-tag distil-oom">OOM_EARLY_WARNING</span>
            </div>

            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0.85rem' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-amber)', marginBottom: '0.25rem' }}>
                2. Connection Pool Exhaustion
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Continuous concurrent socket exhaustion against PostgreSQL port 5432 to verify dynamic connection limit expansion via PgBouncer.
              </div>
              <span className="distil-tag distil-pool">DB_CONNECTION_EXHAUSTION</span>
            </div>

            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0.85rem' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--jh-slate)', marginBottom: '0.25rem' }}>
                3. Cascading 5xx Storm
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Simulated HTTP gateway timeouts to validate replica autoscaling triggers from 3 &rarr; 8 pods with ingress circuit breakers.
              </div>
              <span className="distil-tag distil-deadlock">FATAL_DEADLOCK</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
