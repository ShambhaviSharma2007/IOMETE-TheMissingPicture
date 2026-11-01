import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '../context/SessionContext';
import { REQUIREMENTS } from '../data/content';
import { SceneHeader, MayaVoice } from '../components/ui';
import type { Requirement, RequirementCategory } from '../types';

const CATEGORY_META: Record<RequirementCategory, { label: string; description: string; color: string }> = {
  unification: {
    label: 'Data Unification',
    description: 'Creating single sources of truth from fragmented systems',
    color: '#3B82F6',
  },
  governance: {
    label: 'Governance & Control',
    description: 'Access control, audit, compliance, and data lineage',
    color: '#A78BFA',
  },
  operational: {
    label: 'Operational Requirements',
    description: 'Infrastructure, integration, cost, and team readiness',
    color: '#34D399',
  },
};

function ClarifyingQuestion({
  requirement,
  currentAnswer,
  onAnswer,
  onClose,
}: {
  requirement: Requirement;
  currentAnswer?: string;
  onAnswer: (answer: string) => void;
  onClose: () => void;
}) {
  const q = requirement.clarifyingQuestion;
  if (!q) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(8, 10, 16, 0.75)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 200, padding: '2rem',
        backdropFilter: 'blur(4px)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.97 }}
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-active)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          maxWidth: 520,
          width: '100%',
          boxShadow: 'var(--shadow-lg), var(--shadow-glow-accent)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <div className="text-label" style={{ marginBottom: 8 }}>Clarifying Question</div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.5 }}>
              {requirement.label}
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.25rem', padding: '2px 6px' }}>×</button>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: '1.5rem' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6875rem', fontWeight: 700, color: 'white', flexShrink: 0 }}>MS</div>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.6 }}>"{q.text}"</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {q.options.map(opt => (
            <button
              key={opt}
              onClick={() => { onAnswer(opt); onClose(); }}
              style={{
                background: currentAnswer === opt ? 'var(--accent-dim)' : 'var(--bg-surface)',
                border: `1px solid ${currentAnswer === opt ? 'var(--accent)' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1rem',
                textAlign: 'left',
                cursor: 'pointer',
                color: currentAnswer === opt ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontSize: '0.875rem',
                lineHeight: 1.5,
                transition: 'all 0.15s ease',
                fontFamily: 'var(--font-ui)',
              }}
            >
              {currentAnswer === opt && <span style={{ color: 'var(--accent)', marginRight: 8 }}>✓</span>}
              {opt}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function RequirementCard({
  req,
  isSelected,
  hasAnswer,
  onToggle,
  onClarify,
  color,
}: {
  req: Requirement;
  isSelected: boolean;
  hasAnswer: boolean;
  onToggle: () => void;
  onClarify: () => void;
  color: string;
}) {
  return (
    <motion.div
      layout
      style={{
        background: isSelected ? `color-mix(in srgb, ${color} 6%, var(--bg-card))` : 'var(--bg-card)',
        border: `1px solid ${isSelected ? color + '55' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: '1rem 1.25rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: isSelected ? `0 0 16px ${color}15` : 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        {/* Checkbox */}
        <div
          onClick={onToggle}
          style={{
            width: 20, height: 20,
            border: `2px solid ${isSelected ? color : 'var(--border-default)'}`,
            borderRadius: 4,
            background: isSelected ? color : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, marginTop: 2, cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          {isSelected && <span style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 700 }}>✓</span>}
        </div>

        {/* Content */}
        <div style={{ flex: 1 }} onClick={onToggle}>
          <div style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: 4, lineHeight: 1.4 }}>
            {req.label}
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {req.description}
          </div>
        </div>
      </div>

      {/* Clarify button — only shown when selected and there's a question */}
      {isSelected && req.clarifyingQuestion && (
        <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: `1px solid ${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.75rem', color: hasAnswer ? 'var(--evidence-supported)' : 'var(--text-muted)' }}>
            {hasAnswer ? '✓ Clarification recorded' : '○ Clarification needed'}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); onClarify(); }}
            className="btn btn--ghost btn--sm"
            style={{ fontSize: '0.75rem' }}
          >
            {hasAnswer ? 'Revise' : 'Answer →'}
          </button>
        </div>
      )}
    </motion.div>
  );
}

export function Scene2Requirements() {
  const { state, navigate, toggleRequirement, setClarification } = useSession();
  const [clarifyingReq, setClarifyingReq] = useState<Requirement | null>(null);

  const categories: RequirementCategory[] = ['unification', 'governance', 'operational'];
  const selected = state.selectedRequirements;
  const canProceed = selected.length >= 3;

  const countByCategory = (cat: RequirementCategory) =>
    REQUIREMENTS.filter(r => r.category === cat && selected.includes(r.id)).length;

  return (
    <div className="scene">
      <div className="scene__content">
        <div className="scene-enter">
          <SceneHeader
            eyebrow="Scene 2 of 7 · Build the Target Picture"
            title="What does success look like?"
            subtitle="Select the requirements that matter to Aurelia Capital. These become the standard against which IOMETE is evaluated. Choose at least three."
          />

          <MayaVoice text="Every platform evaluation I've seen fail made the same mistake: they evaluated the platform before they agreed on the problem. We're not doing that. We're defining what 'good' looks like first — and only then asking whether IOMETE can deliver it." />
        </div>

        {/* Summary bar */}
        {selected.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '1.5rem',
              padding: '0.875rem 1.25rem',
              background: 'var(--accent-dim)',
              border: '1px solid var(--border-active)',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '2rem',
            }}
          >
            <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 500 }}>
              {selected.length} requirement{selected.length !== 1 ? 's' : ''} selected
            </span>
            <div style={{ width: 1, height: 16, background: 'var(--border-default)' }} />
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              These will be mapped to IOMETE capabilities in the next scene.
            </span>
          </motion.div>
        )}

        {/* Categories */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', marginBottom: '2.5rem' }}>
          {categories.map((cat, catIdx) => {
            const meta = CATEGORY_META[cat];
            const reqs = REQUIREMENTS.filter(r => r.category === cat);
            const selectedInCat = countByCategory(cat);

            return (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: catIdx * 0.15 }}
              >
                {/* Category header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1rem' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: meta.color, boxShadow: `0 0 8px ${meta.color}50` }} />
                  <div>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)' }}>{meta.label}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{meta.description}</div>
                  </div>
                  {selectedInCat > 0 && (
                    <span style={{
                      marginLeft: 'auto',
                      fontSize: '0.6875rem', fontWeight: 600,
                      padding: '2px 10px',
                      background: `${meta.color}18`,
                      color: meta.color,
                      border: `1px solid ${meta.color}33`,
                      borderRadius: '999px',
                    }}>
                      {selectedInCat} selected
                    </span>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                  {reqs.map(req => (
                    <RequirementCard
                      key={req.id}
                      req={req}
                      isSelected={selected.includes(req.id)}
                      hasAnswer={!!state.clarifications[req.id]}
                      color={meta.color}
                      onToggle={() => toggleRequirement(req.id)}
                      onClarify={() => setClarifyingReq(req)}
                    />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer nav */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1rem 1.5rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <div>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              {selected.length} selected
              {!canProceed && <span style={{ color: 'var(--text-muted)', marginLeft: 8 }}>
                — select at least 3 to continue
              </span>}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn--ghost btn--sm" onClick={() => navigate(1)}>← Back</button>
            <button
              className="btn btn--primary btn--sm"
              disabled={!canProceed}
              onClick={() => navigate(3)}
              style={{ opacity: canProceed ? 1 : 0.4, cursor: canProceed ? 'pointer' : 'not-allowed' }}
            >
              See where IOMETE fits →
            </button>
          </div>
        </motion.div>
      </div>

      {/* Clarifying question modal */}
      <AnimatePresence>
        {clarifyingReq && (
          <ClarifyingQuestion
            requirement={clarifyingReq}
            currentAnswer={state.clarifications[clarifyingReq.id]}
            onAnswer={(answer) => setClarification(clarifyingReq.id, answer)}
            onClose={() => setClarifyingReq(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

