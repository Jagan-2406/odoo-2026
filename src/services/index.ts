import { departmentService } from './mock/department.mock';
import { employeeService } from './mock/employee.mock';
import { carbonService } from './mock/carbon.mock';
import { csrService } from './mock/csr.mock';
import { challengeService } from './mock/challenge.mock';
import { gamificationService } from './mock/gamification.mock';
import { governanceService } from './mock/governance.mock';
import { settingsService } from './mock/settings.mock';
import { reportsService } from './mock/reports.mock';
import { notificationService } from './mock/notification.mock';
import { dashboardService } from './mock/dashboard.mock';

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
