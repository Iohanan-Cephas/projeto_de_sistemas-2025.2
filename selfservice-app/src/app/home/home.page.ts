import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButtons, IonMenuButton
} from '@ionic/angular/standalone';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [
    CommonModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonButtons, IonMenuButton
  ],
  template: `
  <ion-header>
    <ion-toolbar color="transparent">
      <ion-buttons slot="start">
        <ion-menu-button autoHide="false"></ion-menu-button>
      </ion-buttons>
      <ion-title>Página Inicial</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding">
    <!-- espaço reservado para conteúdo futuro -->
  </ion-content>
  `
})
export class HomePage {}
