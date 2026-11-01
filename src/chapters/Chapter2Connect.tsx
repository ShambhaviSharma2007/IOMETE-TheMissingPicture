import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '../context/SessionContext';
import { DESIRED_OUTCOMES } from '../data/generalContent';
import type { OutcomePriority, DeploymentConstraint } from '../types';
import {
  Server,
  Database,
  ShieldCheck,
  Cpu,
  BarChart2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Sliders,
  Layers,
  ShieldAlert,
  Zap,
  Lock,
  Boxes
} from 'lucide-react';

interface Chapter2ConnectProps {
  onContinue: () => void;
}

export function Chapter2Connect({ onContinue }: Chapter2ConnectProps) {
  const { state, toggleOutcome, setOutcomePriority, setDeploymentConstraint } = useSession();
  const [activeStage, setActiveStage] = useState<number>(2);

  const stages = [
    {
      id: 1,
      title: '1. Ingestion & Connectors',
      icon: Database,
      short: 'Batch, CDC & Streaming',
      detail: 'Stream or batch raw data directly into your private cloud object storage. Open connectors ingest from Kafka, relational DBs, SaaS APIs, and cloud buckets without vendor lock-in.',
      benefit: 'No proprietary file formats; zero data leaves your VPC.'
    },
    {
      id: 2,
      title: '2. Open Storage (Iceberg)',
      icon: Server,
      short: 'Apache Iceberg ACID Tables',
      detail: 'Data is organized in open-standard Apache Iceberg format on Parquet. Guarantees safe atomic writes, snapshot rollbacks (time-travel), and in-place schema changes without breaking queries.',
      benefit: 'Total freedom from proprietary warehouse lock-in.'
    },
    {
      id: 3,
      title: '3. Elastic Compute (Spark)',
      icon: Cpu,
      short: 'Decoupled Spark SQL Clusters',
      detail: 'Spin up dedicated or shared Apache Spark SQL clusters per team or workload. Compute scales dynamically on Kubernetes and pauses when idle to avoid runaway costs.',
      benefit: 'No compute markups; pay cloud provider wholesale instance rates.'
    },
    {
      id: 4,
      title: '4. Sovereign Governance',
      icon: ShieldCheck,
      short: 'Apache Ranger RBAC & RLS',
      detail: 'Centralized access controls enforce fine-grained role-based security, row-level filtering, and column-level masking across all data assets without data duplication.',
      benefit: 'Satisfies enterprise CISO, audit, and SOC2 perimeter policies.'
    },
    {
      id: 5,
      title: '5. Consumption & BI',
      icon: BarChart2,
      short: 'Dashboards, ML & SQL',
      detail: 'Connect standard BI tools (PowerBI, Tableau, Superset) via high-speed JDBC/ODBC. Data scientists query raw Parquet tables directly in Python/Jupyter without ETL delays.',
      benefit: 'One golden source of truth for analysts, executives, and models.'
    }
  ];

  return (
    <section id="chapter-2" className="chapter-section chapter-section--lavender">
      {/* Background radial glow — light version */}
      <div style={{
        position: 'absolute',
        top: -150,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 1200,
        height: 700,
        background: 'radial-gradient(circle at 50% 25%, rgba(99, 102, 241, 0.08) 0%, rgba(124, 58, 237, 0.04) 45%, transparent 75%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div className="container container--wide" style={{ position: 'relative', zIndex: 1 }}>
        
        {/* Chapter Header */}
        <div className="chapter-header">
          <div className="chapter-pill">
            <span>Chapter 02</span>
            <span>·</span>
            <span>The Solution</span>
          </div>
          <h2 className="chapter-title">How IOMETE solves the problem</h2>
          <p className="chapter-subtitle">
            A unified open lakehouse architecture running 100% inside your Kubernetes perimeter, decoupling compute from storage with zero vendor markups.
          </p>
        </div>

        {/* ─── ILLUSTRATION 1: The Transformation Flowchart (Before vs. After) ──── */}
        <div
          className="card"
          style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: 24,
            padding: '2.25rem',
            marginBottom: '2.5rem',
            boxShadow: '0 4px 20px -4px rgba(79, 70, 229, 0.08)',
          }}
        >
          <div style={{ marginBottom: '1.75rem', maxWidth: 740 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284C7', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
              VISUAL TRANSFORMATION
            </div>
            <h3 style={{ fontSize: '1.375rem', fontWeight: 600, color: '#0F172A' }}>
              The Architectural Shift: Point-to-Point Chaos vs. Open Lakehouse
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.5 }}>
              Here is how IOMETE transforms scattered data pipelines into a single sovereign engine.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: '2rem' }}>
            
            {/* The Broken Loop (The Problem) */}
            <div style={{
              background: 'rgba(239, 68, 68, 0.04)',
              border: '1.5px dashed rgba(220, 38, 38, 0.3)',
              borderRadius: 18,
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, background: 'rgba(239, 68, 68, 0.12)', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8125rem'
                  }}>
                    ✕
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#DC2626' }}>
                      The Fragile Loop (Before)
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: '#DC2626', opacity: 0.75 }}>
                      Isolated silos, broken scripts &amp; compute markups
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(220, 38, 38, 0.15)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#DC2626' }}>1. Fragmented Databases</div>
                    <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>Data trapped across Postgres, S3, APIs with contradictory schemas.</div>
                  </div>

                  <div style={{ textAlign: 'center', color: '#DC2626', fontSize: '0.75rem', fontWeight: 700 }}>
                    ↓ <em>Brittle custom ETL breaks on schema updates</em>
                  </div>

                  <div style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(220, 38, 38, 0.15)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#DC2626' }}>2. Expensive SaaS Warehouses</div>
                    <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>3x to 5x compute markups + steep cloud data egress penalties.</div>
                  </div>

                  <div style={{ textAlign: 'center', color: '#DC2626', fontSize: '0.75rem', fontWeight: 700 }}>
                    ↓ <em>Stale numbers &amp; overnight batch latency</em>
                  </div>

                  <div style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(220, 38, 38, 0.15)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#DC2626' }}>3. Conflicting Executive Reports</div>
                    <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>Teams argue over mismatched numbers and outdated CSV exports.</div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 16, padding: '8px 12px', borderRadius: 8, background: 'rgba(239, 68, 68, 0.07)', fontSize: '0.6875rem', color: '#DC2626', fontWeight: 600 }}>
                Outcome: Runaway bills, slow decisions, and constant manual triage.
              </div>
            </div>

            {/* The IOMETE Solution */}
            <div style={{
              background: 'rgba(5, 150, 105, 0.04)',
              border: '1.5px solid rgba(5, 150, 105, 0.3)',
              borderRadius: 18,
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 4px 16px rgba(5, 150, 105, 0.06)'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, background: 'rgba(5, 150, 105, 0.15)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.875rem'
                  }}>
                    ✓
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#059669' }}>
                      The IOMETE Solution (The Open Lakehouse)
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: '#059669', opacity: 0.8 }}>
                      Apache Iceberg + Spark running in your VPC
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ background: '#FFFFFF', padding: '12px 14px', borderRadius: 10, border: '1px solid rgba(5, 150, 105, 0.2)', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: 6, background: '#EEF2FF', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', flexShrink: 0
                    }}>
                      1
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A' }}>
                        Store Once in Apache Iceberg (Zero Lock-in)
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: '#64748B', lineHeight: 1.4 }}>
                        Data lands directly in your S3/ADLS/MinIO buckets as open ACID Parquet tables. Safe rollbacks via time-travel snapshots.
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', color: '#059669', fontSize: '0.75rem', fontWeight: 700 }}>
                    ↓ <em>Decoupled on-demand Spark compute clusters</em>
                  </div>

                  <div style={{ background: '#FFFFFF', padding: '12px 14px', borderRadius: 10, border: '1px solid rgba(5, 150, 105, 0.2)', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: 6, background: '#EEF2FF', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', flexShrink: 0
                    }}>
                      2
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A' }}>
                        Run in Your Kubernetes VPC (Zero Markup)
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: '#64748B', lineHeight: 1.4 }}>
                        Pay cloud provider directly for VM instances at wholesale rates. Clusters auto-scale and suspend when idle, cutting bills by 60–80%.
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', color: '#059669', fontSize: '0.75rem', fontWeight: 700 }}>
                    ↓ <em>Direct SQL &amp; BI connection with Apache Ranger RBAC</em>
                  </div>

                  <div style={{ background: '#FFFFFF', padding: '12px 14px', borderRadius: 10, border: '1px solid rgba(5, 150, 105, 0.2)', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: 6, background: '#EEF2FF', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', flexShrink: 0
                    }}>
                      3
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A' }}>
                        Single Golden Source for BI &amp; AI
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: '#64748B', lineHeight: 1.4 }}>
                        Connect PowerBI, Tableau, Superset, and Jupyter directly via JDBC/ODBC. Customer data never leaves your enterprise boundary.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 16, padding: '8px 12px', borderRadius: 8, background: 'rgba(5, 150, 105, 0.08)', fontSize: '0.6875rem', color: '#059669', fontWeight: 600 }}>
                Outcome: Predictable wholesale costs, full data sovereignty, and instant query performance.
              </div>
            </div>
          </div>

          {/* ─── ILLUSTRATION 2: The 3 Core Pillars Strip ──────────────── */}
          <div style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: 16,
            padding: '1.25rem 1.75rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 20,
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10, background: 'rgba(99, 102, 241, 0.1)', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #C7D2FE'
              }}>
                <Boxes size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A' }}>Zero Lock-in</div>
                <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>Apache Iceberg open tables</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10, background: 'rgba(5, 150, 105, 0.1)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #A7F3D0'
              }}>
                <Zap size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A' }}>Zero Markup</div>
                <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>Wholesale VM compute rates</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10, background: 'rgba(2, 132, 199, 0.1)', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #BAE6FD'
              }}>
                <Lock size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A' }}>Zero Exfiltration</div>
                <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>Self-hosted in customer VPC</div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── ILLUSTRATION 3: Visual Interactive Platform Flowchart ───────────── */}
        <div
          className="card"
          style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: 24,
            padding: '2rem',
            marginBottom: '2.5rem',
            boxShadow: '0 4px 20px -4px rgba(79, 70, 229, 0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                ARCHITECTURE FLOWCHART
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0F172A' }}>
                How data moves through the IOMETE Lakehouse
              </h3>
            </div>
            <div style={{ fontSize: '0.8125rem', color: '#64748B' }}>
              Click any stage to inspect the technical mechanism
            </div>
          </div>

          {/* Flowchart Horizontal Sequence */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: '1.5rem' }}>
            {stages.map((st, index) => {
              const Icon = st.icon;
              const isSelected = activeStage === st.id;
              return (
                <motion.div
                  key={st.id}
                  initial={{ opacity: 0, scale: 0.93 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.07 }}
                  whileTap={{ rotateY: 8, scale: 0.97 }}
                  whileHover={{ y: -4, boxShadow: '0 12px 28px rgba(79,70,229,0.12)' }}
                  onClick={() => setActiveStage(st.id)}
                  style={{
                    background: isSelected ? '#EEF2FF' : '#F8FAFC',
                    border: `1.5px solid ${isSelected ? '#6366F1' : '#E2E8F0'}`,
                    borderRadius: 16,
                    padding: '1.125rem 1rem',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s ease, background 0.2s ease',
                    boxShadow: isSelected ? '0 8px 24px rgba(99, 102, 241, 0.15)' : 'none',
                    textAlign: 'center'
                  }}
                >
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: isSelected ? '#EEF2FF' : '#FFFFFF',
                    color: isSelected ? '#4F46E5' : '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 10px',
                    border: `1px solid ${isSelected ? '#6366F1' : '#E2E8F0'}`
                  }}>
                    <Icon size={20} />
                  </div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: isSelected ? '#0F172A' : '#334155', marginBottom: 2 }}>
                    {st.title}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: isSelected ? '#475569' : '#64748B' }}>
                    {st.short}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Active Stage Detail Panel */}
          {(() => {
            const current = stages.find(s => s.id === activeStage) || stages[1];
            return (
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: '#F0F4FF',
                  border: '1px solid #C7D2FE',
                  borderRadius: 16,
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 20,
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ maxWidth: 720 }}>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#0F172A', marginBottom: 4 }}>
                    {current.title}: {current.short}
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.5, marginBottom: 8 }}>
                    {current.detail}
                  </p>
                  <div style={{ fontSize: '0.8125rem', color: '#059669', fontWeight: 600 }}>
                    ✓ Key Buyer Advantage: {current.benefit}
                  </div>
                </div>

                <div style={{
                  padding: '8px 14px',
                  borderRadius: 10,
                  background: '#EEF2FF',
                  border: '1px solid #C7D2FE',
                  fontSize: '0.75rem',
                  color: '#4F46E5',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6
                }}>
                  <Sparkles size={14} color="#4F46E5" />
                  <span>Verified Architecture</span>
                </div>
              </motion.div>
            );
          })()}
        </div>

        {/* ─── Desired Outcomes Selector (\"What you need from the solution\") ──── */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h3 style={{ fontSize: '1.375rem', fontWeight: 600, color: '#0F172A', marginBottom: 6 }}>
                What do you need from the solution?
              </h3>
              <p style={{ fontSize: '0.9375rem', color: '#475569' }}>
                Select your target outcomes. In Chapter 3, we'll map these directly to verified IOMETE capabilities.
              </p>
            </div>

            {/* Deployment Constraint Selector */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#F8FAFC',
              padding: '6px 12px',
              borderRadius: 10,
              border: '1px solid #E2E8F0'
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>Deployment:</span>
              <select
                value={state.deploymentConstraint}
                onChange={(e) => setDeploymentConstraint(e.target.value as DeploymentConstraint)}
                style={{
                  border: 'none',
                  background: '#FFFFFF',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#4F46E5',
                  padding: '4px 8px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  outline: 'none',
                  borderBottom: '1px solid #4F46E5'
                }}
              >
                <option value="private-cloud">Private Cloud / Customer VPC (AWS/Azure/GCP)</option>
                <option value="on-prem">On-Premises Kubernetes</option>
                <option value="public-cloud-tenant">Multi-Tenant Cloud</option>
                <option value="flexible">Flexible / Hybrid</option>
              </select>
            </div>
          </div>

          {/* Outcome Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
            {DESIRED_OUTCOMES.map((out, index) => {
              const isSelected = state.selectedOutcomes.includes(out.id);
              const priority = state.outcomePriorities[out.id] || 'must-have';

              return (
                <motion.div
                  key={out.id}
                  initial={{ opacity: 0, scale: 0.93 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.07 }}
                  whileHover={{ y: -4, boxShadow: '0 12px 28px rgba(79,70,229,0.12)' }}
                  className={`card card--interactive ${isSelected ? 'card--active' : ''}`}
                  style={{
                    background: isSelected ? '#FAFAFF' : '#FFFFFF',
                    border: `1.5px solid ${isSelected ? '#818CF8' : '#E2E8F0'}`,
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: isSelected ? '0 8px 24px rgba(99, 102, 241, 0.12)' : 'none'
                  }}
                >
                  <div onClick={() => toggleOutcome(out.id)}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#0F172A' }}>
                          {out.title}
                        </h4>
                      </div>
                      <div style={{
                        width: 20,
                        height: 20,
                        borderRadius: 6,
                        border: `1.5px solid ${isSelected ? '#818CF8' : '#CBD5E1'}`,
                        background: isSelected ? '#4F46E5' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                        flexShrink: 0
                      }}>
                        {isSelected && <CheckCircle2 size={14} />}
                      </div>
                    </div>

                    <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5, marginBottom: 12 }}>
                      {out.description}
                    </p>

                    <div style={{
                      padding: '6px 10px',
                      borderRadius: 8,
                      background: '#F0F4FF',
                      border: '1px solid #C7D2FE',
                      fontSize: '0.75rem',
                      color: '#475569',
                      marginBottom: 12
                    }}>
                      <strong style={{ color: '#0F172A' }}>Goal: </strong>
                      {out.plainGoal}
                    </div>
                  </div>

                  {/* Priority Toggle when selected */}
                  {isSelected && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid #E2E8F0',
                      paddingTop: 10,
                      marginTop: 4
                    }}>
                      <span style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 500 }}>
                        Priority level:
                      </span>
                      <div style={{ display: 'inline-flex', gap: 4 }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOutcomePriority(out.id, 'must-have');
                          }}
                          style={{
                            border: 'none',
                            background: priority === 'must-have' ? '#EEF2FF' : '#F8FAFC',
                            color: priority === 'must-have' ? '#4F46E5' : '#64748B',
                            fontWeight: priority === 'must-have' ? 700 : 500,
                            fontSize: '0.6875rem',
                            padding: '3px 8px',
                            borderRadius: 6,
                            cursor: 'pointer'
                          }}
                        >
                          Must-Have
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOutcomePriority(out.id, 'nice-to-have');
                          }}
                          style={{
                            border: 'none',
                            background: priority === 'nice-to-have' ? '#EEF2FF' : '#F8FAFC',
                            color: priority === 'nice-to-have' ? '#4F46E5' : '#64748B',
                            fontWeight: priority === 'nice-to-have' ? 700 : 500,
                            fontSize: '0.6875rem',
                            padding: '3px 8px',
                            borderRadius: 6,
                            cursor: 'pointer'
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
        </div>

        {/* Continue Next Step */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
          <button
            onClick={onContinue}
            className="btn btn--primary"
            style={{
              fontSize: '0.9375rem',
              padding: '0.75rem 1.5rem',
              borderRadius: 12,
              background: '#4F46E5',
              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)'
            }}
          >
            <span>Next: Explore the Fit</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
