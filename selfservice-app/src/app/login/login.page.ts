import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class LoginPage {
  email: string = '';
  password: string = '';
  remember: boolean = false;

  constructor(private router: Router) {}

  login() {
    console.log('Email:', this.email);
    console.log('Password:', this.password);
    console.log('Remember:', this.remember);

    // Exemplo: redireciona para Home
    this.router.navigate(['/home']);
  }

  forgotPassword() {
    console.log('Esqueceu a senha clicado!');
  }
}
