import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AeroportResponse,
  AeroportCreateRequest,
  AeroportUpdateRequest
} from '../../interface/aeroport-interface';
import { AeroportService } from '../../service/aeroport-service';

@Component({
  selector: 'app-aeroport',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './aeroport.component.html',
  styleUrls: ['./aeroport.component.css']
})
export class AeroportComponent implements OnInit {

  aeroports: AeroportResponse[] = [];
  aeroportLocal: AeroportResponse | null = null;
  partenaires: AeroportResponse[] = [];

  newAeroportCreate: AeroportCreateRequest = this.emptyAeroportCreate();
  newAeroportUpdate: AeroportUpdateRequest = this.emptyAeroportUpdate();

  editing: boolean = false;
  editingCodeIATA: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  activeView: 'tous' | 'local' | 'partenaires' = 'tous';

  constructor(private aeroportService: AeroportService) {}

  ngOnInit(): void {
    this.loadAeroports();
    this.loadAeroportLocal();
    this.loadPartenaires();
  }

  // Charger tous les aéroports
  loadAeroports(): void {
    this.aeroportService.getAllAeroports().subscribe({
      next: data => {
        this.aeroports = data;
        this.errorMessage = '';
      },
      error: err => this.errorMessage = err.message || 'Erreur lors du chargement des aéroports.'
    });
  }

  // Charger l'aéroport local
  loadAeroportLocal(): void {
    this.aeroportService.getAeroportLocal().subscribe({
      next: data => {
        this.aeroportLocal = data;
      },
      error: err => {
        // Ne pas afficher d'erreur si aucun aéroport local n'est configuré
        this.aeroportLocal = null;
      }
    });
  }

  // Charger les aéroports partenaires
  loadPartenaires(): void {
    this.aeroportService.getPartenaires().subscribe({
      next: data => {
        this.partenaires = data;
      },
      error: err => {
        this.partenaires = [];
      }
    });
  }

  // Sauvegarder (créer ou modifier) un aéroport
  saveAeroport(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.editing) {
      // Modification
      this.aeroportService.updateAeroport(this.editingCodeIATA, this.newAeroportUpdate).subscribe({
        next: () => {
          this.successMessage = `Aéroport ${this.editingCodeIATA} modifié avec succès`;
          this.loadAeroports();
          this.loadAeroportLocal();
          this.loadPartenaires();
          this.cancel();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: err => this.errorMessage = err.message || "Erreur lors de la modification de l'aéroport."
      });
    } else {
      // Création
      if (!this.newAeroportCreate.codeIATA || !this.newAeroportCreate.nom) {
        this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
        return;
      }

      this.aeroportService.createAeroport(this.newAeroportCreate).subscribe({
        next: () => {
          this.successMessage = `Aéroport ${this.newAeroportCreate.codeIATA} créé avec succès`;
          this.loadAeroports();
          this.loadAeroportLocal();
          this.loadPartenaires();
          this.cancel();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: err => this.errorMessage = err.message || "Erreur lors de la création de l'aéroport."
      });
    }
  }

  // Éditer un aéroport existant
  editAeroport(aeroport: AeroportResponse): void {
    this.newAeroportUpdate = {
      nom: aeroport.nom,
      ville: aeroport.ville,
      pays: aeroport.pays,
      urlApi: aeroport.urlApi,
      estLocal: aeroport.estLocal
    };
    this.editingCodeIATA = aeroport.codeIATA;
    this.editing = true;
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // Supprimer un aéroport
  deleteAeroport(codeIATA: string): void {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'aéroport ${codeIATA} ?`)) return;

    this.aeroportService.deleteAeroport(codeIATA).subscribe({
      next: () => {
        this.successMessage = `Aéroport ${codeIATA} supprimé avec succès`;
        this.loadAeroports();
        this.loadAeroportLocal();
        this.loadPartenaires();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: err => this.errorMessage = err.message || `Erreur lors de la suppression de l'aéroport ${codeIATA}.`
    });
  }

  // Annuler l'édition
  cancel(): void {
    this.newAeroportCreate = this.emptyAeroportCreate();
    this.newAeroportUpdate = this.emptyAeroportUpdate();
    this.editing = false;
    this.editingCodeIATA = '';
    this.errorMessage = '';
  }

  // Créer un AeroportCreateRequest vide
  private emptyAeroportCreate(): AeroportCreateRequest {
    return {
      codeIATA: '',
      nom: '',
      ville: '',
      pays: '',
      urlApi: null,
      estLocal: false
    };
  }

  // Créer un AeroportUpdateRequest vide
  private emptyAeroportUpdate(): AeroportUpdateRequest {
    return {
      nom: '',
      ville: '',
      pays: '',
      urlApi: null,
      estLocal: false
    };
  }

  // Changer la vue active
  changeView(view: 'tous' | 'local' | 'partenaires'): void {
    this.activeView = view;
  }

  // Obtenir la liste affichée selon la vue
  get aeroportsAffiches(): AeroportResponse[] {
    switch(this.activeView) {
      case 'local':
        return this.aeroportLocal ? [this.aeroportLocal] : [];
      case 'partenaires':
        return this.partenaires;
      case 'tous':
      default:
        return this.aeroports;
    }
  }
}
