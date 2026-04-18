import { Routes } from '@angular/router';
import { Auth } from './pages/auth/auth';

export const routes: Routes = [
    {
        path: 'login',
        component: Auth,
        data: { for: 'login'}
    },
    {
        path: 'signup',
        component: Auth,
        data: { for: 'signup'}
    }
];
