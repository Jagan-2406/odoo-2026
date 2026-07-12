import { ChallengeRepository } from '../../repositories/challenge.repository';
import { Challenge, ChallengeParticipation } from '../../models/challenge';
import { mockStorage } from '../mockStorage';
import { simulateNetwork } from '../mockNetwork';
import { mapChallenge, mapChallengeParticipation } from '../adapters';
import { mockLogger } from '../mockLogger';
import { generateUUID } from '../generateUUID';

export class MockChallengeService implements ChallengeRepository {
  async getChallenges(filters?: { status?: string }): Promise<Challenge[]> {
    mockLogger.logRequest('GET', '/api/challenges', filters);
    await simulateNetwork();

    const db = mockStorage.getDatabase();
    let list = db.challenges;

    if (filters?.status) {
      list = list.filter((c) => c.status === filters.status);
    }

    const domainList = list.map(mapChallenge);
    mockLogger.logResponse('/api/challenges', domainList);
    return domainList;
  }

  async getChallengeById(id: string): Promise<Challenge> {
    mockLogger.logRequest('GET', `/api/challenges/${id}`);
    await simulateNetwork();

    const db = mockStorage.getDatabase();
    const challenge = db.challenges.find((c) => c.id === id);
    if (!challenge) {
      throw new Error(`Challenge with ID ${id} not found`);
    }

    const domainChal = mapChallenge(challenge);
    mockLogger.logResponse(`/api/challenges/${id}`, domainChal);
    return domainChal;
  }

  async getParticipationsByEmployeeId(employeeId: string): Promise<ChallengeParticipation[]> {
    mockLogger.logRequest('GET', `/api/challenge-participations/employee/${employeeId}`);
    await simulateNetwork();

    const db = mockStorage.getDatabase();
    const list = db.challengeParticipations.filter((p) => p.employee_id === employeeId);
    
    const domainList = list.map(mapChallengeParticipation);
    mockLogger.logResponse(`/api/challenge-participations/employee/${employeeId}`, domainList);
    return domainList;
  }

  async getAllParticipations(): Promise<ChallengeParticipation[]> {
    mockLogger.logRequest('GET', '/api/challenge-participations');
    await simulateNetwork();

    const db = mockStorage.getDatabase();
    const domainList = db.challengeParticipations.map(mapChallengeParticipation);
    mockLogger.logResponse('/api/challenge-participations', domainList);
    return domainList;
  }

  async submitChallengeProgress(
    challengeId: string,
    employeeId: string,
    progress: number,
    proofFile: File | null
  ): Promise<ChallengeParticipation> {
    mockLogger.logRequest('POST', `/api/challenges/${challengeId}/participate`, { employeeId, progress, proofFile });
    await simulateNetwork();

    const db = mockStorage.getDatabase();
    
    let participation = db.challengeParticipations.find(
      (p) => p.challenge_id === challengeId && p.employee_id === employeeId
    );

    if (participation) {
      participation.progress = progress;
      participation.proof_url = proofFile ? `https://storage.ecosphere.com/proofs/proof-challenge-${participation.id}.jpg` : participation.proof_url;
      participation.status = 'pending';
    } else {
      participation = {
        id: generateUUID(),
        challenge_id: challengeId,
        employee_id: employeeId,
        progress,
        proof_url: proofFile ? `https://storage.ecosphere.com/proofs/proof-challenge-new.jpg` : null,
        status: 'pending',
        completion_date: null,
        xp_awarded: 0,
      };
      db.challengeParticipations.unshift(participation);
    }

    mockStorage.saveDatabase(db);

    const domainPart = mapChallengeParticipation(participation);
    mockLogger.logResponse(`/api/challenges/${challengeId}/participate`, domainPart);
    return domainPart;
  }

  async approveChallengeParticipation(participationId: string, status: 'approved' | 'rejected'): Promise<ChallengeParticipation> {
    mockLogger.logRequest('PATCH', `/api/challenge-participations/${participationId}/approval`, { status });
    await simulateNetwork();

    const db = mockStorage.getDatabase();
    const part = db.challengeParticipations.find((p) => p.id === participationId);
    if (!part) {
      throw new Error(`Challenge participation with ID ${participationId} not found`);
    }

    part.status = status;

    if (status === 'approved') {
      part.progress = 100;
      part.completion_date = new Date().toISOString();
      const challenge = db.challenges.find((c) => c.id === part.challenge_id);
      if (challenge) {
        part.xp_awarded = challenge.xp;
        
        // Award XP to employee (side effect)
        const employee = db.employees.find((e) => e.id === part.employee_id);
        if (employee) {
          employee.xp += challenge.xp;
        }
      }
    } else {
      part.completion_date = null;
      part.xp_awarded = 0;
    }

    mockStorage.saveDatabase(db);

    const domainPart = mapChallengeParticipation(part);
    mockLogger.logResponse(`/api/challenge-participations/${participationId}/approval`, domainPart);
    return domainPart;
  }
}
export const challengeService = new MockChallengeService();
