import React from 'react';
import { Droplets, Activity, Layers, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  backendOnline: boolean;
  aiMode: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  backendOnline,
  aiMode
}) => {
  const navItems = [
    { id: 'landing', label: 'Overview', icon: Droplets },
    { id: 'tester', label: 'Water Diagnostics', icon: Activity },
    { id: 'dashboard', label: 'Executive Dashboard', icon: Layers },
    { id: 'batch', label: 'Batch Screening', icon: FileText },
    { id: 'science', label: 'Science & SDGs', icon: CheckCircle2 },
  ];

  return (
    <header className="glass-panel" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4.5rem' }}>
        
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('landing')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', cursor: 'pointer' }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)'
          }}>
            <Droplets size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em', color: '#ffffff' }}>AquaSafe</span>
              <span style={{ fontWeight: 800, fontSize: '1.25rem', color: '#06b6d4' }}>AI</span>
              <span className="badge badge-sdg" style={{ fontSize: '0.65rem' }}>SDG 6 & 3</span>
            </div>
            <p style={{ fontSize: '0.7rem', color: '#94a3b8', margin: 0 }}>IBM SkillsBuild AI Prototype</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 0.875rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: isActive ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid transparent',
                  background: isActive ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                  color: isActive ? '#38bdf8' : '#94a3b8',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Backend Status indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.75rem',
            borderRadius: '9999px',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(51, 65, 85, 0.6)',
            fontSize: '0.75rem'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: backendOnline ? '#10b981' : '#ef4444',
              boxShadow: backendOnline ? '0 0 8px #10b981' : '0 0 8px #ef4444'
            }} />
            <span style={{ color: backendOnline ? '#cbd5e1' : '#f87171', fontWeight: 500 }}>
              {backendOnline ? 'API Online' : 'Backend Offline'}
            </span>
          </div>

          <span className="badge" style={{
            background: 'rgba(30, 41, 59, 0.7)',
            color: '#94a3b8',
            border: '1px solid rgba(71, 85, 105, 0.5)',
            fontSize: '0.65rem'
          }}>
            {aiMode}
          </span>
        </div>

      </div>
    </header>
  );
};
