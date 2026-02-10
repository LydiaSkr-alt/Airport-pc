import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Avion } from '../interface/avion-interface';
import { HangarRequest } from '../interface/hangar-interface';
import { Hangar } from '../interface/hangar-interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HangarService {
  private apiUrl = `${environment.apiUrl}/hangars`;

  constructor(private http: HttpClient) {}

  createHangar(request: HangarRequest): Observable<Hangar> {
    return this.http.post<Hangar>(this.apiUrl, request).pipe(catchError(this.handleError));
  }

  updateHangar(id: string, request: HangarRequest): Observable<Hangar> {
    return this.http.put<Hangar>(`${this.apiUrl}/${id}`, request).pipe(catchError(this.handleError));
  }

  getHangar(id: string): Observable<Hangar> {
    return this.http.get<Hangar>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  getAllHangars(): Observable<Hangar[]> {
    return this.http.get<Hangar[]>(this.apiUrl).pipe(catchError(this.handleError));
  }

  getAvionsDansHangar(id: string): Observable<Avion[]> {
    return this.http.get<Avion[]>(`${this.apiUrl}/${id}/avions`).pipe(catchError(this.handleError));
  }

  getAvionsDisponiblesPourAssociation(): Observable<Avion[]> {
    return this.http.get<Avion[]>(`${this.apiUrl}/avions/disponibles`).pipe(catchError(this.handleError));
  }

  deleteHangar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  // Correction : route avec /avions/ et méthode POST
  associerAvion(hangarId: string, immatriculationAvion: string): Observable<Hangar> {
    return this.http.post<Hangar>(`${this.apiUrl}/${hangarId}/avions/${immatriculationAvion}`, {})
      .pipe(catchError(this.handleError));
  }

  // Correction : route avec /avions/ et méthode DELETE
  dissocierAvion(hangarId: string, immatriculationAvion: string): Observable<Hangar> {
    return this.http.delete<Hangar>(`${this.apiUrl}/${hangarId}/avions/${immatriculationAvion}`)
      .pipe(catchError(this.handleError));
  }

  // Récupérer les pistes d'un aéroport spécifique
  getHangarsByAeroport(codeIATA: string): Observable<HangarRequest[]> {
    // Filtrer côté client si l'API ne fournit pas cet endpoint
    return this.http.get<HangarRequest[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Récupérer les pistes disponibles d'un aéroport spécifique
  getHangarsDisponiblesByAeroport(codeIATA: string): Observable<HangarRequest[]> {
    return this.http.get<HangarRequest[]>(`${this.apiUrl}/disponibles`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur inconnue est survenue';
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (typeof error.error === 'string') {
      errorMessage = error.error;
    } else if (error.message) {
      errorMessage = error.message;
    } else {
      errorMessage = `Erreur serveur : ${error.status} ${error.statusText}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
