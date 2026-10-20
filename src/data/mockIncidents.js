// PostgreSQL Relational State Model (TRD Section 7)
// Stores clients, incidents, remediations, and audit_logs

export const INITIAL_CLIENT = {
  id: "c8f2a1b9-40e1-4c6d-92a4-79018e77c8e2",
  name: "Acme Cloud Production Services",
  api_key_hash: "sha256$8f918e76c1...$829da1b",
  created_at: "2026-09-01T08:00:00Z"
};

export const INITIAL_INCIDENTS = [
  {
    id: "inc-9410-oom",
    clientId: "c8f2a1b9-40e1-4c6d-92a4-79018e77c8e2",
    title: "Payment Worker Resident Memory Surge",
    score: 0.942,
    status: "RESOLVED",
    classification: "OOM_EARLY_WARNING",
    createdAt: "2026-10-19T22:14:00Z",
    resolvedAt: "2026-10-19T22:15:38Z",
    timeToDetectSec: 7.8,
    autonomousMttrSec: 98,
    entities: ["deployment/payment-processor", "container/worker-0"],
    sandboxPass: true,
    retries: 1,
    mode: "AUTONOMOUS",
    summary: "Pre-crash Isolation Forest anomaly triggered at score 0.942. Memory buffer cache purged in ephemeral sandbox and live cgroup limits bumped to 2560Mi.",
    remediationScript: `kubectl exec -n prod deployment/payment-processor -- /usr/local/bin/flush-cache.sh
kubectl set resources deployment/payment-processor -n prod --limits=memory=2560Mi`
  },
  {
    id: "inc-8721-pg",
    clientId: "c8f2a1b9-40e1-4c6d-92a4-79018e77c8e2",
    title: "PostgreSQL Client Connection Starvation",
    score: 0.895,
    status: "RESOLVED",
    classification: "DB_CONNECTION_EXHAUSTION",
    createdAt: "2026-10-18T14:02:10Z",
    resolvedAt: "2026-10-18T14:04:22Z",
    timeToDetectSec: 11.2,
    autonomousMttrSec: 132,
    entities: ["service/postgres-primary", "pooler/pgbouncer-auth"],
    sandboxPass: true,
    retries: 0,
    mode: "SAFE",
    summary: "PgBouncer pool saturation detected. Safe Mode generated Slack card; engineer one-click approved connection scaling from 80 to 150.",
    remediationScript: `sed -i 's/default_pool_size = .*/default_pool_size = 150/' /etc/pgbouncer/pgbouncer.ini
kill -HUP $(pidof pgbouncer)`
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: "aud-001",
    incidentId: "inc-9410-oom",
    stage: "diagnose_node",
    timestamp: "2026-10-19T22:14:02Z",
    payload: {
      qdrantSimilarity: 0.962,
      runbookMatched: "rb-k8s-oom-001",
      anomalyScore: 0.942,
      inferenceLatencyMs: 3.2
    }
  },
  {
    id: "aud-002",
    incidentId: "inc-9410-oom",
    stage: "sandbox_node",
    timestamp: "2026-10-19T22:14:45Z",
    payload: {
      exitCode: 127,
      stderr: "flush-cache.sh: not found in /opt/app",
      action: "Triggered reflect_node self-correction"
    }
  },
  {
    id: "aud-003",
    incidentId: "inc-9410-oom",
    stage: "sandbox_node_retry_1",
    timestamp: "2026-10-19T22:15:10Z",
    payload: {
      exitCode: 0,
      stdout: "Clean exit. Memory limit increased to 2560Mi.",
      sandboxPass: true
    }
  },
  {
    id: "aud-004",
    incidentId: "inc-9410-oom",
    stage: "dispatch_node",
    timestamp: "2026-10-19T22:15:25Z",
    payload: {
      actuator: "kubernetes-client/v1",
      mode: "AUTONOMOUS",
      result: "REMEDIATED"
    }
  }
];
