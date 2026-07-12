import { DepartmentRepository } from '../../repositories/department.repository';
import { Department } from '../../models/department';
import { mockStorage } from '../mockStorage';
import { simulateNetwork } from '../mockNetwork';
import { mapDepartment } from '../adapters';
import { mockLogger } from '../mockLogger';

export class MockDepartmentService implements DepartmentRepository {
  async getDepartments(filters?: { search?: string; status?: 'active' | 'inactive' }): Promise<Department[]> {
    mockLogger.logRequest('GET', '/api/departments', filters);
    await simulateNetwork();
    
    const db = mockStorage.getDatabase();
    let list = db.departments;

    if (filters?.status) {
      list = list.filter((d) => d.status === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter((d) => d.name.toLowerCase().includes(q) || d.code.toLowerCase().includes(q));
    }

    const domainList = list.map(mapDepartment);
    mockLogger.logResponse('/api/departments', domainList);
    return domainList;
  }

  async getDepartmentById(id: string): Promise<Department> {
    mockLogger.logRequest('GET', `/api/departments/${id}`);
    await simulateNetwork();

    const db = mockStorage.getDatabase();
    const dept = db.departments.find((d) => d.id === id);
    if (!dept) {
      const err = new Error(`Department with ID ${id} not found`);
      mockLogger.logError(`/api/departments/${id}`, err);
      throw err;
    }

    const domainDept = mapDepartment(dept);
    mockLogger.logResponse(`/api/departments/${id}`, domainDept);
    return domainDept;
  }
}
export const departmentService = new MockDepartmentService();
