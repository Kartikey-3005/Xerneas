import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  Layers, 
  FileText, 
  Cpu, 
  Code, 
  CheckCircle, 
  ExternalLink 
} from 'lucide-react';
import { RUNBOOKS } from '../data/runbooks';

export default function RunbookExplorer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRunbook, setSelectedRunbook] = useState(RUNBOOKS[0]);
  const [activeTab, setActiveTab] = useState('script'); // 'script' | 'vector' | 'schema'

  const filteredRunbooks = RUNBOOKS.filter(rb => 
    rb.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rb.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rb.classification.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="runbook-explorer">
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem', background: 'var(--bg-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Database size={20} color="#06b6d4" />
              Qdrant Vector DB Runbooks &amp; GenAI RAG (TRD Section 4)
            </h2>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Chunked architecture blueprints, runbooks, and historical post-mortems embedded via <code>bge-small-en-v1.5</code> (384 dimensions)
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <span className="status-chip">
              <Layers size={14} color="#6366f1" />
              Collection: sentinel_runbooks_384d
            </span>
            <span className="status-chip">
              <CheckCircle size={14} color="#10b981" />
              Index: HNSW Cosine
            </span>
          </div>
        </div>
      </div>

      <div className="grid-2col">
        {/* Left: Vector Search & Collection List */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search vector embeddings by symptom or failure..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: '#04070d',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                padding: '0.55rem 0.75rem 0.55rem 2.2rem',
                color: '#fff',
                fontSize: '0.8rem',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filteredRunbooks.map(rb => {
              const isSelected = selectedRunbook.id === rb.id;
              return (
                <div
                  key={rb.id}
                  onClick={() => setSelectedRunbook(rb)}
                  style={{
                    padding: '0.9rem',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'rgba(6, 182, 212, 0.12)' : 'rgba(15, 23, 42, 0.6)',
                    border: `1px solid ${isSelected ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span className="distil-tag distil-routine" style={{ fontSize: '0.62rem' }}>
                      {rb.category}
                    </span>
                    <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>
                      Sim: {(rb.similarityScore * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.35rem' }}>
                    {rb.title}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {rb.symptom}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Runbook Viewer */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                {selectedRunbook.title}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                ID: {selectedRunbook.id} • Target: {selectedRunbook.targetEntities.join(', ')}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <button 
                className={`btn ${activeTab === 'script' ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem' }}
                onClick={() => setActiveTab('script')}
              >
                Remediation Script
              </button>
              <button 
                className={`btn ${activeTab === 'vector' ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem' }}
                onClick={() => setActiveTab('vector')}
              >
                384d Vector
              </button>
              <button 
                className={`btn ${activeTab === 'schema' ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem' }}
                onClick={() => setActiveTab('schema')}
              >
                JSON Contract
              </button>
            </div>
          </div>

          {activeTab === 'script' && (
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Parameterized Recovery Shell Script (Validated for Docker Sandbox)
              </div>
              <pre className="code-view" style={{ maxHeight: '280px', marginBottom: '1rem' }}>
{selectedRunbook.remediationScript}
              </pre>

              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Deterministic Rollback Procedure
              </div>
              <pre className="code-view" style={{ maxHeight: '80px', background: '#0a0d14' }}>
{selectedRunbook.rollbackScript}
              </pre>
            </div>
          )}

          {activeTab === 'vector' && (
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Dense Vector Embedding (Sample dimensions 1-8 of 384 via <code>bge-small-en-v1.5</code>):
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
                {selectedRunbook.embeddingVectorSample.map((val, idx) => (
                  <div key={idx} style={{ background: '#05070c', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.5rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>d_{idx + 1}</div>
                    <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: val >= 0 ? '#34d399' : '#f87171' }}>
                      {val.toFixed(4)}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Qdrant Index metric: Cosine distance. Normalized threshold &gt; 0.90 flags high-confidence runbook match for autonomous agent execution.
              </div>
            </div>
          )}

          {activeTab === 'schema' && (
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Strict LLM Output JSON Schema Contract (TRD Section 4):
              </div>
              <pre className="code-view" style={{ maxHeight: '340px' }}>
{JSON.stringify({
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "AIOpsSentinelRCAContract",
  "type": "object",
  "required": ["root_cause_justification", "target_system_entities", "recovery_shell_script", "rollback_recipe"],
  "properties": {
    "root_cause_justification": { "type": "string" },
    "target_system_entities": { 
      "type": "array", 
      "items": { "type": "string" } 
    },
    "recovery_shell_script": { "type": "string" },
    "rollback_recipe": { "type": "string" },
    "security_whitelist_compliance": { "type": "boolean" }
  }
}, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
