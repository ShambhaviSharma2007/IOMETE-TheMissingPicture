import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSession } from '../context/SessionContext';
import { EXECUTIVES } from '../data/content';
import { EvidenceBadge, SceneHeader, MayaVoice } from '../components/ui';
import type { Executive, ExecutiveId, ExecutiveStance } from '../types';

const EXEC_COLORS: Record<ExecutiveId, string> = {
  cfo:  '#A78BFA',
  ciso: '#F87171',
  cto:  '#34D399',
  cro:  '#FBBF24',
};

const STANCE_CONFIG: Record<ExecutiveStance, { label: string; color: string; bg: string }> = {
  supportive: { label: '↑ Likely supportive', color: 'var(--evidence-supported)', bg: 'var(--evidence-supported-dim)' },
  neutral:    { label: '→ Neutral',            color: 'var(--evidence-assumed)',   bg: 'var(--evidence-assumed-dim)'   },
  concerned:  { label: '↓ Concerned',          color: '#F87171',                  bg: 'rgba(248,113,113,0.08)'         },
  unset:      { label: 'Record stance',        color: 'var(--text-muted)',         bg: 'transparent'                   },
};

function ExecutiveCard({ exec, stance, annotation, onStance, onAnnotate, isActive, onActivate }:{
  exec: Executive;
  stance: ExecutiveStance;
  annotation: string;
  onStance: (s: ExecutiveStance) => void;
  onAnnotate: (a: string) => void;
  isActive: boolean;
  onActivate: () => void;
}) {
  const color = EXEC_COLORS[exec.id];
  const stanceConf = STANCE_CONFIG[stance];

  return (
    <motion.div
      layout
      style={{
        background: 'var(--bg-card)',
        border: `1px solid ${isActive ? color + '55' : stance !== 'unset' ? stanceConf.color + '33' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        transition: 'border-color 0.2s ease',
        boxShadow: isActive ? `0 0 24px ${color}15` : 'none',
      }}
    >
      {/* Chair / header */}
      <div
        onClick={onActivate}
        style={{
          padding: '1.5rem',
          cursor: 'pointer',
          display: 'flex', alignItems: 'flex-start', gap: '1rem',
          background: isActive ? `${color}08` : 'transparent',
          transition: 'background 0.2s',
        }}
      >
        {/* Avatar */}
        <div style={{
          width: 44, height: 44,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${color}44, ${color}22)`,
          border: `2px solid ${color}44`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.875rem', fontWeight: 700, color,
          flexShrink: 0,
        }}>
          {exec.name.split(' ').map(n => n[0]).join('')}
        </div>

        {/* Identity */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
            {exec.name}
          </div>
          <div style={{ fontSize: '0.75rem', color, marginBottom: 6 }}>{exec.title}</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
            {exec.tagline}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
          {stance !== 'unset' && (
            <span style={{
              fontSize: '0.6875rem', fontWeight: 600, padding: '3px 10px', borderRadius: '999px',
              background: stanceConf.bg, color: stanceConf.color,
              border: `1px solid ${stanceConf.color}44`,
            }}>
              {stanceConf.label}
            </span>
          )}
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', transform: isActive ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', display: 'inline-block' }}>▾</span>
        </div>
      </div>

      {/* Expanded view */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ borderTop: '1px solid var(--border-subtle)', padding: '1.5rem' }}
        >
          {/* Concerns */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div className="text-label" style={{ marginBottom: '0.625rem', color: '#F87171' }}>Concerns</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {exec.concerns.map((c, i) => (
                <li key={i} style={{ display: 'flex', gap: 8, fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  <span style={{ color: '#F87171', flexShrink: 0 }}>—</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {/* What IOMETE addresses */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div className="text-label" style={{ marginBottom: '0.625rem', color: 'var(--evidence-supported)' }}>What IOMETE addresses</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {exec.iometeAddresses.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <EvidenceBadge state={item.evidenceState} />
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* What it doesn't */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div className="text-label" style={{ marginBottom: '0.625rem', color: 'var(--evidence-unknown)' }}>What IOMETE does not address</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {exec.iometeDoesNot.map((d, i) => (
                <li key={i} style={{ display: 'flex', gap: 8, fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  <span style={{ color: 'var(--evidence-unknown)', flexShrink: 0 }}>○</span>
                  {d}
                </li>
              ))}
            </ul>
          </div>

          {/* Maya's question for this exec */}
          <div style={{
            padding: '0.875rem 1rem',
            background: `${color}08`,
            border: `1px solid ${color}22`,
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
          }}>
            <div className="text-label" style={{ marginBottom: 6, color: 'var(--text-muted)' }}>Committee question from Maya</div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.6 }}>
              "{exec.committeeQuestion}"
            </p>
          </div>

          {/* Stance buttons */}
          <div style={{ marginBottom: '1rem' }}>
            <div className="text-label" style={{ marginBottom: '0.5rem' }}>Your assessment of their likely stance</div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {(['supportive', 'neutral', 'concerned'] as ExecutiveStance[]).map(s => {
                const conf = STANCE_CONFIG[s];
                const isSelected = stance === s;
                return (
                  <button
                    key={s}
                    onClick={() => onStance(s)}
                    style={{
                      padding: '0.4rem 0.875rem',
                      borderRadius: '999px',
                      border: `1px solid ${isSelected ? conf.color : 'var(--border-default)'}`,
                      background: isSelected ? conf.bg : 'transparent',
                      color: isSelected ? conf.color : 'var(--text-muted)',
                      fontSize: '0.8125rem', fontWeight: isSelected ? 600 : 400,
                      cursor: 'pointer', fontFamily: 'var(--font-ui)',
                      transition: 'all 0.15s',
                    }}
                  >
                    {conf.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <div className="text-label" style={{ marginBottom: '0.5rem' }}>Notes</div>
            <textarea
              value={annotation}
              onChange={(e) => onAnnotate(e.target.value)}
              placeholder="Add your notes on this executive's position..."
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
                resize: 'vertical',
                lineHeight: 1.6,
                outline: 'none',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-default)'}
            />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export function Scene5Committee() {
  const { state, navigate, setExecutiveStance, setExecutiveAnnotation } = useSession();
  const [activeExec, setActiveExec] = useState<ExecutiveId | null>(null);

  const stances = state.executiveStances;
  const supportiveCount = Object.values(stances).filter(s => s === 'supportive').length;
  const concernedCount  = Object.values(stances).filter(s => s === 'concerned').length;
  const neutralCount    = Object.values(stances).filter(s => s === 'neutral').length;
  const recordedCount   = Object.values(stances).filter(s => s !== 'unset').length;

  return (
    <div className="scene">
      <div className="scene__content">
        <div className="scene-enter">
          <SceneHeader
            eyebrow="Scene 5 of 7 · The Committee Review"
            title="The voices in the room"
            subtitle="The investment committee represents four distinct organisational perspectives. Understand each one before building the case."
          />

          <MayaVoice text="The decision isn't mine to make — it's theirs. My job is to ensure they have the right information and honest answers. A platform that passes my technical evaluation but fails the committee is still a failed evaluation." />
        </div>

        {/* Committee readiness summary */}
        {recordedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '2rem',
              padding: '1rem 1.5rem',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '2rem',
              flexWrap: 'wrap',
            }}
          >
            <span className="text-label" style={{ color: 'var(--text-muted)' }}>Committee readiness</span>
            {[
              { label: 'Supportive', count: supportiveCount, color: 'var(--evidence-supported)' },
              { label: 'Neutral',    count: neutralCount,    color: 'var(--evidence-assumed)' },
              { label: 'Concerned',  count: concernedCount,  color: '#F87171' },
            ].map(m => (
              <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: m.color }} />
                <span style={{ fontSize: '0.875rem', color: m.color, fontWeight: 500 }}>{m.count}</span>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{m.label}</span>
              </div>
            ))}

            {concernedCount >= 2 && (
              <span style={{ marginLeft: 'auto', fontSize: '0.8125rem', color: '#F87171' }}>
                ⚠ Multiple concerns — recommendation may be to investigate further
              </span>
            )}
          </motion.div>
        )}

        {/* Executive cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {EXECUTIVES.map((exec, idx) => (
            <motion.div
              key={exec.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <ExecutiveCard
                exec={exec}
                stance={stances[exec.id]}
                annotation={state.executiveAnnotations[exec.id]}
                onStance={(s) => setExecutiveStance(exec.id, s)}
                onAnnotate={(a) => setExecutiveAnnotation(exec.id, a)}
                isActive={activeExec === exec.id}
                onActivate={() => setActiveExec(prev => prev === exec.id ? null : exec.id)}
              />
            </motion.div>
          ))}
        </div>

        {/* Footer nav */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '1rem 1.5rem',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
        }}>
          <button className="btn btn--ghost btn--sm" onClick={() => navigate(4)}>← Back</button>
          <button className="btn btn--primary btn--sm" onClick={() => navigate(6)}>
            Make the case →
          </button>
        </div>
      </div>
    </div>
  );
}

