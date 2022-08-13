import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  constructor(private authService: AuthenticationService) { }

  hasPermission(permissions: any, logicalOp = 'OR') {
    let userHasPermission = false;
    const user = this.authService.userData;
    if (user && user.roles) {
      const assignedPermissions = this.getPermissions(user.roles);
      for (const permission of permissions) {
        const permissionFound = assignedPermissions.find(x => x.toUpperCase() === permission.toUpperCase());
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

  private getPermissions(roles: any) {
    const permissions = [];
    if (roles) {
      for (let i = 0; i < roles.length; i++) {
        const nPermissions = roles[i].permissions.length;
        for (let j = 0; j < nPermissions; j++) {
          permissions.push(roles[i].permissions[j]);
        }
      }
    }
    return permissions;
  }

  hasRole(roles: any, logicalOp = 'OR') {
    let userHasRole = false;
    const user = this.authService.userData;
    if (user && user.roles) {
      const assignedRoles = this.getRoles(user.roles);
      for (const role of roles) {
        const roleFound = assignedRoles.find(x => x.toUpperCase() === role.toUpperCase());
        if (roleFound) {
          userHasRole = true;
          if (logicalOp === 'OR') {
            break;
          }
        } else {
          userHasRole = false;
          if (logicalOp === 'AND') {
            break;
          }
        }
      }
    }
    return userHasRole;
  }
  private getRoles(roles: any) {
    const rolesArr = [];
    if (roles) {
      for (let i = 0; i < roles.length; i++) {
        rolesArr.push(roles[i]["role-name"]);
      }
    }
    return rolesArr;
  }
}
