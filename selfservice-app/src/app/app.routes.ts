import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./login/login.page').then(m => m.LoginPage) },
  { path: 'home',  loadComponent: () => import('./home/home.page').then(m => m.HomePage) },
  { path: 'atendente', loadComponent: () => import('./atendente/atendente.page').then(m => m.AtendentePage) },
];

