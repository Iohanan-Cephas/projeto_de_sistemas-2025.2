import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';

import { PedidosService } from '../services/pedidos.service';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonItem,
    IonLabel,
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

    <ion-content class="page">
      <h2>Pedidos</h2>
      <div class="card mesa-card" *ngFor="let pedido of pedidos">
        <div class="info">
          <h2 class="pedido-nome">
            Pedido {{ pedido.id }} - Mesa {{ pedido.mesa_id }}
          </h2>
          <p>Criado em: {{ pedido.criado_em | date : 'short' }}</p>
          <p>Valor: R$ {{ pedido.valor | number : '1.2-2' }}</p>
        </div>
        <div class="chip badge-free">Pedido</div>
      </div>
      <div *ngIf="pedidos.length === 0">
        <ion-item lines="none" class="card">
          <ion-label>Nenhum pedido encontrado.</ion-label>
        </ion-item>
      </div>
    </ion-content>
  `,
  styles: [
    `
      .page {
        padding: 14px;
      }
      .mesa-card {
        padding: 14px;
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .info h2 {
        margin: 0 0 4px 0;
        font-size: 18px;
        font-weight: 800;
      }
      .info p {
        margin: 0;
        color: var(--ion-color-medium);
      }
      .chip {
        margin-left: 8px;
      }
      .badge-free {
        background: #e0ffe0;
        color: #2e7d32;
        border-radius: 8px;
        padding: 4px 10px;
        font-size: 13px;
        font-weight: 700;
      }
      h2,
      .pedido-nome {
        color: #fff !important;
      }
      .titulo-pedidos {
        color: #fff !important;
        font-size: 22px;
        font-weight: 800;
        margin-bottom: 18px;
      }
    `,
  ],
})
export class HomePage implements OnInit {
  pedidos: any[] = [];

  constructor(private pedidosService: PedidosService) {}

  ngOnInit() {
    this.pedidosService.getPedidos().subscribe((data) => {
      this.pedidos = data;
    });
  }
}
