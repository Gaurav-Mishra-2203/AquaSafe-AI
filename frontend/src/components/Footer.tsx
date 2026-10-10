import React from 'react';
import { Droplets, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{ borderTop: '1px solid rgba(51, 65, 85, 0.5)', background: 'rgba(15, 23, 42, 0.9)', padding: '2.5rem 0', color: '#94a3b8', fontSize: '0.85rem' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
            width: '1.75rem',
            height: '1.75rem',
            borderRadius: '0.4rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Droplets size={14} color="#ffffff" />
          </div>
          <span style={{ fontWeight: 700, color: '#f8fafc' }}>AquaSafe AI</span>
          <span>&mdash; IBM SkillsBuild Internship Project</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <span className="badge badge-sdg" style={{ fontSize: '0.65rem' }}>UN SDG 6</span>
          <span className="badge badge-safe" style={{ fontSize: '0.65rem' }}>UN SDG 3</span>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Developed for Global Water Security</span>
        </div>
      </div>
    </footer>
  );
};
