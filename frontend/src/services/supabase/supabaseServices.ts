import { supabase } from '../supabaseClient';
import { DepartmentRepository } from '../../repositories/department.repository';
import { EmployeeRepository } from '../../repositories/employee.repository';
import { CarbonRepository } from '../../repositories/carbon.repository';
import { CSRRepository } from '../../repositories/csr.repository';
import { ChallengeRepository } from '../../repositories/challenge.repository';
import { GamificationRepository } from '../../repositories/gamification.repository';
import { GovernanceRepository } from '../../repositories/governance.repository';
import { SettingsRepository } from '../../repositories/settings.repository';
import { ReportsRepository } from '../../repositories/reports.repository';
import { NotificationRepository } from '../../repositories/notification.repository';
import { DashboardRepository } from '../../repositories/dashboard.repository';

import { Department } from '../../models/department';
import { Employee } from '../../models/employee';
import { CarbonTransaction, CarbonTransactionForm, EmissionFactor, EnvironmentalGoal } from '../../models/carbon';
import { CSRActivity, CSRParticipation } from '../../models/csr';
import { Challenge, ChallengeParticipation } from '../../models/challenge';
import { Badge, Reward } from '../../models/gamification';
import { Policy, Audit, ComplianceIssue, ComplianceIssueForm } from '../../models/governance';
import { Notification } from '../../models/notification';
import { Settings, SettingsForm } from '../../models/settings';
import { ReportBuilderForm, ExportResponse } from '../../models/reports';
import { DashboardStats, DepartmentScore } from '../../models/dashboard';

// ============================================================================
// Helper functions for dynamic resolution and files uploads
// ============================================================================

async function resolveLoggedInEmployeeId(): Promise<string> {
  const { data } = await supabase
    .from('employees')
    .select('id')
    .eq('email', 'komal@ecosphere.com')
    .maybeSingle();
  if (data?.id) return data.id;

  const { data: fallback } = await supabase
    .from('employees')
    .select('id')
    .limit(1)
    .maybeSingle();
  return fallback?.id || '00000000-0000-0000-0000-000000000000';
}

async function uploadProofFile(bucketName: string, file: File): Promise<string> {
  const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
  const { error } = await supabase.storage
    .from(bucketName)
    .upload(fileName, file);
  if (error) throw error;

  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName);
  return data.publicUrl;
}

// ============================================================================
// 1. Department Repository Implementation
// ============================================================================
export class SupabaseDepartmentService implements DepartmentRepository {
  async getDepartments(filters?: { search?: string; status?: 'active' | 'inactive' }): Promise<Department[]> {
    let query = supabase.from('departments').select('*');

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,code.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data ?? []).map((row: any) => ({
      id: row.id,
      name: row.name,
      code: row.code || '',
      headId: null,
      headName: row.head || '',
      parentDepartmentId: null,
      employeeCount: row.employee_count || 0,
      status: row.status || 'active',
    }));
  }

  async getDepartmentById(id: string): Promise<Department> {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      code: data.code || '',
      headId: null,
      headName: data.head || '',
      parentDepartmentId: null,
      employeeCount: data.employee_count || 0,
      status: data.status || 'active',
    };
  }
}

// ============================================================================
// 2. Employee Repository Implementation
// ============================================================================
export class SupabaseEmployeeService implements EmployeeRepository {
  async getEmployees(filters?: { departmentId?: string; search?: string }): Promise<Employee[]> {
    let query = supabase.from('employees').select('*');

    if (filters?.departmentId) {
      query = query.eq('department_id', filters.departmentId);
    }
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data ?? []).map((row: any, idx: number) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      avatarUrl: row.avatar_url || `https://images.unsplash.com/photo-${1500000000000 + idx * 100000}?auto=format&fit=crop&w=100&h=100`,
      departmentId: row.department_id || '',
      xp: row.total_xp || 0,
      points: row.total_xp || 0, // points map to XP in schema triggers
      rank: 1, // dynamically set rank if needed or keep static
      role: row.email.includes('sarah') ? 'admin' : (row.email.includes('elena') ? 'auditor' : 'employee'),
    }));
  }

  async getEmployeeById(id: string): Promise<Employee> {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      avatarUrl: null,
      departmentId: data.department_id || '',
      xp: data.total_xp || 0,
      points: data.total_xp || 0,
      rank: 1,
      role: data.email.includes('sarah') ? 'admin' : (data.email.includes('elena') ? 'auditor' : 'employee'),
    };
  }
}

