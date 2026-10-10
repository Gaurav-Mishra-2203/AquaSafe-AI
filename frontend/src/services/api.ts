import {
  WaterSampleInput,
  FullAssessmentResponse,
  DashboardStats,
  StationInfo,
  PresetScenario,
  BatchUploadResponse,
  ModelMetricsResponse
} from '../types/api';

const API_BASE = 'http://localhost:8000/api';

export const api = {
  async checkHealth(): Promise<{ status: string; ml_model_loaded: boolean; ai_provider_mode: string; live_ai_available: boolean }> {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Health check failed');
    return res.json();
  },

  async assessSample(sample: WaterSampleInput): Promise<FullAssessmentResponse> {
    const res = await fetch(`${API_BASE}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sample)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to analyze water sample');
    }
    return res.json();
  },

  async getDashboard(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE}/dashboard`);
    if (!res.ok) throw new Error('Failed to fetch dashboard metrics');
    return res.json();
  },

  async getStations(): Promise<StationInfo[]> {
    const res = await fetch(`${API_BASE}/stations`);
    if (!res.ok) throw new Error('Failed to fetch stations');
    return res.json();
  },

  async getPresets(): Promise<PresetScenario[]> {
    const res = await fetch(`${API_BASE}/batch/presets`);
    if (!res.ok) throw new Error('Failed to fetch presets');
    return res.json();
  },

  async getMetrics(): Promise<ModelMetricsResponse> {
    const res = await fetch(`${API_BASE}/metrics`);
    if (!res.ok) throw new Error('Failed to fetch model metrics');
    return res.json();
  },

  async uploadBatchCsv(file: File): Promise<BatchUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/batch/upload`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to process CSV file');
    }
    return res.json();
  }
};
