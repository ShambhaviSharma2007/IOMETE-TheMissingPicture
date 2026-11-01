import React from 'react';
import { motion } from 'framer-motion';
import { useSession } from '../context/SessionContext';
import { SETUP_CHALLENGES } from '../data/generalContent';
import { SceneHeader } from '../components/ui';

export function Step2CurrentSetup() {
  const { state, goToStep, toggleChallenge, setSetupDescription } = useSession();

  return (
    <div className="scene">
      <div className="scene__content">
        <div className="scene-enter">
          <SceneHeader
            eyebrow="Step 2 of 8 · Understand Your Current Setup"
            title="What challenges does your data environment face today?"
            subtitle="Select the pain points that apply to your organization. This helps the navigator focus on capabilities and questions that are directly relevant to your situation."
          />
        </div>

        {/* Challenge Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}>
          {SETUP_CHALLENGES.map(item => {
            const isSelected = state.selectedChallenges.includes(item.id);

            return (
              <motion.div
                key={item.id}
                onClick={() => toggleChallenge(item.id)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                style={{
                  background: isSelected ? 'rgba(59, 130, 246, 0.08)' : 'var(--bg-card)',
                  border: `1.5px solid ${isSelected ? 'var(--accent)' : 'var(--border-subtle)'}`,
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 0 16px var(--accent-glow)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    border: `2px solid ${isSelected ? 'var(--accent)' : 'var(--border-default)'}`,
                    background: isSelected ? 'var(--accent)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#fff',
                    transition: 'all 0.15s ease',
                  }}>
                    {isSelected && '✓'}
                  </div>
                </div>

                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
                  {item.title}
                </div>

                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: 10, flex: 1 }}>
                  {item.description}
                </div>

                <div style={{
                  padding: '6px 10px',
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-subtle)',
                }}>
                  <strong style={{ color: 'var(--text-secondary)' }}>Typical example:</strong> {item.commonExamples}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Optional Custom Setup Description */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          marginBottom: '2rem',
        }}>
          <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
            Optional: Describe your current data setup or systems
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
            Tell us about the databases, cloud warehouses, or tools your team uses today (e.g. "Postgres OLTP + Snowflake + S3").
          </p>
          <textarea
            value={state.setupDescription}
            onChange={(e) => setSetupDescription(e.target.value)}
            placeholder="e.g. We have product event logs in S3 and financial tables in an on-premises SQL Server. Nightly jobs fail when schemas change..."
            rows={3}
            style={{
              width: '100%',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-ui)',
              fontSize: '0.875rem',
              padding: '0.75rem 1rem',
              lineHeight: 1.6,
              outline: 'none',
              resize: 'vertical',
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-default)'}
          />
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
          <button className="btn btn--ghost btn--sm" onClick={() => goToStep(1)}>
            ← Back
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              {state.selectedChallenges.length > 0
                ? `${state.selectedChallenges.length} challenge(s) identified`
                : 'Selections are optional — click next whenever ready'}
            </span>
            <button className="btn btn--primary btn--sm" onClick={() => goToStep(3)}>
              Define What You Need →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
