import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '../context/SessionContext';
import { IOMETE_CAPABILITIES, DESIRED_OUTCOMES } from '../data/generalContent';
import { SceneHeader, EvidenceBadge, CoverageBar } from '../components/ui';
import type { IometeCapability, EvidenceState } from '../types';

export function Step4PotentialFit() {
  const { state, goToStep } = useSession();
  const [selectedCap, setSelectedCap] = useState<IometeCapability | null>(null);
  const [filterState, setFilterState] = useState<EvidenceState | 'all'>('all');

  // Identify all capabilities mapped to the user's selected outcomes
  const relevantCapabilityIds = new Set<string>();
  state.selectedOutcomes.forEach(outId => {
    const outcome = DESIRED_OUTCOMES.find(o => o.id === outId);
    outcome?.mapsToCapabilityIds.forEach(cid => relevantCapabilityIds.add(cid));
  });

  // Collect relevant capabilities
  const matchedCapabilities = IOMETE_CAPABILITIES.filter(c =>
    relevantCapabilityIds.has(c.id)
  );

  // Fallback to all capabilities if user selected nothing
  const displayCapabilities = matchedCapabilities.length > 0 ? matchedCapabilities : IOMETE_CAPABILITIES;

  const filtered = filterState === 'all'
    ? displayCapabilities
    : displayCapabilities.filter(c => c.evidenceState === filterState);

  const supportedCount = displayCapabilities.filter(c => c.evidenceState === 'supported').length;
  const assumedCount = displayCapabilities.filter(c => c.evidenceState === 'assumed').length;
  const unknownCount = displayCapabilities.filter(c => c.evidenceState === 'unknown').length;

  return (
    <div className="scene">
      <div className="scene__content">
        <div className="scene-enter">
          <SceneHeader
            eyebrow="Step 4 of 8 · Explore Potential Fit"
            title="How IOMETE capabilities map to your requirements"
            subtitle="Explore verified capabilities against your selected outcomes. Every claim is strictly labelled as Supported (checked source), Assumed (architectural inference), or Unknown (requires vendor confirmation)."
          />
        </div>

        {/* Coverage Meter */}
        <div style={{ marginBottom: '1.5rem' }}>
          <CoverageBar
            supported={supportedCount}
            assumed={assumedCount}
            unknown={unknownCount}
          />
        </div>

        {/* Evidence State Filter Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          marginBottom: '1.75rem',
          alignItems: 'center',
        }}>
          <span className="text-label" style={{ marginRight: 6 }}>Filter by Evidence:</span>
          {(['all', 'supported', 'assumed', 'unknown'] as const).map(f => {
            const isActive = filterState === f;
            const labels = {
              all: `All Matched (${displayCapabilities.length})`,
              supported: `Supported (${supportedCount})`,
              assumed: `Assumed (${assumedCount})`,
              unknown: `Unknown / Validation Needed (${unknownCount})`,
            };

            return (
              <button
                key={f}
                onClick={() => setFilterState(f)}
                style={{
                  padding: '4px 12px',
                  borderRadius: 999,
                  border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border-default)'}`,
                  background: isActive ? 'var(--accent-dim)' : 'transparent',
                  color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  fontFamily: 'var(--font-ui)',
                }}
              >
                {labels[f]}
              </button>
            );
          })}
        </div>

        {/* Capabilities Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '1rem',
          marginBottom: '2.5rem',
        }}>
          {filtered.map(cap => {
            return (
              <motion.div
                key={cap.id}
                layout
                onClick={() => setSelectedCap(cap)}
                whileHover={{ scale: 1.01 }}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <EvidenceBadge state={cap.evidenceState} showDot />
                  <span style={{ fontSize: '0.6875rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                    {cap.category}
                  </span>
                </div>

                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6, lineHeight: 1.4 }}>
                  {cap.name}
                </div>

                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: 12, flex: 1 }}>
                  {cap.plainSummary}
                </p>

                <div style={{
                  padding: '8px 10px',
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  border: '1px solid var(--border-subtle)',
                  marginBottom: 8,
                }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Why it matters:</strong>{' '}
                  <span style={{ color: 'var(--text-secondary)' }}>{cap.whyItMatters}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                    Source: {cap.evidenceSource.title}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 500 }}>
                    Inspect Details →
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Capability Detail Modal */}
        <AnimatePresence>
          {selectedCap && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => e.target === e.currentTarget && setSelectedCap(null)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(8, 10, 16, 0.85)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 250,
                padding: '1.5rem',
                backdropFilter: 'blur(5px)',
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
                  padding: '2rem',
                  maxWidth: 620,
                  width: '100%',
                  boxShadow: 'var(--shadow-lg), var(--shadow-glow-accent)',
                  maxHeight: '90vh',
                  overflowY: 'auto',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <EvidenceBadge state={selectedCap.evidenceState} showDot />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: 8 }}>
                      {selectedCap.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedCap(null)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer', padding: '2px 8px' }}
                  >
                    ×
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: 12 }}>
                  <div>
                    <div className="text-label" style={{ marginBottom: 4 }}>What this capability does</div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {selectedCap.plainSummary}
                    </p>
                  </div>

                  <div>
                    <div className="text-label" style={{ marginBottom: 4, color: 'var(--accent)' }}>Why it matters to your setup</div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {selectedCap.whyItMatters}
                    </p>
                  </div>

                  <div style={{ padding: '0.875rem 1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                    <div className="text-label" style={{ marginBottom: 4 }}>Documentation Source Citation</div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                      <strong>{selectedCap.evidenceSource.title}:</strong> {selectedCap.evidenceSource.citation}
                    </p>
                  </div>

                  <div>
                    <div className="text-label" style={{ marginBottom: 4, color: 'var(--evidence-assumed)' }}>Limitations or Dependencies</div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                      {selectedCap.limitations}
                    </p>
                  </div>

                  <div style={{ padding: '0.875rem 1rem', background: 'rgba(59, 130, 246, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-active)' }}>
                    <div className="text-label" style={{ marginBottom: 4, color: 'var(--accent)' }}>What to confirm during PoC</div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                      {selectedCap.confirmationNeeded}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
                  <button className="btn btn--primary btn--sm" onClick={() => setSelectedCap(null)}>
                    Done Reviewing
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 1.5rem',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
        }}>
          <button className="btn btn--ghost btn--sm" onClick={() => goToStep(3)}>
            ← Back to Needs
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              {displayCapabilities.length} capabilities matched
            </span>
            <button className="btn btn--primary btn--sm" onClick={() => goToStep(5)}>
              Review Costs & Effort →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

