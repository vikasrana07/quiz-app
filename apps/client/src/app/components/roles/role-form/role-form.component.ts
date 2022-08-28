/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';

import { RolesService } from '../roles.service';
import { AlertService, LoaderService, ResourceService } from '../../../_services';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { Permission, Role } from '../../../_models';

@Component({
  selector: 'quiz-app-role-form',
  templateUrl: './role-form.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    CommonModule
  ],
  providers: [ResourceService]

})
export class RoleFormComponent implements OnInit {
  isSubmitted!: boolean;
  roleForm: FormGroup | any;;
  permissions: Permission[] = [];
  selectedRoles: string[] = [];
  @Input() action!: string;
  @Input() selectedRow!: Role;
  @Output() onAddUpdate: EventEmitter<any> = new EventEmitter();
  constructor(
    private fb: FormBuilder,
    private rolesService: RolesService,
    private resourceService: ResourceService,
    private loaderService: LoaderService,
    private alertService: AlertService,
  ) {
    this.permissions = this.resourceService.getPermissions();
  }

  ngOnInit(): void {
    this.createRoleForm();
  }
  createRoleForm() {
    let name = "";
    if (this.action == 'add') {
      this.selectedRoles = [];
    } else {
      name = this.selectedRow.name;
      this.selectedRoles = this.selectedRow?.resources;
    }
    const resources = this.permissions.map(x => {
      return this.fb.group({
        name: x.name,
        label: x.label,
        isSelected: this.selectedRoles.includes(x.name)
      });
    });


    this.roleForm = this.fb.group({
      name: new FormControl(name, [Validators.required]),
      resources: this.fb.array(resources)
    });
  }
  get resources(): FormArray { return this.roleForm.get("resources") as FormArray; }
  get formControls(): any { return this.roleForm.controls; }

  onSubmit() {
    this.isSubmitted = true;
    if (this.roleForm.invalid) {
      return;
    }
    const selectedPermissions = this.roleForm.value.resources
      .map((item: any, i: number) => { return item.isSelected ? this.permissions[i].name : null })
      .filter((item: any) => { return item !== null });

    const data: any = {
      "name": this.formControls.name.value,
      "resources": selectedPermissions
    }
    if (this.action == 'add') {
      this.createRole(data);
    } else {
      this.updateRole(data);
    }
  }
  createRole(data: any) {
    this.loaderService.start();
    this.rolesService
      .createRole(data)
      .subscribe({
        next: (response: any) => {
          this.loaderService.stop();
          this.alertService.success(response["message"]);
          const dataToEmit = response.data;
          dataToEmit.action = this.action;
          this.onAddUpdate.emit(dataToEmit);
        },
        error: (error: any) => {
          this.loaderService.stop();
          this.alertService.error(error);
        }
      });
  }
  updateRole(data: any) {
    this.loaderService.start();
    this.rolesService
      .updateRole(this.selectedRow.id, data)
      .subscribe({
        next: (response: any) => {
          this.loaderService.stop();
          this.alertService.success(response["message"]);
          const dataToEmit = response.data;
          dataToEmit.action = this.action;
          this.onAddUpdate.emit(dataToEmit);
        },
        error: (error: any) => {
          this.loaderService.stop();
          this.alertService.error(error);
        }
      });
  }
}
