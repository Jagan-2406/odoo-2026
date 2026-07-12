import { NotificationRepository } from '../../repositories/notification.repository';
import { Notification } from '../../models/notification';
import { mockStorage } from '../mockStorage';
import { simulateNetwork } from '../mockNetwork';
import { mapNotification } from '../adapters';
import { mockLogger } from '../mockLogger';

export class MockNotificationService implements NotificationRepository {
  async getNotifications(employeeId: string): Promise<Notification[]> {
    mockLogger.logRequest('GET', `/api/notifications/employee/${employeeId}`);
    await simulateNetwork();

    const db = mockStorage.getDatabase();
    const list = db.notifications.filter((n) => n.employee_id === employeeId);
    
    const domainList = list.map(mapNotification);
    mockLogger.logResponse(`/api/notifications/employee/${employeeId}`, domainList);
    return domainList;
  }

  async markAsRead(notificationId: string): Promise<void> {
    mockLogger.logRequest('PATCH', `/api/notifications/${notificationId}/read`);
    await simulateNetwork();

    const db = mockStorage.getDatabase();
    const notif = db.notifications.find((n) => n.id === notificationId);
    
    if (notif) {
      notif.is_read = true;
      mockStorage.saveDatabase(db);
    }
    
    mockLogger.logResponse(`/api/notifications/${notificationId}/read`, { success: true });
  }
}
export const notificationService = new MockNotificationService();
