import React, { useState } from 'react';
import { PageContainer, PageHeader } from '../../../components/layout/AppLayout';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { Shield, Plus, X, AlertOctagon, CheckCircle } from 'lucide-react';
import {
  usePolicies,
  useAudits,
  useComplianceIssues,
  useAcknowledgePolicy,
  useCreateComplianceIssue,
  useUpdateComplianceIssueStatus,
} from '../hooks/useGovernance';
import { useRoleContext } from '../../../context/RoleContext';
import { useEmployees } from '../../dashboard/hooks/useDashboard';

export const GovernancePage = () => {
  const { role } = useRoleContext();
  const { data: employees = [] } = useEmployees();

  // Resolve current active employee
  const currentEmployee = employees.find((e) =>
    role === 'admin' ? e.email.includes('nova') :
    role === 'auditor' ? e.email.includes('jagan') :
    e.email.includes('komal')
  );

  const { data: policies = [], isLoading: isPoliciesLoading } = usePolicies(currentEmployee?.id);
  const { data: audits = [], isLoading: isAuditsLoading } = useAudits();
  const { data: complianceIssues = [], isLoading: isIssuesLoading } = useComplianceIssues();

  const acknowledgeMutation = useAcknowledgePolicy();
  const createIssueMutation = useCreateComplianceIssue();
  const updateIssueStatusMutation = useUpdateComplianceIssueStatus();

  // Dialog / Modal Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formSeverity, setFormSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [formOwner, setFormOwner] = useState('');
  const [formDueDate, setFormDueDate] = useState('');

  const handleAcknowledge = (policyId: string) => {
    if (!currentEmployee) return;
    acknowledgeMutation.mutate({
      policyId,
      employeeId: currentEmployee.id,
    });
  };

  const handleReportIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEmployee || !formTitle || !formOwner || !formDueDate) return;

    createIssueMutation.mutate(
      {
        data: {
          title: formTitle,
          description: formDesc,
          severity: formSeverity,
          ownerId: formOwner,
          dueDate: formDueDate,
        },
        reporterId: currentEmployee.id,
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setFormTitle('');
          setFormDesc('');
          setFormSeverity('medium');
          setFormOwner('');
          setFormDueDate('');
        },
      }
    );
  };

  const handleToggleStatus = (issueId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'open' ? 'in-progress' : currentStatus === 'in-progress' ? 'resolved' : 'open';
    updateIssueStatusMutation.mutate({
      id: issueId,
      status: nextStatus,
    });
  };

  return (
    <PageContainer>
      <PageHeader
        title="Governance & Compliance"
        description="Verify corporate policies, audit checklists, and log compliance tickets."
        action={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => setIsModalOpen(true)}
          >
            Report Issue
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Policies checklist */}
        <div className="lg:col-span-2 p-6 bg-card border border-border rounded-lg space-y-4">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <Shield className="h-4.5 w-4.5 text-zinc-500" /> Corporate Policy Sign-offs
          </h3>
          {isPoliciesLoading ? (
            <div className="divide-y divide-border/40 animate-pulse">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="py-3 h-12 bg-zinc-900 rounded my-2" />
              ))}
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {policies.map((policy) => (
                <div key={policy.id} className="py-4 flex items-center justify-between gap-4">
                  <div>
                    <h5 className="text-sm font-semibold text-zinc-200">{policy.title}</h5>
                    <span className="text-[10px] text-zinc-500 font-mono">{policy.code}</span>
                  </div>
                  {policy.acknowledged ? (
                    <Badge variant="success">
                      <CheckCircle className="h-3 w-3 inline-block mr-1" /> Signed
                    </Badge>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAcknowledge(policy.id)}
                      disabled={acknowledgeMutation.isPending}
                    >
                      Sign / Acknowledge
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Audits status */}
        <div className="p-6 bg-card border border-border rounded-lg space-y-4 h-fit">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">System Audits</h3>
          {isAuditsLoading ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-16 bg-zinc-900 border border-border rounded" />
            </div>
          ) : (
            <div className="space-y-3">
              {audits.map((audit) => (
                <div key={audit.id} className="p-3 bg-zinc-950/20 border border-border rounded flex justify-between items-center text-xs">
                  <div>
                    <h6 className="font-semibold text-zinc-300">{audit.title}</h6>
                    <span className="text-[10px] text-zinc-500">{audit.auditor}</span>
                  </div>
                  <Badge variant={audit.status === 'completed' ? 'success' : 'warning'}>
                    {audit.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Compliance issues table */}
      <div className="p-6 bg-card border border-border rounded-lg space-y-4">
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
          Compliance Issues logs
        </h3>

        {isIssuesLoading ? (
          <div className="border border-border/60 rounded-lg divide-y divide-border/40 overflow-hidden animate-pulse">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-12 bg-zinc-900" />
            ))}
          </div>
        ) : (
          <div className="border border-border/60 rounded-lg divide-y divide-border/40 overflow-hidden text-xs">
            {complianceIssues.length === 0 ? (
              <p className="p-6 text-zinc-500 italic text-center">No compliance issues logged.</p>
            ) : (
              complianceIssues.map((issue) => (
                <div key={issue.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h5 className="font-semibold text-zinc-200 text-sm">{issue.title}</h5>
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                        {issue.severity}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-[11px] leading-normal max-w-xl">{issue.description}</p>
                    <div className="flex items-center gap-4 text-[10px] text-zinc-500">
                      <span>Owner: {issue.ownerName}</span>
                      <span>Due: {new Date(issue.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={issue.status === 'resolved' ? 'success' : issue.status === 'in-progress' ? 'warning' : 'error'}>
                      {issue.status}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(issue.id, issue.status)}
                      disabled={updateIssueStatusMutation.isPending}
                    >
                      Change Status
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Modal / Dialog for Reporting Issue */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <h3 className="font-semibold text-zinc-100 flex items-center gap-2">
                <AlertOctagon className="h-4.5 w-4.5 text-zinc-400" /> Log Compliance Ticket
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-500 hover:text-zinc-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleReportIssue} className="space-y-3.5 text-xs text-zinc-300">
              <div className="flex flex-col gap-1">
                <label className="font-medium text-zinc-400">Issue Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Incomplete HVAC filtering check"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="h-9 bg-zinc-950/40 border border-border rounded px-3 text-zinc-200 focus-visible:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-medium text-zinc-400">Description</label>
                <textarea
                  placeholder="Describe the compliance issue details..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="h-20 bg-zinc-950/40 border border-border rounded p-3 text-zinc-200 focus-visible:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-medium text-zinc-400">Severity Priority</label>
                  <div className="relative">
                    <select
                      value={formSeverity}
                      onChange={(e: any) => setFormSeverity(e.target.value)}
                      className="w-full h-9 pl-3 pr-8 bg-zinc-950/40 border border-border rounded text-zinc-200 focus-visible:outline-none appearance-none cursor-pointer"
                    >
                      <option value="low" className="bg-zinc-950">Low</option>
                      <option value="medium" className="bg-zinc-950">Medium</option>
                      <option value="high" className="bg-zinc-950">High</option>
                      <option value="critical" className="bg-zinc-950">Critical</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-zinc-400">
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-medium text-zinc-400">Owner Assignee</label>
                  <div className="relative">
                    <select
                      required
                      value={formOwner}
                      onChange={(e) => setFormOwner(e.target.value)}
                      className="w-full h-9 pl-3 pr-8 bg-zinc-950/40 border border-border rounded text-zinc-200 focus-visible:outline-none appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-zinc-950">Select Employee...</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id} className="bg-zinc-950">
                          {emp.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-zinc-400">
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-medium text-zinc-400">Due Date</label>
                <input
                  type="date"
                  required
                  value={formDueDate}
                  onChange={(e) => setFormDueDate(e.target.value)}
                  className="h-9 bg-zinc-950/40 border border-border rounded px-3 text-zinc-200 focus-visible:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={createIssueMutation.isPending}
                >
                  Submit Issue
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default GovernancePage;
