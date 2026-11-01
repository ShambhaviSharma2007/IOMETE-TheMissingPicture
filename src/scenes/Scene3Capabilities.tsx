import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '../context/SessionContext';
import { REQUIREMENTS, IOMETE_CAPABILITIES } from '../data/content';
import { EvidenceBadge, SceneHeader, MayaVoice, CoverageBar } from '../components/ui';
import type { IometeCapability } from '../types';

function CapabilityDetail({ cap, onClose }: { cap: IometeCapability; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(8, 10, 16, 0.8)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 200, padding: '2rem',
        backdropFilter: 'blur(4px)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97 }}
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          maxWidth: 560,
          width: '100%',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div style={{ flex: 1, paddingRight: '1rem' }}>
            <div style={{ marginBottom: 8 }}><EvidenceBadge state={cap.evidenceState} showDot /></div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 }}>{cap.label}</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.25rem', padding: '2px 6px' }}>×</button>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '1.5rem' }}>
          {cap.description}
        </p>

        {/* Evidence note */}
        <div style={{
          padding: '1rem',
          background: cap.evidenceState === 'supported' ? 'var(--evidence-supported-dim)'
                    : cap.evidenceState === 'assumed' ? 'var(--evidence-assumed-dim)'
                    : 'var(--evidence-unknown-dim)',
          border: `1px solid ${cap.evidenceState === 'supported' ? 'rgba(16,185,129,0.25)'
                              : cap.evidenceState === 'assumed' ? 'rgba(245,158,11,0.25)'
                              : 'rgba(107,114,128,0.25)'}`,
          borderRadius: 'var(--radius-md)',
          marginBottom: cap.pocValidation ? '1rem' : 0,
        }}>
          <div className="text-label" style={{ marginBottom: 6, color: 'var(--text-muted)' }}>Evidence Basis</div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{cap.evidenceNote}</p>
        </div>

        {cap.pocValidation && (
          <div style={{
            padding: '1rem',
            background: 'var(--accent-dim)',
            border: '1px solid var(--border-active)',
            borderRadius: 'var(--radius-md)',
          }}>
            <div className="text-label" style={{ marginBottom: 6, color: 'var(--text-muted)' }}>PoC Validation</div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{cap.pocValidation}</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function CapabilityCard({
  cap,
  onClick,
}: {
  cap: IometeCapability;
  onClick: () => void;
}) {
  const borderColor = cap.evidenceState === 'supported' ? 'rgba(16,185,129,0.3)'
                    : cap.evidenceState === 'assumed'   ? 'rgba(245,158,11,0.3)'
                    : 'rgba(107,114,128,0.2)';
  const bgColor = cap.evidenceState === 'supported' ? 'var(--evidence-supported-dim)'
                : cap.evidenceState === 'assumed'   ? 'var(--evidence-assumed-dim)'
                : 'var(--evidence-unknown-dim)';

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      style={{
        background: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: 'var(--radius-md)',
        padding: '0.875rem 1rem',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.4, flex: 1 }}>
          {cap.label}
        </span>
        <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', flexShrink: 0, marginTop: 2 }}>↗</span>
      </div>
      <EvidenceBadge state={cap.evidenceState} />
    </motion.div>
  );
}

export function Scene3Capabilities() {
  const { state, navigate } = useSession();
  const [selectedCap, setSelectedCap] = useState<IometeCapability | null>(null);

  const selectedReqs = REQUIREMENTS.filter(r => state.selectedRequirements.includes(r.id));

  // Build a map: requirementId → capabilities
  const reqCapMap = selectedReqs.map(req => {
    const caps = req.mapsToCapabilities
      .map(cid => IOMETE_CAPABILITIES.find(c => c.id === cid))
      .filter(Boolean) as IometeCapability[];
    return { req, caps };
  });

  const { supported, assumed, unknown } = state.coverageSummary;

  const canProceed = state.selectedRequirements.length >= 1;

  return (
    <div className="scene">
      <div className="scene__content">
        <div className="scene-enter">
          <SceneHeader
            eyebrow="Scene 3 of 7 · Where IOMETE Fits"
            title="Mapping requirements to capabilities"
            subtitle="Each selected requirement is mapped to a documented IOMETE capability. Evidence states are applied honestly — nothing is invented."
          />

          <MayaVoice text="This is where most vendor evaluations go wrong. They start from the vendor's capability list and work backwards. We're doing the opposite: we start from our requirements, then ask whether IOMETE can address them — and what the evidence actually says." />
        </div>

        {/* Coverage summary */}
        <div style={{ marginBottom: '2rem' }}>
          <CoverageBar supported={supported} assumed={assumed} unknown={unknown} />
        </div>

        {/* Evidence key */}
        <div style={{
          display: 'flex', gap: '1.5rem',
          padding: '0.875rem 1.25rem',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '2rem',
          flexWrap: 'wrap',
        }}>
          <span className="text-label" style={{ alignSelf: 'center' }}>Evidence key:</span>
          {(['supported', 'assumed', 'unknown'] as const).map(s => (
            <EvidenceBadge key={s} state={s} showDot />
          ))}
          <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
            Click any capability card for evidence details
          </span>
        </div>

        {/* Requirement → Capability mappings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
          {reqCapMap.map(({ req, caps }, idx) => (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
              }}
            >
              {/* Requirement header */}
              <div style={{
                padding: '1rem 1.25rem',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{req.label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{req.description}</div>
                </div>

                {/* Quick coverage dot row */}
                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                  {caps.map(c => (
                    <div key={c.id} style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: c.evidenceState === 'supported' ? 'var(--evidence-supported)'
                               : c.evidenceState === 'assumed'   ? 'var(--evidence-assumed)'
                               : 'var(--evidence-unknown)',
                    }} title={c.label} />
                  ))}
                </div>
              </div>

              {/* Capability cards */}
              <div style={{ padding: '1rem 1.25rem' }}>
                {caps.length === 0 ? (
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    No directly mapped capabilities — this requirement requires custom implementation.
                  </p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.625rem' }}>
                    {caps.map(cap => (
                      <CapabilityCard key={cap.id} cap={cap} onClick={() => setSelectedCap(cap)} />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Open questions panel */}
        {state.openQuestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: '1.25rem 1.5rem',
              background: 'var(--evidence-unknown-dim)',
              border: '1px solid rgba(107, 114, 128, 0.25)',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '2rem',
            }}
          >
            <div className="text-label" style={{ marginBottom: '0.75rem', color: 'var(--evidence-unknown)' }}>
              {state.openQuestions.length} Open Question{state.openQuestions.length !== 1 ? 's' : ''} — requires validation
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {state.openQuestions.map(cid => {
                const cap = IOMETE_CAPABILITIES.find(c => c.id === cid);
                return cap ? (
                  <div key={cid} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--evidence-unknown)' }}>?</span>
                    <span>{cap.label}</span>
                    <span style={{ color: 'var(--text-muted)', marginLeft: 'auto', fontSize: '0.75rem' }}>→ Examine in Scene 4</span>
                  </div>
                ) : null;
              })}
            </div>
          </motion.div>
        )}

        {/* Footer nav */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '1rem 1.5rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <button className="btn btn--ghost btn--sm" onClick={() => navigate(2)}>← Back to requirements</button>
          <button
            className="btn btn--primary btn--sm"
            disabled={!canProceed}
            onClick={() => navigate(4)}
          >
            Examine the difficult questions →
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedCap && <CapabilityDetail cap={selectedCap} onClose={() => setSelectedCap(null)} />}
      </AnimatePresence>
    </div>
  );
}

