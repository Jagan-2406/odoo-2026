import { useMutation } from '@tanstack/react-query';
import { services } from '../../../services';
import { ReportBuilderForm } from '../../../models/reports';

/**
 * Mutation hook to export custom summary reports (CSV/PDF/Excel links).
 */
export const useExportReport = () => {
  return useMutation({
    mutationFn: (data: ReportBuilderForm) => services.reports.exportReport(data),
  });
};
