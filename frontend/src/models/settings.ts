export interface SettingsDTO {
  env_weight: number;
  social_weight: number;
  gov_weight: number;
  auto_calculate_emissions: boolean;
  evidence_required: boolean;
  badge_auto_award: boolean;
  email_notifications: boolean;
  in_app_notifications: boolean;
}

export interface Settings {
  envWeight: number;
  socialWeight: number;
  govWeight: number;
  autoCalculateEmissions: boolean;
  evidenceRequired: boolean;
  badgeAutoAward: boolean;
  emailNotifications: boolean;
  inAppNotifications: boolean;
}

export interface SettingsForm {
  envWeight: number;
  socialWeight: number;
  govWeight: number;
  autoCalculateEmissions: boolean;
  evidenceRequired: boolean;
  badgeAutoAward: boolean;
  emailNotifications: boolean;
  inAppNotifications: boolean;
}
