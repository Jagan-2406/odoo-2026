import { EmployeeRepository } from '../../repositories/employee.repository';
import { Employee } from '../../models/employee';
import { mockStorage } from '../mockStorage';
import { simulateNetwork } from '../mockNetwork';
import { mapEmployee } from '../adapters';
import { mockLogger } from '../mockLogger';

export class MockEmployeeService implements EmployeeRepository {
  async getEmployees(filters?: { departmentId?: string; search?: string }): Promise<Employee[]> {
    mockLogger.logRequest('GET', '/api/employees', filters);
    await simulateNetwork();

    const db = mockStorage.getDatabase();
    let list = db.employees;

    if (filters?.departmentId) {
      list = list.filter((e) => e.department_id === filters.departmentId);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter((e) => e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q));
    }

    const domainList = list.map(mapEmployee);
    mockLogger.logResponse('/api/employees', domainList);
    return domainList;
  }

  async getEmployeeById(id: string): Promise<Employee> {
    mockLogger.logRequest('GET', `/api/employees/${id}`);
    await simulateNetwork();

    const db = mockStorage.getDatabase();
    const emp = db.employees.find((e) => e.id === id);
    if (!emp) {
      const err = new Error(`Employee with ID ${id} not found`);
      mockLogger.logError(`/api/employees/${id}`, err);
      throw err;
    }

    const domainEmp = mapEmployee(emp);
    mockLogger.logResponse(`/api/employees/${id}`, domainEmp);
    return domainEmp;
  }
}
export const employeeService = new MockEmployeeService();
