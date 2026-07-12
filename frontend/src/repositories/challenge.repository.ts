import { Challenge, ChallengeParticipation } from '../models/challenge';

export interface ChallengeRepository {
  getChallenges(filters?: { status?: string }): Promise<Challenge[]>;
  getChallengeById(id: string): Promise<Challenge>;
  getParticipationsByEmployeeId(employeeId: string): Promise<ChallengeParticipation[]>;
  getAllParticipations(): Promise<ChallengeParticipation[]>;
  submitChallengeProgress(challengeId: string, employeeId: string, progress: number, proofFile: File | null): Promise<ChallengeParticipation>;
  approveChallengeParticipation(participationId: string, status: 'approved' | 'rejected'): Promise<ChallengeParticipation>;
}
