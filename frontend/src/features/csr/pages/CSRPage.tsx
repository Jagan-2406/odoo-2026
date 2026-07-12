import React from 'react';
import { PageContainer, PageHeader } from '../../../components/layout/AppLayout';
import { Button } from '../../../components/common/Button';
import { Users, Plus } from 'lucide-react';

export const CSRPage = () => {
  return (
    <PageContainer>
      <PageHeader
        title="Social Responsibility"
        description="Monitor company sponsored CSR volunteering events and employee signups."
        action={
          <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
            Create Activity
          </Button>
        }
      />

      {/* CSR Grid placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, idx) => (
          <div key={idx} className="p-6 bg-card border border-border rounded-lg flex flex-col justify-between min-h-[200px]">
            <div className="space-y-2">
              <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-violet-500/10 text-violet-400 border border-violet-500/20">
                Community Volunteer
              </span>
              <h4 className="text-base font-semibold text-zinc-100">Simulated CSR Campaign #{idx + 1}</h4>
              <p className="text-xs text-zinc-400">
                Participate in local eco-drives and community reforestation works with teams.
              </p>
            </div>
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/40 text-xs">
              <span className="text-zinc-500 font-medium">Earn +150 Points</span>
              <Button variant="outline" size="sm">Register</Button>
            </div>
          </div>
        ))}
      </div>

      {/* Skeletons list */}
      <div className="p-6 bg-card border border-border rounded-lg space-y-4">
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Employee Signups & Approvals Queue</h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="h-12 bg-zinc-950/40 rounded border border-border/40 flex items-center px-4 gap-4 animate-pulse">
              <div className="h-4 w-1/4 bg-zinc-800 rounded" />
              <div className="h-4 w-12 bg-zinc-800 rounded" />
              <div className="h-4.5 w-12 bg-zinc-800 rounded ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
};
export default CSRPage;
