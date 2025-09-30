import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, map } from 'rxjs';

export interface Restaurant { id: number; name: string; rating?: number; priceTier?: 1|2|3|4; coverUrl?: string; }

@Injectable({ providedIn: 'root' })
export class RestaurantService {
  private base = environment.api;
  constructor(private http: HttpClient) {}
  search(q: string): Observable<Restaurant[]> {
    return this.http.get<any[]>(`${this.base}/restaurants/`, { params: { q } }).pipe(
      map(list => (list ?? []).map(r => ({
        id: r.id, name: r.name, rating: r.rating ?? 0, priceTier: r.price_tier ?? 2, coverUrl: r.cover_url
      })))
    );
  }
}
