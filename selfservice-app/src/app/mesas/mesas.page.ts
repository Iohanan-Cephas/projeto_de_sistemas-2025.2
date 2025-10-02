import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel,
  IonRefresher, IonRefresherContent, IonFooter, IonButtons, IonButton, IonIcon,
  IonSearchbar, IonSkeletonText
} from '@ionic/angular/standalone';
import type { RefresherCustomEvent } from '@ionic/angular';

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
    IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel,
    IonRefresher, IonRefresherContent, IonFooter, IonButtons, IonButton, IonIcon,
    IonSearchbar, IonSkeletonText
  ],
  styles: [`
    .page { padding: 14px; }
    .mesa-card {
      padding: 14px;
      margin-bottom: 12px;
      display: flex; align-items: center; justify-content: space-between;
    }
    .info h2 { margin: 0 0 4px 0; font-size: 18px; font-weight: 800; }
    .info p { margin: 0; color: var(--ion-color-medium); }
    .chip { margin-left: 8px; }
    ion-footer { padding: 12px; background: transparent; }
  `],
  template: `
  <ion-header>
    <ion-toolbar color="transparent">
      <ion-title>Mesas Livres</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content class="page">
    <ion-refresher slot="fixed" (ionRefresh)="load($event)">
      <ion-refresher-content></ion-refresher-content>
    </ion-refresher>

    <ion-searchbar placeholder="Buscar mesa..." (ionInput)="filter($event)" class="card"
      style="--background:transparent; margin-bottom:12px;"></ion-searchbar>

    <ng-container *ngIf="loading; else listTpl">
      <div class="card mesa-card" *ngFor="let s of [1,2,3,4]">
        <ion-skeleton-text [animated]="true" style="width: 60%"></ion-skeleton-text>
        <ion-skeleton-text [animated]="true" style="width: 80px"></ion-skeleton-text>
      </div>
    </ng-container>

    <ng-template #listTpl>
      <div class="card mesa-card" *ngFor="let m of filtered">
        <div class="info">
          <h2>Mesa #{{ m.numero }}</h2>
          <p>Capacidade {{ m.capacidade }}</p>
        </div>
        <div class="chip badge-free">Livre</div>
      </div>

      <ion-item lines="none" class="card" *ngIf="filtered.length === 0">
        <ion-label>Nenhuma mesa livre.</ion-label>
      </ion-item>
    </ng-template>
  </ion-content>

  <!-- Bottom navbar (placeholders por enquanto) -->
  <ion-footer class="bottom-nav">
    <ion-buttons>
      <ion-button expand="block" class="btn-pill" fill="solid" color="primary" (click)="notReady('Ler QR Code')">
        <ion-icon name="qr-code-outline" slot="start"></ion-icon>
        Ler QR Code
      </ion-button>
      <ion-button expand="block" class="btn-pill" fill="outline" color="secondary" (click)="notReady('Fazer reserva')" style="margin-left:10px">
        <ion-icon name="calendar-outline" slot="start"></ion-icon>
        Fazer reserva
      </ion-button>
    </ion-buttons>
  </ion-footer>
  `
})
export class MesasPage {
  private http = inject(HttpClient);
  mesas: Mesa[] = [];
  filtered: Mesa[] = [];
  loading = false;

  ionViewWillEnter() { this.load(); }

  load(ev?: RefresherCustomEvent) {
    this.loading = true;
    this.http.get<Mesa[]>(`${environment.apiBase}/api/mesas/livres/`).subscribe({
      next: data => {
        this.mesas = data || [];
        this.filtered = this.mesas;
        this.loading = false;
        ev?.detail?.complete();
      },
      error: _ => {
        this.mesas = [];
        this.filtered = [];
        this.loading = false;
        ev?.detail?.complete();
      }
    });
  }

  filter(e: any) {
    const q = (e.target?.value || '').toString().toLowerCase().trim();
    this.filtered = !q ? this.mesas :
      this.mesas.filter(m => (`${m.numero}`.includes(q) || `${m.capacidade}`.includes(q)));
  }

  notReady(label: string) {
    // por ora só um toast nativo simples
    alert(`${label} estará disponível em breve 🚧`);
  }
}
