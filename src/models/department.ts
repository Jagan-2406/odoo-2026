// DTO representation returned by or sent to the backend
export interface DepartmentDTO {
  id: string;
  name: string;
  code: string;
  head_id: string | null;
  head_name: string | null;
  parent_department_id: string | null;
  employee_count: number;
  status: 'active' | 'inactive';
}

// Domain Model representation used in frontend UI components
export interface Department {
  id: string;
  name: string;
  code: string;
  headId: string | null;
  headName: string | null;
  parentDepartmentId: string | null;
  employeeCount: number;
  status: 'active' | 'inactive';
}

// Model representing form submission payload
export interface DepartmentForm {
  name: string;
  code: string;
  headId: string | null;
  parentDepartmentId: string | null;
}
