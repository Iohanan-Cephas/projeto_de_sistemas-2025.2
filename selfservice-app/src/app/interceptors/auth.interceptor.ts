// src/app/interceptors/auth.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

let refreshing = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  // ✅ ignore login/refresh
  const isAuthRoute = /\/api\/auth\/(login|refresh)\//.test(req.url);
  if (isAuthRoute) return next(req);

  const token = auth.accessToken;
  const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && !refreshing && auth.refreshToken) {
        refreshing = true;
        const refresh$ = auth.tryRefresh();
        if (!refresh$) return throwError(() => err);

        return refresh$.pipe(
          switchMap(() => {
            refreshing = false;
            const retried = auth.accessToken
              ? req.clone({ setHeaders: { Authorization: `Bearer ${auth.accessToken}` } })
              : req;
            return next(retried);
          }),
          catchError(e => { refreshing = false; auth.logout(); return throwError(() => e); })
        );
      }
      return throwError(() => err);
    })
  );
};
