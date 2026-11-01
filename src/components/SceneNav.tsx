import React, { useState } from 'react';
import { useSession } from '../context/SessionContext';
import { ExampleScenarioModal } from './ExampleScenarioModal';

const STEPS = [
  { step: 1, label: 'Welcome' },
  { step: 2, label: 'Current Setup' },
  { step: 3, label: 'Needs & Outcomes' },
  { step: 4, label: 'Platform Fit' },
  { step: 5, label: 'Costs & Effort' },
  { step: 6, label: 'Key Questions' },
  { step: 7, label: 'PoC Plan' },
  { step: 8, label: 'Evaluation Report' },
];

export function SceneNav() {
  const { state, goToStep, resetAssessment } = useSession();
  const [showScenarioModal, setShowScenarioModal] = useState<boolean>(false);
  const { currentStep, completedSteps, isScenarioLoaded } = state;

  const handleStepClick = (s: number) => {
    goToStep(s);
  };

  const handleReset = () => {
    if (window.confirm('Reset assessment? All selections and financial inputs will be cleared.')) {
      resetAssessment();
    }
  };

  // Missing picture progress calculation
  const totalWeight = 100;
  const progressRatio = Math.min(100, Math.round(
    (state.selectedChallenges.length > 0 ? 15 : 0) +
    (state.selectedOutcomes.length * 5) +
    (Object.keys(state.questionDispositions).length * 8) +
    (state.currentStep >= 5 ? 15 : 0) +
    (state.currentStep >= 7 ? 20 : 0)
  ));

  return (
    <>
      <nav className="scene-nav">
        {/* Brand / Logo */}
        <div
          className="scene-nav__brand"
          onClick={() => goToStep(1)}
          style={{ cursor: 'pointer' }}
          title="Return to Welcome"
        >
          <span className="scene-nav__logo">IOMETE</span>
          <div className="scene-nav__divider" />
          <span className="scene-nav__context">Buyer Navigator</span>
        </div>

        {/* 8-Step Navigation Tracker */}
        <div className="scene-nav__steps">
          {STEPS.map((item, idx) => {
            const isActive = item.step === currentStep;
            const isCompleted = completedSteps.has(item.step) || item.step < currentStep;

            return (
              <React.Fragment key={item.step}>
                {idx > 0 && <div className="scene-step__connector" />}
                <div
                  className={`scene-step ${isActive ? 'scene-step--active' : ''} ${isCompleted ? 'scene-step--complete' : ''}`}
                  onClick={() => handleStepClick(item.step)}
                  title={item.label}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="scene-step__dot" />
                  <span style={{
                    fontSize: '0.6875rem',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'var(--text-primary)' : isCompleted ? 'var(--text-secondary)' : 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                  }}>
                    {item.step}. {item.label}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Right actions: Scenario Walker + Missing Picture HUD + Reset */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto' }}>
          {/* Missing Picture HUD */}
          <div
            title={`The Missing Picture: ${progressRatio}% clear`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '3px 8px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: progressRatio > 75 ? 'var(--evidence-supported)' : 'var(--accent)', boxShadow: '0 0 6px var(--accent-glow)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
              {progressRatio}% Picture
            </span>
          </div>

          {/* Example Scenario Quick Toggle */}
          <button
            onClick={() => setShowScenarioModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              background: isScenarioLoaded ? 'rgba(245, 158, 11, 0.12)' : 'var(--bg-card)',
              border: `1px solid ${isScenarioLoaded ? 'rgba(245, 158, 11, 0.3)' : 'var(--border-default)'}`,
              color: isScenarioLoaded ? 'var(--evidence-assumed)' : 'var(--text-secondary)',
              fontSize: '0.6875rem',
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'var(--font-ui)',
            }}
            title="Open Aurelia Capital investment banking scenario"
          >
            <span>★</span>
            <span>{isScenarioLoaded ? 'Scenario Active' : 'Example Scenario'}</span>
          </button>

          <button className="scene-nav__reset" onClick={handleReset} title="Reset assessment">
            ↺ Reset
          </button>
        </div>
      </nav>

      {/* Example Walkthrough Modal */}
      <ExampleScenarioModal
        isOpen={showScenarioModal}
        onClose={() => setShowScenarioModal(false)}
      />
    </>
  );
}
