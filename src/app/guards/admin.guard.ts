import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const user = auth.getUser(); // Implémentez cette méthode dans AuthService
  if (auth.isLoggedIn() && user?.role === 'super_admin') return true;
  router.navigate(['/']);
  return false;
};