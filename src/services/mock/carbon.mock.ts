import { CarbonRepository } from '../../repositories/carbon.repository';
import { CarbonTransaction, CarbonTransactionForm, EmissionFactor, EnvironmentalGoal } from '../../models/carbon';
import { mockStorage } from '../mockStorage';
import { simulateNetwork } from '../mockNetwork';
import { mapCarbonTransaction, mapEmissionFactor, mapEnvironmentalGoal } from '../adapters';
import { mockLogger } from '../mockLogger';
import { generateUUID } from '../generateUUID';

export class MockCarbonService implements CarbonRepository {
  async getCarbonTransactions(filters?: {
    startDate?: string;
    endDate?: string;
    source?: 'purchase' | 'manufacturing' | 'expense' | 'fleet';
    departmentId?: string;
  }): Promise<CarbonTransaction[]> {
    mockLogger.logRequest('GET', '/api/carbon-transactions', filters);
    await simulateNetwork();

    const db = mockStorage.getDatabase();
    let list = db.carbonTransactions;

    if (filters?.source) {
      list = list.filter((t) => t.source === filters.source);
    }
    if (filters?.departmentId) {
      list = list.filter((t) => t.department_id === filters.departmentId);
    }
    if (filters?.startDate) {
      const start = new Date(filters.startDate).getTime();
      list = list.filter((t) => new Date(t.date).getTime() >= start);
    }
    if (filters?.endDate) {
      const end = new Date(filters.endDate).getTime();
      list = list.filter((t) => new Date(t.date).getTime() <= end);
    }

    const domainList = list.map(mapCarbonTransaction);
    mockLogger.logResponse('/api/carbon-transactions', domainList);
    return domainList;
  }

  async getEmissionFactors(): Promise<EmissionFactor[]> {
    mockLogger.logRequest('GET', '/api/emission-factors');
    await simulateNetwork();

    const db = mockStorage.getDatabase();
    const domainList = db.emissionFactors.map(mapEmissionFactor);
    mockLogger.logResponse('/api/emission-factors', domainList);
    return domainList;
  }

  async getEnvironmentalGoals(): Promise<EnvironmentalGoal[]> {
    mockLogger.logRequest('GET', '/api/environmental-goals');
    await simulateNetwork();

    const db = mockStorage.getDatabase();
    const domainList = db.environmentalGoals.map(mapEnvironmentalGoal);
    mockLogger.logResponse('/api/environmental-goals', domainList);
    return domainList;
  }

  async createCarbonTransaction(data: CarbonTransactionForm): Promise<CarbonTransaction> {
    mockLogger.logRequest('POST', '/api/carbon-transactions', data);
    await simulateNetwork();

    const db = mockStorage.getDatabase();
    const factor = db.emissionFactors.find((f) => f.id === data.emissionFactorId);
    if (!factor) {
      throw new Error(`Emission factor with ID ${data.emissionFactorId} not found`);
    }

    // Simulate backend calculating emissions
    const calculatedEmissions = Number((data.activityValue * factor.factor).toFixed(2));

    const newTxDto = {
      id: generateUUID(),
      date: data.date,
      source: data.source,
      activity_value: data.activityValue,
      unit: data.unit,
      calculated_emissions: calculatedEmissions,
      department_id: data.departmentId,
      recorded_by: db.employees[0].id, // Simulate current logged in user
      emission_factor: factor,
    };

    // Update stateful mock database
    db.carbonTransactions.unshift(newTxDto);
    
    // Update linked environmental goal value as a mock backend side effect
    const matchedGoal = db.environmentalGoals.find(
      (g) => g.category.toLowerCase() === (data.source === 'fleet' ? 'emissions' : 'electricity')
    );
    if (matchedGoal) {
      matchedGoal.current_value = Number((matchedGoal.current_value + calculatedEmissions).toFixed(1));
    }
    
    mockStorage.saveDatabase(db);

    const domainTx = mapCarbonTransaction(newTxDto);
    mockLogger.logResponse('/api/carbon-transactions', domainTx);
    return domainTx;
  }
}
export const carbonService = new MockCarbonService();
