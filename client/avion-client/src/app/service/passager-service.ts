import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {map, Observable, throwError} from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import {
  PassagerCreateRequest,
  PassagerResponse,
  CheckInRequest,
  EnregistrementResponse,
  PassagerVolResponse,
  EmbarquementRequest,
  ModifierEnregistrementRequest,
  StatutEmbarquementResponse, PassagerUpdateRequest
} from '../interface/passager-interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PassagerService {
  private baseUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  // --- Gestion Passagers ---

  getAllPassagers(): Observable<PassagerResponse[]> {
    return this.http.get<PassagerResponse[]>(`${this.baseUrl}/passagers`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  createPassager(request: PassagerCreateRequest): Observable<PassagerResponse> {
    return this.http.post<PassagerResponse>(`${this.baseUrl}/passagers`, request).pipe(
      catchError(this.handleError)
    );
  }

  updatePassager(numeroPasseport: string, request: PassagerUpdateRequest): Observable<PassagerResponse> {
    return this.http.put<PassagerResponse>(`${this.baseUrl}/passagers/${numeroPasseport}`, request).pipe(
      catchError(this.handleError)
    );
  }

  getPassager(numeroPasseport: string): Observable<PassagerResponse> {
    return this.http.get<PassagerResponse>(`${this.baseUrl}/passagers/${numeroPasseport}`).pipe(
      catchError(this.handleError)
    );
  }

  deletePassager(numeroPasseport: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/passagers/${numeroPasseport}`).pipe(
      catchError(this.handleError)
    );
  }

  // --- Check-in / Enregistrement ---

  checkIn(request: CheckInRequest): Observable<EnregistrementResponse> {
    return this.http.post<EnregistrementResponse>(`${this.baseUrl}/passagers/check-in`, request).pipe(
      catchError(this.handleError)
    );
  }

  getEnregistrement(numeroPasseport: string, numeroVol: string): Observable<EnregistrementResponse> {
    return this.http.get<EnregistrementResponse>(
      `${this.baseUrl}/passagers/${numeroPasseport}/enregistrements/${numeroVol}`
    ).pipe(catchError(this.handleError));
  }

  modifierEnregistrement(
    numeroPasseport: string,
    numeroVol: string,
    request: ModifierEnregistrementRequest
  ): Observable<EnregistrementResponse> {
    return this.http.patch<EnregistrementResponse>(
      `${this.baseUrl}/passagers/${numeroPasseport}/enregistrements/${numeroVol}`,
      request
    ).pipe(catchError(this.handleError));
  }

  annulerEnregistrement(numeroPasseport: string, numeroVol: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/passagers/${numeroPasseport}/enregistrements/${numeroVol}`
    ).pipe(catchError(this.handleError));
  }
  getEnregistrementsParVol(numeroVol: string): Observable<EnregistrementResponse[]> {
    return this.http.get<EnregistrementResponse[]>(
      `${this.baseUrl}/vols/${numeroVol}/passagers/enregistrements`
    );
  }



  // --- Embarquement & Gestion Vol ---

  getPassagersDuVol(numeroVol: string): Observable<PassagerVolResponse[]> {
    return this.http.get<PassagerVolResponse[]>(
      `${this.baseUrl}/vols/${numeroVol}/passagers`
    ).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  getStatutEmbarquement(numeroVol: string): Observable<StatutEmbarquementResponse> {
    return this.http.get<StatutEmbarquementResponse>(
      `${this.baseUrl}/vols/${numeroVol}/passagers/embarquement/statut`
    ).pipe(catchError(this.handleError));
  }

  embarquerPassager(request: EmbarquementRequest): Observable<EnregistrementResponse> {
    return this.http.post<EnregistrementResponse>(
      `${this.baseUrl}/passagers/embarquement`,
      request
    ).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Erreur inconnue';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur réseau : ${error.error.message}`;
    } else {
      errorMessage = error.error?.message || `Erreur serveur ${error.status}`;
    }
    console.error('Erreur API:', error);
    return throwError(() => new Error(errorMessage));
  }
}
