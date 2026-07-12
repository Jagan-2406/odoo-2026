export interface PolicyDTO {
  id: string;
  title: string;
  code: string;
  version: string;
  category: string;
  content: string;
  effective_date: string;
  status: 'draft' | 'active' | 'archived';
  acknowledged?: boolean;
  acknowledgement_date?: string | null;
}

export interface Policy {
  id: string;
  title: string;
  code: string;
  version: string;
  category: string;
  content: string;
  effectiveDate: Date;
  status: 'draft' | 'active' | 'archived';
  acknowledged?: boolean;
  acknowledgementDate?: Date | null;
}

export interface PolicyAcknowledgementDTO {
  policy_id: string;
  employee_id: string;
  acknowledged: boolean;
  acknowledgement_date: string;
}

export interface PolicyAcknowledgement {
  policyId: string;
  employeeId: string;
  acknowledged: boolean;
  acknowledgementDate: Date;
}

export interface AuditDTO {
  id: string;
  title: string;
  auditor: string;
  date: string;
  score: number | null;
  status: 'planned' | 'in-progress' | 'completed';
  scope: string;
  findings: string | null;
}

export interface Audit {
  id: string;
  title: string;
  auditor: string;
  date: Date;
  score: number | null;
  status: 'planned' | 'in-progress' | 'completed';
  scope: string;
  findings: string | null;
}

export interface ComplianceIssueDTO {
  id: string;
  title: string;
  description: string;
  audit_id: string | null;
  severity: 'low' | 'medium' | 'high' | 'critical';
  owner_id: string;
  owner_name: string;
  due_date: string;
  status: 'open' | 'in-progress' | 'resolved';
  date_raised: string;
}

export interface ComplianceIssue {
  id: string;
  title: string;
  description: string;
  auditId: string | null;
  severity: 'low' | 'medium' | 'high' | 'critical';
  ownerId: string;
  ownerName: string;
  dueDate: Date;
  status: 'open' | 'in-progress' | 'resolved';
  dateRaised: Date;
}

export interface ComplianceIssueForm {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  ownerId: string;
  dueDate: string;
  auditId?: string | null;
}
