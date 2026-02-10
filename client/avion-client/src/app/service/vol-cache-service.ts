// vol-cache.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { VolResponse } from '../interface/vol-interface';

@Injectable({ providedIn: 'root' })
export class VolCacheService {
  private volsCache$ = new BehaviorSubject<Map<string, VolResponse>>(new Map());

  /**
   * Met à jour le cache avec la liste des vols
   */
  updateVols(vols: VolResponse[]): void {
    const cache = new Map<string, VolResponse>();
    vols.forEach(vol => cache.set(vol.numeroVol, vol));
    this.volsCache$.next(cache);
  }

  /**
   * Récupère un vol depuis le cache
   */
  getVol(numeroVol: string): VolResponse | undefined {
    return this.volsCache$.value.get(numeroVol);
  }

  /**
   * Récupère la capacité de l'avion pour un vol
   */
  getCapaciteAvion(numeroVol: string): number | null {
    const vol = this.getVol(numeroVol);
    return vol?.capaciteAvion || null;
  }
}
