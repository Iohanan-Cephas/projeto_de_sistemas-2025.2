// mobile/src/app/pages/mesas/mesas.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Mesa, MesaService, MesaStatus } from '../../services/mesa.service';

@Component({
  selector: 'app-mesas',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './mesas.page.html',
  styleUrls: ['./mesas.page.scss'],
})
export class MesasPage implements OnInit {
  mesas: Mesa[] = [];
  loading = false;
  filter: 'ALL' | MesaStatus = 'ALL';

  // readonly para S2933
  constructor(
    private readonly mesaSvc: MesaService,
    private readonly toast: ToastController
  ) {}

  ngOnInit(): void { this.load(); }

  load(event?: any): void {
    this.loading = true;
    this.mesaSvc.list().subscribe({
      next: (data) => {
        this.mesas = data;
        this.loading = false;
        event?.target?.complete?.();
      },
      error: () => {
        this.loading = false;
        event?.target?.complete?.();
        this.toast.create({
          message: 'Erro ao carregar mesas',
          duration: 1800,
          color: 'danger'
        }).then(t => t.present());
      }
    });
  }

  get filtered(): Mesa[] {
    if (this.filter === 'ALL') return this.mesas;
    return this.mesas.filter(m => m.status === this.filter);
  }

  // remove async para não retornar Promise (S6544)
  toggle(m: Mesa): void {
    const prev = m.status;
    m.status = prev === 'LIVRE' ? 'OCUPADA' : 'LIVRE'; // UI otimista

    this.mesaSvc.setStatus(m.id, m.status).subscribe({
      next: () => {
        this.toast.create({
          message: `Mesa ${m.label} agora: ${m.status === 'LIVRE' ? 'Livre' : 'Ocupada'}`,
          duration: 1200
        }).then(t => t.present());
      },
      error: () => {
        m.status = prev; // rollback
        this.toast.create({
          message: 'Falha ao alterar estado',
          duration: 1800,
          color: 'danger'
        }).then(t => t.present());
      }
    });
  }

  // idem: não retornar Promise
  readQr(): void {
    this.toast.create({ message: 'Ler QR Code (em breve)', duration: 1200 })
      .then(t => t.present());
  }
}
