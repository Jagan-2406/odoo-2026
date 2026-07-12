export interface CSRActivityDTO {
  id: string;
  title: string;
  description: string;
  category_id: string;
  category_name: string;
  date: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  target_participants: number;
  current_participants: number;
  points_awarded: number;
}

export interface CSRActivity {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  categoryName: string;
  date: Date;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  targetParticipants: number;
  currentParticipants: number;
  pointsAwarded: number;
}

export interface CSRParticipationDTO {
  id: string;
  activity_id: string;
  employee_id: string;
  proof_url: string | null;
  status: 'pending' | 'approved' | 'rejected';
  completion_date: string | null;
  points_earned: number;
}

export interface CSRParticipation {
  id: string;
  activityId: string;
  employeeId: string;
  proofUrl: string | null;
  status: 'pending' | 'approved' | 'rejected';
  completionDate: Date | null;
  pointsEarned: number;
}

export interface CSRParticipationForm {
  activityId: string;
  proofFile: File | null;
}
