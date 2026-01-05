import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/authorisation';

export const authorisationGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const allowedRoles = route.data['roles'] as string[];
  return authService.canAccessRoute(allowedRoles);
};
