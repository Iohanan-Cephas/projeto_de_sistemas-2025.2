import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export type TableStatus = 'LIVRE' | 'OCUPADA' | 'RESERVADA';
export interface Table { id: number; code: string; seats: number; status: TableStatus; }
export interface Availability { date: string; tables: Table[]; }

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private base = environment.api;
  constructor(private http: HttpClient) {}
  getAvailability(restId: number, date: string): Observable<Availability> {
    return this.http.get<Availability>(`${this.base}/restaurants/${restId}/availability`, { params: { date } });
  }
  reserve(restId: number, tableId: number, date: string) {
    return this.http.post(`${this.base}/restaurants/${restId}/reservations/`, { tableId, date });
  }
}
