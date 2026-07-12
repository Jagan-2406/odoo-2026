export interface BadgeDTO {
  id: string;
  name: string;
  description: string;
  unlock_rule: string;
  icon: string;
  active: boolean;
  unlocked_at?: string; // Optional indicator for individual achievements
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  unlockRule: string;
  icon: string;
  active: boolean;
  unlockedAt?: Date;
}

export interface RewardDTO {
  id: string;
  name: string;
  description: string;
  points_required: number;
  stock: number;
  status: 'active' | 'inactive';
  image_url: string | null;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  stock: number;
  status: 'active' | 'inactive';
  imageUrl: string | null;
}

export interface RewardRedemptionDTO {
  id: string;
  reward_id: string;
  employee_id: string;
  redemption_date: string;
  points_spent: number;
  status: 'pending' | 'fulfilled' | 'cancelled';
}

export interface RewardRedemption {
  id: string;
  rewardId: string;
  employeeId: string;
  redemptionDate: Date;
  pointsSpent: number;
  status: 'pending' | 'fulfilled' | 'cancelled';
}
