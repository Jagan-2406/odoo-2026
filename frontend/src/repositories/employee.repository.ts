import { Employee } from '../models/employee';

export interface EmployeeRepository {
  getEmployees(filters?: { departmentId?: string; search?: string }): Promise<Employee[]>;
  getEmployeeById(id: string): Promise<Employee>;
}
