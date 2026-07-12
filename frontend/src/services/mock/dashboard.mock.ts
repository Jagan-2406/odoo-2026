import { DashboardRepository } from '../../repositories/dashboard.repository';
import { DashboardStats, DepartmentScore } from '../../models/dashboard';
import { mockStorage } from '../mockStorage';
import { simulateNetwork } from '../mockNetwork';
import { mockLogger } from '../mockLogger';

export class MockDashboardService implements DashboardRepository {
  async getDashboardStats(): Promise<DashboardStats> {
    mockLogger.logRequest('GET', '/api/dashboard/stats');
    await simulateNetwork();

    const db = mockStorage.getDatabase();
    
    // Aggregate values to match realistic changes
    const totalCarbon = db.carbonTransactions.reduce((acc, t) => acc + t.calculated_emissions, 0);
    const activeChallenges = db.challenges.filter((c) => c.status === 'active').length;
    const pendingApprovals = db.csrParticipations.filter((p) => p.status === 'pending').length;
    const openCompliance = db.complianceIssues.filter((i) => i.status === 'open').length;

    // Simulate backend calculating ESG scores
    const environmentalScore = 82.5;
    const socialScore = 74.0;
    const governanceScore = 79.2;
    const weights = {
      environmental: db.settings.env_weight,
      social: db.settings.social_weight,
      governance: db.settings.gov_weight,
    };
    
    const overallScore = 
      environmentalScore * weights.environmental +
      socialScore * weights.social +
      governanceScore * weights.governance;

    const stats: DashboardStats = {
      overallScore,
      environmentalScore,
      socialScore,
      governanceScore,
      weights,
      scoreDelta: +2.8,
      carbonEmissionYtd: Number((totalCarbon / 1000).toFixed(1)), // convert to metric tons
      carbonEmissionTarget: 15.0, // target in tons
      activeChallengesCount: activeChallenges,
      pendingApprovalsCount: pendingApprovals,
      openComplianceIssuesCount: openCompliance,
    };

    mockLogger.logResponse('/api/dashboard/stats', stats);
    return stats;
  }

  async getDepartmentScores(): Promise<DepartmentScore[]> {
    mockLogger.logRequest('GET', '/api/dashboard/department-scores');
    await simulateNetwork();

    const db = mockStorage.getDatabase();
    
    // Map scores to each department with structured mock values
    const list: DepartmentScore[] = db.departments.map((d, idx) => {
      // Return fixed but distinct mock ratings per department
      const eScore = 70 + (idx * 4.5) % 30;
      const sScore = 65 + (idx * 5.5) % 35;
      const gScore = 75 + (idx * 3.5) % 25;
      
      const totalScore = eScore * 0.40 + sScore * 0.30 + gScore * 0.30;
      
      return {
        departmentId: d.id,
        departmentName: d.name,
        environmentalScore: Number(eScore.toFixed(1)),
        socialScore: Number(sScore.toFixed(1)),
        governanceScore: Number(gScore.toFixed(1)),
        totalScore: Number(totalScore.toFixed(1)),
      };
    });

    // Sort by total score descending for rankings
    list.sort((a, b) => b.totalScore - a.totalScore);

    mockLogger.logResponse('/api/dashboard/department-scores', list);
    return list;
  }
}
export const dashboardService = new MockDashboardService();
