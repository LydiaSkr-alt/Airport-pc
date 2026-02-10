// event-source.service.ts
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventSourceService {

  constructor(private zone: NgZone) {}

  getStream<T>(url: string): Observable<T> {
    return new Observable<T>(observer => {
      const es = new EventSource(url);

      es.onmessage = event => {
        this.zone.run(() => {
          try {
            const data = JSON.parse(event.data) as T;
            observer.next(data);
          } catch (e) {
            observer.error(e);
          }
        });
      };

      es.onerror = err => {
        this.zone.run(() => {
          console.warn('SSE error (ignored)', err);
        });
      };

      return () => es.close();
    });
  }
}
