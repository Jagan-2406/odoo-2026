import { GovernanceRepository } from '../../repositories/governance.repository';
import { Policy, Audit, ComplianceIssue, ComplianceIssueForm } from '../../models/governance';
import { mockStorage } from '../mockStorage';
import { simulateNetwork } from '../mockNetwork';
import { mapPolicy, mapAudit, mapComplianceIssue } from '../adapters';
import { mockLogger } from '../mockLogger';
import { generateUUID } from '../generateUUID';

export class MockGovernanceService implements GovernanceRepository {
  async getPolicies(employeeId?: string): Promise<Policy[]> {
    mockLogger.logRequest('GET', '/api/governance/policies', { employeeId });
    await simulateNetwork();

    const db = mockStorage.getDatabase();
    
    const domainList = db.policies.map((p) => {
      const pol = mapPolicy(p);
      if (employeeId) {
        // Mock individual acknowledgement statuses
        pol.acknowledged = employeeId.charCodeAt(employeeId.length - 1) % 2 === 0;
        pol.acknowledgementDate = pol.acknowledged ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) : null;
      }
      return pol;
    });

    mockLogger.logResponse('/api/governance/policies', domainList);
    return domainList;
  }

  async acknowledgePolicy(policyId: string, employeeId: string): Promise<boolean> {
    mockLogger.logRequest('POST', `/api/governance/policies/${policyId}/acknowledge`, { employeeId });
    await simulateNetwork();

    const db = mockStorage.getDatabase();
    
    // Log verification check
    db.notifications.unshift({
      id: generateUUID(),
      employee_id: employeeId,
      title: 'Policy Acknowledged',
      message: `You successfully signed and acknowledged version compliance of policy.`,
      category: 'policy',
      date: new Date().toISOString(),
      is_read: false,
    });

    mockStorage.saveDatabase(db);
    mockLogger.logResponse(`/api/governance/policies/${policyId}/acknowledge`, true);
    return true;
  }

  async getAudits(): Promise<Audit[]> {
    mockLogger.logRequest('GET', '/api/governance/audits');
    await simulateNetwork();

    const db = mockStorage.getDatabase();
    const domainList = db.audits.map(mapAudit);
    mockLogger.logResponse('/api/governance/audits', domainList);
    return domainList;
  }

  async getComplianceIssues(filters?: { severity?: string; status?: string }): Promise<ComplianceIssue[]> {
    mockLogger.logRequest('GET', '/api/governance/compliance-issues', filters);
    await simulateNetwork();

    const db = mockStorage.getDatabase();
    let list = db.complianceIssues;

    if (filters?.severity) {
      list = list.filter((i) => i.severity === filters.severity);
    }
    if (filters?.status) {
      list = list.filter((i) => i.status === filters.status);
    }

    const domainList = list.map(mapComplianceIssue);
    mockLogger.logResponse('/api/governance/compliance-issues', domainList);
    return domainList;
  }

  async createComplianceIssue(data: ComplianceIssueForm, reporterId: string): Promise<ComplianceIssue> {
    mockLogger.logRequest('POST', '/api/governance/compliance-issues', { data, reporterId });
    await simulateNetwork();

    const db = mockStorage.getDatabase();
    const owner = db.employees.find((e) => e.id === data.ownerId);
    if (!owner) {
      throw new Error(`Owner employee with ID ${data.ownerId} not found`);
    }

    const newIssueDto = {
      id: generateUUID(),
      title: data.title,
      description: data.description,
      audit_id: data.auditId || null,
      severity: data.severity,
      owner_id: data.ownerId,
      owner_name: owner.name,
      due_date: data.dueDate,
      status: 'open' as const,
      date_raised: new Date().toISOString(),
    };

    db.complianceIssues.unshift(newIssueDto);

    // Push system alert notification
    db.notifications.unshift({
      id: generateUUID(),
      employee_id: data.ownerId,
      title: 'New Compliance Ticket Assigned',
      message: `A new ${data.severity} compliance issue has been logged: "${data.title}".`,
      category: 'compliance',
      date: new Date().toISOString(),
      is_read: false,
    });

    mockStorage.saveDatabase(db);

    const domainIssue = mapComplianceIssue(newIssueDto);
    mockLogger.logResponse('/api/governance/compliance-issues', domainIssue);
    return domainIssue;
  }

  async updateComplianceIssueStatus(issueId: string, status: 'open' | 'in-progress' | 'resolved'): Promise<ComplianceIssue> {
    mockLogger.logRequest('PATCH', `/api/governance/compliance-issues/${issueId}`, { status });
    await simulateNetwork();

    const db = mockStorage.getDatabase();
    const issue = db.complianceIssues.find((i) => i.id === issueId);
    if (!issue) {
      throw new Error(`Compliance ticket with ID ${issueId} not found`);
    }

    issue.status = status;
    mockStorage.saveDatabase(db);

    const domainIssue = mapComplianceIssue(issue);
    mockLogger.logResponse(`/api/governance/compliance-issues/${issueId}`, domainIssue);
    return domainIssue;
  }
}
export const governanceService = new MockGovernanceService();
