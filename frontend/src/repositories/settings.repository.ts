import { Settings, SettingsForm } from '../models/settings';

export interface SettingsRepository {
  getSettings(): Promise<Settings>;
  updateSettings(data: SettingsForm): Promise<Settings>;
}
