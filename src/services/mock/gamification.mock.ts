import { GamificationRepository } from '../../repositories/gamification.repository';
import { Badge, Reward } from '../../models/gamification';
import { mockStorage } from '../mockStorage';
import { simulateNetwork } from '../mockNetwork';
import { mapBadge, mapReward } from '../adapters';
import { mockLogger } from '../mockLogger';
import { generateUUID } from '../generateUUID';

export class MockGamificationService implements GamificationRepository {
  async getBadges(employeeId?: string): Promise<Badge[]> {
    mockLogger.logRequest('GET', '/api/badges', { employeeId });
    await simulateNetwork();

    const db = mockStorage.getDatabase();
    
    // Simulate mapping and marking user-specific unlocks if employeeId is provided
    const domainList = db.badges.map((b) => {
      const badge = mapBadge(b);
      if (employeeId) {
        // Mock that employees with index matching badge unlock rules have them unlocked
        const isUnlocked = employeeId.charCodeAt(employeeId.length - 1) % 3 !== 0;
        if (isUnlocked) {
          badge.unlockedAt = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
        }
      }
      return badge;
    });

    mockLogger.logResponse('/api/badges', domainList);
    return domainList;
  }

  async getRewards(): Promise<Reward[]> {
    mockLogger.logRequest('GET', '/api/rewards');
    await simulateNetwork();

    const db = mockStorage.getDatabase();
    const domainList = db.rewards.map(mapReward);
    mockLogger.logResponse('/api/rewards', domainList);
    return domainList;
  }

  async redeemReward(
    rewardId: string,
    employeeId: string
  ): Promise<{ success: boolean; transactionId: string; remainingPoints: number; updatedStock: number }> {
    mockLogger.logRequest('POST', `/api/rewards/${rewardId}/redeem`, { employeeId });
    await simulateNetwork();

    const db = mockStorage.getDatabase();
    const reward = db.rewards.find((r) => r.id === rewardId);
    const employee = db.employees.find((e) => e.id === employeeId);

    if (!reward) {
      throw new Error('Reward item not found in catalog');
    }
    if (!employee) {
      throw new Error('Employee account not found');
    }
    if (reward.stock <= 0) {
      throw new Error('Reward is currently out of stock');
    }
    if (employee.points < reward.points_required) {
      throw new Error(`Insufficient points balance. Required: ${reward.points_required}, Available: ${employee.points}`);
    }

    // Process simulation side effects
    reward.stock -= 1;
    employee.points -= reward.points_required;

    // Save transaction inside in-app notifications as alert log
    db.notifications.unshift({
      id: generateUUID(),
      employee_id: employeeId,
      title: 'Reward Redeemed',
      message: `Successfully redeemed 1x ${reward.name} for ${reward.points_required} points.`,
      category: 'badge',
      date: new Date().toISOString(),
      is_read: false,
    });

    mockStorage.saveDatabase(db);

    const result = {
      success: true,
      transactionId: generateUUID(),
      remainingPoints: employee.points,
      updatedStock: reward.stock,
    };

    mockLogger.logResponse(`/api/rewards/${rewardId}/redeem`, result);
    return result;
  }
}
export const gamificationService = new MockGamificationService();
