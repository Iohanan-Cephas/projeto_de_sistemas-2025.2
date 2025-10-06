import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CardapioService {
  private apiUrl = `${environment.apiBase}/api/cardapio/`;

  constructor(private http: HttpClient) {}

  getItens(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
