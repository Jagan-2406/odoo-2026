export interface CustomReportFilter {
  departmentId?: string;
  startDate?: string;
  endDate?: string;
  module?: 'environmental' | 'social' | 'governance' | 'gamification';
  employeeId?: string;
  challengeId?: string;
  categoryId?: string;
}

export interface ReportBuilderForm {
  reportType: 'summary' | 'environmental' | 'social' | 'governance';
  format: 'pdf' | 'csv' | 'xlsx';
  filters: CustomReportFilter;
}

export interface ExportResponseDTO {
  success: boolean;
  download_url: string;
  expires_at: string;
}

export interface ExportResponse {
  success: boolean;
  downloadUrl: string;
  expiresAt: Date;
}
