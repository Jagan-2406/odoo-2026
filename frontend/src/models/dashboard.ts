export interface DepartmentScoreDTO {
  department_id: string;
  department_name: string;
  environmental_score: number;
  social_score: number;
  governance_score: number;
  total_score: number;
}

export interface DepartmentScore {
  departmentId: string;
  departmentName: string;
  environmentalScore: number;
  socialScore: number;
  governanceScore: number;
  totalScore: number;
}

export interface DashboardStatsDTO {
  overall_score: number;
  environmental_score: number;
  social_score: number;
  governance_score: number;
  weights: {
    environmental: number;
    social: number;
    governance: number;
  };
  score_delta: number;
  carbon_emission_ytd: number;
  carbon_emission_target: number;
  active_challenges_count: number;
  pending_approvals_count: number;
  open_compliance_issues_count: number;
}

export interface DashboardStats {
  overallScore: number;
  environmentalScore: number;
  socialScore: number;
  governanceScore: number;
  weights: {
    environmental: number;
    social: number;
    governance: number;
  };
  scoreDelta: number;
  carbonEmissionYtd: number;
  carbonEmissionTarget: number;
  activeChallengesCount: number;
  pendingApprovalsCount: number;
  openComplianceIssuesCount: number;
}
