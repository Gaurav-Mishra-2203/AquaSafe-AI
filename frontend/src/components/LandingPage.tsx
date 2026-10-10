import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Activity, 
  CheckCircle, 
  ArrowRight, 
  Sparkles, 
  BarChart3, 
  AlertTriangle,
  Globe2,
  HeartPulse,
  Filter
} from 'lucide-react';

interface LandingPageProps {
  onStartDiagnostic: () => void;
  onViewDashboard: () => void;
  onSelectPreset: (presetId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartDiagnostic,
  onViewDashboard,
}) => {
  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <section style={{ padding: '4.5rem 0 3rem 0', textAlign: 'center', position: 'relative' }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <span className="badge badge-sdg">
              <Globe2 size={13} /> UN SDG 6: Clean Water & Sanitation
            </span>
            <span className="badge badge-safe">
              <HeartPulse size={13} /> UN SDG 3: Good Health
            </span>
          </div>

          <h1 style={{ 
            fontSize: '3.25rem', 
            fontWeight: 800, 
            lineHeight: 1.15, 
            letterSpacing: '-0.03em',
            marginBottom: '1.25rem' 
          }}>
            Democratizing <span style={{ 
              background: 'linear-gradient(135deg, #38bdf8 0%, #06b6d4 50%, #10b981 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>WHO-Grade Water Diagnostics</span> with Predictive AI
          </h1>

          <p style={{ 
            fontSize: '1.15rem', 
            color: '#94a3b8', 
            lineHeight: 1.6, 
            marginBottom: '2.5rem',
            maxWidth: '780px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            AquaSafe AI bridges the critical divide between raw physicochemical sensor readings and lifesaving community intervention. Powered by a calibrated 9-parameter Random Forest Classifier and a dual-tier cognitive remediation advisory engine.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button 
              onClick={onStartDiagnostic} 
              className="btn btn-primary glow-cyan"
              style={{ padding: '0.875rem 1.75rem', fontSize: '1rem' }}
            >
              <Activity size={18} /> Run Live Water Diagnostic
            </button>
            <button 
              onClick={onViewDashboard} 
              className="btn btn-secondary"
              style={{ padding: '0.875rem 1.75rem', fontSize: '1rem' }}
            >
              <BarChart3 size={18} /> View Executive Dashboard <ArrowRight size={16} />
            </button>
          </div>

        </div>
      </section>

      {/* Live Science & Validation Stats */}
      <section className="container" style={{ marginTop: '1rem', marginBottom: '3.5rem' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: '1rem' 
        }}>
          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ color: '#06b6d4', fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>3,276</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc', marginTop: '0.25rem' }}>Ground-Truth Samples</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Physicochemical lab benchmarks</div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ color: '#10b981', fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>88.72%</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc', marginTop: '0.25rem' }}>Classification Accuracy</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Held-out 656 test records</div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ color: '#38bdf8', fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>0.9430</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc', marginTop: '0.25rem' }}>ROC-AUC Discriminator</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>High risk sensitivity</div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ color: '#f59e0b', fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>&lt; 80ms</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc', marginTop: '0.25rem' }}>Inference Latency</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Immediate field turnaround</div>
          </div>
        </div>
      </section>

      {/* Why AI is Necessary */}
      <section className="container" style={{ marginBottom: '4rem' }}>
        <div className="glass-panel" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ 
              background: 'rgba(6, 182, 212, 0.15)', 
              padding: '0.5rem', 
              borderRadius: '0.5rem',
              color: '#06b6d4'
            }}>
              <Cpu size={22} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>The Multivariate Problem: Why Static Thresholds Fail</h2>
          </div>

          <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Traditional water safety protocols rely on simple single-parameter checks (e.g., "Is pH &gt; 6.5?"). In real community water chemistry, water toxicity is non-linear and synergistic:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(51, 65, 85, 0.5)', borderRadius: '0.75rem', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f87171', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <AlertTriangle size={16} /> Disinfection Byproduct Synergies
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '0.825rem', lineHeight: 1.5 }}>
                Adding chlorine to water with high dissolved Total Organic Carbon (TOC) forms carcinogenic Trihalomethanes (THMs). A binary chlorine test appears "clean", yet water is chemically hazardous.
              </p>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(51, 65, 85, 0.5)', borderRadius: '0.75rem', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <Filter size={16} /> Turbidity Pathogen Shielding
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '0.825rem', lineHeight: 1.5 }}>
                Elevated turbidity (&gt; 5 NTU) shields bacteria and Cryptosporidium cysts from ultraviolet light and free chlorine disinfectant. Chemical disinfection alone fails without prior coagulation.
              </p>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(51, 65, 85, 0.5)', borderRadius: '0.75rem', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <Sparkles size={16} /> Machine Learning Solution
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '0.825rem', lineHeight: 1.5 }}>
                AquaSafe AI's Random Forest classifier models all 9 physicochemical parameters simultaneously to evaluate multidimensional potability risks, while Generative AI maps the exact remediation steps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Workflow */}
      <section className="container" style={{ marginBottom: '3.5rem' }}>
        <h2 style={{ textAlign: 'center', fontSize: '1.75rem', fontWeight: 700, marginBottom: '2.5rem' }}>
          End-to-End Community Diagnostic Workflow
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <div style={{ 
              width: '2.5rem', 
              height: '2.5rem', 
              borderRadius: '0.5rem', 
              background: 'rgba(6, 182, 212, 0.15)', 
              color: '#06b6d4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              marginBottom: '1rem'
            }}>01</div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.5rem' }}>Sensor & Field Input</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.5 }}>
              Technicians enter or upload 9 core parameters (pH, Hardness, TDS, Chloramines, Sulfate, Conductivity, TOC, THM, Turbidity) from digital field probes or test kits.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <div style={{ 
              width: '2.5rem', 
              height: '2.5rem', 
              borderRadius: '0.5rem', 
              background: 'rgba(16, 185, 129, 0.15)', 
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              marginBottom: '1rem'
            }}>02</div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.5rem' }}>Predictive Risk Inference</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.5 }}>
              Trained Random Forest model computes potability probability, risk tier, and official WHO Weighted Arithmetic Water Quality Index (0–100 scale).
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <div style={{ 
              width: '2.5rem', 
              height: '2.5rem', 
              borderRadius: '0.5rem', 
              background: 'rgba(56, 189, 248, 0.15)', 
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              marginBottom: '1rem'
            }}>03</div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.5rem' }}>AI Remediation Protocol</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.5 }}>
              AI synthesizes prioritized emergency containment actions, low-cost community chemical dosing (alum, soda ash, solar disinfection), and municipal infrastructure upgrades.
            </p>
          </div>
        </div>
      </section>

      {/* Ready to Test CTA */}
      <section className="container" style={{ textAlign: 'center' }}>
        <div className="glass-panel glow-cyan" style={{ padding: '3rem 2rem', background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.9) 0%, rgba(6, 182, 212, 0.08) 100%)' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>Ready to Test Water Samples?</h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
            Select from pre-configured municipal scenarios or enter real laboratory sensor parameters for instant diagnostics.
          </p>
          <button 
            onClick={onStartDiagnostic}
            className="btn btn-primary"
            style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}
          >
            Open Water Diagnostic Workspace <ArrowRight size={18} />
          </button>
        </div>
      </section>

    </div>
  );
};
