// aeroport-service.ts
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  AeroportResponse,
  AeroportCreateRequest,
  AeroportUpdateRequest
} from '../interface/aeroport-interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AeroportService {
  private apiUrl = `${environment.apiUrl}/aeroports`;

  constructor(private http: HttpClient) {}

  // Récupérer tous les aéroports
  getAllAeroports(): Observable<AeroportResponse[]> {
    return this.http.get<AeroportResponse[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getAeroport(codeIATA: string): Observable<AeroportResponse> {
    return this.http.get<AeroportResponse>(`${this.apiUrl}/${codeIATA}`).pipe(
      catchError(this.handleError)
    );
  }

  getAeroportLocal(): Observable<AeroportResponse> {
    return this.http.get<AeroportResponse>(`${this.apiUrl}/local`).pipe(
      catchError(this.handleError)
    );
  }

  getPartenaires(): Observable<AeroportResponse[]> {
    return this.http.get<AeroportResponse[]>(`${this.apiUrl}/partenaires`).pipe(
      catchError(this.handleError)
    );
  }

  createAeroport(aeroportData: AeroportCreateRequest): Observable<AeroportResponse> {
    return this.http.post<AeroportResponse>(this.apiUrl, aeroportData).pipe(
      catchError(this.handleError)
    );
  }

  updateAeroport(codeIATA: string, aeroportData: AeroportUpdateRequest): Observable<AeroportResponse> {
    return this.http.put<AeroportResponse>(`${this.apiUrl}/${codeIATA}`, aeroportData).pipe(
      catchError(this.handleError)
    );
  }

  deleteAeroport(codeIATA: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${codeIATA}`).pipe(
      catchError(this.handleError)
    );
  }

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
