import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from './auth';

export const loggedInGuard: CanActivateFn = (_, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.loggedIn()) {
    return true;
  }

  return auth.loadSession().pipe(
    map((user) => {
      if (user) {
        return true;
      }

      return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
    }),
  );
};
