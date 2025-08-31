export interface WorkflowStatus {
  id: string;
  type: string;
  status: 'running' | 'completed' | 'failed';
  current_step: number;
  steps: string[];
  data: any;
  results?: AnalysisResults;
  started_at: string;
  completed_at?: string;
  error?: string;
}

export interface AnalysisResults {
  validated_dob: string;
  age: {
    years: number;
    days: number;
    hours: number;
    minutes: number;
  };
  zodiac: {
    western: string;
    chinese: string;
  };
  numerology: {
    life_path: number;
  };
  day_info: {
    day_of_week: string;
    day_number: number;
  };
  fun_facts: {
    days_to_next_birthday: number;
    estimated_heartbeats: number;
    lunar_cycles_lived: number;
    seasons_experienced: number;
  };
}