import { Routes } from '@angular/router';
import { Auth } from './pages/auth/auth';
import { Cars } from './pages/cars/cars';
import { Profile } from './pages/profile/profile';
import { loggedInGuard } from './services/logged-in.guard';
import { CarDetailed } from './pages/car-detailed/car-detailed/car-detailed';

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
        path: 'cars/:id',
        component: CarDetailed,
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
