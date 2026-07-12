import { seedMockDatabase, MockDatabase } from './seedMockData';

const STORAGE_KEY = 'ecosphere_mock_db';

let memoryDb: MockDatabase | null = null;

export const mockStorage = {
  getDatabase: (): MockDatabase => {
    // 1. Check in-memory reference
    if (memoryDb) return memoryDb;

    // 2. Check LocalStorage fallback for persistent mocking
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          memoryDb = JSON.parse(stored);
          return memoryDb!;
        } catch (e) {
          console.error('Failed to parse mock database, re-seeding.', e);
        }
      }
    }

    // 3. Seed new database
    memoryDb = seedMockDatabase();
    mockStorage.saveDatabase(memoryDb);
    return memoryDb;
  },

  saveDatabase: (db: MockDatabase): void => {
    memoryDb = db;
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    }
  },

  resetDatabase: (): MockDatabase => {
    memoryDb = seedMockDatabase();
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    mockStorage.saveDatabase(memoryDb);
    return memoryDb;
  }
};
