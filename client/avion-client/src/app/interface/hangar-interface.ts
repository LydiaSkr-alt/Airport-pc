import { Avion } from './avion-interface';

export interface Hangar{
  identifiant: string,
   capacite: number,
  etat: EtatHangar,
  avions : Avion[] ,
  aeroportCodeIATA?: string | null
}
export interface HangarRequest {
  identifiant: string;
  capacite: number;
  etat: EtatHangar;
  aeroportCodeIATA?: string | null
}

export enum EtatHangar {
  Disponible = 'Disponible',
  Rempli = 'Rempli',
  Vide = 'Vide',
  EnMaintenance = 'EnMaintenance'
}
