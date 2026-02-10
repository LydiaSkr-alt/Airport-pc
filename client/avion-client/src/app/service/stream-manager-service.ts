// stream-manager.service.ts
import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SuiviVolService } from './suivi-vol-service';
import { OperationsAeroportService } from './operationsAeroport-service';
import { NotificationService } from './notification-service';
import { VolCacheService } from './vol-cache-service';
import { EvenementVolResponse, TypeEvenementVol } from '../interface/suivi-vol-interface';
import { VolResponse, StatutVol } from '../interface/vol-interface';

@Injectable({ providedIn: 'root' })
export class StreamManagerService implements OnDestroy {
  private subscriptions: Subscription[] = [];
  private lastStatutByVol = new Map<string, StatutVol>(); // ⭐ Pour éviter les doublons

  constructor(
    private suiviVolService: SuiviVolService,
    private operationsService: OperationsAeroportService,
    private notificationService: NotificationService,
    private volCacheService: VolCacheService
  ) {}

  startGlobalStreams(): void {


    // ⭐ STREAM 1 : Événements de suivi (CHECK_IN, EMBARQUEMENT, etc.)
    const suiviSub= this.suiviVolService.streamTousLesEvenements()
      .subscribe({
        next: data => {
          console.log('📡 Donnée reçue du stream:', data);
          this.handleOperationEvent(data as any);
        },
        error: err => console.error('❌ Erreur stream suivi', err)
      });

    // ⭐ STREAM 2 : Opérations (changements de statut via les opérations)
    const opsSub = this.operationsService.streamOperations()
      .subscribe({
        next: vol => {
          this.handleOperationEvent(vol);
        },
        error: err => console.error('❌ Erreur stream opérations', err)
      });

    this.subscriptions.push(suiviSub, opsSub);

  }

  stopAllStreams(): void {

    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
    this.lastStatutByVol.clear();
  }

  private handleSuiviEvent(event: EvenementVolResponse): void {
    // Ignorer PASSAGER_EMBARQUE
    if (event.typeEvenement === TypeEvenementVol.PASSAGER_EMBARQUE) {
      const nbPassagers = event.details['nombrePassagers'] || event.details['embarques'] || 0;
      const capacite = this.volCacheService.getCapaciteAvion(event.numeroVol) || nbPassagers;
      return;
    }

    // CHANGEMENT_STATUT
    if (event.typeEvenement === TypeEvenementVol.CHANGEMENT_STATUT) {
      this.handleChangementStatut(event.numeroVol, event.ancienStatut, event.nouveauStatut, event.details);
      return;
    }

    // Autres événements (PISTE_ASSIGNEE, AVION_ASSIGNE, etc.)
    const { message, type } = this.getEventNotification(event);

    this.notificationService.addNotification({
      message,
      type,
      numeroVol: event.numeroVol,
      statut: event.nouveauStatut || undefined,
      autoClose: true
    });
  }

  private handleOperationEvent(vol: VolResponse): void {
    // 1. On récupère l'ancien statut stocké pour ce vol
    const lastStatut = this.lastStatutByVol.get(vol.numeroVol);

    // 2. Si le statut est différent de ce qu'on connaissait (ou si c'est le premier message)
    if (lastStatut !== vol.statut) {

      console.log(`🔄 Statut mis à jour pour ${vol.numeroVol}: ${lastStatut || 'Nouveau vol'} -> ${vol.statut}`);

      // On déclenche la notification.
      // Si lastStatut est indéfini, on passe une chaîne pour éviter de bloquer les "if"
      this.handleChangementStatut(
        vol.numeroVol,
        lastStatut ,
        vol.statut ,
        {}
      );

      // 3. On met à jour le cache pour la prochaine fois
      this.lastStatutByVol.set(vol.numeroVol, vol.statut);
    }
  }

