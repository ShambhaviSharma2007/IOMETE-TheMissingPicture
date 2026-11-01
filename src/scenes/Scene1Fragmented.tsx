import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '../context/SessionContext';
import { DATA_SOURCES } from '../data/content';
import { SceneHeader, MayaVoice } from '../components/ui';
import type { DataSourceNode } from '../types';

// ─── Node colours & positions ──────────────────────────────────────────────────

const NODE_COLORS: Record<string, string> = {
  'mkt-data':   '#3B82F6',
  'trade-rec':  '#F59E0B',
  'portfolio':  '#10B981',
  'ref-data':   '#A78BFA',
  'risk-calc':  '#F87171',
  'reporting':  '#34D399',
};

// ─── Topological Connection Graph with Disconnection Effects ───────────────────

interface ConnectionLine {
  from: string;
  to: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label: string;
}

const CONNECTIONS: ConnectionLine[] = [
  { from: 'ref-data', to: 'mkt-data', x1: 16, y1: 25, x2: 50, y2: 25, label: 'Ticker-to-ISIN' },
  { from: 'mkt-data', to: 'portfolio', x1: 50, y1: 25, x2: 84, y2: 25, label: 'Mark-to-Market' },
  { from: 'ref-data', to: 'trade-rec', x1: 16, y1: 25, x2: 16, y2: 75, label: 'LEI Master' },
  { from: 'trade-rec', to: 'portfolio', x1: 16, y1: 75, x2: 84, y2: 25, label: 'Settled Trades' },
  { from: 'portfolio', to: 'risk-calc', x1: 84, y1: 25, x2: 50, y2: 75, label: 'Positions' },
  { from: 'mkt-data', to: 'risk-calc', x1: 50, y1: 25, x2: 50, y2: 75, label: 'Price Curves' },
  { from: 'portfolio', to: 'reporting', x1: 84, y1: 25, x2: 84, y2: 75, label: 'Holdings' },
  { from: 'risk-calc', to: 'reporting', x1: 50, y1: 75, x2: 84, y2: 75, label: 'VaR Metrics' },
];

