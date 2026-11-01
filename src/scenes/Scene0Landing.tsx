import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSession } from '../context/SessionContext';

// ─── Particle Field ───────────────────────────────────────────────────────────

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialise particles
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connection lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${p.opacity})`;
        ctx.fill();
        // Update position
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" />;
}

// ─── Floating Data Node (background) ─────────────────────────────────────────

function FloatingNode({ label, x, y, delay }: { label: string; x: string; y: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 0.25, scale: 1 }}
      transition={{ delay, duration: 1.2, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        padding: '6px 12px',
        background: 'rgba(59, 130, 246, 0.06)',
        border: '1px solid rgba(59, 130, 246, 0.15)',
        borderRadius: '6px',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.6875rem',
        color: 'var(--accent)',
        letterSpacing: '0.08em',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      {label}
    </motion.div>
  );
}

// ─── Main Landing Scene ───────────────────────────────────────────────────────

export function Scene0Landing() {
  const { navigate } = useSession();

  const bgNodes = [
    { label: 'MKT-DATA', x: '8%',  y: '20%', delay: 0.5 },
    { label: 'TRADE-REC', x: '75%', y: '15%', delay: 0.8 },
    { label: 'PORTFOLIO', x: '85%', y: '55%', delay: 1.1 },
    { label: 'REF-DATA',  x: '70%', y: '80%', delay: 1.4 },
    { label: 'RISK-CALC', x: '12%', y: '70%', delay: 0.6 },
    { label: 'REPORTING', x: '20%', y: '88%', delay: 1.0 },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <ParticleField />

      {/* Background floating nodes */}
      {bgNodes.map(n => (
        <FloatingNode key={n.label} {...n} />
      ))}

      {/* Background radial gradient */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(59, 130, 246, 0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Central content */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: 600, padding: '2rem' }}>

        {/* Institution tag */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: '2rem',
            padding: '4px 14px',
            background: 'rgba(59, 130, 246, 0.08)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '999px',
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--accent)', letterSpacing: '0.1em' }}>
            AURELIA CAPITAL · INTERNAL REVIEW
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.9 }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            color: 'var(--text-primary)',
            lineHeight: 1.1,
            marginBottom: '1.5rem',
            letterSpacing: '-0.02em',
          }}
        >
          The data platform<br />
          <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>picture is missing.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          style={{
            fontSize: '1.0625rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            marginBottom: '2.5rem',
          }}
        >
          Maya Sharma has 90 days to evaluate whether IOMETE can unify
          Aurelia Capital's fragmented data landscape — before the committee
          decides.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <button
            className="btn btn--primary btn--lg animate-pulse-glow"
            onClick={() => navigate(1)}
            style={{ fontSize: '1rem', letterSpacing: '0.02em' }}
          >
            Begin the Investigation
            <span style={{ marginLeft: 4, opacity: 0.8 }}>→</span>
          </button>
        </motion.div>

        {/* Maya's name card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0, duration: 1.0 }}
          style={{
            marginTop: '3rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            padding: '12px 20px',
            background: 'rgba(13, 16, 23, 0.8)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
          }}
        >
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent), #7C3AED)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.75rem', fontWeight: 700, color: 'white',
            flexShrink: 0,
          }}>MS</div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Maya Sharma
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Director, Data Platforms · Aurelia Capital
            </div>
          </div>
          <div style={{ marginLeft: 16, width: 1, height: 30, background: 'var(--border-subtle)' }} />
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'left' }}>
            <div style={{ color: 'var(--evidence-unknown)', fontWeight: 500 }}>Day 1 of 90</div>
            <div>Platform evaluation</div>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 2.5, duration: 1.0 }}
          style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '2rem', lineHeight: 1.5 }}
        >
          All banking data is fictional. IOMETE capabilities reflect documented features only.<br />
          Evidence states — Supported, Assumed, Unknown — are applied throughout.
        </motion.p>
      </div>
    </div>
  );
}

