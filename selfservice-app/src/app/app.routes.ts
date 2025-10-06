import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login',  loadComponent: () => import('./login/login.page').then(m => m.LoginPage) },
  { path: 'mesas',  loadComponent: () => import('./mesas/mesas.page').then(m => m.MesasPage) },
  { path: 'home',   loadComponent: () => import('./home/home.page').then(m => m.HomePage) },
  { path: 'cardapio', loadComponent: () => import('./cardapio/cardapio.page').then(m => m.CardapioPage) },
];
