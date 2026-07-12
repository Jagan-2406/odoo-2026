/**
 * Centralized React Query caching keys.
 * Exposes namespace lists for structured cache invalidation.
 */
export const queryKeys = {
  dashboard: ['dashboard'] as const,
  departments: ['departments'] as const,
  employees: ['employees'] as const,
  carbon: ['carbon'] as const,
  csr: ['csr'] as const,
  challenges: ['challenges'] as const,
  rewards: ['rewards'] as const,
  badges: ['badges'] as const,
  notifications: ['notifications'] as const,
  reports: ['reports'] as const,
  settings: ['settings'] as const,
  governance: {
    policies: ['governance', 'policies'] as const,
    audits: ['governance', 'audits'] as const,
    complianceIssues: ['governance', 'complianceIssues'] as const,
  }
};
