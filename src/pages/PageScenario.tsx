import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AURELIA_CAPITAL_SCENARIO } from '../data/aureliaScenario';
import { useSession } from '../context/SessionContext';
import { BookOpen, CheckCircle2, AlertTriangle, ArrowRight, Sparkles, Users, Target, Shield } from 'lucide-react';
import { PageNav } from '../components/PageNav';

interface PageScenarioProps {
  onApplyScenario?: () => void;
}

export function PageScenario({ onApplyScenario }: PageScenarioProps) {
  const { loadAureliaScenario, state } = useSession();
  const navigate = useNavigate();
  const [selectedDomainCode, setSelectedDomainCode] = useState<string>('MKT-DATA');

  const activeDomain =
    AURELIA_CAPITAL_SCENARIO.domains.find(d => d.code === selectedDomainCode) ||
    AURELIA_CAPITAL_SCENARIO.domains[0];

  const handleApply = () => {
    loadAureliaScenario();
    navigate('/problem');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onApplyScenario?.();
  };

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <main style={{ paddingTop: 64, minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Hero Banner — light indigo tint */}
      <div style={{
        background: 'linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 50%, #EDE9FE 100%)',
        padding: '4rem 0 3.5rem',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid #C7D2FE',
      }}>
        {/* Subtle background glow */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(circle at 30% 50%, rgba(99, 102, 241, 0.08) 0%, transparent 65%)',
        }} />

        <div className="container container--wide" style={{ position: 'relative', zIndex: 1 }}>
          {/* Fiction badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px',
            borderRadius: 999, background: '#EDE9FE', border: '1px solid #DDD6FE',
            marginBottom: '1.5rem',
          }}>
            <BookOpen size={13} color="#7C3AED" />
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#7C3AED', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Fictional Case Study · For Illustration Only
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: '#0F172A',
            marginBottom: '0.75rem',
            lineHeight: 1.2,
          }}>
            {AURELIA_CAPITAL_SCENARIO.organizationName}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#FFFFFF', borderRadius: 10,
              padding: '8px 14px', border: '1px solid #E2E8F0',
              boxShadow: '0 2px 6px rgba(15,23,42,0.04)',
            }}>
              <Users size={15} color="#64748B" />
              <div>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>
                  {AURELIA_CAPITAL_SCENARIO.leadPersona.name}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748B', marginLeft: 8 }}>
                  {AURELIA_CAPITAL_SCENARIO.leadPersona.title}
                </span>
              </div>
            </div>

            {state.isScenarioLoaded && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px',
                background: '#ECFDF5', border: '1px solid #A7F3D0',
                borderRadius: 8, fontSize: '0.75rem', fontWeight: 600, color: '#059669',
              }}>
                <CheckCircle2 size={13} />
                <span>Scenario active in Navigator</span>
              </div>
            )}
          </div>

          <p style={{
            fontSize: '1.0625rem', color: '#475569', lineHeight: 1.65, maxWidth: 700,
            fontStyle: 'italic',
          }}>
            "{AURELIA_CAPITAL_SCENARIO.leadPersona.brief}"
          </p>
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        className="container container--wide"
        variants={containerVariants}
        initial="hidden"
        animate="show"
        style={{ padding: '3rem 0 4rem' }}
      >
        {/* Context Summary */}
        <motion.div variants={itemVariants} style={{
          background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16,
          padding: '1.75rem', marginBottom: '2.5rem',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
        }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748B', marginBottom: 8 }}>
            Situation Overview
          </div>
          <p style={{ fontSize: '0.9375rem', color: '#334155', lineHeight: 1.65 }}>
            {AURELIA_CAPITAL_SCENARIO.contextSummary}
          </p>
        </motion.div>

        {/* Domain Explorer */}
        <motion.div variants={itemVariants} style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>
                Explore Disconnected Data Domains
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#64748B' }}>
                Each domain has a documented failure incident and fragmented ownership.
              </p>
            </div>
          </div>

          {/* Domain Tabs */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            {AURELIA_CAPITAL_SCENARIO.domains.map(domain => {
              const isActive = domain.code === selectedDomainCode;
              return (
                <button
                  key={domain.code}
                  onClick={() => setSelectedDomainCode(domain.code)}
                  style={{
                    padding: '7px 14px', borderRadius: 8,
                    background: isActive ? '#4F46E5' : '#FFFFFF',
                    border: `1.5px solid ${isActive ? '#4F46E5' : '#E2E8F0'}`,
                    color: isActive ? '#FFFFFF' : '#475569',
                    fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 600,
                    cursor: 'pointer', transition: 'all 0.15s ease',
                  }}
                >
                  {domain.code}
                </button>
              );
            })}
          </div>

          {/* Active Domain Card */}
          <motion.div
            key={activeDomain.code}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16,
              padding: '1.75rem', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>
                  {activeDomain.name}
                </h3>
                <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>
                  Owned by: <strong style={{ color: '#334155' }}>{activeDomain.systemOwner}</strong>
                </span>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {activeDomain.metrics.map(m => (
                  <span key={m.label} style={{
                    fontSize: '0.75rem', padding: '3px 10px',
                    background: '#EEF2FF', border: '1px solid #C7D2FE',
                    borderRadius: 6, color: '#4F46E5', fontWeight: 600,
                  }}>
                    {m.label}: <strong>{m.value}</strong>
                  </span>
                ))}
              </div>
            </div>

            <p style={{ fontSize: '0.9375rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              {activeDomain.problemSummary}
            </p>

            {/* Flow: Upstream → Domain → Downstream */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: '1.25rem' }}>
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, padding: '0.875rem' }}>
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', marginBottom: 6 }}>
                  Upstream Sources
                </div>
                {activeDomain.upstream.map((u, i) => (
                  <div key={i} style={{ fontSize: '0.8125rem', color: '#334155', padding: '3px 0', borderBottom: i < activeDomain.upstream.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                    {u}
                  </div>
                ))}
              </div>
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, padding: '0.875rem' }}>
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', marginBottom: 6 }}>
                  Downstream Consumers
                </div>
                {activeDomain.downstream.map((d, i) => (
                  <div key={i} style={{ fontSize: '0.8125rem', color: '#334155', padding: '3px 0', borderBottom: i < activeDomain.downstream.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                    {d}
                  </div>
                ))}
              </div>
            </div>

            {/* Failure Incident */}
            <div style={{
              padding: '0.875rem 1.125rem', background: '#FEF2F2',
              border: '1px solid #FECDD3', borderRadius: 10,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <AlertTriangle size={13} color="#B91C1C" />
                <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: '#B91C1C' }}>
                  Historical Failure Incident
                </span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: '#991B1B', lineHeight: 1.55, margin: 0 }}>
                {activeDomain.failureIncident}
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Desired Outcome + IOMETE Fit */}
        <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          <div style={{
            background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 16, padding: '1.5rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '0.75rem' }}>
              <Target size={16} color="#059669" />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#059669', letterSpacing: '0.04em' }}>
                Aurelia's Desired Outcome
              </span>
            </div>
            <p style={{ fontSize: '0.9375rem', color: '#14532D', lineHeight: 1.6 }}>
              {AURELIA_CAPITAL_SCENARIO.desiredOutcome}
            </p>
          </div>

          <div style={{
            background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: 16, padding: '1.5rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '0.75rem' }}>
              <Shield size={16} color="#7C3AED" />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#7C3AED', letterSpacing: '0.04em' }}>
                IOMETE Assessment Summary
              </span>
            </div>
            <p style={{ fontSize: '0.9375rem', color: '#5B21B6', lineHeight: 1.6 }}>
              {AURELIA_CAPITAL_SCENARIO.iometeFitSummary}
            </p>
          </div>
        </motion.div>

        {/* PoC Checklist */}
        <motion.div variants={itemVariants} style={{
          background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16,
          padding: '1.75rem', marginBottom: '3rem',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.06em', marginBottom: '1rem' }}>
            What Aurelia Validated in Their PoC Plan
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {AURELIA_CAPITAL_SCENARIO.pocChecklist.map((item, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: 6, background: '#F0FDF4',
                  border: '1px solid #BBF7D0', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexShrink: 0, marginTop: 1,
                }}>
                  <CheckCircle2 size={13} color="#059669" />
                </div>
                <span style={{ fontSize: '0.9375rem', color: '#334155', lineHeight: 1.55 }}>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* CTA to apply scenario */}
        <motion.div variants={itemVariants} style={{
          background: 'linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 100%)',
          borderRadius: 20, padding: '2.5rem', textAlign: 'center',
          border: '1px solid #C7D2FE',
          boxShadow: '0 8px 24px rgba(79, 70, 229, 0.08)',
          marginBottom: '2rem',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px',
            borderRadius: 999, background: '#EDE9FE', border: '1px solid #DDD6FE',
            marginBottom: '1rem',
          }}>
            <Sparkles size={13} color="#7C3AED" />
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Try It Yourself
            </span>
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem' }}>
            Pre-fill the Navigator with Aurelia's data
          </h3>
          <p style={{ fontSize: '0.9375rem', color: '#475569', marginBottom: '1.75rem', maxWidth: 480, margin: '0 auto 1.75rem' }}>
            Load Aurelia Capital's challenges, outcomes, and financial assumptions into the IOMETE Buyer Navigator to walk through the full evaluation journey.
          </p>
          <button
            onClick={handleApply}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: '#4F46E5', border: 'none', borderRadius: 12,
              padding: '14px 28px', fontSize: '1rem', fontWeight: 600,
              color: '#FFFFFF', cursor: 'pointer', transition: 'all 0.2s ease',
              boxShadow: '0 6px 20px rgba(79, 70, 229, 0.3)',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#4338CA'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#4F46E5'; }}
          >
            <Sparkles size={18} />
            <span>Load Aurelia Capital Scenario</span>
            <ArrowRight size={18} />
          </button>
          {state.isScenarioLoaded && (
            <div style={{ marginTop: '1rem', fontSize: '0.8125rem', color: '#059669', display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
              <CheckCircle2 size={14} />
              <span>Scenario is already active in the Navigator</span>
            </div>
          )}
        </motion.div>
      </motion.div>

      <PageNav
        prev={{ label: 'Plan the Next Step', route: '/plan' }}
      />
    </main>
  );
}