function DisconnectedTopology({
  activeNodeId,
  hoveredNodeId,
  onSelectNode,
}: {
  activeNodeId: string | null;
  hoveredNodeId: string | null;
  onSelectNode: (node: DataSourceNode) => void;
}) {
  const currentFocus = hoveredNodeId || activeNodeId;

  return (
    <div style={{
      position: 'relative',
      height: 220,
      background: 'radial-gradient(ellipse at 50% 50%, rgba(13, 16, 23, 0.9) 0%, rgba(8, 10, 16, 0.95) 100%)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      marginBottom: '2rem',
    }}>
      {/* SVG Canvas for Disconnected / Severed Lines */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <defs>
          <linearGradient id="severedLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(248, 113, 113, 0.5)" />
            <stop offset="50%" stopColor="rgba(248, 113, 113, 0.1)" />
            <stop offset="100%" stopColor="rgba(248, 113, 113, 0.5)" />
          </linearGradient>
        </defs>

        {CONNECTIONS.map((c, i) => {
          const isRelated = currentFocus && (c.from === currentFocus || c.to === currentFocus);
          return (
            <g key={i}>
              <line
                x1={`${c.x1}%`}
                y1={`${c.y1}%`}
                x2={`${c.x2}%`}
                y2={`${c.y2}%`}
                stroke={isRelated ? '#F87171' : 'rgba(255, 255, 255, 0.08)'}
                strokeWidth={isRelated ? 2 : 1}
                strokeDasharray={isRelated ? '4 4' : '3 3'}
                style={{
                  transition: 'all 0.3s ease',
                  opacity: currentFocus ? (isRelated ? 1 : 0.2) : 0.6,
                }}
              />
              {/* Pulsing break symbol on related connection */}
              {isRelated && (
                <circle
                  cx={`${(c.x1 + c.x2) / 2}%`}
                  cy={`${(c.y1 + c.y2) / 2}%`}
                  r={4}
                  fill="#F87171"
                  opacity={0.8}
                >
                  <animate attributeName="r" values="3;6;3" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0.2;0.8" dur="1.5s" repeatCount="indefinite" />
                </circle>
              )}
            </g>
          );
        })}
      </svg>

      {/* Floating Topology Nodes */}
      {DATA_SOURCES.map((node) => {
        const isSelected = activeNodeId === node.id;
        const isHovered = hoveredNodeId === node.id;
        const color = NODE_COLORS[node.id] || 'var(--accent)';

        // Position coordinates matching SVG
        const posMap: Record<string, { top: string; left: string }> = {
          'ref-data':   { left: '16%', top: '25%' },
          'mkt-data':   { left: '50%', top: '25%' },
          'portfolio':  { left: '84%', top: '25%' },
          'trade-rec':  { left: '16%', top: '75%' },
          'risk-calc':  { left: '50%', top: '75%' },
          'reporting':  { left: '84%', top: '75%' },
        };

        const coords = posMap[node.id] || { left: '50%', top: '50%' };

        return (
          <div
            key={node.id}
            onClick={() => onSelectNode(node)}
            style={{
              position: 'absolute',
              left: coords.left,
              top: coords.top,
              transform: 'translate(-50%, -50%)',
              cursor: 'pointer',
              zIndex: 10,
            }}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 14px',
                borderRadius: '999px',
                background: isSelected ? `${color}25` : isHovered ? 'var(--bg-card-hover)' : 'var(--bg-card)',
                border: `1.5px solid ${isSelected ? color : isHovered ? color + '88' : 'var(--border-default)'}`,
                boxShadow: isSelected ? `0 0 16px ${color}44` : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: color,
                boxShadow: isSelected ? `0 0 8px ${color}` : 'none',
              }} />
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
              }}>
                {node.code}
              </span>
            </motion.div>
          </div>
        );
      })}

      <div style={{
        position: 'absolute',
        bottom: 8,
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '0.6875rem',
        color: 'var(--text-muted)',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}>
        <span style={{ color: '#F87171' }}>✕</span> Broken Point-to-Point Pipelines (Hover or click nodes to trace severed flows)
      </div>
    </div>
  );
}

// ─── Dataset Consolidation Challenge Simulator ─────────────────────────────────

