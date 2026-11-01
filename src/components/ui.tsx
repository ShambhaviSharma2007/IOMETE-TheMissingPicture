import React from 'react';
import type { EvidenceState } from '../types';

interface EvidenceBadgeProps {
  state: EvidenceState;
  showDot?: boolean;
}

const LABELS: Record<EvidenceState, string> = {
  supported: '✓ Supported',
  assumed:   '~ Assumed',
  unknown:   '? Unknown',
};

export function EvidenceBadge({ state, showDot = false }: EvidenceBadgeProps) {
  return (
    <span className={`evidence-badge evidence-badge--${state}`}>
      {showDot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />}
      {LABELS[state]}
    </span>
  );
}

interface MayaVoiceProps {
  text: string;
}

export function MayaVoice({ text }: MayaVoiceProps) {
  return (
    <div className="maya-voice">
      <div className="maya-voice__avatar">MS</div>
      <div className="maya-voice__body">
        <div className="maya-voice__name">Maya Sharma · Director, Data Platforms</div>
        <p className="maya-voice__text">"{text}"</p>
      </div>
    </div>
  );
}

interface CoverageBarProps {
  supported: number;
  assumed: number;
  unknown: number;
}

export function CoverageBar({ supported, assumed, unknown }: CoverageBarProps) {
  const total = supported + assumed + unknown;
  if (total === 0) return null;

  const pct = (n: number) => `${((n / total) * 100).toFixed(1)}%`;

  return (
    <div className="coverage-meter">
      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', flexShrink: 0 }}>Coverage</span>
      <div className="coverage-meter__bar">
        <div className="coverage-meter__segment--supported" style={{ width: pct(supported) }} />
        <div className="coverage-meter__segment--assumed"   style={{ width: pct(assumed) }} />
        <div className="coverage-meter__segment--unknown"   style={{ width: pct(unknown) }} />
      </div>
      <div className="coverage-meter__legend">
        <div className="coverage-legend-item">
          <div className="coverage-legend-item__dot" style={{ background: 'var(--evidence-supported)' }} />
          <span style={{ color: 'var(--evidence-supported)' }}>{supported}</span>
        </div>
        <div className="coverage-legend-item">
          <div className="coverage-legend-item__dot" style={{ background: 'var(--evidence-assumed)' }} />
          <span style={{ color: 'var(--evidence-assumed)' }}>{assumed}</span>
        </div>
        <div className="coverage-legend-item">
          <div className="coverage-legend-item__dot" style={{ background: 'var(--evidence-unknown)' }} />
          <span style={{ color: 'var(--evidence-unknown)' }}>{unknown}</span>
        </div>
      </div>
    </div>
  );
}

interface SceneHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
}

export function SceneHeader({ eyebrow, title, subtitle }: SceneHeaderProps) {
  return (
    <div className="scene__header">
      <p className="scene__eyebrow">{eyebrow}</p>
      <h1 className="scene__title text-display">{title}</h1>
      {subtitle && <p className="scene__subtitle">{subtitle}</p>}
    </div>
  );
}

