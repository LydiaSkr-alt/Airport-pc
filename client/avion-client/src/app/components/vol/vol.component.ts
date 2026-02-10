import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  StatutVol,
  TypeVol,
  VolResponse,
  VolCreateRequest,
  ModifierVolRequest,
  HistoriqueResponse,
} from '../../interface/vol-interface';
import { VolService } from '../../service/vol-service';
import { Avion} from '../../interface/avion-interface';
import { AvionService } from '../../service/avion-service';
import { PisteResponse } from '../../interface/piste-interface';
import { PisteService } from '../../service/piste-service';
import {Observable} from 'rxjs';
import {AeroportResponse} from '../../interface/aeroport-interface'
import {AeroportService} from '../../service/aeroport-service'
import {VolCacheService} from '../../service/vol-cache-service';
import {StatutEnregistrement} from '../../interface/passager-interface';
import {PassagerService} from '../../service/passager-service';

@Component({
  selector: 'app-vol',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vol.component.html',
  styleUrls: ['./vol.component.css']
})
export class VolComponent implements OnInit {

  vols: VolResponse[] = [];
  aeroports: AeroportResponse[] = [];


  newVolCreate: VolCreateRequest = this.emptyVolCreate();
  newVolUpdate: ModifierVolRequest = this.emptyVolUpdate();
  editing: boolean = false;
  editingNumeroVol: string = '';
  statutOptions = Object.values(StatutVol);
  typeOptions = Object.values(TypeVol);
  errorMessage: string = '';

  historiqueAffiche: HistoriqueResponse[] | null = null;
  volHistoriqueSelectionne: string | null = null;

  avionsDisponibles: Avion[] = [];
  selectedVolForAssignAvion: string | null = null;

  pistesDisponibles: PisteResponse[] = [];
  selectedVolForAssignPiste: string | null = null;
  typePiste: 'depart' | 'arrivee' = 'depart';

  selectedVolForStatut: VolResponse | null = null;
  nouveauStatut: StatutVol = StatutVol.PROGRAMME;

  selectedVolForPreparation: string | null = null;
  selectedAvionForPreparation: string = '';
  selectedPisteForPreparation: string = '';

  selectedVolForPreparationAtterrissage: string | null = null;
  selectedPisteForAtterrissage: string = '';

  constructor(
    private volService: VolService,
    private avionService: AvionService,
    private pisteService: PisteService,
    private aeroportService : AeroportService,
    private volCacheService: VolCacheService,
    private passagerService : PassagerService
  ) {}

  ngOnInit(): void {
    this.loadVols();
    this.loadAeroports();
  }

  loadVols(): void {
    this.volService.listerVols().subscribe({
      next: data => {
        this.vols = data;
        this.volCacheService.updateVols(data);
        this.errorMessage = '';
      },
      error: err => this.errorMessage = err.message || 'Erreur lors du chargement des vols.'
    });
  }
  loadAeroports(): void {
    this.aeroportService.getAllAeroports().subscribe({
      next: (data) => {
        this.aeroports = data;
      },
      error: (err) => {
        this.errorMessage = err.message;
        console.error('Erreur lors du chargement des aéroports.');
      }
    });
  }

