import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PassagerService } from '../../service/passager-service';
import {
  PassagerResponse,
  PassagerCreateRequest,
  CheckInRequest,
  ClasseVoyage, EnregistrementResponse, PassagerUpdateRequest, ModifierEnregistrementRequest, StatutEnregistrement,
} from '../../interface/passager-interface';
import {COUNTRIES} from './countries.data';
import {VolService} from '../../service/vol-service';
import {StatutVol, VolResponse} from '../../interface/vol-interface';

@Component({
  selector: 'app-passager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './passager.component.html',
  styleUrls: ['./passager.component.css']
})
export class PassagerComponent implements OnInit {

  activeView: 'passagers' | 'checkin' | 'enregistrement' = 'passagers';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  passagers: PassagerResponse[] = [];
  enregistrementActuel: EnregistrementResponse | null = null;
  volsDisponibles: VolResponse[] = [];
  enregistrementsRecents: EnregistrementResponse[] = [];
  enregistrementDetailModal: EnregistrementResponse | null = null;
  StatutEnregistrement = StatutEnregistrement
  enregistrementsDuVolSelectionne: EnregistrementResponse[] = [];
  newPassager: PassagerCreateRequest = this.emptyPassager();
  editPassager: PassagerUpdateRequest & { numeroPasseport?: string } = this.emptyUpdatePassager();
  checkInForm: CheckInRequest = this.emptyCheckIn();
  modifierEnregistrementForm: ModifierEnregistrementRequest = this.emptyModifierEnregistrement();

  isEditMode: boolean = false;
  passagerEnCoursEdition: string = '';

  showVolModal: boolean = false;

  consultationEnregistrement: { numeroPasseport: string, numeroVol: string } = { numeroPasseport: '', numeroVol: '' };

  countries = COUNTRIES;
  phonePrefix: string = '+33';
  phoneNumber: string = '';
  editPhonePrefix: string = '+33';
  editPhoneNumber: string = '';

  classesVoyage = Object.values(ClasseVoyage);



  constructor(
    private passagerService: PassagerService,
    private volService: VolService
  ) {}

  ngOnInit(): void {
    this.loadPassagers();
    this.loadVolsDisponibles();
    this.loadEnregistrementsRecents();
  }

  // --- VUE 1: PASSAGERS ---

  loadPassagers(): void {
    this.isLoading = true;
    this.passagerService.getAllPassagers().subscribe({
      next: (data) => {
        this.passagers = data;
        this.isLoading = false;
        this.errorMessage = '';
      },
      error: (err) => {
        this.passagers = [];
        this.errorMessage = err.message;
        this.isLoading = false;
      }
    });
  }
  loadVolsDisponibles(): void {
    this.volService.listerVols().subscribe({
      next: (data) => {
        this.volsDisponibles = data;
        this.errorMessage = '';
      },
      error: (err) => {
        console.error('Erreur lors du chargement des vols:', err);
        this.volsDisponibles = [];
        this.errorMessage = err.message || 'Erreur lors du chargement des vols disponibles.';
      }
    });
  }
  validatePhoneInput(event: any) {
    const input = event.target.value;
    this.phoneNumber = input.replace(/\D/g, '');
  }
  validateEditPhoneInput(event: any) {
    const input = event.target.value;
    this.editPhoneNumber = input.replace(/\D/g, '');
  }

  validatePassportInput(event: any) {
    const input = event.target.value;
    this.newPassager.numeroPasseport = input.replace(/\D/g, '').slice(0, 9);
  }

