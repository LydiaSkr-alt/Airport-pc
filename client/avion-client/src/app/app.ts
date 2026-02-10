import {Component, OnDestroy, OnInit, signal} from '@angular/core';
import { AvionComponent } from "./components/avion/avion.component";
import { PisteComponent } from "./components/piste/piste-component";
import { HangarComponent } from "./components/hangar/hangar.component";
import {VolComponent} from './components/vol/vol.component';
import {CommonModule, NgSwitch} from '@angular/common';
import {TraficComponent} from './components/trafic/trafic.component';
import {AeroportComponent} from './components/aeroport/aeroport.component';
import {PassagerComponent} from './components/passager/passager.component';
import {NotificationToastComponent} from './components/notification/notification.component';
import {StreamManagerService} from './service/stream-manager-service';

@Component({
  selector: 'app-root',
  imports: [AvionComponent, PisteComponent, HangarComponent, VolComponent, TraficComponent, NgSwitch, CommonModule, AeroportComponent , PassagerComponent , NotificationToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit, OnDestroy {
 // protected readonly title = signal('avion-client');
  activeTab:  'passager'|'aeroports'|'trafic' |'avions' | 'pistes' | 'hangars' | 'vols' = 'aeroports' ;
  constructor(private streamManager: StreamManagerService) {}

  ngOnInit(): void {
    // Démarre tous les streams au chargement de l'application
    this.streamManager.startGlobalStreams();
  }

  ngOnDestroy(): void {
    // Arrête tous les streams à la destruction
    this.streamManager.stopAllStreams();
  }
}
