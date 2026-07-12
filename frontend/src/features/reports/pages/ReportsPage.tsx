import React, { useState } from 'react';
import { PageContainer, PageHeader } from '../../../components/layout/AppLayout';
import { Button } from '../../../components/common/Button';
import { Download, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useExportReport } from '../hooks/useReports';
import { useDepartments } from '../../dashboard/hooks/useDashboard';

export const ReportsPage = () => {
  const { data: departments = [] } = useDepartments();
  const exportMutation = useExportReport();

  // Form State
  const [reportType, setReportType] = useState<'summary' | 'environmental' | 'social' | 'governance'>('summary');
  const [format, setFormat] = useState<'pdf' | 'csv' | 'xlsx'>('pdf');
  const [departmentId, setDepartmentId] = useState<string>('');

  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError(null);

    exportMutation.mutate(
      {
        reportType,
        format,
        filters: {
          departmentId: departmentId || undefined,
        },
      },
      {
        onSuccess: () => {
          setSuccess(true);
        },
        onError: (err: any) => {
          setError(err.message || 'Failed to generate report export link.');
        },
      }
    );
  };

  return (
    <PageContainer>
      <PageHeader
        title="Analytics & Reports"
        description="Compile summary sheets, filter carbon logs, and generate PDF/CSV reports."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Custom report builder form */}
        <form
          onSubmit={handleGenerate}
          className="lg:col-span-2 p-6 bg-card border border-border rounded-lg space-y-6 text-xs text-zinc-300"
        >
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Custom Report Builder</h3>

          {success && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg flex items-center gap-3">
              <CheckCircle className="h-5 w-5" />
              <span>Report generated successfully and download triggered!</span>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg flex items-center gap-3">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-400">Report Scope</label>
              <div className="relative">
                <select
                  value={reportType}
                  onChange={(e: any) => setReportType(e.target.value)}
                  className="w-full h-10 pl-3 pr-10 bg-zinc-950/20 border border-border rounded text-zinc-200 focus-visible:outline-none appearance-none cursor-pointer"
                >
                  <option value="summary" className="bg-zinc-950">ESG Pillar Summary Sheet</option>
                  <option value="environmental" className="bg-zinc-950">Environmental / Carbon Logs</option>
                  <option value="social" className="bg-zinc-950">Social Responsibility Signups</option>
                  <option value="governance" className="bg-zinc-950">Governance Compliance Issues</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-zinc-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-400">Format</label>
              <div className="relative">
                <select
                  value={format}
                  onChange={(e: any) => setFormat(e.target.value)}
                  className="w-full h-10 pl-3 pr-10 bg-zinc-950/20 border border-border rounded text-zinc-200 focus-visible:outline-none appearance-none cursor-pointer"
                >
                  <option value="pdf" className="bg-zinc-950">Acrobat PDF File (.pdf)</option>
                  <option value="xlsx" className="bg-zinc-950">Excel Spreadsheet (.xlsx)</option>
                  <option value="csv" className="bg-zinc-950">Comma Separated Values (.csv)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-zinc-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-400">Filter by Department</label>
              <div className="relative">
                <select
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  className="w-full h-10 pl-3 pr-10 bg-zinc-950/20 border border-border rounded text-zinc-200 focus-visible:outline-none appearance-none cursor-pointer"
                >
                  <option value="" className="bg-zinc-950">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id} className="bg-zinc-950">
                      {dept.name} ({dept.code})
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-zinc-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            leftIcon={<Download className="h-4 w-4" />}
            disabled={exportMutation.isPending}
          >
            {exportMutation.isPending ? 'Generating...' : 'Generate Export Link'}
          </Button>
        </form>

        {/* Existing reports ledger */}
        <div className="p-6 bg-card border border-border rounded-lg space-y-4">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Historical Exports</h3>
          <div className="space-y-3">
            {[
              { name: 'ESG_Summary_Q2.pdf', size: '2.4 MB', type: 'pdf' },
              { name: 'Carbon_Inventory_2026.xlsx', size: '1.2 MB', type: 'xlsx' },
              { name: 'Social_CSR_Registrations.csv', size: '340 KB', type: 'csv' },
            ].map((report, idx) => (
              <div
                key={idx}
                className="p-3 bg-zinc-950/20 border border-border rounded flex justify-between items-center text-xs"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-zinc-500" />
                  <div>
                    <h6 className="font-semibold text-zinc-300">{report.name}</h6>
                    <span className="text-[10px] text-zinc-500">{report.size}</span>
                  </div>
                </div>
                <span
                  className="text-emerald-400 hover:text-emerald-300 cursor-pointer font-medium"
                  onClick={() => {
                    // Trigger dynamic download logic using standard mock downloader fallback
                    const link = document.createElement('a');
                    link.href = `https://storage.ecosphere.com/downloads/${report.name}`;
                    link.download = report.name;
                    link.click();
                  }}
                >
                  Download
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default ReportsPage;
