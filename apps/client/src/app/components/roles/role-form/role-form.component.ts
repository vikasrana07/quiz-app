/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { TreeModule } from 'primeng/tree';
import { RolesService } from '../roles.service';
import {
  AlertService,
  LoaderService,
  ResourceService,
} from '../../../_services';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';

import { Permission, Role } from '../../../_models';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'quiz-app-role-form',
  templateUrl: './role-form.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    TooltipModule,
    TreeModule,
    CommonModule,
  ],
  providers: [ResourceService, TitleCasePipe],
})
export class RoleFormComponent implements OnInit {
  isSubmitted!: boolean;
  roleForm: FormGroup | any;
  permissions: {
    label: string;
    children: Permission[];
  }[] = [];
  selectedPermissions!: TreeNode[];
  @Input() action!: string;
  @Input() selectedRow!: Role;
  @Output() onAddUpdate: EventEmitter<any> = new EventEmitter();
  constructor(
    private fb: FormBuilder,
    private rolesService: RolesService,
    private resourceService: ResourceService,
    private loaderService: LoaderService,
    private alertService: AlertService
  ) {
    this.permissions = this.resourceService.getPermissions();
  }

  ngOnInit(): void {
    this.createRoleForm();
  }
  createRoleForm() {
    let name = '';
    if (this.action == 'add') {
      this.selectedPermissions = [];
    } else {
      this.selectedPermissions = [];
      name = this.selectedRow.name;
      const selectedPermissionsTemp = JSON.parse(
        JSON.stringify(this.selectedRow?.resources)
      ).split(',');

      const module = selectedPermissionsTemp.map((permission: any) => {
        return permission.split('_').pop();
      });
      const permissionCount: any = {};
      module.forEach((x: any) => {
        permissionCount[x] = (permissionCount[x] || 0) + 1;
      });
      this.selectedPermissions = selectedPermissionsTemp.map(
        (permission: any) => {
          return {
            key: permission,
            label: permission,
          };
        }
      );
      for (const key in permissionCount) {
        if (key == 'admin' || permissionCount[key] == 4) {
          this.selectedPermissions.push({
            key: key,
            label: key,
          });
        }
      }
    }
    this.roleForm = this.fb.group({
      name: new FormControl(name, [Validators.required]),
    });
  }
  get formControls(): any {
    return this.roleForm.controls;
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.roleForm.invalid) {
      return;
    }
    if (this.selectedPermissions.length == 0) {
      this.alertService.error('Please select at least one role');
      return;
    }
    const selectedPermissions = this.selectedPermissions
      .map((item: any) => {
        return item.key.includes('_') ? item.key : null;
      })
      .filter((item: any) => {
        return item !== null;
      });

    const data: any = {
      name: this.formControls.name.value,
      resources: selectedPermissions,
    };
    if (this.action == 'add') {
      this.createRole(data);
    } else {
      this.updateRole(data);
    }
  }
  createRole(data: any) {
    this.loaderService.start();
    this.rolesService.createRole(data).subscribe({
      next: (response: any) => {
        this.loaderService.stop();
        this.alertService.success(response['message']);
        const dataToEmit = response.data;
        dataToEmit.action = this.action;
        this.onAddUpdate.emit(dataToEmit);
      },
      error: (error: any) => {
        this.loaderService.stop();
        this.alertService.error(error);
      },
    });
  }
  updateRole(data: any) {
    this.loaderService.start();
    this.rolesService.updateRole(this.selectedRow.id, data).subscribe({
      next: (response: any) => {
        this.loaderService.stop();
        this.alertService.success(response['message']);
        const dataToEmit = response.data;
        dataToEmit.action = this.action;
        this.onAddUpdate.emit(dataToEmit);
      },
      error: (error: any) => {
        this.loaderService.stop();
        this.alertService.error(error);
      },
    });
  }
}
