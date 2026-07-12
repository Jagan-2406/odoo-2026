import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { services } from '../../../services';
import { queryKeys } from '../../../services/queryKeys';

/**
 * Hook to query rewards catalog entries.
 */
export const useRewards = () => {
  return useQuery({
    queryKey: queryKeys.rewards,
    queryFn: () => services.gamification.getRewards(),
  });
};

/**
 * Hook to query achievement badges.
 */
export const useBadges = (employeeId?: string) => {
  return useQuery({
    queryKey: [...queryKeys.badges, employeeId],
    queryFn: () => services.gamification.getBadges(employeeId),
  });
};

/**
 * Mutation hook to redeem points for catalog rewards.
 */
export const useRedeemReward = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ rewardId, employeeId }: { rewardId: string; employeeId: string }) =>
      services.gamification.redeemReward(rewardId, employeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.rewards });
      queryClient.invalidateQueries({ queryKey: queryKeys.employees });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    },
  });
};
