/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { first } from 'rxjs';
import { UsersService } from '../users.service';
import { AlertService, LoaderService } from '../../../_services';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';

import { User } from '../../../_models';
import { RolesService } from '../../roles/roles.service';

@Component({
  selector: 'quiz-app-user-form',
  templateUrl: './user-form.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    PasswordModule,
    CheckboxModule,
    CommonModule,
  ],
  providers: [RolesService],
})
export class UserFormComponent implements OnInit {
  isSubmitted!: boolean;
  userForm: FormGroup | any;
  @Input() action!: string;
  @Input() selectedRow!: User;
  @Output() onAddUpdate: EventEmitter<any> = new EventEmitter();
  constructor(
    private fb: FormBuilder,
    private rolesService: RolesService,
    private usersService: UsersService,
    private loaderService: LoaderService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.getRoles();
    this.createUserForm();
    if (this.action == 'edit') {
      this.preSelect();
    }
  }
  getRoles() {
    this.loaderService.start();
    this.rolesService
      .getRoles()
      .pipe(first())
      .subscribe({
        next: (response: any) => {
          this.loaderService.stop();
          const selectedRoles = this.selectedRow?.roles?.map((x: any) => {
            return x.id;
          });
          const roles = response.map((x: any) => {
            return this.fb.group({
              id: x.id,
              label: x.name,
              isSelected: selectedRoles.includes(x.id),
            });
          });
          this.userForm.controls.roles = this.fb.array(roles);
        },
        error: (error: any) => {
          this.loaderService.stop();
          this.alertService.error(error);
        },
      });
  }
  preSelect() {
    this.userForm.patchValue({
      firstName: this.selectedRow.firstName,
      lastName: this.selectedRow.lastName,
      username: this.selectedRow.username,
      email: this.selectedRow.email,
    });
  }

  createUserForm() {
    /* const formObj: any = {
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
    };
    if (this.action == 'add') {
      formObj.password = new FormControl('', [Validators.required])
    } else {
      formObj.password = new FormControl('')
    }
    this.userForm = new FormGroup(formObj); */

    const formObj: any = {
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
    };
    if (this.action == 'add') {
      formObj.password = new FormControl('', [Validators.required]);
    } else {
      formObj.password = new FormControl('');
    }
    this.userForm = this.fb.group({
      ...formObj,
      roles: this.fb.array([]),
    });
  }

  get roles(): FormArray {
    return this.userForm.get('roles') as FormArray;
  }
  get formControls(): any {
    return this.userForm.controls;
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.userForm.invalid) {
      return;
    }
    const roles = this.formControls.roles.value
      .map((role: any) => {
        return role.isSelected ? role.id : null;
      })
      .filter((role: any) => {
        return role != null;
      });
    if (roles.length == 0) {
      this.alertService.error('Please select at least on role');
      return;
    }
    const data: any = {
      firstName: this.formControls.firstName.value,
      lastName: this.formControls.lastName.value,
      username: this.formControls.username.value,
      email: this.formControls.email.value,
      roles: roles,
    };
    if (this.action == 'add') {
      data.password = this.formControls.password.value;
      this.createUser(data);
    } else {
      this.updateUser(data);
    }
  }
  createUser(data: any) {
    this.loaderService.start();
    this.usersService.createUser(data).subscribe({
      next: (response: any) => {
        this.loaderService.stop();
        this.alertService.success(response['message']);
        const dataToEmit = response;
        dataToEmit.action = this.action;
        this.onAddUpdate.emit(dataToEmit);
      },
      error: (error: any) => {
        this.loaderService.stop();
        this.alertService.error(error);
      },
    });
  }
  updateUser(data: any) {
    this.loaderService.start();
    this.usersService.updateUser(this.selectedRow.id, data).subscribe({
      next: (response: any) => {
        this.loaderService.stop();
        this.alertService.success(response['message']);
        const dataToEmit = response;
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
