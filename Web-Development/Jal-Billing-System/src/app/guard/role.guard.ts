import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService {
  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const userRole = localStorage.getItem('userRole');
    const allowedRoles = route.data['roles'] as Array<string>;

    // For report route, only allow SUPERADMIN
    if (route.routeConfig?.path === 'report') {
      if (userRole !== 'SUPER_ADMIN') {
        this.router.navigate(['/unauthorized']);
        return false;
      }
    }

    if (!userRole || !allowedRoles.includes(userRole)) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }
}
