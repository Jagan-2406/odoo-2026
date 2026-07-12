export interface ChallengeDTO {
  id: string;
  title: string;
  description: string;
  category_id: string;
  xp: number;
  difficulty: 'easy' | 'medium' | 'hard';
  evidence_required: boolean;
  deadline: string;
  status: 'draft' | 'active' | 'under_review' | 'completed' | 'archived';
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  xp: number;
  difficulty: 'easy' | 'medium' | 'hard';
  evidenceRequired: boolean;
  deadline: Date;
  status: 'draft' | 'active' | 'under_review' | 'completed' | 'archived';
}

export interface ChallengeParticipationDTO {
  id: string;
  challenge_id: string;
  employee_id: string;
  progress: number; // 0 to 100
  proof_url: string | null;
  status: 'pending' | 'approved' | 'rejected';
  completion_date: string | null;
  xp_awarded: number;
}

export interface ChallengeParticipation {
  id: string;
  challengeId: string;
  employeeId: string;
  progress: number;
  proofUrl: string | null;
  status: 'pending' | 'approved' | 'rejected';
  completionDate: Date | null;
  xpAwarded: number;
}

export interface ChallengeParticipationForm {
  challengeId: string;
  progress: number;
  proofFile: File | null;
}
