import { Badge, Reward } from '../models/gamification';

export interface GamificationRepository {
  getBadges(employeeId?: string): Promise<Badge[]>;
  getRewards(): Promise<Reward[]>;
  redeemReward(rewardId: string, employeeId: string): Promise<{ success: boolean; transactionId: string; remainingPoints: number; updatedStock: number }>;
}
