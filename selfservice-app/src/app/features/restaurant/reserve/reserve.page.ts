import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-reserve',
  imports: [IonicModule, CommonModule],
  template: `
    <ion-content class="ion-padding">
      <h2>Reserva</h2>
      <p>Placeholder da reserva.</p>
    </ion-content>
  `,
})
export class ReservePage {}
