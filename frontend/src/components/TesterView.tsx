import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  CheckCircle, 
  AlertOctagon, 
  AlertTriangle, 
  ShieldAlert, 
  Printer, 
  RefreshCw, 
  Zap, 
  HelpCircle,
  FileCheck2,
  Droplets,
  Sliders,
  Sparkles
} from 'lucide-react';
import { WaterSampleInput, FullAssessmentResponse, PresetScenario } from '../types/api';
import { api } from '../services/api';

interface TesterViewProps {
  initialPreset?: string | null;
}

const DEFAULT_SAMPLE: WaterSampleInput = {
  ph: 7.20,
  hardness: 185.0,
  solids: 14500.0,
  chloramines: 2.30,
  sulfate: 220.0,
  conductivity: 380.0,
  organic_carbon: 6.20,
  trihalomethanes: 34.0,
  turbidity: 2.10,
  location_name: "Kibera Community Wellhead #2",
  source_type: "Borehole / Well",
  station_id: "STN-001"
};

export const TesterView: React.FC<TesterViewProps> = ({ initialPreset }) => {
  const [formData, setFormData] = useState<WaterSampleInput>(DEFAULT_SAMPLE);
  const [presets, setPresets] = useState<PresetScenario[]>([]);
  const [loading, setLoading] = useState(false);
  const [assessment, setAssessment] = useState<FullAssessmentResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    loadPresets();
  }, []);

  const loadPresets = async () => {
    try {
      const data = await api.getPresets();
      setPresets(data);
    } catch (err) {
      console.warn("Could not load presets from server", err);
    }
  };

  const handlePresetSelect = (preset: PresetScenario) => {
    setFormData({ ...preset.data });
    setErrorMsg(null);
  };

  const handleChange = (field: keyof WaterSampleInput, value: number | string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const result = await api.assessSample(formData);
      setAssessment(result);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error assessing water sample');
    } finally {
      setLoading(false);
    }
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem 1.5rem' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span className="badge badge-cyan">Primary Workflow</span>
          <span className="badge badge-sdg">WHO Guideline Calibrated</span>
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          Water Potability Diagnostic Workspace
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
          Input 9 physicochemical parameters to trigger the Random Forest potability classifier and cognitive remediation protocol generator.
        </p>
      </div>

      {/* Preset Scenario Selector */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <Zap size={16} color="#06b6d4" />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#cbd5e1' }}>
            Quick-Load Demonstration Scenarios:
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {presets.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handlePresetSelect(p)}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
              title={p.description}
            >
              <Droplets size={14} color="#06b6d4" />
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Input Form vs Results */}
      <div style={{ display: 'grid', gridTemplateColumns: assessment ? 'minmax(420px, 1fr) minmax(480px, 1.2fr)' : '1fr', gap: '2rem' }}>
        
        {/* Form Column */}
        <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sliders size={20} color="#06b6d4" /> Physicochemical Inputs
            </h2>
            <button
              type="button"
              onClick={() => setFormData(DEFAULT_SAMPLE)}
              className="btn btn-outline"
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
            >
              <RefreshCw size={12} /> Reset Defaults
            </button>
          </div>

          {/* Location & Metadata */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                Sampling Location
              </label>
              <input
                type="text"
                className="form-input"
                value={formData.location_name || ''}
                onChange={(e) => handleChange('location_name', e.target.value)}
                placeholder="e.g. Wellhead #2"
                required
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                Water Source Type
              </label>
              <select
                className="form-input"
                value={formData.source_type || 'Borehole / Well'}
                onChange={(e) => handleChange('source_type', e.target.value)}
              >
                <option value="Borehole / Well">Borehole / Well</option>
                <option value="Surface River">Surface River</option>
                <option value="Rainwater Harvest">Rainwater Harvest</option>
                <option value="Municipal Tap Reservoir">Municipal Tap Reservoir</option>
                <option value="Community Spring">Community Spring</option>
              </select>
            </div>
          </div>

          {/* 9 Core Parameters */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* pH */}
            <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(51, 65, 85, 0.4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>pH Level</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#06b6d4' }}>{formData.ph.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="14.0"
                step="0.05"
                value={formData.ph}
                onChange={(e) => handleChange('ph', parseFloat(e.target.value))}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b', marginTop: '0.25rem' }}>
                <span>Acidic (0.0)</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>WHO Safe: 6.5 - 8.5</span>
                <span>Alkaline (14.0)</span>
              </div>
            </div>

            {/* Turbidity */}
            <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(51, 65, 85, 0.4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Turbidity (Cloudiness)</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#06b6d4' }}>{formData.turbidity.toFixed(2)} NTU</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="15.0"
                step="0.1"
                value={formData.turbidity}
                onChange={(e) => handleChange('turbidity', parseFloat(e.target.value))}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b', marginTop: '0.25rem' }}>
                <span>Pristine (0.0)</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>WHO Limit: &le; 5.0 NTU</span>
                <span>Very Turbid (15.0)</span>
              </div>
            </div>

            {/* Total Dissolved Solids */}
            <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(51, 65, 85, 0.4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Solids (TDS)</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#06b6d4' }}>{Math.round(formData.solids).toLocaleString()} ppm</span>
              </div>
              <input
                type="range"
                min="500"
                max="50000"
                step="250"
                value={formData.solids}
                onChange={(e) => handleChange('solids', parseFloat(e.target.value))}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b', marginTop: '0.25rem' }}>
                <span>500 ppm</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>WHO Standard: &le; 1,000 ppm</span>
                <span>50,000 ppm</span>
              </div>
            </div>

            {/* Trihalomethanes (Carcinogen) */}
            <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(51, 65, 85, 0.4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Trihalomethanes (THMs)</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#06b6d4' }}>{formData.trihalomethanes.toFixed(1)} &mu;g/L</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                step="1"
                value={formData.trihalomethanes}
                onChange={(e) => handleChange('trihalomethanes', parseFloat(e.target.value))}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b', marginTop: '0.25rem' }}>
                <span>0 &mu;g/L</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>EPA/WHO Limit: &le; 80 &mu;g/L</span>
                <span>200 &mu;g/L</span>
              </div>
            </div>

            {/* Hardness & Chloramines (2 cols) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
                  Hardness (mg/L)
                </label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.hardness}
                  onChange={(e) => handleChange('hardness', parseFloat(e.target.value) || 0)}
                  min="0"
                  max="1000"
                />
                <span style={{ fontSize: '0.65rem', color: '#64748b' }}>WHO safe: &le; 300 mg/L</span>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
                  Chloramines (ppm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  value={formData.chloramines}
                  onChange={(e) => handleChange('chloramines', parseFloat(e.target.value) || 0)}
                  min="0"
                  max="25"
                />
                <span style={{ fontSize: '0.65rem', color: '#64748b' }}>WHO safe: &le; 4.0 ppm</span>
              </div>
            </div>

            {/* Sulfate, Conductivity & Organic Carbon (3 cols) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
                  Sulfate (mg/L)
                </label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.sulfate}
                  onChange={(e) => handleChange('sulfate', parseFloat(e.target.value) || 0)}
                  min="0"
                  max="1000"
                />
                <span style={{ fontSize: '0.65rem', color: '#64748b' }}>Limit: &le; 250</span>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
                  Conductivity (&mu;S/cm)
                </label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.conductivity}
                  onChange={(e) => handleChange('conductivity', parseFloat(e.target.value) || 0)}
                  min="0"
                  max="2000"
                />
                <span style={{ fontSize: '0.65rem', color: '#64748b' }}>Limit: &le; 500</span>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
                  Org. Carbon (ppm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  value={formData.organic_carbon}
                  onChange={(e) => handleChange('organic_carbon', parseFloat(e.target.value) || 0)}
                  min="0"
                  max="100"
                />
                <span style={{ fontSize: '0.65rem', color: '#64748b' }}>Limit: &le; 10</span>
              </div>
            </div>

          </div>

          {errorMsg && (
            <div style={{ marginTop: '1.25rem', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '0.5rem', color: '#f87171', fontSize: '0.85rem' }}>
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary glow-cyan"
            style={{ width: '100%', marginTop: '1.75rem', padding: '0.875rem' }}
          >
            {loading ? (
              <>
                <RefreshCw size={18} className="animate-spin" /> Running ML Diagnostics & AI Advisory...
              </>
            ) : (
              <>
                <Activity size={18} /> Analyze Water Potability & Generate Plan
              </>
            )}
          </button>
        </form>

        {/* Results Column */}
        {assessment && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Top Verdict Card */}
            <div 
              className={`glass-panel ${assessment.prediction.is_potable ? 'glow-emerald' : 'glow-danger'}`} 
              style={{ 
                padding: '1.75rem',
                borderLeft: `6px solid ${assessment.prediction.is_potable ? '#10b981' : '#ef4444'}`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    {assessment.prediction.is_potable ? (
                      <span className="badge badge-safe">
                        <CheckCircle size={14} /> POTABLE & SAFE
                      </span>
                    ) : (
                      <span className="badge badge-danger">
                        <AlertOctagon size={14} /> NON-POTABLE HAZARD
                      </span>
                    )}
                    <span className="badge badge-cyan">
                      Confidence: {(assessment.prediction.potability_probability * 100).toFixed(1)}%
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                    {assessment.prediction.is_potable ? 'Water Verified Safe for Consumption' : 'Contamination Detected — Treatment Required'}
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                    Assessment ID: <span style={{ fontFamily: 'var(--font-mono)', color: '#cbd5e1' }}>{assessment.id}</span>
                  </p>
                </div>

                <button
                  onClick={printReport}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
                >
                  <Printer size={14} /> Print Audit
                </button>
              </div>

              {/* Water Quality Index Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(51, 65, 85, 0.4)' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Water Quality Index (WQI)
                  </span>
                  <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: assessment.prediction.wqi_score >= 70 ? '#10b981' : assessment.prediction.wqi_score >= 50 ? '#f59e0b' : '#ef4444' }}>
                    {assessment.prediction.wqi_score} <span style={{ fontSize: '1rem', color: '#64748b' }}>/ 100</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600 }}>{assessment.prediction.wqi_category}</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Evaluated Risk Level
                  </span>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: assessment.prediction.is_potable ? '#34d399' : '#f87171', marginTop: '0.35rem' }}>
                    {assessment.prediction.risk_level}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {assessment.prediction.key_anomalies.length} Critical Excursion(s)
                  </span>
                </div>
              </div>
            </div>

            {/* Parameter Compliance Breakdown */}
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileCheck2 size={18} color="#06b6d4" /> WHO Guideline Compliance Scorecard
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {assessment.prediction.parameter_deviations.map((p, idx) => (
                  <div 
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '0.5rem',
                      background: p.status === 'Safe' ? 'rgba(15, 23, 42, 0.4)' : p.status === 'Borderline' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.12)',
                      border: `1px solid ${p.status === 'Safe' ? 'rgba(51, 65, 85, 0.3)' : p.status === 'Borderline' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{p.parameter}</span>
                        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>
                          {p.measured_value} {p.unit} (Limit: {p.who_guideline})
                        </span>
                      </div>
                      <p style={{ fontSize: '0.725rem', color: '#64748b', marginTop: '0.15rem' }}>{p.health_implication}</p>
                    </div>

                    <span className={`badge ${p.status === 'Safe' ? 'badge-safe' : p.status === 'Borderline' ? 'badge-warn' : 'badge-danger'}`} style={{ fontSize: '0.65rem' }}>
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Remediation Advisory Card */}
            <div className="glass-panel" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={20} color="#06b6d4" />
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 700 }}>AI Engineering Remediation Protocol</h4>
                </div>
                
                {/* AI Provider Transparency Badge */}
                <span className="badge" style={{ 
                  background: assessment.remediation.is_live_ai ? 'rgba(16, 185, 129, 0.15)' : 'rgba(30, 41, 59, 0.8)',
                  color: assessment.remediation.is_live_ai ? '#34d399' : '#cbd5e1',
                  border: `1px solid ${assessment.remediation.is_live_ai ? 'rgba(16, 185, 129, 0.4)' : 'rgba(71, 85, 105, 0.6)'}`,
                  fontSize: '0.7rem'
                }}>
                  {assessment.remediation.provider}
                </span>
              </div>

              {/* Urgency Pill */}
              <div style={{ marginBottom: '1.25rem' }}>
                <span className={`badge ${assessment.remediation.urgency.includes('Halt') || assessment.remediation.urgency.includes('Boil') ? 'badge-danger' : assessment.remediation.urgency.includes('Urgent') ? 'badge-warn' : 'badge-safe'}`}>
                  Action Priority: {assessment.remediation.urgency}
                </span>
              </div>

              <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '1.5rem', background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(51, 65, 85, 0.4)' }}>
                {assessment.remediation.summary}
              </p>

              {/* Treatment Steps */}
              <h5 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Prescribed Treatment Interventions:
              </h5>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {assessment.remediation.treatment_steps.map((step) => (
                  <div 
                    key={step.step_number}
                    style={{
                      background: 'rgba(15, 23, 42, 0.7)',
                      border: '1px solid rgba(51, 65, 85, 0.5)',
                      borderRadius: '0.625rem',
                      padding: '1rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ 
                          width: '1.5rem', 
                          height: '1.5rem', 
                          borderRadius: '50%', 
                          background: 'rgba(6, 182, 212, 0.2)', 
                          color: '#06b6d4', 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}>
                          {step.step_number}
                        </span>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f8fafc' }}>{step.title}</span>
                      </div>
                      <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
                        {step.estimated_cost_tier}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.825rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '0.5rem' }}>
                      {step.action}
                    </p>

                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic', marginBottom: '0.5rem' }}>
                      <strong style={{ color: '#06b6d4' }}>Mechanism: </strong>{step.mechanism}
                    </div>

                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                      {step.target_pollutants.map((pollutant, pIdx) => (
                        <span key={pIdx} style={{ fontSize: '0.65rem', background: 'rgba(30, 41, 59, 0.8)', color: '#94a3b8', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                          {pollutant}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Immediate Household Actions */}
              {assessment.remediation.emergency_household_actions.length > 0 && (
                <div style={{ marginTop: '1.5rem' }}>
                  <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fbbf24', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <AlertTriangle size={15} /> Immediate Household Safety Actions:
                  </h5>
                  <ul style={{ paddingLeft: '1.25rem', fontSize: '0.825rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {assessment.remediation.emergency_household_actions.map((act, aIdx) => (
                      <li key={aIdx}>{act}</li>
                    ))}
                  </ul>
                </div>
              )}

            </div>

          </div>
        )}

      </div>

    </div>
  );
};
