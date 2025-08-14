import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const isLoggedIn = this.authService.isLoggedIn();
    const loginRole = this.authService.getLoginRole(); // This now also works after refresh

    if (!isLoggedIn) {
      // Not logged in → redirect to login page
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    // Check if route has role restrictions
    const allowedRoles = route.data['roles'] as Array<'owner' | 'tenant'>;
    if (allowedRoles && loginRole && !allowedRoles.includes(loginRole)) {
      // Role not allowed → redirect to home or tenant page
      this.router.navigate(['/home']);
      return false;
    }

    return true; // Authorized
  }
}
