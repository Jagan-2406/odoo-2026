import React from 'react';
import { PageContainer, PageHeader } from '../../../components/layout/AppLayout';
import { Button } from '../../../components/common/Button';
import { Shield, Plus } from 'lucide-react';

export const GovernancePage = () => {
  return (
    <PageContainer>
      <PageHeader
        title="Governance & Compliance"
        description="Verify corporate policies, audit checklists, and log compliance tickets."
        action={
          <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
            Report Issue
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Policies checklist */}
        <div className="lg:col-span-2 p-6 bg-card border border-border rounded-lg space-y-4">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Corporate Policy Sign-offs</h3>
          <div className="divide-y divide-border/40">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between">
                <div>
                  <h5 className="text-sm font-semibold text-zinc-200">Anti-Corruption Protocol v2.{idx}</h5>
                  <span className="text-[10px] text-zinc-500 font-medium">POL-ABC-{100 + idx}</span>
                </div>
                <Button variant="outline" size="sm">Acknowledge</Button>
              </div>
            ))}
          </div>
        </div>

        {/* Audits status */}
        <div className="p-6 bg-card border border-border rounded-lg space-y-4">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">System Audits Schedule</h3>
          <div className="space-y-3">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="p-3 bg-zinc-950/20 border border-border rounded flex justify-between items-center text-xs">
                <div>
                  <h6 className="font-semibold text-zinc-300">ISO 14001 Pre-check</h6>
                  <span className="text-[10px] text-zinc-500">Bureau Veritas</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">Planned</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compliance issues table placeholder */}
      <div className="p-6 bg-card border border-border rounded-lg space-y-4">
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Open Compliance Issues Logs</h3>
        <div className="border border-border/60 rounded-lg divide-y divide-border/40 overflow-hidden">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="h-12 flex items-center px-6 gap-4 animate-pulse">
              <div className="h-4 w-1/3 bg-zinc-800 rounded" />
              <div className="h-4 w-16 bg-zinc-800 rounded" />
              <div className="h-4 w-20 bg-zinc-800 rounded ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
};
export default GovernancePage;