  createPassager(): void {
    if (!/^\d{9}$/.test(this.newPassager.numeroPasseport)) {
      this.errorMessage = 'Le numéro de passeport doit contenir exactement 9 chiffres.';
      return;
    }

    if (this.phoneNumber.length !== 9) {
      this.errorMessage = ' Le numéro de téléphone doit contenir exactement 9 chiffres.';
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(this.newPassager.email)) {
      this.errorMessage = ' L\'adresse email n\'est pas valide (ex: nom@domaine.com).';
      return;
    }

    if (!this.newPassager.numeroPasseport || !this.newPassager.nom || !this.newPassager.prenom) {
      this.errorMessage = ' Tous les champs marqués d\'une étoile sont obligatoires.';
      return;
    }

    const exists = this.passagers.some(p =>
      p.numeroPasseport=== this.newPassager.numeroPasseport
    );
    if (exists) {
      this.errorMessage = ` Le passeport ${this.newPassager.numeroPasseport} est déjà enregistré dans la liste.`;
      return;
    }

    this.isLoading = true;

    const passagerToSend = {
      ...this.newPassager,
      numeroPasseport: this.newPassager.numeroPasseport.toUpperCase(),
      telephone: this.phonePrefix + this.phoneNumber
    };

    this.passagerService.createPassager(passagerToSend).subscribe({
      next: () => {
        this.showSuccess(`Passager ${passagerToSend.prenom}  ${passagerToSend.nom} créé avec succès`);
        this.newPassager = this.emptyPassager();
        this.phoneNumber = '';
        this.loadPassagers();
        this.isLoading = false;
      },
      error: err => {
        this.errorMessage = err.error?.message || "Une erreur est survenue lors de la création";
        this.isLoading = false;
      }
    });
  }

  startEditPassager(passager: PassagerResponse): void {
    this.isEditMode = true;
    this.passagerEnCoursEdition = passager.numeroPasseport;

    const tel = passager.telephone || '';

    const matchedCountry = this.countries.find(c => tel.startsWith(c.code));

    if (matchedCountry) {
      this.editPhonePrefix = matchedCountry.code;
      this.editPhoneNumber = tel.substring(matchedCountry.code.length);
    } else {
      this.editPhonePrefix = '+33';
      this.editPhoneNumber = tel;
    }

    this.editPassager = {
      numeroPasseport: passager.numeroPasseport,
      nom: passager.nom,
      prenom: passager.prenom,
      email: passager.email || '',
      telephone: passager.telephone || '',
    };
  }


  cancelEditPassager(): void {
    this.isEditMode = false;
    this.passagerEnCoursEdition = '';
    this.editPassager = this.emptyUpdatePassager();
    this.editPhoneNumber = '';
    this.errorMessage = '';
  }

