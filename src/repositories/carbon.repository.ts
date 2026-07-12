import { CarbonTransaction, CarbonTransactionForm, EmissionFactor, EnvironmentalGoal } from '../models/carbon';

export interface CarbonRepository {
  getCarbonTransactions(filters?: {
    startDate?: string;
    endDate?: string;
    source?: 'purchase' | 'manufacturing' | 'expense' | 'fleet';
    departmentId?: string;
  }): Promise<CarbonTransaction[]>;
  getEmissionFactors(): Promise<EmissionFactor[]>;
  getEnvironmentalGoals(): Promise<EnvironmentalGoal[]>;
  createCarbonTransaction(data: CarbonTransactionForm): Promise<CarbonTransaction>;
}
