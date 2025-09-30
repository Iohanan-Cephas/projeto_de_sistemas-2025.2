// src/app/core/auth.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const token = localStorage.getItem('access');
  return token ? true : inject(Router).createUrlTree(['/auth/login']);
};
