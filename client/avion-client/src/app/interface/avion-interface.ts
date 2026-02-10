

export interface Avion {
  immatriculation: string;
  capacitePassager: number;
  largeur: number;
  longueur: number;
  hauteur: number;
  volumeBagage: number;
  capaciteCarburant: number;
  autonomie: number;
  vitesseCroisiere: number;
  inHangar: Boolean,
  etatMaintenance: EtatMaintenance;
}

export enum EtatMaintenance {
  OK = "OK",
  EN_REVISION="EN_REVISION",
  EN_PANNE="EN_PANNE",
  EN_SERVICE="EN_SERVICE"

}



