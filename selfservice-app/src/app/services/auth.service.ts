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

  private storageKey = 'auth';


  get accessToken()  { return this._access; }
  get refreshToken() { return this._refresh; }
  get currentUserName() { return this._name; }


  constructor(private http: HttpClient) {
    // Restaurar do localStorage ao iniciar
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        this._access = data.access || null;
        this._refresh = data.refresh || null;
        this._name = data.name || null;
      } catch {}
    }
  }


  login(username: string, password: string) {
    return this.http.post<JwtLoginResponse>(`${environment.apiBase}/api/auth/login/`, { username, password })
      .pipe(
        tap(res => {
          this._access = res.access;
          this._refresh = res.refresh;
          this._name = username;
          // Salvar no localStorage
          localStorage.setItem(this.storageKey, JSON.stringify({
            access: this._access,
            refresh: this._refresh,
            name: this._name
          }));
        }),
        map(() => true)
      );
  }


  // Limpa tokens e nome do usuário do localStorage e memória
  logout() {
    this._access = null;
    this._refresh = null;
    this._name = null;
    localStorage.removeItem(this.storageKey);
  }

  tryRefresh() {
    if (!this._refresh) return null;
    return this.http.post<JwtLoginResponse>(`${environment.apiBase}/api/auth/refresh/`, {
      refresh: this._refresh
    }).pipe(
      tap(res => { this._access = res.access; })  // refresh pode retornar só access
    );
  }
}
