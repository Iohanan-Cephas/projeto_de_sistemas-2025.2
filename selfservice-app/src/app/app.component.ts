import { Component, inject } from '@angular/core';
import {
  IonApp,
  IonRouterOutlet,
  IonMenu,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonMenuToggle,
  IonButtons,
  IonButton,
  IonIcon,
  IonHeader,
  IonToolbar,
  IonTitle
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    IonApp, IonRouterOutlet, IonMenu, IonContent, IonList, IonItem, IonLabel,
    IonMenuToggle, IonButtons, IonButton, IonIcon, IonHeader, IonToolbar, IonTitle
  ],
  styles: [`
    :host{
      /* paleta fixa do app: preto/branco/cinza */
      --ga-bg:#0b0c0d;          /* fundo principal do app */
      --ga-fg:#ffffff;          /* texto primário */
      --ga-muted:#a7abb3;       /* texto secundário */
      --ga-border:#1b1e22;      /* linhas sutis */
      --ga-soft:#8e949c;        /* auxiliar */
      --no-blue:#dcdfe4;        /* foco neutro */
    }

    /* ===== MENU LATERAL ===== */
    .menu-root{
      --width: 300px;
      --ion-background-color: var(--ga-bg);   /* <<< mesma cor do app */
      --background: var(--ga-bg);             /* garante compat iOS/Android */
      --backdrop-opacity: .3;
      border-right: 1px solid var(--ga-border);
    }

    .menu-content::part(scroll){
      background: var(--ga-bg);               /* <<< sem gradiente, sem “vidro” */
      color: var(--ga-fg);
      padding: 10px 10px 14px;
    }

    /* Cabeçalho do menu (simples, sem brilho) */
    .menu-header{
      display:flex; align-items:center; gap:12px;
      padding: 8px 6px 10px 6px;
      margin-bottom: 6px;
      border-bottom: 1px solid var(--ga-border);
    }
    .avatar{
      width: 52px; height: 52px; border-radius: 50%;
      display:grid; place-items:center;
      font-weight: 800; font-size: 18px; color:#fff;
      background:#0f1113; border: 1px solid var(--ga-border);
    }
    .user h2{ margin:0; color:#fff; font-size:16px; font-weight:800; }
    .user p{ margin:2px 0 0; color: var(--ga-muted); font-size:12px; }

    /* Título da seção (discreto) */
    .section{
      margin: 10px 6px 6px;
      color: var(--ga-soft);
      font-size: 11px;
      letter-spacing: .14em;
      text-transform: uppercase;
    }

    /* Lista de navegação */
    .menu-list{
      padding: 4px 2px;
    }
    .menu-item{
      --background: transparent;                  /* fundo sempre igual */
      --color: var(--ga-fg);
      --padding-start: 14px;
      --inner-padding-end: 10px;
      --min-height: 46px;
      --ripple-color: rgba(255,255,255,.12);      /* sem azul */
      --highlight-color-focused: var(--no-blue);  /* sem azul */
      position: relative;
      margin: 6px 6px;
      border-radius: 12px;
    }
    /* linha sutil para separar, sem “cards brancos” */
    .menu-item::after{
      content:""; position:absolute; left:14px; right:10px; bottom:-6px; height:1px;
      background: var(--ga-border);
      opacity:.6;
    }
    .menu-item:last-child::after{ display:none; }

    /* indicador do item ativo: barra esquerda */
    .menu-item.active{
      background: transparent;
    }
    .menu-item.active::before{
      content:""; position:absolute; left:0; top:8px; bottom:8px; width:3px;
      background:#fff; border-radius: 2px;
    }

    .ico{
      width: 24px; display:inline-grid; place-items:center; margin-right:10px;
      color:#fff; opacity:.95;
    }
    .label{
      display:flex; align-items:center; gap:0;
      font-weight:700; letter-spacing:.2px;
    }

    /* Rodapé (logout) */
    .menu-footer{
      margin-top: 12px; padding: 10px 6px 14px;
      border-top: 1px solid var(--ga-border);
    }
    .logout{
      --background: transparent;
      --padding-start: 14px;
      --min-height: 46px;
      --color: var(--ga-fg);
      --ripple-color: rgba(255,255,255,.12);
      --highlight-color-focused: var(--no-blue);
      border-radius: 12px;
      margin: 0 6px;
    }

    /* ===== CABEÇALHO GLOBAL (fora do menu) – opcional, mantém coeso se usado aqui */
    .app-header ion-toolbar{
      --background: var(--ga-bg);
      --border-color: var(--ga-bg);
      --color: var(--ga-fg);
    }
  `],
  template: `
    <ion-app>
      <!-- MENU LATERAL -->
      <ion-menu side="start" contentId="main" class="menu-root">
        <ion-content class="menu-content">
          <div class="menu-header">
            <div class="avatar">{{ initials }}</div>
            <div class="user">
              <h2>{{ username }}</h2>
              <p>Bem-vindo(a)</p>
            </div>
          </div>

          <div class="section">Navegação</div>
          <ion-list class="menu-list" inset="true" lines="none">
            <ion-menu-toggle auto-hide="true">
              <ion-item
                button
                detail="false"
                class="menu-item"
                [class.active]="isActive('/home')"
                (click)="go('/home')">
                <ion-label class="label">
                  <span class="ico">
                    <ion-icon name="home-outline"></ion-icon>
                  </span>
                  Página Inicial
                </ion-label>
              </ion-item>
            </ion-menu-toggle>

            <ion-menu-toggle auto-hide="true">
              <ion-item
                button
                detail="false"
                class="menu-item"
                [class.active]="isActive('/mesas')"
                (click)="go('/mesas')">
                <ion-label class="label">
                  <span class="ico">
                    <ion-icon name="albums-outline"></ion-icon>
                  </span>
                  Mesas Livres
                </ion-label>
              </ion-item>
            </ion-menu-toggle>

            <ion-menu-toggle auto-hide="true">
              <ion-item
                button
                detail="false"
                class="menu-item"
                [class.active]="isActive('/cardapio')"
                (click)="go('/cardapio')">
                <ion-label class="label">
                  <span class="ico">
                    <ion-icon name="restaurant-outline"></ion-icon>
                  </span>
                  Cardápio
                </ion-label>
              </ion-item>
            </ion-menu-toggle>
          </ion-list>

          <div class="menu-footer">
            <ion-item button detail="false" class="logout" (click)="logout()">
              <ion-label class="label">
                <span class="ico">
                  <ion-icon name="log-out-outline"></ion-icon>
                </span>
                Desconectar
              </ion-label>
            </ion-item>
          </div>
        </ion-content>
      </ion-menu>

      <!-- HEADER GLOBAL (se quiser usar em páginas que não têm header próprio) -->
      <!--
      <ion-header class="app-header">
        <ion-toolbar>
          <ion-title>Gest Aly</ion-title>
        </ion-toolbar>
      </ion-header>
      -->

      <!-- CONTEÚDO PRINCIPAL -->
      <ion-router-outlet id="main"></ion-router-outlet>
    </ion-app>
  `
})
export class AppComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private menu = inject(MenuController);

  get username() {
    return this.auth.currentUserName ?? 'Usuário';
  }

  get initials() {
    const name = (this.username || 'Usuário').trim();
    const parts = name.split(/\s+/);
    return (parts[0]?.[0] ?? 'U').toUpperCase() + (parts[1]?.[0] ?? '').toUpperCase();
  }

  isActive(path: string) {
    return this.router.url === path;
  }

  async go(path: string) {
    await this.menu.close();
    await this.router.navigateByUrl(path, { replaceUrl: true });
  }

  async logout() {
    await this.menu.close();
    this.auth.logout?.();
    await this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
