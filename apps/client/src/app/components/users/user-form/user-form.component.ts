/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

import { UsersService } from '../users.service';
import { AlertService, LoaderService } from '../../../_services';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { User } from '../../../_models';

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
    DividerModule,
    CommonModule
  ]
})
export class UserFormComponent implements OnInit {
  isSubmitted!: boolean;
  userForm: FormGroup | any;;
  categories: any;
  @Input() action!: string;
  @Input() selectedRow!: User;
  @Output() onAddUpdate: EventEmitter<any> = new EventEmitter();
  constructor(
    private usersService: UsersService,
    private loaderService: LoaderService,
    private alertService: AlertService,
  ) {

  }

  ngOnInit(): void {
    this.createUserForm();
    if (this.action == 'edit') {
      this.preSelect();
    }
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
    const formObj: any = {
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
    this.userForm = new FormGroup(formObj);
  }
  get formControls(): any { return this.userForm.controls; }

  onSubmit() {
    this.isSubmitted = true;
    if (this.userForm.invalid) {
      return;
    }

    const data: any = {
      "firstName": this.formControls.firstName.value,
      "lastName": this.formControls.lastName.value,
      "username": this.formControls.username.value,
      "email": this.formControls.email.value
    }
    if (this.action == 'add') {
      data.password = this.formControls.password.value;
      this.createUser(data);
    } else {
      this.updateUser(data);
    }
  }
  createUser(data: any) {
    this.loaderService.start();
    this.usersService
      .createUser(data)
      .subscribe({
        next: (response: any) => {
          this.loaderService.stop();
          this.alertService.success(response["message"]);
          const dataToEmit = response;
          dataToEmit.action = this.action;
          this.onAddUpdate.emit(dataToEmit);
          /* const category = this.categories.find((item: any) => item.id == data.category);
          data.id = response?.data?.id;
          data.categoryId = category.id;
          data.categoryName = category.name; */
        },
        error: (error: any) => {
          this.loaderService.stop();
          this.alertService.error(error);
        }
      });
  }
  updateUser(data: any) {
    this.loaderService.start();
    this.usersService
      .updateUser(this.selectedRow.id, data)
      .subscribe({
        next: (response: any) => {
          this.loaderService.stop();
          this.alertService.success(response["message"]);
          const dataToEmit = response;
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
