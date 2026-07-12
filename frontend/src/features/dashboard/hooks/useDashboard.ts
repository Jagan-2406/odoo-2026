import { useQuery } from '@tanstack/react-query';
import { services } from '../../../services';
import { queryKeys } from '../../../services/queryKeys';

/**
 * Hook to query overall platform ESG metrics.
 */
export const useDashboard = () => {
  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: () => services.dashboard.getDashboardStats(),
  });
};

/**
 * Hook to query department data collections.
 */
export const useDepartments = (filters?: { search?: string; status?: 'active' | 'inactive' }) => {
  return useQuery({
    queryKey: [...queryKeys.departments, filters],
    queryFn: () => services.department.getDepartments(filters),
  });
};

/**
 * Hook to query employee rankings and accounts.
 */
export const useEmployees = (filters?: { departmentId?: string; search?: string }) => {
  return useQuery({
    queryKey: [...queryKeys.employees, filters],
    queryFn: () => services.employee.getEmployees(filters),
  });
};

/**
 * Hook to query department-specific rating sheets.
 */
export const useDepartmentScores = () => {
  return useQuery({
    queryKey: ['departmentScores'],
    queryFn: () => services.dashboard.getDepartmentScores(),
  });
};
