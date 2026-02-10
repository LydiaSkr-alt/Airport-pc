import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import {
  TraficDashboardResponse,
  VolTraficResponse,
  PlanningPisteResponse
} from '../interface/trafic-interface';
import { StatutVol } from '../interface/vol-interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TraficService {
  private apiUrl = `${environment.apiUrl}/aeroports`;

  constructor(private http: HttpClient) { }

  // Vue consolidée du trafic
  getVueConsolidee(codeIATA: string): Observable<TraficDashboardResponse> {
    return this.http.get<TraficDashboardResponse>(`${this.apiUrl}/${codeIATA}/trafic`)
      .pipe(catchError(this.handleError));
  }

  // Vols au départ
  getVolsDepart(codeIATA: string, statut?: StatutVol): Observable<VolTraficResponse[]> {
    let params = new HttpParams();
    if (statut) {
      params = params.set('statut', statut);
    }
    return this.http.get<VolTraficResponse[]>(`${this.apiUrl}/${codeIATA}/trafic/departs`, { params })
      .pipe(catchError(this.handleError));
  }

  // Vols à l'arrivée
  getVolsArrivee(codeIATA: string, statut?: StatutVol): Observable<VolTraficResponse[]> {
    let params = new HttpParams();
    if (statut) {
      params = params.set('statut', statut);
    }
    return this.http.get<VolTraficResponse[]>(`${this.apiUrl}/${codeIATA}/trafic/arrivees`, { params })
      .pipe(catchError(this.handleError));
  }

  // Planning des pistes
  getPlanningPistes(codeIATA: string): Observable<PlanningPisteResponse[]> {
    return this.http.get<PlanningPisteResponse[]>(`${this.apiUrl}/${codeIATA}/trafic/pistes`)
      .pipe(catchError(this.handleError));
  }

  // Planning d'une piste spécifique
  getPlanningPiste(codeIATA: string, identifiant: string): Observable<PlanningPisteResponse> {
    return this.http.get<PlanningPisteResponse>(`${this.apiUrl}/${codeIATA}/trafic/pistes/${identifiant}`)
      .pipe(catchError(this.handleError));
  }

  // Gestion des erreurs
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur inconnue est survenue';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur côté client : ${error.error.message}`;
    } else {
      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (typeof error.error === 'string') {
        errorMessage = error.error;
      } else {
        errorMessage = `Erreur serveur : ${error.status} ${error.statusText}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
