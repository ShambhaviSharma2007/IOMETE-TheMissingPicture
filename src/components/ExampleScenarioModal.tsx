import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AURELIA_CAPITAL_SCENARIO } from '../data/aureliaScenario';
import { useSession } from '../context/SessionContext';
import { BookOpen, X, CheckCircle2, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';

interface ExampleScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScenarioLoaded?: () => void;
}

export function ExampleScenarioModal({ isOpen, onClose, onScenarioLoaded }: ExampleScenarioModalProps) {
  const { loadAureliaScenario } = useSession();
  const [selectedDomainCode, setSelectedDomainCode] = useState<string>('MKT-DATA');

  if (!isOpen) return null;

  const activeDomain = AURELIA_CAPITAL_SCENARIO.domains.find(d => d.code === selectedDomainCode) || AURELIA_CAPITAL_SCENARIO.domains[0];

  const handleApplyScenario = () => {
    loadAureliaScenario();
    onClose();
    if (onScenarioLoaded) {
      onScenarioLoaded();
    } else {
      const target = document.getElementById('chapter-1');
      target?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 300,
          padding: '1.5rem',
          backdropFilter: 'blur(6px)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          style={{
            background: '#FFFFFF',
            border: '1px solid #CBD5E1',
            borderRadius: 20,
            maxWidth: 840,
            width: '100%',
            maxHeight: '88vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 40px -8px rgba(15, 23, 42, 0.16)',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '1.5rem 2rem',
            borderBottom: '1px solid #E2E8F0',
            background: '#FAF9F6',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '2px 8px', borderRadius: 999, background: '#EDE9FE', border: '1px solid #DDD6FE', marginBottom: 8 }}>
                <BookOpen size={12} color="#7C3AED" />
                <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#7C3AED', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Fictional Case Study
                </span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: '#0F172A', marginBottom: 4 }}>
                {AURELIA_CAPITAL_SCENARIO.organizationName}
              </h2>
              <div style={{ fontSize: '0.8125rem', color: '#64748B' }}>
                Evaluator: <strong style={{ color: '#4F46E5' }}>{AURELIA_CAPITAL_SCENARIO.leadPersona.name}</strong>, {AURELIA_CAPITAL_SCENARIO.leadPersona.title}
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                background: '#F1F5F9',
                border: 'none',
                borderRadius: '50%',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748B',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Scrollable Body */}
          <div style={{ padding: '1.5rem 2rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Story Brief */}
            <div style={{ padding: '1rem 1.25rem', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12 }}>
              <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.6, fontStyle: 'italic' }}>
                "{AURELIA_CAPITAL_SCENARIO.leadPersona.brief}"
              </p>
            </div>

            {/* Interactive Domain Explorer */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#4F46E5', letterSpacing: '0.06em', marginBottom: 8 }}>
                1. Explore Disconnected Banking Data Domains
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: '1rem' }}>
                {AURELIA_CAPITAL_SCENARIO.domains.map(domain => {
                  const isActive = domain.code === selectedDomainCode;
                  return (
                    <button
                      key={domain.code}
                      onClick={() => setSelectedDomainCode(domain.code)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 8,
                        background: isActive ? '#EEF2FF' : '#FFFFFF',
                        border: `1.5px solid ${isActive ? '#4F46E5' : '#E2E8F0'}`,
                        color: isActive ? '#4F46E5' : '#475569',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {domain.code}
                    </button>
                  );
                })}
              </div>

              {/* Active Domain Card */}
              <div style={{ padding: '1.25rem', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#0F172A' }}>
                      {activeDomain.name}
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                      Owned by: {activeDomain.systemOwner}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {activeDomain.metrics.map(m => (
                      <span key={m.label} style={{ fontSize: '0.6875rem', padding: '2px 8px', background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 4, color: '#4F46E5', fontWeight: 600 }}>
                        {m.label}: {m.value}
                      </span>
                    ))}
                  </div>
                </div>

                <p style={{ fontSize: '0.8125rem', color: '#475569', lineHeight: 1.55, marginBottom: 12 }}>
                  {activeDomain.problemSummary}
                </p>

                <div style={{ padding: '0.75rem 1rem', background: '#FEF2F2', border: '1px solid #FECDD3', borderRadius: 8 }}>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#B91C1C', textTransform: 'uppercase', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <AlertTriangle size={12} />
                    <span>Historical Failure Incident</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#991B1B', lineHeight: 1.5 }}>
                    {activeDomain.failureIncident}
                  </div>
                </div>
              </div>
            </div>

            {/* Desired Outcome & Fit Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 12 }}>
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4, color: '#166534' }}>
                  2. Aurelia's Desired Outcome
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#14532D', lineHeight: 1.5 }}>
                  {AURELIA_CAPITAL_SCENARIO.desiredOutcome}
                </p>
              </div>

              <div style={{ padding: '1rem', background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: 12 }}>
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4, color: '#6D28D9' }}>
                  3. IOMETE Assessment Summary
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#5B21B6', lineHeight: 1.5 }}>
                  {AURELIA_CAPITAL_SCENARIO.iometeFitSummary}
                </p>
              </div>
            </div>

            {/* Proof of Concept Checklist */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6, color: '#64748B' }}>
                4. What Aurelia Validated in PoC Plan
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {AURELIA_CAPITAL_SCENARIO.pocChecklist.map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.8125rem', color: '#475569', lineHeight: 1.5 }}>
                    <CheckCircle2 size={15} color="#059669" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer Actions */}
          <div style={{
            padding: '1.25rem 2rem',
            borderTop: '1px solid #E2E8F0',
            background: '#FAF9F6',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12
          }}>
            <button
              onClick={onClose}
              className="btn btn--secondary"
              style={{ fontSize: '0.8125rem', padding: '6px 14px' }}
            >
              Close Example
            </button>
            <button
              onClick={handleApplyScenario}
              className="btn btn--primary"
              style={{ fontSize: '0.875rem', padding: '8px 18px', display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <Sparkles size={16} />
              <span>Pre-fill Navigator with Aurelia Capital Scenario</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
