import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  private apiUrl = 'http://localhost:8000/api/pedidos/';

  constructor(private http: HttpClient) {}

  getPedidos(mesaId?: number): Observable<any> {
    let url = this.apiUrl;
    if (mesaId) {
      url += `?mesa_id=${mesaId}`;
    }
    return this.http.get(url);
  }
}
