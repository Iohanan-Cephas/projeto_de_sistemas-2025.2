import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
  IonContent, IonRefresher, IonRefresherContent,
  IonSegment, IonSegmentButton, IonLabel,
  IonSearchbar, IonBadge, IonNote, IonSpinner,
  IonFab, IonFabButton, IonSkeletonText, IonText
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { refresh, qrCodeOutline, swapHorizontal } from 'ionicons/icons';
import { MesaService } from '../services/mesa.service';

export type MesaStatus = 'LIVRE' | 'OCUPADA' | 'RESERVADA';
export interface Mesa {
  id: number;
  numero?: number;
  code?: string;
  status: MesaStatus;
}

@Component({
  standalone: true,
  selector: 'app-atendente',
  templateUrl: './atendente.page.html',
  styleUrls: ['./atendente.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
    IonContent, IonRefresher, IonRefresherContent,
    IonSegment, IonSegmentButton, IonLabel,
    IonSearchbar, IonBadge, IonNote, IonSpinner,
    IonFab, IonFabButton, IonSkeletonText, IonText
  ],
})
export class AtendentePage {
  private service = inject(MesaService);

  // ícones
  icons = { refresh, qr: qrCodeOutline, swap: swapHorizontal };
  constructor() { addIcons({ refresh, qrCodeOutline, swapHorizontal }); }

  // estado
  loading = signal<boolean>(false);
  mesas = signal<Mesa[]>([]);
  segment: 'ALL' | MesaStatus = 'ALL';
  q = '';
  now = new Date().toLocaleTimeString();
  skeleton = Array.from({ length: 6 });

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.service.list().subscribe({
      next: (arr) => {
        const norm = arr.map((m: any) => ({
          id: m.id,
          numero: m.numero ?? m.table_number ?? m.id,
          code: m.code ?? m.label ?? `M-${m.id}`,
          status: String(m.status ?? m.estado ?? 'LIVRE').toUpperCase() as MesaStatus,
        }));
        this.mesas.set(norm);
        this.loading.set(false);
        this.now = new Date().toLocaleTimeString();
      },
      error: () => this.loading.set(false),
    });
  }

  doRefresh(ev: CustomEvent) {
    this.service.list().subscribe({
      next: (arr) => {
        const norm = arr.map((m: any) => ({
          id: m.id,
          numero: m.numero ?? m.table_number ?? m.id,
          code: m.code ?? m.label ?? `M-${m.id}`,
          status: String(m.status ?? m.estado ?? 'LIVRE').toUpperCase() as MesaStatus,
        }));
        this.mesas.set(norm);
        (ev.target as any).complete();
      },
      error: () => (ev.target as any).complete(),
    });
  }

  onFilterChange() { }

  filtered = computed(() => {
    const term = this.q.trim().toLowerCase();
    return this.mesas().filter((m) => {
      const bySeg = this.segment === 'ALL' ? true : m.status === this.segment;
      const byTerm = !term ? true : (`${m.numero ?? m.code}`.toLowerCase().includes(term));
      return bySeg && byTerm;
    });
  });

  toggle(m: Mesa) {
    const prev = m.status;
    const next: MesaStatus = prev === 'LIVRE' ? 'OCUPADA' : 'LIVRE';
    m.status = next; // otimista
    this.service.setStatus(m.id, next).subscribe({
      error: () => (m.status = prev),
    });
  }

  openQr() {
    alert('Leitor de QR em breve 🤳');
  }
}
