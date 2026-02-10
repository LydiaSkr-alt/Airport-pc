// notification.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StatutVol } from '../interface/vol-interface';

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  numeroVol?: string;
  statut?: StatutVol;
  autoClose: boolean;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notifications$ = new BehaviorSubject<Notification[]>([]);
  private maxNotifications = 7;

  getNotifications(): Observable<Notification[]> {
    return this.notifications$.asObservable();
  }

  addNotification(notification: Omit<Notification, 'id' | 'timestamp'>): void {
    const newNotif: Notification = {
      ...notification,
      id: Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      timestamp: new Date()
    };

    const current = this.notifications$.value;
    const updated = [newNotif, ...current].slice(0, this.maxNotifications);
    this.notifications$.next(updated);

    if (newNotif.autoClose) {
      setTimeout(() => this.removeNotification(newNotif.id), 5000);
    }
  }

  removeNotification(id: string): void {
    const updated = this.notifications$.value.filter(n => n.id !== id);
    this.notifications$.next(updated);
  }

  clearAll(): void {
    this.notifications$.next([]);
  }
}
