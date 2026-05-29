import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/** Protegge le route private (es. /home): se non loggato rimanda a /login */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    return true;
  }
  return router.createUrlTree(['/login']);
};

/** Blocca le route pubbliche (login / register / presentazione) se già loggato: rimanda a /home */
export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    return router.createUrlTree(['/home']);
  }
  return true;
};
