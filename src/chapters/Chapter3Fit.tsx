import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '../context/SessionContext';
import { IOMETE_CAPABILITIES, DESIRED_OUTCOMES } from '../data/generalContent';
import type { EvidenceState } from '../types';
import { ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

interface Chapter3FitProps {
  onContinue: () => void;
}

export function Chapter3Fit({ onContinue }: Chapter3FitProps) {
  const { state } = useSession();
  const [filterState, setFilterState] = useState<'all' | EvidenceState>('all');
  const [expandedCapId, setExpandedCapId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState<boolean>(false);

  const relevantCapabilityIds = new Set<string>();
  state.selectedOutcomes.forEach(outId => {
    const outcome = DESIRED_OUTCOMES.find(o => o.id === outId);
    outcome?.mapsToCapabilityIds.forEach(cid => relevantCapabilityIds.add(cid));
  });

  let supportedCount = 0;
  let assumedCount = 0;
  let unknownCount = 0;

  IOMETE_CAPABILITIES.forEach(c => {
    if (c.evidenceState === 'supported') supportedCount++;
    if (c.evidenceState === 'assumed') assumedCount++;
    if (c.evidenceState === 'unknown') unknownCount++;
  });

  const filteredCapabilities = IOMETE_CAPABILITIES.filter(cap => {
    if (filterState === 'all') return true;
    return cap.evidenceState === filterState;
  });

  const displayedCapabilities = showAll ? filteredCapabilities : filteredCapabilities.slice(0, 6);
  const remainingCount = filteredCapabilities.length - 6;

  const handleFilterChange = (newFilter: 'all' | EvidenceState) => {
    setFilterState(newFilter);
    setShowAll(false);
  };

  return (
    <section id="chapter-3" className="chapter-section chapter-section--subtle">
      <div className="container container--wide">

        {/* Header */}
        <div className="chapter-header">
          <div className="chapter-pill">
            <span>Chapter 03</span>
            <span>·</span>
            <span>Explore the Fit</span>
          </div>
          <h2 className="chapter-title">How IOMETE matches your needs</h2>
          <p className="chapter-subtitle">
            Every claim here is backed by documented architecture. We clearly distinguish between what is officially verified, what is an architectural convention, and what still needs PoC confirmation.
          </p>
        </div>

        {/* Evidence Summary + Filter Bar */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: 16,
          padding: '1.25rem 1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          {/* Summary counts */}
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#059669' }}>{supportedCount}</div>
              <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Documented</div>
            </div>
            <div style={{ width: 1, background: '#E2E8F0', alignSelf: 'stretch' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#D97706' }}>{assumedCount}</div>
              <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Assumed</div>
            </div>
            <div style={{ width: 1, background: '#E2E8F0', alignSelf: 'stretch' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#475569' }}>{unknownCount}</div>
              <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Needs PoC</div>
            </div>
          </div>

          {/* Filter pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {[
              { key: 'all', label: `All (${IOMETE_CAPABILITIES.length})`, activeBg: '#0F172A', activeColor: '#FFFFFF', border: '#CBD5E1' },
              { key: 'supported', label: `✓ Supported (${supportedCount})`, activeBg: '#059669', activeColor: '#FFFFFF', border: '#A7F3D0' },
              { key: 'assumed', label: `~ Assumed (${assumedCount})`, activeBg: '#D97706', activeColor: '#FFFFFF', border: '#FDE68A' },
              { key: 'unknown', label: `? Needs PoC (${unknownCount})`, activeBg: '#475569', activeColor: '#FFFFFF', border: '#CBD5E1' },
            ].map(pill => {
              const isActive = filterState === pill.key;
              return (
                <button
                  key={pill.key}
                  onClick={() => handleFilterChange(pill.key as 'all' | EvidenceState)}
                  style={{
                    border: `1px solid ${pill.border}`,
                    background: isActive ? pill.activeBg : '#FFFFFF',
                    color: isActive ? pill.activeColor : '#475569',
                    fontSize: '0.8125rem', fontWeight: 600,
                    padding: '5px 12px', borderRadius: 999, cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Capabilities Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20, marginBottom: '2rem' }}>
          {displayedCapabilities.map((cap, idx) => {
            const isRelevant = relevantCapabilityIds.has(cap.id);
            const isExpanded = expandedCapId === cap.id;

            return (
              <motion.div
                key={cap.id}
                initial={{ opacity: 0, scale: 0.93 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.38, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4, boxShadow: '0 12px 28px rgba(79,70,229,0.09)' }}
                className="card"
                style={{
                  background: '#FFFFFF',
                  border: isRelevant ? '1.5px solid #6366F1' : '1px solid #E2E8F0',
                  borderRadius: 16,
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: isRelevant ? '0 6px 20px rgba(99, 102, 241, 0.08)' : '0 1px 3px rgba(0,0,0,0.02)',
                  position: 'relative',
                  cursor: 'default',
                }}
              >
                <div>
                  {/* Badge row */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
                    <span className={`evidence-badge evidence-badge--${cap.evidenceState}`}>
                      {cap.evidenceState === 'supported' && '✓ Documented'}
                      {cap.evidenceState === 'assumed' && '~ Architectural Standard'}
                      {cap.evidenceState === 'unknown' && '? Confirm in PoC'}
                    </span>
                    {isRelevant && (
                      <span style={{
                        fontSize: '0.6875rem', fontWeight: 700, padding: '2px 8px',
                        borderRadius: 6, background: '#EEF2FF', color: '#4F46E5',
                        border: '1px solid #C7D2FE', whiteSpace: 'nowrap',
                      }}>
                        Matches Your Outcome
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.0625rem', fontWeight: 600, color: '#0F172A', marginBottom: 8 }}>
                    {cap.name}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5, marginBottom: 14 }}>
                    {cap.plainSummary}
                  </p>

                  <div style={{
                    padding: '8px 12px', borderRadius: 8,
                    background: '#F8FAFC', border: '1px solid #F1F5F9',
                    fontSize: '0.75rem', color: '#334155', marginBottom: 14,
                  }}>
                    <strong style={{ color: '#4F46E5' }}>Why it matters: </strong>
                    {cap.whyItMatters}
                  </div>
                </div>

                {/* Expandable drawer */}
                <div>
                  <button
                    type="button"
                    onClick={() => setExpandedCapId(isExpanded ? null : cap.id)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '8px 12px', borderRadius: 8,
                      background: isExpanded ? '#EEF2FF' : '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      color: isExpanded ? '#4F46E5' : '#64748B',
                      fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s ease',
                    }}
                  >
                    <span>{isExpanded ? 'Hide Verification & PoC Check' : 'View Documentation Evidence & Limits'}</span>
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{
                          marginTop: 10, padding: '12px 14px',
                          borderRadius: 10, background: '#FAF9F6',
                          border: '1px solid #E2E8F0', fontSize: '0.75rem',
                          display: 'flex', flexDirection: 'column', gap: 10,
                        }}>
                          <div>
                            <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: 2 }}>Official Source Citation</div>
                            <div style={{ color: '#64748B', fontStyle: 'italic' }}>"{cap.evidenceSource.citation}"</div>
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#D97706', marginBottom: 2 }}>Architectural Constraint / Dependency</div>
                            <div style={{ color: '#475569' }}>{cap.limitations}</div>
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#4F46E5', marginBottom: 2 }}>What needs confirmation during PoC</div>
                            <div style={{ color: '#475569' }}>{cap.confirmationNeeded}</div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Expand / Collapse Toggle */}
        {filteredCapabilities.length > 6 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              style={{
                background: '#FFFFFF', border: '1.5px solid #C7D2FE',
                color: '#4F46E5', fontSize: '0.875rem', fontWeight: 600,
                padding: '0.625rem 1.75rem', borderRadius: 999, cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 8,
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.08)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#4F46E5';
                e.currentTarget.style.background = '#EEF2FF';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#C7D2FE';
                e.currentTarget.style.background = '#FFFFFF';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>
                {showAll
                  ? 'Show fewer capabilities'
                  : `Show all ${filteredCapabilities.length} capabilities (${remainingCount} more)`}
              </span>
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 20, height: 20, borderRadius: '50%',
                background: '#EEF2FF', color: '#4F46E5',
              }}>
                {showAll ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </span>
            </button>
          </div>
        )}

        {/* Continue */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onContinue}
            className="btn btn--primary"
            style={{ fontSize: '0.9375rem', padding: '0.75rem 1.5rem', borderRadius: 12 }}
          >
            <span>Next: Understand the Trade-offs</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
