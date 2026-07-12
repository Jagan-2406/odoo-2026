import React from 'react';
import { PageContainer, PageHeader } from '../../../components/layout/AppLayout';
import { Button } from '../../../components/common/Button';
import { Download } from 'lucide-react';

export const ReportsPage = () => {
  return (
    <PageContainer>
      <PageHeader
        title="Analytics & Reports"
        description="Compile summary sheets, filter carbon logs, and generate PDF/CSV reports."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Custom report builder form */}
        <div className="lg:col-span-2 p-6 bg-card border border-border rounded-lg space-y-6">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Custom Report Builder</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-400">Report Scope</label>
              <div className="h-10 bg-zinc-950/20 border border-border rounded" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-400">Format</label>
              <div className="h-10 bg-zinc-950/20 border border-border rounded" />
            </div>
          </div>
          <Button variant="primary" size="md" leftIcon={<Download className="h-4 w-4" />}>
            Generate Export Link
          </Button>
        </div>

        {/* Existing reports ledger */}
        <div className="p-6 bg-card border border-border rounded-lg space-y-4">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Historical Exports</h3>
          <div className="space-y-3">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="p-3 bg-zinc-950/20 border border-border rounded flex justify-between items-center text-xs">
                <div>
                  <h6 className="font-semibold text-zinc-300">ESG_Summary_Q2.pdf</h6>
                  <span className="text-[10px] text-zinc-500">2.4 MB</span>
                </div>
                <span className="text-emerald-400 cursor-pointer">Download</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
export default ReportsPage;
