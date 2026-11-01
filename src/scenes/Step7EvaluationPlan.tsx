import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '../context/SessionContext';
import { EVALUATION_QUESTIONS } from '../data/generalContent';
import { SceneHeader } from '../components/ui';
import type { EvaluationPlanItem } from '../types';

export function Step7EvaluationPlan() {
  const { state, goToStep, updatePlanItem, addPlanItem, deletePlanItem } = useSession();
  const [editingItem, setEditingItem] = useState<EvaluationPlanItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);

  // New item form state
  const [newTitle, setNewTitle] = useState('');
  const [newWhat, setNewWhat] = useState('');
  const [newWhy, setNewWhy] = useState('');
  const [newEvidence, setNewEvidence] = useState('');
  const [newOwner, setNewOwner] = useState('Data Platform Team');
  const [newSuccess, setNewSuccess] = useState('');

  // Collect blocking questions to highlight as critical pre-conditions
  const blockingQuestions = EVALUATION_QUESTIONS.filter(
    q => state.questionDispositions[q.id] === 'blocking'
  );

  const handleSaveNew = () => {
    if (!newTitle.trim() || !newWhat.trim()) return;
    const newItem: EvaluationPlanItem = {
      id: `custom-plan-${Date.now()}`,
      title: newTitle,
      whatToTest: newWhat,
      whyItMatters: newWhy || 'Custom organizational validation objective.',
      evidenceRequired: newEvidence || 'Verification logs and stakeholder review.',
      ownerRole: newOwner || 'Data Platform Lead',
      successCriteria: newSuccess || 'Validation criteria approved by evaluation lead.',
      isUserCustom: true,
    };
    addPlanItem(newItem);
    setIsAddingNew(false);
    setNewTitle('');
    setNewWhat('');
    setNewWhy('');
    setNewEvidence('');
    setNewSuccess('');
  };

  return (
    <div className="scene">
      <div className="scene__content">
        <div className="scene-enter">
          <SceneHeader
            eyebrow="Step 7 of 8 · Build an Evaluation Plan"
            title="Practical proof-of-concept evaluation plan"
            subtitle="Transform unresolved questions and target outcomes into actionable milestones. Review test criteria, assign ownership, and define what a successful evaluation looks like."
          />
        </div>

        {/* Blocking Pre-Conditions Callout if any */}
        {blockingQuestions.length > 0 && (
          <div style={{
            padding: '1.25rem 1.5rem',
            background: 'rgba(248, 113, 113, 0.08)',
            border: '1px solid rgba(248, 113, 113, 0.3)',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '2rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ color: '#F87171', fontSize: '1.1rem' }}>⚠</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#F87171', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Mandatory Pre-Conditions (Derived from Step 6 Blockers)
              </span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: '#FCA5A5', lineHeight: 1.5, marginBottom: 12 }}>
              These critical concerns must be resolved with the IOMETE team before committing engineering resources to a full pilot:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {blockingQuestions.map(bq => (
                <div key={bq.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.8125rem', color: '#FCA5A5' }}>
                  <span style={{ color: '#F87171' }}>✗</span>
                  <span><strong>{bq.question}</strong> — {bq.suggestedAnswer}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Evaluation Milestones List */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div className="text-label" style={{ color: 'var(--text-primary)' }}>
              Core Proof-of-Concept Milestones ({state.customPlanItems.length})
            </div>
            <button
              className="btn btn--ghost btn--sm"
              onClick={() => setIsAddingNew(true)}
              style={{ fontSize: '0.75rem' }}
            >
              + Add Custom Milestone
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {state.customPlanItems.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem 1.5rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--accent)', fontWeight: 600, marginRight: 8 }}>
                      Phase {idx + 1}
                    </span>
                    <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', display: 'inline' }}>
                      {item.title}
                    </h4>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent)', background: 'var(--accent-dim)', padding: '2px 8px', borderRadius: 4 }}>
                      Lead: {item.ownerRole}
                    </span>
                    {item.isUserCustom && (
                      <button
                        onClick={() => deletePlanItem(item.id)}
                        style={{ background: 'none', border: 'none', color: '#F87171', cursor: 'pointer', fontSize: '0.75rem', padding: '2px 6px' }}
                        title="Delete custom item"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem', marginTop: 12 }}>
                  <div style={{ padding: '8px 10px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    <div className="text-label" style={{ marginBottom: 2 }}>What to Test or Confirm</div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {item.whatToTest}
                    </p>
                  </div>

                  <div style={{ padding: '8px 10px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    <div className="text-label" style={{ marginBottom: 2 }}>Why It Matters</div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {item.whyItMatters}
                    </p>
                  </div>

                  <div style={{ padding: '8px 10px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    <div className="text-label" style={{ marginBottom: 2 }}>Evidence Required</div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {item.evidenceRequired}
                    </p>
                  </div>

                  <div style={{ padding: '8px 10px', background: 'var(--evidence-supported-dim)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                    <div className="text-label" style={{ marginBottom: 2, color: 'var(--evidence-supported)' }}>Success Criteria</div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {item.successCriteria}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Modal for Adding New Milestone */}
        <AnimatePresence>
          {isAddingNew && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => e.target === e.currentTarget && setIsAddingNew(false)}
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
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-active)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '2rem',
                  maxWidth: 580,
                  width: '100%',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Add Custom Evaluation Milestone
                  </h3>
                  <button onClick={() => setIsAddingNew(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Milestone Title</label>
                    <input
                      type="text"
                      className="editable-field__input"
                      style={{ width: '100%', textAlign: 'left' }}
                      placeholder="e.g. Test Kafka stream ingestion into Iceberg"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>What to Test or Confirm</label>
                    <textarea
                      rows={2}
                      className="editable-field__input"
                      style={{ width: '100%', textAlign: 'left', resize: 'vertical' }}
                      placeholder="Specific steps or configurations to run..."
                      value={newWhat}
                      onChange={(e) => setNewWhat(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Owner Role</label>
                      <input
                        type="text"
                        className="editable-field__input"
                        style={{ width: '100%', textAlign: 'left' }}
                        value={newOwner}
                        onChange={(e) => setNewOwner(e.target.value)}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Evidence Required</label>
                      <input
                        type="text"
                        className="editable-field__input"
                        style={{ width: '100%', textAlign: 'left' }}
                        placeholder="Log output, query result, etc."
                        value={newEvidence}
                        onChange={(e) => setNewEvidence(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Success Criteria</label>
                    <input
                      type="text"
                      className="editable-field__input"
                      style={{ width: '100%', textAlign: 'left' }}
                      placeholder="e.g. Continuous ingestion with <15 second latency"
                      value={newSuccess}
                      onChange={(e) => setNewSuccess(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
                  <button className="btn btn--ghost btn--sm" onClick={() => setIsAddingNew(false)}>Cancel</button>
                  <button className="btn btn--primary btn--sm" onClick={handleSaveNew}>Save Milestone</button>
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
          <button className="btn btn--ghost btn--sm" onClick={() => goToStep(6)}>
            ← Back to Questions
          </button>
          <button className="btn btn--primary btn--sm" onClick={() => goToStep(8)}>
            Generate Evaluation Report →
          </button>
        </div>
      </div>
    </div>
  );
}

