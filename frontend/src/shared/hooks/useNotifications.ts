import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { services } from '../../services';
import { queryKeys } from '../../services/queryKeys';

/**
 * Hook to retrieve user notifications.
 */
export const useNotifications = (employeeId: string) => {
  return useQuery({
    queryKey: [...queryKeys.notifications, employeeId],
    queryFn: () => services.notification.getNotifications(employeeId),
    enabled: !!employeeId,
  });
};

/**
 * Mutation hook to mark single system alerts as read.
 */
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => services.notification.markAsRead(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    },
  });
};
