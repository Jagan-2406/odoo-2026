import { Department } from '../models/department';

export interface DepartmentRepository {
  getDepartments(filters?: { search?: string; status?: 'active' | 'inactive' }): Promise<Department[]>;
  getDepartmentById(id: string): Promise<Department>;
}
