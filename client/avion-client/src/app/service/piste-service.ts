import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  PisteResponse,
  PisteCreateRequest,
  PisteUpdateRequest,
  EtatPiste
} from '../interface/piste-interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PisteService {
  private apiUrl = `${environment.apiUrl}/pistes`;

  constructor(private http: HttpClient) {}

  // Récupérer toutes les pistes
  getAllPistes(): Observable<PisteResponse[]> {
    return this.http.get<PisteResponse[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Récupérer uniquement les pistes disponibles
  getPistesDisponibles(): Observable<PisteResponse[]> {
    return this.http.get<PisteResponse[]>(`${this.apiUrl}/disponibles`).pipe(
      catchError(this.handleError)
    );
  }

  // Récupérer une piste par son identifiant
  getPiste(identifiant: string): Observable<PisteResponse> {
    return this.http.get<PisteResponse>(`${this.apiUrl}/${identifiant}`).pipe(
      catchError(this.handleError)
    );
  }

  // Créer une nouvelle piste
  createPiste(pisteData: PisteCreateRequest): Observable<PisteResponse> {
    return this.http.post<PisteResponse>(this.apiUrl, pisteData).pipe(
      catchError(this.handleError)
    );
  }

  // Modifier une piste existante (longueur, largeur, orientation, capacité)
  updatePiste(identifiant: string, pisteData: PisteUpdateRequest): Observable<PisteResponse> {
    return this.http.put<PisteResponse>(`${this.apiUrl}/${identifiant}`, pisteData).pipe(
      catchError(this.handleError)
    );
  }

  // Changer l'état d'une piste
  changerEtat(identifiant: string, nouvelEtat: EtatPiste): Observable<PisteResponse> {
    const params = new HttpParams().set('nouvelEtat', nouvelEtat);
    return this.http.patch<PisteResponse>(`${this.apiUrl}/${identifiant}/etat`, null, { params }).pipe(
      catchError(this.handleError)
    );
  }

  // Récupérer les transitions possibles pour une piste
  getTransitionsPossibles(identifiant: string): Observable<Set<EtatPiste>> {
    return this.http.get<Set<EtatPiste>>(`${this.apiUrl}/${identifiant}/transitions`).pipe(
      catchError(this.handleError)
    );
  }

  // Récupérer les pistes d'un aéroport spécifique
  getPistesByAeroport(codeIATA: string): Observable<PisteResponse[]> {
    // Filtrer côté client si l'API ne fournit pas cet endpoint
    return this.http.get<PisteResponse[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Récupérer les pistes disponibles d'un aéroport spécifique
  getPistesDisponiblesByAeroport(codeIATA: string): Observable<PisteResponse[]> {
    return this.http.get<PisteResponse[]>(`${this.apiUrl}/disponibles`).pipe(
      catchError(this.handleError)
    );
  }

  // Supprimer une piste
  deletePiste(identifiant: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${identifiant}`).pipe(
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
