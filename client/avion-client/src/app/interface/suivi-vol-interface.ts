import {StatutVol} from './vol-interface';

export enum TypeEvenementVol {
  CHANGEMENT_STATUT = 'CHANGEMENT_STATUT',
  EMBARQUEMENT_DEBUTE = 'EMBARQUEMENT_DEBUTE',
  PASSAGER_EMBARQUE = 'PASSAGER_EMBARQUE',
  EMBARQUEMENT_TERMINE = 'EMBARQUEMENT_TERMINE',
  PORTES_OUVERTES = 'PORTES_OUVERTES',
  PORTES_FERMEES = 'PORTES_FERMEES',
  DECOLLAGE = 'DECOLLAGE',
  ATTERRISSAGE = 'ATTERRISSAGE',
  RETARD_ANNONCE = 'RETARD_ANNONCE',
  ANNULATION = 'ANNULATION',
  PISTE_ASSIGNEE = 'PISTE_ASSIGNEE',
  AVION_ASSIGNE = 'AVION_ASSIGNE',
  CHECK_IN_OUVERT = 'CHECK_IN_OUVERT',
  CHECK_IN_FERME = 'CHECK_IN_FERME'
}
export interface EvenementVolResponse {
  id: string;
  numeroVol: string;
  typeEvenement: TypeEvenementVol;
  ancienStatut?: StatutVol | null;
  nouveauStatut?: StatutVol | null;
  timestamp: string;                 // LocalDateTime -> string ISO
  details: { [key: string]: any };   // Map<String, Any>
  message?: string | null;
}
