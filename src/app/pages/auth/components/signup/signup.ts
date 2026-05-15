import { Component, signal } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  signupResponse = signal('');

  signupForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    name: new FormControl('', Validators.required),
    surname: new FormControl('', Validators.required),
    birthday: new FormControl('', Validators.required)
  });

  constructor(private auth: AuthService, private router: Router) { }

  signup(): void {
    if (this.signupForm.invalid) {
      return;
    }

    this.signupResponse.set('');

    const data = this.signupForm.value;

    this.auth.signup(data).subscribe({
      next: (response: HttpResponse<any>) => {
        if (response.status === 201) {
          this.signupResponse.set('accepted');
          this.router.navigate(['/']);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.signupResponse.set('error');
        console.log(error);
      }
    })
  }
}
