import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginResponse = signal('');

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  constructor(private auth: AuthService) { }

  login(): void {
    this.loginResponse.set('');
    const data = this.loginForm.value;

    this.auth.login(data).subscribe({
      next: (response) => {
        if (response.status === 200 || response.status === 201) {
          this.loginResponse.set('connected');
        }
      },
      error: (error: HttpErrorResponse) => {
        this.loginResponse.set('error');
        console.log('Login or session check failed', error);
      }
    })
  }
}
