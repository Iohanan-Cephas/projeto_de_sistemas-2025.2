// src/app/services/mesa.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';

export type MesaStatus = 'LIVRE' | 'OCUPADA' | 'RESERVADA';

@Injectable({ providedIn: 'root' })
export class MesaService {
  private base = environment.apiBase; // exemplo: http://127.0.0.1:8000

  constructor(private http: HttpClient) {}

  /**
   * Lista mesas (você usa /api/mesas/livres/ no MesasPage).
   * Se quiser **todas** as mesas, troque a URL para /api/mesas/.
   */
  list(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/api/mesas/livres/`);
  }

  /**
   * Alterna status usando os endpoints que você tem no Django:
   * - OCUPADA   -> POST /api/mesas/:id/reservar/
   * - LIVRE     -> POST /api/mesas/:id/cancelar/
   * - RESERVADA -> (a definir, se precisar)
   */
  setStatus(id: number, status: MesaStatus): Observable<any> {
    if (status === 'OCUPADA') {
      return this.http.post(`${this.base}/api/mesas/${id}/reservar/`, {});
    }
    if (status === 'LIVRE') {
      return this.http.post(`${this.base}/api/mesas/${id}/cancelar/`, {});
    }
    // fallback (se quiser tratar RESERVADA depois)
    return of(null);
  }
}
