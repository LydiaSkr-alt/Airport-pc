import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {  Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Avion } from '../interface/avion-interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AvionService {
  private apiUrl = `${environment.apiUrl}/avions`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Avion[]> {
    return this.http.get<Avion[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getById(immatriculation: string): Observable<Avion> {
    return this.http.get<Avion>(`${this.apiUrl}/${immatriculation}`).pipe(
      catchError(this.handleError)
    );
  }

  create(avion: Avion): Observable<Avion> {
    return this.http.post<Avion>(this.apiUrl, avion).pipe(
      catchError(this.handleError)
    );
  }

  update(immatriculation: string, avion: Avion): Observable<Avion> {
    return this.http.put<Avion>(`${this.apiUrl}/${immatriculation}`, avion).pipe(
      catchError(this.handleError)
    );
  }

  delete(immatriculation: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${immatriculation}`).pipe(
      catchError(this.handleError)
    );
  }
  getDisponibles(): Observable<Avion[]> {
    return this.http.get<Avion[]>(`${this.apiUrl}/disponibles`).pipe(
      catchError(this.handleError)
    );
  }

  getInHangar(): Observable<Avion[]> {
    return this.http.get<Avion[]>(`${this.apiUrl}/in-hangar`).pipe(
      catchError(this.handleError)
    );
  }


  private handleError(error: HttpErrorResponse) {
  let errorMessage = 'Une erreur inconnue est survenue';
  if (error.error instanceof ErrorEvent) {
    errorMessage = `Erreur côté client : ${error.error.message}`;
  } else {
    // Si le backend renvoie un objet { message: "..." }
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error.error || `Erreur serveur : ${error.status}`;
    }
  }
  return throwError(() => new Error(errorMessage));
}
}