  saveVol(): void {
    this.errorMessage = '';

    const dateDepartStr = this.editing ? this.newVolUpdate.heureDepart : this.newVolCreate.heureDepart;
    const dateArriveeStr = this.editing ? this.newVolUpdate.heureArrivee : this.newVolCreate.heureArrivee;

    const heureDepart = new Date(dateDepartStr!);
    const heureArrivee = new Date(dateArriveeStr!);
    const maintenant = new Date();


    // Vérifier si les dates sont valides
    if (isNaN(heureDepart.getTime())) {
      this.errorMessage = "Format de date de départ invalide";
      return;
    }
    if (isNaN(heureArrivee.getTime())) {
      this.errorMessage = "Format de date d'arrivée invalide";
      return;
    }

    // Pour les vols en édition avec statut avancé, on ne valide pas le départ dans le futur
    const volDejaCommence = this.editing &&
      this.currentEditingVol &&
      this.currentEditingVol.statut !== StatutVol.PROGRAMME &&
      this.currentEditingVol.statut !== StatutVol.RETARDE;

    // CORRECTION : On ajoute une marge de 1 minute pour éviter les problèmes de secondes
    const maintenant1MinutePlus = new Date(maintenant.getTime() + 60000); // +1 minute

    if (!volDejaCommence && heureDepart < maintenant1MinutePlus) {
      const dateFormatee = maintenant.toLocaleString('fr-FR', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
      });
      this.errorMessage = `L'heure de départ doit être postérieure à maintenant (${dateFormatee})`;
      return;
    }

    if (heureArrivee <= heureDepart) {
      this.errorMessage = "L'heure d'arrivée doit être postérieure à l'heure de départ";
      return;
    }

