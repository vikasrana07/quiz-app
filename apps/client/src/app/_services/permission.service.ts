/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  constructor(private authService: AuthenticationService) {}

  hasPermission(permissions: any, logicalOp = 'OR') {
    let userHasPermission = false;
    const user = this.authService.userData;
    if (user && user.permissions) {
      for (const permission of permissions) {
        const permissionFound = user.permissions.find(
          (x: string) => x.toUpperCase() === permission.toUpperCase()
        );
        if (permissionFound) {
          userHasPermission = true;
          if (logicalOp === 'OR') {
            break;
          }
        } else {
          userHasPermission = false;
          if (logicalOp === 'AND') {
            break;
          }
        }
      }
    }
    return userHasPermission;
  }
}
