import { inject, Injectable } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  constructor(private router: Router) {}

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token; // Return true if token exists
  }
}

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthGuardService);

  if ((route.routeConfig?.path === 'login' || route.routeConfig?.path === 'register') && authService.isAuthenticated()) {
    inject(Router).navigate(['/dashboard']); // Redirect if authenticated
    return false;
  }

  if ((route.routeConfig?.path === 'dashboard' || route.routeConfig?.path === 'profile' )&& !authService.isAuthenticated()) {
    inject(Router).navigate(['/login']); // Redirect if not authenticated
    return false;
  }

  return true; // Allow access if authenticated
};
