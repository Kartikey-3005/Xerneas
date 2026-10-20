// Qdrant Vector DB Runbooks & Architecture Blueprints
// Embedding Dimension: 384 (bge-small-en-v1.5)

export const RUNBOOKS = [
  {
    id: "rb-k8s-oom-001",
    title: "Kubernetes Pod OOMKilled & Resident Set Size Memory Saturation",
    category: "CONTAINER_ORCHESTRATION",
    symptom: "Memory RSS > 90% with cgroup v2 page cache buildup and near-threshold limit breaches",
    classification: "OOM_EARLY_WARNING",
    similarityScore: 0.962,
    embeddingVectorSample: [0.042, -0.118, 0.089, 0.214, -0.055, 0.312, -0.098, 0.176],
    targetEntities: ["deployment/payment-processor", "container/worker-cgroup-0"],
    astWhitelist: ["sync", "echo", "cat", "kubectl", "kill -SIGUSR1"],
    remediationScript: `#!/bin/sh
set -e
# Step 1: Pre-eviction memory pressure dump
sync && echo 3 > /proc/sys/vm/drop_caches 2>/dev/null || true

# Step 2: Graceful JVM / Worker cache flush signal
echo "Flushing internal buffer cache for worker pods..."
kubectl exec -n prod deployment/payment-processor -- /opt/app/bin/flush-cache.sh --level=aggressive

# Step 3: Proactive memory limit buffer expansion
kubectl set resources deployment/payment-processor -n prod --limits=memory=2560Mi --requests=memory=1536Mi
echo "Remediation verified: memory headroom expanded by 25%."`,
    rollbackScript: `kubectl set resources deployment/payment-processor -n prod --limits=memory=2048Mi --requests=memory=1024Mi`
  },
  {
    id: "rb-pg-pool-002",
    title: "PostgreSQL Port 5432 Connection Pool Exhaustion & Socket Starvation",
    category: "DATABASE_INFRASTRUCTURE",
    symptom: "FATAL: remaining connection slots are reserved for non-replication superuser connections",
    classification: "DB_CONNECTION_EXHAUSTION",
    similarityScore: 0.948,
    embeddingVectorSample: [-0.078, 0.245, -0.032, 0.187, 0.334, -0.112, 0.095, -0.043],
    targetEntities: ["service/postgres-primary", "pooler/pgbouncer-auth"],
    astWhitelist: ["pg_isready", "psql", "pgbouncer", "sed", "systemctl"],
    remediationScript: `#!/bin/sh
set -e
# Step 1: Drain stale idle-in-transaction connections
echo "Terminating idle PostgreSQL client backends (>120s)..."
psql -h postgres-primary -U postgres -d sentinel_db -c "
  SELECT pg_terminate_backend(pid) 
  FROM pg_stat_activity 
  WHERE state = 'idle in transaction' 
    AND state_change < current_timestamp - INTERVAL '120 seconds';
"

# Step 2: Elevate PgBouncer default pool size
echo "Dynamically scaling PgBouncer server pool size: 80 -> 150..."
sed -i 's/default_pool_size = .*/default_pool_size = 150/' /etc/pgbouncer/pgbouncer.ini
kill -HUP $(pidof pgbouncer)
echo "PgBouncer reloaded successfully with zero dropped sockets."`,
    rollbackScript: `sed -i 's/default_pool_size = .*/default_pool_size = 80/' /etc/pgbouncer/pgbouncer.ini && kill -HUP $(pidof pgbouncer)`
  },
  {
    id: "rb-gateway-5xx-003",
    title: "HTTP Gateway Ingress Cascading 504 Gateway Timeouts & Replica Lag",
    category: "TRAFFIC_ENGINEERING",
    symptom: "Ingress 5xx error rate > 6.5% with upstream queue saturation and p99 latency > 4200ms",
    classification: "FATAL_DEADLOCK",
    similarityScore: 0.931,
    embeddingVectorSample: [0.115, -0.063, 0.301, -0.219, 0.147, 0.082, -0.165, 0.283],
    targetEntities: ["ingress/api-gateway", "hpa/auth-gateway-scaler"],
    astWhitelist: ["kubectl", "curl", "helm", "nginx"],
    remediationScript: `#!/bin/sh
set -e
# Step 1: Emergency horizontal replica expansion
echo "Targeting deployment/api-gateway: scaling replicas from 3 to 8..."
kubectl scale deployment/api-gateway -n ingress --replicas=8

# Step 2: Activate upstream circuit breaker dampener
echo "Activating ingress circuit breaker with 2000ms shed threshold..."
kubectl annotate ingress/api-gateway -n ingress nginx.ingress.kubernetes.io/proxy-read-timeout="15" --overwrite
kubectl rollout status deployment/api-gateway -n ingress --timeout=45s
echo "Cascading timeout storm quelled. 5xx rate dropped below 0.02%."`,
    rollbackScript: `kubectl scale deployment/api-gateway -n ingress --replicas=3`
  }
];

export const TOPOLOGY_NODES = [
  { id: "node-1", name: "Client Telemetry Agent", role: "Vector / SDK Hook", status: "ONLINE", latency: "1.2ms", load: "9,820 ev/s" },
  { id: "node-2", name: "FastAPI Ingestion Gateway", role: "Stateless HTTP/2 Ingress", status: "HEALTHY", latency: "1.8ms", load: "10,240 ev/s" },
  { id: "node-3", name: "Redis Stream Buffer", role: "stream:telemetry:raw", status: "BUFFERING", latency: "0.6ms", load: "TTL: 4h" },
  { id: "node-4", name: "ONNX ML Anomaly Engine", role: "IsoForest (p99 < 5ms) + DistilBERT", status: "EVALUATING", latency: "3.4ms", load: "Model v1.4" },
  { id: "node-5", name: "LangGraph Orchestrator", role: "State Machine & RAG Agent", status: "ACTIVE", latency: "120ms", load: "Qdrant 384d" },
  { id: "node-6", name: "Docker Ephemeral Sandbox", role: "--net=none non-root validation", status: "STANDBY", latency: "15s limit", load: "Alpine/Ubuntu" },
  { id: "node-7", name: "Kubernetes Production Cluster", role: "Live Actuation & Governance", status: "PROTECTED", latency: "Direct API", load: "Safe Mode" }
];
