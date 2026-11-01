import React from 'react';
import { motion } from 'framer-motion';
import { useSession, computeFinancialSummary } from '../context/SessionContext';
import { SceneHeader } from '../components/ui';
import type { CostField } from '../types';

function CostFieldEditor({
  field,
  currency,
  onUpdate,
}: {
  field: CostField;
  currency: string;
  onUpdate: (value: number) => void;
}) {
  if (field.isUnknown) {
    return (
      <div className="editable-field">
        <div style={{ flex: 1, paddingRight: 12 }}>
          <div className="editable-field__label">{field.label}</div>
          {field.notes && <div className="editable-field__note">{field.notes}</div>}
        </div>
        <div className="editable-field__unknown">
          Quote required from vendor
        </div>
      </div>
    );
  }

  return (
    <div className="editable-field">
      <div style={{ flex: 1, paddingRight: 12 }}>
        <div className="editable-field__label">{field.label}</div>
        {field.notes && <div className="editable-field__note">{field.notes}</div>}
      </div>
      <div className="editable-field__input-wrap">
        <span className="editable-field__currency">{currency}</span>
        <input
          type="number"
          className="editable-field__input"
          value={field.value}
          min={0}
          step={1000}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            onUpdate(isNaN(val) ? 0 : Math.max(0, val));
          }}
        />
      </div>
    </div>
  );
}

export function Step5CostsAndEffort() {
  const { state, goToStep, updateCostField, toggleFinancialSkip } = useSession();
  const { financialModel } = state;
  const currency = financialModel.currency || '₹';

  const summary = computeFinancialSummary(financialModel);

  return (
    <div className="scene">
      <div className="scene__content">
        <div className="scene-enter">
          <SceneHeader
            eyebrow="Step 5 of 8 · Review Costs & Effort"
            title="Estimate the financial impact and migration effort"
            subtitle="Transparently compare your current operating baseline against a self-hosted Lakehouse architecture. All figures are editable estimates based on your inputs. If you do not have financial estimates yet, you can skip this step."
          />
        </div>

        {/* Skip Toggle Banner */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.875rem 1.25rem',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '2rem',
        }}>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {financialModel.isSkipped ? 'Financial estimation is currently skipped' : 'Financial estimation is active'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {financialModel.isSkipped
                ? 'Your final report will state that financial estimates were omitted.'
                : 'Enter your approximate numbers below to calculate potential Year-1 net impact.'}
            </div>
          </div>

          <button
            className={`btn ${financialModel.isSkipped ? 'btn--primary' : 'btn--ghost'} btn--sm`}
            onClick={() => toggleFinancialSkip(!financialModel.isSkipped)}
          >
            {financialModel.isSkipped ? 'Enable Financial Model' : 'Skip Financials'}
          </button>
        </div>

        {!financialModel.isSkipped && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '2.5rem' }}
          >
            {/* 3 Editable Cost Sections */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1rem',
            }}>
              {/* Current Costs */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-subtle)', background: 'rgba(245, 158, 11, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)' }}>1. Current Annual Baseline</div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Existing licenses, egress & maintenance</div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--evidence-assumed)' }}>
                    {currency}{summary.currentAnnual.toLocaleString()}
                  </div>
                </div>
                <div>
                  {financialModel.currentAnnualCosts.map(field => (
                    <CostFieldEditor
                      key={field.id}
                      field={field}
                      currency={currency}
                      onUpdate={(val) => updateCostField('currentAnnualCosts', field.id, val)}
                    />
                  ))}
                </div>
              </div>

              {/* Proposed Costs */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-subtle)', background: 'rgba(59, 130, 246, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)' }}>2. Estimated IOMETE Run Cost</div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Kubernetes compute, storage & ops</div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent)' }}>
                    {currency}{summary.proposedAnnual.toLocaleString()}*
                  </div>
                </div>
                <div>
                  {financialModel.proposedAnnualCosts.map(field => (
                    <CostFieldEditor
                      key={field.id}
                      field={field}
                      currency={currency}
                      onUpdate={(val) => updateCostField('proposedAnnualCosts', field.id, val)}
                    />
                  ))}
                </div>
              </div>

              {/* Implementation Costs */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-subtle)', background: 'rgba(16, 185, 129, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)' }}>3. One-Time Setup & PoC</div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Cluster setup & pilot feed migration</div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--evidence-supported)' }}>
                    {currency}{summary.implementationOneTime.toLocaleString()}
                  </div>
                </div>
                <div>
                  {financialModel.oneTimeImplementationCosts.map(field => (
                    <CostFieldEditor
                      key={field.id}
                      field={field}
                      currency={currency}
                      onUpdate={(val) => updateCostField('oneTimeImplementationCosts', field.id, val)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Calculated Results Summary HUD */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-active)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.75rem',
            }}>
              <div className="text-label" style={{ marginBottom: 12, color: 'var(--accent)' }}>
                Transparent Calculated Outputs
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1rem',
                marginBottom: 16,
              }}>
                <div style={{ padding: '1.25rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.6rem',
                    fontWeight: 700,
                    color: summary.annualSavings > 0 ? 'var(--evidence-supported)' : '#F87171',
                  }}>
                    {summary.annualSavings > 0 ? '+' : ''}{currency}{summary.annualSavings.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    Estimated Annual Operating Delta (excl. licence)
                  </div>
                </div>

                <div style={{ padding: '1.25rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.6rem',
                    fontWeight: 700,
                    color: summary.year1Net > 0 ? 'var(--evidence-supported)' : '#F87171',
                  }}>
                    {summary.year1Net > 0 ? '+' : ''}{currency}{summary.year1Net.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    Year 1 Net Position (Savings minus One-Time PoC)
                  </div>
                </div>

                <div style={{ padding: '1.25rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    color: summary.annualSavings > 0 ? 'var(--text-primary)' : '#FCA5A5',
                    marginTop: 6,
                  }}>
                    {summary.breakEvenNote}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8 }}>
                    Break-Even Timeline
                  </div>
                </div>
              </div>

              <div style={{
                padding: '0.75rem 1rem',
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: 'var(--radius-md)',
              }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--evidence-assumed)', lineHeight: 1.55 }}>
                  ⚠ <strong>Financial Disclaimer:</strong> All figures above are user-entered estimates. IOMETE software licence pricing is not included because it requires a customized quote. These calculations are designed for internal evaluation planning, not commercial contract guarantees.
                </p>
              </div>
            </div>
          </motion.div>
        )}

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
          <button className="btn btn--ghost btn--sm" onClick={() => goToStep(4)}>
            ← Back to Platform Fit
          </button>
          <button className="btn btn--primary btn--sm" onClick={() => goToStep(6)}>
            Review Important Questions →
          </button>
        </div>
      </div>
    </div>
  );
}

