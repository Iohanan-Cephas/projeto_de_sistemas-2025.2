// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of, delay, tap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = environment.api;

  // Deixe true enquanto não existir backend
  private readonly MOCK = true;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    if (this.MOCK) {
      const ok = email?.toLowerCase() === 'demo@demo.com' && password === '12345678';

      // ✅ sempre retorna um Observable
      return (ok
        ? of({ access: 'demo-token-123' })
        : throwError(() => new Error('Credenciais inválidas'))
      ).pipe(
        delay(400),
        tap(res => {
          // salva token fake
          localStorage.setItem('access', res.access);
        })
      );
    }

    // ✅ quando tiver backend, este ramo também RETORNA
    return this.http
      .post<any>(`${this.base}/auth/login/`, { email, password })
      .pipe(
        tap(res => localStorage.setItem('access', res?.access ?? ''))
      );
  }

  logout(): void {
    localStorage.removeItem('access');
  }
}

