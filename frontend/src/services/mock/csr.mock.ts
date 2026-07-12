import { CSRRepository } from '../../repositories/csr.repository';
import { CSRActivity, CSRParticipation } from '../../models/csr';
import { mockStorage } from '../mockStorage';
import { simulateNetwork } from '../mockNetwork';
import { mapCSRActivity, mapCSRParticipation } from '../adapters';
import { mockLogger } from '../mockLogger';
import { generateUUID } from '../generateUUID';

export class MockCSRService implements CSRRepository {
  async getCSRActivities(filters?: { categoryId?: string; status?: string }): Promise<CSRActivity[]> {
    mockLogger.logRequest('GET', '/api/csr-activities', filters);
    await simulateNetwork();

    const db = mockStorage.getDatabase();
    let list = db.csrActivities;

    if (filters?.categoryId) {
      list = list.filter((a) => a.category_id === filters.categoryId);
    }
    if (filters?.status) {
      list = list.filter((a) => a.status === filters.status);
    }

    const domainList = list.map(mapCSRActivity);
    mockLogger.logResponse('/api/csr-activities', domainList);
    return domainList;
  }

  async getCSRActivityById(id: string): Promise<CSRActivity> {
    mockLogger.logRequest('GET', `/api/csr-activities/${id}`);
    await simulateNetwork();

    const db = mockStorage.getDatabase();
    const activity = db.csrActivities.find((a) => a.id === id);
    if (!activity) {
      throw new Error(`CSR Activity with ID ${id} not found`);
    }

    const domainAct = mapCSRActivity(activity);
    mockLogger.logResponse(`/api/csr-activities/${id}`, domainAct);
    return domainAct;
  }

  async getParticipationsByActivityId(activityId: string): Promise<CSRParticipation[]> {
    mockLogger.logRequest('GET', `/api/csr-activities/${activityId}/participations`);
    await simulateNetwork();

    const db = mockStorage.getDatabase();
    const list = db.csrParticipations.filter((p) => p.activity_id === activityId);
    const domainList = list.map(mapCSRParticipation);
    mockLogger.logResponse(`/api/csr-activities/${activityId}/participations`, domainList);
    return domainList;
  }

  async getAllParticipations(): Promise<CSRParticipation[]> {
    mockLogger.logRequest('GET', '/api/csr-participations');
    await simulateNetwork();

    const db = mockStorage.getDatabase();
    const domainList = db.csrParticipations.map(mapCSRParticipation);
    mockLogger.logResponse('/api/csr-participations', domainList);
    return domainList;
  }

  async submitParticipation(activityId: string, employeeId: string, proofFile: File | null): Promise<CSRParticipation> {
    mockLogger.logRequest('POST', `/api/csr-activities/${activityId}/participate`, { employeeId, proofFile });
    await simulateNetwork();

    const db = mockStorage.getDatabase();
    
    // Check if participation already exists
    let participation = db.csrParticipations.find(
      (p) => p.activity_id === activityId && p.employee_id === employeeId
    );

    if (participation) {
      // If it exists, update with proof
      participation.proof_url = proofFile ? `https://storage.ecosphere.com/proofs/proof-${participation.id}.jpg` : null;
      participation.status = 'pending';
    } else {
      // Create new participation DTO
      participation = {
        id: generateUUID(),
        activity_id: activityId,
        employee_id: employeeId,
        proof_url: proofFile ? `https://storage.ecosphere.com/proofs/proof-new.jpg` : null,
        status: 'pending',
        completion_date: null,
        points_earned: 0,
      };
      db.csrParticipations.unshift(participation);
    }

    mockStorage.saveDatabase(db);

    const domainPart = mapCSRParticipation(participation);
    mockLogger.logResponse(`/api/csr-activities/${activityId}/participate`, domainPart);
    return domainPart;
  }

  async approveParticipation(participationId: string, status: 'approved' | 'rejected'): Promise<CSRParticipation> {
    mockLogger.logRequest('PATCH', `/api/csr-participations/${participationId}/approval`, { status });
    await simulateNetwork();

    const db = mockStorage.getDatabase();
    const part = db.csrParticipations.find((p) => p.id === participationId);
    if (!part) {
      throw new Error(`CSR Participation with ID ${participationId} not found`);
    }

    part.status = status;
    
    if (status === 'approved') {
      part.completion_date = new Date().toISOString();
      const activity = db.csrActivities.find((a) => a.id === part.activity_id);
      if (activity) {
        part.points_earned = activity.points_awarded;
        activity.current_participants += 1;
        
        // Award points to employee (side effect)
        const employee = db.employees.find((e) => e.id === part.employee_id);
        if (employee) {
          employee.points += activity.points_awarded;
        }
      }
    } else {
      part.completion_date = null;
      part.points_earned = 0;
    }

    mockStorage.saveDatabase(db);

    const domainPart = mapCSRParticipation(part);
    mockLogger.logResponse(`/api/csr-participations/${participationId}/approval`, domainPart);
    return domainPart;
  }
}
export const csrService = new MockCSRService();