// ============================================================================
// 3. Carbon Repository Implementation
// ============================================================================
export class SupabaseCarbonService implements CarbonRepository {
  async getCarbonTransactions(filters?: {
    startDate?: string;
    endDate?: string;
    source?: 'purchase' | 'manufacturing' | 'expense' | 'fleet';
    departmentId?: string;
  }): Promise<CarbonTransaction[]> {
    let query = supabase
      .from('carbon_transactions')
      .select('*, emission_factors(*)');

    if (filters?.source) {
      query = query.eq('source_type', filters.source);
    }
    if (filters?.departmentId) {
      query = query.eq('department_id', filters.departmentId);
    }
    if (filters?.startDate) {
      query = query.gte('date', filters.startDate);
    }
    if (filters?.endDate) {
      query = query.lte('date', filters.endDate);
    }

    // Sort descending by date
    query = query.order('date', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;

    return (data ?? []).map((row: any) => {
      const factor = row.emission_factors || { activity_name: 'Unknown factor', co2_factor: 1, unit: 'unit' };
      return {
        id: row.id,
        date: new Date(row.date),
        source: row.source_type,
        activityValue: Number(row.quantity),
        unit: row.unit || factor.unit || 'unit',
        calculatedEmissions: Number(row.calculated_co2 || 0),
        departmentId: row.department_id || '',
        recordedBy: '',
        emissionFactor: {
          id: factor.id || '',
          name: factor.activity_name,
          factor: Number(factor.co2_factor),
          unit: factor.unit || 'unit',
          status: 'active',
        },
      };
    });
  }

  async getEmissionFactors(): Promise<EmissionFactor[]> {
    const { data, error } = await supabase.from('emission_factors').select('*');
    if (error) throw error;

    return (data ?? []).map((row: any) => ({
      id: row.id,
      name: row.activity_name,
      factor: Number(row.co2_factor),
      unit: row.unit || 'unit',
      status: 'active',
    }));
  }

  async getEnvironmentalGoals(): Promise<EnvironmentalGoal[]> {
    const { data: goals, error: goalsError } = await supabase.from('environmental_goals').select('*');
    if (goalsError) throw goalsError;

    // Fetch transactions to calculate actual currentValue dynamically
    const { data: txs, error: txsError } = await supabase.from('carbon_transactions').select('calculated_co2, source_type');
    if (txsError) throw txsError;

    return (goals ?? []).map((g: any) => {
      const category = g.goal_name.toLowerCase().includes('fleet') ? 'Emissions' : 'Electricity';
      const sum = (txs ?? [])
        .filter((t: any) => category === 'Emissions' ? t.source_type === 'fleet' : t.source_type === 'purchase')
        .reduce((acc: number, t: any) => acc + Number(t.calculated_co2 || 0), 0);

      return {
        id: g.id,
        name: g.goal_name,
        category,
        targetValue: Number(g.target_value || 0),
        currentValue: Number(sum.toFixed(1)),
        unit: category === 'Emissions' ? 'kg CO2e' : 'kWh',
        startDate: new Date(g.start_date),
        targetDate: new Date(g.end_date),
        status: g.status || 'in-progress',
      };
    });
  }

  async createCarbonTransaction(data: CarbonTransactionForm): Promise<CarbonTransaction> {
    const defaultEmployeeId = await resolveLoggedInEmployeeId();
    
    // Calculated CO2 is computed by trg_calc_co2 before insert, we don't have to calculate manually!
    const { data: insertData, error: insertError } = await supabase
      .from('carbon_transactions')
      .insert({
        source_type: data.source,
        reference: `Ref-${Date.now()}`,
        department_id: data.departmentId,
        quantity: data.activityValue,
        emission_factor_id: data.emissionFactorId,
        date: data.date || new Date().toISOString().split('T')[0],
      })
      .select('*, emission_factors(*)')
      .single();

    if (insertError) throw insertError;

    const row = insertData;
    const factor = row.emission_factors || { activity_name: 'Unknown', co2_factor: 1, unit: 'unit' };

    return {
      id: row.id,
      date: new Date(row.date),
      source: row.source_type,
      activityValue: Number(row.quantity),
      unit: row.unit || factor.unit || 'unit',
      calculatedEmissions: Number(row.calculated_co2 || 0),
      departmentId: row.department_id || '',
      recordedBy: defaultEmployeeId,
      emissionFactor: {
        id: factor.id || '',
        name: factor.activity_name,
        factor: Number(factor.co2_factor),
        unit: factor.unit || 'unit',
        status: 'active',
      },
    };
  }
}

// ============================================================================
// 4. CSR Repository Implementation
// ============================================================================
export class SupabaseCSRService implements CSRRepository {
  async getCSRActivities(filters?: { categoryId?: string; status?: string }): Promise<CSRActivity[]> {
    let query = supabase.from('csr_activities').select('*, categories(*)');

    if (filters?.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Fetch all approved participations to count actual participants dynamically
    const { data: parts } = await supabase
      .from('employee_participation')
      .select('csr_activity_id')
      .eq('approval_status', 'approved');

    return (data ?? []).map((row: any) => {
      const cat = row.categories || { name: 'Social Responsibility' };
      const currentParticipants = (parts ?? []).filter((p: any) => p.csr_activity_id === row.id).length;

      return {
        id: row.id,
        title: row.name,
        description: row.description || '',
        categoryId: row.category_id || '',
        categoryName: cat.name,
        date: new Date(row.start_date || row.end_date),
        status: row.status || 'active',
        targetParticipants: 50,
        currentParticipants,
        pointsAwarded: 50, // default reward XP in triggers
      };
    });
  }

  async getCSRActivityById(id: string): Promise<CSRActivity> {
    const { data, error } = await supabase
      .from('csr_activities')
      .select('*, categories(*)')
      .eq('id', id)
      .single();
    if (error) throw error;

    const { count } = await supabase
      .from('employee_participation')
      .select('*', { count: 'exact', head: true })
      .eq('csr_activity_id', id)
      .eq('approval_status', 'approved');

    const cat = data.categories || { name: 'Social Responsibility' };

    return {
      id: data.id,
      title: data.name,
      description: data.description || '',
      categoryId: data.category_id || '',
      categoryName: cat.name,
      date: new Date(data.start_date || data.end_date),
      status: data.status || 'active',
      targetParticipants: 50,
      currentParticipants: count || 0,
      pointsAwarded: 50,
    };
  }

  async getParticipationsByActivityId(activityId: string): Promise<CSRParticipation[]> {
    const { data, error } = await supabase
      .from('employee_participation')
      .select('*')
      .eq('csr_activity_id', activityId);
    if (error) throw error;

    return (data ?? []).map((row: any) => ({
      id: row.id,
      activityId: row.csr_activity_id,
      employeeId: row.employee_id,
      proofUrl: row.proof_url || null,
      status: row.approval_status,
      completionDate: row.approval_status === 'approved' ? new Date() : null,
      pointsEarned: row.xp_earned || 0,
    }));
  }

  async getAllParticipations(): Promise<CSRParticipation[]> {
    const { data, error } = await supabase.from('employee_participation').select('*');
    if (error) throw error;

    return (data ?? []).map((row: any) => ({
      id: row.id,
      activityId: row.csr_activity_id,
      employeeId: row.employee_id,
      proofUrl: row.proof_url || null,
      status: row.approval_status,
      completionDate: row.approval_status === 'approved' ? new Date() : null,
      pointsEarned: row.xp_earned || 0,
    }));
  }

  async submitParticipation(activityId: string, employeeId: string, proofFile: File | null): Promise<CSRParticipation> {
    let proofUrl = null;
    if (proofFile) {
      try {
        proofUrl = await uploadProofFile('proofs', proofFile);
      } catch (err) {
        console.error('File upload failed, proceeding without proof URL: ', err);
      }
    }

    // Check if participation exists
    const { data: existing } = await supabase
      .from('employee_participation')
      .select('*')
      .eq('csr_activity_id', activityId)
      .eq('employee_id', employeeId)
      .maybeSingle();

    let row;
    if (existing) {
      const { data, error } = await supabase
        .from('employee_participation')
        .update({
          proof_url: proofUrl || existing.proof_url,
          approval_status: 'pending',
        })
        .eq('id', existing.id)
        .select('*')
        .single();
      if (error) throw error;
      row = data;
    } else {
      const { data, error } = await supabase
        .from('employee_participation')
        .insert({
          csr_activity_id: activityId,
          employee_id: employeeId,
          proof_url: proofUrl,
          approval_status: 'pending',
        })
        .select('*')
        .single();
      if (error) throw error;
      row = data;
    }

    return {
      id: row.id,
      activityId: row.csr_activity_id,
      employeeId: row.employee_id,
      proofUrl: row.proof_url,
      status: row.approval_status,
      completionDate: null,
      pointsEarned: 0,
    };
  }

  async approveParticipation(participationId: string, status: 'approved' | 'rejected'): Promise<CSRParticipation> {
    const { data, error } = await supabase
      .from('employee_participation')
      .update({
        approval_status: status,
      })
      .eq('id', participationId)
      .select('*')
      .single();

    if (error) throw error;

    return {
      id: data.id,
      activityId: data.csr_activity_id,
      employeeId: data.employee_id,
      proofUrl: data.proof_url || null,
      status: data.approval_status,
      completionDate: data.approval_status === 'approved' ? new Date() : null,
      pointsEarned: data.xp_earned || 0,
    };
  }
}

// ============================================================================
// 5. Challenge Repository Implementation
// ============================================================================
export class SupabaseChallengeService implements ChallengeRepository {
  async getChallenges(filters?: { status?: string }): Promise<Challenge[]> {
    let query = supabase.from('challenges').select('*');
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data ?? []).map((row: any) => ({
      id: row.id,
      title: row.title,
      description: row.description || '',
      categoryId: '',
      xp: row.xp || 100,
      difficulty: 'medium',
      evidenceRequired: true,
      deadline: new Date(row.deadline),
      status: row.status || 'active',
    }));
  }

