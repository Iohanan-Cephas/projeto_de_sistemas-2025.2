import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Import standalone components do Ionic
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList
} from '@ionic/angular/standalone';

// Ionicons
import { addIcons } from 'ionicons';
import {
  add,
  chevronBack,
  chevronDown,
  chevronForward,
  chevronUp,
  searchOutline,
  personCircleOutline,
  alertCircleOutline,
  checkmarkCircleOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonSegment,
    IonSegmentButton,
    IonContent,
    IonFab,
    IonFabButton,
    IonFabList
  ],
})
export class HomePage {
  segment: string = 'ocupadas';

  constructor() {
    addIcons({
      add,
      chevronBack,
      chevronForward,
      chevronUp,
      chevronDown,
      searchOutline,
      personCircleOutline,
      alertCircleOutline,
      checkmarkCircleOutline
    });
  }
}
