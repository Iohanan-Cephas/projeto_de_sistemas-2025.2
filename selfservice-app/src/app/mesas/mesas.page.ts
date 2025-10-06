import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonRefresher,
  IonRefresherContent,
  IonFooter,
  IonButtons,
  IonButton,
  IonIcon,
  IonSearchbar,
  IonSkeletonText,
  IonMenuButton,
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
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonLabel,
    IonRefresher,
    IonRefresherContent,
    IonFooter,
    IonButtons,
    IonButton,
    IonIcon,
    IonSearchbar,
    IonSkeletonText,
    IonMenuButton,
  ],
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
      ion-footer {
        padding: 12px;
        background: transparent;
      }
      .name {
        font-weight: 700;
        margin-left: 8px;
      }
      .avatar {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: linear-gradient(
          135deg,
          var(--ion-color-primary),
          var(--ion-color-tertiary)
        );
        color: white;
        display: grid;
        place-items: center;
        font-size: 12px;
        font-weight: 800;
      }
      :host ::ng-deep .profile-popover {
        --background: rgba(15, 22, 40, 0.95);
        --backdrop-opacity: 0.2;
        --box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
        --border-radius: 14px;
        backdrop-filter: blur(6px);
      }
      .mesa-card .info h2 {
        color: #fff; /* 👈 branco */
        margin: 0 0 4px 0;
        font-size: 18px;
        font-weight: 800;
      }

      .mesa-card .info p {
        margin: 0;
        color: var(--ion-color-medium);
      }
      ion-header ion-toolbar {
        --color: #fff; /* cor dos textos do toolbar */
      }

      ion-searchbar {
        --color: #fff; /* texto digitado */
        --placeholder-color: rgba(255, 255, 255, 0.65); /* placeholder */
        --icon-color: rgba(255, 255, 255, 0.75); /* ícone da lupa */
        --clear-button-color: #fff; /* botão X do Ionic */
      }
    `,
  ],
  template: `
    <ion-header>
      <ion-toolbar color="transparent">
        <ion-buttons slot="start">
          <ion-menu-button autoHide="false"></ion-menu-button>
        </ion-buttons>
        <ion-title>Mesas Livres</ion-title>
        <!-- ✅ título correto -->
      </ion-toolbar>
    </ion-header>

    <ion-content class="page">
      <ion-refresher slot="fixed" (ionRefresh)="load($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <ion-searchbar
        type="text"
        placeholder="Buscar mesa..."
        showClearButton="always"
        (ionInput)="filter($event)"
        class="card"
        style="--background:transparent; margin-bottom:12px;"
      >
      </ion-searchbar>

      <ng-container *ngIf="loading; else listTpl">
        <div class="card mesa-card" *ngFor="let s of [1, 2, 3, 4]">
          <ion-skeleton-text
            [animated]="true"
            style="width: 60%"
          ></ion-skeleton-text>
          <ion-skeleton-text
            [animated]="true"
            style="width: 80px"
          ></ion-skeleton-text>
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
          <ion-label>Nenhuma mesa encontrada.</ion-label>
        </ion-item>
      </ng-template>
    </ion-content>

    <!-- Bottom navbar (placeholders por enquanto) -->
    <ion-footer class="bottom-nav">
      <ion-buttons>
        <ion-button
          expand="block"
          class="btn-pill"
          fill="solid"
          color="primary"
          (click)="notReady('Ler QR Code')"
        >
          <ion-icon name="qr-code-outline" slot="start"></ion-icon>
          Ler QR Code
        </ion-button>
        <ion-button
          expand="block"
          class="btn-pill"
          fill="outline"
          color="secondary"
          (click)="notReady('Fazer reserva')"
          style="margin-left:10px"
        >
          <ion-icon name="calendar-outline" slot="start"></ion-icon>
          Fazer reserva
        </ion-button>
      </ion-buttons>
    </ion-footer>
  `,
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
    return (
      (parts[0]?.[0] ?? 'U').toUpperCase() + (parts[1]?.[0] ?? '').toUpperCase()
    );
  }

  ionViewWillEnter() {
    this.load();
  }

  load(ev?: RefresherCustomEvent) {
    this.loading = true;
    this.http
      .get<Mesa[]>(`${environment.apiBase}/api/mesas/livres/`)
      .subscribe({
        next: (data) => {
          this.mesas = data || [];
          this.filtered = this.mesas;
          this.loading = false;
          ev?.detail?.complete();
        },
        error: (_) => {
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

  // recebe o popover e fecha antes de navegar
  logout(pop?: any) {
    try {
      pop?.dismiss();
    } catch {}
    this.auth.logout();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