  async getChallengeById(id: string): Promise<Challenge> {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;

    return {
      id: data.id,
      title: data.title,
      description: data.description || '',
      categoryId: '',
      xp: data.xp || 100,
      difficulty: 'medium',
      evidenceRequired: true,
      deadline: new Date(data.deadline),
      status: data.status || 'active',
    };
  }

  async getParticipationsByEmployeeId(employeeId: string): Promise<ChallengeParticipation[]> {
    const { data, error } = await supabase
      .from('challenge_participation')
      .select('*')
      .eq('employee_id', employeeId);
    if (error) throw error;

    return (data ?? []).map((row: any) => ({
      id: row.id,
      challengeId: row.challenge_id,
      employeeId: row.employee_id,
      progress: row.progress || 0,
      proofUrl: null,
      status: row.completion_status === 'completed' ? 'approved' : 'pending',
      completionDate: row.completion_status === 'completed' ? new Date() : null,
      xpAwarded: row.xp_earned || 0,
    }));
  }

  async getAllParticipations(): Promise<ChallengeParticipation[]> {
    const { data, error } = await supabase.from('challenge_participation').select('*');
    if (error) throw error;

    return (data ?? []).map((row: any) => ({
      id: row.id,
      challengeId: row.challenge_id,
      employeeId: row.employee_id,
      progress: row.progress || 0,
      proofUrl: null,
      status: row.completion_status === 'completed' ? 'approved' : 'pending',
      completionDate: row.completion_status === 'completed' ? new Date() : null,
      xpAwarded: row.xp_earned || 0,
    }));
  }

