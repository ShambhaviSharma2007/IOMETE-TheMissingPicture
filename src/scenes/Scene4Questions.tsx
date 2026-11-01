import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSession } from '../context/SessionContext';
import { DIFFICULT_QUESTIONS } from '../data/content';
import { EvidenceBadge, SceneHeader, MayaVoice } from '../components/ui';
import type { QuestionPillar, QuestionDisposition, DifficultQuestion } from '../types';

const PILLAR_META: Record<QuestionPillar, { label: string; icon: string; color: string }> = {
  security:    { label: 'Security & Perimeter',     icon: '🔒', color: '#F87171' },
  governance:  { label: 'Governance & Compliance',  icon: '📋', color: '#A78BFA' },
  integration: { label: 'Integration & Architecture', icon: '🔧', color: '#60A5FA' },
  quality:     { label: 'Data Quality & Lineage',   icon: '📊', color: '#34D399' },
  operations:  { label: 'Operations & Cost',        icon: '⚙️', color: '#FBBF24' },
};

const DISPOSITIONS: { value: QuestionDisposition; label: string; className: string }[] = [
  { value: 'resolved',     label: '✓ Resolved for PoC',  className: 'disposition-btn--resolved' },
  { value: 'needs_answer', label: '~ Needs vendor answer', className: 'disposition-btn--needs' },
  { value: 'blocking',     label: '✗ Blocking',           className: 'disposition-btn--blocking' },
];

