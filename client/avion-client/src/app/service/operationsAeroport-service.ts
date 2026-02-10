// operations-aeroport.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { VolResponse } from '../interface/vol-interface';
import { EventSourceService } from './event-source-service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OperationsAeroportService {
  private apiUrl = `${environment.apiUrl}/operations`;

  constructor(
    private http: HttpClient,
    private esService: EventSourceService
  ) { }

  // ===== STREAM DES OPÉRATIONS =====

  /**
   * Stream SSE temps réel de toutes les opérations aéroportuaires
   */
  streamOperations(): Observable<VolResponse> {
    const url = `${this.apiUrl}/stream`;
    return this.esService.getStream<VolResponse>(url);
  }

  // ===== PRÉPARATION =====

  preparerVol(numeroVol: string, immatriculationAvion: string, identifiantPiste: string): Observable<VolResponse> {
    const params = new HttpParams()
      .set('immatriculationAvion', immatriculationAvion)
      .set('identifiantPiste', identifiantPiste);

    return this.http.post<VolResponse>(`${this.apiUrl}/${numeroVol}/preparer`, null, { params })
      .pipe(catchError(this.handleError));
  }

  // ===== FLUX DÉCOLLAGE =====

  demarrerEnregistrement(numeroVol: string): Observable<VolResponse> {
    return this.http.post<VolResponse>(`${this.apiUrl}/${numeroVol}/enregistrement`, null)
      .pipe(catchError(this.handleError));
  }

  demarrerEmbarquement(numeroVol: string): Observable<VolResponse> {
    return this.http.post<VolResponse>(`${this.apiUrl}/${numeroVol}/embarquement`, null)
      .pipe(catchError(this.handleError));
  }

  autoriserDecollage(numeroVol: string): Observable<VolResponse> {
    return this.http.post<VolResponse>(`${this.apiUrl}/${numeroVol}/autoriser-decollage`, null)
      .pipe(catchError(this.handleError));
  }

  confirmerDecollage(numeroVol: string): Observable<VolResponse> {
    return this.http.post<VolResponse>(`${this.apiUrl}/${numeroVol}/decollage`, null)
      .pipe(catchError(this.handleError));
  }

  // ===== FLUX ATTERRISSAGE =====

  preparerAtterrissage(numeroVol: string, identifiantPiste: string): Observable<VolResponse> {
    const params = new HttpParams().set('identifiantPiste', identifiantPiste);

    return this.http.post<VolResponse>(`${this.apiUrl}/${numeroVol}/preparer-atterrissage`, null, { params })
      .pipe(catchError(this.handleError));
  }

  autoriserAtterrissage(numeroVol: string): Observable<VolResponse> {
    return this.http.post<VolResponse>(`${this.apiUrl}/${numeroVol}/autoriser-atterrissage`, null)
      .pipe(catchError(this.handleError));
  }

  confirmerAtterrissage(numeroVol: string): Observable<VolResponse> {
    return this.http.post<VolResponse>(`${this.apiUrl}/${numeroVol}/atterrissage`, null)
      .pipe(catchError(this.handleError));
  }

  libererPisteArrivee(numeroVol: string): Observable<VolResponse> {
    return this.http.post<VolResponse>(`${this.apiUrl}/${numeroVol}/liberer-piste`, null)
      .pipe(catchError(this.handleError));
  }

  terminerVol(numeroVol: string): Observable<VolResponse> {
    return this.http.post<VolResponse>(`${this.apiUrl}/${numeroVol}/terminer`, null)
      .pipe(catchError(this.handleError));
  }

  // ===== OPÉRATIONS EXCEPTIONNELLES =====

  retarderVol(numeroVol: string): Observable<VolResponse> {
    return this.http.post<VolResponse>(`${this.apiUrl}/${numeroVol}/retarder`, null)
      .pipe(catchError(this.handleError));
  }

  annulerVol(numeroVol: string): Observable<VolResponse> {
    return this.http.post<VolResponse>(`${this.apiUrl}/${numeroVol}/annuler`, null)
      .pipe(catchError(this.handleError));
  }

  detournerVol(numeroVol: string): Observable<VolResponse> {
    return this.http.post<VolResponse>(`${this.apiUrl}/${numeroVol}/detourner`, null)
      .pipe(catchError(this.handleError));
  }

  // ===== GESTION DES ERREURS =====

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur inconnue est survenue';

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur côté client : ${error.error.message}`;
    } else {
      // Erreur côté serveur
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
