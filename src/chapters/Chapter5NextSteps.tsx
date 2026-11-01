import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSession, computeRecommendation, computeFinancialSummary } from '../context/SessionContext';
import { SETUP_CHALLENGES, DESIRED_OUTCOMES, IOMETE_CAPABILITIES, EVALUATION_QUESTIONS } from '../data/generalContent';
import type { EvaluationPlanItem } from '../types';
import { Printer, Copy, Check, CheckCircle2, AlertTriangle, AlertCircle, Calendar, Shield, Users, ArrowUpRight, RotateCcw } from 'lucide-react';

export function Chapter5NextSteps() {
  const { state, resetAssessment } = useSession();
  const [copied, setCopied] = useState<boolean>(false);
  const [activeWeek, setActiveWeek] = useState<number>(1);

  const recommendation = computeRecommendation(state);
  const financialSummary = computeFinancialSummary(state.financialModel);

  // PoC Roadmap Timeline Weeks
  const pocRoadmap = [
    {
      week: 1,
      title: 'Week 1: Infrastructure & Security Perimeter',
      focus: 'Deployment inside VPC & Identity Integration',
      tasks: [
        'Deploy IOMETE Helm charts on designated test Kubernetes cluster (EKS/AKS/GKE).',
        'Verify zero data exfiltration: configure network policies and VPC egress boundaries.',
        'Integrate enterprise SAML / Active Directory SSO and assign role-based permissions.'
      ],
      owner: 'Platform & Security Teams',
      exitCriteria: 'Cluster operational within private VPC; SSO functional; zero exfiltration confirmed.'
    },
    {
      week: 2,
      title: 'Week 2: Ingestion & Open Iceberg Tables',
      focus: 'Synthetic Data Load & ACID Transaction Test',
      tasks: [
        'Connect object storage bucket (S3/ADLS) with Iceberg metadata catalog.',
        'Run sample PySpark batch ingestion script converting raw logs to Iceberg tables.',
        'Test ACID transactions, concurrent writes, and schema evolution without breaking views.'
      ],
      owner: 'Data Engineering Lead',
      exitCriteria: 'Test datasets successfully written in Iceberg format with ACID write safety.'
    },
    {
      week: 3,
      title: 'Week 3: Query Benchmarking & Auto-Scaling',
      focus: 'BI Tool Performance & Compute Auto-Pause',
      tasks: [
        'Connect PowerBI / Tableau via standard JDBC/ODBC connector.',
        'Execute representative analytical SQL queries under concurrent simulated user load.',
        'Verify Spark SQL cluster auto-scaling and test automatic cluster suspension when idle.'
      ],
      owner: 'Analytics Lead & DevOps',
      exitCriteria: 'Query SLAs achieved; auto-scaling and auto-pause demonstrated.'
    },
    {
      week: 4,
      title: 'Week 4: Executive Committee Review & Commercials',
      focus: 'Stakeholder Sign-off & Commercial Terms',
      tasks: [
        'Present documented PoC findings to CFO, CISO, and CTO committee.',
        'Obtain formal software license quote from IOMETE based on verified cluster node count.',
        'Finalize production migration roadmap and rollback contingencies.'
      ],
      owner: 'Evaluation Sponsor & Buying Committee',
      exitCriteria: 'All blocking questions resolved; commercial terms agreed; sign-off.'
    }
  ];

  // Copy Executive Summary text
  const handleCopySummary = () => {
    const text = `IOMETE BUYER EVALUATION REPORT
Status: ${recommendation.headline}
Rationale: ${recommendation.rationale}

Target Outcomes:
${state.selectedOutcomes.map(id => `- ${DESIRED_OUTCOMES.find(o => o.id === id)?.title || id}`).join('\n')}

Financial Overview:
- Current Spend: ${state.financialModel.currency}${financialSummary.currentAnnual.toLocaleString('en-IN')}
- Proposed Infrastructure: ${state.financialModel.currency}${financialSummary.proposedAnnual.toLocaleString('en-IN')}
- Net Annual Savings: ${financialSummary.annualSavings > 0 ? '+' : ''}${state.financialModel.currency}${financialSummary.annualSavings.toLocaleString('en-IN')}
- Note: ${financialSummary.breakEvenNote}

Next Action: ${recommendation.actionSummary}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="chapter-5" className="chapter-section chapter-section--surface">
      <div className="container container--wide">
        {/* Header */}
        <div className="chapter-header">
          <div className="chapter-pill">
            <span>Chapter 05</span>
            <span>·</span>
            <span>Decide What Comes Next</span>
          </div>
          <h2 className="chapter-title">Your next steps &amp; evaluation plan</h2>
          <p className="chapter-subtitle">
            Based on your selected challenges, outcomes, and risk assessments, here is your transparent recommendation and structured proof-of-concept roadmap.
          </p>
        </div>

        {/* Section 1: Dynamic Recommendation Banner */}
        <div
          className="card"
          style={{
            background: recommendation.status === 'proceed_to_poc'
              ? 'linear-gradient(135deg, #F0F4FF 0%, #FFFFFF 100%)'
              : recommendation.status === 'proceed_with_conditions'
              ? 'linear-gradient(135deg, #FFFBEB 0%, #FFFFFF 100%)'
              : 'linear-gradient(135deg, #FEF2F2 0%, #FFFFFF 100%)',
            border: recommendation.status === 'proceed_to_poc'
              ? '1.5px solid #C7D2FE'
              : recommendation.status === 'proceed_with_conditions'
              ? '1.5px solid #FDE68A'
              : '1.5px solid #FECDD3',
            borderRadius: 20,
            padding: '2rem',
            marginBottom: '2.5rem',
            boxShadow: '0 8px 24px -4px rgba(79, 70, 229, 0.07)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: recommendation.status === 'proceed_to_poc'
                  ? '#059669'
                  : recommendation.status === 'proceed_with_conditions'
                  ? '#D97706'
                  : '#DC2626',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {recommendation.status === 'proceed_to_poc' && <CheckCircle2 size={24} />}
                {recommendation.status === 'proceed_with_conditions' && <AlertTriangle size={24} />}
                {recommendation.status === 'pause_for_clarification' && <AlertCircle size={24} />}
                {recommendation.status === 'in_progress' && <Calendar size={24} />}
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.06em' }}>
                  DECISION ENGINE RECOMMENDATION
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A' }}>
                  {recommendation.headline}
                </h3>
              </div>
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 12px',
              borderRadius: 999,
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#334155'
            }}>
              <span>Status:</span>
              <strong style={{
                color: recommendation.status === 'proceed_to_poc'
                  ? '#059669'
                  : recommendation.status === 'proceed_with_conditions'
                  ? '#D97706'
                  : '#DC2626'
              }}>
                {recommendation.status.replace(/_/g, ' ').toUpperCase()}
              </strong>
            </div>
          </div>

          <p style={{ fontSize: '1rem', color: '#334155', lineHeight: 1.6, marginBottom: '1.25rem', maxWidth: 860 }}>
            {recommendation.rationale}
          </p>

          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: 12,
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}>
            <strong style={{ fontSize: '0.8125rem', color: '#0F172A' }}>Recommended Action:</strong>
            <span style={{ fontSize: '0.8125rem', color: '#475569' }}>{recommendation.actionSummary}</span>
          </div>
        </div>

        {/* Section 2: Visual PoC Planning Sequence */}
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                VISUAL PROOF-OF-CONCEPT SEQUENCE
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0F172A' }}>
                Structured 4-Week Validation Roadmap
              </h3>
            </div>
            <div style={{ fontSize: '0.8125rem', color: '#64748B' }}>
              Click any week to inspect milestone criteria
            </div>
          </div>

          {/* 4-Week Navigation Pills with stagger zoom-in */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: '1.5rem' }}>
            {pocRoadmap.map((p) => {
              const isSelected = activeWeek === p.week;
              return (
                <motion.div
                  key={p.week}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: p.week * 0.1 }}
                  whileTap={{ rotateY: 8, scale: 0.97 }}
                  whileHover={{ y: -4, boxShadow: '0 12px 28px rgba(79,70,229,0.12)' }}
                  onClick={() => setActiveWeek(p.week)}
                  style={{
                    background: isSelected ? '#EEF2FF' : '#F8FAFC',
                    border: `1.5px solid ${isSelected ? '#4F46E5' : '#E2E8F0'}`,
                    borderRadius: 12,
                    padding: '1rem',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s ease, background 0.15s ease'
                  }}
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: isSelected ? '#4F46E5' : '#64748B', marginBottom: 2 }}>
                    WEEK {p.week}
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>
                    {p.focus}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Active Week Details Card */}
          {(() => {
            const current = pocRoadmap.find(p => p.week === activeWeek) || pocRoadmap[0];
            return (
              <motion.div
                key={current.week}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: '#FAF9F6',
                  border: '1px solid #E2E8F0',
                  borderRadius: 14,
                  padding: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                  <h4 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#0F172A' }}>
                    {current.title}
                  </h4>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#4F46E5', background: '#EEF2FF', padding: '3px 10px', borderRadius: 999 }}>
                    Owner: {current.owner}
                  </span>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: 6 }}>
                    Key Activities:
                  </div>
                  <ul style={{ paddingLeft: 20, fontSize: '0.875rem', color: '#475569', lineHeight: 1.6 }}>
                    {current.tasks.map((t, idx) => (
                      <li key={idx} style={{ marginBottom: 4 }}>{t}</li>
                    ))}
                  </ul>
                </div>

                <div style={{
                  padding: '10px 14px',
                  borderRadius: 8,
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  fontSize: '0.8125rem',
                  color: '#059669',
                  fontWeight: 600
                }}>
                  ✓ Milestone Exit Criteria: {current.exitCriteria}
                </div>
              </motion.div>
            );
          })()}
        </div>

        {/* Section 3: Comprehensive Final Evaluation Report (Printable Card) */}
        <div
          id="evaluation-report"
          className="card"
          style={{
            background: '#FFFFFF',
            border: '2px solid #E2E8F0',
            borderRadius: 24,
            padding: '2.5rem',
            boxShadow: '0 12px 32px -4px rgba(15, 23, 42, 0.06)'
          }}
        >
          {/* Report Top Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#4F46E5', letterSpacing: '0.08em' }}>IOMETE</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: '#EEF2FF', color: '#4F46E5' }}>
                  EVALUATION REPORT
                </span>
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A' }}>
                Executive Evaluation Summary
              </h3>
              <div style={{ fontSize: '0.8125rem', color: '#64748B' }}>
                Generated dynamically from buyer selections · Clean architecture assessment
              </div>
            </div>

            {/* Action Buttons */}
            <div className="no-print" style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={handleCopySummary}
                className="btn btn--secondary"
                style={{ fontSize: '0.8125rem', padding: '6px 14px', borderRadius: 8 }}
              >
                {copied ? <Check size={14} color="#059669" /> : <Copy size={14} />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="btn btn--primary"
                style={{ fontSize: '0.8125rem', padding: '6px 14px', borderRadius: 8 }}
              >
                <Printer size={14} />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>

          {/* Report Content Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: '2rem' }}>
            {/* Target Outcomes */}
            <div style={{ background: '#FAF9F6', padding: '1.25rem', borderRadius: 14, border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: 8 }}>
                Target Outcomes ({state.selectedOutcomes.length})
              </div>
              <ul style={{ paddingLeft: 16, fontSize: '0.8125rem', color: '#334155', lineHeight: 1.6 }}>
                {state.selectedOutcomes.map(id => {
                  const out = DESIRED_OUTCOMES.find(o => o.id === id);
                  return <li key={id}>{out?.title || id}</li>;
                })}
              </ul>
            </div>

            {/* Financial Overview */}
            <div style={{ background: '#FAF9F6', padding: '1.25rem', borderRadius: 14, border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: 8 }}>
                Financial Baseline
              </div>
              {financialSummary.isSkipped ? (
                <div style={{ fontSize: '0.8125rem', color: '#64748B' }}>Financial modeling skipped</div>
              ) : (
                <div style={{ fontSize: '0.8125rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div>Current Annual: <strong>{state.financialModel.currency}{financialSummary.currentAnnual.toLocaleString('en-IN')}</strong></div>
                  <div>Proposed Infra: <strong>{state.financialModel.currency}{financialSummary.proposedAnnual.toLocaleString('en-IN')}</strong></div>
                  <div style={{ color: financialSummary.annualSavings > 0 ? '#059669' : '#DC2626', fontWeight: 700 }}>
                    Estimated Savings: {state.financialModel.currency}{financialSummary.annualSavings.toLocaleString('en-IN')} / yr
                  </div>
                </div>
              )}
            </div>

            {/* Deployment Constraint */}
            <div style={{ background: '#FAF9F6', padding: '1.25rem', borderRadius: 14, border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: 8 }}>
                Deployment Boundary
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#4F46E5', marginBottom: 4 }}>
                {state.deploymentConstraint === 'private-cloud' ? 'Private Cloud / Customer VPC' : state.deploymentConstraint}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                Self-hosted Kubernetes perimeter. Data never leaves customer infrastructure.
              </div>
            </div>
          </div>

          {/* Reset & Clear Footer */}
          <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
              IOMETE Buyer Navigator · Confidential Evaluation Asset
            </div>

            <button
              onClick={() => {
                if (window.confirm('Reset this evaluation session? All inputs will revert to defaults.')) {
                  resetAssessment();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="btn btn--ghost"
              style={{ fontSize: '0.75rem', color: '#64748B' }}
            >
              <RotateCcw size={13} />
              <span>Reset Assessment</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