  updatePassager(): void {
    if (!this.editPassager.numeroPasseport) return;
    if (this.editPassager.numeroPasseport && !/^\d{9}$/.test(this.editPassager.numeroPasseport)) {
      this.errorMessage = 'Numéro de passeport invalide.';
      return;
    }
    if (this.editPhoneNumber && this.editPhoneNumber.length !== 9) {
      this.errorMessage = 'Le numéro de téléphone doit contenir exactement 9 chiffres.';
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (this.editPassager.email && !emailPattern.test(this.editPassager.email)) {
      this.errorMessage = 'L\'adresse email n\'est pas valide.';
      return;
    }

    this.isLoading = true;

    const updateRequest: PassagerUpdateRequest = {
      nom: this.editPassager.nom,
      prenom: this.editPassager.prenom,
      email: this.editPassager.email,
      telephone: this.editPhoneNumber ? this.editPhonePrefix + this.editPhoneNumber : undefined
    };

    this.passagerService.updatePassager(this.editPassager.numeroPasseport, updateRequest).subscribe({
      next: (response) => {
        this.showSuccess(`Passager ${response.prenom} ${response.nom} modifié avec succès`);
        this.cancelEditPassager();
        this.loadPassagers();
        this.isLoading = false;
      },
      error: err => {
        this.errorMessage = err.error?.message || "Une erreur est survenue lors de la modification";
        this.isLoading = false;
      }
    });
  }

  deletePassager(passeport: string): void {
    if (!confirm(`Supprimer le passager ${passeport} ?`)) return;

    this.passagerService.deletePassager(passeport).subscribe({
      next: () => {
        this.showSuccess('Passager supprimé');
        this.loadPassagers();
      },
      error: err => this.errorMessage = err.message
    });
  }

  // --- VUE 2: CHECK-IN ---
  //PLAN  SIÉGE
  showSeatModal: boolean = false;
  rangees = Array.from({ length: 20 }, (_, i) => i + 1);
  colonnes = ['A', 'B', 'C', 'D', 'E', 'F'];

  siegesOccupes: string[] = ['1A', '5C', '10D', '12F', '2B', '20F'];

  openSeatModal() {
    this.showSeatModal = true;
  }

  selectSeat(rangee: number, col: string) {
    const seatId = `${rangee}${col}`;
    if (this.siegesOccupes.includes(seatId)) return;

    this.checkInForm.numeroSiege = seatId;
    this.showSeatModal = false;
  }

  isSeatSelected(rangee: number, col: string): boolean {
    return this.checkInForm.numeroSiege === `${rangee}${col}`;
  }

  //GESTION BAGAGES
  fraisBagages: number = 0;
  readonly PRIX_UNITAIRE_BAGAGE = 30; // 30€ par bagage supplémentaire

  updateBagages(change: number) {
    let current = this.checkInForm.nombreBagages || 0;
    let nouveau = current + change;

    if (nouveau >= 0 && nouveau <= 3) {
      this.checkInForm.nombreBagages = nouveau;
      this.calculerPrix();
    }
  }

  calculerPrix() {
    const nb = this.checkInForm.nombreBagages || 0;
    // - En ÉCONOMIQUE : tous les bagages en soute sont payants.
    // - En AFFAIRES/PREMIERE : le 1er est gratuit (inclus).
    if (this.checkInForm.classeVoyage === ClasseVoyage.ECONOMIQUE) {
      this.fraisBagages = nb * this.PRIX_UNITAIRE_BAGAGE;
    } else {
      this.fraisBagages = Math.max(0, (nb - 1) * this.PRIX_UNITAIRE_BAGAGE);
    }
  }
  // --- GESTION LISTE ENREGISTREMENTS ---

  loadEnregistrementsRecents(): void {
    this.enregistrementsRecents = [];
  }

  voirDetailsEnregistrement(enreg: EnregistrementResponse): void {
    this.enregistrementDetailModal = enreg;
  }

  embarquerDepuisListe(enreg: EnregistrementResponse): void {
    if (!confirm(`Confirmer l'embarquement de ${enreg.passager.nomComplet} ?`)) {
      return;
    }

    this.isLoading = true;
    this.passagerService.embarquerPassager({
      numeroPasseport: enreg.passager.numeroPasseport,
      numeroVol: enreg.numeroVol
    }).subscribe({
      next: (updated) => {
        this.showSuccess(`Passager ${updated.passager.nomComplet} embarqué avec succès`);
        this.loadEnregistrementsDuVol(enreg.numeroVol);
        const index = this.enregistrementsRecents.findIndex(e => e.id === enreg.id);
        if (index !== -1) {
          this.enregistrementsRecents[index] = updated;
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isLoading = false;
      }
    });
  }

  annulerDepuisListe(enreg: EnregistrementResponse): void {
    if (!confirm(`Annuler l'enregistrement de ${enreg.passager.nomComplet} ?`)) {
      return;
    }

    this.isLoading = true;
    this.passagerService.annulerEnregistrement(
      enreg.passager.numeroPasseport,
      enreg.numeroVol
    ).subscribe({
      next: () => {
        this.showSuccess('Enregistrement annulé avec succès');
        this.loadEnregistrementsDuVol(enreg.numeroVol);
        this.enregistrementsRecents = this.enregistrementsRecents.filter(e => e.id !== enreg.id);
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isLoading = false;
      }
    });
  }

  openVolModal(): void {

    this.siegesOccupes = this.enregistrementsRecents
      .filter(enreg => enreg.numeroVol === this.checkInForm.numeroVol && enreg.statut !== StatutEnregistrement.ANNULE)
      .map(enreg => enreg.numeroSiege);
    this.showVolModal = true;
  }

  closeVolModal(): void {
    this.showVolModal = false;
  }

  selectVol(numeroVol: string): void {
    const vol = this.volsDisponibles.find(v => v.numeroVol === numeroVol);
    if (!vol) return;

    if (vol.statut !== StatutVol.ENREGISTREMENT) {
      this.errorMessage = 'Le check-in n’est possible que pour les vols en état d\'enregistrement';
      return;
    }

    this.checkInForm.numeroVol = numeroVol;
    this.closeVolModal();
  }

  doCheckIn(): void {
    this.errorMessage = '';

    if (!this.checkInForm.numeroPasseport || !this.checkInForm.numeroVol ||
      !this.checkInForm.numeroSiege) {
      this.errorMessage = 'Tous les champs sont obligatoires';
      return;
    }
    const volSelectionne = this.volsDisponibles.find(v => v.numeroVol === this.checkInForm.numeroVol);

    if (!volSelectionne || volSelectionne.statut !== StatutVol.ENREGISTREMENT) {
      this.errorMessage = `Le check-in est impossible : le vol ${this.checkInForm.numeroVol} est actuellement en état "${this.getStatutVolLabel(volSelectionne?.statut ?? StatutVol.ANNULE)}"`;
      return;
    }

    this.checkInForm.numeroPasseport = this.checkInForm.numeroPasseport;
    this.checkInForm.numeroSiege = this.checkInForm.numeroSiege.toUpperCase();

    if (this.isUpdateMode) {
      // ================= Cas MODIFICATION (PATCH) =================
      const req: ModifierEnregistrementRequest = {
        nouveauSiege: this.checkInForm.numeroSiege,
        classeVoyage: this.checkInForm.classeVoyage,
        nombreBagages: this.checkInForm.nombreBagages
      };
      this.passagerService.modifierEnregistrement(this.checkInForm.numeroPasseport, this.checkInForm.numeroVol, req).subscribe({
        next: () => {
          this.showSuccess("Enregistrement mis à jour !");
          this.loadEnregistrementsDuVol(this.checkInForm.numeroVol);
          this.changeView('enregistrement');
          this.isUpdateMode = false;
        },
        error: err => this.errorMessage = err.message
      });
    } else {

      this.passagerService.checkIn(this.checkInForm).subscribe({
        next: (res) => {
          this.showSuccess(`Enregistrement OK : ${res.passager.nomComplet} place ${res.numeroSiege}`);
          this.checkInForm = this.emptyCheckIn();
          this.enregistrementsRecents.unshift(res);
          this.siegesOccupes = this.enregistrementsRecents
            .filter(enreg => enreg.numeroVol === res.numeroVol && enreg.statut !== StatutEnregistrement.ANNULE)
            .map(enreg => enreg.numeroSiege);
          this.calculerPrix();
        },
        error: err => this.errorMessage = err.message
      });
    }}

  prefillCheckIn(passeport: string): void {
    this.checkInForm.numeroPasseport = passeport;
    this.changeView('checkin');
  }

  // --- VUE 3: GESTION ENREGISTREMENT ---

  consulterEnregistrement(): void {
    if (!this.consultationEnregistrement.numeroVol) {
      this.errorMessage = 'Veuillez sélectionner un numéro de vol pour afficher le manifeste.';
      return;
    }
    this.loadEnregistrementsDuVol(this.consultationEnregistrement.numeroVol);
  }


  modifierEnregistrement(): void {
    if (!this.enregistrementActuel) {
      this.errorMessage = 'Aucun enregistrement chargé';
      return;
    }

    this.isLoading = true;
    const passeport = this.consultationEnregistrement.numeroPasseport.toUpperCase();
    const vol = this.consultationEnregistrement.numeroVol.toUpperCase();

    const request: ModifierEnregistrementRequest = {
      nouveauSiege: this.modifierEnregistrementForm.nouveauSiege?.toUpperCase(),
      classeVoyage: this.modifierEnregistrementForm.classeVoyage,
      nombreBagages: this.modifierEnregistrementForm.nombreBagages
    };

    this.passagerService.modifierEnregistrement(passeport, vol, request).subscribe({
      next: (enregistrement) => {
        this.enregistrementActuel = enregistrement;
        this.showSuccess('Enregistrement modifié avec succès');
        this.isLoading = false;
      },
      error: err => {
        this.errorMessage = err.message;
        this.isLoading = false;
      }
    });
  }
  loadEnregistrementsDuVol(numeroVol: string): void {
    this.isLoading = true;
    this.passagerService.getEnregistrementsParVol(numeroVol.toUpperCase()).subscribe({
      next: (data) => {

        this.enregistrementsDuVolSelectionne = data;
        this.isLoading = false;
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = "Impossible de charger les passagers du vol " + numeroVol;
        this.enregistrementsDuVolSelectionne = [];
        this.isLoading = false;
      }
    });
  }
  quickEmbarquer(enreg: EnregistrementResponse): void {
    this.isLoading = true;
    this.passagerService.embarquerPassager({
      numeroPasseport: enreg.passager.numeroPasseport,
      numeroVol: enreg.numeroVol
    }).subscribe({
      next: () => {
        this.showSuccess(`Passager ${enreg.passager.nomComplet} embarqué !`);
        this.loadEnregistrementsDuVol(enreg.numeroVol); // Rafraîchissement auto
      },
      error: (err) => {
        this.errorMessage = "Impossible d'embarquer le passager : le vol doit être en état d'embarquement";
        this.isLoading = false;
      }
    });
  }



  annulerEnregistrement(): void {
    if (!this.enregistrementActuel) return;

    const passeport = this.enregistrementActuel.passager.numeroPasseport;
    const vol = this.enregistrementActuel.numeroVol;

    if (confirm(`Annuler l'enregistrement de ${this.enregistrementActuel.passager.nomComplet} ?`)) {
      this.isLoading = true;
      this.passagerService.annulerEnregistrement(passeport, vol).subscribe({
        next: () => {
          this.showSuccess('Enregistrement annulé');
          this.enregistrementActuel = null;
          this.loadEnregistrementsDuVol(vol);
        },
        error: err => {
          this.errorMessage = err.message;
          this.isLoading = false;
        }
      });
    }
  }


  embarquerPassager(): void {
    if (!this.enregistrementActuel) {
      this.errorMessage = 'Aucun enregistrement chargé';
      return;
    }

    const passeport = this.consultationEnregistrement.numeroPasseport.toUpperCase();
    const vol = this.consultationEnregistrement.numeroVol.toUpperCase();

    if (!confirm(`Confirmer l'embarquement de ${this.enregistrementActuel.passager.nomComplet} ?`)) {
      return;
    }

    this.isLoading = true;

    this.passagerService.embarquerPassager({
      numeroPasseport: passeport,
      numeroVol: vol
    }).subscribe({
      next: (enregistrement) => {
        this.enregistrementActuel = enregistrement;
        this.showSuccess(`Passager ${enregistrement.passager.nomComplet} embarqué avec succès`);
        this.isLoading = false;
      },
      error: err => {
        this.errorMessage = 'Impossible d’embarquer le passager : le vol doit être en état d’EMBARQUEMENT pour effectuer cette opération.';
        this.isLoading = false;
      }
    });
  }

  resetConsultation(): void {
    this.enregistrementActuel = null;
    this.consultationEnregistrement = { numeroPasseport: '', numeroVol: '' };
    this.modifierEnregistrementForm = this.emptyModifierEnregistrement();
    this.errorMessage = '';
  }

  // --- UTILITAIRES ---

  changeView(view: 'passagers' | 'checkin' | 'enregistrement'): void {
    this.activeView = view;
    this.errorMessage = '';
    this.successMessage = '';
    this.isEditMode = false;
    this.passagerEnCoursEdition = '';

    if (view === 'passagers') {
      this.loadPassagers();
    } else if (view === 'enregistrement') {
      this.resetConsultation();
    }
  }

  getClasseLabel(classe: ClasseVoyage): string {
    const labels: Record<ClasseVoyage, string> = {
      [ClasseVoyage.ECONOMIQUE]: 'Économique',
      [ClasseVoyage.AFFAIRES]: 'Affaires',
      [ClasseVoyage.PREMIERE]: 'Première'
    };
    return labels[classe];
  }

  getStatutLabel(statut: StatutEnregistrement): string {
    const labels: Record<StatutEnregistrement, string> = {
      [StatutEnregistrement.ENREGISTRE]: 'Enregistré',
      [StatutEnregistrement.EMBARQUE]: 'Embarqué',
      [StatutEnregistrement.ANNULE]: 'Annulé',
      [StatutEnregistrement.DEBARQUE]: 'Débarqué'
    };
    return labels[statut];
  }

  getStatutBadgeClass(statut: StatutEnregistrement): string {
    const classes: Record<StatutEnregistrement, string> = {
      [StatutEnregistrement.ENREGISTRE]: 'badge-info',
      [StatutEnregistrement.EMBARQUE]: 'badge-success',
      [StatutEnregistrement.ANNULE]: 'badge-danger',
      [StatutEnregistrement.DEBARQUE]: 'badge-warning'
    };
    return classes[statut] || 'badge-secondary';
  }

  formatDateTime(dateTime: string | null): string {
    if (!dateTime) return '-';
    const date = new Date(dateTime);
    return date.toLocaleString('fr-FR');
  }
  formatTime(dateTime: string): string {
    const date = new Date(dateTime);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }
  getStatutVolLabel(statut: StatutVol): string {
    const labels: Record<StatutVol, string> = {
      [StatutVol.PROGRAMME]: 'Programmé',
      [StatutVol.ENREGISTREMENT]: 'Enregistrement',
      [StatutVol.EMBARQUEMENT]: 'Embarquement',
      [StatutVol.PRET_DECOLLAGE]: 'Prêt au décollage',
      [StatutVol.DECOLLE]: 'Décollé',
      [StatutVol.EN_VOL]: 'En vol',
      [StatutVol.EN_APPROCHE]: 'En approche',
      [StatutVol.ATTERRI]: 'Atterri',
      [StatutVol.ARRIVE]: 'Arrivé',
      [StatutVol.RETARDE]: 'Retardé',
      [StatutVol.DETOURNE]: 'Détourné',
      [StatutVol.ANNULE]: 'Annulé'
    };
    return labels[statut];
  }

  emptyCheckIn(): CheckInRequest {
    return {
      numeroPasseport: '',
      numeroVol: '',
      numeroSiege: '',
      classeVoyage: ClasseVoyage.ECONOMIQUE,
      nombreBagages: 0
    };
  }

  private showSuccess(msg: string) {
    this.successMessage = msg;
    this.errorMessage = '';
    setTimeout(() => this.successMessage = '', 3000);
  }
  private emptyUpdatePassager(): PassagerUpdateRequest & { numeroPasseport?: string } {
    return {
      numeroPasseport: '',
      nom: '',
      prenom: '',
      email: '',
      telephone: ''
    };
  }

  private emptyModifierEnregistrement(): ModifierEnregistrementRequest {
    return {
      nouveauSiege: undefined,
      classeVoyage: undefined,
      nombreBagages: undefined
    };
  }
  private emptyPassager(): PassagerCreateRequest {
    return {
      numeroPasseport: '',
      nom: '',
      prenom: '',
      email: '',
      telephone: ''
    };
  }

  protected readonly StatutVol = StatutVol;

  isUpdateMode: boolean = false;

  prefillUpdate(enreg: EnregistrementResponse): void {
    this.isUpdateMode = true;
    this.activeView = 'checkin';
    this.checkInForm = {
      numeroPasseport: enreg.passager.numeroPasseport,
      numeroVol: enreg.numeroVol,
      numeroSiege: enreg.numeroSiege,
      classeVoyage: enreg.classeVoyage,
      nombreBagages: enreg.nombreBagages
    };
    this.calculerPrix();
  }

}
