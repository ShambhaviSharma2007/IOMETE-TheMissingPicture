import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSession } from '../context/SessionContext';
import { EVALUATION_QUESTIONS } from '../data/generalContent';
import { SceneHeader, EvidenceBadge } from '../components/ui';
import type { EvaluationQuestion, QuestionDisposition, QuestionCategory } from '../types';

const CATEGORY_LABELS: Record<QuestionCategory, { label: string; icon: string }> = {
  security: { label: 'Security & Access', icon: '🔒' },
  integration: { label: 'Data Integration', icon: '🔧' },
  deployment: { label: 'Deployment & Sovereignty', icon: '🏰' },
  workloads: { label: 'Workloads & Concurrency', icon: '⚡' },
  operations: { label: 'Operations & Maintenance', icon: '⚙️' },
  quality: { label: 'Data Quality & Rollback', icon: '🛡️' },
  costs: { label: 'Commercials & Costs', icon: '💰' },
};

function QuestionCard({
  q,
  disposition,
  onDispose,
}: {
  q: EvaluationQuestion;
  disposition: QuestionDisposition;
  onDispose: (d: QuestionDisposition) => void;
}) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const meta = CATEGORY_LABELS[q.category] || { label: q.category, icon: '❓' };

  return (
    <motion.div
      layout
      style={{
        background: 'var(--bg-card)',
        border: `1.5px solid ${
          disposition === 'blocking'
            ? 'rgba(248, 113, 113, 0.4)'
            : disposition === 'resolved'
            ? 'rgba(16, 185, 129, 0.4)'
            : disposition === 'needs_answer'
            ? 'rgba(245, 158, 11, 0.4)'
            : 'var(--border-subtle)'
        }`,
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        transition: 'border-color 0.2s ease',
      }}
    >
      {/* Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          padding: '1.25rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
        }}
      >
        <div style={{ fontSize: '1.25rem', lineHeight: 1 }}>{meta.icon}</div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              {meta.label}
            </span>
            <EvidenceBadge state={q.evidenceState} />
          </div>

          <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.45 }}>
            {q.question}
          </h4>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          {disposition && disposition !== 'unreviewed' && (
            <span style={{
              fontSize: '0.6875rem',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 4,
              textTransform: 'uppercase',
              background:
                disposition === 'resolved'
                  ? 'var(--evidence-supported-dim)'
                  : disposition === 'needs_answer'
                  ? 'var(--evidence-assumed-dim)'
                  : 'rgba(248, 113, 113, 0.15)',
              color:
                disposition === 'resolved'
                  ? 'var(--evidence-supported)'
                  : disposition === 'needs_answer'
                  ? 'var(--evidence-assumed)'
                  : '#F87171',
            }}>
              {disposition === 'resolved' ? '✓ Resolved' : disposition === 'needs_answer' ? '~ Needs Vendor' : '✗ Blocking'}
            </span>
          )}
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', display: 'inline-block' }}>
            ▼
          </span>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div style={{ borderTop: '1px solid var(--border-subtle)', padding: '1.25rem', background: 'var(--bg-surface)' }}>
          <div style={{ marginBottom: 12 }}>
            <div className="text-label" style={{ marginBottom: 4 }}>Why this matters</div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              {q.plainContext}
            </p>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div className="text-label" style={{ marginBottom: 4, color: 'var(--accent)' }}>Documented IOMETE Answer</div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
              {q.suggestedAnswer}
            </p>
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 16 }}>
            Evidence Basis: {q.sourceNote}
          </div>

          {/* Disposition Controls */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Classify for your evaluation:
            </span>
            <div className="disposition-control">
              <button
                className={`disposition-btn ${disposition === 'resolved' ? 'disposition-btn--resolved' : ''}`}
                onClick={() => onDispose('resolved')}
              >
                ✓ Resolved for PoC
              </button>
              <button
                className={`disposition-btn ${disposition === 'needs_answer' ? 'disposition-btn--needs' : ''}`}
                onClick={() => onDispose('needs_answer')}
              >
                ~ Needs Vendor Answer
              </button>
              <button
                className={`disposition-btn ${disposition === 'blocking' ? 'disposition-btn--blocking' : ''}`}
                onClick={() => onDispose('blocking')}
              >
                ✗ Blocking Issue
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export function Step6ImportantQuestions() {
  const { state, goToStep, setQuestionDisposition } = useSession();
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Filter prioritized questions based on selected outcomes
  const userTagSet = new Set<string>([
    ...state.selectedOutcomes,
    ...state.selectedChallenges,
  ]);

  const sortedQuestions = [...EVALUATION_QUESTIONS].sort((a, b) => {
    const aMatch = a.relevanceTags.some(t => userTagSet.has(t));
    const bMatch = b.relevanceTags.some(t => userTagSet.has(t));
    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;
    return 0;
  });

  const filtered = categoryFilter === 'all'
    ? sortedQuestions
    : sortedQuestions.filter(q => q.category === categoryFilter);

  const blockingCount = Object.values(state.questionDispositions).filter(d => d === 'blocking').length;
  const needsAnswerCount = Object.values(state.questionDispositions).filter(d => d === 'needs_answer').length;
  const resolvedCount = Object.values(state.questionDispositions).filter(d => d === 'resolved').length;

  return (
    <div className="scene">
      <div className="scene__content">
        <div className="scene-enter">
          <SceneHeader
            eyebrow="Step 6 of 8 · Review Important Questions"
            title="Key questions to investigate before committing"
            subtitle="Prioritized based on your selected requirements and current challenges. Classify each question as Resolved, Needs Vendor Answer, or a Blocking Issue to shape your evaluation plan."
          />
        </div>

        {/* Status Metrics Strip */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}>
          <div style={{ padding: '1rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--evidence-supported)' }}>
              {resolvedCount}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>Resolved for PoC</div>
          </div>

          <div style={{ padding: '1rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--evidence-assumed)' }}>
              {needsAnswerCount}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>Needs Vendor Answer</div>
          </div>

          <div style={{ padding: '1rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 700, color: blockingCount > 0 ? '#F87171' : 'var(--text-muted)' }}>
              {blockingCount}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>Blocking Concerns</div>
          </div>
        </div>

        {/* Questions List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem' }}>
          {filtered.map(q => (
            <QuestionCard
              key={q.id}
              q={q}
              disposition={state.questionDispositions[q.id] || 'unreviewed'}
              onDispose={(d) => setQuestionDisposition(q.id, d)}
            />
          ))}
        </div>

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
          <button className="btn btn--ghost btn--sm" onClick={() => goToStep(5)}>
            ← Back to Costs
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {blockingCount > 0 && (
              <span style={{ fontSize: '0.8125rem', color: '#F87171' }}>
                ⚠ {blockingCount} blocking item(s) will be translated into pre-conditions in Step 7
              </span>
            )}
            <button className="btn btn--primary btn--sm" onClick={() => goToStep(7)}>
              Build Evaluation Plan →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

