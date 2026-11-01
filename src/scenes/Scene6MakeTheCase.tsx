import React from 'react';
import { motion } from 'framer-motion';
import { useSession } from '../context/SessionContext';
import { DEFAULT_POC_PLAN, DIFFICULT_QUESTIONS } from '../data/content';
import { SceneHeader, MayaVoice } from '../components/ui';
import type { EditableField } from '../types';

// ─── Editable Field Row ───────────────────────────────────────────────────────

function FieldRow({
  field,
  onUpdate,
}: {
  field: EditableField;
  onUpdate: (value: number) => void;
}) {
  if (field.isUnknown) {
    return (
      <div className="editable-field">
        <div>
          <div className="editable-field__label">{field.label}</div>
          {field.note && <div className="editable-field__note">{field.note}</div>}
        </div>
        <div className="editable-field__unknown">TBD — vendor quote required</div>
      </div>
    );
  }

  return (
    <div className="editable-field">
      <div>
        <div className="editable-field__label">{field.label}</div>
        {field.note && <div className="editable-field__note">{field.note}</div>}
      </div>
      <div className="editable-field__input-wrap">
        <span className="editable-field__currency">£</span>
        <input
          type="number"
          className="editable-field__input"
          value={field.value}
          min={0}
          step={1000}
          onChange={(e) => onUpdate(parseInt(e.target.value, 10) || 0)}
        />
      </div>
    </div>
  );
}

// ─── Cost Section Card ────────────────────────────────────────────────────────

function CostSection({
  title,
  fields,
  category,
  color,
  onUpdate,
}: {
  title: string;
  fields: EditableField[];
  category: 'infrastructure' | 'currentStateCosts' | 'pocInvestment';
  color: string;
  onUpdate: (fieldId: string, value: number) => void;
}) {
  const total = fields.filter(f => !f.isUnknown).reduce((sum, f) => sum + f.value, 0);

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '1rem 1.25rem',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: `${color}08`,
      }}>
        <div>
          <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)' }}>{title}</div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: 2 }}>All figures are user-entered estimates</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.125rem', fontWeight: 700, color }}>
            £{total.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>known total</div>
        </div>
      </div>
      <div>
        {fields.map(field => (
          <FieldRow key={field.id} field={field} onUpdate={(v) => onUpdate(field.id, v)} />
        ))}
      </div>
    </div>
  );
}

// ─── Calculated Outputs ───────────────────────────────────────────────────────

function FinancialSummary({ model }: { model: { infrastructure: EditableField[]; currentStateCosts: EditableField[]; pocInvestment: EditableField[] } }) {
  const infraTotal = model.infrastructure.filter(f => !f.isUnknown).reduce((s, f) => s + f.value, 0);
  const currentTotal = model.currentStateCosts.reduce((s, f) => s + f.value, 0);
  const pocTotal = model.pocInvestment.reduce((s, f) => s + f.value, 0);

  const annualSaving = currentTotal - infraTotal;
  const isPositive = annualSaving > 0;

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-active)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.5rem',
    }}>
      <div className="text-label" style={{ marginBottom: '1rem' }}>Calculated outputs</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 700, color: isPositive ? 'var(--evidence-supported)' : '#F87171' }}>
            {isPositive ? '+' : ''}£{Math.abs(annualSaving).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
            Estimated annual {isPositive ? 'saving' : 'cost increase'}<br />(excl. licence)
          </div>
        </div>

        <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            £{pocTotal.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
            PoC investment<br />(one-time)
          </div>
        </div>

        <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--evidence-unknown-dim)', borderRadius: 'var(--radius-md)', border: '1px solid var(--evidence-unknown-dim)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 700, color: 'var(--evidence-unknown)', marginTop: 8 }}>
            ? Unknown
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
            Break-even month<br />(requires licence cost)
          </div>
        </div>
      </div>

      <div style={{
        marginTop: '1rem',
        padding: '0.75rem 1rem',
        background: 'rgba(245, 158, 11, 0.07)',
        border: '1px solid rgba(245, 158, 11, 0.2)',
        borderRadius: 'var(--radius-md)',
      }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--evidence-assumed)', lineHeight: 1.6 }}>
          ⚠ <strong>Assumptions:</strong> All figures above are user-entered estimates. This model does not contain IOMETE licence pricing.
          The break-even calculation requires a vendor quote. Three-year NPV cannot be computed without the licence cost.
          Do not use these figures in a board submission without vendor confirmation.
        </p>
      </div>
    </div>
  );
}

// ─── PoC Plan ─────────────────────────────────────────────────────────────────

