// Correspond à PisteResponse.kt
export interface PisteResponse {
  identifiant: string;
  longueur: number;
  largeur: number;
  etat: EtatPiste;
  orientation: OrientationPiste;
  capaciteMaximale: number;
  transitionsPossibles: EtatPiste[];
  aeroportCodeIATA: string | null;
}

// Correspond à PisteCreateRequest.kt
export interface PisteCreateRequest {
  identifiant: string;
  longueur: number;
  largeur: number;
  orientation: OrientationPiste;
  capaciteMaximale: number;
  aeroportCodeIATA?: string | null;
}

// Correspond à PisteUpdateRequest.kt
export interface PisteUpdateRequest {
  longueur: number;
  largeur: number;
  orientation: OrientationPiste;
  capaciteMaximale: number;
}

// Correspond à AssignerPisteRequest.kt
export interface AssignerPisteRequest {
  identifiantPiste: string;
}

export enum OrientationPiste {
  NORD = 'NORD',
  SUD = 'SUD',
  EST = 'EST',
  OUEST = 'OUEST'
}

export enum EtatPiste {
  LIBRE = 'LIBRE',
  OCCUPEE = 'OCCUPEE',
  EN_MAINTENANCE = 'EN_MAINTENANCE',
  FERMEE = 'FERMEE',
  HORS_SERVICE = 'HORS_SERVICE'
}
