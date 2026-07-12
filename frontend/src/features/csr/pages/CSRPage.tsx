import React from 'react';
import { PageContainer, PageHeader } from '../../../components/layout/AppLayout';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { Users, Plus, Check, X, ShieldAlert } from 'lucide-react';
import { useCSRActivities, useCSRParticipations, useSubmitCSRParticipation, useApproveCSRParticipation } from '../hooks/useCSR';
import { useRoleContext } from '../../../context/RoleContext';
import { useEmployees } from '../../dashboard/hooks/useDashboard';

export const CSRPage = () => {
  const { role } = useRoleContext();
  const { data: employees = [] } = useEmployees();
  const { data: activities = [], isLoading: isActivitiesLoading } = useCSRActivities();
  const { data: participations = [], isLoading: isPartsLoading } = useCSRParticipations();

  const submitPartMutation = useSubmitCSRParticipation();
  const approvePartMutation = useApproveCSRParticipation();

  // Identify current employee based on active role context
  const currentEmployee = employees.find(e => 
    role === 'admin' ? e.email.includes('nova') :
    role === 'auditor' ? e.email.includes('jagan') :
    e.email.includes('komal')
  );

  const handleRegister = (activityId: string) => {
    if (!currentEmployee) return;
    submitPartMutation.mutate({
      activityId,
      employeeId: currentEmployee.id,
      proofFile: null, // trigger will allow empty if settings permit or default
    });
  };

  const handleApproval = (partId: string, status: 'approved' | 'rejected') => {
    approvePartMutation.mutate({
      id: partId,
      status,
    });
  };

  const isRegistered = (activityId: string) => {
    if (!currentEmployee) return false;
    return participations.some(p => p.activityId === activityId && p.employeeId === currentEmployee.id);
  };

  const getParticipationStatus = (activityId: string) => {
    if (!currentEmployee) return '';
    const part = participations.find(p => p.activityId === activityId && p.employeeId === currentEmployee.id);
    return part ? part.status : '';
  };

  return (
    <PageContainer>
      <PageHeader
        title="Social Responsibility"
        description="Monitor company sponsored CSR volunteering events and employee signups."
      />

      {/* Activities Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
          <Users className="h-4.5 w-4.5 text-zinc-500" /> Active Volunteering Campaigns
        </h3>

        {isActivitiesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-zinc-900 border border-border rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activities.map((activity) => {
              const registered = isRegistered(activity.id);
              const status = getParticipationStatus(activity.id);

              return (
                <div key={activity.id} className="p-6 bg-card border border-border rounded-lg flex flex-col justify-between min-h-[220px]">
                  <div className="space-y-2">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-violet-500/10 text-violet-400 border border-violet-500/20">
                      {activity.categoryName || 'Community Volunteer'}
                    </span>
                    <h4 className="text-base font-semibold text-zinc-100">{activity.title}</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {activity.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/40 text-xs">
                    <span className="text-zinc-500 font-medium">Earn +{activity.pointsAwarded} XP</span>
                    {registered ? (
                      <Badge variant={status === 'approved' ? 'success' : status === 'rejected' ? 'error' : 'warning'}>
                        {status === 'approved' ? 'Approved' : status === 'rejected' ? 'Rejected' : 'Pending'}
                      </Badge>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleRegister(activity.id)}
                        disabled={submitPartMutation.isPending}
                      >
                        Register
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Admin Review Queue (Visible to Admin role) */}
      {role === 'admin' && (
        <div className="p-6 bg-card border border-border rounded-lg space-y-4">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
            Employee Signups & Approvals Queue
          </h3>
          {isPartsLoading ? (
            <div className="space-y-3">
              {[...Array(2)].map((_, idx) => (
                <div key={idx} className="h-12 bg-zinc-950/40 rounded border border-border/40 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {participations.filter(p => p.status === 'pending').length === 0 ? (
                <p className="text-xs text-zinc-500 italic">No pending signup requests.</p>
              ) : (
                participations
                  .filter(p => p.status === 'pending')
                  .map((part) => {
                    const empObj = employees.find(e => e.id === part.employeeId);
                    const actObj = activities.find(a => a.id === part.activityId);

                    return (
                      <div key={part.id} className="p-4 bg-zinc-950/20 border border-border rounded flex justify-between items-center text-xs">
                        <div>
                          <h6 className="font-semibold text-zinc-300">
                            {empObj?.name || 'Unknown Employee'} &rarr; {actObj?.title || 'CSR Activity'}
                          </h6>
                          <span className="text-[10px] text-zinc-500">Submitted proof details via database triggers</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-emerald-400 hover:bg-emerald-500/10 p-1"
                            onClick={() => handleApproval(part.id, 'approved')}
                            disabled={approvePartMutation.isPending}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:bg-red-500/10 p-1"
                            onClick={() => handleApproval(part.id, 'rejected')}
                            disabled={approvePartMutation.isPending}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          )}
        </div>
      )}
    </PageContainer>
  );
};

export default CSRPage;