  async submitChallengeProgress(challengeId: string, employeeId: string, progress: number, _proofFile: File | null): Promise<ChallengeParticipation> {
    // Check if exists
    const { data: existing } = await supabase
      .from('challenge_participation')
      .select('*')
      .eq('challenge_id', challengeId)
      .eq('employee_id', employeeId)
      .maybeSingle();

    const completionStatus = progress >= 100 ? 'completed' : 'in_progress';
    let row;

    if (existing) {
      const { data, error } = await supabase
        .from('challenge_participation')
        .update({
          progress,
          completion_status: completionStatus,
        })
        .eq('id', existing.id)
        .select('*')
        .single();
      if (error) throw error;
      row = data;
    } else {
      const { data, error } = await supabase
        .from('challenge_participation')
        .insert({
          challenge_id: challengeId,
          employee_id: employeeId,
          progress,
          completion_status: completionStatus,
        })
        .select('*')
        .single();
      if (error) throw error;
      row = data;
    }

    return {
      id: row.id,
      challengeId: row.challenge_id,
      employeeId: row.employee_id,
      progress: row.progress || 0,
      proofUrl: null,
      status: row.completion_status === 'completed' ? 'approved' : 'pending',
      completionDate: row.completion_status === 'completed' ? new Date() : null,
      xpAwarded: row.xp_earned || 0,
    };
  }

