import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = environment.api;
  constructor(private http: HttpClient) {}

  getMenu(restaurantSlug: string) {
    return this.http.get(`${this.base}/catalog/${restaurantSlug}/menu/`);
  }
  createOrder(payload: any) {
    return this.http.post(`${this.base}/orders/`, payload);
  }
  getOrderStatus(id: number) {
    return this.http.get(`${this.base}/orders/${id}/status/`);
  }
}
