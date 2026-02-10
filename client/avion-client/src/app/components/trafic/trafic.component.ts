import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TraficService } from '../../service/trafic-service';
import {
  TraficDashboardResponse,
  VolTraficResponse,
  PlanningPisteResponse
} from '../../interface/trafic-interface';
import { StatutVol } from '../../interface/vol-interface';
import { AeroportService } from '../../service/aeroport-service';
import { AeroportResponse } from '../../interface/aeroport-interface';


@Component({
  selector: 'app-trafic',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trafic.component.html',
  styleUrls: ['./trafic.component.css']
})
export class TraficComponent implements OnInit {

  codeIATA: string = 'CDG'; // Code aéroport par défaut
  dashboard: TraficDashboardResponse | null = null;
  aeroports: AeroportResponse[] = [];


  activeView: 'dashboard' | 'departs' | 'arrivees' | 'pistes' = 'dashboard';
  errorMessage: string = '';
  loading: boolean = false;

  // Filtres
  filtreStatutDepart: StatutVol | null = null;
  filtreStatutArrivee: StatutVol | null = null;
  statutOptions = Object.values(StatutVol);

  // Piste sélectionnée pour les détails
  pisteSelectionnee: PlanningPisteResponse | null = null;

  constructor(private traficService: TraficService , private aeroportService: AeroportService) {}

  ngOnInit(): void {
    this.loadDashboard();
    this.loadAeroports();
  }

  // Changer le code IATA
  changeAeroport(): void {
    if (this.codeIATA && this.codeIATA.length === 3) {
      this.codeIATA = this.codeIATA.toUpperCase();
      this.loadDashboard();
    }
  }

  //Charger les aeroports
  loadAeroports(): void {
    this.aeroportService.getAllAeroports().subscribe({
      next: data => {
        this.aeroports = data;
      },
      error: err => {
        // optionnel: gérer l'erreur
        console.error('Erreur lors du chargement des aéroports', err);
      }
    });
  }

  // Charger le dashboard complet
  loadDashboard(): void {
    this.loading = true;
    this.errorMessage = '';

    this.traficService.getVueConsolidee(this.codeIATA).subscribe({
      next: data => {
        this.dashboard = data;
        this.loading = false;
      },
      error: err => {
        this.errorMessage = err.message || 'Erreur lors du chargement du dashboard';
        this.loading = false;
        this.dashboard = null;
      }
    });
  }

  // Obtenir les vols au départ filtrés
  get volsDepartFiltres(): VolTraficResponse[] {
    if (!this.dashboard) return [];

    if (this.filtreStatutDepart) {
      return this.dashboard.volsDepart.filter(v => v.statut === this.filtreStatutDepart);
    }

    return this.dashboard.volsDepart;
  }

  // Obtenir les vols à l'arrivée filtrés
  get volsArriveeFiltres(): VolTraficResponse[] {
    if (!this.dashboard) return [];

    if (this.filtreStatutArrivee) {
      return this.dashboard.volsArrivee.filter(v => v.statut === this.filtreStatutArrivee);
    }

    return this.dashboard.volsArrivee;
  }

  // Changer la vue active
  changeView(view: 'dashboard' | 'departs' | 'arrivees' | 'pistes'): void {
    this.activeView = view;
    this.errorMessage = '';
    this.pisteSelectionnee = null;
  }

  // Appliquer le filtre sur les départs
  applyFiltreDepart(): void {
    // Le filtre est appliqué automatiquement via le getter
  }

  // Appliquer le filtre sur les arrivées
  applyFiltreArrivee(): void {
    // Le filtre est appliqué automatiquement via le getter
  }

  // Réinitialiser les filtres
  resetFiltres(): void {
    this.filtreStatutDepart = null;
    this.filtreStatutArrivee = null;
  }

  // Rafraîchir les données
  refresh(): void {
    this.loadDashboard();
  }

  // Voir les détails d'une piste
  voirDetailsPiste(piste: PlanningPisteResponse): void {
    this.pisteSelectionnee = this.pisteSelectionnee?.identifiant === piste.identifiant
      ? null
      : piste;
  }

  // Formater la durée en minutes et secondes
  formatDuree(dureeSecondes: number | null): string {
    if (!dureeSecondes) return '-';
    const minutes = Math.floor(dureeSecondes / 60);
    const secondes = dureeSecondes % 60;
    return `${minutes}m ${secondes}s`;
  }
}
