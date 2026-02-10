import { Component, OnInit } from '@angular/core';
import { HangarService } from '../../service/hangar-service';
import { AvionService } from '../../service/avion-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Avion } from '../../interface/avion-interface';
import { Hangar, HangarRequest, EtatHangar } from '../../interface/hangar-interface';
import {AeroportResponse} from '../../interface/aeroport-interface'
import {AeroportService} from '../../service/aeroport-service'

@Component({
  selector: 'app-hangar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hangar.component.html',
  styleUrls: ['./hangar.component.css']
})
export class HangarComponent implements OnInit {
  hangars: Hangar[] = [];
  aeroports: AeroportResponse[] = [];
  newHangar: Partial<HangarRequest> = this.emptyHangar();
  editing: boolean = false;
  errorMessage: string = '';

  avionsDisponibles: Avion[] = [];
  selectedHangarForAssoc: string | null = null;

  // Options pour le formulaire
  etatOptions = Object.values(EtatHangar);

  //Options pour l'édition d'états
  etatOptionsEdition = [EtatHangar.Vide, EtatHangar.EnMaintenance];

  constructor(
    private hangarService: HangarService,
    private avionService: AvionService,
    private aeroportService : AeroportService
  ) {}

  ngOnInit(): void {
    this.loadAllHangars();
    this.loadAeroports();
  }

  // Charger tous les hangars
  loadAllHangars(): void {
    this.hangarService.getAllHangars().subscribe({
      next: hangars => {
        this.hangars = hangars;
        this.errorMessage = '';
      },
      error: err => this.errorMessage = err.message || 'Erreur lors du chargement des hangars.'
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
  // Sauvegarder (créer ou modifier) un hangar
  saveHangar(): void {
    this.errorMessage = '';

    // Validation basique
    if (!this.newHangar.identifiant || !this.newHangar.capacite || !this.newHangar.etat) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }

    const payload: HangarRequest = {
      identifiant: this.newHangar.identifiant,
      capacite: this.newHangar.capacite,
      etat: this.newHangar.etat,
      aeroportCodeIATA : this.newHangar.aeroportCodeIATA
    };
    if (this.newHangar.aeroportCodeIATA) {
      payload.aeroportCodeIATA = this.newHangar.aeroportCodeIATA;
    }

    const obs = this.editing
      ? this.hangarService.updateHangar(this.newHangar.identifiant, payload)
      : this.hangarService.createHangar(payload);

    obs.subscribe({
      next: () => {
        this.loadAllHangars();
        this.cancel();
      },
      error: err => this.errorMessage = err.message || 'Erreur lors de la sauvegarde du hangar.'
    });
  }

  // Éditer un hangar existant
  editHangar(hangar: Hangar): void {
    this.newHangar = {
      identifiant: hangar.identifiant as string,
      capacite: hangar.capacite,
      etat: hangar.etat
    };
    this.editing = true;
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // Supprimer un hangar
  deleteHangar(id: string): void {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le hangar ${id} ?`)) return;

    this.hangarService.deleteHangar(id).subscribe({
      next: () => {
        this.loadAllHangars();
        this.errorMessage = '';
      },
      error: err => this.errorMessage = err.message || `Erreur lors de la suppression du hangar ${id}.`
    });
  }

  // Charger les avions disponibles pour association
  loadAvionsDisponibles(): void {
    this.hangarService.getAvionsDisponiblesPourAssociation().subscribe({
      next: avions => {
        this.avionsDisponibles = avions;
        this.errorMessage = '';
      },
      error: err => this.errorMessage = err.message || 'Erreur lors du chargement des avions disponibles.'
    });
  }

  // Ouvrir le dialogue d'association d'avion
  openAssocierAvion(hangarId: string): void {
    this.selectedHangarForAssoc = hangarId;
    this.loadAvionsDisponibles();
  }

  // Associer un avion sélectionné au hangar
  associerAvionSelectionne(immatriculationAvion: string): void {
    if (!this.selectedHangarForAssoc) return;

    this.hangarService.associerAvion(this.selectedHangarForAssoc, immatriculationAvion).subscribe({
      next: () => {
        this.loadAllHangars();
        this.selectedHangarForAssoc = null;
        this.avionsDisponibles = [];
        this.errorMessage = '';
      },
      error: err => this.errorMessage = err.message || "Erreur lors de l'association de l'avion."
    });
  }

  // Dissocier un avion d'un hangar
  dissocierAvion(hangarId: string, immatriculationAvion: string): void {
    if (!confirm(`Êtes-vous sûr de vouloir dissocier l'avion ${immatriculationAvion} du hangar ${hangarId} ?`)) return;

    this.hangarService.dissocierAvion(hangarId, immatriculationAvion).subscribe({
      next: () => {
        this.loadAllHangars();
        this.errorMessage = '';
      },
      error: err => this.errorMessage = err.message || "Erreur lors de la dissociation de l'avion."
    });
  }

  // Annuler l'édition
  cancel(): void {
    this.newHangar = this.emptyHangar();
    this.editing = false;
    this.errorMessage = '';
  }

  private emptyHangar(): Partial<HangarRequest> {
    return {
      identifiant: '',
      capacite: 0,
      etat: EtatHangar.Disponible ,
      aeroportCodeIATA : null

    };
  }
}

