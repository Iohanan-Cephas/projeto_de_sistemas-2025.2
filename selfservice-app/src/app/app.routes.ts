// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  // rota inicial -> login
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  // Auth
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./features/auth/login.page').then(m => m.LoginPage),
  },

  // Home (protegida)
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/home/home.page').then(m => m.HomePage),
  },

  // Restaurante (container com tabs) + rotas filhas
  {
    path: 'restaurant/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/restaurant/restaurant.page').then(m => m.RestaurantPage),
    children: [
      { path: '', redirectTo: 'menu', pathMatch: 'full' },
      {
        path: 'menu',
        loadComponent: () =>
          import('./features/restaurant/menu/menu.page').then(m => m.MenuPage),
      },
      {
        path: 'reserve',
        loadComponent: () =>
          import('./features/restaurant/reserve/reserve.page').then(m => m.ReservePage),
      },
    ],
  },

  // fallback
  { path: '**', redirectTo: 'auth/login' },
];
