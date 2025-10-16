import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton,
  IonItem, IonLabel, IonRefresher, IonRefresherContent, IonSkeletonText
} from '@ionic/angular/standalone';
import { PedidosService } from '../services/pedidos.service';

type Pedido = {
  id: number;
  mesa_id: number | string;
  valor: number;
  criado_em: string | Date;
  status?: 'PENDENTE' | 'PREPARANDO' | 'PRONTO' | 'ENTREGUE' | 'CANCELADO';
};

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [
    CommonModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton,
    IonItem, IonLabel, IonRefresher, IonRefresherContent, IonSkeletonText
  ],
  template: `
    <ion-header class="ga-header">
      <ion-toolbar color="transparent">
        <ion-buttons slot="start">
          <ion-menu-button autoHide="false"></ion-menu-button>
        </ion-buttons>
        <ion-title>Pedidos</ion-title>
      </ion-toolbar>
    </ion-header>

    <!-- respeita o header -->
    <ion-content [fullscreen]="false" class="ga-content">
      <ion-refresher slot="fixed" (ionRefresh)="doRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <!-- 👉 só esse bloco desce -->
      <section class="hero-row">
        <div class="headline">
          <h1>Visão geral</h1>
          <p>Lista de pedidos em andamento e histórico recente.</p>
        </div>
      </section>

      <!-- Skeleton -->
      <div *ngIf="loading" class="list">
        <div class="card" *ngFor="let _ of skeleton">
          <div class="row">
            <div>
              <h2><ion-skeleton-text animated style="width: 180px"></ion-skeleton-text></h2>
              <p><ion-skeleton-text animated style="width: 140px"></ion-skeleton-text></p>
              <p><ion-skeleton-text animated style="width: 90px"></ion-skeleton-text></p>
            </div>
            <span class="badge badge-muted"><ion-skeleton-text animated style="width: 60px"></ion-skeleton-text></span>
          </div>
        </div>
      </div>

      <!-- Lista -->
      <div *ngIf="!loading && pedidos.length" class="list">
        <div class="card" *ngFor="let p of pedidos; trackBy: trackById">
          <div class="row">
            <div class="info">
              <h2 class="title">Pedido #{{ p.id }} — Mesa {{ p.mesa_id }}</h2>
              <p class="muted">Criado em: {{ p.criado_em | date:'short' }}</p>
              <p class="muted">Valor: R$ {{ p.valor | number:'1.2-2' }}</p>
            </div>
            <span class="badge" [ngClass]="statusClass(p.status)">{{ p.status || '—' }}</span>
          </div>
        </div>
      </div>

      <!-- Vazio -->
      <div *ngIf="!loading && pedidos.length === 0" class="empty">
        <ion-item lines="none" class="card">
          <ion-label>Nenhum pedido encontrado.</ion-label>
        </ion-item>
      </div>
    </ion-content>
  `,
  styles: [`
    :host{
      --ga-bg:#0b0c0d; --ga-bg-2:#0e1012; --ga-card:rgba(20,22,24,.72);
      --ga-border:#23262a; --ga-fg:#fff; --ga-muted:#a7abb3; --ga-white-10:rgba(255,255,255,.10);
    }

    /* header clean */
    .ga-header ion-toolbar{
      --background:transparent;
      --border-color:transparent;
      --color:var(--ga-fg);
      --min-height:56px;  /* altura base do toolbar */
      padding-inline:8px;
    }

    /* fundo e padding global (sem empurrar demais) */
    .ga-content::part(scroll){
      background:
        radial-gradient(900px 480px at 85% -10%, rgba(255,255,255,.06), transparent 60%),
        radial-gradient(700px 360px at -10% 110%, rgba(255,255,255,.05), transparent 65%),
        linear-gradient(120deg, var(--ga-bg), var(--ga-bg-2));
      padding: 14px;
      padding-top: 0; /* não desloca o conteúdo inteiro */
    }

    /* 👉 apenas o bloco “Visão geral” desce; ajuste fino no valor abaixo */
    .hero-row{
      margin: 0 2px 14px;
      margin-top: 64px; /* ajuste aqui se precisar +/− espaço */
    }

    .headline h1{ margin:0; color:#fff; font-size:22px; font-weight:800; }
    .headline p{ margin:4px 0 0; color:var(--ga-muted); font-size:13px; }

    .list{ display:grid; gap:12px; }
    .card{
      background:var(--ga-card); border:1px solid var(--ga-border); border-radius:16px;
      padding:14px; color:var(--ga-fg); box-shadow:0 12px 40px rgba(0,0,0,.35); backdrop-filter:blur(4px);
    }
    .row{ display:flex; align-items:center; justify-content:space-between; gap:10px; }
    .title{ margin:0 0 6px; font-size:17px; font-weight:800; color:#fff; }
    .muted{ margin:0; color:var(--ga-muted); font-size:13px; }

    .badge{
      padding:6px 10px; border-radius:10px; font-size:12px; font-weight:800;
      border:1px solid var(--ga-border); color:#fff; background:#16181b; white-space:nowrap;
    }
    .badge-muted{ color:#d7d7d7; background:#121416; }
    .badge-pendente{ background:#141517; color:#e5e5e5; }
    .badge-preparando{ background:#1b1d20; }
    .badge-pronto{ background:#202225; }
    .badge-entregue{ background:#0f1113; color:#b9bec6; }
    .badge-cancelado{ background:#1a1416; color:#ff8a8a; border-color:#3b2227; }

    ion-item{
      --highlight-color-focused:#dcdfe4;
      --ripple-color:rgba(255,255,255,.12);
      --color:var(--ga-fg);
      --background:transparent;
      border-radius:12px;
    }
  `]
})
export class HomePage implements OnInit {
  private pedidosSvc = inject(PedidosService);

  pedidos: Pedido[] = [];
  loading = true;
  skeleton = Array.from({ length: 4 });

  ngOnInit(){ this.load(); }

  load(){
    this.loading = true;
    this.pedidosSvc.getPedidos().subscribe({
      next: (data:any[]) => {
        this.pedidos = (data || []).map(p => ({
          ...p,
          status: (String(p.status || '').toUpperCase() as Pedido['status']) || 'PENDENTE'
        }));
        this.loading = false;
      },
      error: () => { this.pedidos = []; this.loading = false; }
    });
  }

  doRefresh(ev: CustomEvent){
    this.pedidosSvc.getPedidos().subscribe({
      next: (data:any[]) => {
        this.pedidos = (data || []).map(p => ({
          ...p,
          status: (String(p.status || '').toUpperCase() as Pedido['status']) || 'PENDENTE'
        }));
        (ev.target as HTMLIonRefresherElement).complete();
      },
      error: () => { (ev.target as HTMLIonRefresherElement).complete(); }
    });
  }

  trackById = (_:number, p:Pedido) => p.id;

  statusClass(s?: Pedido['status']){
    switch ((s || 'PENDENTE').toUpperCase()){
      case 'PREPARANDO': return 'badge badge-preparando';
      case 'PRONTO':     return 'badge badge-pronto';
      case 'ENTREGUE':   return 'badge badge-entregue';
      case 'CANCELADO':  return 'badge badge-cancelado';
      default:           return 'badge badge-pendente';
    }
  }
}
