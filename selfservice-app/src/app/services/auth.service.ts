import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

type JwtLoginResponse = { access: string; refresh: string };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _access: string | null = null;
  private _refresh: string | null = null;
  private _name: string | null = null; 

  get accessToken()  { return this._access; }
  get refreshToken() { return this._refresh; }
  get currentUserName() { return this._name; } 

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post<JwtLoginResponse>(`${environment.apiBase}/api/auth/login/`, { username, password })
      .pipe(
        tap(res => { this._access = res.access; this._refresh = res.refresh; this._name = username; }),
        map(() => true)
      );
  }

  // mantemos em memória: ao recarregar a página, perde
  logout() { this._access = null; this._refresh = null; }

  tryRefresh() {
    if (!this._refresh) return null;
    return this.http.post<JwtLoginResponse>(`${environment.apiBase}/api/auth/refresh/`, {
      refresh: this._refresh
    }).pipe(
      tap(res => { this._access = res.access; })  // refresh pode retornar só access
    );
  }
}
