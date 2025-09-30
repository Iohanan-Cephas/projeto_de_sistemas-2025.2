import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { finalize, take } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email = '';
  password = '';
  remember = true;
  loading = false;
  showPw = false; // <-- controla o olho do input de senha

  constructor(
    private auth: AuthService,
    private router: Router,
    private toast: ToastController
  ) {}

  // validação mínima (8+ chars na senha como pedimos no projeto)
  get isValid(): boolean {
    return !!this.email?.trim() && !!this.password && this.password.length >= 8;
  }

  async presentToast(message: string, color: 'success' | 'danger' | 'medium' = 'medium') {
    const t = await this.toast.create({ message, duration: 1600, color });
    await t.present();
  }

  submit() {
    if (!this.isValid || this.loading) return;

    this.loading = true;

    this.auth
      .login(this.email.trim(), this.password)
      .pipe(take(1), finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          // opcional: persistir "remember me"
          if (!this.remember) {
            // se não quiser manter sessão quando desmarcado
            // apenas um exemplo; ajuste conforme sua regra
            // localStorage.removeItem('access');
          }
          this.router.navigateByUrl('/home', { replaceUrl: true });
        },
        error: async (err) => {
          const msg = err?.message || 'Login inválido';
          await this.presentToast(msg, 'danger');
        },
      });
  }

  goRegister() {
    // ajuste a rota quando a página de cadastro existir
    this.router.navigateByUrl('/auth/register');
  }

  forgotPassword() {
    // placeholder até existir a tela/fluxo
    this.presentToast('Recuperação de senha em breve', 'medium');
  }
}
