// notification-toast.component.ts
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../service/notification-service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-notification-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-container">
      <div
        *ngFor="let notif of notifications$ | async"
        class="notification-toast"
        [ngClass]="{
          'success': notif.type === 'success',
          'error': notif.type === 'error',
          'warning': notif.type === 'warning',
          'info': notif.type === 'info'
        }">

        <div class="toast-content">
          <span class="toast-icon">{{ getIcon(notif.type) }}</span>
          <div class="toast-text">
            <strong *ngIf="notif.numeroVol">Vol {{ notif.numeroVol }}</strong>
            <p>{{ notif.message }}</p>
            <small *ngIf="notif.statut" class="statut-badge">{{ notif.statut }}</small>
            <small class="timestamp">{{ notif.timestamp | date:'HH:mm:ss' }}</small>
          </div>
          <button class="toast-close" (click)="close(notif.id)">×</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      bottom: 20px;
      left: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column-reverse;
      gap: 10px;
      max-width: 400px;
      pointer-events: none;
    }

    .notification-toast {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      padding: 16px;
      animation: slideIn 0.3s ease-out;
      border-left: 4px solid #3b82f6;
      pointer-events: auto;
    }

    .notification-toast.success {
      border-left-color: #22c55e;
    }

    .notification-toast.error {
      border-left-color: #ef4444;
    }

    .notification-toast.warning {
      border-left-color: #f59e0b;
    }

    .notification-toast.info {
      border-left-color: #3b82f6;
    }

    .toast-content {
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }

    .toast-icon {
      font-size: 24px;
      flex-shrink: 0;
    }

    .toast-text {
      flex: 1;
    }

    .toast-text strong {
      display: block;
      font-size: 14px;
      margin-bottom: 4px;
      color: #1f2937;
      font-weight: 600;
    }

    .toast-text p {
      margin: 0 0 4px 0;
      font-size: 13px;
      color: #4b5563;
      line-height: 1.4;
    }

    .toast-text .statut-badge {
      display: inline-block;
      padding: 2px 8px;
      background: #e5e7eb;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 600;
      color: #374151;
      margin-right: 8px;
    }

    .toast-text .timestamp {
      font-size: 11px;
      color: #9ca3af;
    }

    .toast-close {
      background: none;
      border: none;
      font-size: 24px;
      color: #9ca3af;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      flex-shrink: 0;
      line-height: 1;
      transition: color 0.2s;
    }

    .toast-close:hover {
      color: #4b5563;
    }

    @keyframes slideIn {
      from {
        transform: translateX(-100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `]
})
export class NotificationToastComponent implements OnInit {
  notifications$!: Observable<Notification[]>;

  constructor(
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.notifications$ = this.notificationService.getNotifications();

    // Debug: vérifier que les notifications arrivent
    this.notifications$.subscribe(notifs => {
      console.log('🔔 Notifications reçues dans le composant:', notifs);
    });
  }

  close(id: string): void {
    this.notificationService.removeNotification(id);
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  }
}