  private handleChangementStatut(
    numeroVol: string,
    ancienStatut: StatutVol | null | undefined,
    nouveauStatut: StatutVol | null | undefined,
    details: any = {}
  ): void {

    if (!ancienStatut || !nouveauStatut) {
      return;
    }

    const capacite = this.volCacheService.getCapaciteAvion(numeroVol);

    // PROGRAMME → ENREGISTREMENT
    if (ancienStatut === StatutVol.PROGRAMME && nouveauStatut === StatutVol.ENREGISTREMENT) {
      this.notificationService.addNotification({
        message: '✔️ Enregistrement ouvert',
        type: 'info',
        numeroVol,
        statut: nouveauStatut,
        autoClose: true
      });
    }

    // ENREGISTREMENT → EMBARQUEMENT
    else if (ancienStatut === StatutVol.ENREGISTREMENT && nouveauStatut === StatutVol.EMBARQUEMENT) {

      this.notificationService.addNotification({
        message: `🔒 Enregistrement fermé`,
        type: 'success',
        numeroVol,
        statut: nouveauStatut,
        autoClose: true
      });

      setTimeout(() => {
        this.notificationService.addNotification({
          message: '🚶 Embarquement commencé',
          type: 'info',
          numeroVol,
          statut: nouveauStatut,
          autoClose: true
        });
      }, 1000);
    }

    // EMBARQUEMENT → PRET_DECOLLAGE
    else if (ancienStatut === StatutVol.EMBARQUEMENT && nouveauStatut === StatutVol.PRET_DECOLLAGE) {

      this.notificationService.addNotification({
        message: `✅ Embarquement terminé`,
        type: 'success',
        numeroVol,
        statut: nouveauStatut,
        autoClose: true
      });

      setTimeout(() => {
        this.notificationService.addNotification({
          message: '🚪 Portes fermées',
          type: 'warning',
          numeroVol,
          statut: nouveauStatut,
          autoClose: true
        });
      }, 1000);

      setTimeout(() => {
        this.notificationService.addNotification({
          message: '🚀 Prêt au décollage',
          type: 'warning',
          numeroVol,
          statut: nouveauStatut,
          autoClose: true
        });
      }, 2000);
    }

    // PRET_DECOLLAGE → DECOLLE
    else if (ancienStatut === StatutVol.PRET_DECOLLAGE && nouveauStatut === StatutVol.DECOLLE) {
      this.notificationService.addNotification({
        message: '🛫 Décollage effectué',
        type: 'success',
        numeroVol,
        statut: nouveauStatut,
        autoClose: true
      });
    }

    // DECOLLE → EN_VOL
    else if (ancienStatut === StatutVol.DECOLLE && nouveauStatut === StatutVol.EN_VOL) {
      this.notificationService.addNotification({
        message: '✈️ En vol',
        type: 'success',
        numeroVol,
        statut: nouveauStatut,
        autoClose: true
      });
    }

    // EN_VOL → EN_APPROCHE
    else if (ancienStatut === StatutVol.EN_VOL && nouveauStatut === StatutVol.EN_APPROCHE) {
      this.notificationService.addNotification({
        message: '🛬 En approche',
        type: 'info',
        numeroVol,
        statut: nouveauStatut,
        autoClose: true
      });
    }

    // EN_APPROCHE → ATTERRI
    else if (ancienStatut === StatutVol.EN_APPROCHE && nouveauStatut === StatutVol.ATTERRI) {
      this.notificationService.addNotification({
        message: '🛬 Vol atterri',
        type: 'success',
        numeroVol,
        statut: nouveauStatut,
        autoClose: true
      });
    }

    // ATTERRI → ARRIVE
    else if (ancienStatut === StatutVol.ATTERRI && nouveauStatut === StatutVol.ARRIVE) {
      this.notificationService.addNotification({
        message: '✅ Vol arrivé',
        type: 'success',
        numeroVol,
        statut: nouveauStatut,
        autoClose: true
      });
    }

    // Par défaut
    else {
      this.notificationService.addNotification({
        message: `${ancienStatut} → ${nouveauStatut}`,
        type: 'info',
        numeroVol,
        statut: nouveauStatut,
        autoClose: true
      });
    }
  }

  private getEventNotification(event: EvenementVolResponse): { message: string; type: 'info' | 'success' | 'warning' | 'error' } {
    const capaciteAvion = this.volCacheService.getCapaciteAvion(event.numeroVol);

    switch (event.typeEvenement) {
      case TypeEvenementVol.PISTE_ASSIGNEE:
        return {
          message: `🛬 Piste ${event.details['pisteName'] || event.details['piste'] || '?'} assignée`,
          type: 'info'
        };

      case TypeEvenementVol.AVION_ASSIGNE:
        const avionImmat = event.details['avionImmatriculation'] || event.details['immatriculation'] || '?';
        if (capaciteAvion) {
          return {
            message: `✈️ Avion ${avionImmat} assigné (${capaciteAvion} places)`,
            type: 'info'
          };
        }
        return { message: `✈️ Avion ${avionImmat} assigné`, type: 'info' };

      case TypeEvenementVol.RETARD_ANNONCE:
        return { message: '⏰ Retard annoncé', type: 'warning' };

      case TypeEvenementVol.ANNULATION:
        return { message: '❌ Vol annulé', type: 'error' };

      default:
        return { message: event.message || 'Événement reçu', type: 'info' };
    }
  }

  ngOnDestroy(): void {
    this.stopAllStreams();
  }
}
