import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonButtons,
  IonMenuButton,
  IonSkeletonText,
  IonSearchbar,
} from '@ionic/angular/standalone';
import { CardapioService } from '../services/cardapio.service';
import { priceFormatter } from '../utils/priceFormatter';

@Component({
  standalone: true,
  selector: 'app-cardapio',
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonLabel,
    IonButtons,
    IonMenuButton,
    IonSearchbar,
    IonSkeletonText,
  ],
  styles: [
    `
      .page {
        padding: 14px;
      }

      .container {
        display: grid;
        grid-template-columns: repeat(3, 1fr); /* 3 colunas fixas */
        gap: 12px;
      }

      .cardapio-card {
        padding: 12px;
        background: rgba(255, 255, 255, 0.07);
        border-radius: 12px;
        position: relative;
      }

      .cardapio-card h3 {
        margin: 0 0 6px;
        font-size: 16px;
        font-weight: 700;
        color: #fff;
      }

      .cardapio-card small {
        font-size: 14px;
        color: var(--ion-color-success);
        font-weight: 700;
        position: absolute;
        top: 4px;
        right: 8px;
      }

      .cardapio-card p {
        margin: 0;
        color: var(--ion-color-medium);
        font-size: 13px;
      }

      ion-header ion-toolbar {
        --color: #fff; /* cor dos textos do toolbar */
      }

      ion-searchbar {
        --color: #fff; /* texto digitado */
        --placeholder-color: rgba(255, 255, 255, 0.65);
        --icon-color: rgba(255, 255, 255, 0.75);
        --clear-button-color: #fff;
        margin-bottom: 12px;
      }

      @media (max-width: 1024px) {
        .container {
          grid-template-columns: 1fr; /* 1 coluna */
        }
      }

      @media (max-width: 600px) {
        .cardapio-card {
          flex: 1 1 100%;
          max-width: 100%;
        }
      }
    `,
  ],
  template: `
    <ion-header>
      <ion-toolbar color="transparent">
        <ion-buttons slot="start">
          <ion-menu-button autoHide="false"></ion-menu-button>
        </ion-buttons>
        <ion-title>Cardápio</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="page">
      <ion-searchbar
        type="text"
        placeholder="Buscar item..."
        showClearButton="always"
        (ionInput)="filter($event)"
        style="--background:transparent;"
      >
      </ion-searchbar>

      <ng-container *ngIf="loading; else listTpl">
        <div class="cardapio-card" *ngFor="let s of [1, 2, 3]">
          <ion-skeleton-text
            [animated]="true"
            style="width: 60%"
          ></ion-skeleton-text>
          <ion-skeleton-text
            [animated]="true"
            style="width: 40%"
          ></ion-skeleton-text>
        </div>
      </ng-container>

      <ng-template #listTpl>
        <div class="container">
          <div class="cardapio-card" *ngFor="let it of filtered">
            <h3>
              {{ it.nome }}
            </h3>
            <small>{{ this.formatPreco(it.preco) }}</small>
            <p>{{ it.descricao }}</p>
          </div>
        </div>

        <ion-item lines="none" class="card" *ngIf="filtered.length === 0">
          <ion-label>Nenhum item encontrado.</ion-label>
        </ion-item>
      </ng-template>
    </ion-content>
  `,
})
export class CardapioPage implements OnInit {
  public itens: any[] = [];

  constructor(private service: CardapioService) {}

  loading = false;
  filtered = this.itens;

  filter(event: any) {
    const query = event.target.value.toLowerCase();
    this.filtered = this.itens.filter(
      (it) =>
        it.nome.toLowerCase().includes(query) ||
        it.descricao.toLowerCase().includes(query)
    );
  }

  ngOnInit() {
    this.service.getItens().subscribe((data) => {
      if (data && data.length) {
        this.itens = data;
        this.filtered = data;
      }
    });
  }

  formatPreco(valor: number): string {
    return priceFormatter(valor);
  }
}