function QuestionCard({
  question,
  disposition,
  onDispose,
}: {
  question: DifficultQuestion;
  disposition: QuestionDisposition;
  onDispose: (d: QuestionDisposition) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const dispositionLabel: Record<QuestionDisposition, string> = {
    resolved:     '✓ Resolved',
    needs_answer: '~ Needs answer',
    blocking:     '✗ Blocking',
    unset:        '',
  };
  const dispositionColor: Record<QuestionDisposition, string> = {
    resolved:     'var(--evidence-supported)',
    needs_answer: 'var(--evidence-assumed)',
    blocking:     '#F87171',
    unset:        'transparent',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'var(--bg-card)',
        border: `1px solid ${disposition !== 'unset' ? dispositionColor[disposition] + '44' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        transition: 'border-color 0.2s ease',
      }}
    >
      {/* Header */}
      <div
        onClick={() => setExpanded(e => !e)}
        style={{
          padding: '1rem 1.25rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
        }}
      >
        <EvidenceBadge state={question.evidenceState} />

        <p style={{ flex: 1, fontSize: '0.9375rem', fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.45 }}>
          {question.question}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {disposition !== 'unset' && (
            <span style={{ fontSize: '0.75rem', color: dispositionColor[disposition], fontWeight: 500 }}>
              {dispositionLabel[disposition]}
            </span>
          )}
          <span style={{ color: 'var(--text-muted)', transition: 'transform 0.2s', display: 'inline-block', transform: expanded ? 'rotate(180deg)' : 'rotate(0)' }}>
            ▾
          </span>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          style={{ borderTop: '1px solid var(--border-subtle)', padding: '1.25rem' }}
        >
          {/* Answer */}
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
            {question.answer}
          </p>

          {/* Evidence note */}
          <div style={{
            padding: '0.75rem 1rem',
            background: question.evidenceState === 'supported' ? 'var(--evidence-supported-dim)'
                      : question.evidenceState === 'assumed'   ? 'var(--evidence-assumed-dim)'
                      : 'var(--evidence-unknown-dim)',
            borderRadius: 'var(--radius-md)',
            marginBottom: question.pocAction ? '0.75rem' : 0,
          }}>
            <div className="text-label" style={{ marginBottom: 4, color: 'var(--text-muted)' }}>Evidence basis</div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {question.evidenceNote}
            </p>
          </div>

          {question.pocAction && (
            <div style={{
              padding: '0.75rem 1rem',
              background: 'var(--accent-dim)',
              border: '1px solid var(--border-active)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1rem',
            }}>
              <div className="text-label" style={{ marginBottom: 4, color: 'var(--text-muted)' }}>PoC Action</div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{question.pocAction}</p>
            </div>
          )}

          {/* Disposition controls */}
          <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
            <div className="text-label" style={{ marginBottom: '0.5rem' }}>Your assessment</div>
            <div className="disposition-control">
              {DISPOSITIONS.map(d => (
                <button
                  key={d.value}
                  onClick={() => onDispose(d.value)}
                  className={`disposition-btn ${disposition === d.value ? d.className : ''}`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export function Scene4Questions() {
  const { state, navigate, setQuestionDisposition } = useSession();
  const pillars: QuestionPillar[] = ['security', 'governance', 'integration', 'quality', 'operations'];

  const [activeFilter, setActiveFilter] = useState<QuestionPillar | 'all'>('all');

  const getCount = (pillar: QuestionPillar) =>
    DIFFICULT_QUESTIONS.filter(q => q.pillar === pillar).length;

  const getDisposedCount = (pillar: QuestionPillar) =>
    DIFFICULT_QUESTIONS.filter(q => q.pillar === pillar && state.questionDispositions[q.id] && state.questionDispositions[q.id] !== 'unset').length;

  const blockingCount = Object.values(state.questionDispositions).filter(d => d === 'blocking').length;
  const resolvedCount = Object.values(state.questionDispositions).filter(d => d === 'resolved').length;

  const filteredQuestions = activeFilter === 'all'
    ? DIFFICULT_QUESTIONS
    : DIFFICULT_QUESTIONS.filter(q => q.pillar === activeFilter);

  return (
    <div className="scene">
      <div className="scene__content">
        <div className="scene-enter">
          <SceneHeader
            eyebrow="Scene 4 of 7 · The Difficult Questions"
            title="The questions the committee will ask"
            subtitle="These are the hard questions that will be raised in the investment committee. Examine each one, review the evidence, and record your assessment."
          />

          <MayaVoice text="I've been in enough committee rooms to know which questions are coming. The CFO will ask about cost. The CISO about data leaving the building. The CRO about regulatory lineage. Better to have honest answers now than to be caught out in the room." />
        </div>

        {/* Summary metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '2rem' }}>
          {[
            { label: 'Questions reviewed', value: Object.keys(state.questionDispositions).length, color: 'var(--text-primary)' },
            { label: 'Resolved for PoC', value: resolvedCount, color: 'var(--evidence-supported)' },
            { label: 'Blocking', value: blockingCount, color: '#F87171' },
          ].map(m => (
            <div key={m.label} style={{
              padding: '1rem 1.25rem',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: m.color, fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                {m.value}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* Pillar filter tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <button
            onClick={() => setActiveFilter('all')}
            style={{
              padding: '0.4rem 0.875rem',
              borderRadius: '999px',
              border: `1px solid ${activeFilter === 'all' ? 'var(--accent)' : 'var(--border-default)'}`,
              background: activeFilter === 'all' ? 'var(--accent-dim)' : 'transparent',
              color: activeFilter === 'all' ? 'var(--accent)' : 'var(--text-muted)',
              fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-ui)',
              transition: 'all 0.15s',
            }}
          >
            All ({DIFFICULT_QUESTIONS.length})
          </button>
          {pillars.map(p => {
            const meta = PILLAR_META[p];
            const total = getCount(p);
            const disposed = getDisposedCount(p);
            const isActive = activeFilter === p;
            return (
              <button
                key={p}
                onClick={() => setActiveFilter(p)}
                style={{
                  padding: '0.4rem 0.875rem',
                  borderRadius: '999px',
                  border: `1px solid ${isActive ? meta.color : 'var(--border-default)'}`,
                  background: isActive ? `${meta.color}15` : 'transparent',
                  color: isActive ? meta.color : 'var(--text-muted)',
                  fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-ui)',
                  transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                <span>{meta.icon}</span>
                <span>{meta.label}</span>
                {disposed > 0 && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>({disposed}/{total})</span>}
              </button>
            );
          })}
        </div>

        {/* Questions list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem' }}>
          {filteredQuestions.map((q, idx) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <QuestionCard
                question={q}
                disposition={state.questionDispositions[q.id] ?? 'unset'}
                onDispose={(d) => setQuestionDisposition(q.id, d)}
              />
            </motion.div>
          ))}
        </div>

        {/* Footer nav */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '1rem 1.5rem',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
        }}>
          <div>
            {blockingCount > 0 && (
              <span style={{ fontSize: '0.8125rem', color: '#F87171' }}>
                ⚠ {blockingCount} blocking question{blockingCount !== 1 ? 's' : ''} — these will affect the final recommendation
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn--ghost btn--sm" onClick={() => navigate(3)}>← Back</button>
            <button className="btn btn--primary btn--sm" onClick={() => navigate(5)}>
              Meet the committee →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