  async approveChallengeParticipation(participationId: string, status: 'approved' | 'rejected'): Promise<ChallengeParticipation> {
    // Mark as completed if approved
    const completionStatus = status === 'approved' ? 'completed' : 'in_progress';
    const progress = status === 'approved' ? 100 : 0;

    const { data, error } = await supabase
      .from('challenge_participation')
      .update({
        completion_status: completionStatus,
        progress,
      })
      .eq('id', participationId)
      .select('*')
      .single();

    if (error) throw error;

    return {
      id: data.id,
      challengeId: data.challenge_id,
      employeeId: data.employee_id,
      progress: data.progress || 0,
      proofUrl: null,
      status: data.completion_status === 'completed' ? 'approved' : 'pending',
      completionDate: data.completion_status === 'completed' ? new Date() : null,
      xpAwarded: data.xp_earned || 0,
    };
  }
}

// ============================================================================
// 6. Gamification Repository Implementation
// ============================================================================
export class SupabaseGamificationService implements GamificationRepository {
  async getBadges(employeeId?: string): Promise<Badge[]> {
    const { data: badges, error: badgesError } = await supabase.from('badges').select('*');
    if (badgesError) throw badgesError;

    let unlockedBadgeIds: string[] = [];
    let unlockedAtMap: Record<string, string> = {};

    if (employeeId) {
      const { data: empBadges } = await supabase
        .from('employee_badges')
        .select('*')
        .eq('employee_id', employeeId);

      unlockedBadgeIds = (empBadges ?? []).map((eb: any) => eb.badge_id);
      (empBadges ?? []).forEach((eb: any) => {
        unlockedAtMap[eb.badge_id] = eb.awarded_at;
      });
    }

    return (badges ?? []).map((row: any) => ({
      id: row.id,
      name: row.name,
      description: row.description || '',
      unlockRule: `Reach ${row.xp_required} total XP`,
      icon: row.icon || '🌱',
      active: true,
      unlockedAt: unlockedBadgeIds.includes(row.id) ? new Date(unlockedAtMap[row.id]) : undefined,
    }));
  }

  async getRewards(): Promise<Reward[]> {
    const { data, error } = await supabase.from('rewards').select('*');
    if (error) throw error;

    return (data ?? []).map((row: any) => ({
      id: row.id,
      name: row.name,
      description: row.description || '',
      pointsRequired: row.xp_cost || 100,
      stock: row.quantity || 0,
      status: (row.quantity || 0) > 0 ? 'active' : 'inactive',
      imageUrl: '',
    }));
  }

  async redeemReward(rewardId: string, employeeId: string): Promise<{ success: boolean; transactionId: string; remainingPoints: number; updatedStock: number }> {
    // Insert Redemption - the triggers fn_redeem will deduct XP and decrease stock or throw exception
    const { data, error } = await supabase
      .from('redemptions')
      .insert({
        reward_id: rewardId,
        employee_id: employeeId,
      })
      .select('*')
      .single();

    if (error) {
      // Propagate trigger exception (e.g. 'Insufficient XP' or 'Reward out of stock')
      throw new Error(error.message || 'Redemption failed');
    }

    // Query updated values
    const { data: emp } = await supabase.from('employees').select('total_xp').eq('id', employeeId).single();
    const { data: rew } = await supabase.from('rewards').select('quantity').eq('id', rewardId).single();

    return {
      success: true,
      transactionId: data.id,
      remainingPoints: emp?.total_xp || 0,
      updatedStock: rew?.quantity || 0,
    };
  }
}

// ============================================================================
// 7. Governance Repository Implementation
// ============================================================================
export class SupabaseGovernanceService implements GovernanceRepository {
  async getPolicies(employeeId?: string): Promise<Policy[]> {
    const { data: policies, error } = await supabase.from('esg_policies').select('*, categories(*)');
    if (error) throw error;

    let ackedPolicyIds: string[] = [];
    let ackedDateMap: Record<string, string> = {};

    if (employeeId) {
      const { data: acks } = await supabase
        .from('policy_acknowledgements')
        .select('*')
        .eq('employee_id', employeeId);

      ackedPolicyIds = (acks ?? []).map((a: any) => a.policy_id);
      (acks ?? []).forEach((a: any) => {
        ackedDateMap[a.policy_id] = a.date;
      });
    }

    return (policies ?? []).map((row: any) => {
      const cat = row.categories || { name: 'Compliance' };
      const acknowledged = ackedPolicyIds.includes(row.id);

      return {
        id: row.id,
        title: row.policy_name,
        code: 'POL-' + row.policy_name.substring(0, 3).toUpperCase(),
        version: '1.0',
        category: cat.name,
        content: row.description || '',
        effectiveDate: new Date(row.effective_date),
        status: row.status || 'active',
        acknowledged,
        acknowledgementDate: acknowledged ? new Date(ackedDateMap[row.id]) : null,
      };
    });
  }

