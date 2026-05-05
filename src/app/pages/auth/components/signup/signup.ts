import { Component, signal } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Api } from '../../../../services/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  signupReponse = signal('');

  signupForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    name: new FormControl('', Validators.required),
    surname: new FormControl('', Validators.required),
    birthday: new FormControl('', Validators.required)
  });

  constructor(private apiService: Api, private router: Router) { }

  signup(): void {
    if (this.signupForm.invalid) {
      return;
    }

    this.signupReponse.set('');

    const data = this.signupForm.value;

    this.apiService.signup(data).subscribe({
      next: (response: HttpResponse<any>) => {
        if (response.status === 201) {
          this.router.navigate(['/'])
        }
      },
      error: (error: HttpErrorResponse) => {
        this.signupReponse.set('error');
        console.log(error);
      }
    })
  }
}
