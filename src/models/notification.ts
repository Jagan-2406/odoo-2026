export interface NotificationDTO {
  id: string;
  employee_id: string;
  title: string;
  message: string;
  category: 'compliance' | 'csr' | 'challenge' | 'badge' | 'policy';
  date: string;
  is_read: boolean;
}

export interface Notification {
  id: string;
  employeeId: string;
  title: string;
  message: string;
  category: 'compliance' | 'csr' | 'challenge' | 'badge' | 'policy';
  date: Date;
  isRead: boolean;
}
