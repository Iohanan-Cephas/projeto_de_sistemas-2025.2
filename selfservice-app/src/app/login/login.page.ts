import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonItem, IonButton,
  IonList, IonSpinner, IonToast, IonText, IonIcon
} from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { finalize } from 'rxjs/operators';
import { NgZone } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    CommonModule, ReactiveFormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonItem, IonButton,
    IonList, IonSpinner, IonToast, IonText, IonIcon
  ],
  styles: [`
    .wrap {
      min-height: 100%;
      display: grid;
      place-items: center;
      padding: 24px;
    }
    .login-card {
      width: 100%;
      max-width: 420px;
      padding: 28px 22px;
    }
    .brand {
      display: flex; align-items: center; gap: 10px; margin-bottom: 14px;
    }
    .brand .logo {
      width: 44px; height: 44px; border-radius: 12px;
      background: linear-gradient(135deg, var(--ion-color-primary), var(--ion-color-tertiary));
      display: grid; place-items: center; color: white; font-weight: 800;
    }
    .title {
      font-size: 22px; font-weight: 800;
      background: linear-gradient(90deg, #fff, var(--ion-color-secondary));
      -webkit-background-clip: text; background-clip: text; color: transparent;
    }
    .hint { color: var(--ion-color-medium); margin-bottom: 18px; }
    .submit { margin-top: 6px; }
  `],
  template: `
  <ion-content class="wrap">
    <div class="card login-card">
      <div class="brand">
        <div class="logo">SS</div>
        <div>
          <div class="title">SelfService</div>
          <ion-text class="hint">Acesse para gerenciar mesas</ion-text>
        </div>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <ion-list class="card" style="padding:10px">
          <ion-item lines="none" class="card" style="margin-bottom:10px">
            <ion-input label="Usuário" labelPlacement="floating" formControlName="username" autocomplete="username"></ion-input>
          </ion-item>
          <ion-item lines="none" class="card">
            <ion-input type="password" label="Senha" labelPlacement="floating" formControlName="password" autocomplete="current-password"></ion-input>
          </ion-item>
        </ion-list>

        <ion-button expand="block" type="submit" class="btn-pill submit"
          [disabled]="form.invalid || loading">
          <ng-container *ngIf="!loading; else loadTpl">Entrar</ng-container>
        </ion-button>
        <ng-template #loadTpl><ion-spinner></ion-spinner></ng-template>
      </form>

      <ion-text class="hint" style="display:block; text-align:center; margin-top:12px;">
        Cores mais vivas, experiência leve. ✨
      </ion-text>

      <ion-toast [isOpen]="error" message="Falha no login" duration="2000" (didDismiss)="error=false"></ion-toast>
    </div>
  </ion-content>
  `
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private zone = inject(NgZone);            // ✅ injeta a NgZone

  loading = false;
  error = false;

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;

    const { username, password } = this.form.value;
    this.auth.login(String(username), String(password))
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          // ✅ garante que a navegação rode dentro do ciclo do Angular
          this.zone.run(() => {
            this.router.navigateByUrl('/home', { replaceUrl: true });
          });
        },
        error: () => { this.error = true; }
      });
  }
}
