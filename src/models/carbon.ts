export interface EmissionFactorDTO {
  id: string;
  name: string;
  factor: number; // kg CO2e per unit
  unit: string;   // e.g. "gallon", "kWh"
  status: 'active' | 'inactive';
}

export interface EmissionFactor {
  id: string;
  name: string;
  factor: number;
  unit: string;
  status: 'active' | 'inactive';
}

export interface CarbonTransactionDTO {
  id: string;
  date: string; // ISO string
  source: 'purchase' | 'manufacturing' | 'expense' | 'fleet';
  activity_value: number;
  unit: string;
  calculated_emissions: number;
  department_id: string;
  recorded_by: string;
  emission_factor: EmissionFactorDTO;
}

export interface CarbonTransaction {
  id: string;
  date: Date;
  source: 'purchase' | 'manufacturing' | 'expense' | 'fleet';
  activityValue: number;
  unit: string;
  calculatedEmissions: number;
  departmentId: string;
  recordedBy: string;
  emissionFactor: EmissionFactor;
}

export interface CarbonTransactionForm {
  date: string;
  source: 'purchase' | 'manufacturing' | 'expense' | 'fleet';
  activityValue: number;
  unit: string;
  departmentId: string;
  emissionFactorId: string;
}

export interface EnvironmentalGoalDTO {
  id: string;
  name: string;
  category: string;
  target_value: number;
  current_value: number;
  unit: string;
  start_date: string;
  target_date: string;
  status: 'achieved' | 'in-progress' | 'failed';
}

export interface EnvironmentalGoal {
  id: string;
  name: string;
  category: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  startDate: Date;
  targetDate: Date;
  status: 'achieved' | 'in-progress' | 'failed';
}
