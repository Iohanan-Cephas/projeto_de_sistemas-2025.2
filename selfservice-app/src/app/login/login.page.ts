import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonContent, IonInput, IonItem, IonButton, IonList,
  IonSpinner, IonToast, IonText, IonIcon
} from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { finalize } from 'rxjs/operators';
import { NgZone } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    CommonModule, ReactiveFormsModule,
    IonContent, IonInput, IonItem, IonButton, IonList,
    IonSpinner, IonToast, IonText, IonIcon
  ],
  styles: [`
    :host {
      --ga-bg: #0b0c0d;
      --ga-bg-2: #0e1012;
      --ga-card: rgba(20,22,24,0.72);
      --ga-border: #24272b;
      --ga-fg: #ffffff;
      --ga-muted: #b6bac1;
      --ga-soft: #8e949c;
      --ga-white-10: rgba(255,255,255,.10);
      --ga-white-06: rgba(255,255,255,.06);
    }

    ion-content.hero::part(scroll) {
      min-height: 100dvh; display: grid; place-items: center;
      background:
        radial-gradient(900px 480px at 85% -10%, rgba(255,255,255,0.08), transparent 60%),
        radial-gradient(700px 360px at -10% 110%, rgba(255,255,255,0.06), transparent 65%),
        linear-gradient(120deg, var(--ga-bg), var(--ga-bg-2));
      padding: 22px; position: relative; overflow: hidden;
    }
    ion-content.hero::before {
      content:""; position:absolute; inset:0 42% 0 0;
      background:
        linear-gradient(0deg, var(--ga-white-06), var(--ga-white-06)) padding-box,
        linear-gradient(180deg, rgba(255,255,255,.18), rgba(255,255,255,0)) border-box;
      border-right: 1px solid var(--ga-white-10);
      mask-image: linear-gradient(180deg, transparent, black 8%, black 92%, transparent);
      pointer-events:none;
    }

    .wrap { width:100%; max-width:980px; display:grid; grid-template-columns:1.1fr 1fr; gap:28px; align-items:center; }
    @media (max-width:900px){ .wrap{ grid-template-columns:1fr } ion-content.hero::before{ inset:0; opacity:.05 } }

    .hero-copy { color:var(--ga-fg); padding:10px 4px; }
    .kicker { display:inline-block; letter-spacing:.18em; text-transform:uppercase; font-size:11px; color:var(--ga-soft);
      border:1px solid var(--ga-white-10); padding:6px 10px; border-radius:999px; margin-bottom:12px; backdrop-filter:blur(2px);}
    .headline { font-size:clamp(32px,6.5vw,56px); line-height:.98; font-weight:900; letter-spacing:-.02em; margin:6px 0 10px; color:#fff;}
    .sub { color:var(--ga-muted); max-width:46ch; font-size:14px; }

    .card { color:var(--ga-fg); background:var(--ga-card); border:1px solid var(--ga-border); border-radius:18px; padding:26px 22px;
      backdrop-filter:blur(6px); box-shadow:0 18px 55px rgba(0,0,0,.45); }
    .brand { display:flex; align-items:center; gap:14px; margin-bottom:12px; }
    .emblem { width:62px; height:62px; border-radius:50%; display:grid; place-items:center; position:relative; background:#0c0e10; border:1px solid var(--ga-border);}
    .emblem::before, .emblem::after { content:""; position:absolute; inset:6px; border-radius:50%; border:1px solid var(--ga-white-10); }
    .emblem::after { inset:12px; }
    .title { font-weight:800; font-size:18px; }
    .muted { color:var(--ga-soft); font-size:12px; margin-top:2px; }

    ion-list.card-inner { background:transparent; border:1px solid var(--ga-border); border-radius:14px; padding:6px; margin:16px 0 8px; }
    ion-item{
      --background:transparent; --color:var(--ga-fg); --border-color:var(--ga-border);
      --highlight-color-focused:#dcdfe4;           /* foco neutro (sem azul) */
      --ripple-color:rgba(255,255,255,.12);        /* ripple neutro */
      border-radius:10px; margin:6px;
    }
    ion-input::part(native){ color:var(--ga-fg); caret-color:#ffffff; }  /* caret branco */
    ion-input::part(label){ color:var(--ga-soft); }
    .error{ color:#ff8a8a; font-size:12px; margin:2px 12px 0; }

    .actions{ display:grid; gap:10px; margin-top:12px; }
    .btn-primary{
      --background:#ffffff; --color:#0b0c0d; --background-activated:#e9e9e9; --background-focused:#f2f2f2;
      --ripple-color:rgba(0,0,0,.12); --border-radius:999px; height:48px; font-weight:800; letter-spacing:.02em;
    }
    .btn-outline{
      --background:transparent; --color:#ffffff; --ripple-color:rgba(255,255,255,.12);
      --border-radius:999px; height:46px; font-weight:700; border:1px solid var(--ga-border);
    }
    .links{ display:flex; justify-content:center; gap:18px; margin-top:10px; color:var(--ga-muted); font-size:13px; }
    .links a{ color:#fff; text-decoration:underline; text-underline-offset:2px; }

    /* divisor "ou" + social */
    .divider{ display:flex; align-items:center; gap:12px; margin:16px 8px 8px; color:var(--ga-soft); font-size:12px; }
    .divider::before, .divider::after{ content:""; flex:1; height:1px; background:var(--ga-border); }
    .social{ display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:8px; }
    .btn-social{
      --background:#111315; --color:#fff; --ripple-color:rgba(255,255,255,.12);
      border:1px solid var(--ga-border); border-radius:12px; height:44px; display:flex; align-items:center; justify-content:center;
    }
    .btn-social svg{ width:18px; height:18px; color:#fff; }
  `],
  template: `
    <ion-content [fullscreen]="true" class="hero">
      <div class="wrap">
        <!-- Hero -->
        <section class="hero-copy" aria-label="Apresentação">
          <span class="kicker">gest aly</span>
          <h1 class="headline">O jeito mais elegante de pedir.</h1>
          <p class="sub">Cardápio digital, pedidos rápidos e uma experiência preto-e-branco focada no serviço.</p>
        </section>

        <!-- Card -->
        <section class="card" aria-label="Acesso">
          <div class="brand">
            <div class="emblem" aria-hidden="true">
              <svg viewBox="0 0 64 64" fill="none">
                <path d="M22 42c7 4 18 1 18-10 0-9-9-12-16-9" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
                <path d="M38 18v28m0-14h8" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
              </svg>
            </div>
            <div>
              <div class="title">Entrar</div>
              <div class="muted">Acesse sua conta para continuar</div>
            </div>
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <ion-list class="card-inner">
              <ion-item lines="inset">
                <ion-input
                  type="email"
                  label="E-mail"
                  labelPlacement="floating"
                  formControlName="email"
                  autocomplete="email"
                  inputmode="email">
                </ion-input>
              </ion-item>
              <div *ngIf="form.get('email')?.touched && form.get('email')?.invalid" class="error">
                Informe um e-mail válido.
              </div>

              <ion-item lines="inset">
                <ion-input
                  type="password"
                  label="Senha"
                  labelPlacement="floating"
                  formControlName="password"
                  autocomplete="current-password">
                </ion-input>
              </ion-item>
              <div *ngIf="form.get('password')?.touched && form.get('password')?.invalid" class="error">
                Informe a senha.
              </div>
            </ion-list>

            <div class="actions">
              <ion-button expand="block" type="submit" class="btn-primary" [disabled]="form.invalid || loading">
                <ng-container *ngIf="!loading; else loadTpl">Entrar</ng-container>
              </ion-button>

              <ion-button expand="block" class="btn-outline" (click)="goRegister()" [disabled]="loading" fill="clear">
                Criar Conta
              </ion-button>
            </div>

            <div class="links">
              <a (click)="goForgot()">Esqueci minha senha</a>
            </div>

            <!-- divisor -->
            <div class="divider" aria-hidden="true">ou</div>

            <!-- social (ícones apenas) -->
            <div class="social" aria-label="Entrar com redes sociais">
              <ion-button class="btn-social" (click)="loginWith('google')" fill="clear" aria-label="Entrar com Google">
                <!-- Ícone Google monocromático -->
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M21.6 12.23c0-.74-.07-1.44-.21-2.12H12v4.01h5.41a4.63 4.63 0 0 1-2 3.04v2.52h3.24c1.9-1.75 2.95-4.33 2.95-7.45Z" fill="#fff"/>
                  <path d="M12 22c2.7 0 4.97-.9 6.63-2.42l-3.24-2.52c-.9.6-2.05.96-3.39.96-2.6 0-4.8-1.76-5.58-4.12H3.05v2.6A10 10 0 0 0 12 22Z" fill="#fff" opacity=".75"/>
                  <path d="M6.42 13.9A6.01 6.01 0 0 1 6.1 12c0-.66.11-1.3.32-1.9V7.5H3.05A10 10 0 0 0 2 12c0 1.6.38 3.12 1.05 4.5l3.37-2.6Z" fill="#fff" opacity=".55"/>
                  <path d="M12 6.02c1.47 0 2.79.51 3.83 1.5l2.87-2.87A9.98 9.98 0 0 0 12 2 10 10 0 0 0 3.05 7.5l3.37 2.6C7.2 7.73 9.4 6.02 12 6.02Z" fill="#fff" opacity=".35"/>
                </svg>
              </ion-button>

              <ion-button class="btn-social" (click)="loginWith('facebook')" fill="clear" aria-label="Entrar com Facebook">
                <!-- Ícone Facebook monocromático -->
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M14.5 8.5V6.9c0-.7.5-1.3 1.2-1.3h1.3V3h-2.2C12.8 3 12 4.5 12 6.6v1.9H10v2.6h2v7h2.5v-7h2l.3-2.6h-2.3Z" fill="#fff"/>
                </svg>
              </ion-button>
            </div>

            <ng-template #loadTpl><ion-spinner></ion-spinner></ng-template>
          </form>

          <ion-toast [isOpen]="error"
                     message="Falha no login. Verifique suas credenciais."
                     duration="2200"
                     (didDismiss)="error=false">
          </ion-toast>
        </section>
      </div>
    </ion-content>
  `
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private zone = inject(NgZone);

  loading = false;
  error = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    const { email, password } = this.form.value;
    this.auth.login(String(email), String(password))
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => this.zone.run(() =>
          this.router.navigateByUrl('/home', { replaceUrl: true })
        ),
        error: () => { this.error = true; }
      });
  }

  goRegister() { this.router.navigateByUrl('/register'); }
  goForgot()   { this.router.navigateByUrl('/forgot-password'); }

  loginWith(provider: 'google' | 'facebook') {
    // placeholder: implementaremos OAuth depois
    console.log('login social:', provider);
  }
}
