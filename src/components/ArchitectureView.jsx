import React, { useState } from 'react';
import { 
  Layers, 
  Cpu, 
  Database, 
  Terminal, 
  ShieldCheck, 
  Server, 
  Network, 
  ArrowRight, 
  Zap, 
  Radio 
} from 'lucide-react';
import { TOPOLOGY_NODES } from '../data/runbooks';

export default function ArchitectureView() {
  const [selectedNode, setSelectedNode] = useState(TOPOLOGY_NODES[1]);

  const architecturalDetails = {
    "node-1": {
      name: "Client Telemetry Agent (Vector / SDK)",
      protocol: "gRPC / TLS 1.3 over HTTP/2",
      throughput: "Zero-lag local buffer, 10k events/sec peak",
      contracts: "Batched JSON metric frames (cpu_pct, mem_pct, io_wait, log_stream)",
      failover: "Local disk ring-buffer spillover on network backpressure"
    },
    "node-2": {
      name: "FastAPI Ingestion Gateway",
      protocol: "Stateless asynchronous Python ASGI (Uvicorn)",
      throughput: "Sub-2ms token validation via Redis key cache",
      contracts: "RFC-4122 UUIDv4 client authorization with schema validation",
      failover: "Horizontal autoscaling across 4 replicas behind cloud load balancer"
    },
    "node-3": {
      name: "Redis Stream Buffer",
      protocol: "Redis Streams (XADD / XREADGROUP)",
      throughput: "stream:telemetry:raw key with 4-hour event expiry TTL",
      contracts: "FIFO ordered backpressure buffer with consumer group acks",
      failover: "Redis Sentinel cluster with in-memory persistence snapshots"
    },
    "node-4": {
      name: "ONNX ML Anomaly Engine",
      protocol: "Local DirectML / ONNX Runtime C++ bindings",
      throughput: "p99 evaluation latency under 5ms per sliding window",
      contracts: "Isolation Forest (normalized score 0-1) + DistilBERT LogHub classifier",
      failover: "Fallbacks to deterministic statistical moving-average thresholding"
    },
    "node-5": {
      name: "LangGraph Orchestrator & Qdrant RAG",
      protocol: "LangGraph State Machine DAG + Qdrant REST/gRPC API",
      throughput: "bge-small-en-v1.5 384-dimensional dense vector embeddings",
      contracts: "Strict JSON Schema contract for root cause, target entities, and shell scripts",
      failover: "Max 3-iteration self-correction loop; aborts to emergency Slack alert"
    },
    "node-6": {
      name: "Docker Ephemeral Sandbox Agent",
      protocol: "Docker SDK for Python (/var/run/docker.sock)",
      throughput: "Ephemeral Alpine/Ubuntu container booted in 450ms",
      contracts: "Flags: --net=none (no egress), non-root (--user=1001), 15s timeout limit",
      failover: "AST Command Filter intercepts destructive patterns prior to container launch"
    },
    "node-7": {
      name: "Production Cluster Actuation",
      protocol: "Kubernetes API / Docker Engine API / Slack Incoming Webhooks",
      throughput: "Zero downtime canary rollouts and cgroup limit hot-patching",
      contracts: "Safe Mode requires manual 1-click Slack card; Autonomous executes non-destructive patches",
      failover: "Automated rollback procedure stored in runbook metadata"
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
              <Network size={20} color="#06b6d4" />
              High-Level Distributed Topology &amp; Architecture Blueprint
            </h2>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              TRD Section 1 (Figure 2.0): Decoupled telemetry ingestion, hybrid ONNX inference, LangGraph state machine, and Docker sandboxing
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <span className="status-chip">
              <Server size={14} color="#10b981" />
              Nodes: 7 Active Tiers
            </span>
            <span className="status-chip">
              <Zap size={14} color="#6366f1" />
              SLA: 99.99% Availability
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Topology Pipeline Ribbon */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem', background: '#070a10', overflowX: 'auto' }}>
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
                    background: isSelected ? 'rgba(6, 182, 212, 0.15)' : 'rgba(15, 23, 42, 0.8)',
                    border: `2px solid ${isSelected ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 0 20px rgba(6, 182, 212, 0.3)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      TIER 0{index + 1}
                    </span>
                    <span className="status-dot" style={{ background: '#10b981' }} />
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.25rem' }}>
                    {node.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.4rem' }}>
                    {node.role}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>
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
          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#38bdf8', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={16} />
            Tier Specification: {currentDetails.name}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Protocol &amp; Transport</div>
              <div style={{ fontSize: '0.85rem', color: '#f8fafc', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
                {currentDetails.protocol}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Throughput &amp; Performance SLA</div>
              <div style={{ fontSize: '0.85rem', color: '#10b981', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
                {currentDetails.throughput}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Payload Contract &amp; Schema</div>
              <div style={{ fontSize: '0.85rem', color: '#e2e8f0', marginTop: '0.2rem' }}>
                {currentDetails.contracts}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>High Availability &amp; Failover Resilience</div>
              <div style={{ fontSize: '0.85rem', color: '#f59e0b', marginTop: '0.2rem' }}>
                {currentDetails.failover}
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={16} color="#10b981" />
            Verification Matrix &amp; Chaos Engineering (TRD Section 8)
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0.85rem' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f87171', marginBottom: '0.25rem' }}>
                1. Memory Leak Injection
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                <code>stress-ng --vm 2 --vm-bytes 90%</code> to test proactive OOM container reboot and cache flush before kernel OOM-killer invokes.
              </div>
              <span className="distil-tag distil-oom">OOM_EARLY_WARNING</span>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0.85rem' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fbbf24', marginBottom: '0.25rem' }}>
                2. Connection Pool Exhaustion
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Continuous concurrent socket exhaustion against PostgreSQL port 5432 to verify dynamic connection limit expansion via PgBouncer.
              </div>
              <span className="distil-tag distil-pool">DB_CONNECTION_EXHAUSTION</span>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0.85rem' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#c084fc', marginBottom: '0.25rem' }}>
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
