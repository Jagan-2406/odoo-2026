import { describe, it, expect, beforeEach } from 'vitest';
import { mockStorage } from '../services/mockStorage';
import { departmentService } from '../services/mock/department.mock';
import { carbonService } from '../services/mock/carbon.mock';
import { gamificationService } from '../services/mock/gamification.mock';
import { settingsService } from '../services/mock/settings.mock';

describe('EcoSphere Stateful Mock Services Unit Tests', () => {
  beforeEach(() => {
    // Reset mock database before each run to ensure tests are isolated
    mockStorage.resetDatabase();
  });

  // 1. Department Mock Service Test
  describe('Department Service', () => {
    it('should retrieve seeded active departments', async () => {
      const depts = await departmentService.getDepartments();
      expect(depts.length).toBe(8);
      expect(depts[0]).toHaveProperty('name');
      expect(depts[0]).toHaveProperty('code');
    });

    it('should filter departments by search query', async () => {
      const results = await departmentService.getDepartments({ search: 'Eng' });
      expect(results.length).toBe(1);
      expect(results[0].name).toBe('Engineering');
    });
  });

  // 2. Carbon Mock Service Test
  describe('Carbon Service', () => {
    it('should retrieve seeded carbon transactions', async () => {
      const txs = await carbonService.getCarbonTransactions();
      expect(txs.length).toBe(75);
    });

    it('should add a new carbon log and update stateful store values', async () => {
      const initialTxs = await carbonService.getCarbonTransactions();
      const factors = await carbonService.getEmissionFactors();
      const depts = await departmentService.getDepartments();

      const newTx = await carbonService.createCarbonTransaction({
        date: new Date().toISOString(),
        source: 'fleet',
        activityValue: 100,
        unit: 'gallons',
        departmentId: depts[0].id,
        emissionFactorId: factors[2].id, // Diesel
      });

      // Verify the list has grown
      const updatedTxs = await carbonService.getCarbonTransactions();
      expect(updatedTxs.length).toBe(initialTxs.length + 1);
      expect(updatedTxs[0].id).toBe(newTx.id);
      
      // Verify simulated carbon calculations (100 gallons * 10.18 factor = 1018 kg CO2e)
      expect(newTx.calculatedEmissions).toBe(1018);
    });
  });

  // 3. Gamification Mock Service Test (Point Redemptions)
  describe('Gamification Service', () => {
    it('should deduct points and decrement stock on successful reward redemption', async () => {
      const db = mockStorage.getDatabase();
      const rewards = await gamificationService.getRewards();
      const emp = db.employees[0];
      const targetReward = rewards.find((r) => r.stock > 0 && r.pointsRequired < emp.points);

      if (!targetReward) {
        throw new Error('No valid rewards found for test criteria');
      }

      const initialPoints = emp.points;
      const initialStock = targetReward.stock;

      const redeemResult = await gamificationService.redeemReward(targetReward.id, emp.id);

      expect(redeemResult.success).toBe(true);
      expect(redeemResult.remainingPoints).toBe(initialPoints - targetReward.pointsRequired);
      expect(redeemResult.updatedStock).toBe(initialStock - 1);
    });

    it('should throw an error if employee tries to redeem with insufficient points balance', async () => {
      const db = mockStorage.getDatabase();
      const rewards = await gamificationService.getRewards();
      const emp = db.employees[0];
      
      // Make employee points zero
      emp.points = 0;
      mockStorage.saveDatabase(db);

      const targetReward = rewards[0];

      await expect(
        gamificationService.redeemReward(targetReward.id, emp.id)
      ).rejects.toThrow(/Insufficient points balance/);
    });
  });

  // 4. Settings Mock Service Test
  describe('Settings Service', () => {
    it('should retrieve and update global parameters settings', async () => {
      const initialSettings = await settingsService.getSettings();
      expect(initialSettings.envWeight).toBe(0.4);

      const updated = await settingsService.updateSettings({
        ...initialSettings,
        envWeight: 0.5,
        socialWeight: 0.25,
        govWeight: 0.25,
      });

      expect(updated.envWeight).toBe(0.5);
      expect(updated.socialWeight).toBe(0.25);
    });
  });
});
