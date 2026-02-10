import { Component, OnInit } from '@angular/core';
import { PisteService } from '../../service/piste-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  PisteResponse,
  PisteCreateRequest,
  PisteUpdateRequest,
  OrientationPiste,
  EtatPiste
} from '../../interface/piste-interface';
import {AeroportResponse} from '../../interface/aeroport-interface'
import {AeroportService} from '../../service/aeroport-service'

@Component({
  selector: 'app-piste',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './piste.component.html',
  styleUrls: ['./piste.component.css']
})
export class PisteComponent implements OnInit {
  pistes: PisteResponse[] = [];
  aeroports: AeroportResponse[] = [];
  newPisteCreate: PisteCreateRequest = this.emptyPisteCreate();
  newPisteUpdate: PisteUpdateRequest = this.emptyPisteUpdate();
  editing: boolean = false;
  editingIdentifiant: string = '';
  errorMessage: string = '';

  // Options pour les formulaires
  etatOptions = Object.values(EtatPiste);
  orientationOptions = Object.values(OrientationPiste);

  // Pour changer l'état d'une piste
  selectedPisteForEtat: PisteResponse | null = null;
  nouvelEtat: EtatPiste = EtatPiste.LIBRE;

  constructor(private pisteService: PisteService ,private aeroportService : AeroportService) {}

  ngOnInit(): void {
    this.loadPistes();
    this.loadAeroports();
  }

  // Charger toutes les pistes
  loadPistes(): void {
    this.pisteService.getAllPistes().subscribe({
      next: data => {
        this.pistes = data;
        this.errorMessage = '';
      },
      error: err => this.errorMessage = err.message || 'Erreur lors du chargement des pistes.'
    });
  }

// charger les aeroports
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
  // Sauvegarder (créer ou modifier) une piste
  savePiste(): void {
    this.errorMessage = '';
    if (this.editing) {
      // Modification
      this.pisteService.updatePiste(this.editingIdentifiant, this.newPisteUpdate).subscribe({
        next: () => {
          this.loadPistes();
          this.cancel();
        },
        error: (err) => {
          this.errorMessage = err.message;
          console.error('Erreur lors de la modification de la piste.');
        }
      });
    } else {
      // Création
      if (!this.newPisteCreate.identifiant || !this.newPisteCreate.longueur || !this.newPisteCreate.largeur) {
        this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
        return;
      }
      // Assignez le code IATA de l'aéroport sélectionné
      const requestToSend = { ...this.newPisteCreate };
      if (this.newPisteCreate.aeroportCodeIATA) {
        requestToSend.aeroportCodeIATA = this.newPisteCreate.aeroportCodeIATA;
      }
      this.pisteService.createPiste(requestToSend).subscribe({
        next: () => {
          this.loadPistes();
          this.cancel();
        },
        error: (err) => {
          this.errorMessage = err.message;
          console.error('Erreur lors de la création de la piste.');
        }
      });
    }
  }
  // Éditer une piste existante
  editPiste(piste: PisteResponse): void {
    this.newPisteUpdate = {
      longueur: piste.longueur,
      largeur: piste.largeur,
      orientation: piste.orientation,
      capaciteMaximale: piste.capaciteMaximale
    };
    this.editingIdentifiant = piste.identifiant;
    this.editing = true;
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // Ouvrir le modal pour changer l'état
  openChangeEtat(piste: PisteResponse): void {
    this.selectedPisteForEtat = piste;
    this.nouvelEtat = piste.etat;
  }

  // Changer l'état d'une piste
  changeEtat(): void {
    if (!this.selectedPisteForEtat) return;

    this.pisteService.changerEtat(this.selectedPisteForEtat.identifiant, this.nouvelEtat).subscribe({
      next: () => {
        this.loadPistes();
        this.selectedPisteForEtat = null;
        this.errorMessage = '';
      },
      error: err => {
        this.errorMessage = err.message || "Erreur lors du changement d'état de la piste.";
        this.selectedPisteForEtat = null;
      }
    });
  }

  // Supprimer une piste
  deletePiste(identifiant: string): void {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la piste ${identifiant} ?`)) return;

    this.pisteService.deletePiste(identifiant).subscribe({
      next: () => {
        this.loadPistes();
        this.errorMessage = '';
      },
      error: err => this.errorMessage = err.message || `Erreur lors de la suppression de la piste ${identifiant}.`
    });
  }

  // Annuler l'édition
  cancel(): void {
    this.newPisteCreate = this.emptyPisteCreate();
    this.newPisteUpdate = this.emptyPisteUpdate();
    this.editing = false;
    this.editingIdentifiant = '';
    this.errorMessage = '';
  }

  // Créer une PisteCreateRequest vide
  private emptyPisteCreate(): PisteCreateRequest {
    return {
      identifiant: '',
      longueur: 3000,
      largeur: 45,
      orientation: OrientationPiste.NORD,
      capaciteMaximale: 200000,
      aeroportCodeIATA: null
    };
  }

  // Créer une PisteUpdateRequest vide
  private emptyPisteUpdate(): PisteUpdateRequest {
    return {
      longueur: 3000,
      largeur: 45,
      orientation: OrientationPiste.NORD,
      capaciteMaximale: 200000
    };
  }

  // Vérifier si une transition est possible
  canTransitionTo(piste: PisteResponse, nouvelEtat: EtatPiste): boolean {
    return piste.transitionsPossibles.includes(nouvelEtat);
  }
}
