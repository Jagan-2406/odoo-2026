import { mockStorage } from './mockStorage';

/**
 * Utility function to completely clear localStorage overrides and re-seed the mock database.
 */
export const resetMockDatabaseState = (): void => {
  mockStorage.resetDatabase();
  console.log('[MOCK DB] Database state has been successfully reset to default seeds.');
};