function PocPlan() {
  const { state } = useSession();

  // Derive pre-conditions from blocking questions
  const blockingQIds = Object.entries(state.questionDispositions)
    .filter(([, d]) => d === 'blocking')
    .map(([id]) => id);

  const pocActions = DIFFICULT_QUESTIONS
    .filter(q => blockingQIds.includes(q.id) && q.pocAction)
    .map(q => q.pocAction!);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
      {/* Plan weeks */}
      <div>
        <div className="text-label" style={{ marginBottom: '1rem' }}>Suggested 8-week PoC plan</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {DEFAULT_POC_PLAN.map((week, idx) => (
            <div key={idx} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem 1.25rem',
              display: 'flex', gap: '1rem',
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--accent)',
                flexShrink: 0, paddingTop: 2,
              }}>
                {week.weekRange}
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.3rem', flex: 1 }}>
                {week.tasks.map((task, i) => (
                  <li key={i} style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, display: 'flex', gap: 8 }}>
                    <span style={{ color: 'var(--accent)', flexShrink: 0 }}>·</span>
                    {task}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Pre-conditions */}
      <div>
        <div className="text-label" style={{ marginBottom: '1rem' }}>Blocking pre-conditions</div>

        {pocActions.length === 0 ? (
          <div style={{
            padding: '1rem',
            background: 'var(--evidence-supported-dim)',
            border: '1px solid rgba(16,185,129,0.25)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8125rem', color: 'var(--evidence-supported)',
          }}>
            No blocking questions recorded. All identified issues are flagged for resolution within the PoC scope.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {pocActions.map((action, i) => (
              <div key={i} style={{
                padding: '0.75rem 1rem',
                background: 'rgba(248, 113, 113, 0.07)',
                border: '1px solid rgba(248, 113, 113, 0.2)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8125rem', color: '#FCA5A5', lineHeight: 1.55,
              }}>
                <span style={{ color: '#F87171', marginRight: 6 }}>✗</span>
                {action}
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
          <div className="text-label" style={{ marginBottom: '0.5rem' }}>Universal pre-conditions</div>
          {[
            'Obtain IOMETE SOC 2 Type II report',
            'Request indicative licence pricing',
            'Confirm KMS integration compatibility',
            'Define internal Kubernetes operational team',
          ].map((c, i) => (
            <div key={i} style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6, display: 'flex', gap: 8 }}>
              <span style={{ color: 'var(--evidence-unknown)' }}>?</span>
              {c}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Scene 6 ──────────────────────────────────────────────────────────────────

export function Scene6MakeTheCase() {
  const { state, navigate, updateFinancialField } = useSession();

  return (
    <div className="scene">
      <div className="scene__content">
        <div className="scene-enter">
          <SceneHeader
            eyebrow="Scene 6 of 7 · Make the Case"
            title="Build the investment argument"
            subtitle="Adjust the financial assumptions and review the PoC plan. These figures will appear in your evaluation pack."
          />

          <MayaVoice text="Numbers without context are just noise. These assumptions are mine — I've made them visible so the committee can challenge them, not so they can take them as fact. The model is only as good as the figures we put in it." />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
          {/* Cost sections */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <CostSection
              title="IOMETE Platform Costs"
              fields={state.financialModel.infrastructure}
              category="infrastructure"
              color="var(--accent)"
              onUpdate={(fid, v) => updateFinancialField('infrastructure', fid, v)}
            />
            <CostSection
              title="Current State Costs"
              fields={state.financialModel.currentStateCosts}
              category="currentStateCosts"
              color="var(--evidence-assumed)"
              onUpdate={(fid, v) => updateFinancialField('currentStateCosts', fid, v)}
            />
            <CostSection
              title="PoC Investment (One-time)"
              fields={state.financialModel.pocInvestment}
              category="pocInvestment"
              color="var(--evidence-supported)"
              onUpdate={(fid, v) => updateFinancialField('pocInvestment', fid, v)}
            />
          </div>

          {/* Summary */}
          <FinancialSummary model={state.financialModel} />

          {/* PoC Plan */}
          <div>
            <div style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Proof of Concept Plan
            </div>
            <PocPlan />
          </div>
        </div>

        {/* Footer nav */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '1rem 1.5rem',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
        }}>
          <button className="btn btn--ghost btn--sm" onClick={() => navigate(5)}>← Back</button>
          <button className="btn btn--primary btn--sm" onClick={() => navigate(7)}>
            Generate evaluation pack →
          </button>
        </div>
      </div>
    </div>
  );
}

