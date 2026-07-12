import { Department, DepartmentDTO } from '../../models/department';
import { Employee, EmployeeDTO } from '../../models/employee';
import { CarbonTransaction, CarbonTransactionDTO, EmissionFactor, EmissionFactorDTO, EnvironmentalGoal, EnvironmentalGoalDTO } from '../../models/carbon';
import { CSRActivity, CSRActivityDTO, CSRParticipation, CSRParticipationDTO } from '../../models/csr';
import { Challenge, ChallengeDTO, ChallengeParticipation, ChallengeParticipationDTO } from '../../models/challenge';
import { Badge, BadgeDTO, Reward, RewardDTO } from '../../models/gamification';
import { Policy, PolicyDTO, Audit, AuditDTO, ComplianceIssue, ComplianceIssueDTO } from '../../models/governance';
import { Notification, NotificationDTO } from '../../models/notification';
import { Settings, SettingsDTO } from '../../models/settings';

// Department adapter
export const mapDepartment = (dto: DepartmentDTO): Department => ({
  id: dto.id,
  name: dto.name,
  code: dto.code,
  headId: dto.head_id,
  headName: dto.head_name,
  parentDepartmentId: dto.parent_department_id,
  employeeCount: dto.employee_count,
  status: dto.status,
});

// Employee adapter
export const mapEmployee = (dto: EmployeeDTO): Employee => ({
  id: dto.id,
  name: dto.name,
  email: dto.email,
  avatarUrl: dto.avatar_url,
  departmentId: dto.department_id,
  xp: dto.xp,
  points: dto.points,
  rank: dto.rank,
  role: dto.role,
});

// Emission Factor adapter
export const mapEmissionFactor = (dto: EmissionFactorDTO): EmissionFactor => ({
  id: dto.id,
  name: dto.name,
  factor: dto.factor,
  unit: dto.unit,
  status: dto.status,
});

// Carbon Transaction adapter
export const mapCarbonTransaction = (dto: CarbonTransactionDTO): CarbonTransaction => ({
  id: dto.id,
  date: new Date(dto.date),
  source: dto.source,
  activityValue: dto.activity_value,
  unit: dto.unit,
  calculatedEmissions: dto.calculated_emissions,
  departmentId: dto.department_id,
  recordedBy: dto.recorded_by,
  emissionFactor: mapEmissionFactor(dto.emission_factor),
});

// Environmental Goal adapter
export const mapEnvironmentalGoal = (dto: EnvironmentalGoalDTO): EnvironmentalGoal => ({
  id: dto.id,
  name: dto.name,
  category: dto.category,
  targetValue: dto.target_value,
  currentValue: dto.current_value,
  unit: dto.unit,
  startDate: new Date(dto.start_date),
  targetDate: new Date(dto.target_date),
  status: dto.status,
});

// CSR Activity adapter
export const mapCSRActivity = (dto: CSRActivityDTO): CSRActivity => ({
  id: dto.id,
  title: dto.title,
  description: dto.description,
  categoryId: dto.category_id,
  categoryName: dto.category_name,
  date: new Date(dto.date),
  status: dto.status,
  targetParticipants: dto.target_participants,
  currentParticipants: dto.current_participants,
  pointsAwarded: dto.points_awarded,
});

// CSR Participation adapter
export const mapCSRParticipation = (dto: CSRParticipationDTO): CSRParticipation => ({
  id: dto.id,
  activityId: dto.activity_id,
  employeeId: dto.employee_id,
  proofUrl: dto.proof_url,
  status: dto.status,
  completionDate: dto.completion_date ? new Date(dto.completion_date) : null,
  pointsEarned: dto.points_earned,
});

// Challenge adapter
export const mapChallenge = (dto: ChallengeDTO): Challenge => ({
  id: dto.id,
  title: dto.title,
  description: dto.description,
  categoryId: dto.category_id,
  xp: dto.xp,
  difficulty: dto.difficulty,
  evidenceRequired: dto.evidence_required,
  deadline: new Date(dto.deadline),
  status: dto.status,
});

// Challenge Participation adapter
export const mapChallengeParticipation = (dto: ChallengeParticipationDTO): ChallengeParticipation => ({
  id: dto.id,
  challengeId: dto.challenge_id,
  employeeId: dto.employee_id,
  progress: dto.progress,
  proofUrl: dto.proof_url,
  status: dto.status,
  completionDate: dto.completion_date ? new Date(dto.completion_date) : null,
  xpAwarded: dto.xp_awarded,
});

// Badge adapter
export const mapBadge = (dto: BadgeDTO): Badge => ({
  id: dto.id,
  name: dto.name,
  description: dto.description,
  unlockRule: dto.unlock_rule,
  icon: dto.icon,
  active: dto.active,
  unlockedAt: dto.unlocked_at ? new Date(dto.unlocked_at) : undefined,
});

// Reward adapter
export const mapReward = (dto: RewardDTO): Reward => ({
  id: dto.id,
  name: dto.name,
  description: dto.description,
  pointsRequired: dto.points_required,
  stock: dto.stock,
  status: dto.status,
  imageUrl: dto.image_url,
});

// Policy adapter
export const mapPolicy = (dto: PolicyDTO): Policy => ({
  id: dto.id,
  title: dto.title,
  code: dto.code,
  version: dto.version,
  category: dto.category,
  content: dto.content,
  effectiveDate: new Date(dto.effective_date),
  status: dto.status,
  acknowledged: dto.acknowledged,
  acknowledgementDate: dto.acknowledgement_date ? new Date(dto.acknowledgement_date) : null,
});

// Audit adapter
export const mapAudit = (dto: AuditDTO): Audit => ({
  id: dto.id,
  title: dto.title,
  auditor: dto.auditor,
  date: new Date(dto.date),
  score: dto.score,
  status: dto.status,
  scope: dto.scope,
  findings: dto.findings,
});

// Compliance Issue adapter
export const mapComplianceIssue = (dto: ComplianceIssueDTO): ComplianceIssue => ({
  id: dto.id,
  title: dto.title,
  description: dto.description,
  auditId: dto.audit_id,
  severity: dto.severity,
  ownerId: dto.owner_id,
  ownerName: dto.owner_name,
  dueDate: new Date(dto.due_date),
  status: dto.status,
  dateRaised: new Date(dto.date_raised),
});

// Notification adapter
export const mapNotification = (dto: NotificationDTO): Notification => ({
  id: dto.id,
  employeeId: dto.employee_id,
  title: dto.title,
  message: dto.message,
  category: dto.category,
  date: new Date(dto.date),
  isRead: dto.is_read,
});

// Settings adapter
export const mapSettings = (dto: SettingsDTO): Settings => ({
  envWeight: dto.env_weight,
  socialWeight: dto.social_weight,
  govWeight: dto.gov_weight,
  autoCalculateEmissions: dto.auto_calculate_emissions,
  evidenceRequired: dto.evidence_required,
  badgeAutoAward: dto.badge_auto_award,
  emailNotifications: dto.email_notifications,
  inAppNotifications: dto.in_app_notifications,
});
