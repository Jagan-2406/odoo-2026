import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { services } from '../../../services';
import { queryKeys } from '../../../services/queryKeys';
import { SettingsForm } from '../../../models/settings';

/**
 * Hook to retrieve active platform settings parameters.
 */
export const useSettings = () => {
  return useQuery({
    queryKey: queryKeys.settings,
    queryFn: () => services.settings.getSettings(),
  });
};

/**
 * Mutation hook to update weight parameters and validation guidelines.
 */
export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SettingsForm) => services.settings.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
};
export type UseUpdateSettingsReturn = ReturnType<typeof useUpdateSettings>;
