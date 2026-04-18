import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Api } from '../../services/api';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  signupReponse: string = '';

  signupForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    name: new FormControl('', Validators.required),
    surname: new FormControl('', Validators.required),
    birthday: new FormControl('', Validators.required)
  });

  constructor(private apiService: Api) {}

signup(): void {
  if (this.signupForm.invalid) {
    return;
  }

  const data = this.signupForm.value;

    this.apiService.signup(data).subscribe({
    next: (response) => {
       if (response.status === 201) {
        this.signupReponse = 'accepted';
    }
   },
    error: (error) => {
        this.signupReponse = 'error';
        console.log(error);
    }
   })
}
}
