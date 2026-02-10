import { StatutVol } from './vol-interface';

// Correspond à VolTraficResponse
export interface VolTraficResponse {
  numeroVol: string;
  origine: string;
  destination: string;
  heureDepart: string;
  heureArrivee: string;
  statut: StatutVol;
  avionImmatriculation: string | null;
  pisteAssignee: string | null;
}

// Correspond à StatistiquesTrafic
export interface StatistiquesTrafic {
  totalVolsDepart: number;
  totalVolsArrivee: number;
  volsEnCours: number;
  volsRetardes: number;
  pistesDisponibles: number;
  pistesOccupees: number;
}

// Correspond à TraficDashboardResponse
export interface TraficDashboardResponse {
  aeroportCodeIATA: string;
  timestamp: string;
  statistiques: StatistiquesTrafic;
  volsDepart: VolTraficResponse[];
  volsArrivee: VolTraficResponse[];
  pistes: PlanningPisteResponse[];
}

// Enums pour les pistes
export enum EtatPiste {
  LIBRE = 'LIBRE',
  OCCUPEE = 'OCCUPEE',
  MAINTENANCE = 'MAINTENANCE',
  FERMEE = 'FERMEE'
}

export enum TypeUtilisationPiste {
  DECOLLAGE = 'DECOLLAGE',
  ATTERRISSAGE = 'ATTERRISSAGE'
}

// Correspond à OperationEnCoursResponse
export interface OperationEnCoursResponse {
  numeroVol: string;
  typeOperation: TypeUtilisationPiste;
  heureDebut: string;
}

// Correspond à OperationHistoriqueResponse
export interface OperationHistoriqueResponse {
  numeroVol: string;
  typeOperation: TypeUtilisationPiste;
  heureDebut: string;
  heureFin: string | null;
  dureeSecondes: number | null;
}

// Correspond à OperationPlanifieeResponse
export interface OperationPlanifieeResponse {
  numeroVol: string;
  typeOperation: TypeUtilisationPiste;
  heurePrevue: string;
}

// Correspond à PlanningPisteResponse
export interface PlanningPisteResponse {
  identifiant: string;
  etat: EtatPiste;
  operationEnCours: OperationEnCoursResponse | null;
  prochainesOperations: OperationPlanifieeResponse[];
  historiqueRecent: OperationHistoriqueResponse[];
}

// Pour les aéroports
export interface AeroportResponse {
  codeIATA: string;
  nom: string;
  ville: string;
  pays: string;
  urlApi: string | null;
  estLocal: boolean;
  nombrePistes: number;
  nombreHangars: number;
}

export interface AeroportRequest {
  codeIATA: string;
  nom: string;
  ville: string;
  pays: string;
  urlApi?: string | null;
  estLocal?: boolean;
}

export interface AeroportUpdateRequest {
  nom: string;
  ville: string;
  pays: string;
  urlApi?: string | null;
  estLocal?: boolean;
}
