import { TitleCasePipe } from '@angular/common';
import { Injectable } from '@angular/core';

import { Permission } from '../_models';
@Injectable()
export class ResourceService {
  constructor(private titlecasePipe: TitleCasePipe) {}

  getPermissions() {
    const modules = [
      'user',
      'role',
      'category',
      'quiz',
      'question',
      'dashboard',
      'widget',
    ];
    return this.generatePermissions(modules);
  }
  generatePermissions(modules: string[]) {
    let permissions: {
      key: string;
      label: string;
      children: Permission[];
    }[] = [];
    permissions = modules.map((module) => {
      return {
        key: module,
        label: this.titlecasePipe.transform(module) + ' Management',
        children: [
          {
            key: 'list_' + module,
            label: 'List ' + module,
            description: 'Required to list ' + module,
          },
          {
            key: 'create_' + module,
            label: 'Add ' + module,
            description: 'Required to create ' + module,
          },
          {
            key: 'update_' + module,
            label: 'Update ' + module,
            description: 'Required to update ' + module,
          },
          {
            key: 'delete_' + module,
            label: 'Delete ' + module,
            description: 'Required to delete ' + module,
          },
        ],
      };
    });
    permissions.unshift({
      key: 'setting',
      label: 'Settings',
      children: [
        {
          key: 'list_setting',
          label: 'List Setting',
          description: 'Required to list setting',
        },
        {
          key: 'update_setting',
          label: 'Update Setting',
          description: 'Required to update setting',
        },
      ],
    });
    permissions.unshift({
      key: 'admin',
      label: 'Admin',
      children: [
        {
          key: 'portal_access_admin',
          label: 'Admin Portal Access',
          description: 'Required to access admin portal',
        },
      ],
    });
    return permissions;
  }
}
