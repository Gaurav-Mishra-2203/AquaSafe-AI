export interface WaterSampleInput {
  ph: number;
  hardness: number;
  solids: number;
  chloramines: number;
  sulfate: number;
  conductivity: number;
  organic_carbon: number;
  trihalomethanes: number;
  turbidity: number;
  location_name?: string;
  source_type?: string;
  station_id?: string;
  notes?: string;
}

export interface ParameterDeviation {
  parameter: string;
  measured_value: number;
  unit: string;
  who_guideline: string;
  status: 'Safe' | 'Borderline' | 'Hazardous';
  severity: number;
  health_implication: string;
}

export interface PredictionResult {
  potability: number;
  is_potable: boolean;
  potability_probability: number;
  risk_level: string;
  wqi_score: number;
  wqi_category: string;
  parameter_deviations: ParameterDeviation[];
  key_anomalies: string[];
}

export interface TreatmentStep {
  step_number: number;
  title: string;
  action: string;
  mechanism: string;
  estimated_cost_tier: string;
  target_pollutants: string[];
}

export interface RemediationPlan {
  summary: string;
  urgency: string;
  treatment_steps: TreatmentStep[];
  emergency_household_actions: string[];
  municipal_infrastructure_recommendations: string[];
  who_target_alignment: string[];
  provider: string;
  is_live_ai: boolean;
}

export interface FullAssessmentResponse {
  id: string;
  created_at: string;
  input: WaterSampleInput;
  prediction: PredictionResult;
  remediation: RemediationPlan;
}

export interface DashboardStats {
  total_samples_analyzed: number;
  potable_count: number;
  non_potable_count: number;
  potability_rate_pct: number;
  average_wqi: number;
  critical_alerts_count: number;
  active_monitoring_stations: number;
  who_compliance_rate_pct: number;
  recent_assessments: Array<{
    id: string;
    created_at: string;
    location_name: string;
    source_type: string;
    potability: number;
    risk_level: string;
    wqi_score: number;
    remediation_urgency: string;
  }>;
  wqi_distribution: Record<string, number>;
  recent_trends: Array<{
    id: string;
    time_label: string;
    wqi_score: number;
    potability: number;
    turbidity: number;
    ph: number;
  }>;
}

export interface StationInfo {
  station_id: string;
  name: string;
  location: string;
  source_type: string;
  latitude: number;
  longitude: number;
  status: string;
  last_wqi: number;
  last_tested: string;
  samples_count: number;
}

export interface PresetScenario {
  id: string;
  name: string;
  category: string;
  description: string;
  data: WaterSampleInput;
}

export interface BatchUploadResponse {
  total_processed: number;
  potable_count: number;
  non_potable_count: number;
  potability_rate_pct: number;
  results: Array<{
    sample_id: string;
    location: string;
    source_type: string;
    ph: number;
    turbidity: number;
    solids: number;
    potability: number;
    is_potable: boolean;
    probability: number;
    wqi_score: number;
    wqi_category: string;
    risk_level: string;
    anomalies_count: number;
  }>;
}

export interface ModelMetricsResponse {
  status: string;
  model_path: string;
  metrics: {
    model_name: string;
    num_samples_total: number;
    num_train: number;
    num_test: number;
    features: string[];
    metrics: {
      accuracy: number;
      precision: number;
      recall: number;
      f1_score: number;
      roc_auc: number;
      cv_roc_auc_mean: number;
      cv_roc_auc_std: number;
    };
    confusion_matrix: {
      true_negatives: number;
      false_positives: number;
      false_negatives: number;
      true_positives: number;
    };
    feature_importances: Record<string, number>;
  };
}
