import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import {
  StatutVol,
  VolResponse,
  VolCreateRequest,
  ModifierVolRequest,
  HistoriqueResponse,
  AssignerAvionRequest,
  AssignerPisteRequest
} from '../interface/vol-interface';
import { Avion } from '../interface/avion-interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VolService {
  private apiUrl = `${environment.apiUrl}/vols`;

  constructor(private http: HttpClient) { }

  // --- CRUD Standard ---

  // Lister tous les vols (avec filtre optionnel par statut)
  listerVols(statut?: StatutVol): Observable<VolResponse[]> {
    let params = new HttpParams();
    if (statut) {
      params = params.set('statut', statut);
    }
    return this.http.get<VolResponse[]>(this.apiUrl, { params }).pipe(catchError(this.handleError));
  }

  // Récupérer un vol par son numéro
  lireVol(numeroVol: string): Observable<VolResponse> {
    return this.http.get<VolResponse>(`${this.apiUrl}/${numeroVol}`).pipe(catchError(this.handleError));
  }

  // Créer un nouveau vol
  creerVol(vol: VolCreateRequest): Observable<VolResponse> {
    return this.http.post<VolResponse>(this.apiUrl, vol).pipe(catchError(this.handleError));
  }

  // Modifier un vol existant (heures uniquement)
  modifierVol(numeroVol: string, modifications: ModifierVolRequest): Observable<VolResponse> {
    return this.http.put<VolResponse>(`${this.apiUrl}/${numeroVol}`, modifications).pipe(catchError(this.handleError));
  }

  // Supprimer un vol
  supprimerVol(numeroVol: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${numeroVol}`).pipe(catchError(this.handleError));
  }

  // --- Fonctionnalités Spécifiques ---

  // Changer le statut d'un vol
  changerStatut(numeroVol: string, statut: StatutVol): Observable<VolResponse> {
    const params = new HttpParams().set('statut', statut);
    return this.http.patch<VolResponse>(`${this.apiUrl}/${numeroVol}/statut`, null, { params })
      .pipe(catchError(this.handleError));
  }

  // Récupérer les transitions possibles
  getTransitionsPossibles(numeroVol: string): Observable<Set<StatutVol>> {
    return this.http.get<Set<StatutVol>>(`${this.apiUrl}/${numeroVol}/transitions`)
      .pipe(catchError(this.handleError));
  }

  // Assigner un avion à un vol
  assignerAvion(numeroVol: string, immatriculation: string): Observable<VolResponse> {
    const body: AssignerAvionRequest = { immatriculation: immatriculation };
    return this.http.patch<VolResponse>(`${this.apiUrl}/${numeroVol}/avion`, body)
      .pipe(catchError(this.handleError));
  }

  // Consulter l'avion assigné à un vol
  consulterAvionAssigne(numeroVol: string): Observable<Avion | null> {
    return this.http.get<Avion | null>(`${this.apiUrl}/${numeroVol}/avion`)
      .pipe(catchError(this.handleError));
  }

  // Consulter l'historique d'un vol
  consulterHistorique(numeroVol: string): Observable<HistoriqueResponse[]> {
    return this.http.get<HistoriqueResponse[]>(`${this.apiUrl}/${numeroVol}/historique`)
      .pipe(catchError(this.handleError));
  }

  // --- Gestion des Pistes ---

  // Assigner une piste de départ
  assignerPisteDepart(numeroVol: string, identifiantPiste: string): Observable<VolResponse> {
    const body: AssignerPisteRequest = { identifiantPiste: identifiantPiste };
    return this.http.patch<VolResponse>(`${this.apiUrl}/${numeroVol}/piste-depart`, body)
      .pipe(catchError(this.handleError));
  }

  // Assigner une piste d'arrivée
  assignerPisteArrivee(numeroVol: string, identifiantPiste: string): Observable<VolResponse> {
    const body: AssignerPisteRequest = { identifiantPiste: identifiantPiste };
    return this.http.patch<VolResponse>(`${this.apiUrl}/${numeroVol}/piste-arrivee`, body)
      .pipe(catchError(this.handleError));
  }

  // Libérer la piste de départ
  libererPisteDepart(numeroVol: string): Observable<VolResponse> {
    return this.http.delete<VolResponse>(`${this.apiUrl}/${numeroVol}/piste-depart`)
      .pipe(catchError(this.handleError));
  }

  // Libérer la piste d'arrivée
  libererPisteArrivee(numeroVol: string): Observable<VolResponse> {
    return this.http.delete<VolResponse>(`${this.apiUrl}/${numeroVol}/piste-arrivee`)
      .pipe(catchError(this.handleError));
  }

// --- Opérations Aéroport ---
  private operationsUrl = `${environment.apiUrl}/operations`;

  preparerVol(numeroVol: string, immatriculationAvion: string, identifiantPiste: string): Observable<VolResponse> {
    const params = new HttpParams()
      .set('immatriculationAvion', immatriculationAvion)
      .set('identifiantPiste', identifiantPiste);
    return this.http.post<VolResponse>(`${this.operationsUrl}/${numeroVol}/preparer`, null, { params })
      .pipe(catchError(this.handleError));
  }

  demarrerEnregistrement(numeroVol: string): Observable<VolResponse> {
    return this.http.post<VolResponse>(`${this.operationsUrl}/${numeroVol}/enregistrement`, null)
      .pipe(catchError(this.handleError));
  }

  demarrerEmbarquement(numeroVol: string): Observable<VolResponse> {
    return this.http.post<VolResponse>(`${this.operationsUrl}/${numeroVol}/embarquement`, null)
      .pipe(catchError(this.handleError));
  }

  autoriserDecollage(numeroVol: string): Observable<VolResponse> {
    return this.http.post<VolResponse>(`${this.operationsUrl}/${numeroVol}/autoriser-decollage`, null)
      .pipe(catchError(this.handleError));
  }

  confirmerDecollage(numeroVol: string): Observable<VolResponse> {
    return this.http.post<VolResponse>(`${this.operationsUrl}/${numeroVol}/decollage`, null)
      .pipe(catchError(this.handleError));
  }

  preparerAtterrissage(numeroVol: string, identifiantPiste: string): Observable<VolResponse> {
    const params = new HttpParams().set('identifiantPiste', identifiantPiste);
    return this.http.post<VolResponse>(`${this.operationsUrl}/${numeroVol}/preparer-atterrissage`, null, { params })
      .pipe(catchError(this.handleError));
  }

  autoriserAtterrissage(numeroVol: string): Observable<VolResponse> {
    return this.http.post<VolResponse>(`${this.operationsUrl}/${numeroVol}/autoriser-atterrissage`, null)
      .pipe(catchError(this.handleError));
  }

  confirmerAtterrissage(numeroVol: string): Observable<VolResponse> {
    return this.http.post<VolResponse>(`${this.operationsUrl}/${numeroVol}/atterrissage`, null)
      .pipe(catchError(this.handleError));
  }

  terminerVol(numeroVol: string): Observable<VolResponse> {
    return this.http.post<VolResponse>(`${this.operationsUrl}/${numeroVol}/terminer`, null)
      .pipe(catchError(this.handleError));
  }

  retarderVol(numeroVol: string): Observable<VolResponse> {
    return this.http.post<VolResponse>(`${this.operationsUrl}/${numeroVol}/retarder`, null)
      .pipe(catchError(this.handleError));
  }

  annulerVol(numeroVol: string): Observable<VolResponse> {
    return this.http.post<VolResponse>(`${this.operationsUrl}/${numeroVol}/annuler`, null)
      .pipe(catchError(this.handleError));
  }

  detournerVol(numeroVol: string): Observable<VolResponse> {
    return this.http.post<VolResponse>(`${this.operationsUrl}/${numeroVol}/detourner`, null)
      .pipe(catchError(this.handleError));
  }


  // --- Gestion des Erreurs ---
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
  getVol(numeroVol: string): Observable<VolResponse> {
    return this.http.get<VolResponse>(`${this.apiUrl}/vols/${numeroVol}`);
  }

  // API EXTERNE
  listerVolsExternes(): Observable<VolResponse[]> {
    const urlPartage = `${environment.apiUrl}/vols/partage/externe`;
    return this.http.get<VolResponse[]>(urlPartage).pipe(catchError(this.handleError));
  }
}
