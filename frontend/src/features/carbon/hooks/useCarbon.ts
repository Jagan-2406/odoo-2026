import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { services } from '../../../services';
import { queryKeys } from '../../../services/queryKeys';
import { CarbonTransaction, CarbonTransactionForm } from '../../../models/carbon';

/**
 * Hook to retrieve carbon transaction ledgers.
 */
export const useCarbonTransactions = (filters?: {
  startDate?: string;
  endDate?: string;
  source?: 'purchase' | 'manufacturing' | 'expense' | 'fleet';
  departmentId?: string;
}) => {
  return useQuery({
    queryKey: [...queryKeys.carbon, filters],
    queryFn: () => services.carbon.getCarbonTransactions(filters),
  });
};

/**
 * Hook to retrieve emission factor configurations.
 */
export const useEmissionFactors = () => {
  return useQuery({
    queryKey: ['emissionFactors'],
    queryFn: () => services.carbon.getEmissionFactors(),
  });
};

/**
 * Hook to retrieve environmental goals.
 */
export const useEnvironmentalGoals = () => {
  return useQuery({
    queryKey: ['environmentalGoals'],
    queryFn: () => services.carbon.getEnvironmentalGoals(),
  });
};

/**
 * Mutation hook to create carbon transactions.
 * Optimistically updates transaction cache on creation.
 */
export const useCreateCarbonTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CarbonTransactionForm) => services.carbon.createCarbonTransaction(data),
    
    // Optimistic Update
    onMutate: async (newLog) => {
      // Cancel outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: queryKeys.carbon });

      // Snapshot the previous value
      const previousLogs = queryClient.getQueryData<CarbonTransaction[]>(queryKeys.carbon);

      // Optimistically update the cache
      if (previousLogs) {
        // Construct a mock domain transaction to display in UI immediately
        const mockNewLog: CarbonTransaction = {
          id: 'temp-id-' + Math.random(),
          date: new Date(newLog.date),
          source: newLog.source,
          activityValue: newLog.activityValue,
          unit: newLog.unit,
          calculatedEmissions: newLog.activityValue * 1.5, // temp estimate
          departmentId: newLog.departmentId,
          recordedBy: 'current-user',
          emissionFactor: {
            id: newLog.emissionFactorId,
            name: 'Loading Factor...',
            factor: 1.5,
            unit: newLog.unit,
            status: 'active',
          }
        };
        queryClient.setQueryData<CarbonTransaction[]>(
          queryKeys.carbon,
          [mockNewLog, ...previousLogs]
        );
      }

      // Return context with snapshotted value for rollback
      return { previousLogs };
    },

    // Rollback if error occurs
    onError: (_err, _newLog, context) => {
      if (context?.previousLogs) {
        queryClient.setQueryData(queryKeys.carbon, context.previousLogs);
      }
    },

    // Invalidate and sync with service store
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.carbon });
      queryClient.invalidateQueries({ queryKey: ['environmentalGoals'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
};
export type UseCreateCarbonTransactionReturn = ReturnType<typeof useCreateCarbonTransaction>;
