import { DashboardStats, DepartmentScore } from '../models/dashboard';

export interface DashboardRepository {
  getDashboardStats(): Promise<DashboardStats>;
  getDepartmentScores(): Promise<DepartmentScore[]>;
}