  async acknowledgePolicy(policyId: string, employeeId: string): Promise<boolean> {
    const { error } = await supabase
      .from('policy_acknowledgements')
      .insert({
        policy_id: policyId,
        employee_id: employeeId,
        status: 'acknowledged',
      });
    if (error && error.code !== '23505') { // Ignore unique constraint duplicate logs
      throw error;
    }
    return true;
  }

  async getAudits(): Promise<Audit[]> {
    const { data, error } = await supabase.from('audits').select('*, departments(*)');
    if (error) throw error;

    return (data ?? []).map((row: any) => {
      const dept = row.departments || { name: 'Internal' };
      return {
        id: row.id,
        title: row.audit_name,
        auditor: row.auditor || 'External auditor',
        date: new Date(row.date),
        score: 85, // Default average audit score
        status: row.status || 'open',
        scope: dept.name,
        findings: row.findings || '',
      };
    });
  }

  async getComplianceIssues(filters?: { severity?: string; status?: string }): Promise<ComplianceIssue[]> {
    let query = supabase.from('compliance_issues').select('*, employees(*)');

    if (filters?.severity) {
      query = query.eq('priority', filters.severity); // priority maps to severity in triggers
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data ?? []).map((row: any) => {
      const owner = row.employees || { name: 'Unassigned' };
      return {
        id: row.id,
        title: row.issue_title,
        description: row.description || '',
        auditId: null,
        severity: row.priority || 'medium',
        ownerId: row.owner_id,
        ownerName: owner.name,
        dueDate: new Date(row.due_date),
        status: row.status || 'open',
        dateRaised: new Date(), // concept mapping
      };
    });
  }

  async createComplianceIssue(data: ComplianceIssueForm, _reporterId: string): Promise<ComplianceIssue> {
    const { data: insertData, error } = await supabase
      .from('compliance_issues')
      .insert({
        issue_title: data.title,
        description: data.description,
        owner_id: data.ownerId,
        due_date: data.dueDate,
        priority: data.severity,
        status: 'open',
      })
      .select('*, employees(*)')
      .single();

    if (error) throw error;

    const row = insertData;
    const owner = row.employees || { name: 'Unassigned' };

    return {
      id: row.id,
      title: row.issue_title,
      description: row.description || '',
      auditId: null,
      severity: row.priority || 'medium',
      ownerId: row.owner_id,
      ownerName: owner.name,
      dueDate: new Date(row.due_date),
      status: row.status || 'open',
      dateRaised: new Date(),
    };
  }

  async updateComplianceIssueStatus(issueId: string, status: 'open' | 'in-progress' | 'resolved'): Promise<ComplianceIssue> {
    const { data, error } = await supabase
      .from('compliance_issues')
      .update({ status })
      .eq('id', issueId)
      .select('*, employees(*)')
      .single();

    if (error) throw error;

    const row = data;
    const owner = row.employees || { name: 'Unassigned' };

    return {
      id: row.id,
      title: row.issue_title,
      description: row.description || '',
      auditId: null,
      severity: row.priority || 'medium',
      ownerId: row.owner_id,
      ownerName: owner.name,
      dueDate: new Date(row.due_date),
      status: row.status || 'open',
      dateRaised: new Date(),
    };
  }
}

// ============================================================================
// 8. Notification Repository Implementation
// ============================================================================
export class SupabaseNotificationService implements NotificationRepository {
  async getNotifications(employeeId: string): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('employee_id', employeeId)
      .order('created_at', { ascending: false });
    if (error) throw error;

