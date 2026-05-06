import { Routes } from '@angular/router';
import { Auth } from './pages/auth/auth';
import { Cars } from './pages/cars/cars';
import { Profile } from './pages/profile/profile';
import { loggedInGuard } from './services/logged-in.guard';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'cars',
    },
    {
        path: 'login',
        component: Auth,
        data: { for: 'login' }
    },
    {
        path: 'signup',
        component: Auth,
        data: { for: 'signup' }
    },
    {
        path: 'cars',
        component: Cars,
    },
    {
        path: 'profil',
        component: Profile,
        canActivate: [loggedInGuard],
    },
    {
        path: '**',
        redirectTo: 'cars',
    },
];
