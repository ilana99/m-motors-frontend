import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { Api } from './api';

export const loggedInGuard: CanActivateFn = (_, state) => {
  const api = inject(Api);
  const router = inject(Router);

  return api.me().pipe(
    map((response) => {
      if (response.body?.role === 'user') {
        return true;
      }

      return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
    }),
    catchError(() => of(router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } }))),
  );
};
