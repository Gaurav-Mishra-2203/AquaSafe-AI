import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  RefreshCw, 
  BarChart3,
  X
} from 'lucide-react';
import { DashboardStats, StationInfo } from '../types/api';
import { api } from '../services/api';

export const DashboardView: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [stations, setStations] = useState<StationInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAuditId, setSelectedAuditId] = useState<string | null>(null);
  const [auditDetail, setAuditDetail] = useState<any | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [dashData, stationData] = await Promise.all([
        api.getDashboard(),
        api.getStations()
      ]);
      setStats(dashData);
      setStations(stationData);
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAudit = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/dashboard/assessments/${id}`);
      if (res.ok) {
        const data = await res.json();
        setAuditDetail(data);
        setSelectedAuditId(id);
      }
    } catch (err) {
      console.error("Failed to load audit detail", err);
    }
  };

  if (loading && !stats) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <RefreshCw size={32} className="animate-spin" color="#06b6d4" style={{ margin: '0 auto 1rem auto' }} />
        <p style={{ color: '#94a3b8' }}>Loading executive dashboard intelligence...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem 1.5rem' }}>
      
      {/* Title & Refresh */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-cyan">Real-Time Telemetry</span>
            <span className="badge badge-sdg">Municipal Overview</span>
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Executive Water Safety Dashboard
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            Aggregate community water potability metrics, regional monitoring station health, and recent diagnostic logs.
          </p>
        </div>

        <button 
          onClick={fetchDashboardData}
          className="btn btn-secondary"
          style={{ fontSize: '0.85rem' }}
        >
          <RefreshCw size={15} /> Refresh Telemetry
        </button>
      </div>

      {/* KPI Cards */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Samples Analyzed
            </span>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#f8fafc', marginTop: '0.25rem' }}>
              {stats.total_samples_analyzed}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
              <CheckCircle2 size={13} /> Continuous Lab Stream
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Potability Pass Rate
            </span>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#06b6d4', marginTop: '0.25rem' }}>
              {stats.potability_rate_pct}%
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
              {stats.potable_count} Safe / {stats.non_potable_count} Contaminated
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Average WQI Index
            </span>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: stats.average_wqi >= 70 ? '#10b981' : stats.average_wqi >= 50 ? '#f59e0b' : '#ef4444', marginTop: '0.25rem' }}>
              {stats.average_wqi} <span style={{ fontSize: '1rem', color: '#64748b' }}>/ 100</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
              Weighted WHO Standard
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Critical Contamination Alerts
            </span>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#ef4444', marginTop: '0.25rem' }}>
              {stats.critical_alerts_count}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
              <AlertTriangle size={13} /> Requires immediate halt/remedy
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Active Water Stations
            </span>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#38bdf8', marginTop: '0.25rem' }}>
              {stats.active_monitoring_stations}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
              Decentralized community points
            </div>
          </div>

        </div>
      )}

      {/* Grid: WQI Distribution vs Station Status */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
        
        {/* WQI Distribution Bar Card */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 size={18} color="#06b6d4" /> Water Quality Index (WQI) Classification
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {stats && Object.entries({
              "Excellent (90-100)": { count: stats.wqi_distribution["Excellent (90-100)"] || 0, color: "#10b981" },
              "Good (70-89)": { count: stats.wqi_distribution["Good (70-89)"] || 0, color: "#06b6d4" },
              "Poor (50-69)": { count: stats.wqi_distribution["Poor (50-69)"] || 0, color: "#f59e0b" },
              "Very Poor (25-49)": { count: stats.wqi_distribution["Very Poor (25-49)"] || 0, color: "#ea580c" },
              "Unfit for Drinking (<25)": { count: stats.wqi_distribution["Unfit for Drinking (<25)"] || 0, color: "#ef4444" }
            }).map(([cat, info]) => {
              const pct = stats.total_samples_analyzed > 0 
                ? Math.round((info.count / stats.total_samples_analyzed) * 100) 
                : 0;
              return (
                <div key={cat}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '0.3rem' }}>
                    <span style={{ color: '#cbd5e1', fontWeight: 500 }}>{cat}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{info.count} ({pct}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: info.color, borderRadius: '4px', transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Monitored Stations Health */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={18} color="#06b6d4" /> Regional Monitoring Stations Telemetry
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '320px', overflowY: 'auto' }}>
            {stations.map((s) => (
              <div 
                key={s.station_id}
                style={{
                  padding: '0.85rem 1rem',
                  background: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid rgba(51, 65, 85, 0.4)',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f8fafc' }}>{s.name}</span>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>({s.station_id})</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
                    {s.location} &bull; {s.source_type}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className={`badge ${s.status === 'Operational' ? 'badge-safe' : s.status === 'Warning' ? 'badge-warn' : 'badge-danger'}`} style={{ fontSize: '0.65rem' }}>
                    {s.status}
                  </span>
                  <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#cbd5e1', marginTop: '0.25rem' }}>
                    WQI: {s.last_wqi}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Field Assessments Table */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={18} color="#06b6d4" /> Recent Diagnostic Logs & Field Assessments
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(51, 65, 85, 0.6)', textAlign: 'left', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Audit ID</th>
                <th style={{ padding: '0.75rem 1rem' }}>Location / Source</th>
                <th style={{ padding: '0.75rem 1rem' }}>Potability Status</th>
                <th style={{ padding: '0.75rem 1rem' }}>WQI Score</th>
                <th style={{ padding: '0.75rem 1rem' }}>Risk Level</th>
                <th style={{ padding: '0.75rem 1rem' }}>Action Urgency</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recent_assessments.map((a) => (
                <tr key={a.id} style={{ borderBottom: '1px solid rgba(51, 65, 85, 0.3)' }}>
                  <td style={{ padding: '0.85rem 1rem', fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>{a.id}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ fontWeight: 600, color: '#f8fafc' }}>{a.location_name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{a.source_type}</div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span className={`badge ${a.potability === 1 ? 'badge-safe' : 'badge-danger'}`} style={{ fontSize: '0.65rem' }}>
                      {a.potability === 1 ? 'POTABLE' : 'NON-POTABLE'}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: a.wqi_score >= 70 ? '#10b981' : a.wqi_score >= 50 ? '#f59e0b' : '#ef4444' }}>
                    {a.wqi_score}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: '#cbd5e1' }}>{a.risk_level}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span className={`badge ${a.remediation_urgency?.includes('Halt') || a.remediation_urgency?.includes('Boil') ? 'badge-danger' : a.remediation_urgency?.includes('Urgent') ? 'badge-warn' : 'badge-safe'}`} style={{ fontSize: '0.65rem' }}>
                      {a.remediation_urgency}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <button
                      onClick={() => handleViewAudit(a.id)}
                      className="btn btn-outline"
                      style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
                    >
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Detail Modal */}
      {selectedAuditId && auditDetail && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1.5rem'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <span className="badge badge-cyan">{auditDetail.id}</span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '0.25rem' }}>
                  {auditDetail.input?.location_name || 'Water Assessment Audit'}
                </h3>
              </div>
              <button
                onClick={() => { setSelectedAuditId(null); setAuditDetail(null); }}
                className="btn btn-secondary"
                style={{ padding: '0.4rem' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '0.5rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Potability Status:</span>
                <div style={{ fontWeight: 700, color: auditDetail.prediction?.is_potable ? '#10b981' : '#ef4444' }}>
                  {auditDetail.prediction?.is_potable ? 'Potable & Safe' : 'Contaminated / Non-Potable'}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Water Quality Index:</span>
                <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  {auditDetail.prediction?.wqi_score} / 100 ({auditDetail.prediction?.wqi_category})
                </div>
              </div>
            </div>

            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>AI Advisory Protocol:</h4>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '1rem' }}>
              {auditDetail.remediation?.summary}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button
                onClick={() => { setSelectedAuditId(null); setAuditDetail(null); }}
                className="btn btn-secondary"
              >
                Close Audit Record
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
