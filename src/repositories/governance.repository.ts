import { Policy, Audit, ComplianceIssue, ComplianceIssueForm } from '../models/governance';

export interface GovernanceRepository {
  getPolicies(employeeId?: string): Promise<Policy[]>;
  acknowledgePolicy(policyId: string, employeeId: string): Promise<boolean>;
  getAudits(): Promise<Audit[]>;
  getComplianceIssues(filters?: { severity?: string; status?: string }): Promise<ComplianceIssue[]>;
  createComplianceIssue(data: ComplianceIssueForm, reporterId: string): Promise<ComplianceIssue>;
  updateComplianceIssueStatus(issueId: string, status: 'open' | 'in-progress' | 'resolved'): Promise<ComplianceIssue>;
}
