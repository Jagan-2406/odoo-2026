import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { services } from '../../../services';
import { queryKeys } from '../../../services/queryKeys';

/**
 * Hook to retrieve CSR activity lists.
 */
export const useCSRActivities = (filters?: { categoryId?: string; status?: string }) => {
  return useQuery({
    queryKey: [...queryKeys.csr, 'activities', filters],
    queryFn: () => services.csr.getCSRActivities(filters),
  });
};

/**
 * Hook to retrieve specific activity detail.
 */
export const useCSRActivity = (id: string) => {
  return useQuery({
    queryKey: [...queryKeys.csr, 'activity', id],
    queryFn: () => services.csr.getCSRActivityById(id),
    enabled: !!id,
  });
};

/**
 * Hook to query all CSR activity participations.
 */
export const useCSRParticipations = () => {
  return useQuery({
    queryKey: [...queryKeys.csr, 'participations'],
    queryFn: () => services.csr.getAllParticipations(),
  });
};

/**
 * Mutation hook to register or upload volunteer proof file.
 */
export const useSubmitCSRParticipation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ activityId, employeeId, proofFile }: { activityId: string; employeeId: string; proofFile: File | null }) =>
      services.csr.submitParticipation(activityId, employeeId, proofFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.csr, 'participations'] });
    },
  });
};

/**
 * Mutation hook to approve/reject participations.
 * Triggers general invalidation.
 */
export const useApproveCSRParticipation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'approved' | 'rejected' }) =>
      services.csr.approveParticipation(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.csr, 'participations'] });
      queryClient.invalidateQueries({ queryKey: [...queryKeys.csr, 'activities'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.employees });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
};
