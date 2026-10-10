import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertOctagon, 
  Download, 
  RefreshCw, 
  Sparkles,
  Layers
} from 'lucide-react';
import { BatchUploadResponse } from '../types/api';
import { api } from '../services/api';

export const BatchView: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [batchData, setBatchData] = useState<BatchUploadResponse | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'potable' | 'hazard'>('all');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const processFile = async (file: File) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await api.uploadBatchCsv(file);
      setBatchData(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to process CSV file');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadDemoBatch = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      // Create sample demo CSV in browser memory
      const demoCsvContent = `ph,Hardness,Solids,Chloramines,Sulfate,Conductivity,Organic_carbon,Trihalomethanes,Turbidity,location_name,source_type
7.3,185.0,14200.0,2.1,210.0,360.0,5.8,32.0,1.8,Municipal Inflow #1,Surface River
5.2,240.0,28500.0,3.4,380.0,620.0,16.2,92.0,6.5,Kibera Deep Well #3,Borehole / Well
7.8,160.0,11800.0,2.4,195.0,310.0,4.2,28.0,1.4,St. Jude Reservoir,Municipal Tap Reservoir
4.9,290.0,32000.0,4.1,410.0,690.0,19.5,108.0,8.2,Industrial Perimeter Borehole,Borehole / Well
8.2,310.0,26000.0,2.8,340.0,540.0,11.0,65.0,3.9,Semi-Arid Community Spring,Community Spring
6.9,175.0,13500.0,1.9,220.0,380.0,6.4,36.0,2.1,East Sub-County Pipeline,Municipal Tap Reservoir
5.5,210.0,22400.0,3.2,350.0,580.0,14.8,78.0,5.4,School Rainwater Cistern #2,Rainwater Harvest
7.4,180.0,15000.0,2.2,230.0,390.0,6.0,34.0,1.9,Valley Borehole #1,Borehole / Well
4.4,320.0,39000.0,5.5,460.0,780.0,24.0,125.0,9.1,Flooded Quarry Basin,Surface River
7.1,190.0,16200.0,2.3,240.0,410.0,7.1,38.0,2.2,Hospital Backup Tank,Municipal Tap Reservoir`;

      const blob = new Blob([demoCsvContent], { type: 'text/csv' });
      const file = new File([blob], 'demo_municipal_water_samples.csv', { type: 'text/csv' });
      await processFile(file);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load demo CSV');
      setLoading(false);
    }
  };

  const filteredResults = batchData?.results.filter((r) => {
    if (filterType === 'potable') return r.is_potable;
    if (filterType === 'hazard') return !r.is_potable;
    return true;
  }) || [];

  const exportResultsCsv = () => {
    if (!batchData) return;
    const headers = ['Sample ID', 'Location', 'Source', 'pH', 'Turbidity', 'Solids', 'Potability', 'WQI Score', 'Risk Level'];
    const rows = batchData.results.map(r => [
      r.sample_id,
      `"${r.location}"`,
      `"${r.source_type}"`,
      r.ph,
      r.turbidity,
      r.solids,
      r.is_potable ? 'POTABLE' : 'NON-POTABLE',
      r.wqi_score,
      `"${r.risk_level}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'AquaSafe_AI_Batch_Classification_Report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem 1.5rem' }}>
      
      {/* Title */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span className="badge badge-cyan">Municipal Laboratory Scale</span>
          <span className="badge badge-sdg">High-Throughput ML</span>
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          Batch Municipal Water Screening
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
          Triage hundreds of community boreholes simultaneously by uploading lab CSV logs or executing the instant 10-sample demonstration batch.
        </p>
      </div>

      {/* Upload & Quick Demo Panel */}
      <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '2.5rem', textAlign: 'center' }}>
        <div style={{ 
          maxWidth: '560px', 
          margin: '0 auto',
          border: '2px dashed rgba(6, 182, 212, 0.4)',
          borderRadius: '1rem',
          padding: '2.5rem 1.5rem',
          background: 'rgba(15, 23, 42, 0.5)'
        }}>
          <Upload size={36} color="#06b6d4" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Upload Water Test Dataset (.csv)
          </h3>
          <p style={{ fontSize: '0.825rem', color: '#94a3b8', marginBottom: '1.5rem' }}>
            Columns required: <span style={{ fontFamily: 'var(--font-mono)', color: '#cbd5e1' }}>ph, hardness, solids, chloramines, sulfate, conductivity, organic_carbon, trihalomethanes, turbidity</span>
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <label className="btn btn-primary glow-cyan" style={{ cursor: 'pointer' }}>
              <Upload size={16} /> Select CSV File
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </label>

            <button
              onClick={handleLoadDemoBatch}
              disabled={loading}
              className="btn btn-secondary"
            >
              <Sparkles size={16} color="#06b6d4" /> Load 10-Sample Demo Batch
            </button>
          </div>
        </div>

        {errorMsg && (
          <div style={{ maxWidth: '560px', margin: '1.25rem auto 0 auto', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '0.5rem', color: '#f87171', fontSize: '0.85rem' }}>
            {errorMsg}
          </div>
        )}
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <RefreshCw size={28} className="animate-spin" color="#06b6d4" style={{ margin: '0 auto 0.75rem auto' }} />
          <p style={{ color: '#94a3b8' }}>Running Random Forest vector inference on batch dataset...</p>
        </div>
      )}

      {/* Batch Results View */}
      {batchData && !loading && (
        <div>
          {/* Summary KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Batch Size</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{batchData.total_processed}</div>
            </div>
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Potable / Safe</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#10b981' }}>{batchData.potable_count}</div>
            </div>
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contaminated Hazard</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#ef4444' }}>{batchData.non_potable_count}</div>
            </div>
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pass Rate</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#06b6d4' }}>{batchData.potability_rate_pct}%</div>
            </div>
          </div>

          {/* Table Header Controls */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setFilterType('all')}
                  className={`btn ${filterType === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.75rem', padding: '0.4rem 0.85rem' }}
                >
                  All Samples ({batchData.total_processed})
                </button>
                <button
                  onClick={() => setFilterType('potable')}
                  className={`btn ${filterType === 'potable' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.75rem', padding: '0.4rem 0.85rem' }}
                >
                  Potable Only ({batchData.potable_count})
                </button>
                <button
                  onClick={() => setFilterType('hazard')}
                  className={`btn ${filterType === 'hazard' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.75rem', padding: '0.4rem 0.85rem' }}
                >
                  Hazardous Only ({batchData.non_potable_count})
                </button>
              </div>

              <button
                onClick={exportResultsCsv}
                className="btn btn-secondary"
                style={{ fontSize: '0.8rem' }}
              >
                <Download size={14} /> Export Classified CSV
              </button>
            </div>

            {/* Results Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(51, 65, 85, 0.6)', textAlign: 'left', color: '#94a3b8', fontSize: '0.725rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '0.65rem 0.75rem' }}>ID</th>
                    <th style={{ padding: '0.65rem 0.75rem' }}>Location / Source</th>
                    <th style={{ padding: '0.65rem 0.75rem' }}>pH</th>
                    <th style={{ padding: '0.65rem 0.75rem' }}>Turbidity</th>
                    <th style={{ padding: '0.65rem 0.75rem' }}>Solids (TDS)</th>
                    <th style={{ padding: '0.65rem 0.75rem' }}>ML Verdict</th>
                    <th style={{ padding: '0.65rem 0.75rem' }}>Confidence</th>
                    <th style={{ padding: '0.65rem 0.75rem' }}>WQI Score</th>
                    <th style={{ padding: '0.65rem 0.75rem' }}>Risk Tier</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResults.map((r) => (
                    <tr key={r.sample_id} style={{ borderBottom: '1px solid rgba(51, 65, 85, 0.25)' }}>
                      <td style={{ padding: '0.65rem 0.75rem', fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>{r.sample_id}</td>
                      <td style={{ padding: '0.65rem 0.75rem' }}>
                        <div style={{ fontWeight: 600, color: '#f8fafc' }}>{r.location}</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{r.source_type}</div>
                      </td>
                      <td style={{ padding: '0.65rem 0.75rem', fontFamily: 'var(--font-mono)', color: r.ph < 6.5 || r.ph > 8.5 ? '#f87171' : '#cbd5e1' }}>
                        {r.ph.toFixed(2)}
                      </td>
                      <td style={{ padding: '0.65rem 0.75rem', fontFamily: 'var(--font-mono)', color: r.turbidity > 5.0 ? '#f87171' : '#cbd5e1' }}>
                        {r.turbidity.toFixed(1)} NTU
                      </td>
                      <td style={{ padding: '0.65rem 0.75rem', fontFamily: 'var(--font-mono)', color: '#cbd5e1' }}>
                        {Math.round(r.solids).toLocaleString()} ppm
                      </td>
                      <td style={{ padding: '0.65rem 0.75rem' }}>
                        <span className={`badge ${r.is_potable ? 'badge-safe' : 'badge-danger'}`} style={{ fontSize: '0.65rem' }}>
                          {r.is_potable ? 'POTABLE' : 'NON-POTABLE'}
                        </span>
                      </td>
                      <td style={{ padding: '0.65rem 0.75rem', fontFamily: 'var(--font-mono)', color: '#cbd5e1' }}>
                        {(r.probability * 100).toFixed(1)}%
                      </td>
                      <td style={{ padding: '0.65rem 0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: r.wqi_score >= 70 ? '#10b981' : r.wqi_score >= 50 ? '#f59e0b' : '#ef4444' }}>
                        {r.wqi_score}
                      </td>
                      <td style={{ padding: '0.65rem 0.75rem', color: '#cbd5e1' }}>
                        {r.risk_level}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
