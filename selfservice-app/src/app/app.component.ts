import { Component, inject } from '@angular/core';
import {
  IonApp, IonRouterOutlet, IonMenu, IonContent, IonList, IonItem, IonLabel,
  IonAvatar, IonIcon, IonMenuToggle
} from '@ionic/angular/standalone';
import { AuthService } from './services/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    IonApp, IonRouterOutlet, IonMenu, IonContent, IonList, IonItem, IonLabel,
    IonAvatar, IonIcon, IonMenuToggle, RouterLink, RouterLinkActive,
  ],
  styles: [`
    .profile-menu { --width: 300px; }

    .menu-header {
      display: flex; align-items: center; gap: 12px;
      padding: 20px 16px 12px 16px;
    }

    .avatar-lg {
      width: 56px; height: 56px; border-radius: 50%;
      display: grid; place-items: center; font-weight: 800;
      background: linear-gradient(135deg, var(--ion-color-primary), var(--ion-color-tertiary));
      color: #fff; font-size: 18px;
    }

    .user-block h2 {
      margin: 0; font-size: 16px; font-weight: 800; color: #fff;
    }
    .user-block p { margin: 2px 0 0 0; color: var(--ion-color-medium); }

    /* === Cartões brancos arredondados (itens do menu) === */
    .menu-list ion-item {
      --background: #ffffff;
      --border-radius: 16px;
      --padding-start: 14px;
      margin: 8px 10px;
      box-shadow: 0 4px 14px rgba(0,0,0,.06);
      border: 1px solid rgba(0,0,0,.04);
    }
    /* garante raio também no nativo (iOS/Safari) */
    .menu-list ion-item::part(native),
    .menu-footer ion-item::part(native) {
      border-radius: 16px;
    }

    /* item “ativo” continua arredondado */
    .menu-list ion-item.is-active {
      background: #fff;
      border: 1px solid rgba(76,111,255,.35);
      box-shadow: 0 6px 16px rgba(76,111,255,.12);
    }

    .emoji { width: 24px; display: inline-block; text-align: center; }

    .menu-footer { margin-top: auto; padding: 8px 6px 14px; }
    .menu-footer ion-item {
      --background: #ffffff;
      --border-radius: 16px;
      --padding-start: 14px;
      margin: 6px 10px;
      box-shadow: 0 4px 14px rgba(0,0,0,.06);
      border: 1px solid rgba(0,0,0,.04);
    }
  `],
  template: `
  <ion-app>
    <!-- Drawer lateral -->
    <ion-menu side="start" contentId="main" class="profile-menu">
      <ion-content>
        <div class="menu-header">
          <div class="avatar-lg">{{ initials }}</div>
          <div class="user-block">
            <h2>{{ username }}</h2>
          </div>
        </div>

        <ion-list class="menu-list" inset="true" lines="none">
          <ion-menu-toggle auto-hide="true">
            <ion-item button detail="false" (click)="go('/home')" routerDirection="root">
              <ion-label><span class="emoji">🏠</span> Página Inicial</ion-label>
            </ion-item>
          </ion-menu-toggle>

          <ion-menu-toggle auto-hide="true">
            <ion-item button detail="false" (click)="go('/mesas')" routerDirection="root">
              <ion-label><span class="emoji">🪑</span> Mesas Livres</ion-label>
            </ion-item>
          </ion-menu-toggle>
        </ion-list>

        <div class="menu-footer">
          <ion-item button detail="false" (click)="logout()">
            <ion-label><span class="emoji">⏻</span> Desconectar</ion-label>
          </ion-item>
        </div>
      </ion-content>
    </ion-menu>

    <!-- Conteúdo principal precisa do mesmo id do contentId do menu -->
    <ion-router-outlet id="main"></ion-router-outlet>
  </ion-app>
  `
})
export class AppComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private menu = inject(MenuController);

  get username() { return this.auth.currentUserName ?? 'Usuário'; }
  get initials() {
    const name = this.username.trim();
    const parts = name.split(/\s+/);
    return (parts[0]?.[0] ?? 'U').toUpperCase() + (parts[1]?.[0] ?? '').toUpperCase();
  }

  async go(path: string) {
    await this.menu.close();
    await this.router.navigateByUrl(path, { replaceUrl: true });
    setTimeout(() => window.location.reload(), 50);
  }

  logout() {
    this.menu.close();
    this.router.navigateByUrl('/login', { replaceUrl: true }).then(() => {
      window.location.reload();
    });
  }
}