    return (data ?? []).map((row: any) => ({
      id: row.id,
      employeeId: row.employee_id,
      title: row.type ? row.type.charAt(0).toUpperCase() + row.type.slice(1) + ' Alert' : 'System Alert',
      message: row.message || '',
      category: row.type || 'info',
      date: new Date(row.created_at),
      isRead: row.is_read || false,
    }));
  }

  async markAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
    if (error) throw error;
  }
}

// ============================================================================
// 9. Dashboard Repository Implementation
// ============================================================================
export class SupabaseDashboardService implements DashboardRepository {
  async getDashboardStats(): Promise<DashboardStats> {
    // 1. Fetch company wide ESG score
    const { data: scoreRow } = await supabase.from('v_company_esg_score').select('*').maybeSingle();
    const overallScore = scoreRow?.overall_score ? Number(scoreRow.overall_score) : 79.0;
    const environmentalScore = scoreRow?.environmental_score ? Number(scoreRow.environmental_score) : 82.5;
    const socialScore = scoreRow?.social_score ? Number(scoreRow.social_score) : 74.0;
    const governanceScore = scoreRow?.governance_score ? Number(scoreRow.governance_score) : 79.2;

    // 2. Fetch Settings weights
    const { data: settings } = await supabase.from('settings').select('*').eq('id', 1).single();
    const weights = {
      environmental: Number(settings?.weight_env || 0.40),
      social: Number(settings?.weight_social || 0.30),
      governance: Number(settings?.weight_gov || 0.30),
    };

    // 3. Aggregate totals
    const { data: txs } = await supabase.from('carbon_transactions').select('calculated_co2');
    const totalCO2 = (txs ?? []).reduce((acc: number, t: any) => acc + Number(t.calculated_co2 || 0), 0);

    const { count: activeChallenges } = await supabase
      .from('challenges')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    const { count: pendingCSR } = await supabase
      .from('employee_participation')
      .select('*', { count: 'exact', head: true })
      .eq('approval_status', 'pending');

    const { count: openCompliance } = await supabase
      .from('compliance_issues')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'open');

    return {
      overallScore,
      environmentalScore,
      socialScore,
      governanceScore,
      weights,
      scoreDelta: 2.8,
      carbonEmissionYtd: Number((totalCO2 / 1000).toFixed(1)), // convert kg to metric tons
      carbonEmissionTarget: 15.0, // base company metric tons target
      activeChallengesCount: activeChallenges || 0,
      pendingApprovalsCount: pendingCSR || 0,
      openComplianceIssuesCount: openCompliance || 0,
    };
  }

  async getDepartmentScores(): Promise<DepartmentScore[]> {
    const { data, error } = await supabase
      .from('department_scores')
      .select('*, departments(*)');
    if (error) throw error;

    const list = (data ?? []).map((row: any) => {
      const dept = row.departments || { name: 'Internal' };
      return {
        departmentId: row.department_id,
        departmentName: dept.name,
        environmentalScore: Number(row.environmental_score || 0),
        socialScore: Number(row.social_score || 0),
        governance_score: Number(row.governance_score || 0),
        governanceScore: Number(row.governance_score || 0),
        totalScore: Number(row.total_score || 0),
      };
    });

    list.sort((a: any, b: any) => b.totalScore - a.totalScore);
    return list;
  }
}

// ============================================================================
// 10. Settings Repository Implementation
// ============================================================================
export class SupabaseSettingsService implements SettingsRepository {
  async getSettings(): Promise<Settings> {
    const { data, error } = await supabase.from('settings').select('*').eq('id', 1).single();
    if (error) throw error;

    return {
      envWeight: Number(data.weight_env),
      socialWeight: Number(data.weight_social),
      govWeight: Number(data.weight_gov),
      autoCalculateEmissions: data.auto_emission,
      evidenceRequired: data.evidence_required,
      badgeAutoAward: data.badge_auto_award,
      emailNotifications: true,
      inAppNotifications: true,
    };
  }

