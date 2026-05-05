import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Login } from './components/login/login';
import { Signup } from './components/signup/signup';

@Component({
  selector: 'app-auth',
  imports: [Login, Signup],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class Auth {
    private activatedRoute = inject(ActivatedRoute);
  public state!: string;

   ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      this.state = data['for'];
    });
  }
}
