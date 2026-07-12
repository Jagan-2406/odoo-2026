export interface EmployeeDTO {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  department_id: string;
  xp: number;
  points: number;
  rank: number;
  role: 'admin' | 'employee' | 'auditor';
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  departmentId: string;
  xp: number;
  points: number;
  rank: number;
  role: 'admin' | 'employee' | 'auditor';
}
