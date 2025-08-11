import React from 'react';

interface SummaryCardProps {
  title: string;
  value: string;
  description: string;
  link: string;
  icon: string;
  color: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, description, link, icon, color }) => (
  <a className="summary-card glassmorphism" href={link} style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '1.5rem',
    borderRadius: '18px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
    background: 'rgba(40,40,60,0.7)',
    border: `1.5px solid ${color}30`,
    textDecoration: 'none',
    transition: 'box-shadow 0.2s',
    color: 'inherit',
    position: 'relative',
    overflow: 'hidden',
    minHeight: '140px',
    marginBottom: '0.5rem'
  }}>
    <div style={{ fontSize: '2rem', marginBottom: '0.5rem', color }}>{icon}</div>
    <div className="summary-value" style={{ fontWeight: 700, fontSize: '1.6rem', marginBottom: '0.25rem', color }}>{value}</div>
    <div className="summary-desc" style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.85)', marginBottom: '0.25rem' }}>{description}</div>
    <div style={{ fontSize: '0.95rem', color: color, marginTop: 'auto', fontWeight: 500, textDecoration: 'underline', letterSpacing: '0.01em' }}>{title}</div>
  </a>
);

export default SummaryCard;
