import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Cpu, 
  Globe2, 
  HeartPulse, 
  Award, 
  Sliders, 
  BarChart3, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';
import { ModelMetricsResponse } from '../types/api';
import { api } from '../services/api';

export const MethodologyView: React.FC = () => {
  const [metricsData, setMetricsData] = useState<ModelMetricsResponse | null>(null);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const data = await api.getMetrics();
      setMetricsData(data);
    } catch (err) {
      console.error("Failed to load metrics", err);
    }
  };

  const cm = metricsData?.metrics?.confusion_matrix || {
    true_negatives: 354,
    false_positives: 40,
    false_negatives: 34,
    true_positives: 228
  };

  const featureList = [
    { name: "pH Level (Acidity/Alkalinity)", imp: 27.2, desc: "Primary driver of chemical equilibrium and pipe corrosion" },
    { name: "Solids / Total Dissolved Solids (TDS)", imp: 17.2, desc: "Dissolved minerals, salinity, and agricultural runoff" },
    { name: "Turbidity (Suspended Sediment)", imp: 15.8, desc: "Cloudiness shielding pathogenic microbes from disinfection" },
    { name: "Hardness (Ca2+ / Mg2+)", imp: 10.5, desc: "Mineral scaling and pipe passivity" },
    { name: "Sulfate Concentration", imp: 8.4, desc: "Dissolved salts causing gastrointestinal disturbance" },
    { name: "Trihalomethanes (THMs)", imp: 6.8, desc: "Volatile chlorinated disinfection byproducts (carcinogen)" },
    { name: "Chloramines Residual", imp: 5.4, desc: "Free disinfectant vs mucosal irritation threshold" },
    { name: "Electrical Conductivity", imp: 4.9, desc: "Total ionic salinity and potential industrial leachate" },
    { name: "Total Organic Carbon (TOC)", imp: 3.9, desc: "Organic substrate driving disinfection byproduct formation" }
  ];

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem 1.5rem' }}>
      
      {/* Title */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span className="badge badge-sdg">Scientific Rigor</span>
          <span className="badge badge-cyan">Model Auditing</span>
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          Scientific Methodology & SDG Alignment
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
          Empirical machine learning architecture, validation confusion matrix, feature importance attributions, and direct UN SDG mapping.
        </p>
      </div>

      {/* UN SDG Mapping Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Globe2 size={20} color="#06b6d4" /> United Nations Sustainable Development Goals
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          
          {/* SDG 6 Card */}
          <div className="glass-panel" style={{ padding: '1.75rem', borderLeft: '5px solid #26bde2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span className="badge badge-sdg" style={{ fontSize: '0.75rem' }}>Primary Goal</span>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Global Water Security</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: '#38bdf8' }}>
              SDG 6: Clean Water and Sanitation
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '1rem' }}>
              Ensure availability and sustainable management of water and sanitation for all.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>
              <div><strong style={{ color: '#f8fafc' }}>Target 6.1:</strong> Universal & equitable access to safe and affordable drinking water by 2030.</div>
              <div><strong style={{ color: '#f8fafc' }}>Target 6.3:</strong> Improve water quality by eliminating dumping and hazardous chemicals.</div>
              <div><strong style={{ color: '#f8fafc' }}>Target 6.b:</strong> Support local community participation in water stewardship.</div>
            </div>
          </div>

          {/* SDG 3 Card */}
          <div className="glass-panel" style={{ padding: '1.75rem', borderLeft: '5px solid #4c9f38' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span className="badge badge-safe" style={{ fontSize: '0.75rem' }}>Secondary Goal</span>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Public Health Protection</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: '#34d399' }}>
              SDG 3: Good Health and Well-Being
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '1rem' }}>
              Ensure healthy lives and promote well-being for all at all ages.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>
              <div><strong style={{ color: '#f8fafc' }}>Target 3.9:</strong> Substantially reduce illnesses and deaths from hazardous chemicals and contaminated water.</div>
              <div><strong style={{ color: '#f8fafc' }}>Global Context:</strong> Over 505,000 diarrheal deaths occur annually due to microbially or chemically compromised drinking water.</div>
            </div>
          </div>

        </div>
      </section>

      {/* Machine Learning Pipeline & Metrics */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Cpu size={20} color="#06b6d4" /> Machine Learning Model Architecture & Performance
        </h2>

        {/* Validation Scorecards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Accuracy</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#10b981' }}>88.72%</div>
            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Held-out Test (n=656)</span>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Precision</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#06b6d4' }}>85.07%</div>
            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Low False Positive Rate</span>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Recall</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>87.02%</div>
            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>High Contamination Sensitivity</span>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>ROC-AUC</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#f59e0b' }}>0.9430</div>
            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>5-Fold CV: 0.9565</span>
          </div>
        </div>

        {/* Confusion Matrix & Model Pipeline Specs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          
          {/* Confusion Matrix */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart3 size={18} color="#06b6d4" /> Held-Out Confusion Matrix
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', maxWidth: '380px', margin: '0 auto', textAlign: 'center' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1.25rem 0.5rem', borderRadius: '0.5rem' }}>
                <span style={{ fontSize: '0.7rem', color: '#34d399', textTransform: 'uppercase' }}>True Negatives</span>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#f8fafc' }}>{cm.true_negatives}</div>
                <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Correctly Flagged Hazard</span>
              </div>

              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', padding: '1.25rem 0.5rem', borderRadius: '0.5rem' }}>
                <span style={{ fontSize: '0.7rem', color: '#f87171', textTransform: 'uppercase' }}>False Positives</span>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#f87171' }}>{cm.false_positives}</div>
                <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Over-Cautious Warnings</span>
              </div>

              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', padding: '1.25rem 0.5rem', borderRadius: '0.5rem' }}>
                <span style={{ fontSize: '0.7rem', color: '#f87171', textTransform: 'uppercase' }}>False Negatives</span>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#f87171' }}>{cm.false_negatives}</div>
                <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Missed Excursions</span>
              </div>

              <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1.25rem 0.5rem', borderRadius: '0.5rem' }}>
                <span style={{ fontSize: '0.7rem', color: '#34d399', textTransform: 'uppercase' }}>True Positives</span>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#f8fafc' }}>{cm.true_positives}</div>
                <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Confirmed Potable</span>
              </div>
            </div>
          </div>

          {/* Pipeline Specifications */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sliders size={18} color="#06b6d4" /> Pipeline Specifications
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(51, 65, 85, 0.3)', paddingBottom: '0.4rem' }}>
                <span style={{ color: '#94a3b8' }}>Algorithm:</span>
                <span style={{ fontWeight: 600, color: '#f8fafc' }}>Random Forest Ensemble (150 Trees)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(51, 65, 85, 0.3)', paddingBottom: '0.4rem' }}>
                <span style={{ color: '#94a3b8' }}>Imputation:</span>
                <span style={{ fontWeight: 600, color: '#f8fafc' }}>Median Imputer (Sensor Fault Tolerance)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(51, 65, 85, 0.3)', paddingBottom: '0.4rem' }}>
                <span style={{ color: '#94a3b8' }}>Feature Scaling:</span>
                <span style={{ fontWeight: 600, color: '#f8fafc' }}>StandardScaler (Z-score normalization)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(51, 65, 85, 0.3)', paddingBottom: '0.4rem' }}>
                <span style={{ color: '#94a3b8' }}>Water Quality Index:</span>
                <span style={{ fontWeight: 600, color: '#f8fafc' }}>Weighted Arithmetic (Brown et al., WHO)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(51, 65, 85, 0.3)', paddingBottom: '0.4rem' }}>
                <span style={{ color: '#94a3b8' }}>Offline Fallback:</span>
                <span style={{ fontWeight: 600, color: '#10b981' }}>WHO Deterministic Heuristic Engine</span>
              </div>
            </div>
          </div>

        </div>

        {/* Feature Importance Attribution */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={18} color="#06b6d4" /> Feature Attribution (Gini Impurity Importance)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {featureList.map((f, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 600, color: '#f8fafc' }}>{f.name}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: '#06b6d4', fontWeight: 700 }}>{f.imp}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${(f.imp / 30) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #0ea5e9, #06b6d4)', borderRadius: '3px' }} />
                </div>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{f.desc}</span>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* AI Ethics & Transparency Statement */}
      <section className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={20} color="#10b981" /> AI Ethics, Environmental Justice & Transparency
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '1rem' }}>
          AquaSafe AI is designed with an ethical fail-safe philosophy. Because lives are at stake in drinking water safety, our architecture mandates:
        </p>
        <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <li><strong style={{ color: '#cbd5e1' }}>Zero Black-Box Guessing:</strong> When external generative LLM APIs are unreachable or unconfigured, the system automatically runs the deterministic WHO Expert Rule Engine rather than failing or inventing hallucinated remediation protocols.</li>
          <li><strong style={{ color: '#cbd5e1' }}>Explicit Provenance Labeling:</strong> Every single diagnostic response explicitly labels the provider source so operators know whether recommendations originate from a live generative model or the deterministic baseline rule engine.</li>
          <li><strong style={{ color: '#cbd5e1' }}>Precautionary Bias:</strong> Marginal or borderline water is classified conservatively with warning flags, prioritizing public health safety over false optimism.</li>
        </ul>
      </section>

    </div>
  );
};
