# Xerneas — Autonomous SRE & Closed-Loop AIOps Engine

> **Closed-Loop Incident Detection, Root Cause Analysis, and Self-Healing Automation**

Built according to the specifications in [`docs/AIOps Sentinel Product Requirements Document.pdf`](docs/AIOps%20Sentinel%20Product%20Requirements%20Document.pdf) and [`docs/AIOps Sentinel Technical Requirements Document.pdf`](docs/AIOps%20Sentinel%20Technical%20Requirements%20Document.pdf).

---

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Start local development server (Vite)
npm run dev

# Build for production
npm run build
```

The web application runs on `http://localhost:5173/`.

---

## 🚀 Key Modules & Capabilities

1. **Live SRE Cockpit**:
   - Real-time sliding window telemetry waveforms (CPU %, Resident Set Memory %, I/O Wait, Error Rate).
   - Tier 1: Isolation Forest multivariate anomaly gauge (p99 latency < 5ms, threshold > 0.85).
   - Tier 2: DistilBERT NLP error log stream (`ROUTINE`, `DB_CONNECTION_EXHAUSTION`, `OOM_EARLY_WARNING`, `FATAL_DEADLOCK`).

2. **LangGraph State Machine Engine**:
   - `diagnose_node` $\to$ `patch_gen_node` $\to$ `sandbox_node` $\to$ `reflect_node` $\to$ `dispatch_node`.
   - Condition Gate: If `sandbox_exit_code != 0` & `retries < 3`, self-corrects via `reflect_node`.

3. **Docker Ephemeral Sandbox & AST Guardrail**:
   - Container isolation: `--net=none`, non-root (`--user=1001`), 15s timeout limit.
   - Abstract Syntax Tree (AST) parser intercepting destructive patterns (`rm -rf /`, `mkfs`, `dd`, `iptables -F`, `/etc/passwd`).

4. **Qdrant Vector DB & RAG**:
   - 384-dimensional dense embeddings (`bge-small-en-v1.5`) across chunked blueprints and runbooks.
   - Strict JSON Schema contract validation.

5. **Incident Post-Mortems & Governance**:
   - Automated Markdown post-mortem generator.
   - Interactive Slack card preview for Safe Mode blast-radius control.
   - PostgreSQL relational schema audit table.

6. **Verification Matrix & Chaos Engineering Lab**:
   - Memory Leak Injection (`stress-ng --vm 2 --vm-bytes 90%`)
   - Connection Pool Exhaustion (PostgreSQL 5432 socket exhaustion)
   - Cascading 5xx Storm (HTTP gateway timeout surge)
   - Destructive Script AST Quarantine Test
