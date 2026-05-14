import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const managerGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const user = auth.getUser();
  if (auth.isLoggedIn() && user?.role === 'admin_restaurant') return true;
  router.navigate(['/']);
  return false;
};