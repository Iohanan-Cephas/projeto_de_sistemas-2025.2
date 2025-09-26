import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, map } from 'rxjs';

export type MesaStatus = 'LIVRE' | 'OCUPADA';

export interface Mesa {
  id: number;
  label: string;      // ex: "MESA-05"
  status: MesaStatus; // 'LIVRE' | 'OCUPADA'
}

@Injectable({ providedIn: 'root' })
export class MesaService {
  private base = environment.api; // ex.: http://localhost:8000/api

  constructor(private http: HttpClient) {}

  list(): Observable<Mesa[]> {
    return this.http.get<any[]>(`${this.base}/mesas/`).pipe(
      map((arr) =>
        (arr ?? []).map((m: any) => {
          const rawStatus: string =
            (m.status ?? m.estado ?? 'LIVRE') as string;

          const status = (rawStatus.toUpperCase() === 'OCUPADA'
            ? 'OCUPADA'
            : 'LIVRE') as MesaStatus;

          return {
            id: Number(m.id),
            label: String(m.label ?? m.code ?? `MESA-${m.id}`),
            status,
          } as Mesa;
        })
      )
    );
  }

  setStatus(id: number, status: MesaStatus): Observable<Mesa> {
    return this.http.patch<Mesa>(`${this.base}/mesas/${id}/`, { status });
  }
}

