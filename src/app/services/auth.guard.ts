import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    // Ritorna la rotta corrente → la navigazione viene annullata
    // e l'utente rimane esattamente dove si trova
    return router.createUrlTree([router.url]);
  }

  return true;
};
