import {
  departmentService,
  employeeService,
  carbonService,
  csrService,
  challengeService,
  gamificationService,
  governanceService,
  settingsService,
  reportsService,
  notificationService,
  dashboardService,
} from './supabase/supabaseServices';

/**
 * Service Registry
 * Serves as the central injection point for the frontend services.
 * React Query hooks import this registry to fetch and mutate data.
 * Swapping from Mocks to real REST API services requires updating these bindings.
 */
export const services = {
  department: departmentService,
  employee: employeeService,
  carbon: carbonService,
  csr: csrService,
  challenge: challengeService,
  gamification: gamificationService,
  governance: governanceService,
  settings: settingsService,
  reports: reportsService,
  notification: notificationService,
  dashboard: dashboardService,
};
