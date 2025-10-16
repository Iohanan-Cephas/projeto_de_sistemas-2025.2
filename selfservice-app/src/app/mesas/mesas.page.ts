import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel,
  IonRefresher, IonRefresherContent, IonFooter, IonButtons, IonButton,
  IonIcon, IonSearchbar, IonSkeletonText, IonMenuButton
} from '@ionic/angular/standalone';
import type { RefresherCustomEvent } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

type Mesa = {
  id: number;
  numero: number;
  capacidade: number;
  ocupada: boolean;
  reservada: boolean;
  reservada_por: string | null;
  reserva_expira_em: string | null;
};

@Component({
  standalone: true,
  selector: 'app-mesas',
  imports: [
    CommonModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel,
    IonRefresher, IonRefresherContent, IonFooter, IonButtons, IonButton,
    IonIcon, IonSearchbar, IonSkeletonText, IonMenuButton,
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

    /* fundo dark e padding base */
    .ga-content::part(scroll){
      background:
        radial-gradient(900px 480px at 85% -10%, rgba(255,255,255,.06), transparent 60%),
        radial-gradient(700px 360px at -10% 110%, rgba(255,255,255,.05), transparent 65%),
        linear-gradient(120deg, var(--ga-bg), var(--ga-bg-2));
      padding: 14px;
      padding-top: 0; /* não empurra a tela toda */
    }

    /* só o bloco de topo desce (respira do header/hambúrguer) */
    .hero{
      margin: 0 2px 14px;
      margin-top: 64px; /* ajuste fino aqui se quiser mais/menos espaço */
    }
    .hero h1{
      margin:0; color:#fff; font-size:22px; font-weight:800;
    }
    .hero p{
      margin:6px 0 0; color:var(--ga-muted); font-size:13px;
    }

    /* searchbar dark sem azul */
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

    /* cards de mesa */
    .mesa-card{
      background: var(--ga-card);
      border: 1px solid var(--ga-border);
      border-radius: 16px;
      padding: 14px;
      margin-bottom: 12px;
      display: flex; align-items: center; justify-content: space-between; gap: 10px;
      color: var(--ga-fg);
      box-shadow: 0 12px 40px rgba(0,0,0,.35);
      backdrop-filter: blur(4px);
    }
    .info h2{
      margin:0 0 4px; font-size:18px; font-weight:800; color:#fff;
    }
    .info p{
      margin:0; color: var(--ga-soft); font-size:13px;
    }

    /* badge monocromática */
    .badge-free{
      padding: 6px 10px;
      border-radius: 10px;
      font-size: 12px; font-weight: 800;
      border: 1px solid var(--ga-border);
      color: #e5e5e5; background: #141517;
      white-space: nowrap;
    }

    /* item vazio */
    ion-item.card{
      --background: var(--ga-card);
      --color: var(--ga-fg);
      --border-color: var(--ga-border);
      border-radius: 16px;
      margin-top: 12px;
    }

    /* remove highlights azuis globais */
    ion-item, ion-searchbar{
      --highlight-color-focused: #dcdfe4;
      --ripple-color: rgba(255,255,255,.12);
    }

    /* footer monocromático */
    .bottom-nav{
      --background: transparent;
      padding: 12px 14px;
      border-top: 1px solid var(--ga-border);
      backdrop-filter: blur(3px);
    }
    .btn-pill{
      --border-radius: 999px;
      height: 46px; font-weight: 800; letter-spacing:.02em;
    }
    .btn-primary{
      --background:#ffffff; --color:#0b0c0d;
      --background-activated:#e9e9e9; --background-focused:#f2f2f2;
      --ripple-color: rgba(0,0,0,.12);
      flex:1;
    }
    .btn-outline{
      --background: transparent; --color:#ffffff;
      --ripple-color: rgba(255,255,255,.12);
      border: 1px solid var(--ga-border);
      flex:1;
      margin-left: 10px;
    }
  `],
  template: `
    <ion-header>
      <ion-toolbar color="transparent">
        <ion-buttons slot="start">
          <ion-menu-button autoHide="false"></ion-menu-button>
        </ion-buttons>
        <ion-title>Mesas Livres</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="false" class="ga-content">
      <ion-refresher slot="fixed" (ionRefresh)="load($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <!-- respiro do topo -->
      <section class="hero">
        <h1>Selecione uma mesa</h1>
        <p>Busque por número ou capacidade.</p>
      </section>

      <ion-searchbar
        type="text"
        placeholder="Buscar mesa..."
        showClearButton="always"
        (ionInput)="filter($event)">
      </ion-searchbar>

      <ng-container *ngIf="loading; else listTpl">
        <div class="mesa-card" *ngFor="let s of [1,2,3,4]">
          <div>
            <h2><ion-skeleton-text animated style="width: 120px"></ion-skeleton-text></h2>
            <p><ion-skeleton-text animated style="width: 90px"></ion-skeleton-text></p>
          </div>
          <span class="badge-free"><ion-skeleton-text animated style="width: 60px"></ion-skeleton-text></span>
        </div>
      </ng-container>

      <ng-template #listTpl>
        <div class="mesa-card" *ngFor="let m of filtered">
          <div class="info">
            <h2>Mesa #{{ m.numero }}</h2>
            <p>Capacidade {{ m.capacidade }}</p>
          </div>
          <div class="badge-free">Livre</div>
        </div>

        <ion-item lines="none" class="card" *ngIf="filtered.length === 0">
          <ion-label>Nenhuma mesa encontrada.</ion-label>
        </ion-item>
      </ng-template>
    </ion-content>

    <ion-footer class="bottom-nav">
      <ion-buttons>
        <ion-button class="btn-pill btn-primary" (click)="notReady('Ler QR Code')">
          <ion-icon name="qr-code-outline" slot="start"></ion-icon>
          Ler QR Code
        </ion-button>
        <ion-button class="btn-pill btn-outline" fill="clear" (click)="notReady('Fazer reserva')">
          <ion-icon name="calendar-outline" slot="start"></ion-icon>
          Fazer reserva
        </ion-button>
      </ion-buttons>
    </ion-footer>
  `
})
export class MesasPage {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private router = inject(Router);

  mesas: Mesa[] = [];
  filtered: Mesa[] = [];
  loading = false;

  get username() {
    return this.auth.currentUserName ?? 'Usuário';
  }
  get initials() {
    const name = this.username.trim();
    const parts = name.split(/\s+/);
    return (parts[0]?.[0] ?? 'U').toUpperCase() + (parts[1]?.[0] ?? '').toUpperCase();
  }

  ionViewWillEnter() { this.load(); }

  load(ev?: RefresherCustomEvent) {
    this.loading = true;
    this.http.get<Mesa[]>(`${environment.apiBase}/api/mesas/livres/`).subscribe({
      next: (data) => {
        this.mesas = data || [];
        this.filtered = this.mesas;
        this.loading = false;
        ev?.detail?.complete();
      },
      error: () => {
        this.mesas = [];
        this.filtered = [];
        this.loading = false;
        ev?.detail?.complete();
      },
    });
  }

  filter(e: any) {
    const q = (e.target?.value || '').toString().toLowerCase().trim();
    this.filtered = !q
      ? this.mesas
      : this.mesas.filter(
          (m) => `${m.numero}`.includes(q) || `${m.capacidade}`.includes(q)
        );
  }

  notReady(label: string) {
    alert(`${label} estará disponível em breve 🚧`);
  }

  logout(pop?: any) {
    try { pop?.dismiss(); } catch {}
    this.auth.logout();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
