import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Supaservice } from '../service/supaservice';

export const authGuard: CanActivateFn = async () => {
  const supaservice = inject(Supaservice);
  const router = inject(Router);

  const session = await supaservice.getSession();
  if (session) {
    return true;
  }

  // Si no hi ha sessio, tornem a home (pantalla publica)
  return router.createUrlTree(['/home']);
};
