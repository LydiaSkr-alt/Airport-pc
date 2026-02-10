export enum TypeVol {
  NATIONAL = 'NATIONAL',
  INTERNATIONAL = 'INTERNATIONAL'
}

export enum StatutVol {
  PROGRAMME = 'PROGRAMME',
  ENREGISTREMENT = 'ENREGISTREMENT',
  EMBARQUEMENT = 'EMBARQUEMENT',
  PRET_DECOLLAGE = 'PRET_DECOLLAGE',
  DECOLLE = 'DECOLLE',
  EN_VOL = 'EN_VOL',
  EN_APPROCHE = 'EN_APPROCHE',
  ATTERRI = 'ATTERRI',
  ARRIVE = 'ARRIVE',
  RETARDE = 'RETARDE',
  DETOURNE = 'DETOURNE',
  ANNULE = 'ANNULE'
}

export enum TypeAction {
  CREATION = 'CREATION',
  MODIFICATION = 'MODIFICATION',
  CHANGEMENT_STATUT = 'CHANGEMENT_STATUT',
  ASSIGNATION_AVION = 'ASSIGNATION_AVION',
  SUPPRESSION = 'SUPPRESSION'
}

// Correspond à Segment (Response)
export interface Segment {
  numeroVol: string;
  origine: string;
  destination: string;
  heureDepart: string; // LocalDateTime
  heureArrivee: string; // LocalDateTime
  type: string;
  statut: string;
  avionImmatriculation: string | null;
}

// Correspond à SegmentRequest
export interface SegmentRequest {
  origine: string;
  destination: string;
  heureDepart: string; // LocalDateTime
  heureArrivee: string; // LocalDateTime
}

// Correspond à VolCreateRequest
export interface VolCreateRequest {
  numeroVol: string;
  type: TypeVol;
  origine: string;
  destination: string;
  heureDepart: string; // LocalDateTime
  heureArrivee: string; // LocalDateTime
  segments?: SegmentRequest[] | null;
  aeroportDepartCodeIATA?: string | null;
  aeroportArriveeCodeIATA?: string | null;
}

// Correspond à ModifierVolRequest
export interface ModifierVolRequest {
  heureDepart?: string | null;
  heureArrivee?: string | null;
}

// Correspond à VolResponse
export interface VolResponse {
  numeroVol: string;
  type: TypeVol;
  origine: string;
  destination: string;
  heureDepart: string; // LocalDateTime
  heureArrivee: string; // LocalDateTime
  statut: StatutVol;
  transitionsPossibles: StatutVol[];
  avionImmatriculation: string | null;
  estComposite: boolean;
  dureeTotale: number; // Long (minutes)
  escales: string[];
  segments: Segment[] | null;
  aeroportDepartCodeIATA: string | null;
  aeroportArriveeCodeIATA: string | null;
  pisteDepartIdentifiant: string | null;
  pisteArriveeIdentifiant: string | null;

  passagersEnregistres?: number;
  passagersEmbarques?: number;
  capaciteAvion?: number;
}

// Correspond à HistoriqueResponse
export interface HistoriqueResponse {
  numeroVol: string;
  typeAction: TypeAction;
  ancienneValeur: string | null;
  nouvelleValeur: string | null;
  details: string | null;
  timestamp?: string;
}

// Correspond à AssignerAvionRequest
export interface AssignerAvionRequest {
  immatriculation: string;
}

// Correspond à AssignerPisteRequest
export interface AssignerPisteRequest {
  identifiantPiste: string;
}

// Correspond à VolResume
export interface VolResume {
  numeroVol: string;
  origine: string;
  destination: string;
  heureDepart: string; // LocalDateTime
  heureArrivee: string; // LocalDateTime
  statut: StatutVol;
  pisteIdentifiant: string | null;
}