function DatasetConsolidationModal({ onClose }: { onClose: () => void }) {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      domain: '1. Market Data (MKT-DATA)',
      issue: '15-min Delay & Normalisation Drift',
      detail: 'Front Office reads proprietary feed formats (Reuters/Bloomberg). Downstream batch extracts run on a 15-minute delay without time-stamped revision tags. Join key ticker "BARC LN" does not match SEDOL.',
      status: 'FAIL: Unversioned Schema Drift',
    },
    {
      domain: '2. Trade Records (TRADE-REC)',
      issue: 'T+2 Batch Settlement Lag',
      detail: 'Trades captured from 12 executing brokers in 5 differing schemas (FIX, SWIFT, CSV). 8% exception breaks require overnight analyst triage. Cannot deliver intraday positions.',
      status: 'FAIL: Asynchronous Pipeline Breakage',
    },
    {
      domain: '3. Portfolio Positions (PORTFOLIO)',
      issue: 'Absence of an ACID Golden Record',
      detail: 'Custodians provide 4 differing position extracts. Portfolio managers maintain private Excel spreadsheets that overwrite concurrent cash balances. No unified snapshot exists.',
      status: 'FAIL: Dirty Reads & Phantom Balances',
    },
    {
      domain: '4. Reference Data (REF-DATA)',
      issue: 'Conflicting Entity Masters',
      detail: 'Three contradictory instrument master catalogs. When legal entity hierarchies change, mapping breaks for ~28,000 instruments, producing invalid LEIs on regulatory reports.',
      status: 'FAIL: Key Collision on ISIN/CUSIP',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(8, 10, 16, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 250,
        padding: '2rem',
        backdropFilter: 'blur(6px)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-active)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem',
          maxWidth: 680,
          width: '100%',
          boxShadow: 'var(--shadow-lg), var(--shadow-glow-accent)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <div className="text-label" style={{ color: '#F87171', marginBottom: 4 }}>
              Analytical Challenge Simulation
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Preparing a Consolidated Multi-Asset Risk Snapshot
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '1.5rem',
              lineHeight: 1,
              padding: '2px 8px',
            }}
          >
            ×
          </button>
        </div>

        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          Maya Sharma was tasked with producing an intraday combined P&L and Risk view across desks.
          In Aurelia Capital's current state, attempting a unified query across these 4 isolated databases
          results in cascading data integrity failures:
        </p>

        {/* Step Inspector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.75rem' }}>
          {steps.map((s, idx) => (
            <div
              key={idx}
              onClick={() => setActiveStep(idx)}
              style={{
                padding: '0.875rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                background: activeStep === idx ? 'rgba(248, 113, 113, 0.08)' : 'var(--bg-surface)',
                border: `1px solid ${activeStep === idx ? 'rgba(248, 113, 113, 0.35)' : 'var(--border-subtle)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {s.domain}
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  color: '#F87171',
                  background: 'rgba(248, 113, 113, 0.12)',
                  padding: '2px 8px',
                  borderRadius: 4,
                }}>
                  {s.status}
                </span>
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {s.detail}
              </div>
            </div>
          ))}
        </div>

        {/* Core Lesson */}
        <div style={{
          padding: '1rem 1.25rem',
          background: 'rgba(59, 130, 246, 0.06)',
          border: '1px solid var(--border-active)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
            Why Traditional Data Warehouses Fail Here
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            Without an open Lakehouse format like <strong>Apache Iceberg</strong> (with ACID transactions,
            time travel, and schema evolution) and decoupled Kubernetes compute engines, Aurelia is trapped
            stitching unversioned flat files and brittle ETL scripts.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn--primary btn--sm" onClick={onClose}>
            Understood — Back to Exploration
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Pain Card Detail View ────────────────────────────────────────────────────

function PainCard({ node, onClose }: { node: DataSourceNode; onClose: () => void }) {
  const color = NODE_COLORS[node.id] ?? 'var(--accent)';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 5 }}
      transition={{ duration: 0.25 }}
      style={{
        background: 'var(--bg-card)',
        border: `1px solid ${color}44`,
        borderRadius: 'var(--radius-xl)',
        padding: '2rem',
        maxWidth: 580,
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: `0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px ${color}22`,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color, letterSpacing: '0.1em', marginBottom: 6
          }}>
            {node.code}
          </div>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
            {node.label}
          </h3>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Domain Owner: <strong style={{ color: 'var(--text-secondary)' }}>{node.owner}</strong>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1, padding: '2px 8px' }}
        >×</button>
      </div>

      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '1.25rem' }}>
        {node.description}
      </p>

      {/* Metrics */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginBottom: '1.25rem'
      }}>
        {node.fictionalMetrics.map(m => (
          <div key={m.label} style={{
            padding: '0.5rem 0.75rem',
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 600, color }}>
              {m.value}
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: 2 }}>
              {m.label}
            </div>
          </div>
        ))}
      </div>

      {/* Relationships & Architecture Flow */}
      <div style={{
        marginBottom: '1.25rem',
        padding: '1rem',
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
      }}>
        <div className="text-label" style={{ marginBottom: '0.5rem', color: 'var(--accent)' }}>
          System Relationships & Interfaces
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 2 }}>
              Upstream Ingestion
            </div>
            <ul style={{ listStyle: 'none', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {node.relationships.upstream.map((u, i) => (
                <li key={i} style={{ marginBottom: 2 }}>← {u}</li>
              ))}
            </ul>
          </div>
          <div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 2 }}>
              Downstream Consumers
            </div>
            <ul style={{ listStyle: 'none', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {node.relationships.downstream.map((d, i) => (
                <li key={i} style={{ marginBottom: 2 }}>→ {d}</li>
              ))}
            </ul>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem', fontSize: '0.75rem', color: '#FCA5A5' }}>
          <strong>Bottleneck:</strong> {node.relationships.bottleneck}
        </div>
      </div>

      {/* Pain points */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div className="text-label" style={{ marginBottom: '0.5rem' }}>Fragmentation Problems</div>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {node.painPoints.map((p, i) => (
            <li key={i} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              <span style={{ color, flexShrink: 0 }}>—</span>
              {p}
            </li>
          ))}
        </ul>
      </div>

      {/* Failure mode */}
      <div style={{
        padding: '0.875rem 1rem',
        background: 'rgba(248, 113, 113, 0.08)',
        border: '1px solid rgba(248, 113, 113, 0.25)',
        borderRadius: 'var(--radius-md)',
      }}>
        <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#F87171', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
          ⚠ Documented Failure Mode
        </div>
        <p style={{ fontSize: '0.8125rem', color: '#FCA5A5', lineHeight: 1.55 }}>
          {node.failureMode}
        </p>
      </div>

      <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn btn--primary btn--sm" onClick={onClose}>
          Done Reviewing
        </button>
      </div>
    </motion.div>
  );
}

// ─── Data Source Node Card Button ─────────────────────────────────────────────

function DataNodeButton({
  node,
  isExplored,
  isActive,
  onClick,
  onHover,
}: {
  node: DataSourceNode;
  isExplored: boolean;
  isActive: boolean;
  onClick: () => void;
  onHover: (hovering: boolean) => void;
}) {
  const color = NODE_COLORS[node.id] ?? 'var(--accent)';

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: isActive
          ? `${color}18`
          : isExplored
          ? `${color}0D`
          : 'var(--bg-card)',
        border: `1px solid ${isActive ? color : isExplored ? color + '44' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem 1.5rem',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.2s ease',
        boxShadow: isActive ? `0 0 24px ${color}25` : 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Explored indicator */}
      {isExplored && (
        <div style={{
          position: 'absolute', top: 12, right: 14,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ fontSize: '0.6875rem', color: color, fontWeight: 600 }}>Explored</span>
          <div style={{
            width: 8, height: 8, borderRadius: '50%', background: color,
            boxShadow: `0 0 6px ${color}`,
          }} />
        </div>
      )}

      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color,
        letterSpacing: '0.1em', marginBottom: 6
      }}>
        {node.code}
      </div>

      <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
        {node.label}
      </div>

      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 12 }}>
        {node.owner}
      </div>

      <div style={{
        fontSize: '0.8125rem',
        color: 'var(--text-secondary)',
        lineHeight: 1.5,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        marginBottom: 12,
      }}>
        {node.description}
      </div>

      <div style={{
        fontSize: '0.75rem',
        color: color,
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: 4,
      }}>
        <span>Inspect domain details & relationships</span>
        <span>→</span>
      </div>
    </motion.button>
  );
}

// ─── Scene 1 Component ─────────────────────────────────────────────────────────

export function Scene1Fragmented() {
  const { state, navigate, exploreDataSource } = useSession();
  const [activeNode, setActiveNode] = useState<DataSourceNode | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [showSimModal, setShowSimModal] = useState<boolean>(false);

  const handleNodeClick = (node: DataSourceNode) => {
    exploreDataSource(node.id);
    setActiveNode(node);
  };

  const exploredCount = state.exploredDataSources.length;
  const canProceed = exploredCount >= 3;

  return (
    <div className="scene">
      <div className="scene__content">
        <div className="scene-enter">
          <SceneHeader
            eyebrow="Scene 1 of 7 · The Fragmented Picture"
            title="Aurelia Capital's Disconnected Systems"
            subtitle="Explore each distinct banking domain to uncover why data does not flow, how point-to-point batch extracts break, and what causes cross-asset failures."
          />

          <MayaVoice text="Before I could evaluate any platform, I had to understand what we were actually dealing with. These systems don't talk to each other. They each have their own failure modes. And every one of them is someone else's problem — until it becomes mine." />
        </div>

        {/* Action strip: Challenge simulator trigger */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.875rem 1.25rem',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '1.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '1.1rem' }}>⚡</span>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                The Consolidation Bottleneck
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                See what happens when Aurelia attempts to join all 4 core domains for an intraday risk view.
              </div>
            </div>
          </div>
          <button
            className="btn btn--ghost btn--sm"
            onClick={() => setShowSimModal(true)}
            style={{ borderColor: 'rgba(248, 113, 113, 0.4)', color: '#FCA5A5' }}
          >
            Simulate Consolidated Query →
          </button>
        </div>

        {/* Topological View */}
        <DisconnectedTopology
          activeNodeId={activeNode?.id || null}
          hoveredNodeId={hoveredNodeId}
          onSelectNode={handleNodeClick}
        />

        {/* Grid of Interactive Data Nodes */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          marginBottom: '2rem',
        }}>
          {DATA_SOURCES.map((node, idx) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
            >
              <DataNodeButton
                node={node}
                isExplored={state.exploredDataSources.includes(node.id)}
                isActive={activeNode?.id === node.id}
                onClick={() => handleNodeClick(node)}
                onHover={(hovering) => setHoveredNodeId(hovering ? node.id : null)}
              />
            </motion.div>
          ))}
        </div>

        {/* Detail Modal */}
        <AnimatePresence>
          {activeNode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => e.target === e.currentTarget && setActiveNode(null)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(8, 10, 16, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 200,
                padding: '2rem',
                backdropFilter: 'blur(5px)',
              }}
            >
              <PainCard node={activeNode} onClose={() => setActiveNode(null)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Simulation Modal */}
        <AnimatePresence>
          {showSimModal && (
            <DatasetConsolidationModal onClose={() => setShowSimModal(false)} />
          )}
        </AnimatePresence>

        {/* Progress & Navigation Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.5rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '2rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {DATA_SOURCES.map(n => (
                <div
                  key={n.id}
                  title={`${n.code} (${state.exploredDataSources.includes(n.id) ? 'Explored' : 'Unexplored'})`}
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: state.exploredDataSources.includes(n.id)
                      ? NODE_COLORS[n.id]
                      : 'var(--border-default)',
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </div>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              {exploredCount} of 6 domains explored
              {!canProceed && (
                <span style={{ color: 'var(--text-muted)', marginLeft: 8 }}>
                  (explore at least 3 to unlock next scene)
                </span>
              )}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              className="btn btn--ghost btn--sm"
              onClick={() => navigate(0)}
              title="Return to the opening story"
            >
              ← Back to Introduction
            </button>
            <button
              className="btn btn--primary btn--sm"
              disabled={!canProceed}
              onClick={() => navigate(2)}
              style={{
                opacity: canProceed ? 1 : 0.4,
                cursor: canProceed ? 'pointer' : 'not-allowed',
              }}
            >
              Build the Target Picture →
            </button>
          </div>
        </motion.div>

        {/* Full exploration banner */}
        {exploredCount === 6 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: '1.25rem 1.5rem',
              background: 'rgba(248, 113, 113, 0.07)',
              border: '1px solid rgba(248, 113, 113, 0.2)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <p style={{ fontSize: '0.875rem', color: '#FCA5A5', lineHeight: 1.65 }}>
              <strong style={{ color: '#F87171' }}>Diagnosis Complete:</strong> Six disconnected systems,
              each running on isolated architectures with point-to-point batch dependencies.
              Data arrives with different vintages, schemas evolve unpredictably, and no single golden record
              exists. Maya's next task is to formulate the exact requirements for a modern data platform.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
