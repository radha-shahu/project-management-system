import { Injectable } from '@angular/core';
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  // array to store notifications
  private notifications: Notification[] = [];

  constructor() {
    console.log('NotificationService: Service initialized');
  }

  // get all current notifications
  getNotifications(): Notification[] {
    return this.notifications;
  }

  // show success notification
  showSuccess(title: string, message: string): void {
    console.log('NotificationService: Showing success notification:', title);
    this.addNotification({
      id: this.generateId(),
      type: 'success',
      title,
      message
    });
  }

  // show error notification
  showError(title: string, message: string): void {
    console.log('NotificationService: Showing error notification:', title);
    this.addNotification({
      id: this.generateId(),
      type: 'error',
      title,
      message
    });
  }

  // show warning notification
  showWarning(title: string, message: string): void {
    console.log('NotificationService: Showing warning notification:', title);
    this.addNotification({
      id: this.generateId(),
      type: 'warning',
      title,
      message
    });
  }

  // show info notification
  showInfo(title: string, message: string): void {
    console.log('NotificationService: Showing info notification:', title);
    this.addNotification({
      id: this.generateId(),
      type: 'info',
      title,
      message
    });
  }

  // remove a specific notification
  removeNotification(id: string): void {
    console.log('NotificationService: Removing notification:', id);
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

  // clear all notifications
  clearAll(): void {
    console.log('NotificationService: Clearing all notifications');
    this.notifications = [];
  }

  // add a new notification to the list
  private addNotification(notification: Notification): void {
    console.log('NotificationService: Adding notification:', notification.title);

    this.notifications.push(notification);

    console.log('NotificationService: Notification added and will stay until manually closed');
  }

  private generateId(): string {
    return 'notification-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }
}
