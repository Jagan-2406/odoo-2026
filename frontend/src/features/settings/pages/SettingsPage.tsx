import React from 'react';
import { PageContainer, PageHeader } from '../../../components/layout/AppLayout';
import { Button } from '../../../components/common/Button';

export const SettingsPage = () => {
  return (
    <PageContainer>
      <PageHeader
        title="Settings"
        description="Configure ESG score metrics weights, notifications channels, and profiles."
      />

      <div className="max-w-3xl bg-card border border-border rounded-lg p-6 space-y-6">
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Pillar Score Weights configuration</h3>
        
        {/* Mock settings sliders */}
        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-semibold text-zinc-300">
              <span>Environmental Factor Weight</span>
              <span>40%</span>
            </div>
            <div className="h-1 bg-zinc-850 rounded-full">
              <div className="h-full bg-emerald-500 rounded-full w-[40%]" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-semibold text-zinc-300">
              <span>Social Factor Weight</span>
              <span>30%</span>
            </div>
            <div className="h-1 bg-zinc-850 rounded-full">
              <div className="h-full bg-violet-500 rounded-full w-[30%]" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-semibold text-zinc-300">
              <span>Governance Factor Weight</span>
              <span>30%</span>
            </div>
            <div className="h-1 bg-zinc-850 rounded-full">
              <div className="h-full bg-amber-500 rounded-full w-[30%]" />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border flex justify-end gap-3">
          <Button variant="outline">Reset Defaults</Button>
          <Button variant="primary">Save Configuration</Button>
        </div>
      </div>
    </PageContainer>
  );
};
export default SettingsPage;
