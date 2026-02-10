// passager-interface.ts

// Enums
export enum ClasseVoyage {
  ECONOMIQUE = 'ECONOMIQUE',
  AFFAIRES = 'AFFAIRES',
  PREMIERE = 'PREMIERE'
}

export enum StatutEnregistrement {
  ENREGISTRE = 'ENREGISTRE',
  EMBARQUE = 'EMBARQUE',
  ANNULE = 'ANNULE',
  DEBARQUE = 'DEBARQUE'
}

// Request DTOs
export interface PassagerCreateRequest {
  numeroPasseport: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateNaissance?: string; // Format YYYY-MM-DD
}

export interface PassagerUpdateRequest {
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
}

export interface CheckInRequest {
  numeroPasseport: string;
  numeroVol: string;
  numeroSiege: string;
  classeVoyage: ClasseVoyage;
  nombreBagages: number;
}

export interface ModifierEnregistrementRequest {
  nouveauSiege?: string;
  classeVoyage?: ClasseVoyage;
  nombreBagages?: number;
}

export interface EmbarquementRequest {
  numeroPasseport: string;
  numeroVol: string;
}

// Response DTOs
export interface PassagerResponse {
  id: number;
  numeroPasseport: string;
  nom: string;
  prenom: string;
  nomComplet: string;
  email: string | null;
  telephone: string | null;
  dateNaissance?: string;
}

export interface EnregistrementResponse {
  id: number;
  passager: PassagerResponse;
  numeroVol: string;
  numeroSiege: string;
  classeVoyage: ClasseVoyage;
  statut: StatutEnregistrement;
  heureEnregistrement: string;
  heureEmbarquement: string | null;
  baggageEnregistre: boolean;
  nombreBagages: number;
  peutEmbarquer: boolean;
  peutModifier: boolean;
}

export interface PassagerVolResponse {
  numeroSiege: string;
  nomComplet: string;
  classeVoyage: ClasseVoyage;
  statut: StatutEnregistrement;
  estEmbarque: boolean;
}

export interface StatutClasseResponse {
  enregistres: number;
  embarques: number;
}

export interface StatutEmbarquementResponse {
  numeroVol: string;
  passagersEnregistres: number;
  passagersEmbarques: number;
  passagersTotal: number;
  passagersRestants: number;
  progressionPourcentage: number;
  embarquementTermine: boolean;
  passagersParClasse: Record<ClasseVoyage, StatutClasseResponse>;
}
