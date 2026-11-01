import React from 'react';
import { motion } from 'framer-motion';
import { useSession, computeRecommendation, computeFinancialSummary } from '../context/SessionContext';
import { SETUP_CHALLENGES, DESIRED_OUTCOMES, IOMETE_CAPABILITIES, EVALUATION_QUESTIONS } from '../data/generalContent';
import { SceneHeader, EvidenceBadge } from '../components/ui';

function SectionDivider({ title }: { title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '2rem 0 1rem' }}>
      <div style={{ height: 1, flex: 1, background: 'var(--border-subtle)' }} />
      <span style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', flexShrink: 0 }}>
        {title}
      </span>
      <div style={{ height: 1, flex: 1, background: 'var(--border-subtle)' }} />
    </div>
  );
}

export function Step8FinalReport() {
  const { state, goToStep, setUserNotes } = useSession();

  const recommendation = computeRecommendation(state);
  const financialSummary = computeFinancialSummary(state.financialModel);
  const currency = state.financialModel.currency || '₹';

  // Selected Challenges objects
  const userChallenges = SETUP_CHALLENGES.filter(c => state.selectedChallenges.includes(c.id));

  // Selected Outcomes objects
  const userOutcomes = DESIRED_OUTCOMES.filter(o => state.selectedOutcomes.includes(o.id));

  // Mapped Capabilities
  const relevantCapabilityIds = new Set<string>();
  userOutcomes.forEach(o => o.mapsToCapabilityIds.forEach(id => relevantCapabilityIds.add(id)));
  const mappedCaps = IOMETE_CAPABILITIES.filter(c => relevantCapabilityIds.has(c.id));

  const supportedCaps = mappedCaps.filter(c => c.evidenceState === 'supported');
  const assumedCaps = mappedCaps.filter(c => c.evidenceState === 'assumed');
  const unknownCaps = mappedCaps.filter(c => c.evidenceState === 'unknown');

  // Blocking questions & Questions needing answer
  const blockingQuestions = EVALUATION_QUESTIONS.filter(q => state.questionDispositions[q.id] === 'blocking');
  const needsAnswerQuestions = EVALUATION_QUESTIONS.filter(q => state.questionDispositions[q.id] === 'needs_answer');

  const reportDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const generateMarkdownReport = () => {
    return `# IOMETE Platform Evaluation Report
**Date:** ${reportDate}
**Status:** Evaluation Draft
${state.isScenarioLoaded ? `**Context Preset:** ${state.activeScenarioName}` : ''}

---

## 1. Executive Recommendation
### ${recommendation.headline}
${recommendation.rationale}

**Next Step:** ${recommendation.actionSummary}

${state.userNotes ? `\n**Evaluator Note:**\n> ${state.userNotes}\n` : ''}

---

## 2. Current Setup & Challenges
${userChallenges.length > 0
  ? userChallenges.map(c => `- **${c.title}:** ${c.description}`).join('\n')
  : '- General architecture exploration (no specific challenges tagged).'}

${state.setupDescription ? `\n**Environment Overview:**\n${state.setupDescription}\n` : ''}

---

## 3. Desired Outcomes & Constraints
- **Residency Constraint:** ${state.deploymentConstraint}
${userOutcomes.map(o => `- **${o.title}** [${state.outcomePriorities[o.id] || 'must-have'}]: ${o.description}`).join('\n')}

---

## 4. Platform Fit & Evidence Breakdown
- **Supported (Direct Documentation):** ${supportedCaps.length}
- **Assumed (Architectural Inference):** ${assumedCaps.length}
- **Unknown (Requires Vendor Confirmation):** ${unknownCaps.length}

### Key Verified Capabilities:
${supportedCaps.map(c => `- **${c.name}:** ${c.plainSummary} *(Source: ${c.evidenceSource.title})*`).join('\n')}

${unknownCaps.length > 0 ? `### Items Requiring Vendor Validation:\n${unknownCaps.map(c => `- **${c.name}:** ${c.plainSummary} — Confirmation needed: ${c.confirmationNeeded}`).join('\n')}\n` : ''}

---

## 5. Financial Summary
${financialSummary.isSkipped
  ? '*Financial estimates were skipped for this evaluation.*'
  : `- **Current Annual Baseline:** ${currency}${financialSummary.currentAnnual.toLocaleString()}
- **Estimated Platform Operating Costs:** ${currency}${financialSummary.proposedAnnual.toLocaleString()} *(excluding IOMETE software licence quote)*
- **Estimated Annual Operating Delta:** ${currency}${financialSummary.annualSavings.toLocaleString()}
- **One-Time Implementation & PoC Budget:** ${currency}${financialSummary.implementationOneTime.toLocaleString()}
- **Year-1 Net Position:** ${currency}${financialSummary.year1Net.toLocaleString()}
- **Break-Even Note:** ${financialSummary.breakEvenNote}`}

---

## 6. Critical Questions & Dispositions
- **Blocking Concerns (${blockingQuestions.length}):**
${blockingQuestions.length > 0 ? blockingQuestions.map(q => `  - **${q.question}** — ${q.suggestedAnswer}`).join('\n') : '  - None recorded.'}

- **Items Needing Vendor Clarification (${needsAnswerQuestions.length}):**
${needsAnswerQuestions.length > 0 ? needsAnswerQuestions.map(q => `  - ${q.question}`).join('\n') : '  - None recorded.'}

---

## 7. Recommended Evaluation Milestones
${state.customPlanItems.map((item, i) => `${i + 1}. **${item.title}** (Lead: ${item.ownerRole})
   - *Test:* ${item.whatToTest}
   - *Success Criteria:* ${item.successCriteria}`).join('\n\n')}

---
*Report generated by IOMETE Buyer Navigator. All documented claims verified against public IOMETE technical specifications. Evidence states (Supported, Assumed, Unknown) strictly maintained.*
`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMarkdownReport())
      .then(() => alert('Evaluation report copied to clipboard as Markdown!'))
      .catch(() => alert('Could not access clipboard. Please use browser print.'));
  };

  const handlePrint = () => window.print();

  const recColor =
    recommendation.status === 'proceed_to_poc'
      ? 'var(--evidence-supported)'
      : recommendation.status === 'proceed_with_conditions'
      ? 'var(--evidence-assumed)'
      : '#F87171';

  const recBg =
    recommendation.status === 'proceed_to_poc'
      ? 'var(--evidence-supported-dim)'
      : recommendation.status === 'proceed_with_conditions'
      ? 'var(--evidence-assumed-dim)'
      : 'rgba(248, 113, 113, 0.1)';

  return (
    <div className="scene">
      <div className="scene__content">
        <div className="scene-enter">
          <SceneHeader
            eyebrow="Step 8 of 8 · Final Evaluation Report"
            title="Your tailored IOMETE evaluation pack"
            subtitle="Synthesized directly from your selected challenges, requirements, classified questions, and financial inputs. Print, copy to markdown, or use as an executive briefing document."
          />
        </div>

        {/* Actions Bar */}
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
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Assessment compiled on {reportDate}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn--ghost btn--sm" onClick={handleCopy}>
              ↗ Copy Markdown
            </button>
            <button className="btn btn--primary btn--sm" onClick={handlePrint}>
              ⎙ Print / Save as PDF
            </button>
          </div>
        </div>

        {/* Formatted Report Card */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          marginBottom: '2rem',
        }}>
          {/* Document Header */}
          <div style={{
            padding: '2.5rem 2.5rem 2rem',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'linear-gradient(180deg, rgba(59,130,246,0.04) 0%, transparent 100%)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>
                  Data Platform Technology Assessment
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.85rem', color: 'var(--text-primary)', marginBottom: 6 }}>
                  IOMETE Evaluation Pack
                </h2>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  Evaluator Briefing · Compiled on {reportDate}
                </div>
              </div>

              {state.isScenarioLoaded && (
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.6875rem', padding: '3px 10px', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: 999, color: 'var(--evidence-assumed)', fontWeight: 600 }}>
                    ★ Fictional Scenario Active
                  </span>
                </div>
              )}
            </div>

            {/* Recommendation Banner */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: '1.25rem 1.5rem',
                background: recBg,
                border: `1.5px solid ${recColor}44`,
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: recColor, marginBottom: 4 }}>
                {recommendation.headline}
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: 6 }}>
                {recommendation.rationale}
              </p>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                <strong>Recommended Next Step:</strong> {recommendation.actionSummary}
              </div>
            </motion.div>
          </div>

          {/* Document Content */}
          <div style={{ padding: '2rem 2.5rem' }}>
            {/* Evaluator Notes */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div className="text-label" style={{ marginBottom: 6 }}>Evaluator Notes / Context</div>
              <textarea
                value={state.userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                placeholder="Add any internal team context, committee notes, or evaluation deadlines..."
                rows={2}
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
              />
            </div>

            <SectionDivider title="1. Current Challenges & Setup" />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem', marginBottom: 12 }}>
              {userChallenges.map(c => (
                <div key={c.id} style={{ padding: '0.75rem 1rem', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{c.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>{c.description}</div>
                </div>
              ))}
            </div>

            {state.setupDescription && (
              <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', marginBottom: 16 }}>
                <div className="text-label" style={{ marginBottom: 2 }}>Environment Overview:</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>"{state.setupDescription}"</div>
              </div>
            )}

            <SectionDivider title="2. Desired Outcomes & Constraints" />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0.75rem', marginBottom: 12 }}>
              {userOutcomes.map(o => (
                <div key={o.id} style={{ padding: '0.75rem 1rem', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{o.title}</span>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--accent)', textTransform: 'uppercase', fontWeight: 600 }}>{state.outcomePriorities[o.id] || 'must-have'}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{o.plainGoal}</div>
                </div>
              ))}
            </div>

            <SectionDivider title="3. IOMETE Capability Fit & Evidence" />

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.75rem',
              marginBottom: 16,
              textAlign: 'center',
            }}>
              <div style={{ padding: '0.875rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--evidence-supported)' }}>
                  {supportedCaps.length}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Supported (Documented)</div>
              </div>

              <div style={{ padding: '0.875rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--evidence-assumed)' }}>
                  {assumedCaps.length}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Assumed (Inferred)</div>
              </div>

              <div style={{ padding: '0.875rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(107, 114, 128, 0.25)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--evidence-unknown)' }}>
                  {unknownCaps.length}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Unknown (To Validate)</div>
              </div>
            </div>

            {/* Key Gaps List */}
            {unknownCaps.length > 0 && (
              <div style={{ padding: '0.875rem 1rem', background: 'var(--evidence-unknown-dim)', border: '1px solid rgba(107, 114, 128, 0.3)', borderRadius: 'var(--radius-md)', marginBottom: 16 }}>
                <div className="text-label" style={{ marginBottom: 4, color: 'var(--evidence-unknown)' }}>Gaps & Items Requiring PoC Confirmation</div>
                {unknownCaps.map(c => (
                  <div key={c.id} style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
                    • <strong>{c.name}:</strong> {c.confirmationNeeded}
                  </div>
                ))}
              </div>
            )}

            <SectionDivider title="4. Financial Estimates & Economics" />

            {financialSummary.isSkipped ? (
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: 16 }}>
                Financial modeling was skipped for this evaluation.
              </p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: 16 }}>
                <div style={{ padding: '0.875rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Annual Operating Baseline</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {currency}{financialSummary.currentAnnual.toLocaleString()}
                  </div>
                </div>

                <div style={{ padding: '0.875rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Proposed Run Cost (excl. licence)</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.15rem', fontWeight: 600, color: 'var(--accent)' }}>
                    {currency}{financialSummary.proposedAnnual.toLocaleString()}
                  </div>
                </div>

                <div style={{ padding: '0.875rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Year-1 Net Benefit</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.15rem', fontWeight: 600, color: financialSummary.year1Net > 0 ? 'var(--evidence-supported)' : '#F87171' }}>
                    {financialSummary.year1Net > 0 ? '+' : ''}{currency}{financialSummary.year1Net.toLocaleString()}
                  </div>
                </div>
              </div>
            )}

            <SectionDivider title="5. Proof-of-Concept Action Plan" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {state.customPlanItems.map((item, idx) => (
                <div key={item.id} style={{ padding: '0.75rem 1rem', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {idx + 1}. {item.title}
                    </span>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--accent)' }}>{item.ownerRole}</span>
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    {item.whatToTest}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--evidence-supported)', marginTop: 4 }}>
                    <strong>Success Criteria:</strong> {item.successCriteria}
                  </div>
                </div>
              ))}
            </div>

            {/* Document Footer Disclaimer */}
            <div style={{ marginTop: '2.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              All documented platform capabilities are verified against public technical documentation. Unverified claims remain classified as Unknown. All financial figures are user-entered estimates. No proprietary vendor features or fixed prices are invented.
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="btn btn--ghost btn--sm" onClick={() => goToStep(7)}>
            ← Back to Evaluation Plan
          </button>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn--ghost btn--sm" onClick={handleCopy}>
              ↗ Copy Markdown
            </button>
            <button className="btn btn--primary btn--sm" onClick={handlePrint}>
              ⎙ Print / Save as PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
