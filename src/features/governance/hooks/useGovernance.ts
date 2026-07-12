import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { services } from '../../../services';
import { queryKeys } from '../../../services/queryKeys';
import { ComplianceIssueForm } from '../../../models/governance';

/**
 * Hook to query governance policies and acknowledgement states.
 */
export const usePolicies = (employeeId?: string) => {
  return useQuery({
    queryKey: [...queryKeys.governance.policies, employeeId],
    queryFn: () => services.governance.getPolicies(employeeId),
  });
};

/**
 * Hook to query audit verification checks.
 */
export const useAudits = () => {
  return useQuery({
    queryKey: queryKeys.governance.audits,
    queryFn: () => services.governance.getAudits(),
  });
};

/**
 * Hook to query compliance issue records.
 */
export const useComplianceIssues = (filters?: { severity?: string; status?: string }) => {
  return useQuery({
    queryKey: [...queryKeys.governance.complianceIssues, filters],
    queryFn: () => services.governance.getComplianceIssues(filters),
  });
};

/**
 * Mutation hook to acknowledge policy readings.
 */
export const useAcknowledgePolicy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ policyId, employeeId }: { policyId: string; employeeId: string }) =>
      services.governance.acknowledgePolicy(policyId, employeeId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.governance.policies, variables.employeeId] });
    },
  });
};

/**
 * Mutation hook to create compliance issues.
 */
export const useCreateComplianceIssue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, reporterId }: { data: ComplianceIssueForm; reporterId: string }) =>
      services.governance.createComplianceIssue(data, reporterId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.governance.complianceIssues });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
};

/**
 * Mutation hook to update compliance issue status tags.
 */
export const useUpdateComplianceIssueStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'open' | 'in-progress' | 'resolved' }) =>
      services.governance.updateComplianceIssueStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.governance.complianceIssues });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
};
export type UseCreateComplianceIssueReturn = ReturnType<typeof useCreateComplianceIssue>;
