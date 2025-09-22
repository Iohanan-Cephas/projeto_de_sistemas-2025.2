// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'mesas', pathMatch: 'full' },
  {
    path: 'mesas',
    loadComponent: () =>
      import('./pages/mesas/mesas.page').then((m) => m.MesasPage),
  },
];