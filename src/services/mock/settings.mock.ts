import { SettingsRepository } from '../../repositories/settings.repository';
import { Settings, SettingsForm } from '../../models/settings';
import { mockStorage } from '../mockStorage';
import { simulateNetwork } from '../mockNetwork';
import { mapSettings } from '../adapters';
import { mockLogger } from '../mockLogger';

export class MockSettingsService implements SettingsRepository {
  async getSettings(): Promise<Settings> {
    mockLogger.logRequest('GET', '/api/settings');
    await simulateNetwork();

    const db = mockStorage.getDatabase();
    const domainSettings = mapSettings(db.settings);
    mockLogger.logResponse('/api/settings', domainSettings);
    return domainSettings;
  }

  async updateSettings(data: SettingsForm): Promise<Settings> {
    mockLogger.logRequest('PATCH', '/api/settings', data);
    await simulateNetwork();

    const db = mockStorage.getDatabase();
    db.settings = {
      env_weight: data.envWeight,
      social_weight: data.socialWeight,
      gov_weight: data.govWeight,
      auto_calculate_emissions: data.autoCalculateEmissions,
      evidence_required: data.evidenceRequired,
      badge_auto_award: data.badgeAutoAward,
      email_notifications: data.emailNotifications,
      in_app_notifications: data.inAppNotifications,
    };
    
    mockStorage.saveDatabase(db);

    const domainSettings = mapSettings(db.settings);
    mockLogger.logResponse('/api/settings', domainSettings);
    return domainSettings;
  }
}
export const settingsService = new MockSettingsService();
