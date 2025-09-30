import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, map } from 'rxjs';

export interface MenuCategory { id: number; name: string; }
export interface MenuItem { id: number; categoryId: number; name: string; description?: string; price: number; imageUrl?: string; }

@Injectable({ providedIn: 'root' })
export class MenuService {
  private base = environment.api;
  constructor(private http: HttpClient) {}
  getCategories(restId: number): Observable<MenuCategory[]> {
    return this.http.get<any[]>(`${this.base}/restaurants/${restId}/categories/`);
  }
  getItems(restId: number, categoryId?: number): Observable<MenuItem[]> {
    const url = `${this.base}/restaurants/${restId}/menu`;
    const params: any = categoryId ? { category: categoryId } : {};
    return this.http.get<any[]>(url, { params }).pipe(
      map(list => (list ?? []).map(i => ({
        id: i.id, categoryId: i.categoryId ?? i.category_id, name: i.name,
        description: i.description, price: i.price, imageUrl: i.image_url
      })))
    );
  }
}