    if (this.editing) {


      const updatePayload: ModifierVolRequest = {
        heureDepart: this.newVolUpdate.heureDepart,
        heureArrivee: this.newVolUpdate.heureArrivee
      };

      this.volService.modifierVol(this.editingNumeroVol, updatePayload).subscribe({
        next: () => {
          this.loadVols();
          this.cancel();
          this.errorMessage = '';
        },
        error: err => {
          this.errorMessage = err.message;
        }
      });
    }else {
      this.volService.creerVol(this.newVolCreate).subscribe({
        next: () => {
          this.loadVols();
          this.cancel();
        },
        error: err => this.errorMessage = err.message
      });
    }
  }

  getAeroportsDepart(): AeroportResponse[] {
    if (!this.newVolCreate.origine) {
      return [];
    }
    return this.aeroports.filter(a => a.ville === this.newVolCreate.origine);
  }

  getAeroportsArrivee(): AeroportResponse[] {
    if (!this.newVolCreate.destination) {
      return [];
    }
    return this.aeroports.filter(a => a.ville === this.newVolCreate.destination);
  }

  getMinDateTime(): string {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  }
  getCurrentDateTime(): string {
    const now = new Date();
    return now.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  isHeureDepartDisabled(vol: VolResponse | null | undefined): boolean {
    if (!vol) return false;
    const statutsGrises = [StatutVol.EN_VOL, StatutVol.EN_APPROCHE, StatutVol.DETOURNE];
    return statutsGrises.includes(vol.statut);
  }

  canEditVol(vol: VolResponse): boolean {
    const statutsInterdits = [
      StatutVol.DECOLLE,
      StatutVol.EN_VOL,
      StatutVol.EN_APPROCHE,
      StatutVol.PRET_DECOLLAGE,
      StatutVol.ARRIVE,
      StatutVol.ATTERRI,
      StatutVol.ANNULE
    ];
    return !statutsInterdits.includes(vol.statut);
  }
  currentEditingVol: VolResponse | null = null;

  editVol(vol: VolResponse): void {
    this.newVolUpdate = {
      heureDepart: vol.heureDepart,
      heureArrivee: vol.heureArrivee
    };
    this.editingNumeroVol = vol.numeroVol;
    this.currentEditingVol = vol;
    this.editing = true;
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  deleteVol(numeroVol: string): void {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le vol ${numeroVol} ?`)) return;

    this.volService.supprimerVol(numeroVol).subscribe({
      next: () => {
        this.loadVols();
        this.errorMessage = '';
      },
      error: err => this.errorMessage = err.message || `Erreur lors de la suppression du vol ${numeroVol}.`
    });
  }
  cancel(): void {
    this.newVolCreate = this.emptyVolCreate();
    this.newVolUpdate = this.emptyVolUpdate();
    this.editing = false;
    this.editingNumeroVol = '';
    this.currentEditingVol = null;
    this.errorMessage = '';
  }

  private emptyVolCreate(): VolCreateRequest {
    const now = new Date().toISOString().slice(0, 16);
    return {
      numeroVol: '',
      type: TypeVol.INTERNATIONAL,
      origine: '',
      destination: '',
      heureDepart: now,
      heureArrivee: now,
      segments: null,
      aeroportDepartCodeIATA: null,
      aeroportArriveeCodeIATA: null
    };
  }

  private emptyVolUpdate(): ModifierVolRequest {
    const now = new Date().toISOString().slice(0, 16);
    return {
      heureDepart: now,
      heureArrivee: now
    };
  }


  // --- Gestion du Statut ---

  openChangeStatut(vol: VolResponse): void {
    this.selectedVolForStatut = vol;
    this.nouveauStatut = vol.statut;

    this.passagerService.getEnregistrementsParVol(vol.numeroVol).subscribe({
      next: (enregistrements) => {
        console.log('Tous les enregistrements:', enregistrements);

        // Nombre de passagers ENREGISTRES (statut ENREGISTRE)
        const nbEnregistres = enregistrements.filter(
          e => e.statut === StatutEnregistrement.ENREGISTRE
        ).length;

        // Nombre de passagers EMBARQUES (statut EMBARQUE)
        const nbEmbarques = enregistrements.filter(
          e => e.statut === StatutEnregistrement.EMBARQUE
        ).length;

        // On injecte manuellement les deux données dans l'objet sélectionné
        if (this.selectedVolForStatut) {
          this.selectedVolForStatut.passagersEnregistres = nbEnregistres;
          this.selectedVolForStatut.passagersEmbarques = nbEmbarques;
        }

        console.log(`Synchronisation: ${nbEnregistres} enregistré(s), ${nbEmbarques} embarqué(s)`);
      },
      error: (err) => {
        console.error("Impossible de synchroniser les passagers", err);
      }
    });
  }

  changeStatut(): void {
    if (!this.selectedVolForStatut) return;

    const numeroVol = this.selectedVolForStatut.numeroVol;
    let operation$: Observable<VolResponse>;

    switch (this.nouveauStatut) {
      case StatutVol.ENREGISTREMENT:
        operation$ = this.volService.demarrerEnregistrement(numeroVol);
        break;
      case StatutVol.EMBARQUEMENT:
        operation$ = this.volService.demarrerEmbarquement(numeroVol);
        break;
      case StatutVol.PRET_DECOLLAGE:
        operation$ = this.volService.autoriserDecollage(numeroVol);
        break;
      case StatutVol.DECOLLE:
        operation$ = this.volService.confirmerDecollage(numeroVol);
        break;
      case StatutVol.EN_VOL:
        operation$ = this.volService.changerStatut(numeroVol, this.nouveauStatut);
        break;
      case StatutVol.EN_APPROCHE:
        operation$ = this.volService.changerStatut(numeroVol, this.nouveauStatut);
        break;
      case StatutVol.ATTERRI:
        operation$ = this.volService.changerStatut(numeroVol, this.nouveauStatut);
        break;
      case StatutVol.ARRIVE:
        operation$ = this.volService.terminerVol(numeroVol);
        break;
      case StatutVol.RETARDE:
        operation$ = this.volService.retarderVol(numeroVol);
        break;
      case StatutVol.ANNULE:
        operation$ = this.volService.annulerVol(numeroVol);
        break;
      case StatutVol.DETOURNE:
        operation$ = this.volService.detournerVol(numeroVol);
        break;
      default:
        operation$ = this.volService.changerStatut(numeroVol, this.nouveauStatut);
    }

    operation$.subscribe({
      next: () => {
        this.loadVols();
        this.selectedVolForStatut = null;
        this.errorMessage = '';
      },
      error: err => {
        this.errorMessage = err.message || "Erreur lors du changement de statut.";
        this.selectedVolForStatut = null;
      }
    });
  }

  canTransitionTo(vol: VolResponse, nouveauStatut: StatutVol): boolean {
    return vol.transitionsPossibles.includes(nouveauStatut);
  }

  // --- Gestion des Avions ---

  loadAvionsDisponibles(): void {
    this.avionService.getDisponibles().subscribe({
      next: avions => {
        console.log('Avions disponibles = ', avions);
        this.avionsDisponibles = avions;
        this.errorMessage = '';
      },
      error: err => this.errorMessage = err.message || 'Erreur lors du chargement des avions disponibles.'
    });
  }

  openAssignerAvion(numeroVol: string): void {
    this.selectedVolForAssignAvion = numeroVol;
    this.loadAvionsDisponibles();
  }

  assignerAvionSelectionne(immatriculationAvion: string): void {
    if (!this.selectedVolForAssignAvion) return;

    this.volService.assignerAvion(this.selectedVolForAssignAvion, immatriculationAvion).subscribe({
      next: () => {
        this.loadVols();
        this.selectedVolForAssignAvion = null;
        this.avionsDisponibles = [];
        this.errorMessage = '';
      },
      error: err => this.errorMessage = err.message || "Erreur lors de l'assignation de l'avion."
    });
  }

  // --- Gestion des Pistes ---

  loadPistesDisponibles(codeIATAAeroport?: string): void {
    this.pisteService.getPistesDisponibles().subscribe({
      next: pistes => {
        if (codeIATAAeroport) {
          this.pistesDisponibles = pistes.filter(p => p.aeroportCodeIATA === codeIATAAeroport);
        } else {
          this.pistesDisponibles = pistes;
        }
        this.errorMessage = '';
      },
      error: err => this.errorMessage = err.message || 'Erreur lors du chargement des pistes disponibles.'
    });
  }

  openAssignerPiste(numeroVol: string, type: 'depart' | 'arrivee'): void {
    this.selectedVolForAssignPiste = numeroVol;
    this.typePiste = type;

    const vol = this.vols.find(v => v.numeroVol === numeroVol);
    if (vol) {
      const codeIATA = type === 'depart' ? vol.aeroportDepartCodeIATA : vol.aeroportArriveeCodeIATA;
      this.loadPistesDisponibles(codeIATA || undefined);
    } else {
      this.loadPistesDisponibles();
    }
  }

  assignerPisteSelectionnee(identifiantPiste: string): void {
    if (!this.selectedVolForAssignPiste) return;

    const obs = this.typePiste === 'depart'
      ? this.volService.assignerPisteDepart(this.selectedVolForAssignPiste, identifiantPiste)
      : this.volService.assignerPisteArrivee(this.selectedVolForAssignPiste, identifiantPiste);

    obs.subscribe({
      next: () => {
        this.loadVols();
        this.selectedVolForAssignPiste = null;
        this.pistesDisponibles = [];
        this.errorMessage = '';
      },
      error: err => this.errorMessage = err.message || "Erreur lors de l'assignation de la piste."
    });
  }

  libererPiste(numeroVol: string, type: 'depart' | 'arrivee'): void {
    const obs = type === 'depart'
      ? this.volService.libererPisteDepart(numeroVol)
      : this.volService.libererPisteArrivee(numeroVol);

    obs.subscribe({
      next: () => {
        this.loadVols();
        this.errorMessage = '';
      },
      error: err => this.errorMessage = err.message || "Erreur lors de la libération de la piste."
    });
  }

  // --- Préparation de vol (Avion + Piste départ) ---
  openPreparerVol(numeroVol: string): void {
    this.selectedVolForPreparation = numeroVol;
    this.loadAvionsDisponibles();

    const vol = this.vols.find(v => v.numeroVol === numeroVol);
    if (vol && vol.aeroportDepartCodeIATA) {
      this.loadPistesDisponibles(vol.aeroportDepartCodeIATA);
    } else {
      this.loadPistesDisponibles();
    }
  }

  preparerVolComplet(): void {
    if (!this.selectedVolForPreparation || !this.selectedAvionForPreparation || !this.selectedPisteForPreparation) {
      this.errorMessage = 'Veuillez sélectionner un avion et une piste';
      return;
    }

    this.volService.preparerVol(
      this.selectedVolForPreparation,
      this.selectedAvionForPreparation,
      this.selectedPisteForPreparation
    ).subscribe({
      next: () => {
        this.loadVols();
        this.selectedVolForPreparation = null;
        this.selectedAvionForPreparation = '';
        this.selectedPisteForPreparation = '';
        this.errorMessage = '';
      },
      error: err => this.errorMessage = err.message || "Erreur lors de la préparation du vol."
    });
  }

  // --- Préparation d'atterrissage (Piste arrivée) ---

  openPreparerAtterrissage(numeroVol: string): void {
    this.selectedVolForPreparationAtterrissage = numeroVol;

    const vol = this.vols.find(v => v.numeroVol === numeroVol);
    if (vol && vol.aeroportArriveeCodeIATA) {
      this.loadPistesDisponibles(vol.aeroportArriveeCodeIATA);
    } else {
      this.loadPistesDisponibles();
    }
  }

  preparerAtterrissageComplet(): void {
    if (!this.selectedVolForPreparationAtterrissage || !this.selectedPisteForAtterrissage) {
      this.errorMessage = 'Veuillez sélectionner une piste';
      return;
    }

    this.volService.preparerAtterrissage(
      this.selectedVolForPreparationAtterrissage,
      this.selectedPisteForAtterrissage
    ).subscribe({
      next: () => {
        this.loadVols();
        this.selectedVolForPreparationAtterrissage = null;
        this.selectedPisteForAtterrissage = '';
        this.errorMessage = '';
      },
      error: err => this.errorMessage = err.message || "Erreur lors de la préparation de l'atterrissage."
    });
  }

  // --- Historique ---

  consulterHistorique(vol: VolResponse): void {
    if (this.volHistoriqueSelectionne === vol.numeroVol) {
      this.historiqueAffiche = null;
      this.volHistoriqueSelectionne = null;
      return;
    }

    this.volService.consulterHistorique(vol.numeroVol).subscribe({
      next: data => {
        this.historiqueAffiche = data;
        this.volHistoriqueSelectionne = vol.numeroVol;
        this.errorMessage = '';
      },
      error: err => this.errorMessage = err.message || `Erreur lors de la consultation de l'historique du vol ${vol.numeroVol}.`
    });
  }

  formatDuree(dureeMinutes: number): string {
    const heures = Math.floor(dureeMinutes / 60);
    const minutes = dureeMinutes % 60;
    return `${heures}h ${minutes}m`;
  }

  isPretPourEnregistrement(vol: VolResponse | null): boolean {
    if (!vol) return false;
    return !!vol.avionImmatriculation && !!vol.pisteDepartIdentifiant;
  }
  isPretPourApproche(vol: VolResponse | null): boolean {
    if (!vol) return false;
    return !!vol.pisteArriveeIdentifiant;
  }
  isPretPourDecollage(vol: VolResponse | null): boolean {
    if (!vol) return false;

    const embarques = vol.passagersEmbarques;
    return embarques !== undefined && embarques > 0;
  }
  isPretPourEmbarquement(vol: VolResponse | null): boolean {
    if (!vol) return false;

    const enregistres = vol.passagersEnregistres;
    return enregistres !== undefined && enregistres > 0;
  }

// API EXTERNE

  volsExternes: VolResponse[] = [];
  showExternesModal: boolean = false;
  isLoadingExternes: boolean = false;

  loadVolsExternes(): void {
    this.isLoadingExternes = true;
    this.volService.listerVolsExternes().subscribe({
      next: data => {
        this.volsExternes = data;
        this.showExternesModal = true;
        this.isLoadingExternes = false;
      },
      error: err => {
        this.errorMessage = "Erreur lors de la récupération des vols partenaires.";
        this.isLoadingExternes = false;
      }
    });
  }
}

