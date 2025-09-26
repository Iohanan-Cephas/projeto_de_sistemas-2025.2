import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = environment.api;

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post<{access:string; refresh:string}>(`${this.base}/auth/token/`, { username, password });
  }
  refresh(refresh: string) {
    return this.http.post<{access:string; refresh?:string}>(`${this.base}/auth/token/refresh/`, { refresh });
  }
  me() {
    return this.http.get(`${this.base}/users/me/`);
  }

  saveTokens(a: string, r: string) { localStorage.setItem('access', a); localStorage.setItem('refresh', r); }
  clearTokens() { localStorage.removeItem('access'); localStorage.removeItem('refresh'); }
  get refreshToken() { return localStorage.getItem('refresh'); }
}
