import { CSRActivity, CSRParticipation } from '../models/csr';

export interface CSRRepository {
  getCSRActivities(filters?: { categoryId?: string; status?: string }): Promise<CSRActivity[]>;
  getCSRActivityById(id: string): Promise<CSRActivity>;
  getParticipationsByActivityId(activityId: string): Promise<CSRParticipation[]>;
  getAllParticipations(): Promise<CSRParticipation[]>;
  submitParticipation(activityId: string, employeeId: string, proofFile: File | null): Promise<CSRParticipation>;
  approveParticipation(participationId: string, status: 'approved' | 'rejected'): Promise<CSRParticipation>;
}
