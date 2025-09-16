import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Notification, NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent implements OnInit {
  notifications: Notification[] = [];


  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    console.log('NotificationComponent: Component initialized');

    // get notifications directly from service
    this.notifications = this.notificationService.getNotifications();

    console.log('NotificationComponent: Current notifications:', this.notifications.length);
  }

  // remove a specific notification
  removeNotification(id: string): void {
    console.log('NotificationComponent: Removing notification:', id);
    this.notificationService.removeNotification(id);

    // update local notifications array
    this.notifications = this.notificationService.getNotifications();
  }

  // get the appropriate icon for notification type
  getNotificationIcon(type: string): string {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return 'ℹ️';
    }
  }
}
