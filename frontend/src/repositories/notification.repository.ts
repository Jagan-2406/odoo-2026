import { Notification } from '../models/notification';

export interface NotificationRepository {
  getNotifications(employeeId: string): Promise<Notification[]>;
  markAsRead(notificationId: string): Promise<void>;
}
