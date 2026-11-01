import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, computeFinancialSummary } from '../context/SessionContext';
import { EVALUATION_QUESTIONS } from '../data/generalContent';
import type { QuestionDisposition, QuestionCategory, CostField } from '../types';
import { DollarSign, ShieldAlert, Users, HelpCircle, CheckCircle, AlertTriangle, ArrowRight, UserCheck } from 'lucide-react';

interface Chapter4TradeoffsProps {
  onContinue: () => void;
}

export function Chapter4Tradeoffs({ onContinue }: Chapter4TradeoffsProps) {
  const { state, updateCostField, toggleFinancialSkip, setQuestionDisposition } = useSession();
  const [activeExec, setActiveExec] = useState<'cfo' | 'ciso' | 'cto' | 'cro'>('cfo');
  const [selectedQuestionCategory, setSelectedQuestionCategory] = useState<string>('all');

  const { financialModel, questionDispositions } = state;
  const financialSummary = computeFinancialSummary(financialModel);

  // Stakeholders definition
  const stakeholders = [
    {
      id: 'cfo' as const,
      name: 'Chief Financial Officer',
      focus: 'Cost Predictability & Vendor Markup',
      color: '#7C3AED',
      concerns: [
        'Proprietary warehouse SaaS costs grow unpredictably as data expands.',
        'Vendor markups on raw cloud compute (3x to 5x AWS/Azure instance cost).',
        'Licence cost for IOMETE software requires custom quote, creating budget uncertainty.'
      ],
      addresses: [
        'Run on your own Kubernetes: pay cloud provider directly for compute VMs at wholesale cost without vendor markup.',
        'Open Apache Iceberg format prevents expensive lock-in and multi-year contract capture.'
      ],
      limitations: [
        'Internal Kubernetes engineering time is required to manage infrastructure.',
        'IOMETE licence cost is not public and must be negotiated.'
      ],
      question: 'What is our total cost ceiling, and how quickly does compute savings offset the implementation effort?'
    },
    {
      id: 'ciso' as const,
      name: 'Chief Information Security Officer',
      focus: 'Data Perimeter & Zero Exfiltration',
      color: '#DC2626',
      concerns: [
        'Data exfiltration risk when sending confidential datasets to multi-tenant SaaS warehouses.',
        'Compliance with sovereign data regulations (GDPR, HIPAA, DORA).',
        'Fine-grained access control across different analyst groups.'
      ],
      addresses: [
        '100% self-hosted: Both data plane and control plane live inside your private VPC/Kubernetes.',
        'Zero external egress: customer data never leaves your enterprise network perimeter.',
        'Apache Ranger integration for column masking and row-level filtering.'
      ],
      limitations: [
        'Customer security team must maintain cluster network policies, ingress firewalls, and TLS certificates.',
        'Formal SOC2 and penetration testing reports should be verified during PoC.'
      ],
      question: 'Can you demonstrate that no metadata or query results leave our VPC under any operational condition?'
    },
    {
      id: 'cto' as const,
      name: 'Chief Technology Officer',
      focus: 'Open Standards & Architectural Debt',
      color: '#059669',
      concerns: [
        'Accumulating proprietary SQL extensions that bind the team to one vendor.',
        'Engineering overhead of maintaining complex custom data pipelines.',
        'Ability to scale compute independently for heavy PySpark and ad-hoc queries.'
      ],
      addresses: [
        'Pure open-source foundation: Apache Iceberg storage + Apache Spark compute.',
        'Decoupled architecture: spin up separate Spark SQL clusters for ETL vs. BI.',
        'Native Kubernetes deployment using standard Helm charts.'
      ],
      limitations: [
        'Requires platform team to manage Kubernetes cluster health, node auto-scaling, and storage classes.',
        'Custom connectors may be needed for highly bespoke legacy source systems.'
      ],
      question: 'Do we have the internal Kubernetes operational maturity to run this without overwhelming our platform team?'
    },
    {
      id: 'cro' as const,
      name: 'Chief Risk & Governance Lead',
      focus: 'Auditability & Historical Lineage',
      color: '#D97706',
      concerns: [
        'Reconciling contradictory figures across teams during regulatory audits.',
        'Inability to reconstruct historical data snapshots as of a specific date.',
        'Silent corruption when ETL pipeline writes fail halfway through.'
      ],
      addresses: [
        'ACID transactions prevent partial writes and dirty reads across concurrent queries.',
        'Iceberg time-travel allows querying data exactly as it existed at any past timestamp.',
        'Instant snapshot rollback safely undoes bad batch ingestions.'
      ],
      limitations: [
        'Historical snapshots increase object storage footprint depending on retention policy.',
        'Data catalog must be properly maintained by pipeline owners.'
      ],
      question: 'Can we reliably reproduce any past regulatory report with an immutable snapshot audit trail?'
    }
  ];

  const currentExec = stakeholders.find(s => s.id === activeExec) || stakeholders[0];

  // Questions filtering
  const filteredQuestions = EVALUATION_QUESTIONS.filter(q => {
    if (selectedQuestionCategory === 'all') return true;
    return q.category === selectedQuestionCategory;
  });

  return (
    <section id="chapter-4" className="chapter-section chapter-section--warm">
      <div className="container container--wide">
        {/* Header */}
        <div className="chapter-header">
          <div className="chapter-pill">
            <span>Chapter 04</span>
            <span>·</span>
            <span>Understand the Trade-offs</span>
          </div>
          <h2 className="chapter-title">Balancing costs, governance &amp; architecture</h2>
          <p className="chapter-subtitle">
            Every architectural decision involves trade-offs. Evaluating IOMETE means weighing the cost of vendor compute markups against the responsibility of managing your own Kubernetes cluster.
          </p>
        </div>

        {/* Section A: Visual Financial Scenario Calculator */}
        <div
          className="card"
          style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: 20,
            padding: '2rem',
            marginBottom: '2.5rem',
            boxShadow: '0 4px 16px -2px rgba(15, 23, 42, 0.04)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                FINANCIAL SCENARIO CALCULATOR
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0F172A' }}>
                Comparing Annual Operating Costs
              </h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', color: '#64748B', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={financialModel.isSkipped}
                  onChange={(e) => toggleFinancialSkip(e.target.checked)}
                />
                <span>Skip financial modeling</span>
              </label>
            </div>
          </div>

          {!financialModel.isSkipped && (
            <div>
              {/* Financial Inputs Comparison Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: '2rem' }}>
                {/* Current Spend Card */}
                <div style={{ background: '#FFF1F2', border: '1px solid #FECDD3', borderRadius: 16, padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#9F1239' }}>Current Annual Spend</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#9F1239' }}>
                      {financialModel.currency}{financialSummary.currentAnnual.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {financialModel.currentAnnualCosts.map(f => (
                      <div key={f.id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#881337', marginBottom: 4 }}>
                          <span>{f.label}</span>
                          <strong>{financialModel.currency}{f.value.toLocaleString('en-IN')}</strong>
                        </div>
                        <input
                          type="number"
                          className="input-number"
                          value={f.value}
                          onChange={(e) => updateCostField('currentAnnualCosts', f.id, Number(e.target.value) || 0)}
                          style={{ borderColor: '#FDA4AF' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Proposed Spend Card */}
                <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 16, padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#166534' }}>Proposed Infrastructure Spend</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#166534' }}>
                      {financialModel.currency}{financialSummary.proposedAnnual.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {financialModel.proposedAnnualCosts.map(f => (
                      <div key={f.id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#14532D', marginBottom: 4 }}>
                          <span>{f.label}</span>
                          {f.isUnknown ? (
                            <span style={{ color: '#D97706', fontWeight: 700 }}>Custom Quote</span>
                          ) : (
                            <strong>{financialModel.currency}{f.value.toLocaleString('en-IN')}</strong>
                          )}
                        </div>
                        {f.isUnknown ? (
                          <div style={{ padding: '8px 12px', borderRadius: 8, background: '#FFFFFF', border: '1px dashed #F59E0B', fontSize: '0.75rem', color: '#B45309' }}>
                            IOMETE software license requires vendor quote based on cluster size.
                          </div>
                        ) : (
                          <input
                            type="number"
                            className="input-number"
                            value={f.value}
                            onChange={(e) => updateCostField('proposedAnnualCosts', f.id, Number(e.target.value) || 0)}
                            style={{ borderColor: '#86EFAC' }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Visual Comparative Spend Bar Chart Illustration */}
              {financialSummary.currentAnnual > 0 && (
                <div style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: 16,
                  padding: '1.25rem 1.5rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                      VISUAL COST COMPARISON
                    </div>
                    {financialSummary.annualSavings > 0 && (
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#059669',
                        background: '#ECFDF5',
                        border: '1px solid #A7F3D0',
                        padding: '2px 8px',
                        borderRadius: 999
                      }}>
                        ~{Math.round((financialSummary.annualSavings / financialSummary.currentAnnual) * 100)}% Lower Infrastructure Cost
                      </span>
                    )}
                  </div>

                  {/* Comparative Visual Bars */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {/* Current Spend Bar */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#9F1239', fontWeight: 600, marginBottom: 4 }}>
                        <span>Current Stack (Warehouse SaaS &amp; Egress)</span>
                        <span>{financialModel.currency}{financialSummary.currentAnnual.toLocaleString('en-IN')}</span>
                      </div>
                      <div style={{ height: 16, background: '#FFE4E6', borderRadius: 8, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: '100%', background: 'linear-gradient(90deg, #F43F5E 0%, #E11D48 100%)', borderRadius: 8 }} />
                      </div>
                    </div>

                    {/* Proposed Spend Bar */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#166534', fontWeight: 600, marginBottom: 4 }}>
                        <span>Proposed IOMETE on Kubernetes</span>
                        <span>{financialModel.currency}{financialSummary.proposedAnnual.toLocaleString('en-IN')}</span>
                      </div>
                      <div style={{ height: 16, background: '#DCFCE7', borderRadius: 8, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${Math.min(100, Math.max(10, Math.round((financialSummary.proposedAnnual / financialSummary.currentAnnual) * 100)))}%`,
                          background: 'linear-gradient(90deg, #10B981 0%, #059669 100%)',
                          borderRadius: 8,
                          transition: 'width 0.4s ease'
                        }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Net Year-1 Savings Visual Bar */}
              <div style={{
                background: '#FAF9F6',
                border: '1px solid #E2E8F0',
                borderRadius: 14,
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 20
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                    ESTIMATED ANNUAL INFRASTRUCTURE SAVINGS
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: financialSummary.annualSavings > 0 ? '#059669' : '#DC2626' }}>
                    {financialSummary.annualSavings > 0 ? '+' : ''}{financialModel.currency}{financialSummary.annualSavings.toLocaleString('en-IN')} / yr
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#64748B' }}>
                    {financialSummary.breakEvenNote}
                  </div>
                </div>

                <div style={{ maxWidth: 440, fontSize: '0.75rem', color: '#64748B', borderLeft: '3px solid #CBD5E1', paddingLeft: 12 }}>
                  <strong>Commercial Transparency:</strong> IOMETE eliminates cloud warehouse compute markups. Total TCO depends on internal Kubernetes operational capacity and negotiated software license pricing.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section B: Stakeholder Perspectives View */}
        <div
          className="card"
          style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: 20,
            padding: '2rem',
            marginBottom: '2.5rem',
          }}
        >
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              STAKEHOLDER EVALUATION PERSPECTIVES
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0F172A' }}>
              How the buying committee views the decision
            </h3>
          </div>

          {/* Stakeholder Selector Tabs */}
          <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid #E2E8F0', paddingBottom: 12, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {stakeholders.map(s => {
              const isActive = activeExec === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveExec(s.id)}
                  style={{
                    border: 'none',
                    background: isActive ? `${s.color}18` : 'transparent',
                    color: isActive ? s.color : '#64748B',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.875rem',
                    padding: '8px 16px',
                    borderRadius: 10,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
                  <span>{s.name}</span>
                </button>
              );
            })}
          </div>

          {/* Active Stakeholder Deep Dive Panel */}
          <motion.div
            key={currentExec.id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}
          >
            {/* Left: What IOMETE addresses & Concerns */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: 14, border: '1px solid #E2E8F0' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>
                  Top Concerns for {currentExec.name}
                </h4>
                <ul style={{ paddingLeft: 18, fontSize: '0.8125rem', color: '#475569', lineHeight: 1.6 }}>
                  {currentExec.concerns.map((c, i) => (
                    <li key={i} style={{ marginBottom: 4 }}>{c}</li>
                  ))}
                </ul>
              </div>

              <div style={{ background: '#F0FDF4', padding: '1.25rem', borderRadius: 14, border: '1px solid #BBF7D0' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#166534', marginBottom: 8 }}>
                  ✓ What IOMETE Addresses (Documented)
                </h4>
                <ul style={{ paddingLeft: 18, fontSize: '0.8125rem', color: '#14532D', lineHeight: 1.6 }}>
                  {currentExec.addresses.map((a, i) => (
                    <li key={i} style={{ marginBottom: 4 }}>{a}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: Limitations & Tough Committee Question */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: '#FEF3C7', padding: '1.25rem', borderRadius: 14, border: '1px solid #FDE68A' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#92400E', marginBottom: 8 }}>
                  ⚠️ What IOMETE Does NOT Solve (Real Limitations)
                </h4>
                <ul style={{ paddingLeft: 18, fontSize: '0.8125rem', color: '#78350F', lineHeight: 1.6 }}>
                  {currentExec.limitations.map((l, i) => (
                    <li key={i} style={{ marginBottom: 4 }}>{l}</li>
                  ))}
                </ul>
              </div>

              <div style={{ background: '#EEF2FF', padding: '1.25rem', borderRadius: 14, border: '1px solid #C7D2FE' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#4338CA', marginBottom: 6 }}>
                  Tough Question to Prepare For in Committee
                </h4>
                <p style={{ fontSize: '0.875rem', color: '#312E81', fontStyle: 'italic', lineHeight: 1.5 }}>
                  "{currentExec.question}"
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Section C: "What still needs to be checked" */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h3 style={{ fontSize: '1.375rem', fontWeight: 600, color: '#0F172A', marginBottom: 4 }}>
                What still needs to be checked
              </h3>
              <p style={{ fontSize: '0.9375rem', color: '#64748B' }}>
                Mark questions as Resolved, Needs Answer, or Blocking. Blocking items automatically update your final recommendation.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['all', 'security', 'operations', 'deployment', 'costs'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedQuestionCategory(cat)}
                  style={{
                    border: '1px solid #CBD5E1',
                    background: selectedQuestionCategory === cat ? '#4F46E5' : '#FFFFFF',
                    color: selectedQuestionCategory === cat ? '#FFFFFF' : '#475569',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '4px 10px',
                    borderRadius: 999,
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Questions Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20 }}>
            {filteredQuestions.map((q, index) => {
              const currentDisposition: QuestionDisposition = questionDispositions[q.id] || 'unreviewed';

              return (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, scale: 0.93 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.07 }}
                  className="card"
                  style={{
                    background: '#FFFFFF',
                    border: currentDisposition === 'blocking'
                      ? '1.5px solid #DC2626'
                      : currentDisposition === 'resolved'
                      ? '1.5px solid #059669'
                      : '1px solid #E2E8F0',
                    padding: '1.25rem',
                    borderRadius: 14,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.04em' }}>
                        {q.category}
                      </span>
                      <span className={`evidence-badge evidence-badge--${q.evidenceState}`}>
                        {q.evidenceState}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#0F172A', marginBottom: 6 }}>
                      {q.question}
                    </h4>

                    <p style={{ fontSize: '0.8125rem', color: '#475569', lineHeight: 1.5, marginBottom: 12 }}>
                      {q.suggestedAnswer}
                    </p>

                    <div style={{ fontSize: '0.6875rem', color: '#64748B', fontStyle: 'italic', marginBottom: 12 }}>
                      Source note: {q.sourceNote}
                    </div>
                  </div>

                  {/* Disposition Buttons */}
                  <div style={{ display: 'flex', gap: 6, borderTop: '1px solid #F1F5F9', paddingTop: 10 }}>
                    <button
                      onClick={() => setQuestionDisposition(q.id, 'resolved')}
                      style={{
                        flex: 1,
                        border: '1px solid #BBF7D0',
                        background: currentDisposition === 'resolved' ? '#059669' : '#F0FDF4',
                        color: currentDisposition === 'resolved' ? '#FFFFFF' : '#166534',
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        padding: '6px 4px',
                        borderRadius: 6,
                        cursor: 'pointer'
                      }}
                    >
                      ✓ Resolved
                    </button>
                    <button
                      onClick={() => setQuestionDisposition(q.id, 'needs_answer')}
                      style={{
                        flex: 1,
                        border: '1px solid #FDE68A',
                        background: currentDisposition === 'needs_answer' ? '#D97706' : '#FEF3C7',
                        color: currentDisposition === 'needs_answer' ? '#FFFFFF' : '#92400E',
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        padding: '6px 4px',
                        borderRadius: 6,
                        cursor: 'pointer'
                      }}
                    >
                      ? Needs Answer
                    </button>
                    <button
                      onClick={() => setQuestionDisposition(q.id, 'blocking')}
                      style={{
                        flex: 1,
                        border: '1px solid #FECDD3',
                        background: currentDisposition === 'blocking' ? '#DC2626' : '#FFF1F2',
                        color: currentDisposition === 'blocking' ? '#FFFFFF' : '#9F1239',
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        padding: '6px 4px',
                        borderRadius: 6,
                        cursor: 'pointer'
                      }}
                    >
                      ⚠️ Blocking
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Continue to Chapter 5 */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onContinue}
            className="btn btn--primary"
            style={{ fontSize: '0.9375rem', padding: '0.75rem 1.5rem', borderRadius: 12 }}
          >
            <span>Next: Decide What Comes Next</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
