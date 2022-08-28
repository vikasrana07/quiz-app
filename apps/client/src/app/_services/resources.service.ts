import { Permission } from "../_models";

export class ResourceService {
  getPermissions() {
    const modules = ['user', 'role', 'category', 'question'];
    return this.generatePermissions(modules);
  }
  generatePermissions(modules: string[]) {
    const permissions: Permission[] = [];
    permissions.push({
      name: 'admin_portal_access',
      label: 'Admin portal access'
    })
    const permissionsTemp = modules.map(module => {
      return [{
        name: 'list_' + module,
        label: 'List ' + module,
      },
      {
        name: 'create_' + module,
        label: 'Add ' + module,
      },
      {
        name: 'update_' + module,
        label: 'Update ' + module,
      },
      {
        name: 'delete_' + module,
        label: 'Delete ' + module,
      }];
    });
    permissionsTemp.forEach(outer => {
      outer.forEach(inner => {
        permissions.push(inner);
      });
    });
    return permissions;
  }

}
