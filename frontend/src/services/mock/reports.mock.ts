import { ReportsRepository } from '../../repositories/reports.repository';
import { ReportBuilderForm, ExportResponse } from '../../models/reports';
import { simulateNetwork } from '../mockNetwork';
import { mockLogger } from '../mockLogger';

export class MockReportsService implements ReportsRepository {
  async exportReport(data: ReportBuilderForm): Promise<ExportResponse> {
    mockLogger.logRequest('POST', '/api/reports/export', data);
    await simulateNetwork();

    // Simulate backend generating export files
    const timestamp = Date.now();
    const result = {
      success: true,
      downloadUrl: `https://storage.ecosphere.com/downloads/esg-export-${timestamp}.${data.format}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // expires in 24h
    };

    mockLogger.logResponse('/api/reports/export', result);
    return result;
  }
}
export const reportsService = new MockReportsService();
