// suivi-vol.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EventSourceService } from './event-source-service';
import { EvenementVolResponse } from '../interface/suivi-vol-interface';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SuiviVolService {

  private baseUrl = `${environment.apiUrl}`;

  constructor(private esService: EventSourceService) {}

  streamEvenementsVol(numeroVol: string): Observable<EvenementVolResponse> {
    const url = `${this.baseUrl}/vols/${numeroVol}/stream`;
    return this.esService.getStream<EvenementVolResponse>(url);
  }

  streamEmbarquement(numeroVol: string): Observable<EvenementVolResponse> {
    const url = `${this.baseUrl}/suivi//vols/${numeroVol}/embarquement/stream`;
    return this.esService.getStream<EvenementVolResponse>(url);
  }

  streamTousLesEvenements(): Observable<EvenementVolResponse> {
    const url = `${this.baseUrl}/operations/stream`;
    console.log('🚀 Tentative de connexion sur:', url);
    return this.esService.getStream<EvenementVolResponse>(url);
  }
}
