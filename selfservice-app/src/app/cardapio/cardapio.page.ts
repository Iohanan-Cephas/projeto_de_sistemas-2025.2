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
  styles: [`
    :host{
      --ga-bg:#0b0c0d; --ga-bg-2:#0e1012;
      --ga-card:rgba(20,22,24,.72); --ga-border:#23262a;
      --ga-fg:#fff; --ga-muted:#a7abb3; --ga-soft:#8e949c;
      --ga-white-10:rgba(255,255,255,.10);
    }

    ion-header ion-toolbar{
      --background: transparent;
      --border-color: transparent;
      --color: var(--ga-fg);
      --min-height: 56px;
      padding-inline: 8px;
    }

    /* Fundo e layout base */
    .ga-content::part(scroll){
      background:
        radial-gradient(900px 480px at 85% -10%, rgba(255,255,255,.06), transparent 60%),
        radial-gradient(700px 360px at -10% 110%, rgba(255,255,255,.05), transparent 65%),
        linear-gradient(120deg, var(--ga-bg), var(--ga-bg-2));
      padding: 14px;
      padding-top: 0; /* não empurra tudo */
    }

    /* Só o bloco hero desce (pra não bater no header) */
    .hero{
      margin: 0 2px 14px;
      margin-top: 64px; /* ajuste fino aqui se precisar mais/menos espaço */
    }
    .hero h1{
      margin:0; color:#fff; font-size:22px; font-weight:800;
    }
    .hero p{
      margin:6px 0 0; color:var(--ga-muted); font-size:13px;
    }

    /* Searchbar dark, sem azul */
    ion-searchbar{
      --background: transparent;
      --color: #fff;
      --placeholder-color: rgba(255,255,255,.65);
      --icon-color: rgba(255,255,255,.75);
      --clear-button-color: #fff;
      --border-radius: 12px;
      border: 1px solid var(--ga-border);
      margin: 12px 2px 16px;
    }

    /* Grid fluida (cards responsivos) */
    .grid{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 12px;
    }

    .card{
      position: relative;
      background: var(--ga-card);
      border: 1px solid var(--ga-border);
      border-radius: 16px;
      padding: 12px 12px 14px;
      color: var(--ga-fg);
      box-shadow: 0 12px 40px rgba(0,0,0,.35);
      backdrop-filter: blur(4px);
      transition: transform .15s ease, box-shadow .15s ease;
    }
    .card:hover{ transform: translateY(-2px); box-shadow: 0 18px 50px rgba(0,0,0,.45); }

    .card h3{
      margin: 0 0 6px; font-size: 16px; font-weight: 800; color: #fff;
    }
    .card p{
      margin: 0; color: var(--ga-soft); font-size: 13px;
    }

    /* Preço em badge monocromática */
    .price{
      position: absolute; top: 8px; right: 10px;
      padding: 4px 10px; border-radius: 999px;
      font-size: 12px; font-weight: 800;
      background: #141618; color: #fff; border: 1px solid var(--ga-border);
    }

    /* Skeleton cards */
    .skeleton-list{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 12px;
    }
    .sk-card{
      background: var(--ga-card);
      border: 1px solid var(--ga-border);
      border-radius: 16px;
      padding: 14px;
    }

    /* Item "nenhum encontrado" */
    ion-item.card{
      --background: var(--ga-card);
      --color: var(--ga-fg);
      --border-color: var(--ga-border);
      border-radius: 16px;
      margin-top: 12px;
    }

    /* Remove qualquer highlight/ripple azulado */
    ion-item, ion-searchbar{
      --highlight-color-focused: #dcdfe4;
      --ripple-color: rgba(255,255,255,.12);
    }
  `],
  template: `
    <ion-header>
      <ion-toolbar color="transparent">
        <ion-buttons slot="start">
          <ion-menu-button autoHide="false"></ion-menu-button>
        </ion-buttons>
        <ion-title>Cardápio</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="false" class="ga-content">
      <!-- bloco hero apenas para respir o topo -->
      <section class="hero">
        <h1>Explorar</h1>
        <p>Veja os itens disponíveis e encontre o seu favorito.</p>
      </section>

      <ion-searchbar
        type="text"
        placeholder="Buscar item..."
        showClearButton="always"
        (ionInput)="filter($event)">
      </ion-searchbar>

      <ng-container *ngIf="loading; else listTpl">
        <div class="skeleton-list">
          <div class="sk-card" *ngFor="let s of [1,2,3,4]">
            <ion-skeleton-text animated style="width: 60%"></ion-skeleton-text>
            <ion-skeleton-text animated style="width: 40%"></ion-skeleton-text>
          </div>
        </div>
      </ng-container>

      <ng-template #listTpl>
        <div class="grid">
          <div class="card" *ngFor="let it of filtered">
            <span class="price">{{ formatPreco(it.preco) }}</span>
            <h3>{{ it.nome }}</h3>
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
  loading = false;
  filtered: any[] = [];

  constructor(private service: CardapioService) {}

  filter(event: any) {
    const query = String(event.target?.value || '').toLowerCase();
    this.filtered = this.itens.filter(
      (it) =>
        String(it.nome).toLowerCase().includes(query) ||
        String(it.descricao).toLowerCase().includes(query)
    );
  }

  ngOnInit() {
    this.loading = true;
    this.service.getItens().subscribe({
      next: (data) => {
        this.itens = data || [];
        this.filtered = [...this.itens];
        this.loading = false;
      },
      error: () => { this.itens = []; this.filtered = []; this.loading = false; }
    });
  }

  formatPreco(valor: number): string {
    return priceFormatter(valor);
  }
}
