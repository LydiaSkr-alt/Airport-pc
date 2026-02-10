import { Component, OnInit } from '@angular/core';
import { Avion, EtatMaintenance } from '../../interface/avion-interface';
import { AvionService } from '../../service/avion-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './avion.component.html',
  styleUrls: ['./avion.component.css']
})
export class AvionComponent implements OnInit {
  avions: Avion[] = [];
  newAvion: Avion = this.emptyAvion();
  editing: boolean = false;
  etatOptions = Object.values(EtatMaintenance);
  errorMessage: string = '';

  constructor(private avionService: AvionService) {}

  ngOnInit(): void {
    this.loadAvions();
  }

  loadAvions(): void {
    this.avionService.getAll().subscribe({
      next: data => {
        this.avions = data;
        this.errorMessage = '';
      },
      error: err => this.errorMessage = err.message
    });
  }

  saveAvion(): void {
    const obs = this.editing
      ? this.avionService.update(this.newAvion.immatriculation, this.newAvion)
      : this.avionService.create(this.newAvion);

    obs.subscribe({
      next: () => {
        this.loadAvions();
        this.cancel();
      },
      error: err => this.errorMessage = err.message
    });
  }

  editAvion(avion: Avion): void {
    this.newAvion = { ...avion };
    this.editing = true;
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  deleteAvion(immatriculation: string): void {
    this.avionService.delete(immatriculation).subscribe({
      next: () => this.loadAvions(),
      error: err => this.errorMessage = err.message
    });
  }

  cancel(): void {
    this.newAvion = this.emptyAvion();
    this.editing = false;
  }

  private emptyAvion(): Avion {
    return {
      immatriculation: '',
      capacitePassager: undefined as any,
      largeur: undefined as any,
      longueur: undefined as any,
      hauteur: undefined as any,
      volumeBagage: undefined as any,
      capaciteCarburant: undefined as any,
      autonomie: undefined as any,
      vitesseCroisiere: undefined as any,
      inHangar : undefined as any,
      etatMaintenance: EtatMaintenance.EN_SERVICE
    };
  }
}
