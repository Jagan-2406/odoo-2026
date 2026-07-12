import { ReportBuilderForm, ExportResponse } from '../models/reports';

export interface ReportsRepository {
  exportReport(data: ReportBuilderForm): Promise<ExportResponse>;
}
