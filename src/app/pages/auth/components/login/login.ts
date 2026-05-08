import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { AuthService } from '../../../../services/auth';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginResponse = signal('');

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute) { }

  login(): void {
    this.loginResponse.set('');
    const data = this.loginForm.value;

    this.auth.login(data).subscribe({
      next: (response: HttpResponse<any>) => {
        if (response.status === 200 || response.status === 201) {
          this.loginResponse.set('connected');
          this.router.navigateByUrl(this.route.snapshot.queryParamMap.get('returnUrl') ?? '/cars');
        }
      },
      error: (error: HttpErrorResponse) => {
        this.loginResponse.set('error');
        console.log('Login or session check failed', error);
      }
    })
  }
}
