/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, UrlTree } from '@angular/router';

import { Observable } from 'rxjs';
import { AuthenticationService, PermissionService } from '../_services';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    private authService: AuthenticationService,
    private permissionService: PermissionService,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const url: string = state.url;
    return this.validateUser(next, url);
  }
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(next, state);
  }
  validateUser(route: ActivatedRouteSnapshot, url: any): boolean {
    if (this.authService.isLoggedIn()) {
      if (route.data['permission']) {
        if (this.permissionService.hasPermission(route.data['permission'])) {
          return true;
        } else {
          this.router.navigate(['/dashboard']);
          return false;
        }
      }
      return true;
    }
    this.router.navigate(['/login'], { queryParams: { 'returnUrl': url } });
    return false;
  }
}
