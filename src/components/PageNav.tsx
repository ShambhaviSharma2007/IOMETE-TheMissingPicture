import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface PageNavProps {
  prev?: { label: string; route: string };
  next?: { label: string; route: string };
}

export function PageNav({ prev, next }: PageNavProps) {
  const navigate = useNavigate();

  const handleNav = (route: string) => {
    navigate(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{
      padding: '2rem 0',
      borderTop: '1px solid #E2E8F0',
      background: '#FFFFFF',
    }}>
      <div className="container container--wide">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: prev && next ? 'space-between' : prev ? 'flex-start' : 'flex-end',
          gap: 16,
          flexWrap: 'wrap',
        }}>
          {prev && (
            <button
              onClick={() => handleNav(prev.route)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                borderRadius: 10,
                padding: '10px 18px',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#CBD5E1';
                (e.currentTarget as HTMLButtonElement).style.color = '#0F172A';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#E2E8F0';
                (e.currentTarget as HTMLButtonElement).style.color = '#475569';
              }}
            >
              <ArrowLeft size={15} />
              <span>{prev.label}</span>
            </button>
          )}

          {next && (
            <button
              onClick={() => handleNav(next.route)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#4F46E5',
                border: 'none',
                borderRadius: 10,
                padding: '10px 18px',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = '#4338CA';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = '#4F46E5';
              }}
            >
              <span>{next.label}</span>
              <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

