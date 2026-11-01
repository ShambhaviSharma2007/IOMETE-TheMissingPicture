import React from 'react';
import { motion } from 'framer-motion';
import { useSession } from '../context/SessionContext';
import { DESIRED_OUTCOMES } from '../data/generalContent';
import { SceneHeader } from '../components/ui';
import type { DeploymentConstraint, OutcomePriority } from '../types';

const CONSTRAINTS: { id: DeploymentConstraint; label: string; desc: string }[] = [
  { id: 'private-cloud', label: 'Private Cloud (AWS / Azure / GCP VPC)', desc: 'Run inside our own dedicated cloud tenancy on Kubernetes.' },
  { id: 'on-prem', label: 'On-Premises Data Centre', desc: 'Must run strictly within our physical hardware and private network.' },
  { id: 'public-cloud-tenant', label: 'Managed Cloud Tenant', desc: 'Open to vendor-hosted infrastructure if compliance allows.' },
  { id: 'flexible', label: 'Flexible / To Be Evaluated', desc: 'Will determine optimal deployment mode during evaluation.' },
];

export function Step3WhatYouNeed() {
  const { state, goToStep, toggleOutcome, setOutcomePriority, setDeploymentConstraint } = useSession();

  const selectedCount = state.selectedOutcomes.length;

  return (
    <div className="scene">
      <div className="scene__content">
        <div className="scene-enter">
          <SceneHeader
            eyebrow="Step 3 of 8 · Define What You Need"
            title="What outcomes are most important to your platform?"
            subtitle="Select the results you want to achieve. Tag your priority (Must-Have vs Nice-to-Have) and specify your infrastructure constraint so IOMETE can be evaluated honestly against your standards."
          />
        </div>

        {/* Outcomes Selection Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '1rem',
          marginBottom: '2.5rem',
        }}>
          {DESIRED_OUTCOMES.map(outcome => {
            const isSelected = state.selectedOutcomes.includes(outcome.id);
            const priority: OutcomePriority = state.outcomePriorities[outcome.id] || 'must-have';

            return (
              <motion.div
                key={outcome.id}
                layout
                style={{
                  background: isSelected ? 'rgba(59, 130, 246, 0.08)' : 'var(--bg-card)',
                  border: `1.5px solid ${isSelected ? 'var(--accent)' : 'var(--border-subtle)'}`,
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 0 16px var(--accent-glow)' : 'none',
                }}
              >
                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div
                    onClick={() => toggleOutcome(outcome.id)}
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 4,
                      border: `2px solid ${isSelected ? 'var(--accent)' : 'var(--border-default)'}`,
                      background: isSelected ? 'var(--accent)' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      color: '#fff',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {isSelected && '✓'}
                  </div>
                </div>

                <div
                  onClick={() => toggleOutcome(outcome.id)}
                  style={{ cursor: 'pointer', marginBottom: 8 }}
                >
                  <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                    {outcome.title}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                    {outcome.description}
                  </div>
                </div>

                <div style={{
                  padding: '8px 10px',
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-subtle)',
                  marginBottom: 12,
                  flex: 1,
                }}>
                  <strong style={{ color: 'var(--text-secondary)' }}>Plain English Goal:</strong> {outcome.plainGoal}
                </div>

                {/* Priority Selector (Visible if selected) */}
                {isSelected && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: 8,
                    borderTop: '1px solid var(--border-subtle)',
                  }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Priority Level:</span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => setOutcomePriority(outcome.id, 'must-have')}
                        style={{
                          padding: '3px 8px',
                          borderRadius: 999,
                          border: `1px solid ${priority === 'must-have' ? 'var(--accent)' : 'var(--border-default)'}`,
                          background: priority === 'must-have' ? 'var(--accent-dim)' : 'transparent',
                          color: priority === 'must-have' ? 'var(--accent)' : 'var(--text-muted)',
                          fontSize: '0.6875rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Must-Have
                      </button>
                      <button
                        onClick={() => setOutcomePriority(outcome.id, 'nice-to-have')}
                        style={{
                          padding: '3px 8px',
                          borderRadius: 999,
                          border: `1px solid ${priority === 'nice-to-have' ? 'var(--evidence-assumed)' : 'var(--border-default)'}`,
                          background: priority === 'nice-to-have' ? 'var(--evidence-assumed-dim)' : 'transparent',
                          color: priority === 'nice-to-have' ? 'var(--evidence-assumed)' : 'var(--text-muted)',
                          fontSize: '0.6875rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Nice-to-Have
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Infrastructure / Deployment Constraint Selection */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          marginBottom: '2rem',
        }}>
          <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
            Deployment & Residency Constraint
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
            Where does your organization require the data platform to reside?
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.75rem' }}>
            {CONSTRAINTS.map(c => {
              const isChosen = state.deploymentConstraint === c.id;

              return (
                <div
                  key={c.id}
                  onClick={() => setDeploymentConstraint(c.id)}
                  style={{
                    padding: '0.875rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: isChosen ? 'rgba(59, 130, 246, 0.08)' : 'var(--bg-surface)',
                    border: `1.5px solid ${isChosen ? 'var(--accent)' : 'var(--border-subtle)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: isChosen ? 'var(--accent)' : 'var(--text-primary)', marginBottom: 2 }}>
                    {isChosen ? '● ' : '○ '} {c.label}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                    {c.desc}
                  </div>
                </div>
              );
            })}
          </div>
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
          <button className="btn btn--ghost btn--sm" onClick={() => goToStep(2)}>
            ← Back to Setup
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              {selectedCount > 0
                ? `${selectedCount} outcome(s) selected`
                : 'Select at least 1 outcome to explore platform fit'}
            </span>
            <button
              className="btn btn--primary btn--sm"
              disabled={selectedCount === 0}
              onClick={() => goToStep(4)}
              style={{ opacity: selectedCount > 0 ? 1 : 0.5, cursor: selectedCount > 0 ? 'pointer' : 'not-allowed' }}
            >
              Explore Potential Fit →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