  async updateSettings(data: SettingsForm): Promise<Settings> {
    const { data: updated, error } = await supabase
      .from('settings')
      .update({
        weight_env: data.envWeight,
        weight_social: data.socialWeight,
        weight_gov: data.govWeight,
        auto_emission: data.autoCalculateEmissions,
        evidence_required: data.evidenceRequired,
        badge_auto_award: data.badgeAutoAward,
      })
      .eq('id', 1)
      .select('*')
      .single();

    if (error) throw error;

    return {
      envWeight: Number(updated.weight_env),
      socialWeight: Number(updated.weight_social),
      govWeight: Number(updated.weight_gov),
      autoCalculateEmissions: updated.auto_emission,
      evidenceRequired: updated.evidence_required,
      badgeAutoAward: updated.badge_auto_award,
      emailNotifications: true,
      inAppNotifications: true,
    };
  }
}

// ============================================================================
// 11. Reports Repository Implementation
// ============================================================================
export class SupabaseReportsService implements ReportsRepository {
  async exportReport(data: ReportBuilderForm): Promise<ExportResponse> {
    // 1. Query records corresponding to the selected reportType from database
    let rows: any[] = [];
    const filter = data.filters;

    if (data.reportType === 'environmental' || data.reportType === 'summary') {
      let query = supabase.from('carbon_transactions').select('*, emission_factors(*)');
      if (filter.departmentId) query = query.eq('department_id', filter.departmentId);
      if (filter.startDate) query = query.gte('date', filter.startDate);
      if (filter.endDate) query = query.lte('date', filter.endDate);
      const { data: carbonRows } = await query;
      rows = (carbonRows ?? []).map(r => ({
        date: r.date,
        source: r.source_type,
        quantity: r.quantity,
        unit: r.unit || r.emission_factors?.unit || 'unit',
        factor: r.emission_factors?.activity_name || 'Unknown',
        calculated_co2: r.calculated_co2
      }));
    } else if (data.reportType === 'social') {
      let query = supabase.from('employee_participation').select('*, csr_activities(*), employees(*)');
      if (filter.employeeId) query = query.eq('employee_id', filter.employeeId);
      const { data: socialRows } = await query;
      rows = (socialRows ?? []).map(r => ({
        employee_name: r.employees?.name || 'Unknown',
        activity_name: r.csr_activities?.name || 'Unknown',
        status: r.approval_status,
        xp_earned: r.xp_earned
      }));
    } else if (data.reportType === 'governance') {
      let query = supabase.from('compliance_issues').select('*, employees(*)');
      if (filter.employeeId) query = query.eq('owner_id', filter.employeeId);
      const { data: govRows } = await query;
      rows = (govRows ?? []).map(r => ({
        issue_title: r.issue_title,
        owner_name: r.employees?.name || 'Unassigned',
        severity: r.priority,
        status: r.status,
        due_date: r.due_date
      }));
    }

    // 2. Make POST call to Python reports exporter API
    try {
      const apiHost = (import.meta as any).env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiHost}/api/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          format: data.format,
          rows: rows.length > 0 ? rows : [{ info: 'No data matches filters' }]
        })
      });

      if (!response.ok) {
        throw new Error('Export API server error');
      }

      // Read output stream as a binary blog file and download in browser
      const blob = await response.blob();
      const localDownloadUrl = URL.createObjectURL(blob);

      // Create a transient download link and click it to download file in the browser automatically!
      const link = document.createElement('a');
      link.href = localDownloadUrl;
      link.download = `esg-report-${data.reportType}-${Date.now()}.${data.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return {
        success: true,
        downloadUrl: localDownloadUrl,
        expiresAt: new Date(Date.now() + 60000)
      };
    } catch (err) {
      console.warn('Local python reports server not available, falling back to mock: ', err);
      return {
        success: true,
        downloadUrl: `https://storage.ecosphere.com/downloads/esg-export-fallback.${data.format}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      };
    }
  }
}

// Instantiate and export Supabase services
export const departmentService = new SupabaseDepartmentService();
export const employeeService = new SupabaseEmployeeService();
export const carbonService = new SupabaseCarbonService();
export const csrService = new SupabaseCSRService();
export const challengeService = new SupabaseChallengeService();
export const gamificationService = new SupabaseGamificationService();
export const governanceService = new SupabaseGovernanceService();
export const settingsService = new SupabaseSettingsService();
export const notificationService = new SupabaseNotificationService();
export const dashboardService = new SupabaseDashboardService();
export const reportsService = new SupabaseReportsService();
